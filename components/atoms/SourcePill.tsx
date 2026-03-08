import { Database, FileText, Globe, Key, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { SourceSystem } from "@/lib/types";

interface SourcePillProps {
    source: SourceSystem;
    className?: string;
}

const getSourceIcon = (type: SourceSystem['type']) => {
    switch (type) {
        case 'database': return Database;
        case 'csv': return FileText;
        case 'api': return Globe;
        case 'document': return FileText;
        case 'manual': return User;
        default: return Key;
    }
};

/**
 * Source Lineage Pill
 * Proves the provenance of data for enterprise auditability.
 */
export function SourcePill({ source, className }: SourcePillProps) {
    const Icon = getSourceIcon(source.type);

    return (
        <div className={cn(
            "inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] text-xs font-medium text-slate-700 whitespace-nowrap hover:bg-slate-50 transition-colors cursor-help group",
            className
        )}>
            <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
            <span className="truncate max-w-[120px]">{source.name}</span>
        </div>
    );
}
