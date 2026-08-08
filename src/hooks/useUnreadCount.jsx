import { useEffect, useState } from "react";
import { useAuth } from "./useAuth.jsx";
import { getNotifications, unreadNotificationCount } from "../lib/api.js";

// Returns the real unread notification count for the signed-in farmer,
// refetched whenever the farmer changes. Returns 0 (not null) while
// loading/unavailable so badge UIs can render immediately without a
// separate loading state — a badge showing 0 is indistinguishable from
// "no badge" in the UI, so there's no misleading flash either way.
export function useUnreadCount() {
  const { farmer } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!farmer?.id) {
      setCount(0);
      return;
    }
    let cancelled = false;
    getNotifications(farmer.id)
      .then((rows) => {
        if (!cancelled) setCount(unreadNotificationCount(rows));
      })
      .catch(() => {
        if (!cancelled) setCount(0);
      });
    return () => {
      cancelled = true;
    };
  }, [farmer?.id]);

  return count;
}
