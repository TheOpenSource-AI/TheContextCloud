"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Database, FileText, CheckCircle2, ChevronRight, UploadCloud, BrainCircuit, Network } from "lucide-react";

export function IngestionWizard() {
    const [step, setStep] = useState(1);
    const [processingStage, setProcessingStage] = useState(0);

    // Simulate AI Magic during Step 3
    useEffect(() => {
        if (step === 3) {
            const timers = [
                setTimeout(() => setProcessingStage(1), 800),  // Parsing schema
                setTimeout(() => setProcessingStage(2), 2300), // Running NER models
                setTimeout(() => setProcessingStage(3), 3500), // Linking relationships
                setTimeout(() => setStep(4), 4500),            // Move to Review
            ];
            return () => timers.forEach(clearTimeout);
        }
    }, [step]);

    return (
        <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
            {/* Breadcrumb Steps */}
            <div className="flex items-center justify-between px-12 mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${step >= i ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"
                            }`}>
                            {i}
                        </div>
                        <span className={`text-xs mt-2 ${step >= i ? "text-slate-900 font-medium" : "text-slate-400"}`}>
                            {i === 1 ? "Source" : i === 2 ? "Mapping" : i === 3 ? "Extraction" : "Review"}
                        </span>
                    </div>
                ))}
                {/* Connecting Lines */}
                <div className="absolute left-0 top-4 w-full h-px bg-slate-200 -z-10" style={{ clipPath: "inset(0 15% 0 15%)" }} />
            </div>

            <AnimatePresence mode="wait">
                {/* STEP 1: Choose Source */}
                {step === 1 && (
                    <motion.div key="1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h2 className="text-2xl font-semibold mb-6 tracking-tight">Select Data Source</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <Card className="p-6 cursor-pointer hover:border-slate-400 hover:shadow-sm transition-all border-teal-500 bg-teal-50/10" onClick={() => setStep(2)}>
                                <FileText className="w-8 h-8 text-slate-700 mb-4" />
                                <h3 className="font-medium text-slate-900">Upload CSV</h3>
                                <p className="text-sm text-slate-500 mt-1">Map legacy flat files to the Context Graph.</p>
                            </Card>
                            <Card className="p-6 cursor-pointer hover:border-slate-400 hover:shadow-sm transition-all opacity-50">
                                <Database className="w-8 h-8 text-slate-700 mb-4" />
                                <h3 className="font-medium flex items-center gap-2 text-slate-900">
                                    Connect Database <span className="text-[10px] bg-slate-100 px-2 py-0.5 border border-slate-200 rounded-md">Coming Soon</span>
                                </h3>
                                <p className="text-sm text-slate-500 mt-1">Connect directly to core SQL systems.</p>
                            </Card>
                        </div>
                    </motion.div>
                )}

                {/* STEP 2: Mapping Mock */}
                {step === 2 && (
                    <motion.div key="2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h2 className="text-2xl font-semibold mb-6 tracking-tight">Map Schema</h2>
                        <Card className="p-8 border-dashed flex flex-col items-center text-center space-y-4 bg-slate-50/50">
                            <UploadCloud className="w-12 h-12 text-slate-400" />
                            <div>
                                <h3 className="font-medium text-slate-900 text-lg">insurance_claims_export_Q3.csv</h3>
                                <p className="text-sm text-slate-500 mt-1">45 columns detected. Ready for AI column-mapping.</p>
                            </div>
                            <div className="pt-4">
                                <Button onClick={() => setStep(3)} className="bg-slate-900 text-white group">
                                    <BrainCircuit className="w-4 h-4 mr-2 group-hover:animate-pulse text-teal-400" />
                                    Auto-Map via AI
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* STEP 3: Choreographed AI Magic */}
                {step === 3 && (
                    <motion.div key="3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-20 flex flex-col items-center justify-center">
                        <div className="relative mb-8">
                            <div className="w-16 h-16 border-4 border-slate-100 border-t-teal-500 rounded-full animate-spin" />
                            <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-teal-600 animate-pulse" />
                        </div>

                        <div className="space-y-4 w-64">
                            <ProcessingStep text="Reading CSV structure..." active={processingStage >= 0} done={processingStage >= 1} />
                            <ProcessingStep text="Running Entity NER models..." active={processingStage >= 1} done={processingStage >= 2} />
                            <ProcessingStep text="Inferring relationships..." active={processingStage >= 2} done={processingStage >= 3} />
                        </div>
                    </motion.div>
                )}

                {/* STEP 4: Review Results */}
                {step === 4 && (
                    <motion.div key="4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-semibold tracking-tight">Context Graph Generated</h2>
                            <p className="text-slate-500 mt-2">The data has been successfully mapped to the universal ontology.</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <Card className="p-4 text-center">
                                <div className="text-3xl font-light text-slate-900">120</div>
                                <div className="text-sm font-medium text-slate-500 mt-1">Entities Created</div>
                            </Card>
                            <Card className="p-4 text-center">
                                <div className="text-3xl font-light text-slate-900">452</div>
                                <div className="text-sm font-medium text-slate-500 mt-1">Relationships</div>
                            </Card>
                            <Card className="p-4 text-center">
                                <div className="text-3xl font-light text-emerald-600">0.89</div>
                                <div className="text-sm font-medium text-slate-500 mt-1">Avg Confidence</div>
                            </Card>
                        </div>

                        <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">
                            <Button variant="outline" onClick={() => setStep(1)}>Start Over</Button>
                            <Button className="bg-teal-600 hover:bg-teal-700 text-white">Publish to Workspace</Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ProcessingStep({ text, active, done }: { text: string; active: boolean; done: boolean }) {
    return (
        <div className={`flex items-center gap-3 transition-opacity duration-500 ${active ? "opacity-100" : "opacity-30"}`}>
            {done ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : active ? (
                <Network className="w-5 h-5 text-teal-500 animate-pulse" />
            ) : (
                <div className="w-5 h-5 border-2 border-slate-200 rounded-full" />
            )}
            <span className={`text-sm tracking-tight ${done ? "text-slate-500" : active ? "text-slate-900 font-medium" : "text-slate-400"}`}>
                {text}
            </span>
        </div>
    );
}
