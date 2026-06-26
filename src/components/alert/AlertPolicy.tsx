'use client';

import { useState } from 'react';

export default function AlertPolicy() {
  const [activeTab, setActiveTab] = useState<'workload' | 'cluster'>('workload');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'cluster-system' as 'cluster-system' | 'cluster-node',
    title: '',
    cluster: '',
    component: 'APIServer',
    nodes: [] as string[],
    nodeDropdownOpen: false,
    triggerCondition: 'APIServer可用性异常',
    triggerMetric: 'CPU使用率',
    triggerOperator: '>',
    triggerValue: '0',
    duration: '60',
    maxAlertCount: '',
    alertGroup: '',
    callbackUrl: '',
    alertLevel: '一般',
  });

  const nodeOptions = ['全部', 'node-01', 'node-02', 'node-03', 'node-04', 'node-05', 'node-06'];

  const handleNodeToggle = (node: string) => {
    setFormData(prev => {
      if (node === '全部') {
        if (prev.nodes.length === nodeOptions.length - 1) {
          return { ...prev, nodes: [] };
        }
        return { ...prev, nodes: nodeOptions.filter(n => n !== '全部') };
      }
      const newNodes = prev.nodes.includes(node)
        ? prev.nodes.filter(n => n !== node)
        : [...prev.nodes, node];
      return { ...prev, nodes: newNodes };
    });
  };

  const handleTypeChange = (type: 'cluster-system' | 'cluster-node') => {
    setFormData(prev => ({
      ...prev,
      type,
      ...(type === 'cluster-node'
        ? { triggerMetric: 'CPU使用率', triggerOperator: '>', triggerValue: '0', nodes: [] }
        : { triggerCondition: 'APIServer可用性异常' }),
    }));
  };

  const workloadPolicies = [
    {
      id: 1668,
      type: '事件',
      title: 'tewtwet',
      status: '已停用',
      monitorItem: 'Deployment副本数不符合预期',
      resource: 'zxtest-fdsfsdfsdf',
      container: '全部',
      threshold: '>0',
      alertLevel: '一般',
    },
    {
      id: 644,
      type: '常规',
      title: 'test',
      status: '已停用',
      monitorItem: '内存使用率(含缓存)',
      resource: 'zxtest-test',
      container: '全部',
      threshold: '>0',
      alertLevel: '一般',
    },
  ];

  const clusterPolicies = [
    {
      id: 973,
      type: '集群系统组件',
      title: 'kubelet节点不可调度2',
      status: '已停用',
      cluster: 'monitor-vpc-docker,monitor-vpc-containerd',
      component: 'Kubelet',
      monitorItem: 'Kubelet节点不可调度',
      alertLevel: '一般',
    },
    {
      id: 972,
      type: '集群系统组件',
      title: 'kubelet节点不可调度0',
      status: '已停用',
      cluster: 'monitor-vpc-docker,monitor-vpc-containerd',
      component: 'Kubelet',
      monitorItem: 'Kubelet节点不可调度',
      alertLevel: '一般',
    },
  ];

  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden">
      {/* 面包屑导航 */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#E5E6EB]">
        <div className="text-sm text-[#86909C]">
          <span>stark测试</span>
          <span className="mx-1">&gt;</span>
          <span>zxtest</span>
          <span className="mx-1">&gt;</span>
          <span className="text-[#1F2329]">告警策略</span>
        </div>
        <a href="#" className="text-sm text-[#165DFF]">
          CIS帮助文档
        </a>
      </div>

      {/* 标签页 */}
      <div className="flex items-center gap-0 px-6 border-b border-[#E5E6EB] bg-white">
        <button
          onClick={() => setActiveTab('workload')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'workload'
              ? 'border-[#165DFF] text-[#165DFF]'
              : 'border-transparent text-[#86909C] hover:text-[#1F2329]'
          }`}
        >
          工作负载告警
        </button>
        <button
          onClick={() => setActiveTab('cluster')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'cluster'
              ? 'border-[#165DFF] text-[#165DFF]'
              : 'border-transparent text-[#86909C] hover:text-[#1F2329]'
          }`}
        >
          独享集群告警
        </button>
      </div>

      {/* 操作栏 */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#F7F8FA] border-b border-[#E5E6EB]">
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-1.5 bg-[#165DFF] text-white text-sm rounded hover:bg-[#0E4ADB] flex items-center gap-1"
        >
          <span>+</span>
          创建告警策略
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-[#E5E6EB] text-[#86909C] hover:text-[#165DFF]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* 工作负载告警表格 */}
      {activeTab === 'workload' && (
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-4">
          <div className="min-w-0 overflow-hidden rounded-lg border border-[#E5E6EB]">
            <table className="w-full table-fixed text-sm [&_td]:min-w-0 [&_td]:truncate [&_td]:px-3 [&_td]:py-3 [&_th]:min-w-0 [&_th]:truncate [&_th]:px-3 [&_th]:py-3">
              <thead>
                <tr className="bg-[#F7F8FA]">
                  <th className="text-left px-4 py-3 text-[#1F2329] font-medium">ID</th>
                  <th className="text-left px-4 py-3 text-[#1F2329] font-medium">类型</th>
                  <th className="text-left px-4 py-3 text-[#1F2329] font-medium">标题</th>
                  <th className="text-left px-4 py-3 text-[#1F2329] font-medium">状态</th>
                  <th className="text-left px-4 py-3 text-[#1F2329] font-medium">监控项</th>
                  <th className="text-left px-4 py-3 text-[#1F2329] font-medium">资源</th>
                  <th className="text-left px-4 py-3 text-[#1F2329] font-medium">容器</th>
                  <th className="text-left px-4 py-3 text-[#1F2329] font-medium">阈值</th>
                  <th className="text-left px-4 py-3 text-[#1F2329] font-medium">告警级别</th>
                  <th className="text-left px-4 py-3 text-[#1F2329] font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {workloadPolicies.map((policy) => (
                  <tr key={policy.id} className="border-t border-[#E5E6EB] hover:bg-[#F7F8FA]">
                    <td className="px-4 py-3 text-[#1F2329]">{policy.id}</td>
                    <td className="px-4 py-3 text-[#1F2329]">{policy.type}</td>
                    <td className="px-4 py-3 text-[#1F2329]">{policy.title}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-[#FA8C16]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FA8C16]"></span>
                        {policy.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#1F2329]">{policy.monitorItem}</td>
                    <td className="px-4 py-3 text-[#1F2329]">{policy.resource}</td>
                    <td className="px-4 py-3 text-[#1F2329]">{policy.container}</td>
                    <td className="px-4 py-3 text-[#1F2329]">{policy.threshold}</td>
                    <td className="px-4 py-3 text-[#1F2329]">{policy.alertLevel}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {policy.type === '常规' && (
                        <button className="text-[#165DFF] hover:underline mr-3">编辑</button>
                      )}
                      <button className="text-[#165DFF] hover:underline mr-3">复制</button>
                      <button className="text-[#165DFF] hover:underline mr-3">启用</button>
                      {policy.type === '事件' && (
                        <button className="text-[#165DFF] hover:underline mr-3">删除</button>
                      )}
                      <button className="text-[#86909C] hover:text-[#1F2329]">
                        <svg className="w-4 h-4 inline" fill="currentColor" viewBox="0 0 16 16">
                          <circle cx="4" cy="8" r="1.5" />
                          <circle cx="8" cy="8" r="1.5" />
                          <circle cx="12" cy="8" r="1.5" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 独享集群告警表格 */}
      {activeTab === 'cluster' && (
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-4">
          <div className="min-w-0 overflow-hidden rounded-lg border border-[#E5E6EB]">
            <table className="w-full table-fixed text-sm [&_td]:min-w-0 [&_td]:truncate [&_td]:px-3 [&_td]:py-3 [&_th]:min-w-0 [&_th]:truncate [&_th]:px-3 [&_th]:py-3">
              <thead>
                <tr className="bg-[#F7F8FA]">
                  <th className="text-left px-4 py-3 text-[#1F2329] font-medium">ID</th>
                  <th className="text-left px-4 py-3 text-[#1F2329] font-medium">类型</th>
                  <th className="text-left px-4 py-3 text-[#1F2329] font-medium">标题</th>
                  <th className="text-left px-4 py-3 text-[#1F2329] font-medium">状态</th>
                  <th className="text-left px-4 py-3 text-[#1F2329] font-medium">集群</th>
                  <th className="text-left px-4 py-3 text-[#1F2329] font-medium">告警对象</th>
                  <th className="text-left px-4 py-3 text-[#1F2329] font-medium">监控项</th>
                  <th className="text-left px-4 py-3 text-[#1F2329] font-medium">告警级别</th>
                  <th className="text-left px-4 py-3 text-[#1F2329] font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {clusterPolicies.map((policy) => (
                  <tr key={policy.id} className="border-t border-[#E5E6EB] hover:bg-[#F7F8FA]">
                    <td className="px-4 py-3 text-[#1F2329]">{policy.id}</td>
                    <td className="px-4 py-3 text-[#1F2329]">{policy.type}</td>
                    <td className="px-4 py-3 text-[#1F2329]">{policy.title}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-[#FA8C16]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FA8C16]"></span>
                        {policy.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#1F2329]">{policy.cluster}</td>
                    <td className="px-4 py-3 text-[#1F2329]">{policy.component}</td>
                    <td className="px-4 py-3 text-[#1F2329]">{policy.monitorItem}</td>
                    <td className="px-4 py-3 text-[#1F2329]">{policy.alertLevel}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button className="text-[#165DFF] hover:underline mr-3">编辑</button>
                      <button className="text-[#165DFF] hover:underline mr-3">复制</button>
                      <button className="text-[#165DFF] hover:underline mr-3">启用</button>
                      <button className="text-[#86909C] hover:text-[#1F2329]">
                        <svg className="w-4 h-4 inline" fill="currentColor" viewBox="0 0 16 16">
                          <circle cx="4" cy="8" r="1.5" />
                          <circle cx="8" cy="8" r="1.5" />
                          <circle cx="12" cy="8" r="1.5" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 分页 */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-[#E5E6EB]">
        <span className="text-xs text-[#86909C]">共{activeTab === 'workload' ? workloadPolicies.length : clusterPolicies.length}条记录 第1/1页</span>
        <div className="flex items-center gap-2">
          <button className="w-7 h-7 flex items-center justify-center rounded text-[#C9CDD4] border border-[#E5E6EB]" disabled>
            &lt;
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded bg-[#165DFF] text-white text-xs">
            1
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded text-[#C9CDD4] border border-[#E5E6EB]" disabled>
            &gt;
          </button>
          <select className="h-7 text-xs border border-[#E5E6EB] rounded px-1 text-[#1F2329]">
            <option>10条/页</option>
            <option>20条/页</option>
            <option>50条/页</option>
          </select>
        </div>
      </div>

      {/* 创建独享集群告警策略弹窗 */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-6">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCreateModal(false)} />
          <div className="relative flex max-h-[calc(100vh-96px)] w-[min(560px,calc(100vw-48px))] flex-col overflow-hidden rounded-lg bg-white shadow-xl">
            {/* 弹窗头部 */}
            <div className="flex flex-shrink-0 items-center justify-between border-b border-[#E5E6EB] px-6 py-4">
              <h3 className="text-base font-medium text-[#1F2329]">创建独享集群告警策略</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#86909C] hover:text-[#1F2329] text-xl leading-none"
              >
                ×
              </button>
            </div>

            {/* 表单区域 */}
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overflow-x-hidden px-6 py-4 [&_input]:min-w-0 [&_select]:min-w-0">
              {/* 类型 */}
              <div className="flex items-center">
                <label className="w-28 text-sm text-[#1F2329] shrink-0">
                  <span className="text-[#F53F3F] mr-0.5">*</span>类型:
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 text-sm text-[#1F2329] cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      checked={formData.type === 'cluster-system'}
                      onChange={() => handleTypeChange('cluster-system')}
                      className="accent-[#165DFF]"
                    />
                    集群系统组件
                  </label>
                  <label className="flex items-center gap-1.5 text-sm text-[#1F2329] cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      checked={formData.type === 'cluster-node'}
                      onChange={() => handleTypeChange('cluster-node')}
                      className="accent-[#165DFF]"
                    />
                    集群节点
                  </label>
                </div>
              </div>

              {/* 标题 */}
              <div className="flex items-center">
                <label className="w-28 text-sm text-[#1F2329] shrink-0">
                  <span className="text-[#F53F3F] mr-0.5">*</span>标题:
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="flex-1 h-8 px-3 text-sm border border-[#E5E6EB] rounded focus:outline-none focus:border-[#165DFF]"
                  placeholder=""
                />
              </div>

              {/* 集群 */}
              <div className="flex items-center">
                <label className="w-28 text-sm text-[#1F2329] shrink-0">
                  <span className="text-[#F53F3F] mr-0.5">*</span>集群:
                </label>
                <select
                  value={formData.cluster}
                  onChange={(e) => setFormData({ ...formData, cluster: e.target.value })}
                  className="flex-1 h-8 px-3 text-sm border border-[#E5E6EB] rounded focus:outline-none focus:border-[#165DFF] text-[#1F2329]"
                >
                  <option value="">选择集群</option>
                  <option value="monitor-vpc-docker">monitor-vpc-docker</option>
                  <option value="monitor-vpc-containerd">monitor-vpc-containerd</option>
                </select>
              </div>

              {/* 组件/节点 */}
              {formData.type === 'cluster-system' ? (
                <div className="flex items-center">
                  <label className="w-28 text-sm text-[#1F2329] shrink-0">
                    <span className="text-[#F53F3F] mr-0.5">*</span>组件:
                  </label>
                  <select
                    value={formData.component}
                    onChange={(e) => setFormData({ ...formData, component: e.target.value })}
                    className="flex-1 h-8 px-3 text-sm border border-[#E5E6EB] rounded focus:outline-none focus:border-[#165DFF] text-[#1F2329]"
                  >
                    <option value="APIServer">APIServer</option>
                    <option value="Kubelet">Kubelet</option>
                    <option value="Etcd">Etcd</option>
                    <option value="Scheduler">Scheduler</option>
                    <option value="ControllerManager">ControllerManager</option>
                  </select>
                </div>
              ) : (
                <div className="flex items-start">
                  <label className="w-28 text-sm text-[#1F2329] shrink-0 pt-1">
                    <span className="text-[#F53F3F] mr-0.5">*</span>节点:
                  </label>
                  <div className="flex-1 relative">
                    <div
                      className="min-h-[32px] h-auto px-3 py-1 text-sm border border-[#E5E6EB] rounded cursor-pointer flex items-center flex-wrap gap-1 focus-within:border-[#165DFF]"
                      onClick={() => setFormData({ ...formData, nodeDropdownOpen: !formData.nodeDropdownOpen })}
                    >
                      {formData.nodes.length === 0 ? (
                        <span className="text-[#86909C]">全部</span>
                      ) : (
                        formData.nodes.map(node => (
                          <span key={node} className="inline-flex items-center px-1.5 py-0.5 bg-[#EEF6FF] text-[#165DFF] text-xs rounded">
                            {node}
                            <button
                              className="ml-1 text-[#165DFF] hover:text-[#F53F3F]"
                              onClick={(e) => { e.stopPropagation(); handleNodeToggle(node); }}
                            >
                              ×
                            </button>
                          </span>
                        ))
                      )}
                      <svg className="w-3.5 h-3.5 ml-auto text-[#86909C] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    {formData.nodeDropdownOpen && (
                      <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-[#E5E6EB] rounded shadow-lg max-h-48 overflow-y-auto">
                        {nodeOptions.map(node => (
                          <label
                            key={node}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-[#1F2329] hover:bg-[#F7F8FA] cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={node === '全部' ? formData.nodes.length === nodeOptions.length - 1 : formData.nodes.includes(node)}
                              onChange={() => handleNodeToggle(node)}
                              className="accent-[#165DFF]"
                            />
                            {node}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 触发条件 */}
              {formData.type === 'cluster-system' ? (
                <div className="flex items-center">
                  <label className="w-28 text-sm text-[#1F2329] shrink-0">
                    <span className="text-[#F53F3F] mr-0.5">*</span>触发条件:
                  </label>
                  <select
                    value={formData.triggerCondition}
                    onChange={(e) => setFormData({ ...formData, triggerCondition: e.target.value })}
                    className="flex-1 h-8 px-3 text-sm border border-[#E5E6EB] rounded focus:outline-none focus:border-[#165DFF] text-[#1F2329]"
                  >
                    <option value="APIServer可用性异常">APIServer可用性异常</option>
                    <option value="Kubelet节点不可调度">Kubelet节点不可调度</option>
                    <option value="Etcd可用性异常">Etcd可用性异常</option>
                    <option value="Scheduler可用性异常">Scheduler可用性异常</option>
                  </select>
                </div>
              ) : (
                <div className="flex items-center">
                  <label className="w-28 text-sm text-[#1F2329] shrink-0">
                    <span className="text-[#F53F3F] mr-0.5">*</span>触发条件:
                  </label>
                  <div className="flex items-center gap-2 flex-1">
                    <select
                      value={formData.triggerMetric}
                      onChange={(e) => setFormData({ ...formData, triggerMetric: e.target.value })}
                      className="flex-1 h-8 px-3 text-sm border border-[#E5E6EB] rounded focus:outline-none focus:border-[#165DFF] text-[#1F2329]"
                    >
                      <option value="CPU使用率">CPU使用率</option>
                      <option value="内存使用率（含缓存）">内存使用率（含缓存）</option>
                      <option value="内存使用率（不含缓存）">内存使用率（不含缓存）</option>
                      <option value="磁盘使用率">磁盘使用率</option>
                    </select>
                    <select
                      value={formData.triggerOperator}
                      onChange={(e) => setFormData({ ...formData, triggerOperator: e.target.value })}
                      className="w-16 h-8 px-2 text-sm border border-[#E5E6EB] rounded focus:outline-none focus:border-[#165DFF] text-[#1F2329] text-center"
                    >
                      <option value=">">&gt;</option>
                      <option value=">=">&ge;</option>
                      <option value="<">&lt;</option>
                      <option value="<=">&le;</option>
                      <option value="=">=</option>
                    </select>
                    <input
                      type="number"
                      value={formData.triggerValue}
                      onChange={(e) => setFormData({ ...formData, triggerValue: e.target.value })}
                      className="w-20 h-8 px-3 text-sm border border-[#E5E6EB] rounded focus:outline-none focus:border-[#165DFF] text-center"
                    />
                    <span className="text-sm text-[#86909C]">%</span>
                  </div>
                </div>
              )}

              {/* 持续时间 */}
              <div className="flex items-center">
                <label className="w-28 text-sm text-[#1F2329] shrink-0">
                  <span className="text-[#F53F3F] mr-0.5">*</span>持续时间:
                  <svg className="w-3.5 h-3.5 inline-block ml-1 text-[#86909C] cursor-help" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 12.5a5.5 5.5 0 110-11 5.5 5.5 0 010 11zM8 4a1 1 0 011 1v3.5a1 1 0 01-2 0V5a1 1 0 011-1zm0 6.5a1 1 0 110 2 1 1 0 010-2z"/>
                  </svg>
                </label>
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="flex-1 h-8 px-3 text-sm border border-[#E5E6EB] rounded focus:outline-none focus:border-[#165DFF]"
                  />
                  <span className="text-sm text-[#86909C]">秒</span>
                </div>
              </div>

              {/* 告警最大次数 */}
              <div className="flex items-center">
                <label className="w-28 text-sm text-[#1F2329] shrink-0">
                  告警最大次数:
                  <svg className="w-3.5 h-3.5 inline-block ml-1 text-[#86909C] cursor-help" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 12.5a5.5 5.5 0 110-11 5.5 5.5 0 010 11zM8 4a1 1 0 011 1v3.5a1 1 0 01-2 0V5a1 1 0 011-1zm0 6.5a1 1 0 110 2 1 1 0 010-2z"/>
                  </svg>
                </label>
                <input
                  type="text"
                  value={formData.maxAlertCount}
                  onChange={(e) => setFormData({ ...formData, maxAlertCount: e.target.value })}
                  className="flex-1 h-8 px-3 text-sm border border-[#E5E6EB] rounded focus:outline-none focus:border-[#165DFF]"
                  placeholder=""
                />
              </div>

              {/* 告警组 */}
              <div className="flex items-start">
                <label className="w-28 text-sm text-[#1F2329] shrink-0 pt-1">
                  <span className="text-[#F53F3F] mr-0.5">*</span>告警组:
                </label>
                <div className="flex-1">
                  <select
                    value={formData.alertGroup}
                    onChange={(e) => setFormData({ ...formData, alertGroup: e.target.value })}
                    className="w-full h-8 px-3 text-sm border border-[#E5E6EB] rounded focus:outline-none focus:border-[#165DFF] text-[#1F2329]"
                  >
                    <option value="">选择告警组</option>
                    <option value="default">默认告警组</option>
                    <option value="ops">运维告警组</option>
                  </select>
                  <p className="mt-1.5 text-xs text-[#86909C]">
                    配置告警组，请点击 <a href="#" className="text-[#165DFF] hover:underline">这里</a>
                  </p>
                </div>
              </div>

              {/* 回调地址 */}
              <div className="flex items-center">
                <label className="w-28 text-sm text-[#1F2329] shrink-0">
                  回调地址:
                  <svg className="w-3.5 h-3.5 inline-block ml-1 text-[#86909C] cursor-help" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 12.5a5.5 5.5 0 110-11 5.5 5.5 0 010 11zM8 4a1 1 0 011 1v3.5a1 1 0 01-2 0V5a1 1 0 011-1zm0 6.5a1 1 0 110 2 1 1 0 010-2z"/>
                  </svg>
                </label>
                <input
                  type="text"
                  value={formData.callbackUrl}
                  onChange={(e) => setFormData({ ...formData, callbackUrl: e.target.value })}
                  className="flex-1 h-8 px-3 text-sm border border-[#E5E6EB] rounded focus:outline-none focus:border-[#165DFF]"
                  placeholder=""
                />
              </div>

              {/* 告警级别 */}
              <div className="flex items-center">
                <label className="w-28 text-sm text-[#1F2329] shrink-0">
                  <span className="text-[#F53F3F] mr-0.5">*</span>告警级别:
                </label>
                <select
                  value={formData.alertLevel}
                  onChange={(e) => setFormData({ ...formData, alertLevel: e.target.value })}
                  className="flex-1 h-8 px-3 text-sm border border-[#E5E6EB] rounded focus:outline-none focus:border-[#165DFF] text-[#1F2329]"
                >
                  <option value="一般">一般</option>
                  <option value="严重">严重</option>
                  <option value="紧急">紧急</option>
                </select>
              </div>
            </div>

            {/* 弹窗底部 */}
            <div className="flex flex-shrink-0 items-center justify-end gap-3 border-t border-[#E5E6EB] px-6 py-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-1.5 text-sm text-[#1F2329] border border-[#E5E6EB] rounded hover:bg-[#F7F8FA]"
              >
                取消
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-1.5 text-sm text-white bg-[#165DFF] rounded hover:bg-[#0E4ADB]"
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
