'use client';

import { useState } from 'react';

interface IngressItem {
  id: number;
  name: string;
  vip: string;
  port: string[];
  eip: string;
  configCluster: string;
  onlineCluster: string;
  releaseNote: string;
  createTime: string;
  creator: string;
}

export default function IngressManagement({ onCreateIngress }: { onCreateIngress: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');

  const ingressData: IngressItem[] = [
    {
      id: 755,
      name: 'zxtest-test',
      vip: '',
      port: ['80', '443'],
      eip: '',
      configCluster: 'pub-bjwdt',
      onlineCluster: '',
      releaseNote: 'fsdsfsfsd',
      createTime: '2025-04-08 16:04:31',
      creator: 'zhangxing5',
    },
    {
      id: 167,
      name: 'zxtest-eswrerew',
      vip: '',
      port: ['80', '443'],
      eip: '',
      configCluster: 'pub-bjyt',
      onlineCluster: 'erwrwer',
      releaseNote: '',
      createTime: '2023-05-18 14:17:45',
      creator: 'zhangxing5',
    },
  ];

  const filteredData = ingressData.filter(
    (item) =>
      item.id.toString().includes(searchTerm) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / 10));
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 顶部操作栏 */}
      <div className="px-6 pt-4 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <button onClick={onCreateIngress} className="inline-flex items-center gap-1 px-4 py-1.5 bg-[#165DFF] text-white text-sm rounded hover:bg-[#0E4ADB] transition-colors w-fit">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              创建Ingress
            </button>
            <p className="text-xs text-[#86909C] whitespace-nowrap">
              集群外部流量7层负载均衡，是集群内Service对外暴露7层的访问接入点，通过域名或者访问路径来路由到不同Service上，从而达到7层的负载均衡。
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* 搜索框 */}
            <div className="relative">
              <input
                type="text"
                placeholder="ID/名称"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 h-8 pl-3 pr-8 text-sm border border-[#E5E6EB] rounded focus:outline-none focus:border-[#165DFF]"
              />
              <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86909C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {/* 刷新 */}
            <button className="w-8 h-8 flex items-center justify-center border border-[#E5E6EB] rounded hover:bg-[#F2F3F5]">
              <svg className="w-4 h-4 text-[#4E5969]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            {/* 表格列配置 */}
            <button className="w-8 h-8 flex items-center justify-center border border-[#E5E6EB] rounded hover:bg-[#F2F3F5]">
              <svg className="w-4 h-4 text-[#4E5969]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 表格区域 */}
      <div className="flex-1 px-6 overflow-auto">
        <div className="border border-[#E5E6EB] rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#F7F8FA] border-b border-[#E5E6EB]">
                <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">ID</th>
                <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">Ingress名称</th>
                <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">VIP</th>
                <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">端口号</th>
                <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">EIP</th>
                <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">配置集群</th>
                <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">上线集群</th>
                <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">发布说明</th>
                <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">创建时间</th>
                <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">创建者</th>
                <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#E5E6EB] hover:bg-[#F7F8FA]">
                  <td className="px-3 py-3 text-[#1F2329]">{item.id}</td>
                  <td className="px-3 py-3">
                    <span className="text-[#165DFF] cursor-pointer hover:text-[#0E4ADB]">{item.name}</span>
                  </td>
                  <td className="px-3 py-3 text-[#1F2329]">{item.vip || '-'}</td>
                  <td className="px-3 py-3 text-[#1F2329]">
                    {item.port.map((p, i) => (
                      <div key={i}>{p}</div>
                    ))}
                  </td>
                  <td className="px-3 py-3 text-[#1F2329]">{item.eip || '-'}</td>
                  <td className="px-3 py-3 text-[#1F2329]">{item.configCluster}</td>
                  <td className="px-3 py-3 text-[#1F2329]">
                    {item.onlineCluster || (
                      <span className="inline-block px-2 py-0.5 text-xs bg-[#F2F3F5] text-[#86909C] rounded">未发布</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-[#1F2329] max-w-[120px] truncate">{item.releaseNote || '-'}</td>
                  <td className="px-3 py-3 text-[#1F2329] whitespace-nowrap">{item.createTime}</td>
                  <td className="px-3 py-3 text-[#1F2329]">{item.creator}</td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className="text-[#165DFF] cursor-pointer hover:text-[#0E4ADB] mr-3">发布</span>
                    <span className="text-[#165DFF] cursor-pointer hover:text-[#0E4ADB] mr-3">Yaml</span>
                    <span className="text-[#165DFF] cursor-pointer hover:text-[#0E4ADB] mr-3">编辑</span>
                    <span className="text-[#4E5969] cursor-pointer hover:text-[#1F2329]">
                      <svg className="w-4 h-4 inline" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 底部分页栏 */}
      <div className="flex-shrink-0 px-6 py-3 bg-[#F7F8FA] border-t border-[#E5E6EB] flex items-center justify-between">
        <span className="text-xs text-[#86909C]">
          共{totalItems}条记录 第{currentPage}/{totalPages}页
        </span>
        <div className="flex items-center gap-1">
          <button
            className="w-7 h-7 flex items-center justify-center border border-[#E5E6EB] rounded text-[#86909C] disabled:opacity-50"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="w-7 h-7 flex items-center justify-center bg-[#165DFF] text-white text-xs rounded">
            {currentPage}
          </button>
          <button
            className="w-7 h-7 flex items-center justify-center border border-[#E5E6EB] rounded text-[#86909C] disabled:opacity-50"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <select className="ml-2 h-7 text-xs border border-[#E5E6EB] rounded px-1 text-[#4E5969] bg-white">
            <option>10条/页</option>
            <option>20条/页</option>
            <option>50条/页</option>
          </select>
        </div>
      </div>
    </div>
  );
}
