'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import type { Project } from './ProjectManagement';

export interface ProjectConfiguration {
  regions: string[];
  zones: string[];
  clusters: { name: string; cpu: number; memory: number }[];
}

const regions = ['北京', '德国（法兰克福）', '马来西亚（吉隆坡）', '新加坡', '美国（弗吉尼亚）', '硅谷', '上海', '郑州'];
const zones = [
  { id: 'bjcm', label: 'bjcm(北京移动)' },
  { id: 'bjmd', label: 'bjmd(北京联通)' },
  { id: 'bjpdc', label: 'bjpdc(北京联通25G)' },
  { id: 'bjwdt', label: 'bjwdt(北京电信25G-特价)' },
  { id: 'bjzdt', label: 'bjzdt(北京电信25G)' },
];
const clusterNames = ['pub-bjmd', 'karmada-bjmd'];
const primaryButton = 'rounded bg-[#0066FF] px-5 hover:bg-[#0052CC]';

interface ProjectFormProps {
  project?: Project;
  projects: Project[];
  onCancel: () => void;
  onSave: (values: { name: string; namespace: string; configuration: ProjectConfiguration }) => void;
}

function FormRow({ label, children, htmlFor }: { label: string; children: ReactNode; htmlFor?: string }) {
  return <div className="flex items-start gap-4"><label htmlFor={htmlFor} className="w-28 shrink-0 pt-2 text-right text-[#63748A]"><span className="mr-1 text-red-500">*</span>{label}:</label><div className="min-w-0 flex-1">{children}</div></div>;
}

