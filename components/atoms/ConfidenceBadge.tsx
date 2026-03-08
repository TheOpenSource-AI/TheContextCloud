import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, XOctagon } from "lucide-react";

interface ConfidenceBadgeProps {
    score: number; // 0.0 to 1.0
    className?: string;
    showIcon?: boolean;
}

/**
 * Renders a strict enterprise confidence badge assessing AI inference quality.
 * > 0.85: Green
 * 0.60 - 0.85: Yellow/Orange
 * < 0.60: Red
 */
export function ConfidenceBadge({ score, className, showIcon = true }: ConfidenceBadgeProps) {
    const percentage = Math.round(score * 100);

    let variantClass = "";
    let Icon = CheckCircle2;

    if (score >= 0.85) {
        variantClass = "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200";
        Icon = CheckCircle2;
    } else if (score >= 0.60) {
        variantClass = "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200";
        Icon = AlertTriangle;
    } else {
        variantClass = "bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200";
        Icon = XOctagon;
    }

    return (
        <Badge
            variant="outline"
            className={cn("px-2 py-0.5 text-xs font-semibold tracking-tight shadow-sm transition-colors", variantClass, className)}
        >
            {showIcon && <Icon className="w-3 h-3 mr-1.5" />}
            {percentage}% Confidence
        </Badge>
    );
}
