'use client';

import { useState } from 'react';

const mockPolicies = [
  {
    id: 133,
    name: 'wjwtest',
    status: '已启用',
    minMax: '1/1',
    current: '1/1',
    hasActivity: true,
    createTime: '2026-04-28 17:08:24',
    creator: 'wangjinwei',
  },
  {
    id: 128,
    name: 'autoscale-prod',
    status: '已启用',
    minMax: '2/10',
    current: '3/10',
    hasActivity: false,
    createTime: '2026-04-15 09:30:12',
    creator: 'zhangsan',
  },
  {
    id: 125,
    name: 'scaling-test',
    status: '已停用',
    minMax: '1/5',
    current: '0/5',
    hasActivity: false,
    createTime: '2026-03-20 14:22:36',
    creator: 'lisi',
  },
];

export default function AutoScalerTab() {
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showThresholdModal, setShowThresholdModal] = useState(false);
  const [cpuThresholdEnabled, setCpuThresholdEnabled] = useState(false);
  const [memoryThresholdEnabled, setMemoryThresholdEnabled] = useState(false);
  const [thresholds, setThresholds] = useState({
    clusterCpu: '80',
    nodeCpu: '40',
    clusterMemory: '70',
    nodeMemory: '30',
  });
  const [thresholdErrors, setThresholdErrors] = useState({
    cpu: '',
    memory: '',
  });

  const filteredPolicies = mockPolicies.filter(
    (p) =>
      p.id.toString().includes(searchText) || p.name.includes(searchText)
  );

  const totalPages = Math.max(1, Math.ceil(filteredPolicies.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredPolicies.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-4">
      {/* 操作栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-1 px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            创建伸缩策略
          </button>
          <button
            onClick={() => setShowThresholdModal(true)}
            className="inline-flex items-center gap-1 px-4 py-2 text-sm text-blue-600 bg-white border border-blue-600 rounded hover:bg-blue-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            扩容阈值
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="ID/名称"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
            className="w-56 h-8 pl-3 pr-8 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* 表格 */}
      <div className="bg-white rounded border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left font-medium text-gray-600 px-4 py-3">ID</th>
              <th className="text-left font-medium text-gray-600 px-4 py-3">策略名称</th>
              <th className="text-left font-medium text-gray-600 px-4 py-3">状态</th>
              <th className="text-left font-medium text-gray-600 px-4 py-3">最小/最大伸缩数</th>
              <th className="text-left font-medium text-gray-600 px-4 py-3">当前伸缩数</th>
              <th className="text-left font-medium text-gray-600 px-4 py-3">创建时间</th>
              <th className="text-left font-medium text-gray-600 px-4 py-3">创建人</th>
              <th className="text-left font-medium text-gray-600 px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-400">
                  暂无数据
                </td>
              </tr>
            ) : (
              currentData.map((policy) => (
                <tr key={policy.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{policy.id}</td>
                  <td className="px-4 py-3 text-blue-600 cursor-pointer hover:underline">{policy.name}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${policy.status === '已启用' ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <span className={policy.status === '已启用' ? 'text-green-600' : 'text-gray-500'}>{policy.status}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-900">{policy.minMax}</td>
                  <td className="px-4 py-3">
                    <span className="text-gray-900">{policy.current}</span>
                    {policy.hasActivity && (
                      <span className="ml-1 text-blue-600 text-xs cursor-pointer hover:underline">伸缩活动</span>
                    )}
                    <svg className="inline-block w-3.5 h-3.5 ml-0.5 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{policy.createTime}</td>
                  <td className="px-4 py-3 text-gray-900">{policy.creator}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-blue-600 cursor-pointer hover:underline">编辑</span>
                      <span className="text-gray-700 cursor-pointer hover:text-blue-600">停用</span>
                      <span className="text-blue-600 cursor-pointer hover:underline">设置WebHook</span>
                      <button className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* 分页 */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <span className="text-sm text-gray-500">
            共{filteredPolicies.length}条记录 第{currentPage}/{totalPages}页
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <input
              type="text"
              value={currentPage}
              onChange={(e) => {
                const v = parseInt(e.target.value);
                if (!isNaN(v) && v >= 1 && v <= totalPages) setCurrentPage(v);
              }}
              className="w-10 h-8 text-center border border-gray-300 rounded text-sm"
            />
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="h-8 px-2 border border-gray-300 rounded text-sm bg-white"
            >
              <option value={10}>10条/页</option>
              <option value={20}>20条/页</option>
              <option value={50}>50条/页</option>
              <option value={100}>100条/页</option>
            </select>
          </div>
        </div>
      </div>

      {/* 扩容阈值弹窗 */}
      {showThresholdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowThresholdModal(false)} />
          <div className="relative bg-white rounded-lg shadow-xl w-[600px]">
            {/* 弹窗标题 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-base font-medium text-gray-900">扩容阈值配置</h3>
              <button
                onClick={() => setShowThresholdModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 弹窗内容 */}
            <div className="px-6 py-5 space-y-5">
              {/* CPU 阈值组（且关系） */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => setCpuThresholdEnabled(!cpuThresholdEnabled)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${cpuThresholdEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${cpuThresholdEnabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </button>
                  <span className="text-sm font-medium text-gray-700">CPU分配率阈值</span>
                  <span className="text-xs text-gray-400">（集群与节点阈值需同时设置，且关系）</span>
                </div>
                {cpuThresholdEnabled && (
                <>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">集群CPU分配率阈值</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={thresholds.clusterCpu}
                        onChange={(e) => {
                          const val = e.target.value;
                          setThresholds({ ...thresholds, clusterCpu: val });
                          const nodeVal = parseFloat(thresholds.nodeCpu);
                          const clusterVal = parseFloat(val);
                          if (!isNaN(nodeVal) && !isNaN(clusterVal) && clusterVal <= nodeVal) {
                            setThresholdErrors(prev => ({ ...prev, cpu: '集群CPU分配率阈值必须大于单节点CPU分配率阈值' }));
                          } else {
                            setThresholdErrors(prev => ({ ...prev, cpu: '' }));
                          }
                        }}
                        className={`w-full h-8 px-3 text-sm border rounded focus:outline-none focus:border-blue-500 ${thresholdErrors.cpu ? 'border-red-400' : 'border-gray-300'}`}
                        min="0"
                        max="100"
                      />
                      <span className="text-sm text-gray-500 flex-shrink-0">%</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">当集群CPU分配率超过该阈值时触发扩容</p>
                  </div>
                  <span className="text-sm font-medium text-blue-500 mt-5">且</span>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">单节点CPU分配率阈值</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={thresholds.nodeCpu}
                        onChange={(e) => {
                          const val = e.target.value;
                          setThresholds({ ...thresholds, nodeCpu: val });
                          const clusterVal = parseFloat(thresholds.clusterCpu);
                          const nodeVal = parseFloat(val);
                          if (!isNaN(clusterVal) && !isNaN(nodeVal) && clusterVal <= nodeVal) {
                            setThresholdErrors(prev => ({ ...prev, cpu: '集群CPU分配率阈值必须大于单节点CPU分配率阈值' }));
                          } else {
                            setThresholdErrors(prev => ({ ...prev, cpu: '' }));
                          }
                        }}
                        className={`w-full h-8 px-3 text-sm border rounded focus:outline-none focus:border-blue-500 ${thresholdErrors.cpu ? 'border-red-400' : 'border-gray-300'}`}
                        min="0"
                        max="100"
                      />
                      <span className="text-sm text-gray-500 flex-shrink-0">%</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">当每个节点CPU分配率都超过该阈值时触发扩容</p>
                  </div>
                </div>
                {thresholdErrors.cpu && (
                  <p className="mt-1 text-xs text-red-500">{thresholdErrors.cpu}</p>
                )}
                </>
                )}
              </div>

              {/* 分隔线 + 或关系提示 */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">或</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* 内存 阈值组（且关系） */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => setMemoryThresholdEnabled(!memoryThresholdEnabled)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${memoryThresholdEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${memoryThresholdEnabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </button>
                  <span className="text-sm font-medium text-gray-700">内存分配率阈值</span>
                  <span className="text-xs text-gray-400">（集群与节点阈值需同时设置，且关系）</span>
                </div>
                {memoryThresholdEnabled && (
                <>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">集群内存分配率阈值</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={thresholds.clusterMemory}
                        onChange={(e) => {
                          const val = e.target.value;
                          setThresholds({ ...thresholds, clusterMemory: val });
                          const nodeVal = parseFloat(thresholds.nodeMemory);
                          const clusterVal = parseFloat(val);
                          if (!isNaN(nodeVal) && !isNaN(clusterVal) && clusterVal <= nodeVal) {
                            setThresholdErrors(prev => ({ ...prev, memory: '集群内存分配率阈值必须大于单节点内存分配阈值' }));
                          } else {
                            setThresholdErrors(prev => ({ ...prev, memory: '' }));
                          }
                        }}
                        className={`w-full h-8 px-3 text-sm border rounded focus:outline-none focus:border-blue-500 ${thresholdErrors.memory ? 'border-red-400' : 'border-gray-300'}`}
                        min="0"
                        max="100"
                      />
                      <span className="text-sm text-gray-500 flex-shrink-0">%</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">当集群内存分配率超过该阈值时触发扩容</p>
                  </div>
                  <span className="text-sm font-medium text-blue-500 mt-5">且</span>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">单节点内存分配阈值</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={thresholds.nodeMemory}
                        onChange={(e) => {
                          const val = e.target.value;
                          setThresholds({ ...thresholds, nodeMemory: val });
                          const clusterVal = parseFloat(thresholds.clusterMemory);
                          const nodeVal = parseFloat(val);
                          if (!isNaN(clusterVal) && !isNaN(nodeVal) && clusterVal <= nodeVal) {
                            setThresholdErrors(prev => ({ ...prev, memory: '集群内存分配率阈值必须大于单节点内存分配阈值' }));
                          } else {
                            setThresholdErrors(prev => ({ ...prev, memory: '' }));
                          }
                        }}
                        className={`w-full h-8 px-3 text-sm border rounded focus:outline-none focus:border-blue-500 ${thresholdErrors.memory ? 'border-red-400' : 'border-gray-300'}`}
                        min="0"
                        max="100"
                      />
                      <span className="text-sm text-gray-500 flex-shrink-0">%</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">当每个节点内存分配率都超过该阈值时触发扩容</p>
                  </div>
                </div>
                {thresholdErrors.memory && (
                  <p className="mt-1 text-xs text-red-500">{thresholdErrors.memory}</p>
                )}
                </>
                )}
              </div>
            </div>

            {/* 弹窗底部按钮 */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => setShowThresholdModal(false)}
                className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  const hasError = thresholdErrors.cpu || thresholdErrors.memory;
                  if (hasError) return;
                  setShowThresholdModal(false);
                }}
                className={`px-4 py-2 text-sm text-white rounded transition-colors ${(thresholdErrors.cpu || thresholdErrors.memory) ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
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
