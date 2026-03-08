"use client";

import { useState, useEffect } from "react";
import { AgentPayloadViewer } from "@/components/index";
import { getEntities, getContextPayload } from "@/lib/api/client";
import { Entity } from "@/lib/types";

export default function AgentViewPage() {
    const [entities, setEntities] = useState<Entity[]>([]);
    const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
    const [payload, setPayload] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getEntities().then(e => {
            setEntities(e);
            if (e.length > 0) setSelectedEntityId(e[0].id);
        });
    }, []);

    useEffect(() => {
        if (selectedEntityId) {
            setLoading(true);
            getContextPayload(selectedEntityId).then(p => {
                setPayload(p);
                setLoading(false);
            });
        }
    }, [selectedEntityId]);

    return (
        <div className="h-full flex flex-col md:flex-row bg-slate-50">
            <div className="w-full md:w-64 border-r border-slate-200 bg-white p-6 overflow-y-auto">
                <h2 className="text-sm font-semibold tracking-tight text-slate-900 mb-4 uppercase">Select Target Entity</h2>
                <div className="space-y-1">
                    {entities.map(e => (
                        <button
                            key={e.id}
                            onClick={() => setSelectedEntityId(e.id)}
                            className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium transition-colors ${selectedEntityId === e.id ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                }`}
                        >
                            <div className="truncate">{e.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{e.id}</div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 p-8 overflow-hidden flex flex-col">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Agent View Inspector</h1>
                    <p className="text-sm text-slate-500 mt-1 max-w-lg">
                        Simulate what an LLM or autonomous agent sees when it retrieves context for a specific entity. This JSON is deterministic and highly flattened to optimize limited context windows.
                    </p>
                </div>

                <div className="flex-1 overflow-auto rounded-xl shadow-xl border border-slate-200">
                    {loading || !payload ? (
                        <div className="w-full h-full flex items-center justify-center bg-white text-slate-400 text-sm font-mono animate-pulse">
                            Generating High-Density Payload...
                        </div>
                    ) : (
                        <AgentPayloadViewer payload={payload} className="w-full min-h-full rounded-none border-0" />
                    )}
                </div>
            </div>
        </div>
    );
}
