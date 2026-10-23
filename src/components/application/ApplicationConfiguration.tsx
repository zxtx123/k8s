'use client';

import { useState, type FormEvent } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const initialQuota = { cpuLimit: '9', memoryLimit: '16', cpuRequest: '33', memoryRequest: '60', replicas: '400' };
type QuotaField = keyof typeof initialQuota;
const featureOptions = [
  { id: 'ingressCaptcha', label: '下线Ingress验证码校验' },
  { id: 'lvsCaptcha', label: '下线LVS验证码校验' },
  { id: 'deploymentCaptcha', label: '下线Deployment验证码校验' },
  { id: 'statefulsetCaptcha', label: '下线Statefulset验证码校验' },
  { id: 'serviceCaptcha', label: '下线Service验证码校验' },
  { id: 'workloadVersionRetention', label: '工作负载版本保留数量' },
  { id: 'sharedPvc', label: '同项目下PVC共享' },
] as const;
type FeatureId = typeof featureOptions[number]['id'];
type FeatureSettings = Record<FeatureId, boolean>;
const initialFeatures: FeatureSettings = {
  ingressCaptcha: false,
  lvsCaptcha: false,
  deploymentCaptcha: false,
  statefulsetCaptcha: false,
  serviceCaptcha: false,
  workloadVersionRetention: false,
  sharedPvc: false,
};

function QuotaInput({ field, label, unit, value, editing, onChange }: { field: QuotaField; label: string; unit: string; value: string; editing: boolean; onChange: (field: QuotaField, value: string) => void }) {
  const percentage = field === 'cpuRequest' || field === 'memoryRequest';
  return (
    <div className="flex min-w-0 items-center gap-4">
      <label htmlFor={`application-${field}`} className="w-36 shrink-0 text-[#63748A]">{label}</label>
      <div className="flex min-w-0 flex-1 overflow-hidden rounded border border-[#D9D9D9] focus-within:border-[#0066FF]">
        <input id={`application-${field}`} type="number" min={0} max={percentage ? 100 : undefined} step={field === 'replicas' || percentage ? 1 : 'any'} required disabled={!editing} value={value} onChange={event => onChange(field, event.target.value)} className="h-10 min-w-0 flex-1 bg-white px-4 text-[#202020] outline-none disabled:bg-[#F5F5F5] disabled:text-[#B6C6D8]" />
        <span className="flex w-12 shrink-0 items-center justify-center border-l border-[#D9D9D9] bg-[#FAFAFA]">{unit}</span>
      </div>
    </div>
  );
}

export default function ApplicationConfiguration() {
  const [quota, setQuota] = useState(initialQuota);
  const [draft, setDraft] = useState(initialQuota);
  const [editing, setEditing] = useState(false);
  const [features, setFeatures] = useState<FeatureSettings>(initialFeatures);
  const [featureDraft, setFeatureDraft] = useState<FeatureSettings>(initialFeatures);
  const onChange = (field: QuotaField, value: string) => setDraft(previous => ({ ...previous, [field]: value }));
  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQuota(draft);
    setEditing(false);
  };

  return (
    <div className="min-h-full bg-[#F0F5F7] p-3 text-sm text-[#202020]">
      <Tabs defaultValue="quota" className="gap-0 bg-white">
        <div className="border-b border-[#E6E6E6]">
          <TabsList aria-label="应用配置选项" className="h-14 justify-start gap-8 rounded-none bg-white p-0">
            {[['quota', '工作负载配额'], ['features', '功能设置']].map(([value, label]) => <TabsTrigger key={value} value={value} className="h-14 cursor-pointer rounded-none border-0 border-b-2 border-transparent px-5 text-sm text-[#666666] data-[state=active]:border-[#0066FF] data-[state=active]:text-[#0066FF] data-[state=active]:shadow-none">{label}</TabsTrigger>)}
          </TabsList>
        </div>
        <TabsContent value="quota" className="p-6">
          <form onSubmit={save}>
            <div className="mb-1 flex h-10 justify-end gap-3">
              {editing ? <><button type="button" onClick={() => { setDraft(quota); setEditing(false); }} className="cursor-pointer rounded border border-[#D8E0E8] px-5 hover:bg-[#F8F9FA]">取消</button><button type="submit" className="cursor-pointer rounded bg-[#0066FF] px-5 text-white hover:bg-[#0052CC]">保存</button></> : <button type="button" onClick={() => { setDraft(quota); setEditing(true); }} className="cursor-pointer rounded bg-[#0066FF] px-5 text-white hover:bg-[#0052CC]">编辑</button>}
            </div>
            <div className="grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-2">
              <section className="space-y-6"><h3 className="font-semibold text-[#4B5563]">单容器资源限制</h3><QuotaInput field="cpuLimit" label="CPU Limit" unit="核" value={draft.cpuLimit} editing={editing} onChange={onChange} /><QuotaInput field="memoryLimit" label="Memory Limit" unit="G" value={draft.memoryLimit} editing={editing} onChange={onChange} /></section>
              <section className="space-y-6"><h3 className="font-semibold text-[#4B5563]">单容器共享型资源限制</h3><QuotaInput field="cpuRequest" label="CPU Request" unit="%" value={draft.cpuRequest} editing={editing} onChange={onChange} /><QuotaInput field="memoryRequest" label="Memory Request" unit="%" value={draft.memoryRequest} editing={editing} onChange={onChange} /></section>
            </div>
            <div className="my-6 border-t border-[#E6E6E6]" />
            <div className="grid grid-cols-1 gap-x-12 pb-6 lg:grid-cols-2"><QuotaInput field="replicas" label="单集群副本数限制" unit="份" value={draft.replicas} editing={editing} onChange={onChange} /></div>
          </form>
        </TabsContent>
        <TabsContent value="features" className="p-6">
          <div className="flex justify-end">
            {editing ? <div className="flex gap-3"><button type="button" onClick={() => { setFeatureDraft(features); setEditing(false); }} className="cursor-pointer rounded border border-[#D8E0E8] px-5 hover:bg-[#F8F9FA]">取消</button><button type="button" onClick={() => { setFeatures(featureDraft); setEditing(false); }} className="cursor-pointer rounded bg-[#0066FF] px-5 text-white hover:bg-[#0052CC]">保存</button></div> : <button type="button" onClick={() => { setFeatureDraft(features); setEditing(true); }} className="cursor-pointer rounded bg-[#0066FF] px-5 text-white hover:bg-[#0052CC]">编辑</button>}
          </div>
          <div className="mt-2 space-y-7">
            {featureOptions.map(feature => <div key={feature.id} className="flex items-center gap-8"><span className="w-80 shrink-0 text-[#63748A]"><span className="mr-1 text-[#FF4D4F]">*</span>{feature.label}：</span><div className="flex items-center gap-5 text-[#B6C6D8]"><label className="flex items-center gap-2"><input type="radio" name={feature.id} checked={featureDraft[feature.id]} disabled={!editing} onChange={() => setFeatureDraft(previous => ({ ...previous, [feature.id]: true }))} className="h-5 w-5 accent-[#0066FF]" />开启</label><label className="flex items-center gap-2"><input type="radio" name={feature.id} checked={!featureDraft[feature.id]} disabled={!editing} onChange={() => setFeatureDraft(previous => ({ ...previous, [feature.id]: false }))} className="h-5 w-5 accent-[#0066FF]" />关闭</label></div></div>)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
