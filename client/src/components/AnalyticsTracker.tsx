import { useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export function AnalyticsTracker() {
    const [location] = useLocation();
    const trackMutation = trpc.analytics.trackVisit.useMutation();

    useEffect(() => {
        // Track page visit
        trackMutation.mutate({
            path: location,
            userAgent: navigator.userAgent
        });
    }, [location]);

    return null; // Renderless component
}
