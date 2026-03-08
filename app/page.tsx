import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Database, Network, Key, Boxes, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getEntities, getRelationships, getEvents } from "@/lib/api/client";
import { MOCK_SOURCES } from "@/lib/mock-data/insurance-seed";

export default async function Home() {
  const [entities, relationships, events] = await Promise.all([
    getEntities(),
    getRelationships(),
    getEvents(),
  ]);

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12">
      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row items-center justify-between overflow-hidden rounded-3xl bg-slate-900 text-white p-10 shadow-lg border border-slate-800">
        <div className="absolute inset-0 bg-[url('/grid-dark.svg')] opacity-20 pointer-events-none" />
        <div className="relative z-10 max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium tracking-tight">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            Context Engine v1.0.0-MVP is active
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.1]">
            Your business context, ready for agents.
          </h1>
          <p className="text-slate-400 text-lg max-w-lg leading-relaxed">
            Transform fragmented databases and operational systems into a deterministic, agent-ready knowledge graph.
          </p>
          <div className="flex items-center gap-4 pt-4">
            <Link href="/ingestion">
              <Button className="bg-teal-500 hover:bg-teal-600 text-white border-0 shadow-lg shadow-teal-500/20 px-6 h-12">
                Ingest Data Source
              </Button>
            </Link>
            <Link href="/explorer">
              <Button variant="outline" className="h-12 px-6 border-slate-700 bg-slate-800/50 hover:bg-slate-700 hover:text-white text-slate-300">
                Explore Workspace
              </Button>
            </Link>
          </div>
        </div>

        {/* Abstract Hero Visual */}
        <div className="hidden md:flex relative w-80 h-80 items-center justify-center">
          <div className="absolute inset-0 bg-teal-500/10 rounded-full blur-3xl mix-blend-screen" />
          <div className="relative z-10 w-full h-full border border-slate-800/50 rounded-full flex items-center justify-center border-dashed animate-[spin_60s_linear_infinite]">
            <div className="w-48 h-48 border border-slate-700 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
          </div>
          <Network className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-teal-400 opacity-80" />
        </div>
      </section>

      {/* Metrics Array */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Entities", value: entities.length, icon: Boxes, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Relationships", value: relationships.length, icon: Network, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Events Logged", value: events.length, icon: Database, color: "text-teal-600", bg: "bg-teal-50" },
          { label: "Connected Sources", value: Object.keys(MOCK_SOURCES).length, icon: Key, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((metric) => (
          <Card key={metric.label} className="p-6 flex flex-col justify-between group hover:border-slate-300 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-xl ${metric.bg} ${metric.color} flex items-center justify-center`}>
                <metric.icon className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>
            <div>
              <div className="text-3xl font-semibold text-slate-900 tracking-tight">{metric.value}</div>
              <div className="text-sm font-medium text-slate-500 mt-1">{metric.label}</div>
            </div>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4 tracking-tight">Agent Endpoint Access</h3>
          <p className="text-sm text-slate-500 mb-6">
            Provide deterministically structured JSON context directly to LangChain, LlamaIndex, or OpenAI Custom Functions.
          </p>
          <div className="bg-slate-900 rounded-xl p-4 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />
            <pre className="text-xs font-mono text-teal-400">
              <span className="text-slate-500">GET</span> /api/v1/context?entityId=e-cust-102
            </pre>
            <div className="mt-4 flex justify-end">
              <Link href="/api-docs">
                <Button variant="link" className="text-teal-400 hover:text-teal-300 px-0 h-auto font-mono text-xs">
                  View full documentation <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <Card className="p-6 flex flex-col">
          <h3 className="font-semibold text-slate-900 mb-4 tracking-tight">Recent Ingestion Jobs</h3>
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-700">legacy_claims_Q3.csv</span>
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Completed</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-700">salesforce_sync_01</span>
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Completed</span>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
