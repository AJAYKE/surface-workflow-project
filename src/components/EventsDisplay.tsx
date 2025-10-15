import { format } from "date-fns";
import { useCallback, useEffect, useRef, useState } from "react";

interface AnalyticsEvent {
  id: string;
  visitorId: string;
  tagId: string;
  eventType: string;
  eventName: string | null;
  metadata: Record<string, any>;
  createdAt: string;
}

interface EventsDisplayProps {
  tagId: string;
}

const styles = {
  container: "overflow-hidden rounded-lg border border-neutral-200",
  table: "min-w-full divide-y divide-neutral-200",
  tableHead: "bg-neutral-50",
  tableHeaderCell:
    "px-6 py-3 text-left text-xs font-medium tracking-wider text-neutral-500 uppercase",
  tableBody: "divide-y divide-neutral-200 bg-white",
  tableRow: "hover:bg-neutral-50 transition-colors",
  cellEventType:
    "px-6 py-4 text-sm font-medium whitespace-nowrap text-neutral-900",
  cellVisitorId: "px-6 py-4 text-sm whitespace-nowrap text-neutral-500",
  cellMetadata: "px-6 py-4 text-sm text-neutral-500",
  cellCreatedAt: "px-6 py-4 text-sm whitespace-nowrap text-neutral-500",
  metadataContainer:
    "max-h-32 overflow-y-auto rounded-md bg-neutral-50 p-3 border border-neutral-200",
  metadataContent: "text-xs whitespace-pre-wrap font-mono text-neutral-700",
  emptyState: "text-neutral-600 py-8 text-center",
  tagId: "font-mono text-xs bg-neutral-100 px-2 py-0.5 rounded",
  loadingState: "text-neutral-600 py-4",
  errorState: "text-danger-600 py-4",
};

export function EventsDisplay({ tagId }: EventsDisplayProps) {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastFetchedTimestamp = useRef<string | null>(null);

  const fetchEvents = useCallback(
    async (isInitialLoad = false) => {
      if (isInitialLoad) {
        setLoading(true);
        setError(null);
      }

      try {
        const params = new URLSearchParams();
        params.append("tagId", tagId);

        if (!isInitialLoad && lastFetchedTimestamp.current) {
          params.append("since", lastFetchedTimestamp.current);
        }

        const response = await fetch(`/api/events?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const newEvents: AnalyticsEvent[] = data.events ?? [];

        if (newEvents.length > 0) {
          const sortedNewEvents = newEvents.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );

          setEvents((prevEvents) => {
            const existingEventIds = new Set(
              prevEvents.map((event) => event.id),
            );

            const uniqueNewEvents = sortedNewEvents.filter(
              (event) => !existingEventIds.has(event.id),
            );

            return [...uniqueNewEvents, ...prevEvents];
          });

          if (sortedNewEvents.length > 0) {
            lastFetchedTimestamp.current = sortedNewEvents[0]!.createdAt;
          }
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again.");
      } finally {
        if (isInitialLoad) {
          setLoading(false);
          setInitialLoad(false);
        }
      }
    },
    [tagId],
  );

  useEffect(() => {
    if (!tagId) {
      setError("No tag ID provided for event display.");
      setLoading(false);
      return;
    }

    fetchEvents(true);

    const interval = setInterval(() => {
      fetchEvents(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [tagId, fetchEvents]);

  if (initialLoad && loading) {
    return <p className={styles.loadingState}>Loading events...</p>;
  }

  if (error) {
    return <p className={styles.errorState}>{error}</p>;
  }

  if (events.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>
          No events recorded yet for this tag (ID:{" "}
          <span className={styles.tagId}>{tagId.substring(0, 8)}...</span>)
        </p>
        <p className="mt-2 text-sm text-neutral-500">
          Please ensure the script is installed correctly on your website and
          interact with the page to generate events.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead className={styles.tableHead}>
          <tr>
            <th scope="col" className={styles.tableHeaderCell}>
              Event
            </th>
            <th scope="col" className={styles.tableHeaderCell}>
              Visitor
            </th>
            <th scope="col" className={styles.tableHeaderCell}>
              Metadata
            </th>
            <th scope="col" className={styles.tableHeaderCell}>
              Created at
            </th>
          </tr>
        </thead>
        <tbody className={styles.tableBody}>
          {events.map((event) => (
            <tr key={event.id} className={styles.tableRow}>
              <td className={styles.cellEventType}>
                {event.eventType}
                {event.eventName && (
                  <span className="text-neutral-500"> ({event.eventName})</span>
                )}
              </td>
              <td className={styles.cellVisitorId}>
                {event.visitorId.substring(0, 8)}...
              </td>
              <td className={styles.cellMetadata}>
                <div className={styles.metadataContainer}>
                  <pre className={styles.metadataContent}>
                    {JSON.stringify(event.metadata, null, 2)}
                  </pre>
                </div>
              </td>
              <td className={styles.cellCreatedAt}>
                {format(new Date(event.createdAt), "MMM d, yyyy HH:mm:ss")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
