'use client';

import { useState } from 'react';

interface SecretManagementProps {
  onMenuItemChange?: (item: string) => void;
}

const secretData = [
  { id: 2039, name: 'zxtest-test', onlineCluster: 'pub-bjwdt', configCluster: 'pub-bjwdt', releaseNote: 'test', createTime: '2024-03-19 19:55:34', creator: 'zhangxing5' },
];

export default function SecretManagement({ onMenuItemChange }: SecretManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredData = secretData.filter(
    (item) =>
      searchQuery === '' ||
      item.id.toString().includes(searchQuery) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="flex flex-col h-full">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E6EB]">
        <span className="text-sm text-[#86909C]">stark测试 &gt; zxtest &gt; Secret</span>
        <span className="text-sm text-[#165DFF] cursor-pointer">CIS帮助文档</span>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#F7F8FA] border-b border-[#E5E6EB]">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 px-4 py-1.5 bg-[#165DFF] text-white text-sm rounded hover:bg-[#0E4BD6]">
            <span>+</span>
            创建Secret
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#86909C]">只显示上线版本</span>
            <button
              onClick={() => setShowOnlineOnly(!showOnlineOnly)}
              className={`w-8 h-4 rounded-full relative transition-colors ${showOnlineOnly ? 'bg-[#165DFF]' : 'bg-[#C9CDD4]'}`}
            >
              <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${showOnlineOnly ? 'left-4' : 'left-0.5'}`} />
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="ID/名称"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-48 h-8 pl-3 pr-8 text-sm border border-[#E5E6EB] rounded bg-white focus:outline-none focus:border-[#165DFF]"
            />
            <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86909C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button className="w-8 h-8 flex items-center justify-center rounded border border-[#E5E6EB] bg-white hover:bg-[#F2F3F5]">
            <svg className="w-4 h-4 text-[#86909C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#F7F8FA] sticky top-0">
            <tr>
              <th className="text-left px-4 py-3 text-[#4E5969] font-medium">ID</th>
              <th className="text-left px-4 py-3 text-[#4E5969] font-medium">名称</th>
              <th className="text-left px-4 py-3 text-[#4E5969] font-medium">上线集群</th>
              <th className="text-left px-4 py-3 text-[#4E5969] font-medium">配置集群</th>
              <th className="text-left px-4 py-3 text-[#4E5969] font-medium">发布说明</th>
              <th className="text-left px-4 py-3 text-[#4E5969] font-medium">创建时间</th>
              <th className="text-left px-4 py-3 text-[#4E5969] font-medium">创建者</th>
              <th className="text-left px-4 py-3 text-[#4E5969] font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-b border-[#E5E6EB] hover:bg-[#F7F8FA]">
                <td className="px-4 py-3 text-[#1F2329]">{item.id}</td>
                <td className="px-4 py-3 text-[#1F2329]">{item.name}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 text-xs bg-[#00B42A] text-white rounded">{item.onlineCluster}</span>
                </td>
                <td className="px-4 py-3 text-[#1F2329]">{item.configCluster}</td>
                <td className="px-4 py-3 text-[#1F2329]">{item.releaseNote}</td>
                <td className="px-4 py-3 text-[#1F2329]">{item.createTime}</td>
                <td className="px-4 py-3 text-[#1F2329]">{item.creator}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <button className="text-[#165DFF] hover:underline mr-3">发布</button>
                  <button className="text-[#165DFF] hover:underline mr-3">编辑</button>
                  <button className="text-[#165DFF] hover:underline mr-3">复制</button>
                  <button className="w-6 h-6 inline-flex items-center justify-center text-[#86909C] hover:text-[#165DFF]">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#F7F8FA] border-t border-[#E5E6EB] flex-shrink-0">
        <span className="text-xs text-[#86909C]">共{filteredData.length}条记录 第{currentPage} / {totalPages || 1}页</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded border border-[#E5E6EB] bg-white disabled:opacity-50"
          >
            &lt;
          </button>
          <span className="w-8 h-8 flex items-center justify-center rounded bg-[#165DFF] text-white text-sm">{currentPage}</span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="w-8 h-8 flex items-center justify-center rounded border border-[#E5E6EB] bg-white disabled:opacity-50"
          >
            &gt;
          </button>
          <select
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            className="h-8 px-2 text-sm border border-[#E5E6EB] rounded bg-white"
          >
            <option value={10}>10条/页</option>
            <option value={20}>20条/页</option>
            <option value={50}>50条/页</option>
          </select>
        </div>
      </div>
    </div>
  );
}
