'use client';

import { useEffect, useState } from 'react';

interface ClusterOversellTabProps {
  clusterName: string;
}

export default function ClusterOversellTab({ clusterName }: ClusterOversellTabProps) {
  // 超卖配置
  const [oversellEnabled, setOversellEnabled] = useState(false);
  const [cpuFactor, setCpuFactor] = useState('');
  const [cpuUtil, setCpuUtil] = useState('50');
  const [memFactor, setMemFactor] = useState('');
  const [memUtil, setMemUtil] = useState('80');
  const [savedCpuFactor, setSavedCpuFactor] = useState('');
  const [savedCpuUtil, setSavedCpuUtil] = useState('50');
  const [savedMemFactor, setSavedMemFactor] = useState('');
  const [savedMemUtil, setSavedMemUtil] = useState('80');
  const [oversellEditing, setOversellEditing] = useState(false);
  const [oversellFresh, setOversellFresh] = useState(false);
  const [oversellError, setOversellError] = useState('');
  const [oversellToast, setOversellToast] = useState('');

  // SWAP 配置
  const [swapEnabled, setSwapEnabled] = useState(false);
  const [swapSize, setSwapSize] = useState('');
  const [swapError, setSwapError] = useState('');
  const [swapToast, setSwapToast] = useState('');

  const maxSwapSize = 400;
  const oversellStorageKey = `cluster-oversell-${clusterName}`;

  const persistOversell = (enabled: boolean, cpu: string, cpuU: string, mem: string, memU: string) => {
    try {
      window.localStorage.setItem(oversellStorageKey, JSON.stringify({ enabled, cpuFactor: cpu, cpuUtil: cpuU, memFactor: mem, memUtil: memU }));
    } catch {
      // 本地存储不可用时忽略，仅保留内存态
    }
  };

  // 下次进入页面时恢复已保存的超卖配置
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(oversellStorageKey);
      if (!raw) return;
      const cfg = JSON.parse(raw) as { enabled?: boolean; cpuFactor?: string; cpuUtil?: string; memFactor?: string; memUtil?: string };
      if (typeof cfg.cpuFactor === 'string' && cfg.cpuFactor) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- 从 localStorage 恢复持久化状态
        setCpuFactor(cfg.cpuFactor);
        setSavedCpuFactor(cfg.cpuFactor);
      }
      if (typeof cfg.cpuUtil === 'string' && cfg.cpuUtil) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- 从 localStorage 恢复持久化状态
        setCpuUtil(cfg.cpuUtil);
        setSavedCpuUtil(cfg.cpuUtil);
      }
      if (typeof cfg.memFactor === 'string' && cfg.memFactor) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- 从 localStorage 恢复持久化状态
        setMemFactor(cfg.memFactor);
        setSavedMemFactor(cfg.memFactor);
      }
      if (typeof cfg.memUtil === 'string' && cfg.memUtil) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- 从 localStorage 恢复持久化状态
        setMemUtil(cfg.memUtil);
        setSavedMemUtil(cfg.memUtil);
      }
      if (typeof cfg.enabled === 'boolean') {
        setOversellEnabled(cfg.enabled);
      }
    } catch {
      // 忽略本地存储解析失败，保持默认值
    }
  }, [oversellStorageKey]);

  const toggleOversell = () => {
    const next = !oversellEnabled;
    setOversellEnabled(next);
    setOversellError('');
    setOversellToast('');
    if (next) {
      setOversellEditing(true);
      // 开启开关视为重新配置，需要重新输入倍数；利用率恢复默认值
      setCpuFactor('');
      setCpuUtil('50');
      setMemFactor('');
      setMemUtil('80');
      setOversellFresh(true);
    } else {
      // 关闭立即生效并持久化
      setOversellEditing(false);
      setOversellFresh(false);
      persistOversell(false, savedCpuFactor, savedCpuUtil, savedMemFactor, savedMemUtil);
    }
  };

  const saveOversell = () => {
    const cpu = Number(cpuFactor);
    const cpuU = Number(cpuUtil);
    const mem = Number(memFactor);
    const memU = Number(memUtil);
    if (!Number.isFinite(cpu) || cpu <= 0) {
      setOversellError('请输入大于 0 的集群CPU超卖倍数');
      return;
    }
    if (!Number.isFinite(cpuU) || cpuU <= 0 || cpuU > 100) {
      setOversellError('节点CPU最大利用率需在 0-100 之间');
      return;
    }
    if (!Number.isFinite(mem) || mem <= 0) {
      setOversellError('请输入大于 0 的集群内存超卖倍数');
      return;
    }
    if (!Number.isFinite(memU) || memU <= 0 || memU > 100) {
      setOversellError('节点内存最大利用率需在 0-100 之间');
      return;
    }
    setSavedCpuFactor(cpuFactor);
    setSavedCpuUtil(cpuUtil);
    setSavedMemFactor(memFactor);
    setSavedMemUtil(memUtil);
    persistOversell(oversellEnabled, cpuFactor, cpuUtil, memFactor, memUtil);
    setOversellError('');
    setOversellToast('保存成功：集群超卖配置已更新');
    setOversellEditing(false);
    setOversellFresh(false);
  };

  const toggleSwap = () => {
    setSwapEnabled((prev) => !prev);
    setSwapError('');
    setSwapToast('');
  };

  const saveSwap = () => {
    const size = Number(swapSize);
    if (!swapSize || !Number.isInteger(size) || size < 1 || size > maxSwapSize) {
      setSwapError(`SWAP 大小需为 1-${maxSwapSize} GB`);
      return;
    }
    setSwapError('');
    setSwapToast(`保存成功：SWAP 已开启，大小 ${swapSize} GB`);
  };

  const startOversellEdit = () => {
    setCpuFactor(savedCpuFactor);
    setCpuUtil(savedCpuUtil);
    setMemFactor(savedMemFactor);
    setMemUtil(savedMemUtil);
    setOversellError('');
    setOversellToast('');
    setOversellEditing(true);
    setOversellFresh(false);
  };

  const cancelOversell = () => {
    setCpuFactor(savedCpuFactor);
    setCpuUtil(savedCpuUtil);
    setMemFactor(savedMemFactor);
    setMemUtil(savedMemUtil);
    setOversellError('');
    setOversellToast('');
    setOversellEditing(false);
  };

  return (
    <div className="min-w-0 space-y-6">
      {/* 集群超卖配置 */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-base font-medium text-gray-900">集群超卖配置</h2>
        <p className="mt-1 text-sm text-gray-500">
          集群：{clusterName}，配置后作用于整个集群的资源超卖倍数。
        </p>

        <div className="mt-5 max-w-3xl space-y-4">
          <div className="flex items-center gap-3">
            <label htmlFor="cluster-tab-oversell-enabled" className="text-sm font-medium text-gray-700">
              开启集群超卖
            </label>
            <button
              type="button"
              id="cluster-tab-oversell-enabled"
              role="switch"
              aria-checked={oversellEnabled}
              onClick={toggleOversell}
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
            <div className="space-y-5">
              {/* CPU 配置行：集群CPU超卖倍数 + 节点CPU最大利用率 */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-3">
                    <label htmlFor="cluster-tab-cpu-factor" className="shrink-0 text-sm font-medium text-gray-700">
                      集群CPU超卖倍数
                    </label>
                    <input
                      id="cluster-tab-cpu-factor"
                      type="number"
                      min="0"
                      step="0.1"
                      value={cpuFactor}
                      onChange={(e) => {
                        setCpuFactor(e.target.value);
                        setOversellError('');
                      }}
                      disabled={!oversellEditing}
                      className={`w-full rounded border px-3 py-2 text-sm outline-none focus:ring-1 ${
                        oversellError
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      } ${oversellEditing ? 'bg-white' : 'cursor-not-allowed bg-gray-100 text-gray-500'}`}
                      placeholder="请输入集群CPU超卖倍数"
                    />
                    <span className="shrink-0 text-sm text-gray-600">倍</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <label htmlFor="cluster-tab-cpu-util" className="shrink-0 text-sm font-medium text-gray-700">
                      节点CPU最大利用率
                    </label>
                    <input
                      id="cluster-tab-cpu-util"
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={cpuUtil}
                      onChange={(e) => {
                        setCpuUtil(e.target.value);
                        setOversellError('');
                      }}
                      disabled={!oversellEditing}
                      className={`w-full rounded border px-3 py-2 text-sm outline-none focus:ring-1 ${
                        oversellError
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      } ${oversellEditing ? 'bg-white' : 'cursor-not-allowed bg-gray-100 text-gray-500'}`}
                      placeholder="请输入节点CPU最大利用率"
                    />
                    <span className="shrink-0 text-sm text-gray-600">%</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">节点CPU利用率超过设置的值后，Pod会尽量调度到其他负载低的节点</p>
                </div>
              </div>

              {/* 内存配置行：集群内存超卖倍数 + 节点内存最大利用率 */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <label htmlFor="cluster-tab-mem-factor" className="shrink-0 text-sm font-medium text-gray-700">
                      集群内存超卖倍数
                    </label>
                    <input
                      id="cluster-tab-mem-factor"
                      type="number"
                      min="0"
                      step="0.1"
                      value={memFactor}
                      onChange={(e) => {
                        setMemFactor(e.target.value);
                        setOversellError('');
                      }}
                      disabled={!oversellEditing}
                      className={`w-full rounded border px-3 py-2 text-sm outline-none focus:ring-1 ${
                        oversellError
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      } ${oversellEditing ? 'bg-white' : 'cursor-not-allowed bg-gray-100 text-gray-500'}`}
                      placeholder="请输入集群内存超卖倍数"
                    />
                    <span className="shrink-0 text-sm text-gray-600">倍</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <label htmlFor="cluster-tab-mem-util" className="shrink-0 text-sm font-medium text-gray-700">
                      节点内存最大利用率
                    </label>
                    <input
                      id="cluster-tab-mem-util"
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={memUtil}
                      onChange={(e) => {
                        setMemUtil(e.target.value);
                        setOversellError('');
                      }}
                      disabled={!oversellEditing}
                      className={`w-full rounded border px-3 py-2 text-sm outline-none focus:ring-1 ${
                        oversellError
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      } ${oversellEditing ? 'bg-white' : 'cursor-not-allowed bg-gray-100 text-gray-500'}`}
                      placeholder="请输入节点内存最大利用率"
                    />
                    <span className="shrink-0 text-sm text-gray-600">%</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">节点内存利用率超过配置的值后，不允许Pod往上调度</p>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center gap-2">
                {!oversellEditing && (
                  <button
                    type="button"
                    onClick={startOversellEdit}
                    className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    编辑
                  </button>
                )}
                {oversellEditing && oversellFresh && (
                  <button
                    type="button"
                    onClick={saveOversell}
                    className="rounded bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
                  >
                    保存
                  </button>
                )}
                {oversellEditing && !oversellFresh && (
                  <>
                    <button
                      type="button"
                      onClick={cancelOversell}
                      className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      取消
                    </button>
                    <button
                      type="button"
                      onClick={saveOversell}
                      className="rounded bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
                    >
                      保存
                    </button>
                  </>
                )}
              </div>

              {oversellError && <p className="text-sm text-red-600">{oversellError}</p>}
              {oversellToast && <p className="text-sm text-green-600">{oversellToast}</p>}
            </div>
          )}
        </div>
      </div>

      {/* SWAP 配置 */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-base font-medium text-gray-900">SWAP 配置</h2>
        <p className="mt-1 text-sm text-gray-500">
          集群级 SWAP 配置，SWAP 大小不得超过数据盘容量的 1/3（当前上限 {maxSwapSize} GB）。
        </p>

        <div className="mt-5 max-w-3xl space-y-4">
          <div className="flex items-center gap-3">
            <label htmlFor="cluster-tab-swap-enabled" className="text-sm font-medium text-gray-700">
              开启SWAP
            </label>
            <button
              type="button"
              id="cluster-tab-swap-enabled"
              role="switch"
              aria-checked={swapEnabled}
              onClick={toggleSwap}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
                swapEnabled ? 'bg-blue-600 shadow-inner' : 'bg-gray-300 hover:bg-gray-400'
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
            <div>
              <label htmlFor="cluster-tab-swap-size" className="mb-2 block text-sm font-medium text-gray-700">
                SWAP大小
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="cluster-tab-swap-size"
                  type="number"
                  min={1}
                  max={maxSwapSize}
                  step={1}
                  value={swapSize}
                  onChange={(e) => {
                    setSwapSize(e.target.value);
                    setSwapError('');
                  }}
                  aria-invalid={Boolean(swapError)}
                  className={`w-full rounded border px-3 py-2 text-sm outline-none focus:ring-1 ${
                    swapError
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  placeholder="请输入SWAP大小"
                />
                <span className="shrink-0 text-sm text-gray-600">GB</span>
                <button
                  type="button"
                  onClick={saveSwap}
                  className="shrink-0 rounded bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
                >
                  保存
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">最大 {maxSwapSize} GB（数据盘容量的 1/3）</p>
              {swapError && <p className="mt-2 text-sm text-red-600">{swapError}</p>}
              {swapToast && <p className="mt-2 text-sm text-green-600">{swapToast}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
