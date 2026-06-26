'use client';

import { useState } from 'react';

interface DeploymentItem {
  id: number;
  name: string;
  podNormal: number;
  podAbnormal: number;
  group: string;
  createTime: string;
  creator: string;
  description: string;
}

interface DeploymentManagementProps {
  onViewDetail?: (name: string, id: number) => void;
  onCreateDeployment?: () => void;
  onEditDeployment?: (deployment: DeploymentItem) => void;
}

export default function DeploymentManagement({ onViewDetail, onCreateDeployment, onEditDeployment }: DeploymentManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [groupFilter, setGroupFilter] = useState('全部');

  const deployments: DeploymentItem[] = [
    { id: 75382, name: 'zxtest-ffffffff', podNormal: 1, podAbnormal: 0, group: '', createTime: '2024-12-30 19:57:30', creator: 'zhangxing5', description: 'fffffffff' },
    { id: 74891, name: 'zxtest-fsdffds', podNormal: 3, podAbnormal: 0, group: 'test', createTime: '2024-12-30 15:32:12', creator: 'zhangxing5', description: 'fsdffds' },
    { id: 74256, name: 'zxtest-copytest', podNormal: 0, podAbnormal: 0, group: 'test1', createTime: '2024-12-28 10:15:45', creator: 'zhangxing5', description: 'copytest' },
    { id: 73589, name: 'zxtest-demo', podNormal: 0, podAbnormal: 0, group: '', createTime: '2024-12-25 14:22:08', creator: 'zhangxing5', description: 'demo应用' },
    { id: 72834, name: 'zxtest-nginx', podNormal: 0, podAbnormal: 0, group: 'test', createTime: '2024-12-22 09:18:33', creator: 'zhangxing5', description: 'nginx测试' },
    { id: 72101, name: 'zxtest-redis', podNormal: 0, podAbnormal: 0, group: '', createTime: '2024-12-20 16:45:21', creator: 'zhangxing5', description: 'redis服务' },
    { id: 71567, name: 'zxtest-api', podNormal: 0, podAbnormal: 0, group: '', createTime: '2024-12-18 11:30:56', creator: 'zhangxing5', description: 'api服务' },
  ];

  const filteredDeployments = deployments.filter(item => {
    const matchSearch = searchTerm === '' || 
      item.id.toString().includes(searchTerm) || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.group.toLowerCase().includes(searchTerm.toLowerCase());
    const matchGroup = groupFilter === '全部' || item.group === groupFilter;
    return matchSearch && matchGroup;
  });

  const totalPages = Math.ceil(filteredDeployments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageData = filteredDeployments.slice(startIndex, startIndex + itemsPerPage);

  const toggleSelect = (id: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === pageData.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(pageData.map(item => item.id)));
    }
  };

  const groups = ['全部', ...Array.from(new Set(deployments.map(d => d.group).filter(Boolean)))];

  return (
    <div className="h-full flex flex-col bg-[#F0F5F7]">
      {/* 面包屑导航 */}
      <div className="h-14 flex items-center justify-between px-5 flex-shrink-0 bg-white border-b border-gray-200">
        <div className="flex items-center text-sm text-gray-500">
          <span className="text-blue-500 cursor-pointer hover:text-blue-600">stark测试</span>
          <span className="mx-2">&gt;</span>
          <span className="text-blue-500 cursor-pointer hover:text-blue-600">zxtest</span>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-800">Deployment</span>
        </div>
        <a href="#" className="text-blue-500 text-sm hover:text-blue-600">CIS帮助文档</a>
      </div>

      {/* 操作栏 */}
      <div className="px-5 py-3 flex items-center justify-between flex-shrink-0 bg-white border-b border-gray-100">
        <button onClick={onCreateDeployment} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded text-sm flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          创建Deployment
        </button>
        <div className="flex items-center gap-3">
          {/* 告警提示 */}
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" className="rounded" />
            <span>CPU、内存使用率告警</span>
            <span className="text-blue-500">(2个)</span>
          </label>

          {/* 分组筛选 */}
          <select 
            value={groupFilter}
            onChange={(e) => { setGroupFilter(e.target.value); setCurrentPage(1); }}
            className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
          >
            {groups.map(g => (
              <option key={g} value={g}>分组: {g}</option>
            ))}
          </select>

          {/* 搜索框 */}
          <div className="relative">
            <input
              type="text"
              placeholder="ID/名称/分组"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="border border-gray-300 rounded pl-3 pr-8 py-1 text-sm w-44 focus:outline-none focus:border-blue-400"
            />
            <svg className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* 分组管理 */}
          <button className="border border-gray-300 rounded px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-1">
            分组管理
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* 刷新 */}
          <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* 表格区域 */}
      <div className="flex-1 overflow-auto px-5 py-0">
        <div className="bg-white rounded border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8F9FA] border-b border-gray-200">
                <th className="w-10 px-3 py-2.5 text-left">
                  <input 
                    type="checkbox" 
                    checked={pageData.length > 0 && selectedItems.size === pageData.length}
                    onChange={toggleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="px-3 py-2.5 text-left text-gray-600 font-medium">ID</th>
                <th className="px-3 py-2.5 text-left text-gray-600 font-medium">名称</th>
                <th className="px-3 py-2.5 text-left text-gray-600 font-medium">
                  <span className="flex items-center gap-1">
                    Pod数量(正常/异常)
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </span>
                </th>
                <th className="px-3 py-2.5 text-left text-gray-600 font-medium">分组</th>
                <th className="px-3 py-2.5 text-left text-gray-600 font-medium">
                  <span className="flex items-center gap-1">
                    创建时间
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </span>
                </th>
                <th className="px-3 py-2.5 text-left text-gray-600 font-medium">创建者</th>
                <th className="px-3 py-2.5 text-left text-gray-600 font-medium">描述</th>
                <th className="px-3 py-2.5 text-left text-gray-600 font-medium w-56">操作</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-[#F8F9FA]">
                  <td className="px-3 py-3">
                    <input 
                      type="checkbox" 
                      checked={selectedItems.has(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-3 py-3 text-gray-800">{item.id}</td>
                  <td className="px-3 py-3">
                    <span className="text-blue-500 cursor-pointer hover:text-blue-600" onClick={() => onViewDetail?.(item.name, item.id)}>{item.name}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={item.podAbnormal > 0 ? 'text-red-500' : 'text-gray-800'}>
                      {item.podNormal}
                    </span>
                    <span className="text-gray-400">/</span>
                    <span className={item.podAbnormal > 0 ? 'text-red-500' : 'text-gray-400'}>
                      {item.podAbnormal}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-gray-600">{item.group || '-'}</td>
                  <td className="px-3 py-3 text-gray-600">{item.createTime}</td>
                  <td className="px-3 py-3 text-gray-600">{item.creator}</td>
                  <td className="px-3 py-3 text-gray-500 max-w-32 truncate">{item.description}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <button type="button" onClick={() => onViewDetail?.(item.name, item.id)} className="text-blue-500 cursor-pointer hover:text-blue-600 text-sm">详情</button>
                      <span className="text-gray-300">|</span>
                      <button type="button" onClick={() => onEditDeployment?.(item)} className="text-blue-500 cursor-pointer hover:text-blue-600 text-sm">编辑</button>
                      <span className="text-gray-300">|</span>
                      <span className="text-blue-500 cursor-pointer hover:text-blue-600 text-sm">弹性伸缩</span>
                      <span className="text-gray-300">|</span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 分页栏 */}
      <div className="px-5 py-3 flex items-center justify-between flex-shrink-0 bg-white border-t border-gray-200">
        <span className="text-sm text-gray-500">
          共{filteredDeployments.length}条记录 第{currentPage}/{totalPages || 1}页
        </span>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded text-sm">
            {currentPage}
          </span>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <select 
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            className="border border-gray-300 rounded px-2 py-1 text-sm ml-2"
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
