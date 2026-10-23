'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const day = 24 * 60 * 60 * 1000;
const endDate = Date.UTC(2026, 9, 21);
// 参考图中的每日部署次数示例，未列出的日期为 0 次。
const releaseCounts: Record<string, number> = {
  '07-26': 1, '07-27': 4, '07-30': 2,
  '08-02': 2, '08-03': 8, '08-04': 1, '08-05': 1, '08-06': 6,
  '08-09': 1, '08-10': 1, '08-12': 1, '08-17': 3, '08-18': 5,
  '08-23': 1, '08-26': 1, '08-31': 2,
  '09-01': 3, '09-02': 5, '09-11': 2, '09-15': 9, '09-16': 6,
  '09-17': 1, '09-18': 2, '09-20': 1, '09-22': 4, '09-23': 1,
  '10-19': 5, '10-20': 3, '10-21': 2,
};

const releaseHistory = Array.from({ length: 90 }, (_, index) => {
  const date = endDate - (89 - index) * day;
  const key = new Date(date).toISOString().slice(5, 10);
  return { date, frequency: releaseCounts[key] ?? 0 };
});
const dateTicks = ['2026-07-26', '2026-07-30', '2026-08-20', '2026-09-10', '2026-10-01', '2026-10-21'].map(date => Date.parse(`${date}T00:00:00Z`));

function DateTick({ x = 0, y = 0, payload }: { x?: number; y?: number; payload?: { value: number } }) {
  const date = new Date(payload?.value ?? 0).toISOString();
  const anchor = date.slice(5, 10) === '07-26' || date.slice(5, 10) === '10-21' ? 'end' : 'middle';
  return <text x={x} y={y + 10} textAnchor={anchor} fill="#666666" fontSize={12}><tspan x={x}>{date.slice(5, 10)}</tspan><tspan x={x} dy={15}>{date.slice(0, 4)}</tspan></text>;
}

export default function ProjectReleaseHistory() {
  return (
    <section className="flex h-full min-h-[420px] flex-col bg-white px-3 pb-4 pt-6" aria-label="最近90天部署上线频数">
      <h2 className="text-center text-xl font-semibold text-[#333333]">部署上线频数</h2>
      <p className="mb-4 mt-1 text-center text-sm text-[#999999]">最近 90 天</p>
      <div className="flex min-h-0 flex-1 gap-4">
        <div className="min-w-0 flex-1">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={releaseHistory} margin={{ top: 4, right: 16, bottom: 8, left: 0 }} accessibilityLayer>
              <CartesianGrid stroke="#CCCCCC" strokeDasharray="0" />
              <XAxis dataKey="date" type="number" domain={[releaseHistory[0].date - day / 2, endDate + day / 2]} ticks={dateTicks} interval={0} tick={<DateTick />} height={42} axisLine={{ stroke: '#444444' }} tickLine={{ stroke: '#444444' }} />
              <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} width={32} tick={{ fill: '#666666', fontSize: 12 }} axisLine={{ stroke: '#444444' }} tickLine={{ stroke: '#444444' }} allowDecimals={false} />
              <Tooltip cursor={{ fill: '#0066FF', fillOpacity: 0.04 }} labelFormatter={value => new Intl.DateTimeFormat('zh-CN', { timeZone: 'UTC', year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'short' }).format(new Date(Number(value)))} formatter={value => [value, 'Freq']} contentStyle={{ backgroundColor: 'rgba(70,70,70,0.8)', border: 'none', borderRadius: 4, color: '#FFFFFF' }} itemStyle={{ color: '#FFFFFF', padding: 0 }} labelStyle={{ color: '#FFFFFF' }} />
              <Bar dataKey="frequency" name="Freq" fill="#45CFF3" barSize={5} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="relative mr-1 h-44 w-9 shrink-0 text-xs text-[#666666]" aria-label="频数色阶 0 至 10">
          <div className="absolute right-0 top-0 h-full w-5 bg-[linear-gradient(to_bottom,#D88474,#F5EBA9,#45CFF3)]" />
          <span className="absolute left-0 top-0">10</span><span className="absolute bottom-0 left-0">0</span>
        </div>
      </div>
    </section>
  );
}
