"use client";

import { FormEvent, useEffect, useState } from "react";

type Source = {
    content: string;
    [key: string]: unknown;
};

export default function KnowledgeUI() {
    // =====================================================
    // UPLOAD STATE
    // =====================================================

    const [file, setFile] = useState<File | null>(null);

    const [selectedAccessGroup, setSelectedAccessGroup] =
        useState("");

    const [uploading, setUploading] = useState(false);

    const [uploadMessage, setUploadMessage] = useState("");

    const [uploadError, setUploadError] = useState("");

    // =====================================================
    // QUERY STATE
    // =====================================================

    const [query, setQuery] = useState("");

    const [answer, setAnswer] = useState("");

    const [sources, setSources] = useState<Source[]>([]);

    const [loading, setLoading] = useState(false);

    const [queryError, setQueryError] = useState("");

    // =====================================================
    // SUCCESS MESSAGE
    // =====================================================

    useEffect(() => {
        if (!uploadMessage) return;

        const timer = setTimeout(() => {
            setUploadMessage("");
        }, 5000);

        return () => clearTimeout(timer);
    }, [uploadMessage]);

    // =====================================================
    // UPLOAD DOCUMENT
    // =====================================================

    async function handleUpload() {
        if (!file) {
            setUploadError("Please select a PDF file.");
            return;
        }

        if (!selectedAccessGroup) {
            setUploadError(
                "Please select a document access group."
            );
            return;
        }

        setUploading(true);
        setUploadMessage("");
        setUploadError("");

        try {
            const formData = new FormData();

            // File
            formData.append("file", file);

            // User-selected document access group
            formData.append(
                "accessGroup",
                selectedAccessGroup
            );

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Upload failed"
                );
            }

            setUploadMessage(
                data.message ||
                "Document uploaded successfully."
            );

            // Reset upload form
            setFile(null);
            setSelectedAccessGroup("");

            const fileInput =
                document.getElementById(
                    "file"
                ) as HTMLInputElement | null;

            if (fileInput) {
                fileInput.value = "";
            }
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

    // =====================================================
    // ASK QUESTION
    // =====================================================

    async function handleQuery(
        e: FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        if (!query.trim()) return;

        const submittedQuery = query.trim();

        setLoading(true);
        setAnswer("");
        setSources([]);
        setQueryError("");

        // Clear textarea immediately after clicking Ask Question
        setQuery("");

        try {
            const response = await fetch("/api/query", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: submittedQuery,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to get answer"
                );
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
        <main className="relative min-h-screen overflow-hidden bg-[#14181C] px-4 py-12 text-[#F1EDE4] sm:px-6 lg:px-8">

            {/* =================================================
          AMBIENT TEXTURE — dot-grid "ledger paper" + drifting scan beam + soft glow field
      ================================================= */}

            <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(#2A2F36_1px,transparent_1px)] [background-size:22px_22px] opacity-40" />

            <div className="pointer-events-none fixed left-1/2 top-0 z-0 h-[520px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#D9A44C]/[0.07] blur-[120px]" />

            <div className="scanbeam pointer-events-none fixed inset-x-0 top-0 z-0 h-40 bg-gradient-to-b from-[#5FD4C4]/[0.08] to-transparent" />

            {/* =================================================
          STAMP TOAST
      ================================================= */}

            {uploadMessage && (
                <div className="stamp-in fixed right-5 top-5 z-50 w-[calc(100%-2.5rem)] max-w-md rounded-lg border border-[#D9A44C]/40 bg-[#1C2126] p-4 shadow-2xl shadow-black/40">
                    <div className="flex items-start gap-3">

                        <div className="flex h-10 w-10 shrink-0 rotate-[-8deg] items-center justify-center rounded-full border-2 border-[#D9A44C] text-[#D9A44C]">
                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="font-mono text-sm uppercase tracking-[0.2em] text-[#D9A44C]">
                                Filed to archive
                            </p>

                            <p className="mt-1 text-base leading-6 text-[#9099A3]">
                                {uploadMessage}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setUploadMessage("")
                            }
                            className="shrink-0 rounded text-[#6B7280] transition hover:text-[#F1EDE4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D9A44C]"
                            aria-label="Close notification"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-[#2A2F36]">
                        <div className="toast-bar h-full bg-[#D9A44C]" />
                    </div>
                </div>
            )}

            <div className="relative z-10 mx-auto max-w-5xl">

                {/* =================================================
            HEADER
        ================================================= */}

                <div className="mb-14 text-center">

                    <div className="reveal mb-6 inline-flex items-center gap-2 rounded-full border border-[#2A2F36] bg-[#1C2126] px-4 py-1.5 font-mono text-xs uppercase tracking-[0.25em] text-[#9099A3]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#5FD4C4] pulse-dot" />
                        Vector Index · Live
                    </div>

                    <h1 className="reveal reveal-delay-1 font-serif text-6xl font-semibold tracking-tight text-[#F1EDE4] sm:text-7xl lg:text-8xl">
                        CompanyBrain
                    </h1>

                    <div className="title-underline reveal reveal-delay-2 mx-auto mt-4 h-[3px] w-28 rounded-full bg-gradient-to-r from-[#D9A44C] to-[#5FD4C4]" />

                    <p className="reveal reveal-delay-3 mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#9099A3] sm:text-xl">
                        Every document you file becomes searchable. Ask a
                        question in plain language and retrieve the answer,
                        straight from the record.
                    </p>

                </div>

                <div className="grid gap-6 lg:grid-cols-2">

                    {/* =================================================
              UPLOAD SECTION — "Intake" card
          ================================================= */}

                    <section className="card-rise card-rise-1 group relative rounded-2xl border border-[#2A2F36] bg-[#1C2126] p-7 shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-[#D9A44C]/40 hover:shadow-2xl hover:shadow-[#D9A44C]/5">

                        <span className="absolute -top-3 left-6 rounded-full border border-[#2A2F36] bg-[#14181C] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-[#D9A44C]">
                            01 — Intake
                        </span>

                        <div className="mb-6 mt-2">

                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-[#D9A44C]/25 bg-[#D9A44C]/10 text-2xl transition-transform duration-300 group-hover:scale-105">
                                📄
                            </div>

                            <h2 className="font-serif text-2xl font-semibold">
                                Upload Document
                            </h2>

                            <p className="mt-1.5 text-base text-[#9099A3]">
                                Add a document to your company knowledge
                                base.
                            </p>

                        </div>

                        {/* =================================================
                FILE INPUT
            ================================================= */}

                        <label
                            htmlFor="file"
                            className="dropzone flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#2A2F36] bg-[#14181C] p-9 text-center transition-all duration-300 hover:border-[#D9A44C]/60 hover:bg-[#181D22]"
                        >
                            <span className="mb-2 text-4xl transition-transform duration-300 group-hover:scale-110">
                                {file ? "🗂️" : "📁"}
                            </span>

                            <span className="break-all text-base font-medium text-[#F1EDE4]">
                                {file
                                    ? file.name
                                    : "Choose a document"}
                            </span>

                            <span className="mt-1 text-sm text-[#6B7280]">
                                PDF files only
                            </span>

                            <input
                                id="file"
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                onChange={(e) => {
                                    setFile(
                                        e.target.files?.[0] || null
                                    );

                                    setUploadError("");
                                }}
                            />
                        </label>

                        {/* =================================================
                ACCESS GROUP
            ================================================= */}

                        <div className="mt-5">

                            <label
                                htmlFor="accessGroup"
                                className="mb-2 block font-mono text-sm uppercase tracking-[0.15em] text-[#9099A3]"
                            >
                                Document Access Group
                            </label>

                            <select
                                id="accessGroup"
                                value={selectedAccessGroup}
                                onChange={(e) =>
                                    setSelectedAccessGroup(
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-xl border border-[#2A2F36] bg-[#14181C] px-4 py-3 text-base text-[#F1EDE4] outline-none transition-colors duration-200 focus:border-[#D9A44C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D9A44C]"
                            >
                                <option value="">
                                    Select access group
                                </option>

                                <option value="EMPLOYEE">
                                    Employee
                                </option>

                                <option value="MANAGER">
                                    Manager
                                </option>

                                <option value="HR">
                                    HR
                                </option>

                                <option value="FINANCE">
                                    Finance
                                </option>

                                <option value="ADMIN">
                                    Admin
                                </option>
                            </select>

                        </div>

                        {/* =================================================
                UPLOAD BUTTON
            ================================================= */}

                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={
                                !file ||
                                !selectedAccessGroup ||
                                uploading
                            }
                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D9A44C] px-4 py-3.5 text-lg font-medium text-[#14181C] transition-all duration-200 hover:bg-[#E5B565] hover:shadow-lg hover:shadow-[#D9A44C]/20 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9A44C] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:shadow-none"
                        >
                            {uploading && (
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#14181C]/30 border-t-[#14181C]" />
                            )}
                            {uploading
                                ? "Processing document..."
                                : "Upload Document"}
                        </button>

                        {/* ERROR */}

                        {uploadError && (
                            <div className="fade-in mt-4 rounded-xl border border-[#E2685B]/40 bg-[#E2685B]/10 p-3 text-sm text-[#E2685B]">
                                {uploadError}
                            </div>
                        )}

                    </section>

                    {/* =================================================
              QUERY SECTION — "Retrieval" card
          ================================================= */}

                    <section className="card-rise card-rise-2 group relative rounded-2xl border border-[#2A2F36] bg-[#1C2126] p-7 shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-[#5FD4C4]/40 hover:shadow-2xl hover:shadow-[#5FD4C4]/5">

                        <span className="absolute -top-3 left-6 rounded-full border border-[#2A2F36] bg-[#14181C] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-[#5FD4C4]">
                            02 — Retrieval
                        </span>

                        <div className="mb-6 mt-2">

                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-[#5FD4C4]/25 bg-[#5FD4C4]/10 text-2xl transition-transform duration-300 group-hover:scale-105">
                                🔍
                            </div>

                            <h2 className="font-serif text-2xl font-semibold">
                                Ask a Question
                            </h2>

                            <p className="mt-1.5 text-[15px] text-[#9099A3]">
                                Ask anything about your uploaded documents.
                            </p>

                        </div>

                        <form onSubmit={handleQuery}>

                            <textarea
                                value={query}
                                onChange={(e) =>
                                    setQuery(e.target.value)
                                }
                                placeholder="e.g. How many annual leaves do employees get?"
                                rows={5}
                                className="w-full resize-none rounded-xl border border-[#2A2F36] bg-[#14181C] px-4 py-3.5 text-lg leading-6 text-[#F1EDE4] outline-none transition-colors duration-200 placeholder:text-[#565D68] focus:border-[#5FD4C4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#5FD4C4]"
                            />

                            <button
                                type="submit"
                                disabled={
                                    !query.trim() || loading
                                }
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#5FD4C4] px-4 py-3.5 text-base font-medium text-[#14181C] transition-all duration-200 hover:bg-[#7EE0D2] hover:shadow-lg hover:shadow-[#5FD4C4]/20 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5FD4C4] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:shadow-none"
                            >
                                {loading && (
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#14181C]/30 border-t-[#14181C]" />
                                )}
                                {loading
                                    ? "Searching & Thinking..."
                                    : "Ask Question"}
                            </button>

                        </form>

                        {queryError && (
                            <div className="fade-in mt-4 rounded-xl border border-[#E2685B]/40 bg-[#E2685B]/10 p-3 text-base text-[#E2685B]">
                                {queryError}
                            </div>
                        )}

                    </section>

                </div>

                {/* =================================================
            ANSWER
        ================================================= */}

                {(answer || loading) && (
                    <section className="fade-in relative mt-6 overflow-hidden rounded-2xl border border-[#2A2F36] bg-[#1C2126] p-7 shadow-xl shadow-black/20">

                        <div className="mb-4 flex items-center gap-2.5">

                            <span className="text-2xl">
                                💡
                            </span>

                            <h2 className="font-serif text-2xl font-semibold">
                                Answer
                            </h2>

                        </div>

                        {loading ? (
                            <div className="relative overflow-hidden rounded-xl border border-[#2A2F36] bg-[#14181C] p-5">
                                <div className="flex items-center gap-3 text-base text-[#9099A3]">
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#2A2F36] border-t-[#5FD4C4]" />
                                    Searching your documents...
                                </div>
                                <div className="scan-sweep pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-[#5FD4C4]/10 to-transparent" />
                            </div>
                        ) : (
                            <p className="fade-in whitespace-pre-wrap font-serif text-xl leading-9 text-[#DCD7CC] leading-10 sm:text-[24px]">
                                {answer}
                            </p>
                        )}

                    </section>
                )}

                {/* =================================================
            SOURCES
        ================================================= */}

                {sources.length > 0 && (
                    <section className="fade-in mt-6 rounded-2xl border border-[#2A2F36] bg-[#1C2126] p-7 shadow-xl shadow-black/20">

                        <div className="mb-5">

                            <h2 className="font-serif text-2xl font-semibold">
                                Retrieved Sources
                            </h2>

                            <p className="mt-1.5 text-base text-[#9099A3]">
                                Top relevant chunks used to generate
                                the answer.
                            </p>

                        </div>

                        <div className="space-y-3">

                            {sources.map(
                                (source, index) => (
                                    <details
                                        key={index}
                                        className="group/card overflow-hidden rounded-xl border border-[#2A2F36] bg-[#14181C] transition-colors duration-200 hover:border-[#D9A44C]/30"
                                    >

                                        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3.5 [&::-webkit-details-marker]:hidden">

                                            <span className="flex items-center gap-2 font-mono text-sm uppercase tracking-[0.15em] text-[#D9A44C]">
                                                <span className="rounded border border-[#D9A44C]/30 bg-[#D9A44C]/10 px-1.5 py-0.5">
                                                    No. {String(index + 1).padStart(2, "0")}
                                                </span>
                                                Source
                                            </span>

                                            <span className="text-[#6B7280] transition-transform duration-300 group-open/card:rotate-180">
                                                ↓
                                            </span>

                                        </summary>

                                        <div className="border-t border-[#2A2F36] px-4 py-4">

                                            <p className="whitespace-pre-wrap text-base leading-7 text-[#9099A3]">
                                                {source.content}
                                            </p>

                                        </div>

                                    </details>
                                )
                            )}

                        </div>

                    </section>
                )}

                {/* =================================================
            FOOTER
        ================================================= */}

                <p className="mt-12 text-center font-mono text-sm uppercase tracking-[0.15em] text-[#565D68]">
                    Answers are generated using only the information
                    found in your uploaded documents.
                </p>

            </div>

            <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap");

        .font-serif {
          font-family: "Fraunces", Georgia, serif;
        }

        main {
          font-family: "Inter", system-ui, sans-serif;
        }

        .font-mono {
          font-family: "IBM Plex Mono", ui-monospace, monospace;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in {
          animation: fadeInUp 0.35s ease-out both;
        }

        /* Orchestrated header entrance: each element settles in turn */
        @keyframes revealUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .reveal {
          animation: revealUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .reveal-delay-1 {
          animation-delay: 0.08s;
        }
        .reveal-delay-2 {
          animation-delay: 0.18s;
        }
        .reveal-delay-3 {
          animation-delay: 0.26s;
        }

        /* Cards rise into place just after the header settles */
        @keyframes cardRise {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .card-rise {
          animation: cardRise 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .card-rise-1 {
          animation-delay: 0.32s;
        }
        .card-rise-2 {
          animation-delay: 0.4s;
        }

        @keyframes stampIn {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(-8px) rotate(-3deg);
          }
          60% {
            opacity: 1;
            transform: scale(1.03) rotate(1deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
          }
        }
        .stamp-in {
          animation: stampIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        @keyframes toastBar {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        .toast-bar {
          animation: toastBar 5s linear forwards;
        }

        @keyframes pulseDot {
          0%, 100% {
            opacity: 1;
            box-shadow: 0 0 0 0 rgba(95, 212, 196, 0.5);
          }
          50% {
            opacity: 0.6;
            box-shadow: 0 0 0 4px rgba(95, 212, 196, 0);
          }
        }
        .pulse-dot {
          animation: pulseDot 2s ease-in-out infinite;
        }

        @keyframes scanBeamDrift {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(400px);
          }
        }
        .scanbeam {
          animation: scanBeamDrift 9s ease-in-out infinite alternate;
        }

        @keyframes scanSweep {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(120%);
          }
        }
        .scan-sweep {
          animation: scanSweep 1.6s ease-in-out infinite;
        }

        @keyframes underlineGrow {
          from {
            width: 0;
          }
          to {
            width: 7rem;
          }
        }
        .title-underline {
          animation: underlineGrow 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.18s both;
        }

        @media (prefers-reduced-motion: reduce) {
          .fade-in,
          .reveal,
          .card-rise,
          .stamp-in,
          .toast-bar,
          .pulse-dot,
          .scanbeam,
          .scan-sweep,
          .title-underline {
            animation: none !important;
          }
        }
      `}</style>

        </main>
    );
}