"use client";

import { CheckIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

interface CodeBlockProps {
  code: string;
  language: string;
  fileName?: string;
}

export function CodeBlock({ code, language, fileName }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset "Copied!" after 2 seconds
  };

  const CopyButtonContent = () => (
    <>
      {copied ? (
        <>
          <CheckIcon className="h-4 w-4" />
          Copied!
        </>
      ) : (
        <>Copy Snippet</>
      )}
    </>
  );

  return (
    <div className="relative overflow-hidden rounded-md bg-[#282c34] font-mono text-sm text-white shadow-lg">
      {fileName && (
        <div className="flex items-center justify-between border-b border-[#4a5568] px-4 py-2 text-[#a0aec0]">
          <span>{fileName}</span>
          <button
            onClick={handleCopy}
            className="bg-primary-600 hover:bg-primary-700 active:bg-primary-800 ml-auto flex items-center gap-1 rounded px-3 py-1.5 text-xs font-medium text-white"
          >
            <CopyButtonContent />
          </button>
        </div>
      )}
      <SyntaxHighlighter
        language={language}
        style={atomOneDark}
        customStyle={{ padding: "1.25rem", margin: 0, background: "none" }}
      >
        {code}
      </SyntaxHighlighter>
      {!fileName && (
        <button
          onClick={handleCopy}
          className="bg-primary-600 hover:bg-primary-700 active:bg-primary-800 absolute top-2 right-2 flex items-center gap-1 rounded px-3 py-1.5 text-xs font-medium text-white"
        >
          <CopyButtonContent />
        </button>
      )}
    </div>
  );
}
