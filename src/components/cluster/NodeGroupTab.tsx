'use client';

import { useState } from 'react';

import NodeGroupNodeForm from './NodeGroupNodeForm';

interface NodeGroupTabProps {
  clusterName: string;
  onViewGroupNodes?: (groupName: string) => void;
}

interface NodeGroup {
  id: number;
  name: string;
  nodeCount: number;
  creator: string;
  createTime: string;
  dataDiskSize: number;
  oversellRatio?: string;
  swapStatus?: boolean;
  swapSize?: string;
}

interface GroupSwapConfig {
  enabled: boolean;
  size: string;
}

const initialGroups: NodeGroup[] = [
  { id: 1, name: '通用计算组', nodeCount: 3, creator: 'zhangxing5', createTime: '2026-08-12 14:30:00', dataDiskSize: 200, oversellRatio: '3', swapStatus: false },
  { id: 2, name: '大数据内存组', nodeCount: 2, creator: 'jidongdong', createTime: '2026-08-20 09:15:00', dataDiskSize: 200, oversellRatio: '3', swapStatus: false },
];

export default function NodeGroupTab({ clusterName, onViewGroupNodes }: NodeGroupTabProps) {
  const [view, setView] = useState<'list' | 'create'>('list');
  const [addNodeGroup, setAddNodeGroup] = useState<NodeGroup | null>(null);
  const [groups, setGroups] = useState<NodeGroup[]>(initialGroups);
  const [searchTerm, setSearchTerm] = useState('');
  const [swapConfigs, setSwapConfigs] = useState<Record<number, GroupSwapConfig>>({});
  const [oversellFactors, setOversellFactors] = useState<Record<number, string>>({});

  // 超卖设置
  const [oversellGroup, setOversellGroup] = useState<NodeGroup | null>(null);
  const [oversellFactor, setOversellFactor] = useState('3');
  const [oversellError, setOversellError] = useState('');

  // SWAP 设置
  const [swapGroup, setSwapGroup] = useState<NodeGroup | null>(null);
  const [swapEnabled, setSwapEnabled] = useState(false);
  const [swapSize, setSwapSize] = useState('');
  const [swapError, setSwapError] = useState('');

  // 删除
  const [deleteGroup, setDeleteGroup] = useState<NodeGroup | null>(null);

  // 创建节点组表单
  const [groupName, setGroupName] = useState('');
  const [groupNameError, setGroupNameError] = useState('');

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  const resetCreateForm = () => {
    setGroupName('');
    setGroupNameError('');
  };

  const openOversellConfig = (group: NodeGroup) => {
    setOversellGroup(group);
    setOversellFactor(oversellFactors[group.id] ?? '3');
    setOversellError('');
  };

  const saveOversellConfig = () => {
    const factor = Number(oversellFactor);
    if (!Number.isFinite(factor) || factor <= 0) {
      setOversellError('请输入大于 0 的超卖倍数');
      return;
    }
    if (oversellGroup) {
      setOversellFactors((prev) => ({ ...prev, [oversellGroup.id]: oversellFactor }));
      setGroups((prev) => prev.map((g) =>
        g.id === oversellGroup.id ? { ...g, oversellRatio: oversellFactor } : g
      ));
    }
    setOversellGroup(null);
  };

  const openSwapConfig = (group: NodeGroup) => {
    setSwapGroup(group);
    const current = swapConfigs[group.id];
    setSwapEnabled(current?.enabled ?? false);
    setSwapSize(current?.size ?? '');
    setSwapError('');
  };

  const openSwapFromList = (group: NodeGroup) => {
    setSwapGroup(group);
    setSwapEnabled(true);
    setSwapSize('');
    setSwapError('');
  };

  const saveSwapConfig = () => {
    if (!swapGroup) return;
    const maxSwapSize = Math.floor(swapGroup.dataDiskSize / 3);
    if (swapEnabled) {
      if (maxSwapSize < 1) {
        setSwapError('当前数据盘容量不足以开启 SWAP');
        return;
      }
      const size = Number(swapSize);
      if (!swapSize || !Number.isInteger(size) || size < 1 || size > maxSwapSize) {
        setSwapError(`SWAP 大小需为 1-${maxSwapSize} GB，且不得超过数据盘容量的 1/3`);
        return;
      }
    }
    setSwapConfigs((prev) => ({ ...prev, [swapGroup.id]: { enabled: swapEnabled, size: swapSize } }));
    setGroups((prev) => prev.map((g) =>
      g.id === swapGroup.id
        ? {
            ...g,
            swapStatus: swapEnabled,
            swapSize: swapEnabled ? swapSize : undefined,
            oversellRatio: oversellFactors[g.id] ?? g.oversellRatio,
          }
        : g
    ));
    setSwapGroup(null);
  };

  const confirmDelete = () => {
    if (deleteGroup) {
      setGroups((prev) => prev.filter((group) => group.id !== deleteGroup.id));
    }
    setDeleteGroup(null);
  };

  const openGroupNodes = (group: NodeGroup) => {
    onViewGroupNodes?.(group.name);
  };

  const openAddNode = (group: NodeGroup) => {
    setAddNodeGroup(group);
    setView('create');
  };

  const handleCancelCreate = () => {
    resetCreateForm();
    setAddNodeGroup(null);
    setView('list');
  };

  const handleSubmitCreate = ({ nodeCount, dataDiskSize }: { nodeCount: number; dataDiskSize: number }) => {
    if (addNodeGroup) {
      setGroups((prev) => prev.map((g) =>
        g.id === addNodeGroup.id ? { ...g, nodeCount: g.nodeCount + nodeCount } : g
      ));
      setAddNodeGroup(null);
      setView('list');
      return;
    }
    if (!groupName.trim()) {
      setGroupNameError('请输入节点组名称');
      return;
    }
    setGroups((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: groupName.trim(),
        nodeCount,
        creator: 'zhangxing5',
        createTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
        dataDiskSize,
      },
    ]);
    resetCreateForm();
    setView('list');
  };

  if (view === 'create') {
    return (
      <div className="min-w-0 space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <button
            type="button"
            onClick={handleCancelCreate}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            ← 返回节点组列表
          </button>
          <h2 className="mb-6 mt-4 text-lg font-bold text-gray-900">
            {addNodeGroup ? `添加节点 - ${addNodeGroup.name}` : '创建节点组'}
          </h2>

          <div className="max-w-6xl space-y-8">
            {!addNodeGroup && (
            <div className="border-b border-gray-200 pb-6">
              <h3 className="mb-4 text-base font-medium text-gray-900">基本信息</h3>
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
                <label className="shrink-0 text-sm font-medium text-gray-700 md:w-24 md:pt-2">
                  <span className="text-red-500">*</span>节点组名称
                </label>
                <div className="min-w-0 flex-1">
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => {
                      setGroupName(e.target.value);
                      setGroupNameError('');
                    }}
                    placeholder="请输入节点组名称"
                    aria-invalid={Boolean(groupNameError)}
                    className={`w-80 max-w-full rounded border px-4 py-2 text-sm outline-none focus:ring-1 ${
                      groupNameError
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  {groupNameError && <p className="mt-1 text-xs text-red-600">{groupNameError}</p>}
                </div>
              </div>
            </div>
            )}

            <NodeGroupNodeForm showSwapField={!addNodeGroup} onCancel={handleCancelCreate} onSubmit={handleSubmitCreate} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <button
          type="button"
          onClick={() => setView('create')}
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
        >
          创建节点组
        </button>
        <div className="relative w-full lg:w-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="节点组名称"
            className="w-full rounded border border-gray-300 bg-white px-4 py-2 pl-10 text-sm outline-none focus:border-blue-500 lg:w-64"
          />
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-700">节点组名称</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-700">节点数量</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-700">超卖比</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-700">SWAP</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-700">创建人</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-700">创建时间</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-700">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredGroups.map((group) => (
              <tr key={group.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900">
                  <button
                    type="button"
                    onClick={() => openGroupNodes(group)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {group.name}
                  </button>
                </td>
                <td className="px-4 py-3 text-gray-700">{group.nodeCount}</td>
                <td className="px-4 py-3 text-gray-700">{group.oversellRatio ?? '-'} 倍</td>
                <td className="px-4 py-3">
                  {group.swapStatus ? (
                    <span className="inline-flex rounded bg-green-50 px-2 py-0.5 text-xs text-green-700">
                      {group.swapSize ? `${group.swapSize} GB` : '已开启'}
                    </span>
                  ) : (
                    <button
                      type="button"
                      role="switch"
                      aria-checked={false}
                      aria-label={`为${group.name}开启SWAP`}
                      onClick={() => openSwapFromList(group)}
                      className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-gray-300 transition-colors duration-200 hover:bg-gray-400"
                    >
                      <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow-md ring-1 ring-black/5 transition-all duration-200" />
                    </button>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-700">{group.creator}</td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-700">{group.createTime}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => openAddNode(group)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      添加节点
                    </button>
                    <button
                      type="button"
                      onClick={() => openOversellConfig(group)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      超卖设置
                    </button>
                    <button
                      type="button"
                      onClick={() => openSwapConfig(group)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      SWAP设置
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteGroup(group)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredGroups.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-500">
                  {searchTerm ? '未找到匹配的节点组' : '暂无节点组'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 超卖设置弹窗 */}
      {oversellGroup && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="group-oversell-dialog-title" className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 id="group-oversell-dialog-title" className="text-base font-medium text-gray-900">超卖配置</h2>
                <p className="mt-1 text-sm text-gray-500">集群：{clusterName} | 节点组：{oversellGroup.name}</p>
              </div>
              <button
                type="button"
                aria-label="关闭超卖配置"
                onClick={() => setOversellGroup(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-5 py-5">
              <label htmlFor="group-oversell-factor" className="mb-2 block text-sm font-medium text-gray-700">
                节点组超卖倍数
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="group-oversell-factor"
                  type="number"
                  min="0"
                  step="0.1"
                  value={oversellFactor}
                  onChange={(event) => {
                    setOversellFactor(event.target.value);
                    setOversellError('');
                  }}
                  placeholder="请输入超卖倍数"
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <span className="shrink-0 text-sm text-gray-600">倍</span>
              </div>
              {oversellError && <p className="mt-2 text-sm text-red-600">{oversellError}</p>}
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4">
              <button
                type="button"
                onClick={() => setOversellGroup(null)}
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

      {/* SWAP 设置弹窗 */}
      {swapGroup && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="group-swap-dialog-title" className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 id="group-swap-dialog-title" className="text-base font-medium text-gray-900">SWAP设置</h2>
                <p className="mt-1 text-sm text-gray-500">集群：{clusterName} | 节点组：{swapGroup.name}</p>
              </div>
              <button
                type="button"
                aria-label="关闭SWAP设置"
                onClick={() => setSwapGroup(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-5 py-5">
              <div className="flex items-center gap-3">
                <label htmlFor="group-swap-enabled" className="text-sm font-medium text-gray-700">
                  开启SWAP
                </label>
                <button
                  type="button"
                  id="group-swap-enabled"
                  role="switch"
                  aria-checked={swapEnabled}
                  onClick={() => {
                    setSwapEnabled((prev) => !prev);
                    setSwapError('');
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
                    swapEnabled
                      ? 'bg-blue-600 shadow-inner'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                >
                  <span
                    className={`absolute h-5 w-5 rounded-full bg-white shadow-md ring-1 ring-black/5 transition-all duration-200 ${
                      swapEnabled ? 'left-[22px]' : 'left-0.5'
                    }`}
                  />
                </button>
                <span
                  className={`text-sm transition-colors ${
                    swapEnabled ? 'text-blue-600' : 'text-gray-500'
                  }`}
                >
                  {swapEnabled ? '已开启' : '未开启'}
                </span>
              </div>
              {swapEnabled && (
                <div className="mt-4">
                  <label htmlFor="group-swap-size" className="mb-2 block text-sm font-medium text-gray-700">
                    SWAP大小
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="group-swap-size"
                      type="number"
                      min={1}
                      max={Math.floor(swapGroup.dataDiskSize / 3)}
                      step={1}
                      value={swapSize}
                      onChange={(e) => {
                        setSwapSize(e.target.value);
                        setSwapError('');
                      }}
                      aria-invalid={Boolean(swapError)}
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="请输入SWAP大小"
                    />
                    <span className="shrink-0 text-sm text-gray-600">GB</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    最大 {Math.floor(swapGroup.dataDiskSize / 3)} GB（数据盘容量的 1/3）
                  </p>
                  {swapError && <p className="mt-2 text-sm text-red-600">{swapError}</p>}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4">
              <button
                type="button"
                onClick={() => setSwapGroup(null)}
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

      {/* 删除确认弹窗 */}
      {deleteGroup && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="group-delete-dialog-title" className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2 id="group-delete-dialog-title" className="text-base font-medium text-gray-900">删除节点组</h2>
              <button
                type="button"
                aria-label="关闭删除节点组"
                onClick={() => setDeleteGroup(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-5 py-5">
              <p className="text-sm text-gray-700">
                确认删除节点组 <span className="font-medium text-gray-900">{deleteGroup.name}</span> 吗？删除后不可恢复。
              </p>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4">
              <button
                type="button"
                onClick={() => setDeleteGroup(null)}
                className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
