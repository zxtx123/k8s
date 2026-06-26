'use client';

import { useState } from 'react';

interface ServiceItem {
  id: number;
  name: string;
  serviceType: string;
  port: string;
  onlineCluster: string;
  configCluster: string;
  releaseNote: string;
  createTime: string;
  creator: string;
}

const mockData: ServiceItem[] = [
  {
    id: 13918,
    name: 'zxtest-hdtdtyd',
    serviceType: '集群IP访问(ClusterIP)',
    port: '80:8080/TCP',
    onlineCluster: 'pub-bjwdt',
    configCluster: 'tdytduyugy',
    releaseNote: '',
    createTime: '2024-11-26 16:38:22',
    creator: 'zhangxing5',
  },
  {
    id: 892,
    name: 'zxtest-testste',
    serviceType: '集群IP访问(ClusterIP)',
    port: '22:22/TCP',
    onlineCluster: 'pub-bjyt',
    configCluster: 'testsets',
    releaseNote: '',
    createTime: '2023-05-18 14:17:07',
    creator: 'zhangxing5',
  },
];

export default function ServiceManagement({ onCreateService }: { onCreateService: () => void }) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = mockData.filter((item) => {
    const matchSearch =
      searchKeyword === '' ||
      item.id.toString().includes(searchKeyword) ||
      item.name.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#E5E6EB]">
        <div className="flex items-center text-sm text-[#86909C]">
          <span>stark测试</span>
          <span className="mx-2">&gt;</span>
          <span>zxtest</span>
          <span className="mx-2">&gt;</span>
          <span className="text-[#1F2329]">Service</span>
        </div>
        <a href="#" className="text-xs text-[#165DFF]">
          CIS帮助文档
        </a>
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#E5E6EB] bg-[#F7F8FA]">
        <div className="flex items-center gap-3">
          <button onClick={onCreateService} className="inline-flex items-center gap-1 px-4 py-1.5 bg-[#165DFF] text-white text-sm rounded">
            + 创建Service
          </button>
          <span className="text-xs text-[#86909C] whitespace-nowrap">
            集群内部流量4层负载均衡，为一组容器提供固定的访问入口，并对这一组容器做负载均衡
          </span>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs text-[#86909C] whitespace-nowrap cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-[#C9CDD4]"
            />
            只显示上线版本
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="ID/名称"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-40 h-8 pl-3 pr-8 text-sm border border-[#E5E6EB] rounded focus:outline-none focus:border-[#165DFF]"
            />
            <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86909C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button className="w-8 h-8 flex items-center justify-center border border-[#E5E6EB] rounded hover:bg-[#F2F3F5]">
            <svg className="w-4 h-4 text-[#86909C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F7F8FA] border-b border-[#E5E6EB]">
              <th className="text-left text-sm font-medium text-[#86909C] py-3 px-3">ID</th>
              <th className="text-left text-sm font-medium text-[#86909C] py-3 px-3">名称</th>
              <th className="text-left text-sm font-medium text-[#86909C] py-3 px-3">服务类型</th>
              <th className="text-left text-sm font-medium text-[#86909C] py-3 px-3">端口号</th>
              <th className="text-left text-sm font-medium text-[#86909C] py-3 px-3">上线集群</th>
              <th className="text-left text-sm font-medium text-[#86909C] py-3 px-3">配置集群</th>
              <th className="text-left text-sm font-medium text-[#86909C] py-3 px-3">发布说明</th>
              <th className="text-left text-sm font-medium text-[#86909C] py-3 px-3">创建时间</th>
              <th className="text-left text-sm font-medium text-[#86909C] py-3 px-3">创建者</th>
              <th className="text-left text-sm font-medium text-[#86909C] py-3 px-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-b border-[#E5E6EB] hover:bg-[#F7F8FA]">
                <td className="py-3 px-3 text-sm text-[#1F2329]">{item.id}</td>
                <td className="py-3 px-3 text-sm text-[#165DFF] cursor-pointer">{item.name}</td>
                <td className="py-3 px-3 text-sm text-[#1F2329]">{item.serviceType}</td>
                <td className="py-3 px-3 text-sm text-[#1F2329]">{item.port}</td>
                <td className="py-3 px-3 text-sm text-[#1F2329]">{item.onlineCluster}</td>
                <td className="py-3 px-3 text-sm text-[#1F2329]">{item.configCluster}</td>
                <td className="py-3 px-3 text-sm text-[#1F2329]">{item.releaseNote || '-'}</td>
                <td className="py-3 px-3 text-sm text-[#86909C]">{item.createTime}</td>
                <td className="py-3 px-3 text-sm text-[#1F2329]">{item.creator}</td>
                <td className="py-3 px-3 text-sm whitespace-nowrap">
                  <button className="text-[#165DFF] hover:underline mr-3">发布</button>
                  <button className="text-[#165DFF] hover:underline mr-3">编辑</button>
                  <button className="text-[#165DFF] hover:underline mr-3">详情</button>
                  <button className="text-[#86909C] hover:text-[#1F2329]">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#F7F8FA] border-t border-[#E5E6EB] flex-shrink-0">
        <span className="text-xs text-[#86909C]">
          共{filteredData.length}条记录 第{currentPage}/{totalPages}页
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage <= 1}
            className="w-8 h-8 flex items-center justify-center border border-[#E5E6EB] rounded text-[#86909C] disabled:opacity-50"
          >
            &lt;
          </button>
          <span className="w-8 h-8 flex items-center justify-center bg-[#165DFF] text-white text-sm rounded">
            {currentPage}
          </span>
          <button
            disabled={currentPage >= totalPages}
            className="w-8 h-8 flex items-center justify-center border border-[#E5E6EB] rounded text-[#86909C] disabled:opacity-50"
          >
            &gt;
          </button>
          <select className="h-8 text-xs border border-[#E5E6EB] rounded px-2 text-[#86909C]">
            <option>10条/页</option>
            <option>20条/页</option>
            <option>50条/页</option>
          </select>
        </div>
      </div>
    </div>
  );
}
