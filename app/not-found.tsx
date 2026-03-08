import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SearchX } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center p-6 bg-slate-50">
            <div className="flex max-w-md flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-400 border border-slate-200 shadow-sm mb-4">
                    <SearchX className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Context Not Found</h2>
                    <p className="text-sm text-slate-500 max-w-[280px] mx-auto">
                        The entity, relationship, or layout you are looking for does not exist in the current workspace.
                    </p>
                </div>
                <div className="pt-4">
                    <Link href="/">
                        <Button variant="outline" className="h-10 px-8 text-slate-600 group">
                            Return to Platform Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
