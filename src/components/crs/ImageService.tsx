'use client';

import { Copy, ChevronDown, Search, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import ResourceBreadcrumb from '@/components/layout/ResourceBreadcrumb';

const tabs = ['应用镜像', '项目镜像', '基础镜像', '公司镜像'];

export default function ImageService() {
  const [activeTab, setActiveTab] = useState('应用镜像');
  const [search, setSearch] = useState('');

  return (
    <div className="flex h-full min-w-0 flex-col bg-[#F0F5F7] text-sm text-[#202020]">
      <ResourceBreadcrumb resource={<span className="font-medium text-[#202020]">镜像服务</span>} />
      <div className="min-h-0 flex-1 overflow-auto p-6">
        <section className="min-h-[410px] bg-white px-5 pt-4 shadow-sm">
          <div className="flex h-12 items-end gap-12 border-b border-[#E6E6E6]">
            {tabs.map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`h-12 px-4 text-base transition-colors ${activeTab === tab ? 'border-b-2 border-[#0066FF] font-medium text-[#0066FF]' : 'text-[#666666] hover:text-[#202020]'}`}>{tab}</button>)}
          </div>
          <div className="flex min-h-[74px] items-center gap-8 border-b border-[#E6E6E6] text-sm text-[#4B5563]">
            <span>当前仓库名称</span><span className="text-[#202020]">harbor.qihoo.net/stark-test1-zxtest</span><button className="flex items-center gap-1 text-[#0066FF] hover:underline"><Copy className="h-4 w-4" />复制</button>
            <span className="ml-2">用户名</span><span className="text-[#202020]">stark-test1-zxtest</span>
            <span className="ml-2">密码</span><span className="text-[#202020]">YqdySh6ldVuKsvkQCK</span>
            <button className="ml-auto flex items-center gap-1 whitespace-nowrap text-[#0066FF] hover:underline">推送命令<ChevronDown className="h-4 w-4" /></button>
            <div className="relative w-60"><input aria-label="搜索镜像名称" value={search} onChange={event => setSearch(event.target.value)} placeholder="镜像名称" className="h-10 w-full rounded border border-[#D8E0E8] px-3 pr-9 outline-none focus:border-[#0066FF]" /><Search className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-[#8C9AAE]" /></div>
          </div>
          <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_0.7fr] bg-[#F8F9FA] text-[#202020]"><div className="px-3 py-4 font-medium">镜像名称</div><div className="px-3 py-4 font-medium">漏洞数量 <span className="text-[#8C9AAE]">↕</span></div><div className="px-3 py-4 font-medium">下载数</div><div className="px-3 py-4 font-medium">更新时间</div><div className="px-3 py-4 font-medium">操作</div></div>
          <div className="flex h-52 flex-col items-center justify-center border-b border-[#E6E6E6] text-[#63748A]"><div className="mb-3 flex h-12 w-16 items-center justify-center rounded border-2 border-[#D8E0E8] text-[#D8E0E8]"><MoreHorizontal className="h-7 w-7" /></div><span>暂无数据</span></div>
        </section>
      </div>
    </div>
  );
}
