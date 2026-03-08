'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <html>
            <body>
                <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50 text-slate-900">
                    <div className="flex max-w-md flex-col items-center text-center space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-50 text-red-500 mb-2">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold tracking-tight">System Exception</h2>
                            <p className="text-sm text-slate-500">
                                A critical error occurred while rendering the Context Cloud application layer.
                            </p>
                        </div>
                        {error.message && (
                            <div className="w-full p-4 bg-slate-50 rounded-lg border border-slate-100 mt-2 text-left">
                                <p className="text-xs font-mono text-slate-600 truncate break-all">
                                    {error.message}
                                </p>
                            </div>
                        )}
                        <div className="pt-4 w-full flex gap-3">
                            <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
                                Reload Page
                            </Button>
                            <Button onClick={() => reset()} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                                Attempt Recovery
                            </Button>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
