'use client';

import { useState } from 'react';

interface NodeListProps {
  clusterName: string;
}

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

export default function NodeList({ clusterName }: NodeListProps) {
  const [nodeType, setNodeType] = useState<'worker' | 'master'>('worker');
  const [selectedFilters, setSelectedFilters] = useState({
    nodeLabel: 'all',
    createMethod: 'all',
    scheduleStatus: 'all',
    mixStrategy: 'all',
    availabilityZone: 'all',
  });
  const [searchTerm, setSearchTerm] = useState('');

  // 资源监控数据
  const resourceMetrics = {
    nodeReady: { used: 2, total: 2, percentage: 100 },
    nodeSchedulable: { used: 2, total: 2, percentage: 100 },
    cpu: { used: 2.00, total: 15.00, percentage: 13 },
    memory: { used: 4.91, total: 28.74, percentage: 17 },
  };

  // 节点列表数据
  const nodes = [
    {
      name: 'p95322v.hulk.bjzdt.',
      ip: '11.42.129.7',
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
  ];

  return (
    <div className="space-y-6">
      {/* 资源监控仪表盘 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center gap-8">
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
            添加节点
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm">
            设置WebHook
          </button>
          <div className="relative">
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm flex items-center gap-2">
              批量操作
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm">
            刷新
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="节点名称"
            className="w-64 px-4 py-2 pl-10 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* 节点筛选器 */}
      <div className="flex flex-wrap gap-4 items-center">
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
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">节点名称</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">节点IP</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">创建方式</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">节点状态</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">内核版本</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Kubelet/Cri版本</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">规格</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">CPU (core)</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">内存 (G)</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">GPU信息</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Pods</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">vGPU</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">创建时间</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {nodes.map((node, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">{node.name}</span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-900">{node.ip}</td>
                <td className="px-4 py-3 text-gray-700">{node.createMethod}</td>
                <td className="px-4 py-3">
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
                <td className="px-4 py-3 text-gray-500">{node.gpuInfo || '-'}</td>
                <td className="px-4 py-3 text-gray-700">
                  {node.podsUsed} / {node.podsTotal}
                </td>
                <td className="px-4 py-3">
                  <div className="w-10 h-5 bg-gray-200 rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute left-0 shadow-sm border border-gray-300"></div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-700">{node.createTime}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button className="text-blue-600 hover:text-blue-700 text-sm">停止调度</button>
                    <button className="text-blue-600 hover:text-blue-700 text-sm">监控</button>
                    <button className="text-blue-600 hover:text-blue-700 text-sm">混部设置</button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
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
  );
}
