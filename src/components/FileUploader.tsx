import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        // Simulating upload progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
            onFileUpload(file);
          }
        }, 200);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [".mp3", ".wav", ".ogg"],
    },
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors duration-200 ${
          isDragActive
            ? "border-white bg-coral-dark"
            : "border-white hover:bg-coral-dark"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the audio file here...</p>
        ) : (
          <p>Drag & drop an audio file here, or click to select a file</p>
        )}
      </div>
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="mt-4">
          <div className="bg-coral-dark rounded-full h-2.5">
            <div
              className="bg-white h-2.5 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm mt-2">Uploading: {uploadProgress}%</p>
        </div>
      )}
    </div>
  );
};
