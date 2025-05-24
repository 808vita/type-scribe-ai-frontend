"use client";

import React, { useState } from "react";
import SdkGeneratorForm, { SdkConfig } from "@/components/SdkGeneratorForm";
import GeneratedSdkDisplay from "@/components/GeneratedSdkDisplay";
import { GenerateSdkResponse } from "@/lib/api";

export default function HomePage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedSdk, setGeneratedSdk] = useState<GenerateSdkResponse | null>(
    null
  );

  const handleSdkGenerated = (response: GenerateSdkResponse) => {
    setGeneratedSdk(response);
  };

  const currentSdkName = generatedSdk
    ? sdkNameForDownload(
        generatedSdk.message.split("SDK Name: ")[1]?.split(" ")[0] ||
          "generated-sdk"
      )
    : "";

  function sdkNameForDownload(initialName: string): string {
    // This is a simple heuristic based on your backend's response message
    // You might want to pass the sdkName directly from the form submit handler
    return initialName.endsWith("Sdk") ? initialName : `${initialName}Sdk`;
  }

  return (
    <main className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-extrabold text-white mb-8 text-center">
        Type-Scribe AI
      </h1>
      <p className="text-xl text-gray-300 mb-10 text-center max-w-3xl">
        Automate the creation of TypeScript API SDKs from documentation using
        intelligent AI agents.
      </p>

      {/* Loading Indicator */}
      {loading && (
        <div className="my-4 text-blue-400 text-lg">
          Generating SDK... This may take a moment.
          <span className="animate-pulse ml-2">💡</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <p className="font-bold">Error:</p>
          <p className="text-sm break-words">{error}</p>
          <p className="text-xs mt-2">
            Please check your input or backend logs.
          </p>
        </div>
      )}

      {/* Success Message */}
      {generatedSdk?.message && !loading && !error && (
        <div className="success-message">
          <p className="font-bold">Success!</p>
          <p className="text-sm">{generatedSdk.message}</p>
        </div>
      )}

      {/* SDK Generator Form */}
      <SdkGeneratorForm
        onSdkGenerated={handleSdkGenerated}
        onLoading={setLoading}
        onError={setError}
      />

      {/* Display Generated SDK Code */}
      {generatedSdk && (
        <GeneratedSdkDisplay
          sdkCode={generatedSdk.sdk_code}
          sdkName={currentSdkName}
        />
      )}
    </main>
  );
}
