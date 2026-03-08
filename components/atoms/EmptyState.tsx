import { ReactNode } from "react";
import { SearchX, FolderSearch, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: "search" | "folder" | "alert";
    action?: ReactNode;
    className?: string;
    compact?: boolean;
}

/**
 * SOTA Empty State defensive rendering component.
 */
export function EmptyState({ title, description, icon = "folder", action, className, compact = false }: EmptyStateProps) {
    const IconProps = {
        className: cn("text-slate-400", compact ? "w-6 h-6" : "w-10 h-10")
    };

    const renderIcon = () => {
        switch (icon) {
            case "search": return <SearchX {...IconProps} />;
            case "alert": return <AlertCircle {...IconProps} />;
            case "folder":
            default: return <FolderSearch {...IconProps} />;
        }
    };

    return (
        <div className={cn(
            "flex flex-col items-center justify-center w-full rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center",
            compact ? "p-6" : "p-12 min-h-[300px]",
            className
        )}>
            <div className={cn(
                "flex items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100 mb-4",
                compact ? "w-12 h-12" : "w-16 h-16"
            )}>
                {renderIcon()}
            </div>
            <h3 className={cn("font-medium text-slate-900", compact ? "text-sm" : "text-lg")}>
                {title}
            </h3>
            <p className={cn("text-slate-500 mt-1 max-w-[300px]", compact ? "text-xs mt-0.5" : "text-sm mt-2")}>
                {description}
            </p>
            {action && (
                <div className="mt-6">
                    {action}
                </div>
            )}
        </div>
    );
}
