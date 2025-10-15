"use client";

import { useState } from "react";
import { EventsDisplay } from "./EventsDisplay";
import { OnboardingStepCard } from "./OnboardingStepCard";

interface TestEventsStepProps {
  tagId: string | null;
  isInstallStepSuccessful: boolean;
}

export function TestEventsStep({
  tagId,
  isInstallStepSuccessful,
}: TestEventsStepProps) {
  const [isTesting, setIsTesting] = useState(false);

  const handleTestTag = () => {
    setIsTesting(true);
  };

  return (
    <OnboardingStepCard
      title="Test Surface Tag Events"
      description="Test if the Surface Tag is properly emitting events."
      status={
        isInstallStepSuccessful
          ? isTesting
            ? "installing"
            : "initial"
          : "disabled"
      }
      actionButton={
        <button
          onClick={handleTestTag}
          className={`btn ${!isInstallStepSuccessful ? "btn-disabled" : "btn-primary"}`}
          disabled={!isInstallStepSuccessful || isTesting}
        >
          Test Tag
        </button>
      }
    >
      {isTesting && isInstallStepSuccessful && tagId && (
        <EventsDisplay tagId={tagId} />
      )}
    </OnboardingStepCard>
  );
}
