import React from "react";

interface TranscriptionDisplayProps {
  transcription: string;
}

export const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({
  transcription,
}) => {
  return (
    <div className="h-full">
      <div className="h-64 overflow-y-auto">
        {transcription ? (
          <p className="whitespace-pre-wrap text-dark-gray">{transcription}</p>
        ) : (
          <p className="text-gray-500 italic">
            No transcription available. Upload an audio file to see the result.
          </p>
        )}
      </div>
    </div>
  );
};
