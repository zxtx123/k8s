'use client';

import { useState } from 'react';

const mockData = [
  {
    id: 138,
    name: 'zxtest-fgdgdg',
    createTime: '2024-08-01 14:42:32',
    creator: 'zhangxing5',
    description: '',
  },
];

export default function JobManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = mockData.filter(
    (item) =>
      searchTerm === '' ||
      String(item.id).includes(searchTerm) ||
      item.name.includes(searchTerm)
  );

  return (
    <div className="flex flex-col h-full">
      {/* 面包屑导航 */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#E5E6EB]">
        <div className="text-sm text-[#86909C]">
          <span>stark测试</span>
          <span className="mx-1">&gt;</span>
          <span>zxtest</span>
          <span className="mx-1">&gt;</span>
          <span className="text-[#1F2329]">Job</span>
        </div>
        <a href="#" className="text-sm text-[#165DFF]">
          CIS帮助文档
        </a>
      </div>

      {/* 操作栏 */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#F7F8FA] border-b border-[#E5E6EB]">
        <button className="px-4 py-1.5 bg-[#165DFF] text-white text-sm rounded hover:bg-[#0E4ADB] flex items-center gap-1">
          <span>+</span>
          创建Job
        </button>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="ID/名称"
              className="h-8 text-xs border border-[#E5E6EB] rounded px-2 pr-7 text-[#1F2329] w-[160px] bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 text-[#86909C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button className="w-8 h-8 flex items-center justify-center rounded-full border border-[#E5E6EB] text-[#86909C] hover:text-[#165DFF]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* 表格 */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="border border-[#E5E6EB] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F7F8FA]">
                <th className="text-left px-4 py-3 text-[#1F2329] font-medium">ID</th>
                <th className="text-left px-4 py-3 text-[#1F2329] font-medium">名称</th>
                <th className="text-left px-4 py-3 text-[#1F2329] font-medium">创建时间</th>
                <th className="text-left px-4 py-3 text-[#1F2329] font-medium">创建者</th>
                <th className="text-left px-4 py-3 text-[#1F2329] font-medium">描述</th>
                <th className="text-left px-4 py-3 text-[#1F2329] font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-t border-[#E5E6EB] hover:bg-[#F7F8FA]">
                  <td className="px-4 py-3 text-[#1F2329]">{item.id}</td>
                  <td className="px-4 py-3 text-[#165DFF]">{item.name}</td>
                  <td className="px-4 py-3 text-[#86909C] whitespace-nowrap">{item.createTime}</td>
                  <td className="px-4 py-3 text-[#1F2329]">{item.creator}</td>
                  <td className="px-4 py-3 text-[#86909C]">{item.description || '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button className="text-[#165DFF] hover:underline mr-3">详情</button>
                    <button className="text-[#165DFF] hover:underline mr-3">编辑</button>
                    <button className="text-[#165DFF] hover:underline mr-3">删除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 分页 */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-[#E5E6EB]">
        <span className="text-xs text-[#86909C]">共{filteredData.length}条记录 第1/1页</span>
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
