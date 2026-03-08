"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";
import { Search, Sparkles, Building2, CarFront, FileText, Database } from "lucide-react";
import { MOCK_ENTITIES } from "@/lib/mock-data/insurance-seed";

export function UniversalSearch() {
    const [open, setOpen] = React.useState(false);
    const router = useRouter();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false);
        command();
    }, []);

    // Filter top entities for quick access
    const topEntities = MOCK_ENTITIES.slice(0, 5);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'customer': return <Building2 className="mr-2 h-4 w-4" />;
            case 'policy': return <FileText className="mr-2 h-4 w-4" />;
            case 'claim': return <CarFront className="mr-2 h-4 w-4" />;
            default: return <Database className="mr-2 h-4 w-4" />;
        }
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center justify-between w-64 px-3 py-1.5 text-sm font-medium transition-colors bg-white border rounded-full border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
                <div className="flex items-center">
                    <Search className="w-4 h-4 mr-2 text-slate-400" />
                    <span>Search context...</span>
                </div>
                <kbd className="inline-flex items-center h-5 px-1.5 font-mono text-[10px] font-medium border rounded pointer-events-none border-slate-200 bg-slate-50 text-slate-500">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command, search entities, or ask a question..." />
                <CommandList className="custom-scrollbar">
                    <CommandEmpty>No context found. Try a different query.</CommandEmpty>

                    <CommandGroup heading="Natural Language Routes (AI Mock)">
                        <CommandItem disabled className="opacity-70">
                            <Sparkles className="mr-2 h-4 w-4 text-teal-600" />
                            <span className="text-slate-700 italic">"Show all high-risk suppliers linked to Claim 102"</span>
                            <CommandShortcut>↵</CommandShortcut>
                        </CommandItem>
                        <CommandItem disabled className="opacity-70">
                            <Sparkles className="mr-2 h-4 w-4 text-teal-600" />
                            <span className="text-slate-700 italic">"Find policy active for Customer 103"</span>
                        </CommandItem>
                    </CommandGroup>

                    <CommandSeparator />

                    <CommandGroup heading="Recent Entities">
                        {topEntities.map(entity => (
                            <CommandItem
                                key={entity.id}
                                onSelect={() => runCommand(() => router.push(`/explorer?entityId=${entity.id}`))}
                            >
                                {getTypeIcon(entity.type)}
                                <span>{entity.name}</span>
                                <span className="ml-2 text-xs text-slate-500">({entity.id})</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>

                    <CommandSeparator />

                    <CommandGroup heading="Quick Actions">
                        <CommandItem onSelect={() => runCommand(() => router.push('/ingestion'))}>
                            <Database className="mr-2 h-4 w-4 text-slate-400" />
                            <span>Ingest New Data Source</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/api-docs'))}>
                            <FileText className="mr-2 h-4 w-4 text-slate-400" />
                            <span>View Agent API Docs</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
