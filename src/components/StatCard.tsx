import React from "react";

type Props = {
  label: string;
  value: string;
  sub?: string;
};
export default function StatCard({ label, value, sub }: Props) {
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4">
      <div className="text-slate-400 text-sm">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {sub && <div className="text-slate-400 text-xs mt-1">{sub}</div>}
    </div>
  );
}
