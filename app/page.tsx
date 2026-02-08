"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [formattedJournal, setFormattedJournal] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((track) => track.stop());
        transcribeAudio(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError("Kunde inte starta inspelning. Kontrollera mikrofonbehörighet.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (blob: Blob) => {
    setIsTranscribing(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Transkribering misslyckades");
      }

      setTranscription(data.text);
    } catch (err: any) {
      setError(err.message || "Ett fel uppstod vid transkribering");
    } finally {
      setIsTranscribing(false);
    }
  };

  const formatToJournal = async () => {
    if (!transcription) return;

    setIsFormatting(true);
    setError("");

    try {
      const response = await fetch("/api/format", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: transcription }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Formatering misslyckades");
      }

      setFormattedJournal(data.formattedText);
    } catch (err: any) {
      setError(err.message || "Ett fel uppstod vid formatering");
    } finally {
      setIsFormatting(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formattedJournal);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      setError("Kunde inte kopiera till urklipp");
    }
  };

  return (
    <main className="min-h-screen bg-[#4a4a4a]">
      {/* Hero Header */}
      <header className="bg-[#4a4a4a]">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-white/50 text-sm tracking-wide uppercase mb-3">Demo för</p>
            <div className="text-white text-center">
              <p className="text-xs tracking-[0.2em] uppercase text-white/70 mb-1">STOCKHOLMS</p>
              <h1 className="text-2xl font-light tracking-wide uppercase">RYGGKLINIK</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[#4a4a4a] pb-12 text-center">
        <div className="max-w-[800px] mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4 tracking-wide italic">
            AI-driven Journalföring
          </h2>
          <p className="text-white/60 text-base">
            Effektivisera din dokumentation med röstinspelning
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="bg-white min-h-screen py-12 px-4">
        <div className="max-w-[900px] mx-auto">

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Recording Section */}
          <section className="bg-[#f5f5f5] rounded-2xl p-8 mb-8 border border-gray-200">
            <h2 className="text-2xl font-light text-[#4a4a4a] mb-8 text-center tracking-wide">
              Röstinspelning
            </h2>
            <div className="flex flex-col items-center">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-[160px] h-[160px] rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                  isRecording
                    ? "bg-red-100 border-red-500 animate-pulse"
                    : "bg-[#e67e22]/10 border-[#e67e22] hover:bg-[#e67e22]/20"
                }`}
              >
                {isRecording ? (
                  <svg
                    className="w-16 h-16 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                ) : (
                  <svg
                    className="w-16 h-16 text-[#e67e22]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                  </svg>
                )}
              </button>
              <p className="mt-6 text-[#666] font-light text-lg">
                {isRecording
                  ? "Inspelning pågår... Klicka för att stoppa"
                  : "Klicka för att börja spela in"}
              </p>
            </div>
          </section>

          {/* Transcription Section */}
          <section className="bg-[#f5f5f5] rounded-2xl p-8 mb-8 border border-gray-200">
            <h2 className="text-2xl font-light text-[#4a4a4a] mb-6 tracking-wide">
              Transkribering
            </h2>
            <div className="relative">
              <textarea
                readOnly
                value={transcription}
                placeholder="Transkriberad text visas här..."
                className="w-full h-[160px] p-5 bg-white border border-gray-200 rounded-xl resize-none text-[#333] text-base placeholder-gray-400 focus:outline-none focus:border-[#e67e22] transition-colors"
              />
              {isTranscribing && (
                <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-xl">
                  <div className="flex items-center gap-4">
                    <svg
                      className="animate-spin h-6 w-6 text-[#e67e22]"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="text-[#666] text-base font-light">Transkriberar...</span>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={formatToJournal}
              disabled={!transcription || isTranscribing || isFormatting}
              className="mt-6 w-full py-4 px-8 bg-[#e67e22] text-white font-medium text-base tracking-wide rounded-lg transition-all duration-200 hover:bg-[#d35400] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#e67e22]"
            >
              FORMATERA TILL JOURNAL
            </button>
          </section>

          {/* Journal Section */}
          <section className="bg-[#f5f5f5] rounded-2xl p-8 border border-gray-200">
            <h2 className="text-2xl font-light text-[#4a4a4a] mb-6 tracking-wide">
              Formaterad Journal
            </h2>
            <div className="relative">
              <textarea
                value={formattedJournal}
                onChange={(e) => setFormattedJournal(e.target.value)}
                placeholder="Formaterad journaltext visas här..."
                className="w-full h-[280px] p-5 bg-white border border-gray-200 rounded-xl resize-none text-[#333] text-base placeholder-gray-400 focus:outline-none focus:border-[#e67e22] transition-colors"
              />
              {isFormatting && (
                <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-xl">
                  <div className="flex items-center gap-4">
                    <svg
                      className="animate-spin h-6 w-6 text-[#e67e22]"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="text-[#666] text-base font-light">Formaterar...</span>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={copyToClipboard}
                disabled={!formattedJournal}
                className="flex-1 py-4 px-8 bg-[#4a4a4a] text-white font-medium text-base tracking-wide rounded-lg transition-all duration-200 hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#4a4a4a]"
              >
                KOPIERA TILL URKLIPP
              </button>
              {copySuccess && (
                <span className="text-[#27ae60] font-medium text-base flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Kopierat!
                </span>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
