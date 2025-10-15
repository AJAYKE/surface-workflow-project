import {
  ArrowPathIcon,
  CheckIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import type { ReactNode } from "react";

interface OnboardingStepCardProps {
  title: string;
  description: string;
  status:
  | "initial"
  | "installing"
  | "checking"
  | "success"
  | "failed"
  | "disabled";
  actionButton: ReactNode;
  children?: ReactNode;
}

const IconBadge: React.FC<{
  bg?: string;
  ring?: string;
  className?: string;
  children: React.ReactNode;
}> = ({
  bg = "bg-neutral-50",
  ring = "ring-neutral-200",
  className = "",
  children,
}) => (
    <span
      className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${bg} ring-1 ${ring} ${className}`}
    >
      {children}
    </span>
  );

const StatusIcon: React.FC<{ status: OnboardingStepCardProps["status"] }> = ({
  status,
}) => {
  switch (status) {
    case "success":
      return (
        <IconBadge bg="bg-success-50" ring="ring-success-100">
          <CheckCircleIcon className="text-success-600 h-4 w-4" />
        </IconBadge>
      );
    case "failed":
      return (
        <IconBadge bg="bg-danger-50" ring="ring-danger-100">
          <ExclamationCircleIcon className="text-danger-600 h-4 w-4" />
        </IconBadge>
      );
    case "checking":
      return (
        <IconBadge bg="bg-primary-50" ring="ring-primary-100">
          <ArrowPathIcon className="text-primary-600 h-4 w-4 animate-spin" />
        </IconBadge>
      );
    case "initial":
    case "disabled":
      return (
        <IconBadge bg="bg-neutral-100" ring="ring-neutral-100">
          <CheckIcon className="h-4 w-4 text-neutral-400" />
        </IconBadge>
      );
    case "installing":
    default:
      return (
        <IconBadge bg="bg-primary-50" ring="ring-primary-100">
          <CheckIcon className="text-primary-600 h-4 w-4" />
        </IconBadge>
      );
  }
};

export function OnboardingStepCard({
  title,
  description,
  status,
  actionButton,
  children,
}: OnboardingStepCardProps) {
  let borderColorClass = "border-neutral-200";
  let message = null;
  let messageColorClass = "";
  let messageBgClass = "";
  let messageIcon = null;
  let opacityClass = "";

  switch (status) {
    case "success":
      borderColorClass = "border-success-300";
      message = "Connected successfully!";
      messageColorClass = "text-success-700";
      messageBgClass = "bg-success-50";
      messageIcon = (
        <CheckCircleIcon className="text-success-500 h-5 w-5 shrink-0" />
      );
      break;
    case "failed":
      borderColorClass = "border-danger-300";
      message = (
        <div className="flex flex-col gap-1">
          <p className="text-sm leading-5 tracking-tight">
            We couldn&apos;t detect the Surface Tag on your website. Please ensure
            the snippet is added correctly.
          </p>
          <ul className="text-danger-600 list-disc space-y-0.5 pl-5 text-xs leading-[17px] tracking-tight">
            <li>
              Recheck the code snippet to ensure it&apos;s correctly placed before
              the closing &lt;/head&gt; tag.
            </li>
            <li>
              Ensure there are no blockers (like ad blockers) preventing the
              script from running.
            </li>
            <li>Try again once you&apos;ve made the corrections.</li>
          </ul>
        </div>
      );
      messageColorClass = "text-danger-700";
      messageBgClass = "bg-danger-50";
      messageIcon = (
        <ExclamationCircleIcon className="text-danger-500 h-5 w-5 shrink-0" />
      );
      break;
    case "checking":
      borderColorClass = "border-primary-300";
      message = "Checking for Tag...";
      messageColorClass = "text-primary-700";
      messageBgClass = "bg-primary-50";
      messageIcon = (
        <InformationCircleIcon className="text-primary-500 h-5 w-5 shrink-0" />
      );
      break;
    case "installing":
      borderColorClass = "border-neutral-200";
      break;
    case "disabled":
      opacityClass = "pointer-events-none opacity-60";
      borderColorClass = "border-neutral-100";
      break;
    default:
      break;
  }

  return (
    <div
      className={`rounded-lg border bg-white p-6 shadow-sm ${borderColorClass} ${opacityClass}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StatusIcon status={status} />
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
            <p className="text-sm text-neutral-500">{description}</p>
          </div>
        </div>
        {status === "initial" && <div>{actionButton}</div>}
      </div>

      {children && status !== "initial" && status !== "disabled" && (
        <div className="mt-4 border-t border-neutral-200 pt-4">{children}</div>
      )}

      {status !== "initial" &&
        status !== "disabled" &&
        status !== "success" && (
          <div className="mt-4 flex justify-end">{actionButton}</div>
        )}

      {message && (
        <div className="mt-4 border-t border-neutral-200 pt-4">
          <div
            className={`flex items-center gap-2 rounded-lg p-2 ${messageBgClass} ${messageColorClass}`}
          >
            {messageIcon}
            <div>{message}</div>
          </div>
        </div>
      )}
    </div>
  );
}
