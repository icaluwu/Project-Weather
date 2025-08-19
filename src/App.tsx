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

  // Stats dari semua data (tanpa filter)
  const fstats = useMemo(() => computeStats(points), [points]);

  // Label "Suhu Terkini" menggunakan tanggal & jam SEKARANG (waktu device)
  const latestLabel = useMemo(() => {
    const now = new Date();
    const d = now.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const t = now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${d} pukul ${t}`;
  }, []);

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

      {/* Controls sederhana */}
      <section className="mb-4 md:mb-6 flex flex-wrap items-center gap-2">
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
        <a
          className="px-3 py-1 rounded-2xl border border-slate-800 hover:bg-slate-900"
          href="https://api.open-meteo.com/"
          target="_blank"
          rel="noreferrer"
        >
          Open‑Meteo Docs
        </a>
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
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
            <StatCard
              label="Suhu Terkini"
              value={formatTemp(fstats.latest.tempC, unit)}
              sub={latestLabel}
            />
            <StatCard label="Rata-rata" value={formatTemp(fstats.avg, unit)} />
            <StatCard label="Maksimum" value={formatTemp(fstats.max, unit)} />
            <StatCard
              label="Perubahan (jam terakhir)"
              value={`${(unit === "C" ? fstats.delta : (fstats.delta * 9) / 5).toFixed(1)}°${unit}`}
            />
          </div>

          {/* Grafik */}
          <TemperatureChart data={points} unit={unit} />

          {/* List mobile */}
          <div className="md:hidden mt-4 space-y-2">
            {points.map((p) => (
              <div key={p.time} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
                <div className="text-sm text-slate-400">{fmtLong(p.time)}</div>
                <div className="text-lg font-semibold">{formatTemp(p.tempC, unit)}</div>
              </div>
            ))}
          </div>

          {/* Tabel desktop */}
          <div className="hidden md:block mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-900 sticky top-0">
                <tr>
                  <th className="text-left px-4 py-2">Waktu</th>
                  <th className="text-left px-4 py-2">Suhu</th>
                </tr>
              </thead>
              <tbody>
                {points.map((p) => (
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
