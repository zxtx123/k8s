'use client';

import { useState } from 'react';

interface DeploymentDetailProps {
  deploymentName: string;
  deploymentId: number;
  onBack: () => void;
  onEditVersion?: (version: VersionItem) => void;
}

interface VersionItem {
  id: number;
  version: string;
  createTime: string;
  updateTime: string;
  image: string;
  onlineCluster: string;
  onlineStatus: string;
  onlineRatio: string;
  releaseNote: string;
  creator: string;
}

function TrafficTab() {
  const [activeSubTab, setActiveSubTab] = useState<'loadbalancer' | 'service'>('loadbalancer');

  const loadbalancerData = [
    {
      id: 28047,
      name: 'zxtest-fsdfsdfsdf',
      vip: '',
      port: '8080:80/TCP',
      onlineCluster: '未发布',
      configCluster: 'pub-bjmdd',
      releaseNote: 'fsdfsdfsdfsd',
      createTime: '2024-11-07 16:49:30',
      creator: 'zhangxing5',
    },
  ];

  const serviceData: unknown[] = [];

  return (
    <div className="p-4">
      {/* 二级Tab */}
      <div className="flex items-center border-b border-[#E5E6EB] mb-4">
        <button
          className={`px-4 py-2 text-sm relative ${
            activeSubTab === 'loadbalancer'
              ? 'text-[#165DFF] font-medium'
              : 'text-[#4E5969] hover:text-[#1F2329]'
          }`}
          onClick={() => setActiveSubTab('loadbalancer')}
        >
          {activeSubTab === 'loadbalancer' && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3 bg-[#165DFF] rounded-r" />
          )}
          负载均衡
          {activeSubTab === 'loadbalancer' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#165DFF]" />
          )}
        </button>
        <button
          className={`px-4 py-2 text-sm relative ${
            activeSubTab === 'service'
              ? 'text-[#165DFF] font-medium'
              : 'text-[#4E5969] hover:text-[#1F2329]'
          }`}
          onClick={() => setActiveSubTab('service')}
        >
          {activeSubTab === 'service' && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3 bg-[#165DFF] rounded-r" />
          )}
          Service
          {activeSubTab === 'service' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#165DFF]" />
          )}
        </button>
      </div>

      {/* 负载均衡表格 */}
      {activeSubTab === 'loadbalancer' && (
        <div className="border border-[#E5E6EB] rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F7F8FA] border-b border-[#E5E6EB]">
                <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">ID</th>
                <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">名称</th>
                <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">VIP</th>
                <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">端口号</th>
                <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">上线集群</th>
                <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">配置集群</th>
                <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">发布说明</th>
                <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">创建时间</th>
                <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">创建者</th>
                <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {loadbalancerData.map((item) => (
                <tr key={item.id} className="border-b border-[#E5E6EB] hover:bg-[#F7F8FA]">
                  <td className="px-3 py-3 text-[#1F2329]">{item.id}</td>
                  <td className="px-3 py-3 text-[#1F2329]">{item.name}</td>
                  <td className="px-3 py-3 text-[#1F2329]">{item.vip || '-'}</td>
                  <td className="px-3 py-3 text-[#1F2329]">{item.port}</td>
                  <td className="px-3 py-3">
                    <span className="inline-block px-2 py-0.5 text-xs bg-[#F2F3F5] text-[#86909C] rounded">
                      {item.onlineCluster}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-[#1F2329]">{item.configCluster}</td>
                  <td className="px-3 py-3 text-[#1F2329] max-w-[120px] truncate">{item.releaseNote}</td>
                  <td className="px-3 py-3 text-[#1F2329] whitespace-nowrap">{item.createTime}</td>
                  <td className="px-3 py-3 text-[#1F2329]">{item.creator}</td>
                  <td className="px-3 py-3">
                    <span className="text-[#165DFF] cursor-pointer hover:text-[#0E4ADB] text-sm">管理</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Service表格 */}
      {activeSubTab === 'service' && (
        <div className="border border-[#E5E6EB] rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F7F8FA] border-b border-[#E5E6EB]">
                <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">ID</th>
                <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">名称</th>
                <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">类型</th>
                <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">ClusterIP</th>
                <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">端口</th>
                <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">关联集群</th>
                <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">创建时间</th>
                <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">创建者</th>
                <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={9} className="py-12 text-center">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-[#C9CDD4] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <span className="text-sm text-[#86909C]">暂无数据</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function DeploymentDetail({ deploymentName, deploymentId, onBack, onEditVersion }: DeploymentDetailProps) {
  const [activeTab, setActiveTab] = useState('version');
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedVersions, setSelectedVersions] = useState<Set<number>>(new Set());
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishVersion, setPublishVersion] = useState('');
  const [publishMethod, setPublishMethod] = useState('rolling');
  const [rollingCount, setRollingCount] = useState('25%');
  const [maxUnavailable, setMaxUnavailable] = useState('25%');
  const [publishClusters, setPublishClusters] = useState([
    { name: 'pub-bjmd', type: 'public' as const, replicas: 1, hostGroup: 'default', remaining: '95C,191G', needed: '0.0C,0.0G', selected: false },
    { name: 'pub-bjpdc', type: 'public' as const, replicas: 1, hostGroup: 'default', remaining: '985C,1971G', needed: '1.0C,2.0G', selected: true },
    { name: 'pub-bjwdt', type: 'public' as const, replicas: 1, hostGroup: 'default', remaining: '84C,169G', needed: '1.0C,2.0G', selected: true },
    { name: 'pub-bjzdt', type: 'public' as const, replicas: 1, hostGroup: 'default', remaining: '91C,184G', needed: '1.0C,2.0G', selected: true },
  ]);

  // 基本信息模拟数据
  const basicInfo = {
    name: deploymentName,
    id: deploymentId,
    podNormal: 1,
    podAbnormal: 0,
    jobType: '共享型(LS)',
    cluster: 'pub-bjmd',
    group: '',
    createTime: '2024-12-30 19:57:30',
    creator: 'zhangxing5',
    description: deploymentName === 'zxtest-ffffffff' ? 'fffffffff' : '',
  };

  // 版本列表模拟数据
  const versions: VersionItem[] = [
    {
      id: 745193,
      version: 'V1',
      createTime: '2024-12-30 19:57:30',
      updateTime: '2024-12-31 18:49:40',
      image: 'nginx:latest',
      onlineCluster: 'pub-bjmd',
      onlineStatus: 'success',
      onlineRatio: '1/1',
      releaseNote: basicInfo.description || '-',
      creator: 'zhangxing5',
    },
  ];

  const totalPages = Math.ceil(versions.length / itemsPerPage);
  const pageData = versions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSelect = (id: number) => {
    const newSelected = new Set(selectedVersions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedVersions(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedVersions.size === pageData.length) {
      setSelectedVersions(new Set());
    } else {
      setSelectedVersions(new Set(pageData.map(item => item.id)));
    }
  };

  const tabs = [
    { key: 'version', label: '版本' },
    { key: 'autoscaler', label: '弹性伸缩' },
    { key: 'traffic', label: '流量接入' },
    { key: 'event', label: '事件' },
  ];

  return (
    <div className="h-full flex flex-col bg-[#F0F5F7]">
      {/* 面包屑导航 */}
      <div className="h-14 flex items-center justify-between px-5 flex-shrink-0 bg-white border-b border-gray-200">
        <div className="flex items-center text-sm text-gray-500">
          <span className="text-blue-500 cursor-pointer hover:text-blue-600">stark测试</span>
          <span className="mx-2">&gt;</span>
          <span className="text-blue-500 cursor-pointer hover:text-blue-600">zxtest</span>
          <span className="mx-2">&gt;</span>
          <button type="button" onClick={onBack} className="text-blue-500 cursor-pointer hover:text-blue-600">Deployment</button>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-800">版本列表</span>
        </div>
        <a href="#" className="text-blue-500 text-sm hover:text-blue-600">CIS帮助文档</a>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-auto p-5 space-y-4">
        {/* 基本信息卡片 */}
        <div className="bg-white border border-gray-200 rounded">
          <div className="flex items-center px-4 py-3 border-b border-gray-100">
            <div className="w-1 h-4 bg-blue-500 rounded-full mr-2" />
            <span className="font-medium text-gray-800">基本信息</span>
            <svg className="w-4 h-4 text-gray-400 ml-2 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div className="px-4 py-3">
            <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm">
              <div className="flex">
                <span className="text-gray-500 w-40 flex-shrink-0">名称</span>
                <span className="text-gray-800">{basicInfo.name}</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-40 flex-shrink-0">ID</span>
                <span className="text-gray-800">{basicInfo.id}</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-40 flex-shrink-0">Pod数量(正常/异常)</span>
                <span>
                  <span className="text-green-600">{basicInfo.podNormal}</span>
                  <span className="text-gray-400">/</span>
                  <span className={basicInfo.podAbnormal > 0 ? 'text-red-500' : 'text-gray-400'}>{basicInfo.podAbnormal}</span>
                </span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-40 flex-shrink-0">创建时间</span>
                <span className="text-gray-800">{basicInfo.createTime}</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-40 flex-shrink-0">作业类型</span>
                <span className="text-gray-800">{basicInfo.jobType}</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-40 flex-shrink-0">创建人</span>
                <span className="text-gray-800">{basicInfo.creator}</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-40 flex-shrink-0">发布集群</span>
                <span className="text-gray-800">{basicInfo.cluster}</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-40 flex-shrink-0">描述</span>
                <span className="text-gray-800">{basicInfo.description || '-'}</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-40 flex-shrink-0">分组</span>
                <span className="text-gray-800">{basicInfo.group || '-'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 详情信息卡片 */}
        <div className="bg-white border border-gray-200 rounded">
          <div className="flex items-center px-4 py-3 border-b border-gray-100">
            <div className="w-1 h-4 bg-blue-500 rounded-full mr-2" />
            <span className="font-medium text-gray-800">详情信息</span>
            <svg className="w-4 h-4 text-gray-400 ml-2 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* 标签页 */}
          <div className="px-4 border-b border-gray-200">
            <div className="flex gap-0">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2.5 text-sm border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'text-blue-500 border-blue-500 font-medium'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 版本标签页内容 */}
          {activeTab === 'version' && (
            <div className="p-4">
              {/* 版本操作栏 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-700 font-medium">{deploymentName}</span>
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <div
                      onClick={() => setShowOnlineOnly(!showOnlineOnly)}
                      className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${
                        showOnlineOnly ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                        showOnlineOnly ? 'left-[18px]' : 'left-0.5'
                      }`} />
                    </div>
                    只显示上线版本
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <button className="border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
                    对比版本
                  </button>
                  <button className="border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
                    发布历史
                  </button>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-sm">
                    + 创建版本
                  </button>
                </div>
              </div>

              {/* 版本列表表格 */}
              <div className="border border-gray-200 rounded">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F8F9FA] border-b border-gray-200">
                      <th className="w-10 px-3 py-2.5 text-left">
                        <input
                          type="checkbox"
                          checked={pageData.length > 0 && selectedVersions.size === pageData.length}
                          onChange={toggleSelectAll}
                          className="rounded"
                        />
                      </th>
                      <th className="px-3 py-2.5 text-left text-gray-600 font-medium">ID</th>
                      <th className="px-3 py-2.5 text-left text-gray-600 font-medium">版本</th>
                      <th className="px-3 py-2.5 text-left text-gray-600 font-medium">创建时间</th>
                      <th className="px-3 py-2.5 text-left text-gray-600 font-medium">更新时间</th>
                      <th className="px-3 py-2.5 text-left text-gray-600 font-medium">镜像</th>
                      <th className="px-3 py-2.5 text-left text-gray-600 font-medium">上线集群</th>
                      <th className="px-3 py-2.5 text-left text-gray-600 font-medium">发布说明</th>
                      <th className="px-3 py-2.5 text-left text-gray-600 font-medium">创建者</th>
                      <th className="px-3 py-2.5 text-left text-gray-600 font-medium">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageData.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-[#F8F9FA]">
                        <td className="px-3 py-3">
                          <input
                            type="checkbox"
                            checked={selectedVersions.has(item.id)}
                            onChange={() => toggleSelect(item.id)}
                            className="rounded"
                          />
                        </td>
                        <td className="px-3 py-3 text-gray-800">{item.id}</td>
                        <td className="px-3 py-3 text-gray-800">{item.version}</td>
                        <td className="px-3 py-3 text-gray-600">{item.createTime}</td>
                        <td className="px-3 py-3 text-gray-600">{item.updateTime}</td>
                        <td className="px-3 py-3 text-gray-800 font-mono text-xs">{item.image}</td>
                        <td className="px-3 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                            {item.onlineCluster} ({item.onlineRatio})
                          </span>
                        </td>
                        <td className="px-3 py-3 text-gray-600 max-w-28 truncate">{item.releaseNote}</td>
                        <td className="px-3 py-3 text-gray-600">{item.creator}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <span className="text-blue-500 cursor-pointer hover:text-blue-600 text-sm" onClick={() => { setPublishVersion(item.version); setShowPublishModal(true); }}>发布</span>
                            <span className="text-gray-300">|</span>
                            <button type="button" onClick={() => onEditVersion?.(item)} className="text-blue-500 cursor-pointer hover:text-blue-600 text-sm">编辑</button>
                            <span className="text-gray-300">|</span>
                            <span className="text-blue-500 cursor-pointer hover:text-blue-600 text-sm">复制</span>
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

              {/* 分页栏 */}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  共{versions.length}条记录 第{currentPage}/{totalPages || 1}页
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
          )}

          {/* 弹性伸缩标签页 */}
          {activeTab === 'autoscaler' && (
            <div className="p-4">
              {/* 提示信息栏 */}
              <div className="mb-4 bg-[#E8F3FF] border border-[#BEDAFF] rounded px-4 py-2.5 flex items-start gap-2">
                <svg className="w-4 h-4 text-[#165DFF] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                <span className="text-sm text-[#4E5969]">监控策略和定时策略同时存在时，定时策略执行后会将监控策略的最小副本数替换成定时策略的目标Pod数</span>
              </div>

              {/* 监控策略模块 */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-[#1F2329]">监控策略</span>
                  <button className="h-7 px-3 text-sm bg-[#165DFF] text-white rounded hover:bg-[#0E4ADB]">创建</button>
                </div>
                <div className="border border-[#E5E6EB] rounded overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#F7F8FA] border-b border-[#E5E6EB]">
                        <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">名称</th>
                        <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">目标使用率</th>
                        <th className="px-3 py-2.5 text-center text-[#86909C] font-medium">最小副本数</th>
                        <th className="px-3 py-2.5 text-center text-[#86909C] font-medium">最大副本数</th>
                        <th className="px-3 py-2.5 text-center text-[#86909C] font-medium">关联集群</th>
                        <th className="px-3 py-2.5 text-center text-[#86909C] font-medium">创建人</th>
                        <th className="px-3 py-2.5 text-center text-[#86909C] font-medium">创建时间</th>
                        <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#E5E6EB] hover:bg-[#F7F8FA]">
                        <td className="px-3 py-3 text-[#1F2329]">metrics</td>
                        <td className="px-3 py-3">
                          <div className="text-[#1F2329] leading-relaxed">
                            <div>CPU: 100%</div>
                            <div>内存: 80%</div>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center text-[#1F2329]">1</td>
                        <td className="px-3 py-3 text-center text-[#1F2329]">2</td>
                        <td className="px-3 py-3 text-center text-[#1F2329]">pub-bjmd(1)</td>
                        <td className="px-3 py-3 text-center text-[#1F2329]">zhangxing5</td>
                        <td className="px-3 py-3 text-center">
                          <div className="text-[#1F2329] leading-relaxed">
                            <div>2026-05-19</div>
                            <div>17:14:22</div>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <span className="text-[#165DFF] cursor-pointer hover:text-[#0E4ADB] text-sm">关联集群</span>
                            <span className="text-[#165DFF] cursor-pointer hover:text-[#0E4ADB] text-sm">编辑</span>
                            <span className="text-[#165DFF] cursor-pointer hover:text-[#0E4ADB] text-sm">复制</span>
                            <button className="text-[#86909C] hover:text-[#4E5969]">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 定时策略模块 */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-[#1F2329]">定时策略</span>
                  <button className="h-7 px-3 text-sm bg-[#165DFF] text-white rounded hover:bg-[#0E4ADB]">创建</button>
                </div>
                <div className="border border-[#E5E6EB] rounded overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#F7F8FA] border-b border-[#E5E6EB]">
                        <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">名称</th>
                        <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">定时设置</th>
                        <th className="px-3 py-2.5 text-center text-[#86909C] font-medium">目标pod数</th>
                        <th className="px-3 py-2.5 text-center text-[#86909C] font-medium">执行策略</th>
                        <th className="px-3 py-2.5 text-center text-[#86909C] font-medium">执行时间</th>
                        <th className="px-3 py-2.5 text-center text-[#86909C] font-medium">关联集群</th>
                        <th className="px-3 py-2.5 text-center text-[#86909C] font-medium">创建人</th>
                        <th className="px-3 py-2.5 text-center text-[#86909C] font-medium">创建时间</th>
                        <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={9} className="py-12 text-center">
                          <div className="flex flex-col items-center">
                            <svg className="w-12 h-12 text-[#C9CDD4] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <span className="text-sm text-[#86909C]">暂无数据</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 流量接入标签页 */}
          {activeTab === 'traffic' && (
            <TrafficTab />
          )}

          {/* 事件标签页 */}
          {activeTab === 'event' && (
            <div className="p-4 text-center text-gray-400 py-12">
              暂无事件记录
            </div>
          )}
        </div>
      </div>

      {/* 发布弹窗 */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowPublishModal(false)} />
          <div className="relative bg-white rounded-lg w-[780px] max-h-[90vh] flex flex-col shadow-xl">
            {/* 标题栏 */}
            <div className="flex items-center justify-between px-6 py-4 flex-shrink-0">
              <h2 className="text-base font-medium text-[#1F2329]">发布Deployment[{publishVersion}]</h2>
              <button
                onClick={() => setShowPublishModal(false)}
                className="text-[#86909C] hover:text-[#4E5969] text-xl leading-none"
              >
                &times;
              </button>
            </div>

            {/* 提示横幅 */}
            <div className="mx-6 mb-4 bg-[#FFFBE6] border border-[#FAAD14] rounded px-4 py-2.5 flex items-start gap-2">
              <svg className="w-4 h-4 text-[#FAAD14] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              <span className="text-sm text-[#4E5969]">当前发布方式为滚动更新，发布后会重启所有Pod，如果仅想修改副本数，请使用修改副本数功能。</span>
            </div>

            {/* 表单内容 */}
            <div className="flex-1 overflow-auto px-6 pb-4">
              {/* 发布方式 */}
              <div className="mb-4">
                <label className="flex items-center text-sm text-[#1F2329] mb-2">
                  <span className="text-[#F53F3F] mr-0.5">*</span>发布方式:
                </label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="publishMethod"
                      checked={publishMethod === 'rolling'}
                      onChange={() => setPublishMethod('rolling')}
                      className="w-4 h-4 text-[#165DFF] focus:ring-[#165DFF] border-[#C9CDD4]"
                    />
                    <span className={`text-sm ${publishMethod === 'rolling' ? 'text-[#165DFF]' : 'text-[#1F2329]'}`}>滚动更新</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="publishMethod"
                      checked={publishMethod === 'gray'}
                      onChange={() => setPublishMethod('gray')}
                      className="w-4 h-4 text-[#165DFF] focus:ring-[#165DFF] border-[#C9CDD4]"
                    />
                    <span className={`text-sm ${publishMethod === 'gray' ? 'text-[#165DFF]' : 'text-[#1F2329]'}`}>灰度更新</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="publishMethod"
                      checked={publishMethod === 'recreate'}
                      onChange={() => setPublishMethod('recreate')}
                      className="w-4 h-4 text-[#165DFF] focus:ring-[#165DFF] border-[#C9CDD4]"
                    />
                    <span className={`text-sm ${publishMethod === 'recreate' ? 'text-[#165DFF]' : 'text-[#1F2329]'}`}>删除重建</span>
                  </label>
                </div>
              </div>

              {/* 滚动数量 */}
              <div className="mb-4">
                <label className="flex items-center text-sm text-[#1F2329] mb-2">
                  <span className="text-[#F53F3F] mr-0.5">*</span>滚动数量
                  <button className="ml-1 text-[#86909C] hover:text-[#4E5969]" title="滚动数量说明">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                  </button>
                </label>
                <input
                  type="text"
                  value={rollingCount}
                  onChange={(e) => setRollingCount(e.target.value)}
                  className="h-9 px-3 text-sm border border-[#E5E6EB] rounded focus:border-[#165DFF] focus:outline-none w-52"
                />
              </div>

              {/* 最大不可用 */}
              <div className="mb-4">
                <label className="flex items-center text-sm text-[#1F2329] mb-2">
                  <span className="text-[#F53F3F] mr-0.5">*</span>最大不可用
                  <button className="ml-1 text-[#86909C] hover:text-[#4E5969]" title="最大不可用说明">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                  </button>
                </label>
                <input
                  type="text"
                  value={maxUnavailable}
                  onChange={(e) => setMaxUnavailable(e.target.value)}
                  className="h-9 px-3 text-sm border border-[#E5E6EB] rounded focus:border-[#165DFF] focus:outline-none w-52"
                />
              </div>

              {/* 集群配置表格 */}
              <div className="border border-[#E5E6EB] rounded overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F7F8FA] border-b border-[#E5E6EB]">
                      <th className="w-10 px-3 py-2.5 text-left">
                        <input
                          type="checkbox"
                          checked={publishClusters.length > 0 && publishClusters.every(c => c.selected)}
                          onChange={() => {
                            const allSelected = publishClusters.every(c => c.selected);
                            setPublishClusters(prev => prev.map(c => ({ ...c, selected: !allSelected })));
                          }}
                          className="rounded border-[#C9CDD4]"
                        />
                      </th>
                      <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">集群</th>
                      <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">
                        副本数
                        <button className="ml-1 text-[#86909C]" title="副本数说明">
                          <svg className="w-3.5 h-3.5 inline" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                        </button>
                      </th>
                      <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">主机组</th>
                      <th className="px-3 py-2.5 text-left text-[#86909C] font-medium">资源用量</th>
                    </tr>
                  </thead>
                  <tbody>
                    {publishClusters.map((cluster, index) => (
                      <tr key={cluster.name} className="border-b border-[#E5E6EB] last:border-b-0 hover:bg-[#F7F8FA]">
                        <td className="px-3 py-2.5">
                          <input
                            type="checkbox"
                            checked={cluster.selected}
                            onChange={() => {
                              setPublishClusters(prev => prev.map((c, i) => i === index ? { ...c, selected: !c.selected } : c));
                            }}
                            className="rounded border-[#C9CDD4]"
                          />
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="text-[#1F2329]">{cluster.name}</span>
                          {cluster.type === 'public' && (
                            <span className="ml-2 text-xs text-green-700 bg-green-100 px-1.5 py-0.5 rounded">公共集群</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5">
                          <input
                            type="number"
                            min={1}
                            value={cluster.replicas}
                            onChange={(e) => {
                              setPublishClusters(prev => prev.map((c, i) => i === index ? { ...c, replicas: parseInt(e.target.value) || 1 } : c));
                            }}
                            className="w-16 h-7 px-2 text-sm text-center border border-[#E5E6EB] rounded focus:border-[#165DFF] focus:outline-none"
                          />
                        </td>
                        <td className="px-3 py-2.5 text-[#1F2329]">{cluster.hostGroup}</td>
                        <td className="px-3 py-2.5">
                          <div className="text-xs text-[#4E5969] leading-relaxed">
                            <div>集群剩余可用资源: {cluster.remaining}</div>
                            <div>此次发布需要{cluster.needed}</div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 底部按钮 */}
            <div className="flex-shrink-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E5E6EB]">
              <button
                onClick={() => setShowPublishModal(false)}
                className="h-8 px-4 text-sm border border-[#E5E6EB] rounded text-[#1F2329] bg-white hover:bg-[#F2F3F5]"
              >
                取消
              </button>
              <button
                onClick={() => setShowPublishModal(false)}
                className="h-8 px-4 text-sm bg-[#165DFF] text-white rounded hover:bg-[#0E4ADB]"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
