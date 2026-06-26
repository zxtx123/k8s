'use client';

import { useState } from 'react';

const mockData = [
  {
    type: 'Warning',
    reason: 'ApplyPolicyFailed',
    source: 'resource-detector',
    relatedObject: 'zxtest-test',
    cluster: 'share-bjmd',
    firstSeen: '2026-06-01 15:14:32',
    lastSeen: '2026-06-01 15:17:16',
    count: 16,
    triggerTime: '2026-06-01 15:17:16',
    event: 'Apply policy(stark-test/zxtest-test) failed: default InterpretReplica interpreter for "/v1, Kind=Secret" not found',
  },
];

export default function EventManagement() {
  const [clusterFilter, setClusterFilter] = useState('全部');
  const [resourceFilter, setResourceFilter] = useState('全部');
  const [reasonFilter, setReasonFilter] = useState('全部');
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="flex flex-col h-full">
      {/* 面包屑导航 */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#E5E6EB]">
        <div className="text-sm text-[#86909C]">
          <span>stark测试</span>
          <span className="mx-1">&gt;</span>
          <span>zxtest</span>
          <span className="mx-1">&gt;</span>
          <span className="text-[#1F2329]">事件</span>
        </div>
        <a href="#" className="text-sm text-[#165DFF]">
          CIS帮助文档
        </a>
      </div>

      {/* 筛选栏 */}
      <div className="px-6 py-3 bg-[#F7F8FA] border-b border-[#E5E6EB]">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1">
            <input
              type="text"
              placeholder="2026/05/28"
              className="h-8 text-xs border border-[#E5E6EB] rounded px-2 text-[#1F2329] w-[110px] bg-white"
            />
            <span className="text-[#86909C] text-xs">~</span>
            <input
              type="text"
              placeholder="2026/06/04"
              className="h-8 text-xs border border-[#E5E6EB] rounded px-2 text-[#1F2329] w-[110px] bg-white"
            />
          </div>
          <select
            className="h-8 text-xs border border-[#E5E6EB] rounded px-2 text-[#1F2329] bg-white min-w-[90px]"
            value={clusterFilter}
            onChange={(e) => setClusterFilter(e.target.value)}
          >
            <option>全部</option>
            <option>share-bjmd</option>
          </select>
          <select
            className="h-8 text-xs border border-[#E5E6EB] rounded px-2 text-[#1F2329] bg-white min-w-[90px]"
            value={resourceFilter}
            onChange={(e) => setResourceFilter(e.target.value)}
          >
            <option>全部</option>
          </select>
          <select
            className="h-8 text-xs border border-[#E5E6EB] rounded px-2 text-[#1F2329] bg-white min-w-[90px]"
            value={reasonFilter}
            onChange={(e) => setReasonFilter(e.target.value)}
          >
            <option>全部</option>
          </select>
          <div className="relative">
            <input
              type="text"
              placeholder="类型/来源"
              className="h-8 text-xs border border-[#E5E6EB] rounded px-2 pr-7 text-[#1F2329] w-[130px] bg-white"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <svg className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 text-[#86909C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* 表格 */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="border border-[#E5E6EB] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F7F8FA]">
                <th className="text-left px-3 py-3 text-[#1F2329] font-medium whitespace-nowrap">类型</th>
                <th className="text-left px-3 py-3 text-[#1F2329] font-medium whitespace-nowrap">原因</th>
                <th className="text-left px-3 py-3 text-[#1F2329] font-medium whitespace-nowrap">来源</th>
                <th className="text-left px-3 py-3 text-[#1F2329] font-medium whitespace-nowrap">关联对象</th>
                <th className="text-left px-3 py-3 text-[#1F2329] font-medium whitespace-nowrap">所属集群</th>
                <th className="text-left px-3 py-3 text-[#1F2329] font-medium whitespace-nowrap">首次出现时间</th>
                <th className="text-left px-3 py-3 text-[#1F2329] font-medium whitespace-nowrap">最后出现时间</th>
                <th className="text-left px-3 py-3 text-[#1F2329] font-medium whitespace-nowrap">次数</th>
                <th className="text-left px-3 py-3 text-[#1F2329] font-medium whitespace-nowrap">触发时间</th>
                <th className="text-left px-3 py-3 text-[#1F2329] font-medium whitespace-nowrap">事件</th>
                <th className="text-left px-3 py-3 text-[#86909C] font-medium whitespace-nowrap w-8">
                  <svg className="w-4 h-4 text-[#86909C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((item, idx) => (
                <tr key={idx} className="border-t border-[#E5E6EB] hover:bg-[#F7F8FA]">
                  <td className="px-3 py-2.5">
                    <span className="text-[#FA8C16] text-xs">{item.type}</span>
                  </td>
                  <td className="px-3 py-2.5 text-[#1F2329] text-xs">{item.reason}</td>
                  <td className="px-3 py-2.5 text-[#1F2329] text-xs">{item.source}</td>
                  <td className="px-3 py-2.5 text-[#1F2329] text-xs">{item.relatedObject}</td>
                  <td className="px-3 py-2.5 text-[#1F2329] text-xs">{item.cluster}</td>
                  <td className="px-3 py-2.5 text-[#86909C] text-xs whitespace-nowrap">{item.firstSeen}</td>
                  <td className="px-3 py-2.5 text-[#86909C] text-xs whitespace-nowrap">{item.lastSeen}</td>
                  <td className="px-3 py-2.5 text-[#1F2329] text-xs">{item.count}</td>
                  <td className="px-3 py-2.5 text-[#86909C] text-xs whitespace-nowrap">{item.triggerTime}</td>
                  <td className="px-3 py-2.5 text-xs text-[#86909C] max-w-[240px] truncate" title={item.event}>
                    {item.event}
                  </td>
                  <td className="px-3 py-2.5 w-8"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 分页 */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-[#E5E6EB]">
        <span className="text-xs text-[#86909C]">共{mockData.length}条记录 第1/1页</span>
        <div className="flex items-center gap-2">
          <button className="w-7 h-7 flex items-center justify-center rounded text-[#C9CDD4] border border-[#E5E6EB]" disabled>
            &lt;
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded bg-[#165DFF] text-white text-xs">
            1
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded text-[#C9CDD4] border border-[#E5E6EB]" disabled>
            &gt;
          </button>
          <select className="h-7 text-xs border border-[#E5E6EB] rounded px-1 text-[#1F2329]">
            <option>10条/页</option>
            <option>20条/页</option>
            <option>50条/页</option>
          </select>
        </div>
      </div>
    </div>
  );
}
