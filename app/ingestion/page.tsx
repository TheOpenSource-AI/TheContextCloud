import { IngestionWizard } from "@/components/organisms/IngestionWizard";

export default function IngestionPage() {
    return (
        <div className="min-h-full bg-slate-50 flex flex-col justify-center py-12">
            <div className="max-w-4xl mx-auto w-full px-6 mb-8 text-center space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Ingest Data Source</h1>
                <p className="text-slate-500 max-w-lg mx-auto">
                    Map your disparate CSVs or databases directly into the unified Context Graph ontology.
                </p>
            </div>
            <IngestionWizard />
        </div>
    );
}
