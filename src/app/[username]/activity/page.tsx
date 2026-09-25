"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Activity, Loader2 } from "lucide-react";

interface ActivityData {
  date: string;
  count: number;
}

export default function ActivityPage() {
  const params = useParams();
  const username = params?.username as string;

  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalActivity, setTotalActivity] = useState(0);
  const [maxCount, setMaxCount] = useState(0);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await fetch("/api/activity");
      const data = await res.json();
      if (res.ok) {
        setActivities(data.activities || []);
        const total = (data.activities || []).reduce((sum: number, a: ActivityData) => sum + a.count, 0);
        setTotalActivity(total);
        const max = Math.max(...(data.activities || []).map((a: ActivityData) => a.count), 1);
        setMaxCount(max);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getColor = (count: number) => {
    if (count === 0) return "bg-white/5";
    const intensity = Math.min(Math.ceil((count / maxCount) * 4), 4);
    switch (intensity) {
      case 1:
        return "bg-sky-300/20";
      case 2:
        return "bg-sky-300/40";
      case 3:
        return "bg-sky-300/60";
      case 4:
        return "bg-sky-300/80";
      default:
        return "bg-white/5";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="animate-spin mx-auto" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold mb-2 flex items-center gap-2">
          <Activity className="text-emerald-400" /> Activity
        </h1>
        <p className="text-gray-400">
          {totalActivity} hoạt động trong 30 ngày qua
        </p>
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Heatmap 30 ngày</h3>
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            const dateStr = date.toISOString().split("T")[0];
            const activity = activities.find((a) => a.date === dateStr);
            const count = activity?.count || 0;

            return (
              <div
                key={dateStr}
                className={`aspect-square rounded-md ${getColor(count)} flex items-center justify-center text-xs text-gray-500`}
                title={`${dateStr}: ${count} hoạt động`}
              >
                {count > 0 && count}
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
          <span>Ít</span>
          <div className="w-3 h-3 rounded bg-white/5"></div>
          <div className="w-3 h-3 rounded bg-sky-300/20"></div>
          <div className="w-3 h-3 rounded bg-sky-300/40"></div>
          <div className="w-3 h-3 rounded bg-sky-300/60"></div>
          <div className="w-3 h-3 rounded bg-sky-300/80"></div>
          <span>Nhiều</span>
        </div>
      </div>
    </div>
  );
}
