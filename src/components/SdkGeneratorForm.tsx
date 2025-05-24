"use client";

import React, { useState } from "react";
import { generateSdk, GenerateSdkResponse } from "@/lib/api";

// Define the type for the SDK configuration
export interface SdkConfig {
  sdkName: string;
  version: string;
  baseUrl: string;
}

// Props for the SdkGeneratorForm component
interface SdkGeneratorFormProps {
  onSdkGenerated: (response: GenerateSdkResponse) => void;
  onLoading: (isLoading: boolean) => void;
  onError: (error: string | null) => void;
}

export default function SdkGeneratorForm({
  onSdkGenerated,
  onLoading,
  onError,
}: SdkGeneratorFormProps) {
  const [sdkName, setSdkName] = useState<string>("");
  const [version, setVersion] = useState<string>("1.0.0");
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [docUrl, setDocUrl] = useState<string>("");
  const [docFile, setDocFile] = useState<File | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    onLoading(true);
    onError(null); // Clear previous errors

    try {
      if (!sdkName || !version || !baseUrl) {
        throw new Error("Please fill in all SDK configuration fields.");
      }
      if (!docUrl && !docFile) {
        throw new Error(
          "Please provide either a documentation URL or upload a file."
        );
      }

      let docSource:
        | { type: "url"; value: string }
        | { type: "file"; value: File };
      if (docFile) {
        docSource = { type: "file", value: docFile };
      } else if (docUrl) {
        docSource = { type: "url", value: docUrl };
      } else {
        // This case should ideally not happen due to the check above
        throw new Error("No documentation source provided.");
      }

      const config: SdkConfig = { sdkName, version, baseUrl };
      const response = await generateSdk(config, docSource);
      onSdkGenerated(response);
    } catch (error) {
      console.error("SDK generation failed:", error);
      onError((error as Error).message);
    } finally {
      onLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-gray-800 rounded-lg shadow-md max-w-2xl mx-auto space-y-4"
    >
      <h2 className="text-2xl font-bold text-white mb-4">
        Generate TypeScript SDK
      </h2>

      {/* SDK Configuration */}
      <div className="space-y-2">
        <label
          htmlFor="sdkName"
          className="block text-sm font-medium text-gray-300"
        >
          SDK Name:
        </label>
        <input
          type="text"
          id="sdkName"
          value={sdkName}
          onChange={(e) => setSdkName(e.target.value)}
          placeholder="e.g., UserServiceSdk"
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="version"
          className="block text-sm font-medium text-gray-300"
        >
          Version:
        </label>
        <input
          type="text"
          id="version"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          placeholder="e.g., 1.0.0"
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="baseUrl"
          className="block text-sm font-medium text-gray-300"
        >
          Base URL:
        </label>
        <input
          type="url"
          id="baseUrl"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          placeholder="e.g., https://api.example.com/v1"
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        />
      </div>

      {/* API Documentation */}
      <div className="space-y-2">
        <label
          htmlFor="docUrl"
          className="block text-sm font-medium text-gray-300"
        >
          Documentation URL (e.g., GitHub README, API docs page):
        </label>
        <input
          type="url"
          id="docUrl"
          value={docUrl}
          onChange={(e) => {
            setDocUrl(e.target.value);
            setDocFile(null); // Clear file selection if URL is entered
          }}
          placeholder="e.g., https://github.com/my-org/my-api/blob/main/README.md"
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div className="text-gray-300 text-center">- OR -</div>

      <div className="space-y-2">
        <label
          htmlFor="docFile"
          className="block text-sm font-medium text-gray-300"
        >
          Upload Documentation File (README.md, .pdf, .docx):
        </label>
        <input
          type="file"
          id="docFile"
          onChange={(e) => {
            const file = e.target.files ? e.target.files[0] : null;
            setDocFile(file);
            setDocUrl(""); // Clear URL if file is selected
          }}
          className="mt-1 block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 cursor-pointer"
        />
        {docFile && (
          <p className="text-xs text-gray-400">Selected file: {docFile.name}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-200"
      >
        Generate SDK
      </button>
    </form>
  );
}
