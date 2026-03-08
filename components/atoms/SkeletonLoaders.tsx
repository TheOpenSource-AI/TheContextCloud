import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function SkeletonCard({ className }: { className?: string }) {
    return (
        <div className={cn("flex flex-col space-y-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm", className)}>
            <Skeleton className="h-32 w-full rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-full max-w-[250px]" />
                        <Skeleton className="h-4 w-full max-w-[200px]" />
                    </div>
                </div>
            ))}
        </div>
    );
}

/**
 * Animated processing state used during the "Magic" Extraction flow
 */
export function AIProcessingState({ text = "Processing..." }: { text?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-12 text-center"
        >
            <div className="relative flex items-center justify-center mb-6">
                <div className="absolute w-12 h-12 border-2 border-teal-100 rounded-full animate-ping" />
                <div className="w-6 h-6 bg-teal-500 rounded-full shadow-lg shadow-teal-500/20" />
            </div>
            <motion.p
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-sm font-medium text-slate-600 tracking-wide"
            >
                {text}
            </motion.p>
        </motion.div>
    );
}
