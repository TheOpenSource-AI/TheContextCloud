"use client";

import { AgentContextPayload } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AgentPayloadViewerProps {
    payload: AgentContextPayload;
    className?: string;
}

export function AgentPayloadViewer({ payload, className }: AgentPayloadViewerProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={cn("relative flex flex-col rounded-xl overflow-hidden border border-slate-200 bg-[#fafafa]", className)}>
            <div className="flex items-center justify-between px-4 py-2 bg-slate-100 border-b border-slate-200">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                        Agent Context Payload
                    </div>
                    {payload.metadata.piiRedacted && (
                        <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            PII Redacted
                        </span>
                    )}
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-slate-500 hover:text-slate-900"
                    onClick={handleCopy}
                >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span className="ml-1.5 text-xs">{copied ? "Copied" : "Copy JSON"}</span>
                </Button>
            </div>
            <div className="p-4 overflow-auto max-h-[600px] text-xs font-mono text-slate-700 leading-relaxed custom-scrollbar">
                <motion.pre
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="m-0"
                >
                    <code>
                        {JSON.stringify(payload, null, 2)}
                    </code>
                </motion.pre>
            </div>
        </div>
    );
}
