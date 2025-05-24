"use client";

import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

interface GeneratedSdkDisplayProps {
  sdkCode: string;
  sdkName: string; // The name of the SDK to use for the file download
}

export default function GeneratedSdkDisplay({
  sdkCode,
  sdkName,
}: GeneratedSdkDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(sdkCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset "Copied!" message after 2 seconds
  };

  const handleDownload = () => {
    const blob = new Blob([sdkCode], { type: "text/typescript" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${sdkName.toLowerCase().replace(/\s/g, "-")}-sdk.ts`; // Sanitize name for filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up the URL object
  };

  if (!sdkCode) {
    return null; // Don't render if no code is provided yet
  }

  return (
    <div className="p-6 bg-gray-900 rounded-lg shadow-md max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-white mb-4">Generated SDK Code</h2>
      <div className="flex justify-end space-x-2 mb-4">
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition duration-200"
        >
          {copied ? "Copied!" : "Copy Code"}
        </button>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition duration-200"
        >
          Download .ts File
        </button>
      </div>
      <div className="overflow-auto max-h-[600px] rounded-md">
        <SyntaxHighlighter
          language="typescript"
          style={dracula}
          showLineNumbers
          className="!m-0 !p-4 !overflow-visible"
        >
          {sdkCode}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
