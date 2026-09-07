'use client';

import { useState } from 'react';
import NodeList from './NodeList';
import AutoScalerTab from './AutoScalerTab';

interface ClusterDetailProps {
  clusterName: string;
  onBack: () => void;
}

export default function ClusterDetail({ clusterName, onBack }: ClusterDetailProps) {
  const [activeTab, setActiveTab] = useState('basic');

  const tabs = [
    { id: 'basic', label: '基本信息' },
    { id: 'nodes', label: '节点列表' },
    { id: 'resources', label: '资源列表' },
    { id: 'autoscaler', label: '弹性伸缩' },
    { id: 'strategy', label: '混部策略' },
    { id: 'sharing', label: '闲置算力分享计划' },
    { id: 'appstore', label: '应用商店' },
    { id: 'k8s', label: 'K8S权限管理' },
    { id: 'network', label: '网络策略' },
  ];

  const clusterInfo = {
    name: clusterName,
    chineseName: clusterName,
    id: '1447',
    type: '独享集群',
    status: 'Active',
    operationStatus: '正常',
    zone: 'bjzdt',
    k8sVersion: 'v1.30.8',
    masterMode: '托管Master',
    networkType: '云原生网络',
    kubeConfig: '提供KubeConfig',
    containerRuntime: 'containerd 1.6.32',
    vpc: '容器测试VPC | vpc-65e97091584c7 | 11.42.128.0/20(非隔离)',
    subnet: '11.42.128.0/22',
    nodeNetwork: '11.42.128.0/22',
    serviceNetwork: '17.2.24.0/16',
    clusterKey: '9Fk4WNAJKYdt5jpGxRVSag==',
    nodeSecurityGroup: '--',
    project: 'stark测试',
    createTime: '2026-02-02 10:09:04',
    creator: 'jidongdong',
    enabled: '启用',
  };

  const resourceMonitor = {
    cpu: { total: 15.00, used: 2.00, available: 13.00 },
    memory: { total: 28.74, used: 4.91, available: 23.83 },
    nodes: { total: 2, normal: 2, abnormal: 0 },
    instances: { total: 0, normal: 0, abnormal: 0 },
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* 面包屑导航区域 */}
      <div className="flex h-14 shrink-0 items-center justify-between gap-4 px-4 text-sm text-gray-600 bg-white border-b border-gray-200 sm:px-6">
        <div className="min-w-0 truncate whitespace-nowrap flex items-center gap-2">
          <span>产品团队-专用</span>
          <span className="text-gray-400">{'>'}</span>
          <span>stark测试</span>
          <span className="text-gray-400">{'>'}</span>
          <span className="text-gray-900 font-medium">独享集群</span>
          <span className="text-gray-400">{'>'}</span>
          <span className="text-gray-900 font-medium">集群详情</span>
        </div>
        <a href="#" className="shrink-0 text-blue-600 hover:underline">
          CIS帮助文档
        </a>
      </div>

      {/* 内容区域 */}
      <div className="flex min-h-0 flex-1 flex-col bg-gray-50">
        {/* 标签页导航 */}
        <div className="shrink-0 bg-white border-b border-gray-200">
          <div className="overflow-x-auto">
            <div className="flex min-w-max items-center gap-1 px-4 sm:px-6">
              <button
                onClick={onBack}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                title="返回集群列表"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 标签页内容 */}
        <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              {/* 集群基础信息 */}
              <div className="bg-white rounded border border-gray-200 p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">集群基础信息</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-6">
                  <div className="space-y-4">
                    <div className="flex">
                      <span className="w-28 text-sm text-gray-500 flex-shrink-0">集群名称:</span>
                      <span className="text-sm text-gray-900">{clusterInfo.name}</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-sm text-gray-500 flex-shrink-0">中文名称:</span>
                      <span className="text-sm text-gray-900">{clusterInfo.chineseName}</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-sm text-gray-500 flex-shrink-0">集群ID:</span>
                      <span className="text-sm text-gray-900">{clusterInfo.id}</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-sm text-gray-500 flex-shrink-0">集群类型:</span>
                      <span className="text-sm text-gray-900">{clusterInfo.type}</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-sm text-gray-500 flex-shrink-0">运行状态:</span>
                      <span className="inline-block px-2 py-0.5 text-xs text-blue-600 bg-blue-50 rounded">Active</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-sm text-gray-500 flex-shrink-0">运维状态:</span>
                      <span className="text-sm text-gray-900">{clusterInfo.operationStatus}</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-sm text-gray-500 flex-shrink-0">可用区:</span>
                      <span className="text-sm text-gray-900">{clusterInfo.zone}</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-sm text-gray-500 flex-shrink-0">K8S版本:</span>
                      <span className="text-sm text-gray-900">{clusterInfo.k8sVersion}</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-sm text-gray-500 flex-shrink-0">Master模式:</span>
                      <span className="text-sm text-gray-900">{clusterInfo.masterMode}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex">
                      <span className="w-28 text-sm text-gray-500 flex-shrink-0">网络类型:</span>
                      <span className="text-sm text-gray-900">{clusterInfo.networkType}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-28 text-sm text-gray-500 flex-shrink-0">KubeConfig:</span>
                      <div className="flex flex-col gap-1">
                        <a href="#" className="text-sm text-blue-600 hover:underline">KubeConfig下载</a>
                        <a href="#" className="text-sm text-blue-600 hover:underline">使用Kubectl操作指引</a>
                      </div>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-sm text-gray-500 flex-shrink-0">容器运行时:</span>
                      <span className="text-sm text-gray-900">{clusterInfo.containerRuntime}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-28 text-sm text-gray-500 flex-shrink-0">专有网络:</span>
                      <span className="text-sm text-gray-900">{clusterInfo.vpc}</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-sm text-gray-500 flex-shrink-0">存储类型:</span>
                      <span className="text-sm text-gray-900">-</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-sm text-gray-500 flex-shrink-0">集群是否启用:</span>
                      <span className="text-sm text-gray-900">{clusterInfo.enabled}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-28 text-sm text-gray-500 flex-shrink-0">子网(Pod网络):</span>
                      <span className="text-sm text-gray-900">{clusterInfo.subnet}</span>
                      <a href="#" className="ml-2 text-xs text-blue-600 hover:underline">扩容</a>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-sm text-gray-500 flex-shrink-0">本地盘类型:</span>
                      <span className="text-sm text-gray-900">-</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-sm text-gray-500 flex-shrink-0">创建人:</span>
                      <span className="text-sm text-gray-900">{clusterInfo.creator}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <span className="w-28 text-sm text-gray-500 flex-shrink-0">节点网络:</span>
                      <span className="text-sm text-gray-900">{clusterInfo.nodeNetwork}</span>
                      <a href="#" className="ml-2 text-xs text-blue-600 hover:underline">扩容</a>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-sm text-gray-500 flex-shrink-0">归属项目:</span>
                      <span className="text-sm text-gray-900">{clusterInfo.project}</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-sm text-gray-500 flex-shrink-0">创建时间:</span>
                      <span className="text-sm text-gray-900">{clusterInfo.createTime}</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-sm text-gray-500 flex-shrink-0">Service网络:</span>
                      <span className="text-sm text-gray-900">{clusterInfo.serviceNetwork}</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-sm text-gray-500 flex-shrink-0">Ingress关联VIP:</span>
                      <span className="text-sm text-gray-900">-</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-sm text-gray-500 flex-shrink-0">描述:</span>
                      <span className="text-sm text-gray-900">-</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-sm text-gray-500 flex-shrink-0">集群密钥:</span>
                      <span className="text-sm text-gray-900">{clusterInfo.clusterKey}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-28 text-sm text-gray-500 flex-shrink-0">节点安全组:</span>
                      <span className="text-sm text-gray-900">{clusterInfo.nodeSecurityGroup}</span>
                      <a href="#" className="ml-2 text-xs text-blue-600 hover:underline">修改安全组</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* 资源监控与节点状态 */}
              <div className="grid grid-cols-3 gap-6">
                {/* CPU使用量 */}
                <div className="bg-white rounded border border-gray-200 p-6">
                  <h3 className="text-base font-medium text-gray-900 mb-4">CPU使用量(C)</h3>
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                        <circle 
                          cx="64" cy="64" r="56" 
                          stroke="#3b82f6" 
                          strokeWidth="12" 
                          fill="none"
                          strokeDasharray={`${(resourceMonitor.cpu.used / resourceMonitor.cpu.total) * 352} 352`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-medium text-gray-900">{resourceMonitor.cpu.used.toFixed(2)}</div>
                          <div className="text-xs text-gray-500">已使用</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">总容量</span>
                      <span className="text-gray-900">{resourceMonitor.cpu.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">已分配</span>
                      <span className="text-gray-900">{resourceMonitor.cpu.used.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">未分配</span>
                      <span className="text-gray-900">{resourceMonitor.cpu.available.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* 内存使用量 */}
                <div className="bg-white rounded border border-gray-200 p-6">
                  <h3 className="text-base font-medium text-gray-900 mb-4">内存使用量(G)</h3>
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                        <circle 
                          cx="64" cy="64" r="56" 
                          stroke="#3b82f6" 
                          strokeWidth="12" 
                          fill="none"
                          strokeDasharray={`${(resourceMonitor.memory.used / resourceMonitor.memory.total) * 352} 352`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-medium text-gray-900">{resourceMonitor.memory.used.toFixed(2)}</div>
                          <div className="text-xs text-gray-500">已使用</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">总容量</span>
                      <span className="text-gray-900">{resourceMonitor.memory.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">已分配</span>
                      <span className="text-gray-900">{resourceMonitor.memory.used.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">未分配</span>
                      <span className="text-gray-900">{resourceMonitor.memory.available.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* 节点与实例状态 */}
                <div className="bg-white rounded border border-gray-200 p-6">
                  <h3 className="text-base font-medium text-gray-900 mb-4">节点与实例状态</h3>
                  
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-700">计算节点</span>
                      <span className="text-sm text-gray-900">{resourceMonitor.nodes.total}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-gray-500">正常 {resourceMonitor.nodes.normal}</span>
                      <span className="text-xs text-gray-500">异常 {resourceMonitor.nodes.abnormal}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(resourceMonitor.nodes.normal / resourceMonitor.nodes.total) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-700">实例</span>
                      <span className="text-sm text-gray-900">{resourceMonitor.instances.total}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-gray-500">正常 {resourceMonitor.instances.normal}</span>
                      <span className="text-xs text-gray-500">异常 {resourceMonitor.instances.abnormal}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 rounded-full"
                        style={{ width: `${(resourceMonitor.instances.total > 0 ? (resourceMonitor.instances.normal / resourceMonitor.instances.total) * 100 : 0)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'nodes' && <NodeList clusterName={clusterName} />}

          {activeTab === 'autoscaler' && <AutoScalerTab />}

          {activeTab !== 'basic' && activeTab !== 'nodes' && activeTab !== 'autoscaler' && (
            <div className="bg-white rounded border border-gray-200 p-12 text-center">
              <div className="text-sm text-gray-500">
                {tabs.find(t => t.id === activeTab)?.label}功能开发中...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
