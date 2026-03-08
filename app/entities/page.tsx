import { getEntities } from "@/lib/api/client";
import { Card } from "@/components/ui/card";
import { PIIMaskedBadge, SourcePill, ConfidenceBadge, AgentPayloadViewer } from "@/components/index";

export default async function EntitiesPage() {
    const entities = await getEntities();

    return (
        <div className="max-w-6xl mx-auto p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Entities List</h1>
                <p className="text-slate-500 mt-2 text-sm">Deterministic registry of all ingested business nodes.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {entities.map(entity => (
                    <Card key={entity.id} className="p-4 flex items-center justify-between hover:border-teal-200 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-mono text-[10px] text-slate-400 uppercase">
                                {entity.type.substring(0, 3)}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-medium text-slate-900">{entity.name}</h3>
                                    <PIIMaskedBadge isMasked={entity.piiMasked ?? false} />
                                </div>
                                <div className="text-xs text-slate-500 mt-1 font-mono">{entity.id}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex flex-col items-end gap-1">
                                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Provenance</span>
                                <div className="flex gap-1">
                                    {entity.sourceSystems.map(s => <SourcePill key={s.id} source={s} />)}
                                </div>
                            </div>
                            <div className="w-px h-8 bg-slate-200" />
                            <div className="flex flex-col items-end gap-1">
                                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">AI Confidence</span>
                                <ConfidenceBadge score={entity.confidenceScore} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
