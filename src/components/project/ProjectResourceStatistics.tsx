'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const applicationUsage = [
  { name: 'wjw-test', cpu: 22, memory: 42, color: '#4484ED' },
  { name: 'zzq-test', cpu: 13, memory: 26, color: '#DF2932' },
  { name: 'monitor', cpu: 12, memory: 24, color: '#F7C406' },
  { name: 'zetao-test', cpu: 9, memory: 17, color: '#35BC53' },
  { name: 'hstest', cpu: 8, memory: 16, color: '#39CFF3' },
];

// 参考图示例数据；“其他”为 Top 5 之外的应用用量汇总。
const chartUsage = [...applicationUsage, { name: '其他', cpu: 24, memory: 47, color: '#F7F0A2' }];

function UsageChart({ metric, title, unit }: { metric: 'cpu' | 'memory'; title: string; unit: string }) {
  return (
    <section className="min-w-0" aria-label={`${title} Top 5`}>
      <h2 className="text-center text-xl font-semibold text-[#333333]">{title}</h2>
      <p className="mt-1 text-center text-sm text-[#999999]">top 5</p>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <PieChart accessibilityLayer>
            <Pie data={chartUsage} dataKey={metric} nameKey="name" cx="50%" cy="50%" outerRadius={76} startAngle={90} endAngle={-270} stroke="none" isAnimationActive={false} label={({ name }) => name} labelLine={{ strokeWidth: 1 }} fontSize={12}>
              {chartUsage.map(application => <Cell key={application.name} fill={application.color} />)}
            </Pie>
            <Tooltip formatter={value => [`${value} ${unit}`, title]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="mx-auto flex max-w-[390px] flex-wrap justify-center gap-x-3 gap-y-2 px-3 text-xs text-[#666666]" aria-label={`${title}图例`}>
        {chartUsage.map(application => <li key={application.name} className="flex items-center gap-1.5"><span className="h-3.5 w-6 rounded-sm" style={{ backgroundColor: application.color }} aria-hidden="true" />{application.name}</li>)}
      </ul>
    </section>
  );
}

export default function ProjectResourceStatistics() {
  return (
    <div className="min-h-full bg-white px-3 pb-5 pt-6">
      <div className="grid grid-cols-2 gap-4 pb-6">
        <UsageChart metric="cpu" title="CPU使用(核)" unit="核" />
        <UsageChart metric="memory" title="内存使用(G)" unit="G" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] table-fixed text-left text-[#63748A]" aria-label="应用资源使用明细">
          <thead className="bg-[#E8EDF5] text-xs"><tr>{['应用列表', 'CPU使用(核)', '内存使用(G)'].map(label => <th key={label} scope="col" className="px-4 py-4 font-medium">{label}</th>)}</tr></thead>
          <tbody>{applicationUsage.map(application => <tr key={application.name} className="even:bg-[#F5F7FA]"><td className="px-4 py-4">{application.name}</td><td className="px-4 py-4">{application.cpu}</td><td className="px-4 py-4">{application.memory}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
