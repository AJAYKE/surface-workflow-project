"use client";

import { useEffect } from "react";
import { generateUniqueId } from "../utils/generateUniqueId";
import { CodeBlock } from "./CodeBlock";
import { OnboardingStepCard } from "./OnboardingStepCard";

interface InstallTagStepProps {
  installStepStatus:
    | "initial"
    | "installing"
    | "checking"
    | "success"
    | "failed";
  setInstallStepStatus: (
    status: "initial" | "installing" | "checking" | "success" | "failed",
  ) => void;
  tagId: string | null;
  setTagId: (id: string) => void;
}

export function InstallTagStep({
  installStepStatus,
  setInstallStepStatus,
  tagId,
  setTagId,
}: InstallTagStepProps) {
  useEffect(() => {
    let currentTagId = localStorage.getItem("surface_labs_tag_id");
    if (!currentTagId) {
      currentTagId = generateUniqueId();
      localStorage.setItem("surface_labs_tag_id", currentTagId);
    }
    setTagId(currentTagId);
  }, [setTagId]);

  const getSurfaceTagScript = (id: string | null) => {
    if (!id) return "";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    return `
<script src="${baseUrl}/surface_analytics.js?id=${id}"></script>
    `;
  };

  const handleInstallTagClick = () => {
    if (tagId) {
      setInstallStepStatus("installing");
    }
  };

  const handleTestConnection = async () => {
    if (!tagId) return;

    setInstallStepStatus("checking");

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const response = await fetch(
        `/api/events?tagId=${tagId}&eventType=script_initialized`,
      );
      const data = await response.json();
      const isScriptPresent = data.events && data.events.length > 0;

      if (isScriptPresent) {
        setInstallStepStatus("success");
      } else {
        setInstallStepStatus("failed");
      }
    } catch (error) {
      console.error("Error checking script presence:", error);
      setInstallStepStatus("failed");
    }
  };

  const getInstallActionButton = () => {
    if (installStepStatus === "initial") {
      return (
        <button
          onClick={handleInstallTagClick}
          className="btn btn-primary"
          disabled={!tagId}
        >
          Install tag
        </button>
      );
    } else if (installStepStatus === "success") {
      return (
        <></>
        // <button
        //   onClick={() => alert("Proceed to next step!")}
        //   className="btn btn-success"
        // >
        //   Next step
        // </button>
      );
    } else {
      return (
        <button
          onClick={handleTestConnection}
          className={`btn ${
            installStepStatus === "checking"
              ? "btn-disabled"
              : installStepStatus === "failed"
                ? "btn-danger"
                : "btn-primary"
          }`}
          disabled={installStepStatus === "checking" || !tagId}
        >
          {installStepStatus === "checking"
            ? "Checking connection..."
            : installStepStatus === "failed"
              ? "Try again"
              : "Test connection"}
        </button>
      );
    }
  };

  return (
    <OnboardingStepCard
      title="Install Surface Tag on your site"
      description="Enable tracking and analytics."
      status={installStepStatus}
      actionButton={getInstallActionButton()}
    >
      {(installStepStatus === "installing" ||
        installStepStatus === "checking" ||
        installStepStatus === "success" ||
        installStepStatus === "failed") &&
        tagId && (
          <div className="mt-4">
            <CodeBlock
              code={getSurfaceTagScript(tagId).trim()}
              language="html"
            />
          </div>
        )}
    </OnboardingStepCard>
  );
}
