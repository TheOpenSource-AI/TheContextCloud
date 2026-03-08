"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Cloud, Search, Network, Box, Link2, Clock, Database, Code2, Bot } from "lucide-react";

const NAV_ITEMS = [
    { name: "Home", href: "/", icon: Cloud },
    { name: "Context Explorer", href: "/explorer", icon: Search },
    { name: "Entities", href: "/entities", icon: Box },
    { name: "Relationships", href: "/relationships", icon: Link2 },
    { name: "Timelines", href: "/timelines", icon: Clock },
    { name: "Ingestion Wizard", href: "/ingestion", icon: Database },
    { name: "API / SDK", href: "/api-docs", icon: Code2 },
    { name: "Agent View", href: "/agent-view", icon: Bot },
];

export function SidebarLayout() {
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r border-slate-200 bg-white flex flex-col shrink-0">
            <div className="h-16 flex items-center px-6 border-b border-slate-200 shrink-0 select-none">
                <div className="w-6 h-6 rounded bg-teal-600 mr-3 flex items-center justify-center shadow-sm">
                    <Network className="w-3.5 h-3.5 text-white" />
                </div>
                <h1 className="font-semibold tracking-tight text-slate-900">Context Cloud</h1>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                <div className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Main</div>
                {NAV_ITEMS.slice(0, 5).map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.name} href={item.href}>
                            <div className={cn(
                                "flex items-center px-3 py-2 rounded-lg text-sm transition-colors group",
                                isActive ? "bg-slate-100 text-slate-900 font-medium" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                            )}>
                                <item.icon className={cn("w-4 h-4 mr-3", isActive ? "text-teal-600" : "text-slate-400 group-hover:text-slate-500")} />
                                {item.name}
                            </div>
                        </Link>
                    );
                })}

                <div className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mt-8 mb-2">Platform</div>
                {NAV_ITEMS.slice(5).map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.name} href={item.href}>
                            <div className={cn(
                                "flex items-center px-3 py-2 rounded-lg text-sm transition-colors group",
                                isActive ? "bg-slate-100 text-slate-900 font-medium" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                            )}>
                                <item.icon className={cn("w-4 h-4 mr-3", isActive ? "text-teal-600" : "text-slate-400 group-hover:text-slate-500")} />
                                {item.name}
                            </div>
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-2">
                    <span>v1.0.0-MVP</span>
                    <span className="text-teal-600">Enterprise Edition</span>
                </div>
            </div>
        </aside>
    );
}
