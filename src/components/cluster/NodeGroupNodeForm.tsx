'use client';

import { useState } from 'react';

interface DataDiskConfig {
  type: '高效云盘';
  size: number;
  deleteWithInstance: boolean;
  swapEnabled: boolean;
  swapSize: string;
}

interface NodeGroupNodeFormProps {
  showSwapField?: boolean;
  showGroupSelect?: boolean;
  nodeGroupOptions?: string[];
  selectedNodeGroup?: string;
  groupSelectError?: string;
  onNodeGroupChange?: (name: string) => void;
  onSubmit?: (payload: { nodeCount: number; dataDiskSize: number }) => void;
  onCancel: () => void;
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

const availableZones = [
  { id: 'bjcm', label: 'bjcm(北京移动)' },
  { id: 'bjmd', label: 'bjmd(北京联通)' },
  { id: 'bjzdt', label: 'bjzdt(北京电信25G)' },
  { id: 'bjzdc', label: 'bjzdc(北京联通25G)' },
  { id: 'bjwdt', label: 'bjwdt(北京电信25G-特价)' },
  { id: 'aicn', label: 'aicn(北京阿里云)' },
];

const existingCloudProjects = [
  { id: 'project-1234', label: '1234(产品团队-专用)' },
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

export default function NodeGroupNodeForm({
  showSwapField = true,
  showGroupSelect = false,
  nodeGroupOptions = [],
  selectedNodeGroup = '',
  groupSelectError = '',
  onNodeGroupChange,
  onSubmit,
  onCancel,
}: NodeGroupNodeFormProps) {
  const [nodeCreateType, setNodeCreateType] = useState<'create' | 'existing'>('create');
  const [nodeType, setNodeType] = useState<'vm' | 'baremetal'>('vm');
  const [existingZone, setExistingZone] = useState('bjzdt');
  const [existingProject, setExistingProject] = useState('project-1234');
  const [existingNodeType, setExistingNodeType] = useState('vm');
  const [existingNodeName, setExistingNodeName] = useState('');
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

  const handleDataDiskSizeChange = (size: number) => {
    setDataDisk((current) => {
      if (!current) return current;
      const next = { ...current, size };
      setSwapSizeError(validateSwapSize(next));
      return next;
    });
  };

  const handleInternalSubmit = () => {
    if (dataDisk) {
      const error = validateSwapSize(dataDisk);
      setSwapSizeError(error);
      if (error) return;
    }
    onSubmit?.({ nodeCount, dataDiskSize: dataDisk?.size ?? 200 });
  };

  return (
    <>
      {showGroupSelect && (
      <div className="border-b border-gray-200 pb-6">
        <h3 className="mb-4 text-base font-medium text-gray-900">基本信息</h3>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
          <label className="shrink-0 text-sm font-medium text-gray-700 md:w-24 md:pt-2">
            <span className="text-red-500">*</span>节点组
          </label>
          <div className="min-w-0 flex-1">
            <select
              value={selectedNodeGroup}
              onChange={(e) => onNodeGroupChange?.(e.target.value)}
              className="w-80 max-w-full rounded border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">请先选择节点组</option>
              {nodeGroupOptions.map((groupName) => (
                <option key={groupName} value={groupName}>{groupName}</option>
              ))}
            </select>
            {groupSelectError && <p className="mt-1 text-xs text-red-600">{groupSelectError}</p>}
          </div>
        </div>
      </div>
      )}

      {/* 节点配置 */}
      <div className="space-y-6">
              <h3 className="text-base font-medium text-gray-900">节点配置</h3>

              {/* 节点创建方式 */}
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
                <label className="shrink-0 text-sm font-medium text-gray-700 md:w-24 md:pt-2">
                  <span className="text-red-500">*</span>节点创建方式
                </label>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setNodeCreateType('create')}
                    className={`rounded-l px-4 py-2 text-sm transition-colors ${
                      nodeCreateType === 'create' ? 'bg-blue-600 text-white' : 'border border-gray-300 bg-gray-100 text-gray-700'
                    }`}
                  >
                    新建节点
                  </button>
                  <button
                    type="button"
                    onClick={() => setNodeCreateType('existing')}
                    className={`rounded-r px-4 py-2 text-sm transition-colors ${
                      nodeCreateType === 'existing' ? 'bg-blue-600 text-white' : 'border border-gray-300 bg-gray-100 text-gray-700'
                    }`}
                  >
                    已有节点
                  </button>
                </div>
              </div>

              {nodeCreateType === 'create' && (
              <>
              {/* 节点类型 */}
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

              {/* 节点子网 */}
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

              {/* 筛选 */}
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

              {/* 分类 */}
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

                {showSwapField && (
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
                )}
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

              </>
              )}

              {nodeCreateType === 'existing' && (
              <>
              {/* 可用区 */}
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
                <label className="shrink-0 text-sm font-medium text-gray-700 md:w-28 md:pt-2">
                  <span className="text-red-500">*</span>可用区
                </label>
                <div className="flex flex-1 flex-wrap gap-x-6 gap-y-3">
                  {availableZones.map((zone) => (
                    <label key={zone.id} className="flex cursor-pointer items-center gap-2 whitespace-nowrap">
                      <input
                        type="radio"
                        name="ng-zone"
                        value={zone.id}
                        checked={existingZone === zone.id}
                        onChange={() => setExistingZone(zone.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{zone.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 云服务器项目 */}
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
                <label className="shrink-0 text-sm font-medium text-gray-700 md:w-28 md:pt-2">
                  <span className="text-red-500">*</span>云服务器项目
                </label>
                <select
                  value={existingProject}
                  onChange={(e) => setExistingProject(e.target.value)}
                  className="rounded border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  {existingCloudProjects.map((project) => (
                    <option key={project.id} value={project.id}>{project.label}</option>
                  ))}
                </select>
              </div>

              {/* 选择已有节点 */}
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
                <label className="shrink-0 text-sm font-medium text-gray-700 md:w-28 md:pt-2">
                  <span className="text-red-500">*</span>选择已有节点
                </label>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">节点类型</span>
                  <select
                    value={existingNodeType}
                    onChange={(e) => setExistingNodeType(e.target.value)}
                    className="rounded border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="vm">虚拟机</option>
                    <option value="baremetal">裸金属</option>
                  </select>
                  <span className="text-sm font-medium text-gray-700">节点名称</span>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={existingNodeName}
                      onChange={(e) => setExistingNodeName(e.target.value)}
                      placeholder="请输入名称或IP，一行一个"
                      className="w-64 rounded-l border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      className="rounded-r border border-l-0 border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 hover:bg-gray-100"
                    >
                      搜索
                    </button>
                  </div>
                </div>
              </div>

              {/* 筛选提示 + 节点表格 */}
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
                <label className="shrink-0 text-sm text-gray-700 md:w-28 md:pt-2">筛选</label>
                <div className="min-w-0 flex-1">
                  <div className="rounded bg-blue-50 px-4 py-3 text-sm text-gray-700">
                    <p>如果只添加一个节点，节点规格最低要求为16C，避免因系统组件占用导致资源不足。</p>
                    <p>该集群为kata集群，只能添加虚拟化嵌套的机器。</p>
                  </div>
                  <div className="mt-4 overflow-hidden rounded border border-gray-200">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-600">
                          <th className="w-12 px-4 py-3">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600" disabled />
                          </th>
                          <th className="px-4 py-3 font-medium">节点名称</th>
                          <th className="px-4 py-3 font-medium">节点IP</th>
                          <th className="px-4 py-3 font-medium">规格</th>
                          <th className="px-4 py-3 font-medium">vCPU</th>
                          <th className="px-4 py-3 font-medium">内存</th>
                          <th className="px-4 py-3 font-medium">操作系统</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td colSpan={7} className="px-4 py-12 text-center">
                            <div className="flex flex-col items-center gap-2 text-gray-400">
                              <span className="text-sm">暂无数据</span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Docker版本 */}
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
                <label className="shrink-0 text-sm font-medium text-gray-700 md:w-28 md:pt-2">
                  <span className="text-red-500">*</span>Docker版本
                </label>
                <p className="min-w-0 flex-1 text-sm text-gray-700">
                  需要20.10以上的版本，如果机器上有低于该版本的docker，请先卸载。系统会安装高版本的Docker
                </p>
              </div>

              {/* 操作系统 */}
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
                <label className="shrink-0 text-sm font-medium text-gray-700 md:w-28 md:pt-2">
                  <span className="text-red-500">*</span>操作系统
                </label>
                <p className="min-w-0 flex-1 text-sm text-gray-700">
                  建议使用龙蜥8.2以上操作系统，支持离在线混部；其他操作系统不支持内核级抢占，只支持CPU静态隔离，混部效果不好。
                  如果是CentOS，操作系统版本要求7或以上，内核版本要求5.1或以上
                </p>
              </div>

              {/* 数据盘 */}
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
                <label className="shrink-0 text-sm font-medium text-gray-700 md:w-28 md:pt-2">
                  <span className="text-red-500">*</span>数据盘
                </label>
                <p className="min-w-0 flex-1 text-sm text-gray-700">
                  将容器和镜像存储在数据盘，如果当前集群已启用动态本地盘，添加的节点不支持使用本地盘，只能使用云盘。
                </p>
              </div>

              {/* 标签 */}
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
                <label className="shrink-0 text-sm font-medium text-gray-700 md:w-28 md:pt-2">标签</label>
                <div className="min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => setTags((prev) => [...prev, { key: '', value: '' }])}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    + 添加
                  </button>
                </div>
              </div>

              {/* 污点 */}
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
                <label className="shrink-0 text-sm font-medium text-gray-700 md:w-28 md:pt-2">污点</label>
                <div className="min-w-0 flex-1">
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    + 添加
                  </button>
                </div>
              </div>
              </>
              )}

      <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-gray-300 px-6 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
        >
          取消
        </button>
        <button
          type="button"
          onClick={handleInternalSubmit}
          className="rounded bg-blue-600 px-6 py-2 text-sm text-white transition-colors hover:bg-blue-700"
        >
          提交
        </button>
      </div>
      </div>
    </>
  );
}
