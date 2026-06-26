'use client';

import { useState } from 'react';

export default function APIKeysManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const data = [
    {
      id: 993,
      name: 'autotest',
      role: '平台SRE',
      createTime: '2024-01-15 10:30:00',
      expireTime: '2024-01-15 10:30:00',
      creator: '',
      accessKeyId: '',
      accessKeySecret: '',
      description: '自动化测试',
    },
    {
      id: 877,
      name: 'finerwork-accredit-api-key',
      role: '项目CICD',
      createTime: '2023-08-22 14:20:30',
      expireTime: '2023-08-22 14:20:30',
      creator: '',
      accessKeyId: 'abbc6eaea1ef67562569c882fea15f4b',
      accessKeySecret: '9211b26645fe3cc8bc2369a6ecfce9e1',
      description: '授权(finerwork)专用key',
    },
    {
      id: 721,
      name: 'yangxue3',
      role: '平台SRE',
      createTime: '2023-05-10 09:15:22',
      expireTime: '2023-05-10 09:15:22',
      creator: '',
      accessKeyId: 'c3d8f7a2b9e14c5d6a0f3e7b8c2d1a4f',
      accessKeySecret: '5f8a3b2c7d1e9f0a4b6c8d2e3f5a7b9d',
      description: '',
    },
    {
      id: 639,
      name: 'gjf-v2',
      role: '项目CICD',
      createTime: '2023-03-18 16:45:10',
      expireTime: '2023-03-18 16:45:10',
      creator: '',
      accessKeyId: 'd4e9a8b3c0f26d7e1a5b9c3e8f2d4a6b',
      accessKeySecret: '1a4b7c0d3e6f9a2b5c8d1e4f7a0b3c6d',
      description: '',
    },
    {
      id: 88,
      name: 'jidongdong',
      role: '平台SRE',
      createTime: '2022-11-05 11:22:33',
      expireTime: '2022-11-05 11:22:33',
      creator: '',
      accessKeyId: 'e5f0a9b4c1d37e8f2a6b0c4d9e3f5a7b',
      accessKeySecret: '2b5c8d1e4f7a0b3c6d9e2f5a8b1c4d7e',
      description: '',
    },
  ];

  const filteredData = data.filter(
    (item) =>
      item.id.toString().includes(searchQuery) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-5">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-[#86909C]">
          <span>产品团队-专用</span>
          <span className="mx-1">&gt;</span>
          <span>stark测试</span>
          <span className="mx-1">&gt;</span>
          <span className="text-[#1F2329]">apikey</span>
        </div>
        <a href="#" className="text-[#165DFF] text-sm">
          CIS帮助文档
        </a>
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between mb-4">
        <button className="bg-[#165DFF] text-white px-4 py-1.5 rounded text-sm hover:bg-[#0E4ADB]">
          + 创建APIKeys
        </button>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="ID/名称"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-[#E5E6EB] rounded px-3 py-1.5 text-sm w-40 pr-8 focus:outline-none focus:border-[#165DFF]"
            />
            <svg
              className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86909C]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button className="border border-[#E5E6EB] rounded px-3 py-1.5 text-sm text-[#1F2329] hover:bg-[#F7F8FA]">
            授权平台
          </button>
          <button className="border border-[#E5E6EB] rounded px-3 py-1.5 text-sm text-[#1F2329] hover:bg-[#F7F8FA]">
            查看OpenAPI
          </button>
          <button className="p-1.5 text-[#86909C] hover:text-[#1F2329]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E5E6EB] rounded">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F7F8FA] border-b border-[#E5E6EB]">
              <th className="text-left px-4 py-3 text-[#1F2329] font-medium">ID</th>
              <th className="text-left px-4 py-3 text-[#1F2329] font-medium">名称</th>
              <th className="text-left px-4 py-3 text-[#1F2329] font-medium">角色</th>
              <th className="text-left px-4 py-3 text-[#1F2329] font-medium">创建时间</th>
              <th className="text-left px-4 py-3 text-[#1F2329] font-medium">过期时间(s)</th>
              <th className="text-left px-4 py-3 text-[#1F2329] font-medium">创建者</th>
              <th className="text-left px-4 py-3 text-[#1F2329] font-medium">accessKeyId</th>
              <th className="text-left px-4 py-3 text-[#1F2329] font-medium">accessKeySecret</th>
              <th className="text-left px-4 py-3 text-[#1F2329] font-medium">描述</th>
              <th className="text-left px-4 py-3 text-[#1F2329] font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-b border-[#E5E6EB] hover:bg-[#F7F8FA]">
                <td className="px-4 py-3 text-[#165DFF]">{item.id}</td>
                <td className="px-4 py-3 text-[#1F2329]">{item.name}</td>
                <td className="px-4 py-3 text-[#1F2329]">{item.role}</td>
                <td className="px-4 py-3 text-[#86909C]">{item.createTime}</td>
                <td className="px-4 py-3 text-[#86909C]">{item.expireTime}</td>
                <td className="px-4 py-3 text-[#86909C]">{item.creator || '-'}</td>
                <td className="px-4 py-3 text-[#86909C] font-mono text-xs max-w-[180px] truncate">
                  {item.accessKeyId || '-'}
                </td>
                <td className="px-4 py-3 text-[#86909C] font-mono text-xs max-w-[180px] truncate">
                  {item.accessKeySecret || '-'}
                </td>
                <td className="px-4 py-3 text-[#86909C]">{item.description || '-'}</td>
                <td className="px-4 py-3">
                  <button className="text-[#165DFF] text-sm hover:underline">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-[#86909C]">共{filteredData.length}条记录 第{currentPage}/{Math.max(1, Math.ceil(filteredData.length / 10))}页</span>
        <div className="flex items-center gap-2">
          <button
            className="w-8 h-8 flex items-center justify-center border border-[#E5E6EB] rounded text-[#86909C] disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            &lt;
          </button>
          <span className="w-8 h-8 flex items-center justify-center bg-[#165DFF] text-white rounded text-sm">
            {currentPage}
          </span>
          <button
            className="w-8 h-8 flex items-center justify-center border border-[#E5E6EB] rounded text-[#86909C] disabled:opacity-50"
            disabled={currentPage >= Math.ceil(filteredData.length / 10)}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            &gt;
          </button>
          <select className="border border-[#E5E6EB] rounded px-2 py-1 text-sm text-[#1F2329]">
            <option>10条/页</option>
            <option>20条/页</option>
            <option>50条/页</option>
          </select>
        </div>
      </div>
    </div>
  );
}
