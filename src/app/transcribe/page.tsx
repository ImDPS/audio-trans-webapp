"use client";

import React, { useState } from "react";
import { FalconWorker } from "@picovoice/falcon-web";
// import { Groq } from "groq-sdk";
import falconParams from "../../../public/assets/pvfalcon/falcon_params";

const falcon_access_key = process.env.NEXT_PUBLIC_FALCON_ACCESS_KEY!;
// const groq_api_key = process.env.NEXT_PUBLIC_GROQ_API_KEY!;

// const groq = new Groq({ apiKey: groq_api_key });

const AudioProcessor = () => {
  const [segments, setSegments] = useState<any[] | null>(null);
  const [segments_tr, setSegmentsTr] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const segments = await processFalcon(file);
        setSegments(segments);
        // console.log("Segments: ", segments);

        // Optionally, send segments to backend for further processing
        let result = await sendSegmentsToBackend(segments, file);
        setSegmentsTr(result);
      } catch (error: any) {
        console.error("Error processing audio:", error);
        setError(error.message || "Error processing audio");
      }
    }
  };

  const processFalcon = async (audioFile: File) => {
    const falcon = await FalconWorker.create(falcon_access_key, {
      base64: falconParams,
    });

    try {
      const audioContext = new AudioContext({ sampleRate: 16000 });
      const arrayBuffer = await audioFile.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const audioData = audioBuffer.getChannelData(0);
      const sampleRate = audioBuffer.sampleRate;

      if (sampleRate !== 16000) {
        throw new Error("Audio must be 16 kHz");
      }

      // Convert Float32Array to Int16Array
      let int16AudioData = new Int16Array(audioData.length);
      for (let i = 0; i < audioData.length; i++) {
        int16AudioData[i] = Math.max(
          -32768,
          Math.min(32767, Math.round(audioData[i] * 32768))
        );
      }

      const result = await falcon.process(int16AudioData, {
        transfer: true,
        transferCallback: (data) => {
          int16AudioData = data;
        },
      });
      return result.segments;
    } finally {
      falcon.release();
    }
  };

  const sendSegmentsToBackend = async (segments: any[], audioFile: File) => {
    const formData = new FormData();
    formData.append("segments", JSON.stringify(segments));
    formData.append("audio", audioFile);

    const response = await fetch("/api/transcribe", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Error sending segments to backend");
    }

    const result = await response.json();
    console.log("Backend response:", result);
    return result;
  };

  return (
    <div>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      {segments && <div>Segments: {JSON.stringify(segments)}</div>}
      {segments_tr && (
        <div>Transcription with Segments: {JSON.stringify(segments_tr)}</div>
      )}
      {error && <div>Error: {error}</div>}
    </div>
  );
};

export default AudioProcessor;
