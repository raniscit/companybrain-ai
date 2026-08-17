"use client";

import { FormEvent, useEffect, useState } from "react";

type Source = {
    content: string;
    [key: string]: unknown;
};

export default function KnowledgeUI() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState("");
    const [uploadError, setUploadError] = useState("");

    const [query, setQuery] = useState("");
    const [answer, setAnswer] = useState("");
    const [sources, setSources] = useState<Source[]>([]);
    const [loading, setLoading] = useState(false);
    const [queryError, setQueryError] = useState("");


    useEffect(() => {
        if (!uploadMessage) return;

        const timer = setTimeout(() => {
            setUploadMessage("");
        }, 5000);

        return () => clearTimeout(timer);
    }, [uploadMessage]);

    async function handleUpload() {
        if (!file) return;

        setUploading(true);
        setUploadMessage("");
        setUploadError("");

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Upload failed");
            }

            setUploadMessage(
                data.message || "Document uploaded successfully."
            );

            setFile(null);

        } catch (error) {
            setUploadError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong while uploading."
            );
        } finally {
            setUploading(false);
        }
    }

    async function handleQuery(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!query.trim()) return;

        setLoading(true);
        setAnswer("");
        setSources([]);
        setQueryError("");

        try {
            const response = await fetch("/api/query", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: query.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to get answer");
            }

            setAnswer(data.answer);
            setSources(data.sources || []);
        } catch (error) {
            setQueryError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">


            {/* Success Toast */}
            {uploadMessage && (
                <div className="fixed right-5 top-5 z-50 w-[calc(100%-2.5rem)] max-w-md animate-in fade-in slide-in-from-top-2 rounded-2xl border border-green-800 bg-slate-900 p-4 shadow-2xl">
                    <div className="flex items-start gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-lg text-green-400">
                            ✓
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="font-semibold text-green-400">
                                Upload Successful
                            </p>

                            <p className="mt-1 text-sm leading-5 text-slate-400">
                                {uploadMessage}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setUploadMessage("")}
                            className="shrink-0 text-slate-500 transition hover:text-white"
                            aria-label="Close notification"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-800">
                        <div className="h-full w-full origin-left animate-[shrink_3s_linear_forwards] bg-green-500" />
                    </div>
                </div>
            )}



            <div className="mx-auto max-w-5xl">

                {/* Header */}
                <div className="mb-10 text-center">
                    <div className="mb-3 inline-flex rounded-full border border-slate-700 bg-slate-900 px-4 py-1 text-sm text-slate-300">
                        RAG · Gemini · Vector Search
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight">
                        CompanyBrain
                    </h1>

                    <p className="mx-auto mt-3 max-w-2xl text-slate-400">
                        Upload your company documents and ask questions using
                        AI-powered document search.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">

                    {/* Upload Section */}
                    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
                        <div className="mb-6">
                            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                                📄
                            </div>

                            <h2 className="text-xl font-semibold">
                                Upload Document
                            </h2>

                            <p className="mt-1 text-sm text-slate-400">
                                Add a document to your company knowledge base.
                            </p>
                        </div>

                        <label
                            htmlFor="file"
                            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-950 p-8 text-center transition hover:border-slate-500"
                        >
                            <span className="mb-2 text-3xl">📁</span>

                            <span className="font-medium">
                                {file ? file.name : "Choose a document"}
                            </span>

                            <span className="mt-1 text-sm text-slate-500">
                                Click to browse files
                            </span>

                            <input
                                id="file"
                                type="file"
                                className="hidden"
                                onChange={(e) =>
                                    setFile(e.target.files?.[0] || null)
                                }
                            />
                        </label>

                        <button
                            onClick={handleUpload}
                            disabled={!file || uploading}
                            className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {uploading ? "Processing document..." : "Upload Document"}
                        </button>

                        {uploadError && (
                            <div className="mt-4 rounded-xl border border-red-900 bg-red-950/40 p-3 text-sm text-red-400">
                                {uploadError}
                            </div>
                        )}
                    </section>

                    {/* Query Section */}
                    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
                        <div className="mb-6">
                            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-xl">
                                🤖
                            </div>

                            <h2 className="text-xl font-semibold">
                                Ask a Question
                            </h2>

                            <p className="mt-1 text-sm text-slate-400">
                                Ask anything about your uploaded documents.
                            </p>
                        </div>

                        <form onSubmit={handleQuery}>
                            <textarea
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="e.g. How many annual leaves do employees get?"
                                rows={5}
                                className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-500"
                            />

                            <button
                                type="submit"
                                disabled={!query.trim() || loading}
                                className="mt-4 w-full rounded-xl bg-purple-600 px-4 py-3 font-medium transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {loading ? "Searching & Thinking..." : "Ask Question"}
                            </button>
                        </form>

                        {queryError && (
                            <div className="mt-4 rounded-xl border border-red-900 bg-red-950/40 p-3 text-sm text-red-400">
                                {queryError}
                            </div>
                        )}
                    </section>
                </div>

                {/* Answer */}
                {(answer || loading) && (
                    <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
                        <div className="mb-4 flex items-center gap-2">
                            <span className="text-xl">💡</span>

                            <h2 className="text-xl font-semibold">
                                Answer
                            </h2>
                        </div>

                        {loading ? (
                            <div className="flex items-center gap-3 text-slate-400">
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-purple-500" />
                                Searching your documents...
                            </div>
                        ) : (
                            <p className="whitespace-pre-wrap leading-7 text-slate-300">
                                {answer}
                            </p>
                        )}
                    </section>
                )}

                {/* Sources */}
                {sources.length > 0 && (
                    <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
                        <div className="mb-5">
                            <h2 className="text-xl font-semibold">
                                Retrieved Sources
                            </h2>

                            <p className="mt-1 text-sm text-slate-400">
                                Top relevant chunks used to generate the answer.
                            </p>
                        </div>

                        <div className="space-y-3">
                            {sources.map((source, index) => (
                                <details
                                    key={index}
                                    className="group rounded-xl border border-slate-800 bg-slate-950"
                                >
                                    <summary className="cursor-pointer list-none px-4 py-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-slate-300">
                                                Source {index + 1}
                                            </span>

                                            <span className="text-slate-500 transition group-open:rotate-180">
                                                ↓
                                            </span>
                                        </div>
                                    </summary>

                                    <div className="border-t border-slate-800 px-4 py-4">
                                        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-400">
                                            {source.content}
                                        </p>
                                    </div>
                                </details>
                            ))}
                        </div>
                    </section>
                )}

                {/* Footer */}
                <p className="mt-8 text-center text-xs text-slate-600">
                    Answers are generated using only the information found in
                    your uploaded documents.
                </p>
            </div>
        </main>
    );
}