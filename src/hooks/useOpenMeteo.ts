import { useEffect, useMemo, useState } from "react";
import { OPEN_METEO_URL } from "../config";
import { loadCache, saveCache } from "../utils/cache";

export type HourlyResponse = {
  hourly_units: { time: string; temperature_2m: string };
  hourly: { time: string[]; temperature_2m: number[] };
  timezone?: string;
  timezone_abbreviation?: string;
};

export type Point = { time: string; tempC: number };

export function useOpenMeteo() {
  const [points, setPoints] = useState<Point[]>([]);
  const [meta, setMeta] = useState<{ timezone?: string; tzAbbr?: string }>({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const cached = loadCache<{
      points: Point[];
      meta: { timezone?: string; tzAbbr?: string };
    }>("open-meteo:bekasi:hourly", 10 * 60 * 1000);
    if (cached) {
      setPoints(cached.points);
      setMeta(cached.meta);
      setLoading(false);
    }

    fetch(OPEN_METEO_URL, { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const j: HourlyResponse = await r.json();
        const pts: Point[] = j.hourly.time.map((t, i) => ({
          time: t,
          tempC: j.hourly.temperature_2m[i]
        }));
        const m = { timezone: j.timezone, tzAbbr: j.timezone_abbreviation };
        setPoints(pts);
        setMeta(m);
        saveCache("open-meteo:bekasi:hourly", { points: pts, meta: m });
        setErr(null);
      })
      .catch((e: any) => {
        if (!cached) setErr(e?.message || "Gagal memuat data");
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    if (!points.length) return null;
    const temps = points.map((p) => p.tempC);
    const min = Math.min(...temps);
    const max = Math.max(...temps);
    const avg = temps.reduce((a, b) => a + b, 0) / temps.length;
    const latest = points[points.length - 1];
    const prev = points[points.length - 2];
    const delta = prev ? latest.tempC - prev.tempC : 0;
    return { min, max, avg, latest, delta };
  }, [points]);

  return { points, meta, stats, loading, err };
}
