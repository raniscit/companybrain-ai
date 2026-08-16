"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a PDF");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setMessage("Uploading...");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Something went wrong");
        return;
      }

      setMessage(
        `PDF uploaded successfully! ${data.numberOfChunks} chunks created.`
      );
    } catch (error) {
      console.error(error);
      setMessage("Failed to upload PDF");
    }
  };

  return (
    <main className="min-h-screen p-10">
      <h1 className="mb-6 text-3xl font-bold">
        CompanyBrain
      </h1>

      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            setFile(e.target.files?.[0] || null);
            setMessage("");
          }}
        />

        <button
          onClick={handleUpload}
          disabled={!file}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          Upload
        </button>
      </div>

      {file && (
        <p className="mt-4 text-sm text-gray-600">
          Selected: {file.name}
        </p>
      )}

      {message && (
        <p className="mt-5">
          {message}
        </p>
      )}
    </main>
  );
}