'use client';

import { useState } from 'react';

interface NodeGroupTabProps {
  clusterName: string;
  onViewGroupNodes?: (groupName: string) => void;
}

interface DataDiskConfig {
  type: '高效云盘';
  size: number;
  deleteWithInstance: boolean;
  swapEnabled: boolean;
  swapSize: string;
}

interface NodeGroup {
  id: number;
  name: string;
  nodeCount: number;
  creator: string;
  createTime: string;
  dataDiskSize: number;
}

interface GroupSwapConfig {
  enabled: boolean;
  size: string;
}

const instanceSpecs = [
  { id: 'vc3.xlarge', name: '计算型c3', model: 'vc3.xlarge', cpu: 4, memory: 8, cpuFreq: 2.1, bandwidth: 1.5, pps: 41, connections: 2, originalPrice: 179.741, discountPrice: 84.161 },
  { id: 'vc3.2xlarge', name: '计算型c3', model: 'vc3.2xlarge', cpu: 8, memory: 16, cpuFreq: 2.1, bandwidth: 2.5, pps: 73, connections: 2.5, originalPrice: 359.482, discountPrice: 168.322 },
  { id: 'vc3.4xlarge', name: '计算型c3', model: 'vc3.4xlarge', cpu: 16, memory: 32, cpuFreq: 2.1, bandwidth: 5, pps: 90, connections: 4, originalPrice: 718.965, discountPrice: 336.644 },
  { id: 'vc3.5xlarge', name: '计算型c3', model: 'vc3.5xlarge', cpu: 20, memory: 40, cpuFreq: 2.1, bandwidth: 6.5, pps: 93, connections: 4.5, originalPrice: 898.706, discountPrice: 420.805 },
  { id: 'vc3.8xlarge', name: '计算型c3', model: 'vc3.8xlarge', cpu: 32, memory: 64, cpuFreq: 2.1, bandwidth: 10, pps: 103, connections: 6, originalPrice: 1437.93, discountPrice: 673.288 },
];

const categories = [
  { id: 'compute', label: '计算型（独享CPU）' },
  { id: 'general', label: '通用型（独享CPU）' },
  { id: 'memory', label: '内存型（独享CPU）' },
  { id: 'local-ssd', label: '本地SSD型（独享CPU）' },
  { id: 'local-hdd', label: '本地HDD型（独享CPU）' },
  { id: 'shared', label: '共享型（共享CPU）' },
  { id: 'gpu', label: 'GPU独享型（独享CPU）' },
];

const cloudServerProjects = [
  { id: 'project-container', label: '容器云项目' },
  { id: 'project-development', label: '开发测试项目' },
  { id: 'project-production', label: '生产环境项目' },
];

const customImages = [
  { id: 'anolis-8.2-anck', label: 'AnolisOS-8.2-QU1-x86_64-ANCK-2.5' },
  { id: 'anolis-8.8-anck', label: 'AnolisOS-8.8-x86_64-ANCK-5.10' },
  { id: 'rocky-9.3', label: 'Rocky Linux 9.3 x86_64' },
];

const initialGroups: NodeGroup[] = [
  { id: 1, name: '通用计算组', nodeCount: 3, creator: 'zhangxing5', createTime: '2026-08-12 14:30:00', dataDiskSize: 200 },
  { id: 2, name: '大数据内存组', nodeCount: 2, creator: 'jidongdong', createTime: '2026-08-20 09:15:00', dataDiskSize: 200 },
];

function validateSwapSize(disk: DataDiskConfig) {
  if (!disk.swapEnabled) return '';
  const maxSwapSize = Math.floor(disk.size / 3);
  const swapSize = Number(disk.swapSize);
  if (maxSwapSize < 1) return '当前数据盘容量不足以开启 SWAP';
  if (!disk.swapSize || !Number.isInteger(swapSize) || swapSize < 1 || swapSize > maxSwapSize) {
    return `SWAP 大小需为 1-${maxSwapSize} GB，且不得超过数据盘容量的 1/3`;
  }
  return '';
}

