import { NextRequest, NextResponse } from "next/server";
import { Groq } from "groq-sdk";
import path from "path";
import os from "os";

const groq_api_key = process.env.GROQ_API_KEY!;

const groq = new Groq({ apiKey: groq_api_key });

interface FileLike {
  name: string;
  lastModified: number;
  size: number;
  type: string;
  text: () => Promise<string>;
  arrayBuffer: () => Promise<ArrayBuffer>;
  slice: (start?: number, end?: number, contentType?: string) => FileLike;
  stream: () => ReadableStream;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const segments = JSON.parse(formData.get("segments") as string);
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    const transcription = await transcribeAudio(audioFile);

    console.log("transcription: ", transcription);

    const result = combineResults(transcription.text, segments);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error processing audio:", error);
    return NextResponse.json(
      { error: error.message || "Error processing audio" },
      { status: 500 }
    );
  }
}

const transcribeAudio = async (audioFile: File) => {
  try {
    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: "distil-whisper-large-v3-en",
    });

    return transcription;
  } catch (error) {
    console.error("Error in transcribeAudio:", error);
    throw error;
  }
};

function combineResults(transcription: string, segments: any[]) {
  const words = transcription.split(" ");
  const wordsPerSecond = words.length / segments[segments.length - 1].endSec;

  const speakerSegments = segments.map((segment) => {
    const startIndex = Math.floor(segment.startSec * wordsPerSecond);
    const endIndex = Math.min(
      Math.floor(segment.endSec * wordsPerSecond),
      words.length
    );
    return {
      speaker_id: segment.speakerTag,
      start_time: segment.startSec,
      end_time: segment.endSec,
      text: words.slice(startIndex, endIndex).join(" "),
    };
  });

  return {
    full_transcription: transcription,
    speaker_segments: speakerSegments,
  };
}

export const config = {
  api: {
    bodyParser: false,
  },
};
