import { Shield, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface PIIMaskedBadgeProps {
    isMasked: boolean;
    className?: string;
}

export function PIIMaskedBadge({ isMasked, className }: PIIMaskedBadgeProps) {
    if (isMasked) {
        return (
            <div className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-xs font-medium tracking-tight whitespace-nowrap", className)}>
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <span>PII Auto-Redacted</span>
            </div>
        );
    }

    // Not masked - high visibility governance warning
    return (
        <div className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-medium tracking-tight whitespace-nowrap", className)}>
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Contains Raw PII</span>
        </div>
    );
}