export default function NodeGroupTab({ clusterName, onViewGroupNodes }: NodeGroupTabProps) {
  const [view, setView] = useState<'list' | 'create'>('list');
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
  const [nodeType, setNodeType] = useState<'vm' | 'baremetal'>('vm');
  const [nodeSubnet, setNodeSubnet] = useState('11.51.176.0/22');
  const [vcpuFilter, setVcpuFilter] = useState('all');
  const [memoryFilter, setMemoryFilter] = useState('all');
  const [category, setCategory] = useState('compute');
  const [selectedSpec, setSelectedSpec] = useState('vc3.xlarge');
  const [systemDiskSize, setSystemDiskSize] = useState(200);
  const [systemDiskType, setSystemDiskType] = useState('高效云盘');
  const [dataDisk, setDataDisk] = useState<DataDiskConfig | null>(null);
  const [swapSizeError, setSwapSizeError] = useState('');
  const [nodeCount, setNodeCount] = useState(2);
  const [hostnameType, setHostnameType] = useState<'random' | 'custom'>('random');
  const [osType, setOsType] = useState<'default' | 'custom'>('default');
  const [cloudServerProject, setCloudServerProject] = useState('project-container');
  const [customImage, setCustomImage] = useState('anolis-8.2-anck');
  const [tags, setTags] = useState<{ key: string; value: string }[]>([]);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  const resetCreateForm = () => {
    setGroupName('');
    setGroupNameError('');
    setNodeType('vm');
    setNodeSubnet('11.51.176.0/22');
    setVcpuFilter('all');
    setMemoryFilter('all');
    setCategory('compute');
    setSelectedSpec('vc3.xlarge');
    setSystemDiskSize(200);
    setSystemDiskType('高效云盘');
    setDataDisk(null);
    setSwapSizeError('');
    setNodeCount(2);
    setHostnameType('random');
    setOsType('default');
    setCloudServerProject('project-container');
    setCustomImage('anolis-8.2-anck');
    setTags([]);
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

  const handleDataDiskSizeChange = (size: number) => {
    setDataDisk((current) => {
      if (!current) return current;
      const next = { ...current, size };
      setSwapSizeError(validateSwapSize(next));
      return next;
    });
  };

  const handleSubmitCreate = () => {
    if (!groupName.trim()) {
      setGroupNameError('请输入节点组名称');
      return;
    }
    if (dataDisk) {
      const error = validateSwapSize(dataDisk);
      setSwapSizeError(error);
      if (error) return;
    }

    setGroups((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: groupName.trim(),
        nodeCount,
        creator: 'zhangxing5',
        createTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
        dataDiskSize: dataDisk?.size ?? 200,
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
            onClick={() => {
              resetCreateForm();
              setView('list');
            }}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            ← 返回节点组列表
          </button>
          <h2 className="mb-6 mt-4 text-lg font-bold text-gray-900">创建节点组</h2>

          <div className="max-w-6xl space-y-8">
            {/* 基本信息 */}
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

            {/* 节点配置 */}
            <div className="space-y-6">
              <h3 className="text-base font-medium text-gray-900">节点配置</h3>

              <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
                <label className="shrink-0 text-sm font-medium text-gray-700 md:w-24 md:pt-2">
                  <span className="text-red-500">*</span>节点类型
                </label>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setNodeType('vm')}
                    className={`rounded-l px-4 py-2 text-sm transition-colors ${
                      nodeType === 'vm' ? 'bg-blue-600 text-white' : 'border border-gray-300 bg-gray-100 text-gray-700'
                    }`}
                  >
                    虚拟机
                  </button>
                  <button
                    type="button"
                    onClick={() => setNodeType('baremetal')}
                    className={`rounded-r px-4 py-2 text-sm transition-colors ${
                      nodeType === 'baremetal' ? 'bg-blue-600 text-white' : 'border border-gray-300 bg-gray-100 text-gray-700'
                    }`}
                  >
                    裸金属
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
                <label className="shrink-0 text-sm font-medium text-gray-700 md:w-24 md:pt-2">
                  <span className="text-red-500">*</span>节点子网
                </label>
                <select
                  value={nodeSubnet}
                  onChange={(e) => setNodeSubnet(e.target.value)}
                  className="rounded border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="11.51.176.0/22">11.51.176.0/22（可用IP：861）</option>
                </select>
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
                <label className="shrink-0 text-sm font-medium text-gray-700 md:w-24 md:pt-2">筛选</label>
                <div className="flex flex-wrap items-center gap-4">
                  <select
                    value={vcpuFilter}
                    onChange={(e) => setVcpuFilter(e.target.value)}
                    className="rounded border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="all">全部</option>
                    <option value="4">4核</option>
                    <option value="8">8核</option>
                    <option value="16">16核</option>
                    <option value="32">32核</option>
                  </select>
                  <select
                    value={memoryFilter}
                    onChange={(e) => setMemoryFilter(e.target.value)}
                    className="rounded border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="all">全部</option>
                    <option value="8">8GB</option>
                    <option value="16">16GB</option>
                    <option value="32">32GB</option>
                    <option value="64">64GB</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
                <label className="shrink-0 text-sm font-medium text-gray-700 md:w-24 md:pt-2">
                  <span className="text-red-500">*</span>分类
                </label>
                <div className="flex flex-1 flex-wrap gap-x-6 gap-y-3">
                  {categories.map((item) => (
                    <label key={item.id} className="flex cursor-pointer items-center gap-2 whitespace-nowrap">
                      <input
                        type="radio"
                        name="ng-category"
                        value={item.id}
                        checked={category === item.id}
                        onChange={() => setCategory(item.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 实例规格 */}
              <div>
                <h3 className="mb-4 text-base font-medium text-gray-900">实例规格</h3>
                <div className="overflow-hidden rounded border border-gray-200">
                  <div className="grid grid-cols-12 gap-4 border-b border-gray-200 bg-gray-50 px-4 py-3 text-xs font-medium text-gray-600">
                    <div className="col-span-2">规格名称</div>
                    <div className="col-span-1">vCPU</div>
                    <div className="col-span-1">内存</div>
                    <div className="col-span-1">CPU主频</div>
                    <div className="col-span-1">网络带宽</div>
                    <div className="col-span-1">网络PPS</div>
                    <div className="col-span-1">连接数</div>
                    <div className="col-span-1">原价/月</div>
                    <div className="col-span-1">折扣价/月</div>
                    <div className="col-span-2">操作</div>
                  </div>
                  {instanceSpecs.map((spec) => (
                    <div key={spec.id} className="grid grid-cols-12 items-center gap-4 border-b border-gray-200 px-4 py-4 hover:bg-gray-50">
                      <div className="col-span-2">
                        <div className="text-sm font-medium text-gray-900">{spec.name}</div>
                        <div className="text-xs text-gray-500">{spec.model}</div>
                      </div>
                      <div className="col-span-1 text-sm text-gray-700">{spec.cpu}核</div>
                      <div className="col-span-1 text-sm text-gray-700">{spec.memory}GB</div>
                      <div className="col-span-1 text-sm text-gray-700">{spec.cpuFreq}GHz</div>
                      <div className="col-span-1 text-sm text-gray-700">{spec.bandwidth}Gbps</div>
                      <div className="col-span-1 text-sm text-gray-700">{spec.pps}万</div>
                      <div className="col-span-1 text-sm text-gray-700">{spec.connections}万</div>
                      <div className="col-span-1 text-sm text-gray-500 line-through">{spec.originalPrice.toFixed(3)}</div>
                      <div className="col-span-1 text-sm font-medium text-red-600">{spec.discountPrice.toFixed(3)}</div>
                      <div className="col-span-2">
                        <input
                          type="radio"
                          name="ng-spec"
                          value={spec.id}
                          checked={selectedSpec === spec.id}
                          onChange={() => setSelectedSpec(spec.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 存储配置 */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="mb-4 text-base font-medium text-gray-900">存储配置</h3>
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
                  <label className="shrink-0 text-sm font-medium text-gray-700 md:w-24 md:pt-2">
                    <span className="text-red-500">*</span>系统盘
                  </label>
                  <div className="flex flex-wrap items-center gap-4">
                    <select
                      value={systemDiskType}
                      onChange={(e) => setSystemDiskType(e.target.value)}
                      className="rounded border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="高效云盘">高效云盘</option>
                    </select>
                    <input
                      type="number"
                      value={systemDiskSize}
                      onChange={(e) => setSystemDiskSize(Number(e.target.value))}
                      className="w-24 rounded border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-500">GB</span>
                    <span className="text-sm text-gray-500">（2800 IOPS）</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
                  <label className="shrink-0 text-sm font-medium text-gray-700 md:w-24 md:pt-2">数据盘</label>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-gray-500">
                      已添加 {dataDisk ? 1 : 0} 个数据盘，还可以添加 {dataDisk ? 0 : 1} 个
                    </div>
                    {dataDisk ? (
                      <div className="mt-3 flex flex-wrap items-center gap-4">
                        <select
                          value={dataDisk.type}
                          onChange={(e) =>
                            setDataDisk((current) =>
                              current ? { ...current, type: e.target.value as DataDiskConfig['type'] } : current
                            )
                          }
                          className="rounded border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="高效云盘">高效云盘</option>
                        </select>
                        <input
                          type="number"
                          value={dataDisk.size}
                          onChange={(e) => handleDataDiskSizeChange(Number(e.target.value))}
                          className="w-24 rounded border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-500">GB</span>
                        <span className="text-sm text-gray-500">（3800 IOPS）</span>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={dataDisk.deleteWithInstance}
                            onChange={(e) =>
                              setDataDisk((current) =>
                                current ? { ...current, deleteWithInstance: e.target.checked } : current
                              )
                            }
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">随实例释放</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setDataDisk(null);
                            setSwapSizeError('');
                          }}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          删除
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setDataDisk({ type: '高效云盘', size: 200, deleteWithInstance: true, swapEnabled: false, swapSize: '' })
                        }
                        className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                      >
                        + 添加数据盘
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
                  <label className="shrink-0 text-sm font-medium text-gray-700 md:w-24 md:pt-2">开启 SWAP</label>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <label className={`flex items-center gap-2 ${dataDisk ? 'cursor-pointer' : 'cursor-not-allowed text-gray-400'}`}>
                        <input
                          type="checkbox"
                          checked={dataDisk?.swapEnabled ?? false}
                          disabled={!dataDisk}
                          onChange={(e) => {
                            const enabled = e.target.checked;
                            setDataDisk((current) => {
                              if (!current) return current;
                              const next = { ...current, swapEnabled: enabled };
                              setSwapSizeError(validateSwapSize(next));
                              return next;
                            });
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed"
                        />
                        <span className="text-sm">开启</span>
                      </label>
                      {dataDisk?.swapEnabled && (
                        <>
                          <input
                            type="number"
                            min={1}
                            max={Math.floor(dataDisk.size / 3)}
                            step={1}
                            value={dataDisk.swapSize}
                            onChange={(e) => {
                              const value = e.target.value;
                              setDataDisk((current) => {
                                if (!current) return current;
                                const next = { ...current, swapSize: value };
                                setSwapSizeError(validateSwapSize(next));
                                return next;
                              });
                            }}
                            className={`w-24 rounded border px-4 py-2 text-sm outline-none focus:ring-1 ${
                              swapSizeError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                            }`}
                          />
                          <span className="text-sm text-gray-500">GB</span>
                          <span className="text-xs text-gray-500">最大 {Math.floor(dataDisk.size / 3)} GB（数据盘容量的 1/3）</span>
                        </>
                      )}
                      {!dataDisk && <span className="text-xs text-gray-400">请先添加数据盘后配置 SWAP</span>}
                    </div>
                    {dataDisk?.swapEnabled && swapSizeError && (
                      <p className="mt-1 text-xs text-red-600">{swapSizeError}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* 系统与节点基础配置 */}
              <div className="space-y-6">
                <h3 className="text-base font-medium text-gray-900">系统与节点基础配置</h3>

                <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
                  <label className="shrink-0 text-sm font-medium text-gray-700 md:w-24 md:pt-2">操作系统</label>
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex items-center gap-6">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          name="ng-osType"
                          checked={osType === 'default'}
                          onChange={() => setOsType('default')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">默认</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          name="ng-osType"
                          checked={osType === 'custom'}
                          onChange={() => setOsType('custom')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">自定义</span>
                      </label>
                    </div>
                    {osType === 'default' ? (
                      <div className="inline-block rounded bg-gray-50 px-4 py-2 text-sm text-gray-700">
                        AnolisOS-8.2-QU1-x86_64-ANCK-2.5
                      </div>
                    ) : (
                      <div className="max-w-2xl space-y-4">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">云服务器项目</label>
                          <select
                            value={cloudServerProject}
                            onChange={(e) => setCloudServerProject(e.target.value)}
                            className="rounded border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          >
                            {cloudServerProjects.map((project) => (
                              <option key={project.id} value={project.id}>{project.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">选择镜像</label>
                          <select
                            value={customImage}
                            onChange={(e) => setCustomImage(e.target.value)}
                            className="rounded border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          >
                            {customImages.map((image) => (
                              <option key={image.id} value={image.id}>{image.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
                  <label className="shrink-0 text-sm font-medium text-gray-700 md:w-24 md:pt-2">节点数量</label>
                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-4">
                    <input
                      type="number"
                      value={nodeCount}
                      onChange={(e) => setNodeCount(Number(e.target.value))}
                      className="w-24 rounded border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-500">台</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
                  <label className="shrink-0 text-sm font-medium text-gray-700 md:w-24 md:pt-2">主机名称</label>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="ng-hostname"
                        checked={hostnameType === 'random'}
                        onChange={() => setHostnameType('random')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">随机主机名</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="ng-hostname"
                        checked={hostnameType === 'custom'}
                        onChange={() => setHostnameType('custom')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">自定义主机名</span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
                  <label className="shrink-0 text-sm font-medium text-gray-700 md:w-24 md:pt-2">标签</label>
                  <div className="min-w-0 flex-1">
                    {tags.length === 0 ? (
                      <button
                        type="button"
                        onClick={() => setTags((prev) => [...prev, { key: '', value: '' }])}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        + 添加
                      </button>
                    ) : (
                      <div className="space-y-2">
                        {tags.map((tag, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={tag.key}
                              placeholder="键"
                              onChange={(e) =>
                                setTags((prev) => prev.map((item, i) => (i === index ? { ...item, key: e.target.value } : item)))
                              }
                              className="w-32 rounded border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500"
                            />
                            <input
                              type="text"
                              value={tag.value}
                              placeholder="值"
                              onChange={(e) =>
                                setTags((prev) => prev.map((item, i) => (i === index ? { ...item, value: e.target.value } : item)))
                              }
                              className="w-32 rounded border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() => setTags((prev) => prev.filter((_, i) => i !== index))}
                              className="text-sm text-red-600 hover:text-red-700"
                            >
                              删除
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setTags((prev) => [...prev, { key: '', value: '' }])}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          + 添加
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
              <button
                type="button"
                onClick={() => {
                  resetCreateForm();
                  setView('list');
                }}
                className="rounded border border-gray-300 px-6 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSubmitCreate}
                className="rounded bg-blue-600 px-6 py-2 text-sm text-white transition-colors hover:bg-blue-700"
              >
                提交
              </button>
            </div>
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
                <td className="px-4 py-3 text-gray-700">{group.creator}</td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-700">{group.createTime}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <div className="flex items-center gap-2 whitespace-nowrap">
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
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-gray-500">
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
