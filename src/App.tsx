import React, { useMemo, useState } from "react";
import TemperatureChart from "./components/TemperatureChart";
import StatCard from "./components/StatCard";
import { useOpenMeteo } from "./hooks/useOpenMeteo";
import { Unit, formatTemp } from "./utils/temp";
import { fmtLong } from "./utils/format";

type Point = { time: string; tempC: number };

function computeStats(pts: Point[]) {
  if (!pts.length) return null;
  const temps = pts.map((p) => p.tempC);
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const avg = temps.reduce((a, b) => a + b, 0) / temps.length;
  const latest = pts[pts.length - 1];
  const prev = pts[pts.length - 2];
  const delta = prev ? latest.tempC - prev.tempC : 0;
  return { min, max, avg, latest, delta };
}

export default function App() {
  const { loading, err, points, meta } = useOpenMeteo();
  const [unit, setUnit] = useState<Unit>("C");

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const filteredPoints = useMemo(() => {
    if (!points.length) return [];
    if (!startDate && !endDate) return points;

    const start = startDate ? new Date(startDate + "T00:00:00") : new Date(points[0].time);
    const end = endDate ? new Date(endDate + "T23:59:59") : new Date(points[points.length - 1].time);

    return points.filter((p) => {
      const d = new Date(p.time);
      return d >= start && d <= end;
    });
  }, [points, startDate, endDate]);

  const fstats = useMemo(() => computeStats(filteredPoints), [filteredPoints]);

  const latestLabel = useMemo(() => {
    if (!fstats?.latest) return "-";
    return fmtLong(fstats.latest.time);
  }, [fstats]);

  const setAug19to21 = () => {
    const year = points.length ? new Date(points[0].time).getFullYear() : new Date().getFullYear();
    setStartDate(`${year}-08-19`);
    setEndDate(`${year}-08-21`);
  };

  const clearRange = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-5 md:px-6 py-6 md:py-8">
      <header className="mb-5 md:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
          IcalUwU Weather - Kota Bekasi
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Hourly temperature (timezone API: {meta.timezone ?? "?"}
          {meta.tzAbbr ? ` • ${meta.tzAbbr}` : ""})
        </p>
      </header>

      {/* Controls */}
      <section className="mb-4 md:mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Unit toggle + actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-2xl border border-slate-800 overflow-hidden">
            <button
              onClick={() => setUnit("C")}
              className={`px-3 py-1 ${unit === "C" ? "bg-sky-500 text-black" : "bg-slate-900"}`}
            >
              °C
            </button>
            <button
              onClick={() => setUnit("F")}
              className={`px-3 py-1 ${unit === "F" ? "bg-sky-500 text-black" : "bg-slate-900"}`}
            >
              °F
            </button>
          </div>
          <button
            onClick={() => location.reload()}
            className="px-3 py-1 rounded-2xl border border-slate-800 hover:bg-slate-900"
            title="Refresh data"
          >
            Refresh
          </button>
        </div>

        {/* Date range */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-sm text-slate-400">Dari</label>
          <input
            type="date"
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1 w-[150px] sm:w-auto"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <label className="text-sm text-slate-400">sampai</label>
          <input
            type="date"
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1 w-[150px] sm:w-auto"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Preset & docs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={clearRange}
            className="px-3 py-1 rounded-2xl border border-slate-800 hover:bg-slate-900"
          >
            Reset
          </button>
          <button
            onClick={setAug19to21}
            className="px-3 py-1 rounded-2xl border border-slate-800 hover:bg-slate-900"
          >
            19–21 Ags
          </button>
          <a
            className="px-3 py-1 rounded-2xl border border-slate-800 hover:bg-slate-900"
            href="https://api.open-meteo.com/"
            target="_blank"
            rel="noreferrer"
          >
            Open‑Meteo Docs
          </a>
        </div>
      </section>

      {loading && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          Memuat data...
        </div>
      )}

      {err && (
        <div className="rounded-2xl border border-rose-800 bg-rose-950/50 p-4">
          Gagal memuat: {err}
        </div>
      )}

      {!loading && !err && fstats && (
        <>
          {/* Stats: 2 cols on mobile, 4 on md+ */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
            <StatCard label="Suhu Terkini" value={formatTemp(fstats.latest.tempC, unit)} sub={latestLabel} />
            <StatCard label="Rata-rata" value={formatTemp(fstats.avg, unit)} />
            <StatCard label="Maksimum" value={formatTemp(fstats.max, unit)} />
            <StatCard
              label="Perubahan (jam terakhir)"
              value={`${(unit === "C" ? fstats.delta : (fstats.delta * 9) / 5).toFixed(1)}°${unit}`}
            />
          </div>

          <TemperatureChart data={filteredPoints} unit={unit} />

          {/* Data list (mobile) */}
          <div className="md:hidden mt-4 space-y-2">
            {filteredPoints.map((p) => (
              <div key={p.time} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
                <div className="text-sm text-slate-400">{fmtLong(p.time)}</div>
                <div className="text-lg font-semibold">
                  {formatTemp(p.tempC, unit)}
                </div>
              </div>
            ))}
          </div>

          {/* Table (desktop) */}
          <div className="hidden md:block mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-900 sticky top-0">
                <tr>
                  <th className="text-left px-4 py-2">Waktu</th>
                  <th className="text-left px-4 py-2">Suhu</th>
                </tr>
              </thead>
              <tbody>
                {filteredPoints.map((p) => (
                  <tr key={p.time} className="odd:bg-slate-900/30">
                    <td className="px-4 py-2">{fmtLong(p.time)}</td>
                    <td className="px-4 py-2">{formatTemp(p.tempC, unit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <footer className="mt-8 text-sm text-slate-500">
            Develop by Teuku Vaickal Rizki Irdian
          </footer>
        </>
      )}
    </div>
  );
}