function Choice({ label, checked, onChange }: { label: string; checked: boolean | 'indeterminate'; onChange: (checked: boolean) => void }) {
  return <label className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap"><Checkbox checked={checked} onCheckedChange={value => onChange(value === true)} className="rounded-[2px] border-[#D8E0E8] shadow-none data-[state=checked]:border-[#0066FF] data-[state=checked]:bg-[#0066FF] data-[state=indeterminate]:bg-[#0066FF] data-[state=indeterminate]:text-white" />{label}</label>;
}

export default function ProjectForm({ project, projects, onCancel, onSave }: ProjectFormProps) {
  const [name, setName] = useState(project?.name ?? '');
  const [namespace, setNamespace] = useState(project?.namespace ?? '');
  const [selectedRegions, setSelectedRegions] = useState(project?.configuration?.regions ?? ['北京']);
  const [selectedZones, setSelectedZones] = useState(project?.configuration?.zones ?? ['bjmd']);
  const [selectedClusters, setSelectedClusters] = useState(project?.configuration?.clusters.map(cluster => cluster.name) ?? ['pub-bjmd']);
  const [quotas, setQuotas] = useState<Record<string, { cpu: string; memory: string }>>(() => Object.fromEntries(clusterNames.map(clusterName => {
    const cluster = project?.configuration?.clusters.find(item => item.name === clusterName);
    return [clusterName, { cpu: String(cluster?.cpu ?? 100), memory: String(cluster?.memory ?? 200) }];
  })));
  const [error, setError] = useState('');
  const availableZones = selectedRegions.includes('北京') ? zones : [];
  const availableClusters = selectedRegions.includes('北京') && selectedZones.includes('bjmd') ? clusterNames : [];
  const activeClusters = selectedClusters.filter(cluster => availableClusters.includes(cluster));
  const activeZones = selectedZones.filter(zone => availableZones.some(item => item.id === zone));
  const selectAllState = (selected: number, total: number): boolean | 'indeterminate' => selected === 0 ? false : selected === total ? true : 'indeterminate';

  const toggleRegion = (region: string, checked: boolean) => {
    setSelectedRegions(previous => checked ? [...previous, region] : previous.filter(item => item !== region));
    if (region === '北京' && !checked) { setSelectedZones([]); setSelectedClusters([]); }
  };
  const toggleZone = (zone: string, checked: boolean) => {
    setSelectedZones(previous => checked ? [...previous, zone] : previous.filter(item => item !== zone));
    if (zone === 'bjmd' && !checked) setSelectedClusters([]);
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fullNamespace = project ? namespace : `cptd-zy-${namespace.trim()}`;
    if (!name.trim()) { setError('请输入项目名称'); return; }
    if (projects.some(item => item.id !== project?.id && item.name === name.trim())) { setError('项目名称已存在，请使用其他名称'); return; }
    if (!project && (!namespace.trim() || !/^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/.test(namespace.trim()) || fullNamespace.length > 63)) { setError('命名空间请填写小写字母、数字或短横线，以字母或数字开头和结尾，总长度不超过63个字符'); return; }
    if (projects.some(item => item.id !== project?.id && item.namespace === fullNamespace)) { setError('K8S命名空间已存在'); return; }
    if (!selectedRegions.length || !activeZones.length || !activeClusters.length) { setError('请至少选择一个地域、可用区和集群'); return; }
    if (activeClusters.some(cluster => !Number.isInteger(Number(quotas[cluster].cpu)) || Number(quotas[cluster].cpu) <= 0 || Number(quotas[cluster].cpu) > 200 || !Number.isInteger(Number(quotas[cluster].memory)) || Number(quotas[cluster].memory) <= 0 || Number(quotas[cluster].memory) > 400)) { setError('所选集群的CPU须为1–200核，内存须为1–400Gi的整数'); return; }
    onSave({ name: name.trim(), namespace: fullNamespace, configuration: { regions: selectedRegions, zones: activeZones, clusters: activeClusters.map(cluster => ({ name: cluster, cpu: Number(quotas[cluster].cpu), memory: Number(quotas[cluster].memory) })) } });
  };

  return (
    <form onSubmit={submit} noValidate className="flex h-full flex-col bg-[#F6F8F9] text-sm text-[#4B5563]">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#E6E6E6] bg-white px-6"><h1 className="text-lg font-medium text-[#202020]">{project ? '编辑项目' : '创建项目'}</h1><button type="button" aria-label="关闭项目表单" onClick={onCancel} className="cursor-pointer text-[#8C9AAE] hover:text-gray-700"><X className="h-5 w-5" /></button></div>
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-7">
        <FormRow label="名称" htmlFor="project-name"><Input id="project-name" value={name} onChange={event => setName(event.target.value)} maxLength={100} aria-required="true" className="h-10 rounded border-[#D8E0E8] bg-white shadow-none" /></FormRow>
        <FormRow label="k8s命名空间" htmlFor="project-namespace"><div className="flex">{!project && <span className="flex h-10 shrink-0 items-center whitespace-nowrap rounded-l border border-r-0 border-[#D8E0E8] bg-[#F8F9FA] px-3">cptd-zy-</span>}<Input id="project-namespace" value={namespace} onChange={event => setNamespace(event.target.value)} disabled={Boolean(project)} maxLength={55} aria-required="true" className={`h-10 border-[#D8E0E8] bg-white shadow-none ${project ? 'rounded' : 'rounded-l-none rounded-r'}`} /></div></FormRow>
        <FormRow label="资源组"><div className="py-2 text-[#374151]">产品团队-专用</div></FormRow>
        <FormRow label="事业部"><div className="py-2 text-[#374151]">智汇云-云平台部-弹性计算</div></FormRow>
        <FormRow label="地域"><div className="flex flex-wrap gap-x-5 gap-y-3 py-2">{regions.map(region => <Choice key={region} label={region} checked={selectedRegions.includes(region)} onChange={checked => toggleRegion(region, checked)} />)}</div></FormRow>
        <FormRow label="可用区"><div className="space-y-5 py-2">{!!availableZones.length && <Choice label="全选" checked={selectAllState(activeZones.length, availableZones.length)} onChange={checked => { setSelectedZones(checked ? availableZones.map(zone => zone.id) : []); if (!checked) setSelectedClusters([]); }} />}<div className="flex flex-wrap gap-x-5 gap-y-3">{availableZones.map(zone => <Choice key={zone.id} label={zone.label} checked={selectedZones.includes(zone.id)} onChange={checked => toggleZone(zone.id, checked)} />)}{!availableZones.length && <span className="text-gray-400">暂无可用区</span>}</div></div></FormRow>
        <FormRow label="集群"><div className="space-y-5 bg-white p-3">{!!availableClusters.length && <><div className="flex flex-wrap items-center gap-5"><Choice label="全选" checked={selectAllState(activeClusters.length, availableClusters.length)} onChange={checked => setSelectedClusters(checked ? availableClusters : [])} /><div className="flex items-center gap-2 rounded bg-[#EEF6FF] px-3 py-2"><Info className="h-5 w-5 shrink-0 fill-[#1890FF] text-white" /><span>CPU、内存最大为200C400G，如需更多配额，请联系管理员</span></div></div>{availableClusters.map(cluster => <div key={cluster} className="flex flex-wrap items-center gap-x-6 gap-y-3"><div className="w-48"><Choice label={cluster} checked={selectedClusters.includes(cluster)} onChange={checked => setSelectedClusters(previous => checked ? [...previous, cluster] : previous.filter(item => item !== cluster))} /></div><label className="flex items-center gap-3 text-[#63748A]">CPU（核）：<Input type="number" aria-label={`${cluster} CPU（核）`} min={1} max={200} step={1} value={quotas[cluster].cpu} onChange={event => setQuotas(previous => ({ ...previous, [cluster]: { ...previous[cluster], cpu: event.target.value } }))} className="h-10 w-24 rounded border-[#D8E0E8] shadow-none" /></label><label className="flex items-center gap-3 text-[#63748A]">内存（Gi）：<Input type="number" aria-label={`${cluster} 内存（Gi）`} min={1} max={400} step={1} value={quotas[cluster].memory} onChange={event => setQuotas(previous => ({ ...previous, [cluster]: { ...previous[cluster], memory: event.target.value } }))} className="h-10 w-24 rounded border-[#D8E0E8] shadow-none" /></label></div>)}</>}{!availableClusters.length && <p className="py-3 text-gray-400">暂无可用集群</p>}</div></FormRow>
        {error && <p role="alert" className="pl-32 text-red-500">{error}</p>}
      </div>
      <div className="flex shrink-0 justify-end gap-3 border-t border-[#E6E6E6] bg-white px-5 py-3"><Button type="button" variant="outline" className="rounded border-[#D8E0E8] px-5 shadow-none" onClick={onCancel}>取消</Button><Button type="submit" className={primaryButton}>确定</Button></div>
    </form>
  );
}
