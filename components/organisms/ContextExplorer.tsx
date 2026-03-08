"use client";

import { useState, useCallback, useEffect } from "react";
import {
    ReactFlow,
    Background,
    Controls,
    Node,
    Edge,
    useNodesState,
    useEdgesState,
    MarkerType
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Entity, Relationship } from "@/lib/types";
import { getEntities, getRelationships } from "@/lib/api/client";
import { EmptyState } from "@/components/atoms/EmptyState";
import { SkeletonCard } from "@/components/atoms/SkeletonLoaders";
import { ErrorBoundary } from "react-error-boundary";
import { Building2, FileText, CarFront, Database, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

const NODE_TYPES = {
    customer: Building2,
    policy: FileText,
    claim: CarFront,
    supplier: Database,
    transaction: FileText,
    product: Database
};

// Custom Node Component to strictly follow SOTA guidelines
function EntityNode({ data }: { data: any }) {
    const Icon = NODE_TYPES[data.type as keyof typeof NODE_TYPES] || Database;
    return (
        <div className="px-4 py-2 shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-full bg-white border border-slate-200 flex items-center gap-3 transition-transform hover:scale-105 hover:border-teal-400">
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                <Icon className="w-4 h-4 text-slate-500" />
            </div>
            <div>
                <div className="text-sm font-medium text-slate-900 leading-none">{data.name}</div>
                <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1">{data.type}</div>
            </div>
        </div>
    );
}

const nodeTypes = {
    entity: EntityNode,
};

function ExplorerCanvas() {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchGraph() {
            try {
                const ent = await getEntities();
                const rel = await getRelationships();

                // Very basic layout since dagre requires extra setup
                // We arrange nodes in a circle for the MVP representation
                const newNodes: Node[] = ent.map((e, index) => {
                    const angle = (index / ent.length) * 2 * Math.PI;
                    const radius = 300;
                    return {
                        id: e.id,
                        type: 'entity',
                        position: { x: Math.cos(angle) * radius + 400, y: Math.sin(angle) * radius + 300 },
                        data: { label: e.name, type: e.type, name: e.name }
                    };
                });

                const newEdges: Edge[] = rel.map(r => ({
                    id: r.id,
                    source: r.sourceId,
                    target: r.targetId,
                    label: r.type,
                    type: 'smoothstep',
                    animated: r.confidenceScore < 0.8, // Animate low confidence lines to indicate AI inference
                    style: { stroke: r.confidenceScore < 0.8 ? '#f59e0b' : '#94a3b8', strokeWidth: 1.5 },
                    labelStyle: { fill: '#64748b', fontSize: 10, fontWeight: 500 },
                    labelBgStyle: { fill: '#ffffff', fillOpacity: 0.8 },
                    markerEnd: { type: MarkerType.ArrowClosed, color: r.confidenceScore < 0.8 ? '#f59e0b' : '#94a3b8' }
                }));

                // Limit to MAX 100 nodes for fail-safe
                setNodes(newNodes.slice(0, 100));
                setEdges(newEdges);
            } catch (error) {
                throw new Error("Failed to load graph cluster.");
            } finally {
                setLoading(false);
            }
        }
        fetchGraph();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center p-12">
                <SkeletonCard className="w-96 h-96 rounded-[3rem]" />
            </div>
        );
    }

    if (nodes.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <EmptyState title="No Context Data" description="Upload a CSV or connect a database." />
            </div>
        );
    }

    return (
        <div className="w-full h-full relative font-sans">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                className="bg-slate-50/50"
            >
                <Background color="#cbd5e1" gap={24} size={1.5} />
                <Controls showInteractive={false} className="bg-white border-slate-200 fill-slate-500 shadow-sm" />
            </ReactFlow>
            <div className="absolute top-4 left-4 z-10">
                <div className="px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-medium text-slate-600 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live Context Graph
                </div>
            </div>
        </div>
    );
}

function ErrorFallback({ error }: { error: any }) {
    return (
        <div className="w-full h-full flex items-center justify-center p-8 bg-slate-50">
            <Card className="max-w-md p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 border border-red-100 shadow-sm">
                    <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Graph Visualization Error</h3>
                <p className="text-sm text-slate-500 mb-6">
                    The React Flow engine encountered a circular dependency or exceeded the node rendering limit.
                </p>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-left w-full overflow-hidden text-xs font-mono text-slate-600 break-words mb-6">
                    {error.message}
                </div>
                <button onClick={() => window.location.reload()} className="h-10 px-6 rounded-md bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors w-full">
                    Reload Workspace
                </button>
            </Card>
        </div>
    );
}

export function ContextExplorer() {
    return (
        <div className="w-full h-[calc(100vh-4rem)] flex">
            {/* Left Sidebar Filters */}
            <div className="w-64 border-r border-slate-200 bg-white/50 p-6 flex flex-col gap-6 shrink-0">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3 tracking-tight">Active Filters</h3>
                    <div className="p-3 rounded-lg border border-slate-200 bg-white shadow-sm text-xs text-slate-500 flex justify-between items-center group cursor-pointer hover:border-slate-300">
                        <span>Entity Type: All</span>
                        <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">×</div>
                    </div>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3 tracking-tight">Node Limits</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>Depth Cap</span>
                            <span className="font-mono bg-slate-100 px-1 rounded">2</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>Max Nodes</span>
                            <span className="font-mono bg-slate-100 px-1 rounded">100</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Resilient Graph Area */}
            <div className="flex-1 h-full bg-slate-50/50 relative">
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <ExplorerCanvas />
                </ErrorBoundary>
            </div>
        </div>
    );
}
