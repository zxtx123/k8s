'use client';

import { useState } from 'react';

const mockData = [
  {
    module: '加密字典',
    operationName: '发布加密字典',
    objectName: 'zxtest-test',
    operationDetail: '',
    availableZone: 'bjwdt(北京电信25G-特价)',
    cluster: 'pub-bjwdt',
    operator: 'zhangxing5',
    operationTime: '2026-06-01 15:14:32',
    status: '成功',
  },
];

export default function AuditManagement() {
  const [moduleFilter, setModuleFilter] = useState('全部');
  const [zoneFilter, setZoneFilter] = useState('全部');
  const [clusterFilter, setClusterFilter] = useState('全部');
  const [operator, setOperator] = useState('');
  const [statusFilter, setStatusFilter] = useState('全部');
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
          <span className="text-[#1F2329]">操作审计</span>
        </div>
        <a href="#" className="text-sm text-[#165DFF]">
          CIS帮助文档
        </a>
      </div>

      {/* 筛选栏 - 第一行 */}
      <div className="px-6 py-3 bg-[#F7F8FA] border-b border-[#E5E6EB]">
        <div className="flex items-center gap-3 flex-wrap mb-3">
          <select
            className="h-8 text-xs border border-[#E5E6EB] rounded px-2 text-[#1F2329] bg-white min-w-[90px]"
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
          >
            <option>全部</option>
            <option>加密字典</option>
          </select>
          <select
            className="h-8 text-xs border border-[#E5E6EB] rounded px-2 text-[#1F2329] bg-white min-w-[90px]"
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
          >
            <option>全部</option>
            <option>bjwdt</option>
          </select>
          <select
            className="h-8 text-xs border border-[#E5E6EB] rounded px-2 text-[#1F2329] bg-white min-w-[90px]"
            value={clusterFilter}
            onChange={(e) => setClusterFilter(e.target.value)}
          >
            <option>全部</option>
            <option>pub-bjwdt</option>
          </select>
          <input
            type="text"
            placeholder="操作人"
            className="h-8 text-xs border border-[#E5E6EB] rounded px-2 text-[#1F2329] w-[110px] bg-white"
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
          />
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
        </div>
        {/* 筛选栏 - 第二行 */}
        <div className="flex items-center gap-3 flex-wrap">
          <select
            className="h-8 text-xs border border-[#E5E6EB] rounded px-2 text-[#1F2329] bg-white min-w-[90px]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>全部</option>
            <option>成功</option>
            <option>失败</option>
          </select>
          <div className="relative">
            <input
              type="text"
              placeholder="请输入关键字"
              className="h-8 text-xs border border-[#E5E6EB] rounded px-2 pr-7 text-[#1F2329] w-[160px] bg-white"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <svg className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 text-[#86909C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button className="h-8 px-4 bg-[#165DFF] text-white text-xs rounded hover:bg-[#0E4ADB]">
            查询
          </button>
        </div>
      </div>

      {/* 表格 */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="border border-[#E5E6EB] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F7F8FA]">
                <th className="text-left px-3 py-3 text-[#1F2329] font-medium whitespace-nowrap">模块</th>
                <th className="text-left px-3 py-3 text-[#1F2329] font-medium whitespace-nowrap">操作名称</th>
                <th className="text-left px-3 py-3 text-[#1F2329] font-medium whitespace-nowrap">对象名称</th>
                <th className="text-left px-3 py-3 text-[#1F2329] font-medium whitespace-nowrap">操作详情</th>
                <th className="text-left px-3 py-3 text-[#1F2329] font-medium whitespace-nowrap">可用区</th>
                <th className="text-left px-3 py-3 text-[#1F2329] font-medium whitespace-nowrap">集群</th>
                <th className="text-left px-3 py-3 text-[#1F2329] font-medium whitespace-nowrap">操作人</th>
                <th className="text-left px-3 py-3 text-[#1F2329] font-medium whitespace-nowrap">操作时间</th>
                <th className="text-left px-3 py-3 text-[#1F2329] font-medium whitespace-nowrap">状态</th>
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
                  <td className="px-3 py-2.5 text-[#1F2329] text-xs">{item.module}</td>
                  <td className="px-3 py-2.5 text-[#1F2329] text-xs">{item.operationName}</td>
                  <td className="px-3 py-2.5 text-[#1F2329] text-xs">{item.objectName}</td>
                  <td className="px-3 py-2.5 text-[#1F2329] text-xs">{item.operationDetail || '-'}</td>
                  <td className="px-3 py-2.5 text-[#1F2329] text-xs whitespace-nowrap">{item.availableZone}</td>
                  <td className="px-3 py-2.5 text-[#1F2329] text-xs">{item.cluster}</td>
                  <td className="px-3 py-2.5 text-[#1F2329] text-xs">{item.operator}</td>
                  <td className="px-3 py-2.5 text-[#86909C] text-xs whitespace-nowrap">{item.operationTime}</td>
                  <td className="px-3 py-2.5">
                    <span className="text-[#00B42A] text-xs">{item.status}</span>
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
