'use client';

import { useEffect, useState } from 'react';

interface Cluster {
  id: number;
  name: string;
  status: string;
  operationStatus: string;
  operationStatusIcon?: string;
  enabled: string;
  zone: string;
  networkId: string;
  networkName: string;
  networkType: string;
  version: string;
  versionNeedsUpdate?: boolean;
  readyNodes: number;
  totalNodes: number;
  createTime: string;
}

interface ClusterListProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onCreateCluster?: () => void;
  onViewDetail?: (clusterName: string) => void;
}

export default function ClusterList({
  searchTerm,
  onSearchChange,
  currentPage,
  onPageChange,
  totalPages,
  totalItems,
  itemsPerPage,
  onCreateCluster,
  onViewDetail,
}: ClusterListProps) {
  const [oversellCluster, setOversellCluster] = useState<Cluster | null>(null);
  const [oversellEnabled, setOversellEnabled] = useState(false);
  const [oversellFactor, setOversellFactor] = useState('3');
  const [oversellConfigs, setOversellConfigs] = useState<Record<number, { enabled: boolean; factor: string }>>({});
  const [oversellError, setOversellError] = useState('');
  const [moreMenu, setMoreMenu] = useState<{
    cluster: Cluster;
    top: number;
    right: number;
  } | null>(null);

  const clusters: Cluster[] = [
    {
      id: 1447,
      name: 'test-log',
      status: 'Active',
      operationStatus: '· 正常',
      enabled: '启用',
      zone: 'bjzdt',
      networkId: 'vpc-65e97091584c7',
      networkName: '容器测试VPC',
      networkType: '非隔离VPC',
      version: 'v1.30.8',
      readyNodes: 2,
      totalNodes: 2,
      createTime: '2025-12-09 16:45',
    },
    {
      id: 1434,
      name: 'zetaotest-20251204',
      status: 'Active',
      operationStatus: '· 初始化节点失败',
      operationStatusIcon: 'question',
      enabled: '启用',
      zone: 'bjzdt',
      networkId: 'vpc-65e97091584c7',
      networkName: '容器测试VPC',
      networkType: '非隔离VPC',
      version: 'v1.30.8',
      readyNodes: 0,
      totalNodes: 2,
      createTime: '2025-12-04 14:07',
    },
    {
      id: 1423,
      name: 'test-cluster-202511',
      status: 'Active',
      operationStatus: '· 正常',
      enabled: '启用',
      zone: 'bjwdt',
      networkId: 'vpc-65e97091584c7',
      networkName: '容器测试VPC',
      networkType: '非隔离VPC',
      version: 'v1.28.11',
      versionNeedsUpdate: true,
      readyNodes: 2,
      totalNodes: 2,
      createTime: '2025-11-28 10:30',
    },
    {
      id: 1415,
      name: 'prod-cluster-main',
      status: 'Active',
      operationStatus: '· 正常',
      enabled: '启用',
      zone: 'bjzdt',
      networkId: 'vpc-abc123def456',
      networkName: '生产VPC',
      networkType: '隔离VPC',
      version: 'v1.30.8',
      readyNodes: 3,
      totalNodes: 3,
      createTime: '2025-11-15 09:20',
    },
    {
      id: 1408,
      name: 'test-cluster-v126',
      status: 'Active',
      operationStatus: '· 正常',
      enabled: '启用',
      zone: 'bjzdt',
      networkId: 'vpc-65e97091584c7',
      networkName: '容器测试VPC',
      networkType: '非隔离VPC',
      version: 'v1.26.9',
      versionNeedsUpdate: true,
      readyNodes: 2,
      totalNodes: 2,
      createTime: '2025-11-10 15:45',
    },
    {
      id: 1399,
      name: 'dev-cluster-001',
      status: 'Active',
      operationStatus: '· 正常',
      enabled: '启用',
      zone: 'bjzdt',
      networkId: 'vpc-xyz789ghi012',
      networkName: '开发VPC',
      networkType: '非隔离VPC',
      version: 'v1.30.8',
      readyNodes: 2,
      totalNodes: 2,
      createTime: '2025-11-05 11:30',
    },
    {
      id: 1387,
      name: 'staging-cluster',
      status: 'Active',
      operationStatus: '· 正常',
      enabled: '启用',
      zone: 'bjwdt',
      networkId: 'vpc-65e97091584c7',
      networkName: '容器测试VPC',
      networkType: '非隔离VPC',
      version: 'v1.30.8',
      readyNodes: 3,
      totalNodes: 3,
      createTime: '2025-10-28 14:20',
    },
    {
      id: 1372,
      name: 'test-cluster-fallback',
      status: 'Active',
      operationStatus: '· 正常',
      enabled: '启用',
      zone: 'bjzdt',
      networkId: 'vpc-65e97091584c7',
      networkName: '容器测试VPC',
      networkType: '非隔离VPC',
      version: 'v1.28.11',
      versionNeedsUpdate: true,
      readyNodes: 2,
      totalNodes: 2,
      createTime: '2025-10-20 16:50',
    },
    {
      id: 1365,
      name: 'perf-test-cluster',
      status: 'Active',
      operationStatus: '· 正常',
      enabled: '启用',
      zone: 'bjzdt',
      networkId: 'vpc-65e97091584c7',
      networkName: '容器测试VPC',
      networkType: '非隔离VPC',
      version: 'v1.30.8',
      readyNodes: 4,
      totalNodes: 4,
      createTime: '2025-10-15 10:10',
    },
    {
      id: 1358,
      name: 'qa-cluster-final',
      status: 'Active',
      operationStatus: '· 正常',
      enabled: '启用',
      zone: 'bjzdt',
      networkId: 'vpc-65e97091584c7',
      networkName: '容器测试VPC',
      networkType: '非隔离VPC',
      version: 'v1.30.8',
      readyNodes: 2,
      totalNodes: 2,
      createTime: '2025-10-08 13:25',
    },
  ];

  const filteredClusters = clusters.filter(cluster =>
    cluster.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cluster.id.toString().includes(searchTerm)
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedClusters = filteredClusters.slice(startIndex, endIndex);

  useEffect(() => {
    const closeMoreMenu = () => setMoreMenu(null);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMoreMenu(null);
    };

    window.addEventListener('click', closeMoreMenu);
    window.addEventListener('keydown', closeOnEscape);
    window.addEventListener('resize', closeMoreMenu);
    window.addEventListener('scroll', closeMoreMenu, true);
    return () => {
      window.removeEventListener('click', closeMoreMenu);
      window.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('resize', closeMoreMenu);
      window.removeEventListener('scroll', closeMoreMenu, true);
    };
  }, []);

  const openOversellConfig = (cluster: Cluster) => {
    setOversellCluster(cluster);
    const cfg = oversellConfigs[cluster.id];
    setOversellEnabled(cfg?.enabled ?? false);
    setOversellFactor(cfg?.factor ?? '3');
    setOversellError('');
  };

  const saveOversellConfig = () => {
    if (oversellEnabled) {
      const factor = Number(oversellFactor);
      if (!Number.isFinite(factor) || factor <= 0) {
        setOversellError('请输入大于 0 的超卖倍数');
        return;
      }
    }

    if (oversellCluster) {
      setOversellConfigs((prev) => ({
        ...prev,
        [oversellCluster.id]: { enabled: oversellEnabled, factor: oversellFactor },
      }));
    }
    setOversellCluster(null);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* 面包屑导航区域 */}
      <div className="flex items-center justify-between h-14 px-6 text-sm text-gray-600 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span>产品团队-专用</span>
          <span className="text-gray-400">{'>'}</span>
          <span>stark测试</span>
          <span className="text-gray-400">{'>'}</span>
          <span className="text-gray-900 font-medium">独享集群</span>
        </div>
        <a href="#" className="text-blue-600 hover:underline">
          CIS帮助文档
        </a>
      </div>

      {/* 内容区域 */}
      <div className="min-h-0 flex-1 overflow-auto bg-gray-50">
        {/* 操作栏 */}
        <div className="flex flex-col gap-3 px-4 py-4 bg-white border-b border-gray-200 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          {/* 左侧：创建集群按钮 */}
          <button 
            onClick={onCreateCluster}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            创建集群
          </button>

          {/* 右侧：筛选和搜索 */}
          <div className="flex flex-wrap items-center gap-3">
            {/* 可用区下拉框 */}
            <select className="px-3 py-2 text-sm border border-gray-300 rounded bg-white text-gray-700">
              <option>可用区</option>
              <option>bjzdt</option>
              <option>bjwdt</option>
            </select>

            {/* 搜索框 */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ID/名称"
                className="w-full min-w-0 px-4 py-2 pl-4 pr-10 bg-gray-100 border border-transparent rounded text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-colors sm:w-48"
              />
              <svg className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* 刷新按钮 */}
            <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* 表格 */}
        <div className="border border-gray-200 rounded bg-white">
          <div className="overflow-x-auto">
          <table className="min-w-[1200px] w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-sm text-gray-700 font-semibold">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">集群名称</th>
                <th className="px-4 py-3 text-left">运行状态</th>
                <th className="px-4 py-3 text-left">运维状态</th>
                <th className="px-4 py-3 text-left">是否启用</th>
                <th className="px-4 py-3 text-left">可用区</th>
                <th className="px-4 py-3 text-left">网络ID/名称</th>
                <th className="px-4 py-3 text-left">集群版本</th>
                <th className="px-4 py-3 text-left">Ready数/节点数</th>
                <th className="px-4 py-3 text-left">创建时间</th>
                <th className="px-4 py-3 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {displayedClusters.map((cluster) => (
                <tr
                  key={cluster.id}
                  className="text-sm border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-900">{cluster.id}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onViewDetail?.(cluster.name)}
                      className="flex items-center gap-2 hover:text-blue-700 transition-colors"
                    >
                      <span className="text-blue-600">{cluster.name}</span>
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                      {cluster.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${cluster.operationStatusIcon === 'question' ? 'bg-blue-500' : 'bg-blue-500'}`}></span>
                      <span className="text-gray-600">{cluster.operationStatus}</span>
                      {cluster.operationStatusIcon === 'question' && (
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 010-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{cluster.enabled}</td>
                  <td className="px-4 py-3 text-gray-600">{cluster.zone}</td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="text-gray-900">{cluster.networkId}</div>
                      <div className="text-xs text-gray-500">{cluster.networkName} {cluster.networkType}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">{cluster.version}</span>
                      {cluster.versionNeedsUpdate && (
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {cluster.readyNodes} / {cluster.totalNodes}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{cluster.createTime}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button className="text-gray-600 hover:text-blue-600 text-sm">
                        编辑
                      </button>
                      <span className="text-gray-300">|</span>
                      <button className="text-gray-600 hover:text-blue-600 text-sm">
                        添加节点
                      </button>
                      <span className="text-gray-300">|</span>
                      <button className="text-gray-600 hover:text-blue-600 text-sm">
                        集群监控
                      </button>
                      <button
                        type="button"
                        aria-label={`${cluster.name} 更多操作`}
                        aria-expanded={moreMenu?.cluster.id === cluster.id}
                        onClick={(event) => {
                          event.stopPropagation();
                          if (moreMenu?.cluster.id === cluster.id) {
                            setMoreMenu(null);
                            return;
                          }

                          const rect = event.currentTarget.getBoundingClientRect();
                          setMoreMenu({
                            cluster,
                            top: rect.bottom + 4,
                            right: Math.max(8, window.innerWidth - rect.right),
                          });
                        }}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                      >
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
        <div className="flex flex-col gap-3 px-4 py-4 bg-white border-t border-gray-200 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="text-sm text-gray-600">
            共 {totalItems} 条记录 第 {currentPage} / {totalPages} 页
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`px-3 py-1 text-sm border rounded ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="flex items-center gap-2 sm:ml-4">
              <select className="px-2 py-1 text-sm border border-gray-300 rounded bg-white">
                <option>50条/页</option>
                <option>20条/页</option>
                <option>100条/页</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {moreMenu && (
        <div
          className="fixed z-[60] min-w-28 rounded border border-gray-200 bg-white py-1 shadow-lg"
          style={{ top: moreMenu.top, right: moreMenu.right }}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => {
              const cluster = moreMenu.cluster;
              setMoreMenu(null);
              openOversellConfig(cluster);
            }}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          >
            超卖配置
          </button>
        </div>
      )}

      {oversellCluster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="oversell-dialog-title" className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 id="oversell-dialog-title" className="text-base font-medium text-gray-900">超卖配置</h2>
                <p className="mt-1 text-sm text-gray-500">集群：{oversellCluster.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setOversellCluster(null)}
                aria-label="关闭超卖配置"
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-5 py-5">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <label htmlFor="oversell-enabled" className="text-sm font-medium text-gray-700">
                    开启集群超卖
                  </label>
                  <button
                    type="button"
                    id="oversell-enabled"
                    role="switch"
                    aria-checked={oversellEnabled}
                    onClick={() => {
                      setOversellEnabled((prev) => !prev);
                      setOversellError('');
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
                      oversellEnabled ? 'bg-blue-600 shadow-inner' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  >
                    <span
                      className={`absolute h-5 w-5 rounded-full bg-white shadow-md ring-1 ring-black/5 transition-all duration-200 ${
                        oversellEnabled ? 'left-[22px]' : 'left-0.5'
                      }`}
                    />
                  </button>
                  <span className={`text-sm transition-colors ${oversellEnabled ? 'text-blue-600' : 'text-gray-500'}`}>
                    {oversellEnabled ? '已开启' : '未开启'}
                  </span>
                </div>

                {oversellEnabled && (
                  <div>
                    <label htmlFor="oversell-factor" className="mb-2 block text-sm font-medium text-gray-700">
                      集群超卖倍数
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id="oversell-factor"
                        type="number"
                        min="0"
                        step="0.1"
                        value={oversellFactor}
                        onChange={(event) => {
                          setOversellFactor(event.target.value);
                          setOversellError('');
                        }}
                        placeholder="请输入超卖倍数"
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <span className="shrink-0 text-sm text-gray-600">倍</span>
                    </div>
                    {oversellError && <p className="mt-2 text-sm text-red-600">{oversellError}</p>}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4">
              <button
                type="button"
                onClick={() => setOversellCluster(null)}
                className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={saveOversellConfig}
                className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
