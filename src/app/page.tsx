"use client";

import { InstallTagStep } from "@/components/InstallTagStep";
import { Sidebar } from "@/components/Sidebar";
import { TestEventsStep } from "@/components/TestEventsStep";
import { useEffect, useState } from "react";

export default function Home() {
  const [installStepStatus, setInstallStepStatus] = useState<
    "initial" | "installing" | "checking" | "success" | "failed"
  >("initial");
  const [tagId, setTagId] = useState<string | null>(null);

  useEffect(() => {
    const existingTagId = localStorage.getItem("surface_labs_tag_id");
    if (existingTagId) {
      setTagId(existingTagId);
    }
  }, []);

  return (
    <main className="flex min-h-screen bg-neutral-100">
      <Sidebar />

      <div className="flex flex-1 flex-col gap-9 p-10.5">
        <h2 className="border-b-2 border-neutral-200 pb-5 text-3xl font-semibold">
          Getting started
        </h2>

        <InstallTagStep
          installStepStatus={installStepStatus}
          setInstallStepStatus={setInstallStepStatus}
          tagId={tagId}
          setTagId={setTagId}
        />

        <TestEventsStep
          tagId={tagId}
          isInstallStepSuccessful={installStepStatus === "success"}
        />
      </div>
    </main>
  );
}
