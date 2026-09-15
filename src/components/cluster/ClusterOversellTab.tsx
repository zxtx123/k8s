'use client';

import { useEffect, useState } from 'react';

interface ClusterOversellTabProps {
  clusterName: string;
}

export default function ClusterOversellTab({ clusterName }: ClusterOversellTabProps) {
  // 超卖配置
  const [oversellEnabled, setOversellEnabled] = useState(false);
  const [oversellFactor, setOversellFactor] = useState('3');
  const [savedOversellFactor, setSavedOversellFactor] = useState('3');
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

  const persistOversell = (enabled: boolean, factor: string) => {
    try {
      window.localStorage.setItem(oversellStorageKey, JSON.stringify({ enabled, factor }));
    } catch {
      // 本地存储不可用时忽略，仅保留内存态
    }
  };

  // 下次进入页面时恢复已保存的超卖配置
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(oversellStorageKey);
      if (!raw) return;
      const cfg = JSON.parse(raw) as { enabled?: boolean; factor?: string };
      if (typeof cfg.factor === 'string' && cfg.factor) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- 从 localStorage 恢复持久化状态
        setOversellFactor(cfg.factor);
        setSavedOversellFactor(cfg.factor);
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
      // 开启开关视为重新配置，需要重新输入倍数
      setOversellFactor('');
      setOversellFresh(true);
    } else {
      // 关闭立即生效并持久化
      setOversellEditing(false);
      setOversellFresh(false);
      persistOversell(false, oversellFactor);
    }
  };

  const saveOversell = () => {
    const factor = Number(oversellFactor);
    if (!Number.isFinite(factor) || factor <= 0) {
      setOversellError('请输入大于 0 的超卖倍数');
      return;
    }
    setSavedOversellFactor(oversellFactor);
    persistOversell(oversellEnabled, oversellFactor);
    setOversellError('');
    setOversellToast(`保存成功：集群超卖倍数 ${oversellFactor} 倍`);
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
    setOversellFactor(savedOversellFactor);
    setOversellError('');
    setOversellToast('');
    setOversellEditing(true);
    setOversellFresh(false);
  };

  const cancelOversell = () => {
    setOversellFactor(savedOversellFactor);
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

        <div className="mt-5 max-w-md space-y-4">
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
            <div>
            <label htmlFor="cluster-tab-oversell-factor" className="mb-2 block text-sm font-medium text-gray-700">
              集群超卖倍数
            </label>
            <div className="flex items-center gap-2">
            <input
              id="cluster-tab-oversell-factor"
              type="number"
              min="0"
              step="0.1"
              value={oversellFactor}
              onChange={(e) => {
                setOversellFactor(e.target.value);
                setOversellError('');
              }}
              disabled={!oversellEditing}
              className={`w-full rounded border px-3 py-2 text-sm outline-none focus:ring-1 ${
                oversellError
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              } ${oversellEditing ? 'bg-white' : 'cursor-not-allowed bg-gray-100 text-gray-500'}`}
              placeholder="请输入超卖倍数"
            />
            <span className="shrink-0 text-sm text-gray-600">倍</span>
            {!oversellEditing && (
              <button
                type="button"
                onClick={startOversellEdit}
                className="shrink-0 rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
              >
                编辑
              </button>
            )}
            {oversellEditing && oversellFresh && (
              <button
                type="button"
                onClick={saveOversell}
                className="shrink-0 rounded bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
              >
                保存
              </button>
            )}
            {oversellEditing && !oversellFresh && (
              <>
                <button
                  type="button"
                  onClick={cancelOversell}
                  className="shrink-0 rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={saveOversell}
                  className="shrink-0 rounded bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
                >
                  保存
                </button>
              </>
            )}
            </div>
            {oversellError && <p className="mt-2 text-sm text-red-600">{oversellError}</p>}
            {oversellToast && <p className="mt-2 text-sm text-green-600">{oversellToast}</p>}
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

        <div className="mt-5 max-w-md space-y-4">
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
