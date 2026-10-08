'use client';

import { useEffect, useState } from 'react';

import NodeGroupNodeForm from './NodeGroupNodeForm';

interface NodeListProps {
  clusterName: string;
  filterNodeGroup?: string;
  onClearNodeGroupFilter?: () => void;
}

type Node = {
  name: string;
  ip: string;
  nodeGroup: string;
  createMethod: string;
  status: string;
  kernelVersion: string;
  kubeletVersion: string;
  criVersion: string;
  spec: string;
  cpuUsed: number;
  cpuTotal: number;
  memUsed: number;
  memTotal: number;
  gpuInfo: string;
  podsUsed: number;
  podsTotal: number;
  vgpuEnabled: boolean;
  createTime: string;
};

// 环形仪表盘组件 - 必须在渲染函数外部定义
function CircularGauge({ 
  title, 
  value, 
  unit, 
  percentage, 
  showPercentage = true 
}: { 
  title: string; 
  value: string; 
  unit: string; 
  percentage: number; 
  showPercentage?: boolean;
}) {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  // 根据百分比确定颜色
  const getStrokeColor = () => {
    if (percentage < 25) return '#EF4444'; // 红色预警
    if (percentage < 75) return '#3B82F6'; // 蓝色正常
    return '#60A5FA'; // 浅蓝高负载
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90">
          {/* 背景圆环 */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="8"
          />
          {/* 进度圆环 */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke={getStrokeColor()}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-300"
          />
        </svg>
        {/* 中心文字 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">{percentage}%</div>
          </div>
        </div>
      </div>
      <div className="text-center mt-2">
        <div className="text-sm text-gray-600">{title}</div>
        <div className="text-xs text-gray-500">{value} {unit}</div>
      </div>
    </div>
  );
}

export default function NodeList({ clusterName, filterNodeGroup, onClearNodeGroupFilter }: NodeListProps) {
  const [nodeType, setNodeType] = useState<'worker' | 'master'>('worker');
  const [selectedFilters, setSelectedFilters] = useState({
    nodeLabel: 'all',
    createMethod: 'all',
    scheduleStatus: 'all',
    mixStrategy: 'all',
    availabilityZone: 'all',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [nodeGroupFilter, setNodeGroupFilter] = useState(filterNodeGroup ?? 'all');
  const [selectedNodeNames, setSelectedNodeNames] = useState<string[]>([]);
  const [isBatchMenuOpen, setIsBatchMenuOpen] = useState(false);
  const [isBatchOversellDialogOpen, setIsBatchOversellDialogOpen] = useState(false);
  const [batchOversellFactor, setBatchOversellFactor] = useState('3');
  const [batchOversellError, setBatchOversellError] = useState('');
  const [oversellNode, setOversellNode] = useState<Node | null>(null);
  const [oversellFactor, setOversellFactor] = useState('3');
  const [oversellFactors, setOversellFactors] = useState<Record<string, string>>({});
  const [oversellError, setOversellError] = useState('');
  const [isBatchSwapDialogOpen, setIsBatchSwapDialogOpen] = useState(false);
  const [batchSwapSizeInput, setBatchSwapSizeInput] = useState('0');
  const [batchSwapError, setBatchSwapError] = useState('');
  const [swapNode, setSwapNode] = useState<Node | null>(null);
  const [swapSizeInput, setSwapSizeInput] = useState('0');
  const [swapSizes, setSwapSizes] = useState<Record<string, string>>({});
  const [swapNodeError, setSwapNodeError] = useState('');
  const [moreMenu, setMoreMenu] = useState<{
    node: Node;
    top: number;
    right: number;
  } | null>(null);

  // 添加节点页面
  const [view, setView] = useState<'list' | 'addNode'>('list');
  const [addNodeSelectedGroup, setAddNodeSelectedGroup] = useState('');
  const [addGroupSelectError, setAddGroupSelectError] = useState('');

  // 资源监控数据
  const resourceMetrics = {
    nodeReady: { used: 2, total: 2, percentage: 100 },
    nodeSchedulable: { used: 2, total: 2, percentage: 100 },
    cpu: { used: 2.00, total: 15.00, percentage: 13 },
    memory: { used: 4.91, total: 28.74, percentage: 17 },
  };

  // 节点列表数据
  const nodes: Node[] = [
    {
      name: 'p95322v.hulk.bjzdt.',
      ip: '11.42.129.7',
      nodeGroup: '通用计算组',
      createMethod: '新建节点',
      status: '正常',
      kernelVersion: '5.10.134-14.an8.x86_6',
      kubeletVersion: 'v1.30.8',
      criVersion: 'containerd://',
      spec: '8vCPU 16GB',
      cpuUsed: 0.90,
      cpuTotal: 6.00,
      memUsed: 2.24,
      memTotal: 12.29,
      gpuInfo: '',
      podsUsed: 11,
      podsTotal: 6,
      vgpuEnabled: false,
      createTime: '2026-02-02',
    },
    {
      name: 'p95323v.hulk.bjzdt.',
      ip: '11.42.129.8',
      nodeGroup: '大数据内存组',
      createMethod: '已有节点',
      status: '正常',
      kernelVersion: '5.10.134-14.an8.x86_6',
      kubeletVersion: 'v1.30.8',
      criVersion: 'containerd://',
      spec: '16vCPU 32GB',
      cpuUsed: 3.42,
      cpuTotal: 14.00,
      memUsed: 8.75,
      memTotal: 28.40,
      gpuInfo: 'NVIDIA T4 × 1',
      podsUsed: 18,
      podsTotal: 60,
      vgpuEnabled: true,
      createTime: '2026-02-10',
    },
    {
      name: 'p95324v.hulk.bjzdt.',
      ip: '11.42.129.9',
      nodeGroup: '通用计算组',
      createMethod: '弹性伸缩',
      status: '正常',
      kernelVersion: '5.10.134-14.an8.x86_6',
      kubeletVersion: 'v1.30.8',
      criVersion: 'containerd://',
      spec: '4vCPU 8GB',
      cpuUsed: 1.18,
      cpuTotal: 3.80,
      memUsed: 3.16,
      memTotal: 7.42,
      gpuInfo: '',
      podsUsed: 9,
      podsTotal: 30,
      vgpuEnabled: false,
      createTime: '2026-02-18',
    },
  ];

  const nodeGroupOptions = Array.from(new Set(nodes.map((node) => node.nodeGroup)));
  const displayNodes = nodes.filter(
    (node) =>
      (filterNodeGroup ? node.nodeGroup === filterNodeGroup : true) &&
      (nodeGroupFilter === 'all' || node.nodeGroup === nodeGroupFilter)
  );

  const selectedNodes = displayNodes.filter((node) => selectedNodeNames.includes(node.name));
  const allNodesSelected = displayNodes.length > 0 && selectedNodes.length === displayNodes.length;
  const partiallySelected = selectedNodeNames.length > 0 && !allNodesSelected;

  const toggleNodeSelection = (nodeName: string) => {
    setSelectedNodeNames((prev) => (
      prev.includes(nodeName)
        ? prev.filter((name) => name !== nodeName)
        : [...prev, nodeName]
    ));
  };

  const toggleAllNodes = () => {
    setSelectedNodeNames(allNodesSelected ? [] : displayNodes.map((node) => node.name));
  };

  useEffect(() => {
    const closeMenus = () => {
      setMoreMenu(null);
      setIsBatchMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenus();
    };

    window.addEventListener('click', closeMenus);
    window.addEventListener('keydown', closeOnEscape);
    window.addEventListener('resize', closeMenus);
    window.addEventListener('scroll', closeMenus, true);
    return () => {
      window.removeEventListener('click', closeMenus);
      window.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('resize', closeMenus);
      window.removeEventListener('scroll', closeMenus, true);
    };
  }, []);

  const openOversellConfig = (node: Node) => {
    setOversellNode(node);
    setOversellFactor(oversellFactors[node.name] ?? '3');
    setOversellError('');
  };

  const saveOversellConfig = () => {
    const factor = Number(oversellFactor);
    if (!Number.isFinite(factor) || factor <= 0) {
      setOversellError('请输入大于 0 的超卖倍数');
      return;
    }

    if (oversellNode) {
      setOversellFactors((prev) => ({ ...prev, [oversellNode.name]: oversellFactor }));
    }
    setOversellNode(null);
  };

  const openSwapConfig = (node: Node) => {
    setSwapNode(node);
    setSwapSizeInput(swapSizes[node.name] ?? '0');
    setSwapNodeError('');
  };

  const saveSwapConfig = () => {
    const size = Number(swapSizeInput);
    if (!Number.isFinite(size) || size < 0 || !Number.isInteger(size)) {
      setSwapNodeError('请输入不小于 0 的整数 SWAP 大小');
      return;
    }

    if (swapNode) {
      setSwapSizes((prev) => ({ ...prev, [swapNode.name]: swapSizeInput }));
    }
    setSwapNode(null);
  };

  const saveBatchOversellConfig = () => {
    const factor = Number(batchOversellFactor);
    if (!Number.isFinite(factor) || factor <= 0) {
      setBatchOversellError('请输入大于 0 的超卖倍数');
      return;
    }

    setOversellFactors((prev) => ({
      ...prev,
      ...Object.fromEntries(selectedNodes.map((node) => [node.name, batchOversellFactor])),
    }));
    setIsBatchOversellDialogOpen(false);
  };

  const saveBatchSwapConfig = () => {
    const size = Number(batchSwapSizeInput);
    if (!Number.isFinite(size) || size < 0 || !Number.isInteger(size)) {
      setBatchSwapError('请输入不小于 0 的整数 SWAP 大小');
      return;
    }

    setSwapSizes((prev) => ({
      ...prev,
      ...Object.fromEntries(selectedNodes.map((node) => [node.name, batchSwapSizeInput])),
    }));
    setIsBatchSwapDialogOpen(false);
  };

  const openAddNodePage = () => {
    setAddNodeSelectedGroup('');
    setAddGroupSelectError('');
    setView('addNode');
  };

  const handleAddNodeSubmit = () => {
    if (!addNodeSelectedGroup) {
      setAddGroupSelectError('请先选择节点组');
      return;
    }
    setView('list');
  };

  if (view === 'addNode') {
    return (
      <div className="min-w-0 space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <button
            type="button"
            onClick={() => setView('list')}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            ← 返回节点列表
          </button>
          <h2 className="mb-6 mt-4 text-lg font-bold text-gray-900">添加节点</h2>

          <div className="max-w-6xl space-y-8">
            <NodeGroupNodeForm
              showGroupSelect
              showSwapField
              nodeGroupOptions={nodeGroupOptions}
              selectedNodeGroup={addNodeSelectedGroup}
              groupSelectError={addGroupSelectError}
              onNodeGroupChange={(name) => {
                setAddNodeSelectedGroup(name);
                setAddGroupSelectError('');
              }}
              onSubmit={handleAddNodeSubmit}
              onCancel={() => setView('list')}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-6">
      {/* 资源监控仪表盘 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <CircularGauge
            title="Node 就绪"
            value={`${resourceMetrics.nodeReady.used}/${resourceMetrics.nodeReady.total}`}
            unit="个"
            percentage={resourceMetrics.nodeReady.percentage}
            showPercentage={true}
          />
          <CircularGauge
            title="Node 可调度"
            value={`${resourceMetrics.nodeSchedulable.used}/${resourceMetrics.nodeSchedulable.total}`}
            unit="个"
            percentage={resourceMetrics.nodeSchedulable.percentage}
            showPercentage={true}
          />
          <CircularGauge
            title="CPU 使用"
            value={`${resourceMetrics.cpu.used.toFixed(2)}`}
            unit={`/ ${resourceMetrics.cpu.total.toFixed(2)}核`}
            percentage={resourceMetrics.cpu.percentage}
            showPercentage={true}
          />
          <CircularGauge
            title="内存使用"
            value={`${resourceMetrics.memory.used.toFixed(2)}`}
            unit={`/ ${resourceMetrics.memory.total.toFixed(2)}G`}
            percentage={resourceMetrics.memory.percentage}
            showPercentage={true}
          />
        </div>
      </div>

      {/* 节点类型切换 */}
      <div className="flex gap-1 border-b border-gray-200">
        <button
          onClick={() => setNodeType('worker')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            nodeType === 'worker'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Worker节点
        </button>
        <button
          onClick={() => setNodeType('master')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            nodeType === 'master'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Master节点
        </button>
      </div>

      {/* 操作按钮组和搜索框 */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={openAddNodePage}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
          >
            添加节点
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm">
            设置WebHook
          </button>
          <div className="relative">
            <button
              type="button"
              aria-expanded={isBatchMenuOpen}
              onClick={(event) => {
                event.stopPropagation();
                setMoreMenu(null);
                setIsBatchMenuOpen((open) => !open);
              }}
              className="flex items-center gap-2 rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              批量操作
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 9-7 7-7-7" />
              </svg>
            </button>
            {isBatchMenuOpen && (
              <div
                className="absolute left-0 z-50 mt-1 min-w-36 rounded border border-gray-200 bg-white py-1 shadow-lg"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  disabled={selectedNodes.length === 0}
                  title={selectedNodes.length === 0 ? '请先选择节点' : undefined}
                  onClick={() => {
                    if (selectedNodes.length === 0) return;
                    setIsBatchMenuOpen(false);
                    setBatchOversellFactor('3');
                    setBatchOversellError('');
                    setIsBatchOversellDialogOpen(true);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-white"
                >
                  批量设置超卖
                </button>
                <button
                  type="button"
                  disabled={selectedNodes.length === 0}
                  title={selectedNodes.length === 0 ? '请先选择节点' : undefined}
                  onClick={() => {
                    if (selectedNodes.length === 0) return;
                    setIsBatchMenuOpen(false);
                    setBatchSwapSizeInput('0');
                    setBatchSwapError('');
                    setIsBatchSwapDialogOpen(true);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-white"
                >
                  批量设置SWAP
                </button>
              </div>
            )}
          </div>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm">
            刷新
          </button>
        </div>
        <div className="relative w-full lg:w-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="节点名称"
            className="w-full px-4 py-2 pl-10 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 lg:w-64"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* 节点筛选器 */}
      <div className="flex flex-wrap items-center gap-4">
        {filterNodeGroup && (
          <div className="flex items-center gap-2 rounded border border-blue-200 bg-blue-50 px-3 py-1.5">
            <span className="text-sm text-blue-700">
              节点组过滤：<span className="font-medium">{filterNodeGroup}</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setNodeGroupFilter('all');
                setSelectedNodeNames([]);
                onClearNodeGroupFilter?.();
              }}
              className="rounded p-0.5 text-blue-400 transition-colors hover:bg-blue-100 hover:text-blue-600"
              aria-label="清除节点组过滤"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 whitespace-nowrap">所属节点组:</label>
          <select
            value={nodeGroupFilter}
            onChange={(e) => {
              setNodeGroupFilter(e.target.value);
              setSelectedNodeNames([]);
            }}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="all">全部</option>
            {nodeGroupOptions.map((groupName) => (
              <option key={groupName} value={groupName}>{groupName}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 whitespace-nowrap">节点标签:</label>
          <select
            value={selectedFilters.nodeLabel}
            onChange={(e) => setSelectedFilters({ ...selectedFilters, nodeLabel: e.target.value })}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="all">全部</option>
            <option value="vpc_default">vpc_default</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 whitespace-nowrap">创建方式:</label>
          <select
            value={selectedFilters.createMethod}
            onChange={(e) => setSelectedFilters({ ...selectedFilters, createMethod: e.target.value })}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="all">全部</option>
            <option value="elastic">弹性伸缩</option>
            <option value="unknown">未知</option>
            <option value="new">新建节点</option>
            <option value="existing">已有节点</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 whitespace-nowrap">调度状态:</label>
          <select
            value={selectedFilters.scheduleStatus}
            onChange={(e) => setSelectedFilters({ ...selectedFilters, scheduleStatus: e.target.value })}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="all">全部</option>
            <option value="schedulable">可调度</option>
            <option value="unschedulable">不可调度</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 whitespace-nowrap">混部策略:</label>
          <select
            value={selectedFilters.mixStrategy}
            onChange={(e) => setSelectedFilters({ ...selectedFilters, mixStrategy: e.target.value })}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="all">全部</option>
            <option value="cluster_group">cluster_group</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 whitespace-nowrap">可用区:</label>
          <select
            value={selectedFilters.availabilityZone}
            onChange={(e) => setSelectedFilters({ ...selectedFilters, availabilityZone: e.target.value })}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="all">全部</option>
            <option value="bjzdt">bjzdt (北京电信25G)</option>
          </select>
        </div>
      </div>

      {/* 节点列表表格 */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-[1560px] w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 whitespace-nowrap px-4 py-3 text-left font-medium text-gray-700">
                <input
                  type="checkbox"
                  aria-label="全选节点"
                  checked={allNodesSelected}
                  ref={(element) => {
                    if (element) element.indeterminate = partiallySelected;
                  }}
                  onChange={toggleAllNodes}
                  className="rounded"
                />
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-700">节点名称</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-700">节点IP</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-700">所属节点组</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-700">创建方式</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-700">节点状态</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-700">内核版本</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-700">Kubelet/Cri版本</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-700">规格</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-700">CPU (core)</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-700">内存 (G)</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-700">Pods</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-700">vGPU</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-700">创建时间</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-700">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {displayNodes.map((node) => (
              <tr key={node.name} className="hover:bg-gray-50">
                <td className="w-12 whitespace-nowrap px-4 py-3">
                  <input
                    type="checkbox"
                    aria-label={`选择节点 ${node.name}`}
                    checked={selectedNodeNames.includes(node.name)}
                    onChange={() => toggleNodeSelection(node.name)}
                    className="rounded"
                  />
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span className="text-blue-600">{node.name}</span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-900">{node.ip}</td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-700">{node.nodeGroup}</td>
                <td className="px-4 py-3 text-gray-700">{node.createMethod}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">正常</span>
                </td>
                <td className="px-4 py-3 text-gray-700">{node.kernelVersion}</td>
                <td className="px-4 py-3 text-gray-700">{node.kubeletVersion} {node.criVersion}</td>
                <td className="px-4 py-3 text-gray-700">{node.spec}</td>
                <td className="px-4 py-3 text-gray-700">
                  {node.cpuUsed.toFixed(2)} / {node.cpuTotal.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {node.memUsed.toFixed(2)} / {node.memTotal.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {node.podsUsed} / {node.podsTotal}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <div className="w-10 h-5 bg-gray-200 rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute left-0 shadow-sm border border-gray-300"></div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-700">{node.createTime}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <button className="text-blue-600 hover:text-blue-700 text-sm">停止调度</button>
                    <button className="text-blue-600 hover:text-blue-700 text-sm">监控</button>
                    <button className="text-blue-600 hover:text-blue-700 text-sm">混部设置</button>
                    <button
                      type="button"
                      aria-label={`${node.name} 更多操作`}
                      aria-expanded={moreMenu?.node.name === node.name}
                      onClick={(event) => {
                        event.stopPropagation();
                        if (moreMenu?.node.name === node.name) {
                          setMoreMenu(null);
                          return;
                        }

                        const rect = event.currentTarget.getBoundingClientRect();
                        setMoreMenu({
                          node,
                          top: rect.bottom + 4,
                          right: Math.max(8, window.innerWidth - rect.right),
                        });
                      }}
                      className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M10 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
              const node = moreMenu.node;
              setMoreMenu(null);
              openOversellConfig(node);
            }}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          >
            超卖配置
          </button>
          <button
            type="button"
            onClick={() => {
              const node = moreMenu.node;
              setMoreMenu(null);
              openSwapConfig(node);
            }}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          >
            SWAP设置
          </button>
        </div>
      )}

      {isBatchOversellDialogOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="batch-oversell-dialog-title" className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 id="batch-oversell-dialog-title" className="text-base font-medium text-gray-900">批量设置超卖</h2>
                <p className="mt-1 text-sm text-gray-500">已选择 {selectedNodes.length} 个节点，设置后将统一覆盖现有超卖倍数。</p>
              </div>
              <button
                type="button"
                aria-label="关闭批量超卖配置"
                onClick={() => setIsBatchOversellDialogOpen(false)}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 px-5 py-4">
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">已勾选节点</p>
                <ul className="max-h-36 space-y-2 overflow-y-auto rounded border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
                  {selectedNodes.map((node) => (
                    <li key={node.name} className="flex items-center justify-between gap-3">
                      <span className="min-w-0 truncate">{node.name}</span>
                      <span className="shrink-0 text-gray-500">{node.ip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <label htmlFor="batch-oversell-factor" className="mb-2 block text-sm font-medium text-gray-700">
                  节点超卖倍数
                </label>
                <input
                  id="batch-oversell-factor"
                  type="number"
                  min="0"
                  step="any"
                  value={batchOversellFactor}
                  onChange={(event) => {
                    setBatchOversellFactor(event.target.value);
                    setBatchOversellError('');
                  }}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="请输入超卖倍数"
                />
                {batchOversellError && <p className="mt-2 text-sm text-red-600">{batchOversellError}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4">
              <button
                type="button"
                onClick={() => setIsBatchOversellDialogOpen(false)}
                className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={saveBatchOversellConfig}
                className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {isBatchSwapDialogOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="batch-swap-dialog-title" className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 id="batch-swap-dialog-title" className="text-base font-medium text-gray-900">批量设置SWAP</h2>
                <p className="mt-1 text-sm text-gray-500">已选择 {selectedNodes.length} 个节点，设置后将统一覆盖现有 SWAP 大小。</p>
              </div>
              <button
                type="button"
                aria-label="关闭批量SWAP设置"
                onClick={() => setIsBatchSwapDialogOpen(false)}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 px-5 py-4">
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">已勾选节点</p>
                <ul className="max-h-36 space-y-2 overflow-y-auto rounded border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
                  {selectedNodes.map((node) => (
                    <li key={node.name} className="flex items-center justify-between gap-3">
                      <span className="min-w-0 truncate">{node.name}</span>
                      <span className="shrink-0 text-gray-500">{node.ip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <label htmlFor="batch-swap-size" className="mb-2 block text-sm font-medium text-gray-700">
                  SWAP大小
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="batch-swap-size"
                    type="number"
                    min="0"
                    step="1"
                    value={batchSwapSizeInput}
                    onChange={(event) => {
                      setBatchSwapSizeInput(event.target.value);
                      setBatchSwapError('');
                    }}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="请输入SWAP大小"
                  />
                  <span className="shrink-0 text-sm text-gray-500">GB</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">SWAP 大小不能超过节点数据盘大小。</p>
                {batchSwapError && <p className="mt-2 text-sm text-red-600">{batchSwapError}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4">
              <button
                type="button"
                onClick={() => setIsBatchSwapDialogOpen(false)}
                className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={saveBatchSwapConfig}
                className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {oversellNode && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="node-oversell-dialog-title" className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 id="node-oversell-dialog-title" className="text-base font-medium text-gray-900">超卖配置</h2>
                <p className="mt-1 text-sm text-gray-500">节点：{oversellNode.name}</p>
              </div>
              <button
                type="button"
                aria-label="关闭超卖配置"
                onClick={() => setOversellNode(null)}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-5 py-4">
              <label htmlFor="node-oversell-factor" className="mb-2 block text-sm font-medium text-gray-700">
                节点超卖倍数
              </label>
              <input
                id="node-oversell-factor"
                type="number"
                min="0"
                step="any"
                value={oversellFactor}
                onChange={(event) => {
                  setOversellFactor(event.target.value);
                  setOversellError('');
                }}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="请输入超卖倍数"
              />
              {oversellError && <p className="mt-2 text-sm text-red-600">{oversellError}</p>}
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4">
              <button
                type="button"
                onClick={() => setOversellNode(null)}
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

      {swapNode && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="node-swap-dialog-title" className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 id="node-swap-dialog-title" className="text-base font-medium text-gray-900">SWAP设置</h2>
                <p className="mt-1 text-sm text-gray-500">节点：{swapNode.name}</p>
              </div>
              <button
                type="button"
                aria-label="关闭SWAP设置"
                onClick={() => setSwapNode(null)}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-5 py-4">
              <label htmlFor="node-swap-size" className="mb-2 block text-sm font-medium text-gray-700">
                SWAP大小
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="node-swap-size"
                  type="number"
                  min="0"
                  step="1"
                  value={swapSizeInput}
                  onChange={(event) => {
                    setSwapSizeInput(event.target.value);
                    setSwapNodeError('');
                  }}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="请输入SWAP大小"
                />
                <span className="shrink-0 text-sm text-gray-500">GB</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">SWAP 大小不能超过节点数据盘大小。</p>
              {swapNodeError && <p className="mt-2 text-sm text-red-600">{swapNodeError}</p>}
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4">
              <button
                type="button"
                onClick={() => setSwapNode(null)}
                className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={saveSwapConfig}
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
