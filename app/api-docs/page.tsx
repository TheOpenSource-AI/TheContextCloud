"use client";

import { useState, useEffect } from "react";
import { Copy, Terminal, Code2, Network } from "lucide-react";
import { AgentPayloadViewer } from "@/components/molecules/AgentPayloadViewer";
import { getContextPayload } from "@/lib/api/client";

export default function ApiDocsPage() {
    const [activeTab, setActiveTab] = useState<"curl" | "python" | "typescript">("python");
    const [mockPayload, setMockPayload] = useState<any>(null);

    useEffect(() => {
        getContextPayload("e-cust-102").then(p => setMockPayload(p));
    }, []);

    return (
        <div className="h-full flex flex-col md:flex-row bg-white">
            {/* Left Documentation Panel */}
            <div className="w-full md:w-[45%] lg:w-[40%] xl:w-1/3 border-r border-slate-200 overflow-y-auto custom-scrollbar p-8">
                <div className="mb-12">
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-4">Context APIs</h1>
                    <p className="text-slate-500 leading-relaxed mb-6">
                        The Context Cloud API provides deterministic, LLM-optimized payloads describing entities and their relational sub-graphs.
                    </p>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-600 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
                        <Network className="w-4 h-4 text-teal-600" />
                        api.contextcloud.so/v1
                    </div>
                </div>

                <div className="space-y-12">
                    {/* Endpoint 1 */}
                    <section>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="bg-teal-100 text-teal-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">GET</span>
                            <h2 className="text-lg font-medium text-slate-900">Retrieve Context Payload</h2>
                        </div>
                        <p className="text-sm text-slate-500 mb-4">
                            Returns the flattened JSON context window representing a single entity and its relationships.
                        </p>
                        <div className="bg-slate-50 rounded border border-slate-200 p-3 mb-4">
                            <span className="text-slate-400 font-mono text-xs">/context/</span>
                            <span className="text-teal-600 font-mono text-xs font-medium">&#123;entityId&#125;</span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-2">Request Parameters</h4>
                        <div className="text-sm space-y-3">
                            <div className="flex justify-between border-b border-slate-100 pb-2">
                                <span className="font-mono text-slate-700">entityId</span>
                                <span className="text-slate-500">string (required)</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Right Interactive Code Panel */}
            <div className="flex-1 bg-slate-950 flex flex-col min-h-[500px]">
                {/* Code Tabs */}
                <div className="flex items-center gap-1 border-b border-slate-800 bg-slate-900/50 p-2 overflow-x-auto">
                    {[
                        { id: "python", label: "Python SDK", icon: Code2 },
                        { id: "typescript", label: "TypeScript SDK", icon: Code2 },
                        { id: "curl", label: "cURL", icon: Terminal }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-colors ${activeTab === tab.id ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                                }`}
                        >
                            <tab.icon className="w-3.5 h-3.5" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Code Request Area */}
                <div className="p-6">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-3 uppercase tracking-wider font-semibold">
                        <span>Request</span>
                        <button className="hover:text-white transition-colors"><Copy className="w-3.5 h-3.5" /></button>
                    </div>
                    <pre className="font-mono text-sm leading-relaxed text-slate-300 mb-8 overflow-x-auto custom-scrollbar">
                        {activeTab === "python" && (
                            `from contextcloud import Client

cc = Client(api_key="sk_live_...1234")

# Load context optimized for LangChain/OpenAI
payload = cc.context.retrieve("e-cust-102")

print(payload.model_dump_json())`
                        )}
                        {activeTab === "typescript" && (
                            `import { ContextCloud } from "@contextcloud/sdk";

const cc = new ContextCloud({ apiKey: process.env.CC_API_KEY });

// Retrieves flattened context graph automatically
const payload = await cc.context.retrieve("e-cust-102");

console.log(payload);`
                        )}
                        {activeTab === "curl" && (
                            `curl -X GET "https://api.contextcloud.so/v1/context/e-cust-102" \\
  -H "Authorization: Bearer sk_live_...1234" \\
  -H "Content-Type: application/json"`
                        )}
                    </pre>

                    <div className="flex items-center justify-between text-xs text-slate-400 mb-3 uppercase tracking-wider font-semibold">
                        <span>Response &nbsp;<span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded">200 OK</span></span>
                    </div>

                    <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-2xl relative">
                        {mockPayload ? (
                            <div className="max-h-[400px] overflow-auto custom-scrollbar p-4 text-xs font-mono text-teal-300/80">
                                {JSON.stringify(mockPayload, null, 2)}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-600 text-xs font-mono">Simulating Backend...</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
