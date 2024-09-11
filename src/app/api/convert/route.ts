import { NextRequest, NextResponse } from "next/server";
import {
  createReadStream,
  createWriteStream,
  promises as fsPromises,
} from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";

// Ensure ffmpeg uses the static binary
ffmpeg.setFfmpegPath(
  "A:\\DurgendraWorkspace\\WebDev\\AIBased\\ffmpeg\\bin\\ffmpeg.exe"
);

console.log(process.cwd());

// Define the path for the temp directory
const tempDir = path.join(process.cwd(), "tmp");

console.log(tempDir);

// Function to ensure the temp directory exists
async function ensureTempDirExists() {
  try {
    await fsPromises.access(tempDir);
  } catch (error) {
    // Directory does not exist, create it
    await fsPromises.mkdir(tempDir, { recursive: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureTempDirExists();

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new NextResponse("No file provided", { status: 400 });
    }

    // Save the file to a temporary location
    const tempInputPath = path.join(tempDir, file.name);
    const tempOutputPath = path.join(
      tempDir,
      file.name.replace(".aac", ".wav")
    );

    console.log(tempInputPath, tempOutputPath);

    const buffer = Buffer.from(await file.arrayBuffer());
    await new Promise((resolve, reject) => {
      const writeStream = createWriteStream(tempInputPath);
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
      writeStream.end(buffer);
    });

    // Convert the file using ffmpeg
    await new Promise((resolve, reject) => {
      ffmpeg(tempInputPath)
        .toFormat("wav")
        .on("end", resolve)
        .on("error", reject)
        .save(tempOutputPath);
    });

    // Read the converted file and send it in response
    const convertedStream = createReadStream(tempOutputPath);

    return new Promise<NextResponse>((resolve, reject) => {
      const chunks: Buffer[] = [];
      convertedStream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
      convertedStream.on("end", () => {
        const convertedBuffer = Buffer.concat(chunks);
        resolve(
          new NextResponse(convertedBuffer, {
            headers: {
              "Content-Type": "audio/wav",
              "Content-Disposition": `attachment; filename=${file.name.replace(
                ".aac",
                ".wav"
              )}`,
            },
          })
        );
      });
      convertedStream.on("error", reject);
    });
  } catch (error) {
    console.error("Error converting file:", error);
    return new NextResponse("Error converting file", { status: 500 });
  }
}
