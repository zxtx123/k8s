'use client';

import { Check, Copy, ChevronDown, Search, MoreHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import ResourceBreadcrumb from '@/components/layout/ResourceBreadcrumb';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const tabs = ['应用镜像', '项目镜像', '基础镜像', '公司镜像'];

function CopyButton({ value, label }: { value: string; label: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  useEffect(() => {
    if (status === 'idle') return;
    const timer = window.setTimeout(() => setStatus('idle'), 2000);
    return () => window.clearTimeout(timer);
  }, [status]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setStatus('copied');
    } catch {
      setStatus('error');
    }
  };

  return (
    <button type="button" aria-label={`复制${label}`} title={status === 'copied' ? '已复制' : status === 'error' ? '复制失败，请手动复制' : `复制${label}`} onClick={copy} className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-[#0066FF] hover:bg-[#EEF6FF] focus-visible:outline-2 focus-visible:outline-[#0066FF]">
      {status === 'copied' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      <span className="sr-only" role="status">{status === 'copied' ? '已复制' : status === 'error' ? '复制失败，请手动复制' : ''}</span>
    </button>
  );
}

export default function ImageService() {
  const [activeTab, setActiveTab] = useState('应用镜像');
  const [search, setSearch] = useState('');
  const hasScopedCredentials = activeTab === '应用镜像' || activeTab === '项目镜像';

  return (
    <div className="flex h-full min-w-0 flex-col bg-[#F0F5F7] text-sm text-[#202020]">
      <ResourceBreadcrumb resource={<span className="font-medium text-[#202020]">镜像服务</span>} />
      <div className="min-h-0 flex-1 overflow-auto p-6">
        <section className="min-h-[410px] bg-white px-5 pt-4 shadow-sm">
          <div className="flex h-12 items-end gap-12 border-b border-[#E6E6E6]">
            {tabs.map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`h-12 px-4 text-base transition-colors ${activeTab === tab ? 'border-b-2 border-[#0066FF] font-medium text-[#0066FF]' : 'text-[#666666] hover:text-[#202020]'}`}>{tab}</button>)}
          </div>
          {hasScopedCredentials ? (
            <div className="overflow-x-auto border-b border-[#E6E6E6] py-3 text-sm text-[#666666]">
              <div className="flex min-h-8 items-center gap-4 whitespace-nowrap">
                <div className="flex min-w-[160px] max-w-[320px] items-center gap-1">
                  <span className="mr-1 shrink-0">当前仓库</span>
                  <span title="harbor.qihoo.net/stark-test1-zxtest" className="truncate text-[#202020]">harbor.qihoo.net/stark-test1-zxtest</span>
                  <CopyButton value="harbor.qihoo.net/stark-test1-zxtest" label="仓库地址" />
                </div>
                <div className="flex shrink-0 items-center gap-1"><span className="mr-1">用户名</span><span className="text-[#202020]">stark-test1-zxtest</span><CopyButton value="stark-test1-zxtest" label={activeTab === '应用镜像' ? '应用级用户名' : '用户名'} /></div>
                <div className="flex shrink-0 items-center gap-1"><span className="mr-1">密码</span><span className="text-[#202020]">YqdySh6ldVuKsvkQCK</span><CopyButton value="YqdySh6ldVuKsvkQCK" label={activeTab === '应用镜像' ? '应用级密码' : '密码'} /></div>
                <div className="ml-auto flex shrink-0 items-center gap-3">
                  {activeTab === '应用镜像' && <Popover>
                    <PopoverTrigger asChild><button type="button" className="text-[#0066FF] hover:underline">项目凭证</button></PopoverTrigger>
                    <PopoverContent aria-label="项目凭证" align="end" sideOffset={8} className="z-[1200] w-[360px] max-w-[calc(100vw-32px)] rounded border border-[#D8E0E8] bg-white p-4 text-sm shadow-md">
                      <h3 className="mb-3 border-b border-[#E6E6E6] pb-3 font-medium text-[#202020]">项目凭证</h3>
                      <div role="group" aria-label="项目级凭据" className="space-y-2 text-[#666666]">
                        <div className="flex items-center gap-2"><span className="w-12 shrink-0">用户名</span><span className="min-w-0 break-all text-[#202020]">project-demo</span><CopyButton value="project-demo" label="项目级用户名" /></div>
                        <div className="flex items-center gap-2"><span className="w-12 shrink-0">密码</span><span className="min-w-0 break-all text-[#202020]">demo-project-password</span><CopyButton value="demo-project-password" label="项目级密码" /></div>
                      </div>
                    </PopoverContent>
                  </Popover>}
                  <button className="flex items-center gap-1 text-[#0066FF] hover:underline">推送命令<ChevronDown className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ) : <div className="flex min-h-[74px] items-center gap-8 border-b border-[#E6E6E6] text-sm text-[#4B5563]">
            <span>当前仓库名称</span><span className="text-[#202020]">harbor.qihoo.net/stark-test1-zxtest</span><button className="flex items-center gap-1 text-[#0066FF] hover:underline"><Copy className="h-4 w-4" />复制</button>
            <span className="ml-2">用户名</span><span className="text-[#202020]">stark-test1-zxtest</span>
            <span className="ml-2">密码</span><span className="text-[#202020]">YqdySh6ldVuKsvkQCK</span>
            <button className="ml-auto flex items-center gap-1 whitespace-nowrap text-[#0066FF] hover:underline">推送命令<ChevronDown className="h-4 w-4" /></button>
            <div className="relative w-60"><input aria-label="搜索镜像名称" value={search} onChange={event => setSearch(event.target.value)} placeholder="镜像名称" className="h-10 w-full rounded border border-[#D8E0E8] px-3 pr-9 outline-none focus:border-[#0066FF]" /><Search className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-[#8C9AAE]" /></div>
          </div>}
          {hasScopedCredentials && <div className="flex justify-end py-3"><div className="relative w-60 max-w-full"><input aria-label="搜索镜像名称" value={search} onChange={event => setSearch(event.target.value)} placeholder="镜像名称" className="h-8 w-full rounded border border-[#D8E0E8] px-3 pr-9 outline-none focus:border-[#0066FF]" /><Search className="pointer-events-none absolute right-3 top-2 h-4 w-4 text-[#8C9AAE]" /></div></div>}
          <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_0.7fr] bg-[#F8F9FA] text-[#202020]"><div className="px-3 py-4 font-medium">镜像名称</div><div className="px-3 py-4 font-medium">漏洞数量 <span className="text-[#8C9AAE]">↕</span></div><div className="px-3 py-4 font-medium">下载数</div><div className="px-3 py-4 font-medium">更新时间</div><div className="px-3 py-4 font-medium">操作</div></div>
          <div className="flex h-52 flex-col items-center justify-center border-b border-[#E6E6E6] text-[#63748A]"><div className="mb-3 flex h-12 w-16 items-center justify-center rounded border-2 border-[#D8E0E8] text-[#D8E0E8]"><MoreHorizontal className="h-7 w-7" /></div><span>暂无数据</span></div>
        </section>
      </div>
    </div>
  );
}
