'use client';

import { useState } from 'react';
import { ChevronsDown, ChevronsUp } from 'lucide-react';

// 按参考图展示的项目资源使用示例数据。
const clusters = [
  { name: 'SO-SHYC2', cpuUsed: 0, cpuTotal: 100, memoryUsed: 0, memoryTotal: 200 },
  { name: 'ali-alifr', cpuUsed: 4, cpuTotal: 100, memoryUsed: 8, memoryTotal: 200 },
  { name: 'alifr-test', cpuUsed: 0, cpuTotal: 100, memoryUsed: 0, memoryTotal: 200 },
  { name: 'jinrong-bjzdd', cpuUsed: 0, cpuTotal: 100, memoryUsed: 0, memoryTotal: 200 },
];
const resourceGroups = [
  [{ name: 'Deployment', count: 541, menuId: 'deployment' }, { name: 'StatefulSet', count: 65, menuId: 'statefulset' }, { name: 'DaemonSet', count: 4, menuId: 'daemonset' }, { name: 'CronJob', count: 30, menuId: 'cronjob' }, { name: 'Job', count: 18, menuId: 'job' }],
  [{ name: 'Service', count: 71, menuId: 'service' }, { name: 'ConfigMap', count: 27, menuId: 'configmap' }, { name: 'Secret', count: 43, menuId: 'secret' }, { name: 'PVC', count: 81, menuId: 'pvc' }],
  [{ name: '负载均衡', count: 141, menuId: 'loadbalancer' }, { name: 'ingress', count: 65, menuId: 'ingress' }],
];

export type ResourceMenuId = 'deployment' | 'statefulset' | 'daemonset' | 'cronjob' | 'job' | 'service' | 'configmap' | 'secret' | 'pvc' | 'loadbalancer' | 'ingress';

function UsageMetric({ label, used, total }: { label: string; used: number; total: number }) {
  const percentage = Math.round(used / total * 100);
  return (
    <div>
      <div className="flex items-center gap-2 text-[#63748A]">
        <span className="shrink-0 text-[#202020]">{label}：</span>
        <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage} aria-valuetext={`${used} / ${total}，${percentage}%`} className="h-2 min-w-8 flex-1 overflow-hidden rounded-full bg-[#F5F5F5]"><div className="h-full rounded-full bg-[#2E8CFF]" style={{ width: `${percentage}%` }} /></div>
        <span className="w-8 shrink-0">{percentage}%</span>
      </div>
      <p className="mt-1 leading-none"><span className="text-2xl font-semibold">{used}</span><span className="ml-1 text-lg text-[#8C9AAE]">/{total}</span></p>
    </div>
  );
}

export default function ProjectClusterUsage({ onViewResource }: { onViewResource?: (menuId: ResourceMenuId) => void } = {}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <section className="mt-5 bg-white p-6" aria-labelledby="project-cluster-usage-title">
      <h2 id="project-cluster-usage-title" className="mb-5 text-base font-medium">集群资源使用</h2>
      <div id="project-cluster-usage-cards" className={`flex gap-5 ${expanded ? 'flex-wrap' : 'overflow-x-auto'}`}>
        {clusters.map(cluster => <article key={cluster.name} aria-label={`集群 ${cluster.name}`} className="min-w-[240px] flex-[1_0_240px] rounded border border-[#E6ECF5] px-5 py-6"><h3 className="mb-5 font-semibold">{cluster.name}</h3><div className="space-y-5"><UsageMetric label="CPU使用（核）" used={cluster.cpuUsed} total={cluster.cpuTotal} /><UsageMetric label="内存使用（Gi）" used={cluster.memoryUsed} total={cluster.memoryTotal} /></div></article>)}
      </div>
      <div className="mt-2 flex justify-end"><button type="button" aria-expanded={expanded} aria-controls="project-cluster-usage-cards" onClick={() => setExpanded(value => !value)} className="flex cursor-pointer items-center text-[#0066FF]">{expanded ? '收起' : '展开'}{expanded ? <ChevronsUp className="h-4 w-4" /> : <ChevronsDown className="h-4 w-4" />}</button></div>
      <div className="mt-4 space-y-8" aria-label="项目资源数量">
        {resourceGroups.map((group, index) => <div key={index} className="grid grid-cols-2 gap-4 md:grid-cols-6">{group.map(resource => <article key={resource.name} className="rounded-lg bg-white px-2 py-5 text-center shadow-[0_2px_12px_rgba(49,99,160,0.16)]"><h3 className="text-sm xl:text-base">{resource.name}</h3><p className="mt-4 text-4xl font-semibold leading-tight text-[#666666]">{onViewResource ? <button type="button" onClick={() => onViewResource(resource.menuId as ResourceMenuId)} aria-label={`查看 ${resource.name} 列表`} className="cursor-pointer rounded text-[#0066FF] hover:text-[#0052CC] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0066FF]">{resource.count}</button> : resource.count}</p></article>)}</div>)}
      </div>
    </section>
  );
}
