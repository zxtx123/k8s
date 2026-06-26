'use client';

import { useState } from 'react';

interface PVCManagementProps {
  onCreatePVC?: () => void;
}

const pvcData = [
  {
    id: 6276,
    name: 'etcd-fly-zxtest-testcm-0',
    configCluster: '',
    onlineCluster: '',
    releaseNote: '动态盘',
    createTime: '2024-04-26 15:58:50',
    creator: 'zhangxing5',
  },
  {
    id: 4728,
    name: 'zxtest-teststset',
    configCluster: 'pub-bjzdt',
    onlineCluster: '',
    releaseNote: 'teststset',
    createTime: '2024-01-19 10:57:07',
    creator: 'zhangxing5',
  },
];

export default function PVCManagement({ onCreatePVC }: PVCManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = pvcData.filter(
    (item) =>
      item.id.toString().includes(searchTerm) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  return (
    <div className="flex flex-col h-full">
      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between py-3 px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onCreatePVC}
            className="inline-flex items-center gap-1 px-4 py-1.5 bg-[#165DFF] text-white text-sm rounded hover:bg-[#0E4ADB] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            创建PVC
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="ID/名称"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-48 h-8 pl-3 pr-8 text-sm border border-[#E5E6EB] rounded focus:outline-none focus:border-[#165DFF]"
            />
            <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86909C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button className="p-1.5 text-[#86909C] hover:text-[#165DFF] transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* 表格区域 */}
      <div className="flex-1 overflow-auto px-4">
        <table className="w-full text-sm border border-[#E5E6EB] rounded">
          <thead className="bg-[#F7F8FA] sticky top-0">
            <tr>
              <th className="text-left px-3 py-2.5 text-[#1F2329] font-medium">ID</th>
              <th className="text-left px-3 py-2.5 text-[#1F2329] font-medium">PVC名称</th>
              <th className="text-left px-3 py-2.5 text-[#1F2329] font-medium">配置集群</th>
              <th className="text-left px-3 py-2.5 text-[#1F2329] font-medium">上线集群</th>
              <th className="text-left px-3 py-2.5 text-[#1F2329] font-medium">发布说明</th>
              <th className="text-left px-3 py-2.5 text-[#1F2329] font-medium">创建时间</th>
              <th className="text-left px-3 py-2.5 text-[#1F2329] font-medium">创建者</th>
              <th className="text-left px-3 py-2.5 text-[#1F2329] font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-t border-[#E5E6EB] hover:bg-[#F7F8FA]">
                <td className="px-3 py-2.5 text-[#1F2329]">{item.id}</td>
                <td className="px-3 py-2.5 text-[#165DFF] cursor-pointer hover:underline">{item.name}</td>
                <td className="px-3 py-2.5 text-[#1F2329]">{item.configCluster || '-'}</td>
                <td className="px-3 py-2.5 text-[#1F2329]">{item.onlineCluster || '-'}</td>
                <td className="px-3 py-2.5 text-[#1F2329]">{item.releaseNote}</td>
                <td className="px-3 py-2.5 text-[#1F2329]">{item.createTime}</td>
                <td className="px-3 py-2.5 text-[#1F2329]">{item.creator}</td>
                <td className="px-3 py-2.5 whitespace-nowrap">
                  <button className="text-[#165DFF] hover:underline mr-3">发布</button>
                  <button className="text-[#165DFF] hover:underline mr-3">编辑</button>
                  <button className="text-[#165DFF] hover:underline mr-3">详情</button>
                  <button className="text-[#86909C] hover:text-[#1F2329]">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="5" r="2" />
                      <circle cx="12" cy="12" r="2" />
                      <circle cx="12" cy="19" r="2" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-12 text-[#86909C]">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 mb-2 text-[#C9CDD4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    暂无数据
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 分页栏 */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#F7F8FA] border-t border-[#E5E6EB] flex-shrink-0">
        <span className="text-xs text-[#86909C]">
          共{filteredData.length}条记录 第{currentPage}/{totalPages}页
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 text-sm border border-[#E5E6EB] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white"
          >
            &lt;
          </button>
          <span className="px-2.5 py-1 text-sm bg-[#165DFF] text-white rounded">{currentPage}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-2 py-1 text-sm border border-[#E5E6EB] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white"
          >
            &gt;
          </button>
          <select className="h-7 text-sm border border-[#E5E6EB] rounded px-1 bg-white">
            <option>10条/页</option>
            <option>20条/页</option>
            <option>50条/页</option>
          </select>
        </div>
      </div>
    </div>
  );
}
