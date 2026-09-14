'use client';

import { useState } from 'react';

interface ClusterOversellTabProps {
  clusterName: string;
}

export default function ClusterOversellTab({ clusterName }: ClusterOversellTabProps) {
  const [oversellFactor, setOversellFactor] = useState('3');
  const [oversellError, setOversellError] = useState('');
  const [swapEnabled, setSwapEnabled] = useState(false);
  const [swapSize, setSwapSize] = useState('');
  const [swapError, setSwapError] = useState('');
  const [savedOversell, setSavedOversell] = useState<string | null>(null);
  const [savedSwap, setSavedSwap] = useState<{ enabled: boolean; size: string } | null>(null);

  const maxSwapSize = 400;

  const saveOversellConfig = () => {
    const factor = Number(oversellFactor);
    if (!Number.isFinite(factor) || factor <= 0) {
      setOversellError('请输入大于 0 的超卖倍数');
      return;
    }
    setSavedOversell(oversellFactor);
    setOversellError('');
  };

  const saveSwapConfig = () => {
    if (swapEnabled) {
      const size = Number(swapSize);
      if (!swapSize || !Number.isInteger(size) || size < 1 || size > maxSwapSize) {
        setSwapError(`SWAP 大小需为 1-${maxSwapSize} GB`);
        return;
      }
    }
    setSavedSwap({ enabled: swapEnabled, size: swapSize });
    setSwapError('');
  };

  return (
    <div className="min-w-0 space-y-6">
      {/* 集群超卖配置 */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-base font-medium text-gray-900">集群超卖配置</h2>
        <p className="mt-1 text-sm text-gray-500">
          集群：{clusterName}，配置后作用于整个集群的资源超卖倍数。
        </p>

        <div className="mt-5 max-w-md">
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
              className={`w-full rounded border px-3 py-2 text-sm outline-none focus:ring-1 ${
                oversellError
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
              placeholder="请输入超卖倍数"
            />
            <span className="shrink-0 text-sm text-gray-600">倍</span>
          </div>
          {oversellError && <p className="mt-2 text-sm text-red-600">{oversellError}</p>}

          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              onClick={saveOversellConfig}
              className="rounded bg-blue-600 px-6 py-2 text-sm text-white transition-colors hover:bg-blue-700"
            >
              保存
            </button>
            {savedOversell !== null && (
              <span className="text-sm text-green-600">已保存：{savedOversell} 倍</span>
            )}
          </div>
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
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="请输入SWAP大小"
                />
                <span className="shrink-0 text-sm text-gray-600">GB</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">最大 {maxSwapSize} GB（数据盘容量的 1/3）</p>
              {swapError && <p className="mt-2 text-sm text-red-600">{swapError}</p>}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={saveSwapConfig}
              className="rounded bg-blue-600 px-6 py-2 text-sm text-white transition-colors hover:bg-blue-700"
            >
              保存
            </button>
            {savedSwap && (
              <span className="text-sm text-green-600">
                已保存：{savedSwap.enabled ? `已开启，大小 ${savedSwap.size || 0} GB` : '未开启'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
