"use client";

import React, { useState } from "react";
import Head from "next/head";
import { FileUploader } from "../components/FileUploader";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TranscriptionDisplay } from "@/components/TransactionDisplay";

const Home: React.FC = () => {
  const [transcription, setTranscription] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleFileUpload = (file: File) => {
    // Simulating transcription process
    setTimeout(() => {
      setTranscription(
        `Transcription of ${file.name}:\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`
      );
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-light-blue">
      <Head>
        <title>AudioTrans - AI-Powered Audio Transcription</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Header
        isLoggedIn={isLoggedIn}
        onLoginToggle={() => setIsLoggedIn(!isLoggedIn)}
      />

      <main className="flex-grow container mx-auto px-4 py-12">
        <section className="mb-16">
          <h1 className="text-5xl font-bold mb-4 text-dark-gray">
            MOMs are missing no problem just record it and put: on AudioTrans
          </h1>
          <p className="text-xl mb-8 text-dark-gray">
            Drive results 5x faster by meeting people where they are
          </p>
          <button className="bg-coral text-white px-6 py-3 rounded-full font-semibold hover:bg-coral-dark transition-colors duration-200">
            Start for free
          </button>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-coral rounded-3xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Turn audio into training with AI
            </h2>
            <p className="mb-6">
              Upload content and get personalized, interactive, and contextual
              training in seconds.
            </p>
            <FileUploader onFileUpload={handleFileUpload} />
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold mb-4 text-dark-gray">
              AI-Powered Transcription
            </h2>
            <TranscriptionDisplay transcription={transcription} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
