import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import { fmtHourLabel } from "../utils/format";
import { Unit, toF } from "../utils/temp";
import type { Point } from "../hooks/useOpenMeteo";

type Props = {
  data: Point[];
  unit: Unit;
};

export default function TemperatureChart({ data, unit }: Props) {
  const mapped = data.map((d) => ({
    time: fmtHourLabel(d.time),
    value: unit === "C" ? d.tempC : toF(d.tempC)
  }));

  return (
    <div className="h-[360px] w-full rounded-2xl bg-slate-900/60 border border-slate-800 p-3">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mapped} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="time" minTickGap={24} />
          <YAxis
            domain={["auto", "auto"]}
            tickFormatter={(v) => `${v.toFixed(0)}°${unit}`}
            width={40}
          />
          <Tooltip
            formatter={(v: number) => [`${v.toFixed(1)}°${unit}`, "Temperature"]}
            labelClassName="!text-slate-200"
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#38bdf8"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
