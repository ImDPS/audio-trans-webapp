"use client";

import { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import { Upload, Trash2, AlertCircle } from "lucide-react";
import path from "path";

interface FileInfo {
  name: string;
  size: number;
  type: string;
  file: File;
}

const AudioConverter: React.FC = () => {
  const [file, setFile] = useState<FileInfo | null>(null);
  const [format, setFormat] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConverted, setIsConverted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handles a file input change event, and sets the file state to the selected
   * file if it exists.
   * @param {React.ChangeEvent<HTMLInputElement>} event The change event.
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile({
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        file: selectedFile,
      });
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  /**
   * Handles a file being dropped onto the component, and sets the file to the
   * dropped file if it exists.
   * @param {React.DragEvent<HTMLDivElement>} event The drag event.
   */
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile({
        name: droppedFile.name,
        size: droppedFile.size,
        type: droppedFile.type,
        file: droppedFile,
      });
    }
  };

  /**
   * Resets the file input field by removing the selected file.
   */

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /**
   * Formats a file size in bytes to a human-readable format.
   *
   * @param bytes The file size in bytes.
   * @returns A string representing the file size in a human-readable format
   *          (e.g. "10 B", "1.23 KB", "1.23 MB", etc.).
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / 1048576).toFixed(2) + " MB";
  };

  /**
   * Handles the conversion of the selected audio file to the selected format.
   *
   * Sends a POST request to the /api/convert endpoint with the selected file
   * and the selected format as form data. If the response is OK, downloads the
   * converted file as a blob URL and sets the file to null. If the response is
   * not OK, logs the error to the console. If there is an error during the
   * request, logs the error to the console and sets the file to null.
   */

  /**
   * Handles the conversion of the selected audio file to the selected format.
   *
   * Sends a POST request to the /api/convert endpoint with the selected file
   * and the selected format as form data. If the response is OK, downloads the
   * converted file as a blob URL and sets the file to null. If the response is
   * not OK, logs the error to the console. If there is an error during the
   * request, logs the error to the console and sets the file to null.
   */
  const handleConvert = async () => {
    if (!file) return;
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file.file);
      formData.append("format", format);

      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = file.name.replace(
          path.extname(file.name),
          `.${format}`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        removeFile();
        setIsConverted(true);
      } else {
        console.error("Error converting file:", await response.text());
      }
    } catch (error) {
      console.error("Error converting file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConverted) {
      setTimeout(() => {
        setIsConverted(false);
      }, 3000);
    }
  }, [isConverted]);

  return (
    <div
      className={`w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md`}
    >
      {isConverted && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          initialVelocityX={10}
          initialVelocityY={10}
        />
      )}
      <h1 className="text-3xl font-bold mb-8 p-4 text-slate-700">
        Audio Converter
      </h1>
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept="audio/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <Upload className="mx-auto mb-4 text-gray-400" size={48} />
        <p className="text-gray-600">Drag & drop or click to choose files</p>
        <p className="text-sm text-gray-400 mt-2">
          <AlertCircle className="inline-block mr-1" size={16} /> Max file size:
          50 MB
        </p>
      </div>
      {file && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-red-100 p-2 rounded-lg mr-3">
              <Upload className="text-red-500" size={24} />
            </div>
            <div>
              <p className="font-semibold">{file.name}</p>
              <p className="text-sm text-gray-500">
                {file.type} - {formatFileSize(file.size)}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              className="p-2 rounded-full hover:bg-gray-200"
              onClick={removeFile}
            >
              <Trash2 className="text-gray-600" size={20} />
            </button>
          </div>
        </div>
      )}
      <div className="flex justify-center space-x-8 my-4">
        <select
          name="format"
          className="w-full border border-gray-300 rounded-md p-2"
          onChange={(e) => setFormat(e.target.value)}
        >
          <option value="">Select Output Format</option>
          <option value="wav">WAV</option>
          <option value="mp3">MP3</option>
          <option value="aac">AAC</option>
          <option value="flac">FLAC</option>
        </select>
        <button
          className={`w-full bg-orange-700 hover:bg-orange-800 text-white font-bold py-2 px-4 rounded ${
            isLoading || !file || !format ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleConvert}
          disabled={isLoading && !file && !format}
        >
          {isLoading ? "Converting..." : "Convert Audio File"}
        </button>
      </div>
    </div>
  );
};

export default AudioConverter;
