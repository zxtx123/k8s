'use client';

import { useState } from 'react';

interface CreateClusterProps {
  onCancel: () => void;
  onNext: () => void;
}

interface ParamItem {
  name: string;
  value: string;
  description?: string;
}

interface DataDiskConfig {
  type: '高效云盘';
  size: number;
  deleteWithInstance: boolean;
  swapEnabled: boolean;
  swapSize: string;
}

export default function CreateCluster({ onCancel, onNext }: CreateClusterProps) {
  const [currentStep, setCurrentStep] = useState(1);
  
  // 第1步：基本信息
  const [region, setRegion] = useState('beijing');
  const [zone, setZone] = useState('bjpdc');
  const [clusterName, setClusterName] = useState('');
  const [clusterNameCN, setClusterNameCN] = useState('');
  const [k8sVersion, setK8sVersion] = useState('v1.30.8');
  const [networkType, setNetworkType] = useState('vpc');
  const [vpcNetwork, setVpcNetwork] = useState('');
  const [subnet, setSubnet] = useState('');
  const [podLimit, setPodLimit] = useState('64');
  const [securityGroup, setSecurityGroup] = useState('');

  // 第2步：集群配置
  const [masterMode, setMasterMode] = useState('managed');
  const [sharedStorage, setSharedStorage] = useState(true);
  const [dynamicLocalDisk, setDynamicLocalDisk] = useState(false);
  const [installIngress, setInstallIngress] = useState(true);
  const [installLoadBalancer, setInstallLoadBalancer] = useState(true);
  const [installArkit, setInstallArkit] = useState(true);
  const [installMonitor, setInstallMonitor] = useState(true);
  const [installLxcfs, setInstallLxcfs] = useState(true);
  const [installAutoscaler, setInstallAutoscaler] = useState(true);
  const [installCloneset, setInstallCloneset] = useState(false);
  const [installKata, setInstallKata] = useState(true);
  const [showAdvancedConfig, setShowAdvancedConfig] = useState(false);
  
  // 高级配置
  const [advancedTab, setAdvancedTab] = useState<'control' | 'node'>('control');
  const [apiServerParams, setApiServerParams] = useState<ParamItem[]>([
    { name: 'audit-log-maxage', value: '30', description: '审计日志文件的最大保留天数，超过这个天数的日志文件会被自动清理' },
    { name: 'audit-log-maxbackup', value: '100', description: '审计日志的最大备份文件数量，当日志文件达到切割条件时，最多保留100个备份日志文件' },
    { name: 'audit-log-maxsize', value: '100', description: '单个审计日志文件的最大大小，单位为MB，当单个日志文件达到100MB时会触发日志切割' },
  ]);
  const [controllerParams, setControllerParams] = useState<ParamItem[]>([]);
  const [schedulerParams, setSchedulerParams] = useState<ParamItem[]>([]);
  const [controlPlaneLogEnabled, setControlPlaneLogEnabled] = useState(false);

  // 第3步：节点配置
  const [selectedSpec, setSelectedSpec] = useState('vc3.xlarge');
  const [systemDiskSize, setSystemDiskSize] = useState(200);
  const [systemDiskType, setSystemDiskType] = useState('高效云盘');
  const [dataDisk, setDataDisk] = useState<DataDiskConfig | null>(null);
  const [swapSizeError, setSwapSizeError] = useState('');
  const [nodeCount, setNodeCount] = useState(2);
  const [hostnameType, setHostnameType] = useState<'random' | 'custom'>('random');
  const [customHostnamePrefix, setCustomHostnamePrefix] = useState('');
  const [tags, setTags] = useState<{ key: string; value: string }[]>([]);
  const [nodeType, setNodeType] = useState<'vm' | 'baremetal'>('vm');
  const [nodeSubnet, setNodeSubnet] = useState('11.51.176.0/22');
  const [osType, setOsType] = useState<'default' | 'custom'>('default');
  const [cloudServerProject, setCloudServerProject] = useState('project-container');
  const [customImage, setCustomImage] = useState('anolis-8.2-anck');
  const [vcpuFilter, setVcpuFilter] = useState('all');
  const [memoryFilter, setMemoryFilter] = useState('all');
  const [category, setCategory] = useState('compute');

  const instanceSpecs = [
    { 
      id: 'vc3.xlarge', 
      name: '计算型c3', 
      model: 'vc3.xlarge', 
      cpu: 4, 
      memory: 8, 
      cpuFreq: 2.10, 
      bandwidth: 1.5, 
      pps: 41, 
      connections: 2, 
      originalPrice: 179.741, 
      discountPrice: 84.161 
    },
    { 
      id: 'vc3.2xlarge', 
      name: '计算型c3', 
      model: 'vc3.2xlarge', 
      cpu: 8, 
      memory: 16, 
      cpuFreq: 2.10, 
      bandwidth: 2.5, 
      pps: 73, 
      connections: 2.5, 
      originalPrice: 359.482, 
      discountPrice: 168.322 
    },
    { 
      id: 'vc3.4xlarge', 
      name: '计算型c3', 
      model: 'vc3.4xlarge', 
      cpu: 16, 
      memory: 32, 
      cpuFreq: 2.10, 
      bandwidth: 5, 
      pps: 90, 
      connections: 4, 
      originalPrice: 718.965, 
      discountPrice: 336.644 
    },
    { 
      id: 'vc3.5xlarge', 
      name: '计算型c3', 
      model: 'vc3.5xlarge', 
      cpu: 20, 
      memory: 40, 
      cpuFreq: 2.10, 
      bandwidth: 6.5, 
      pps: 93, 
      connections: 4.5, 
      originalPrice: 898.706, 
      discountPrice: 420.805 
    },
    { 
      id: 'vc3.8xlarge', 
      name: '计算型c3', 
      model: 'vc3.8xlarge', 
      cpu: 32, 
      memory: 64, 
      cpuFreq: 2.10, 
      bandwidth: 10, 
      pps: 103, 
      connections: 6, 
      originalPrice: 1437.93, 
      discountPrice: 673.288 
    },
  ];

  // 计算成本预估
  const calculateCost = () => {
    const spec = instanceSpecs.find(s => s.id === selectedSpec);
    if (!spec) return 0;
    return spec.discountPrice * nodeCount;
  };

  const regions = [
    { id: 'beijing', label: '北京' },
    { id: 'shanghai', label: '上海' },
    { id: 'zhengzhou', label: '郑州' },
  ];

  const zones = [
    { id: 'bjpdc', label: 'bjpdc(北京联通25G)', recommended: true },
    { id: 'bjmd', label: 'bjmd(北京联通)' },
    { id: 'bjwdt', label: 'bjwdt(北京电信25G-特价)' },
    { id: 'bjzdt', label: 'bjzdt(北京电信25G)' },
  ];

  const k8sVersions = [
    { id: 'v1.30.8', label: 'v1.30.8' },
    { id: 'v1.28.11', label: 'v1.28.11' },
    { id: 'v1.26.9', label: 'v1.26.9' },
  ];

  const networkTypes = [
    { id: 'vpc', label: '专有网络' },
  ];

  const vpcNetworks = [
    { id: 'vpc-63ea1169b7bc9', label: '通用VPC | vpc-63ea1169b7bc9 | 11.51.176.0/20,11.51.240.0/20,11.53.17...' },
  ];

  const subnets = [
    { id: '11.51.176.0/22', label: '11.51.176.0/22（可用IP：861）', available: true },
  ];

  const podLimits = [
    { id: '64', label: '64' },
    { id: '128', label: '128' },
    { id: '256', label: '256' },
  ];

  const securityGroups = [
    { id: '', label: '请选择' },
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

  const handleAddParam = (type: 'api' | 'controller' | 'scheduler') => {
    const newParam: ParamItem = { name: '', value: '' };
    if (type === 'api') {
      setApiServerParams([...apiServerParams, newParam]);
    } else if (type === 'controller') {
      setControllerParams([...controllerParams, newParam]);
    } else {
      setSchedulerParams([...schedulerParams, newParam]);
    }
  };

  const handleRemoveParam = (type: 'api' | 'controller' | 'scheduler', index: number) => {
    if (type === 'api') {
      setApiServerParams(apiServerParams.filter((_, i) => i !== index));
    } else if (type === 'controller') {
      setControllerParams(controllerParams.filter((_, i) => i !== index));
    } else {
      setSchedulerParams(schedulerParams.filter((_, i) => i !== index));
    }
  };

  const handleUpdateParam = (
    type: 'api' | 'controller' | 'scheduler',
    index: number,
    field: 'name' | 'value' | 'description',
    value: string
  ) => {
    const updateFn = type === 'api' ? setApiServerParams : 
                    type === 'controller' ? setControllerParams : setSchedulerParams;
    const params = type === 'api' ? apiServerParams : 
                   type === 'controller' ? controllerParams : schedulerParams;
    
    const newParams = [...params];
    newParams[index] = { ...newParams[index], [field]: value };
    updateFn(newParams);
  };

  const validateSwapSize = (disk: DataDiskConfig) => {
    if (!disk.swapEnabled) return '';

    const maxSwapSize = Math.floor(disk.size / 3);
    const swapSize = Number(disk.swapSize);

    if (maxSwapSize < 1) {
      return '当前数据盘容量不足以开启 SWAP';
    }

    if (!disk.swapSize || !Number.isInteger(swapSize) || swapSize < 1 || swapSize > maxSwapSize) {
      return `SWAP 大小需为 1-${maxSwapSize} GB，且不得超过数据盘容量的 1/3`;
    }

    return '';
  };

  const handleDataDiskSizeChange = (size: number) => {
    setDataDisk((current) => {
      if (!current) return current;

      const next = { ...current, size };
      setSwapSizeError(validateSwapSize(next));
      return next;
    });
  };

  const handleSwapEnabledChange = (swapEnabled: boolean) => {
    setDataDisk((current) => {
      if (!current) return current;

      const next = { ...current, swapEnabled };
      setSwapSizeError(validateSwapSize(next));
      return next;
    });
  };

  const handleSwapSizeChange = (swapSize: string) => {
    setDataDisk((current) => {
      if (!current) return current;

      const next = { ...current, swapSize };
      setSwapSizeError(validateSwapSize(next));
      return next;
    });
  };

  const handleAddDataDisk = () => {
    if (dataDisk) return;

    setDataDisk({
      type: '高效云盘',
      size: 200,
      deleteWithInstance: true,
      swapEnabled: false,
      swapSize: '',
    });
  };

  const handleRemoveDataDisk = () => {
    setDataDisk(null);
    setSwapSizeError('');
  };

  const handleNext = () => {
    if (currentStep === 3 && dataDisk) {
      const error = validateSwapSize(dataDisk);
      setSwapSizeError(error);

      if (error) return;
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      onNext();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* 面包屑导航区域 */}
      <div className="flex items-center justify-between h-14 px-6 text-sm text-gray-600 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span>产品团队-专用</span>
          <span className="text-gray-400">{'>'}</span>
          <span>stark测试</span>
          <span className="text-gray-400">{'>'}</span>
          <span className="text-gray-900 font-medium">独享集群</span>
        </div>
        <a href="#" className="text-blue-600 hover:underline">
          CIS帮助文档
        </a>
      </div>

      {/* 内容区域 */}
      <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50">
        {/* 步骤导航 */}
        <div className="relative px-6 py-4 bg-white border-b border-gray-200">
          {/* 返回列表按钮 */}
          <button
            onClick={onCancel}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-sm text-blue-600 hover:text-blue-700"
          >
            返回列表
          </button>
          
          {/* 步骤指示器 */}
          <div className="flex items-center justify-center gap-4">
            {/* 步骤1：基本信息 */}
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 1 ? 'bg-blue-600 text-white' : 
                currentStep > 1 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {currentStep > 1 ? '✓' : '1'}
              </div>
              <span className={`text-sm font-medium ${
                currentStep === 1 ? 'text-blue-600' : 'text-gray-500'
              }`}>基本信息</span>
            </div>
            
            {/* 箭头 */}
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            
            {/* 步骤2：集群配置 */}
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 2 ? 'bg-blue-600 text-white' : 
                currentStep > 2 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {currentStep > 2 ? '✓' : '2'}
              </div>
              <span className={`text-sm font-medium ${
                currentStep === 2 ? 'text-blue-600' : 'text-gray-500'
              }`}>集群配置</span>
            </div>
            
            {/* 箭头 */}
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            
            {/* 步骤3：节点配置 */}
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 3 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                3
              </div>
              <span className={`text-sm font-medium ${
                currentStep === 3 ? 'text-blue-600' : 'text-gray-500'
              }`}>节点配置</span>
            </div>
          </div>
        </div>

        {/* 第1步：基本信息 */}
        {currentStep === 1 && (
          <div className="p-6 bg-white mx-6 mt-6 rounded border border-gray-200">
            <div className="max-w-2xl">
              {/* 地域 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <span className="text-red-500">*</span>地域:
                </label>
                <div className="flex gap-4">
                  {regions.map((r) => (
                    <label key={r.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="region"
                        value={r.id}
                        checked={region === r.id}
                        onChange={(e) => setRegion(e.target.value)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 可用区 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <span className="text-red-500">*</span>可用区:
                </label>
                <div className="flex gap-4">
                  {zones.map((z) => (
                    <label key={z.id} className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                      <input
                        type="radio"
                        name="zone"
                        value={z.id}
                        checked={zone === z.id}
                        onChange={(e) => setZone(e.target.value)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{z.label}</span>
                      {z.recommended && (
                        <span className="px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded">推荐</span>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* 集群名称 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-red-500">*</span>集群名称
                </label>
                <input
                  type="text"
                  value={clusterName}
                  onChange={(e) => setClusterName(e.target.value)}
                  placeholder="请输入集群名称"
                  className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  1-63字符，只能以字母开头，以字母数字结尾，可包含数字、小写字母、中划线
                </p>
              </div>

              {/* 集群中文名称 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-red-500">*</span>集群中文名称
                </label>
                <input
                  type="text"
                  value={clusterNameCN}
                  onChange={(e) => setClusterNameCN(e.target.value)}
                  placeholder="请输入集群中文名称"
                  className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  1-63个字符，可包含数字、汉字、英文字符或中划线
                </p>
              </div>

              {/* Kubernetes版本 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-red-500">*</span>Kubernetes版本
                </label>
                <select
                  value={k8sVersion}
                  onChange={(e) => setK8sVersion(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  {k8sVersions.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 容器运行时 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  容器运行时
                </label>
                <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded text-sm inline-block">
                  Containerd 1.6.32
                </div>
              </div>

              {/* 网络类型 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-red-500">*</span>网络类型
                </label>
                <select
                  value={networkType}
                  onChange={(e) => setNetworkType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  {networkTypes.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* VPC网络 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-red-500">*</span>VPC网络
                </label>
                <select
                  value={vpcNetwork}
                  onChange={(e) => setVpcNetwork(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  {vpcNetworks.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 子网（Pod网络） */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-red-500">*</span>子网（Pod网络）
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={subnet}
                    onChange={(e) => setSubnet(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    {subnets.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <p className="text-xs text-gray-500">
                    子网统一由Hulk平台分配，无可用网络，
                  </p>
                  <a href="#" className="text-xs text-blue-600 hover:underline">
                    去申请
                  </a>
                </div>
              </div>

              {/* 单节点Pod数量 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  单节点Pod数量
                </label>
                <select
                  value={podLimit}
                  onChange={(e) => setPodLimit(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  {podLimits.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 安全组策略 */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  安全组策略
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={securityGroup}
                    onChange={(e) => setSecurityGroup(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    {securityGroups.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <p className="text-xs text-gray-500">
                    安全组由Hulk平台管理，
                  </p>
                  <a href="#" className="text-xs text-blue-600 hover:underline">
                    去申请
                  </a>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  为您的集群Node节点配置安全组规则，此安全组规则将对集群内节点生效，如您需对安全组有额外诉求，您可以到安全组界面配置
                </p>
              </div>

              {/* 底部按钮 */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={onCancel}
                  className="px-6 py-2 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleNext}
                  className="px-6 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  下一步
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 第2步：集群配置 */}
        {currentStep === 2 && (
          <div className="p-6 bg-white mx-6 mt-6 rounded border border-gray-200">
            <div className="max-w-3xl">
              {/* Master模式 */}
              <div className="mb-8 pb-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-medium text-gray-900">
                    <span className="text-red-500">*</span> Master模式
                  </h3>
                  <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                    托管Master
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  默认托管三副本Master，保证集群高可用，创建至少1个Worker节点即可使用
                </p>
              </div>

              {/* 选择使用存储 */}
              <div className="mb-8 pb-6 border-b border-gray-200">
                <h3 className="text-base font-medium text-gray-900 mb-4">
                  选择使用存储
                </h3>
                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sharedStorage}
                      onChange={(e) => setSharedStorage(e.target.checked)}
                      className="w-4 h-4 mt-0.5 text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <div>
                      <span className="text-sm text-gray-700">共享存储（PoleFS）</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dynamicLocalDisk}
                      onChange={(e) => setDynamicLocalDisk(e.target.checked)}
                      className="w-4 h-4 mt-0.5 text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">动态本地盘（OpenLocal）</span>
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 010-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </label>
                </div>
              </div>

              {/* Ingress */}
              <div className="mb-8 pb-6 border-b border-gray-200">
                <h3 className="text-base font-medium text-gray-900 mb-4">
                  Ingress
                </h3>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={installIngress}
                    onChange={(e) => setInstallIngress(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <div>
                    <span className="text-sm text-gray-700">安装IngressNginx</span>
                    <p className="mt-1 text-xs text-gray-500">
                      集群外部流量7层负载均衡，通过域名或者访问路径来路由到不同Service上，从而达到7层的负载均衡。如果不安装，无法使用Ingress功能。
                    </p>
                  </div>
                </label>
              </div>

              {/* 负载均衡 */}
              <div className="mb-8 pb-6 border-b border-gray-200">
                <h3 className="text-base font-medium text-gray-900 mb-4">
                  负载均衡
                </h3>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={installLoadBalancer}
                    onChange={(e) => setInstallLoadBalancer(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <div>
                    <span className="text-sm text-gray-700">安装Loadbalancer</span>
                    <p className="mt-1 text-xs text-gray-500">
                      集群外部流量4层负载均衡，通过VIP进行访问，通过轮询、ip hash、最小连接数来路由到后端，实现负载均衡。如果不安装，无法使用负载均衡功能。
                    </p>
                  </div>
                </label>
              </div>

              {/* 日志服务 */}
              <div className="mb-8 pb-6 border-b border-gray-200">
                <h3 className="text-base font-medium text-gray-900 mb-4">
                  日志服务
                </h3>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={installArkit}
                    onChange={(e) => setInstallArkit(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <div>
                    <span className="text-sm text-gray-700">安装Arkit</span>
                    <p className="mt-1 text-xs text-gray-500">
                      日志采集使用云舟的Arkit，如果不安装，无法使用日志采集功能。
                    </p>
                  </div>
                </label>
              </div>

              {/* 监控服务 */}
              <div className="mb-8 pb-6 border-b border-gray-200">
                <h3 className="text-base font-medium text-gray-900 mb-4">
                  监控服务
                </h3>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={installMonitor}
                    onChange={(e) => setInstallMonitor(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <div>
                    <span className="text-sm text-gray-700">安装Monitor</span>
                    <p className="mt-1 text-xs text-gray-500">
                      Prometheus监控，提供集群、容器运维所需的基础监控大盘和告警功能。如果不安装，无法查看监控和使用告警功能。
                    </p>
                  </div>
                </label>
              </div>

              {/* 视图隔离 */}
              <div className="mb-8 pb-6 border-b border-gray-200">
                <h3 className="text-base font-medium text-gray-900 mb-4">
                  视图隔离
                </h3>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={installLxcfs}
                    onChange={(e) => setInstallLxcfs(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <div>
                    <span className="text-sm text-gray-700">安装Lxcfs</span>
                    <p className="mt-1 text-xs text-gray-500">
                      用于容器资源视图隔离，安装后使用命令查询资源时查看的是本容器的资源，如果不安装，查看到的是宿主机的资源。
                    </p>
                  </div>
                </label>
              </div>

              {/* 弹性伸缩 */}
              <div className="mb-8 pb-6 border-b border-gray-200">
                <h3 className="text-base font-medium text-gray-900 mb-4">
                  弹性伸缩
                </h3>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={installAutoscaler}
                    onChange={(e) => setInstallAutoscaler(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <div>
                    <span className="text-sm text-gray-700">安装Autoscaler</span>
                    <p className="mt-1 text-xs text-gray-500">
                      用于集群节点自动扩容和缩容，如果不安装，无法使用弹性伸缩功能。
                    </p>
                  </div>
                </label>
              </div>

              {/* Pod原地升级 */}
              <div className="mb-8 pb-6 border-b border-gray-200">
                <h3 className="text-base font-medium text-gray-900 mb-4">
                  Pod原地升级
                </h3>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={installCloneset}
                    onChange={(e) => setInstallCloneset(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <div>
                    <span className="text-sm text-gray-700">安装cloneset</span>
                    <p className="mt-1 text-xs text-gray-500">
                      用户Pod原地升级，可保持名称、IP、挂载盘等不改变
                    </p>
                  </div>
                </label>
              </div>

              {/* 安全容器 */}
              <div className="mb-8 pb-6 border-b border-gray-200">
                <h3 className="text-base font-medium text-gray-900 mb-4">
                  安全容器
                </h3>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={installKata}
                    onChange={(e) => setInstallKata(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <div>
                    <span className="text-sm text-gray-700">安装Kata</span>
                    <p className="mt-1 text-xs text-gray-500">
                      用于Pod间内核隔离，保障容器运行更安全
                    </p>
                  </div>
                </label>
              </div>

              {/* 高级配置 */}
              <div className="mb-8">
                <button
                  onClick={() => setShowAdvancedConfig(!showAdvancedConfig)}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                >
                  <span>高级配置</span>
                  <svg className={`w-4 h-4 transition-transform ${showAdvancedConfig ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* 高级配置展开内容 */}
                {showAdvancedConfig && (
                  <div className="mt-6 border border-gray-200 rounded">
                    {/* 标签页 */}
                    <div className="flex border-b border-gray-200">
                      <button
                        onClick={() => setAdvancedTab('control')}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                          advancedTab === 'control'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        控制面组件
                      </button>
                      <button
                        onClick={() => setAdvancedTab('node')}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                          advancedTab === 'node'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        节点组件
                      </button>
                    </div>

                    {/* 控制面组件内容 */}
                    {advancedTab === 'control' && (
                      <div className="p-6">
                        {/* 警告提示 */}
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
                          <p className="text-sm text-blue-800">
                            请谨慎修改master相关参数例如enable-aggregator-routing、cluster-cidr等参数，如有需要建议按照官方文档进行修改或联系值班人员。
                          </p>
                        </div>

                        {/* APIServer参数 */}
                        <div className="mb-8">
                          <h4 className="text-base font-medium text-gray-900 mb-4">APIServer参数</h4>
                          <div className="border border-gray-200 rounded">
                            {/* 表头 */}
                            <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-600">
                              <div className="col-span-3">名称</div>
                              <div className="col-span-3">值（默认值）</div>
                              <div className="col-span-5">说明</div>
                              <div className="col-span-1">操作</div>
                            </div>
                            
                            {/* 参数列表 */}
                            {apiServerParams.map((param, index) => (
                              <div key={index} className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-200 items-center">
                                <div className="col-span-3">
                                  <input
                                    type="text"
                                    value={param.name}
                                    onChange={(e) => handleUpdateParam('api', index, 'name', e.target.value)}
                                    placeholder="参数名称"
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                                  />
                                </div>
                                <div className="col-span-3">
                                  <input
                                    type="text"
                                    value={param.value}
                                    onChange={(e) => handleUpdateParam('api', index, 'value', e.target.value)}
                                    placeholder="参数值"
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                                  />
                                </div>
                                <div className="col-span-5">
                                  <input
                                    type="text"
                                    value={param.description || ''}
                                    onChange={(e) => handleUpdateParam('api', index, 'description', e.target.value)}
                                    placeholder="参数说明"
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                                  />
                                </div>
                                <div className="col-span-1">
                                  <button
                                    onClick={() => handleRemoveParam('api', index)}
                                    className="text-red-600 hover:text-red-700 text-xs"
                                  >
                                    删除
                                  </button>
                                </div>
                              </div>
                            ))}
                            
                            {/* 添加按钮 */}
                            <div className="px-4 py-2">
                              <button
                                onClick={() => handleAddParam('api')}
                                className="text-sm text-blue-600 hover:text-blue-700"
                              >
                                + 添加
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Controller参数 */}
                        <div className="mb-8">
                          <h4 className="text-base font-medium text-gray-900 mb-4">Controller参数</h4>
                          <div className="border border-gray-200 rounded">
                            {/* 表头 */}
                            <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-600">
                              <div className="col-span-3">名称</div>
                              <div className="col-span-3">值（默认值）</div>
                              <div className="col-span-5">说明</div>
                              <div className="col-span-1">操作</div>
                            </div>
                            
                            {/* 参数列表 */}
                            {controllerParams.length === 0 ? (
                              <div className="px-4 py-8 text-center text-sm text-gray-500">
                                暂无配置参数
                              </div>
                            ) : (
                              controllerParams.map((param, index) => (
                                <div key={index} className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-200 items-center">
                                  <div className="col-span-3">
                                    <input
                                      type="text"
                                      value={param.name}
                                      onChange={(e) => handleUpdateParam('controller', index, 'name', e.target.value)}
                                      placeholder="参数名称"
                                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                                    />
                                  </div>
                                  <div className="col-span-3">
                                    <input
                                      type="text"
                                      value={param.value}
                                      onChange={(e) => handleUpdateParam('controller', index, 'value', e.target.value)}
                                      placeholder="参数值"
                                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                                    />
                                  </div>
                                  <div className="col-span-5">
                                    <input
                                      type="text"
                                      value={param.description || ''}
                                      onChange={(e) => handleUpdateParam('controller', index, 'description', e.target.value)}
                                      placeholder="参数说明"
                                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                                    />
                                  </div>
                                  <div className="col-span-1">
                                    <button
                                      onClick={() => handleRemoveParam('controller', index)}
                                      className="text-red-600 hover:text-red-700 text-xs"
                                    >
                                      删除
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                            
                            {/* 添加按钮 */}
                            <div className="px-4 py-2">
                              <button
                                onClick={() => handleAddParam('controller')}
                                className="text-sm text-blue-600 hover:text-blue-700"
                              >
                                + 添加
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Scheduler参数 */}
                        <div className="mb-8">
                          <h4 className="text-base font-medium text-gray-900 mb-4">Scheduler参数</h4>
                          <div className="border border-gray-200 rounded">
                            {/* 表头 */}
                            <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-600">
                              <div className="col-span-3">名称</div>
                              <div className="col-span-3">值（默认值）</div>
                              <div className="col-span-5">说明</div>
                              <div className="col-span-1">操作</div>
                            </div>
                            
                            {/* 参数列表 */}
                            {schedulerParams.length === 0 ? (
                              <div className="px-4 py-8 text-center text-sm text-gray-500">
                                暂无配置参数
                              </div>
                            ) : (
                              schedulerParams.map((param, index) => (
                                <div key={index} className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-200 items-center">
                                  <div className="col-span-3">
                                    <input
                                      type="text"
                                      value={param.name}
                                      onChange={(e) => handleUpdateParam('scheduler', index, 'name', e.target.value)}
                                      placeholder="参数名称"
                                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                                    />
                                  </div>
                                  <div className="col-span-3">
                                    <input
                                      type="text"
                                      value={param.value}
                                      onChange={(e) => handleUpdateParam('scheduler', index, 'value', e.target.value)}
                                      placeholder="参数值"
                                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                                    />
                                  </div>
                                  <div className="col-span-5">
                                    <input
                                      type="text"
                                      value={param.description || ''}
                                      onChange={(e) => handleUpdateParam('scheduler', index, 'description', e.target.value)}
                                      placeholder="参数说明"
                                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                                    />
                                  </div>
                                  <div className="col-span-1">
                                    <button
                                      onClick={() => handleRemoveParam('scheduler', index)}
                                      className="text-red-600 hover:text-red-700 text-xs"
                                    >
                                      删除
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                            
                            {/* 添加按钮 */}
                            <div className="px-4 py-2">
                              <button
                                onClick={() => handleAddParam('scheduler')}
                                className="text-sm text-blue-600 hover:text-blue-700"
                              >
                                + 添加
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* 控制面组件日志 */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between py-4 border-t border-gray-200">
                            <div>
                              <h4 className="text-base font-medium text-gray-900 mb-1">控制面组件日志</h4>
                              <p className="text-xs text-gray-500">
                                用于控制是否开启控制面组件的日志采集/记录功能
                              </p>
                            </div>
                            <button
                              onClick={() => setControlPlaneLogEnabled(!controlPlaneLogEnabled)}
                              className={`w-12 h-6 rounded-full relative transition-colors ${
                                controlPlaneLogEnabled ? 'bg-blue-600' : 'bg-gray-300'
                              }`}
                            >
                              <span
                                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                  controlPlaneLogEnabled ? 'left-7' : 'left-1'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 节点组件内容 */}
                    {advancedTab === 'node' && (
                      <div className="p-6">
                        <div className="text-center py-12 text-sm text-gray-500">
                          节点组件配置功能开发中...
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 底部按钮 */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={onCancel}
                  className="px-6 py-2 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handlePrevious}
                  className="px-6 py-2 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  上一步
                </button>
                <button
                  onClick={handleNext}
                  className="px-6 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  下一步
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 第3步：节点配置 */}
        {currentStep === 3 && (
          <div className="p-6 bg-white mx-6 mt-6 rounded border border-gray-200">
            <div className="max-w-6xl">
              <h2 className="text-lg font-bold text-gray-900 mb-6">节点配置</h2>
              
              {/* 基础配置 */}
              <div className="mb-8 pb-6 border-b border-gray-200">
                <div className="space-y-6">
                  {/* 节点创建方式 */}
                  <div className="flex items-center gap-4">
                    <div className="w-28 text-right text-sm font-medium text-gray-700">
                      节点创建方式
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-6 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                        新建节点
                      </button>
                    </div>
                  </div>

                  {/* 节点类型 */}
                  <div className="flex items-start gap-4">
                    <div className="w-28 pt-1 text-right text-sm font-medium text-gray-700">
                      <span className="text-red-500">*</span>节点类型
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setNodeType('vm')}
                        className={`px-4 py-2 text-sm rounded-l transition-colors ${
                          nodeType === 'vm'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 border border-gray-300'
                        }`}
                      >
                        虚拟机
                      </button>
                      <button
                        onClick={() => setNodeType('baremetal')}
                        className={`px-4 py-2 text-sm rounded-r transition-colors ${
                          nodeType === 'baremetal'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 border border-gray-300'
                        }`}
                      >
                        裸金属
                      </button>
                    </div>
                  </div>

                  {/* 节点子网 */}
                  <div className="flex items-start gap-4">
                    <div className="w-28 pt-1 text-right text-sm font-medium text-gray-700">
                      <span className="text-red-500">*</span>节点子网
                    </div>
                    <div className="flex-1">
                      <select
                        value={nodeSubnet}
                        onChange={(e) => setNodeSubnet(e.target.value)}
                        className="w-64 px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                      >
                        <option value="11.51.176.0/22">11.51.176.0/22（可用IP：861）</option>
                      </select>
                      <div className="mt-2 text-xs text-gray-500">
                        子网统一由Hulk平台分配，无可用网络，
                        <a href="#" className="text-blue-600 hover:underline ml-1">
                          去申请
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* 筛选 */}
                  <div className="flex items-start gap-4">
                    <div className="w-28 pt-1 text-right text-sm font-medium text-gray-700">
                      筛选
                    </div>
                    <div className="flex items-center gap-4">
                      <select
                        value={vcpuFilter}
                        onChange={(e) => setVcpuFilter(e.target.value)}
                        className="w-32 px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
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
                        className="w-32 px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
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
                  <div className="flex items-start gap-4">
                    <div className="w-28 pt-1 text-right text-sm font-medium text-gray-700">
                      <span className="text-red-500">*</span>分类
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-x-6 gap-y-3">
                        <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                          <input
                            type="radio"
                            name="category"
                            value="compute"
                            checked={category === 'compute'}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">计算型（独享CPU）</span>
                          <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 010-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                          </svg>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                          <input
                            type="radio"
                            name="category"
                            value="general"
                            checked={category === 'general'}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">通用型（独享CPU）</span>
                          <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 010-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                          </svg>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                          <input
                            type="radio"
                            name="category"
                            value="memory"
                            checked={category === 'memory'}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">内存型（独享CPU）</span>
                          <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 010-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                          </svg>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                          <input
                            type="radio"
                            name="category"
                            value="local-ssd"
                            checked={category === 'local-ssd'}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">本地SSD型（独享CPU）</span>
                          <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 010-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                          </svg>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                          <input
                            type="radio"
                            name="category"
                            value="local-hdd"
                            checked={category === 'local-hdd'}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">本地HDD型（独享CPU）</span>
                          <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 010-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                          </svg>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                          <input
                            type="radio"
                            name="category"
                            value="shared"
                            checked={category === 'shared'}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">共享型（共享CPU）</span>
                          <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 010-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                          </svg>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                          <input
                            type="radio"
                            name="category"
                            value="gpu"
                            checked={category === 'gpu'}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">GPU独享型（独享CPU）</span>
                          <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 010-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                          </svg>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 提示信息 */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-blue-800">
                    如果只添加一个节点，建议节点规格选择大于4C8G，因集群系统组件会占用一些资源，以确保集群正常运行。
                  </p>
                </div>
              </div>
              
              {/* 实例规格选择 */}
              <div className="mb-8">
                <h3 className="text-base font-medium text-gray-900 mb-4">实例规格</h3>
                <div className="border border-gray-200 rounded overflow-hidden">
                  {/* 表头 */}
                  <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-600">
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
                  
                  {/* 规格列表 */}
                  {instanceSpecs.map((spec) => (
                    <div key={spec.id} className="grid grid-cols-12 gap-4 px-4 py-4 border-b border-gray-200 items-center hover:bg-gray-50">
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
                      <div className="col-span-1 text-sm text-red-600 font-medium">{spec.discountPrice.toFixed(3)}</div>
                      <div className="col-span-2">
                        <input
                          type="radio"
                          name="spec"
                          value={spec.id}
                          checked={selectedSpec === spec.id}
                          onChange={(e) => setSelectedSpec(e.target.value)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* 规格说明 */}
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-800">
                    系统盘盘符为sda，使用高效云盘，用于存储操作系统数据；数据盘盘符为sdb，可使用1块高效云盘，用于存储pod标准输出日志
                  </p>
                </div>
              </div>

              {/* 存储配置 */}
              <div className="mb-8 pb-6 border-b border-gray-200">
                <h3 className="text-base font-medium text-gray-900 mb-4">存储配置</h3>
                
                {/* 系统盘 */}
                <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
                  <label className="shrink-0 text-sm font-medium text-gray-700 md:w-24 md:pt-2">
                    <span className="text-red-500">*</span>系统盘
                  </label>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-4">
                      <select
                        value={systemDiskType}
                        onChange={(e) => setSystemDiskType(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                      >
                        <option value="高效云盘">高效云盘</option>
                      </select>
                      <input
                        type="number"
                        value={systemDiskSize}
                        onChange={(e) => setSystemDiskSize(Number(e.target.value))}
                        className="w-24 px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-500">GB</span>
                      <span className="text-sm text-gray-500">（2800 IOPS）</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">用于存储节点的操作系统数据</p>
                  </div>
                </div>
                
                {/* 数据盘 */}
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
                  <label className="shrink-0 text-sm font-medium text-gray-700 md:w-24 md:pt-2">
                    数据盘
                  </label>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-gray-500">
                    已添加 {dataDisk ? 1 : 0} 个数据盘，还可以添加 {dataDisk ? 0 : 1} 个
                  </div>
                  {dataDisk ? (
                    <div className="mt-3 space-y-3">
                      <div className="flex flex-wrap items-center gap-4">
                      <select
                        value={dataDisk.type}
                        onChange={(e) => setDataDisk((current) => current ? {
                          ...current,
                          type: e.target.value as DataDiskConfig['type'],
                        } : current)}
                        className="px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                      >
                        <option value="高效云盘">高效云盘</option>
                      </select>
                      <input
                        type="number"
                        value={dataDisk.size}
                        onChange={(e) => handleDataDiskSizeChange(Number(e.target.value))}
                        className="w-24 px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-500">GB</span>
                      <span className="text-sm text-gray-500">（2800 IOPS）</span>
                      <div className="flex items-center gap-2">
                        <input
                          id="delete-data-disk-with-instance"
                          type="checkbox"
                          checked={dataDisk.deleteWithInstance}
                          onChange={(e) => setDataDisk((current) => current ? {
                            ...current,
                            deleteWithInstance: e.target.checked,
                          } : current)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="delete-data-disk-with-instance" className="text-sm text-gray-700">
                          随实例释放
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveDataDisk}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        删除
                      </button>
                      </div>
                  </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAddDataDisk}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                    >
                      + 添加数据盘
                    </button>
                  )}
                  </div>
                </div>

                {/* 开启 SWAP */}
                <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
                  <label className="shrink-0 text-sm font-medium text-gray-700 md:w-24 md:pt-2">
                    开启 SWAP
                  </label>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <label className={`flex items-center gap-2 ${dataDisk ? 'cursor-pointer' : 'cursor-not-allowed text-gray-400'}`}>
                        <input
                          type="checkbox"
                          checked={dataDisk?.swapEnabled ?? false}
                          disabled={!dataDisk}
                          onChange={(e) => handleSwapEnabledChange(e.target.checked)}
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
                            onChange={(e) => handleSwapSizeChange(e.target.value)}
                            aria-invalid={Boolean(swapSizeError)}
                            aria-describedby={swapSizeError ? 'swap-size-error' : undefined}
                            className={`w-24 px-4 py-2 border rounded text-sm focus:outline-none focus:ring-1 ${swapSizeError
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                            }`}
                          />
                          <span className="text-sm text-gray-500">GB</span>
                          <span className="text-xs text-gray-500">
                            最大 {Math.floor(dataDisk.size / 3)} GB（数据盘容量的 1/3）
                          </span>
                        </>
                      )}
                      {!dataDisk && (
                        <span className="text-xs text-gray-400">请先添加数据盘后配置 SWAP</span>
                      )}
                    </div>
                    {dataDisk?.swapEnabled && swapSizeError && (
                      <p id="swap-size-error" className="mt-1 text-xs text-red-600">
                        {swapSizeError}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* 系统与节点基础配置 */}
              <div className="mb-8 pb-6 border-b border-gray-200">
                <h3 className="text-base font-medium text-gray-900 mb-4">系统与节点基础配置</h3>

                <div className="space-y-6">
                {/* 操作系统 */}
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
                  <label className="shrink-0 text-sm font-medium text-gray-700 md:w-24 md:pt-2">
                    操作系统
                  </label>
                  <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-6 mb-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="osType"
                        value="default"
                        checked={osType === 'default'}
                        onChange={() => setOsType('default')}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">默认</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="osType"
                        value="custom"
                        checked={osType === 'custom'}
                        onChange={() => setOsType('custom')}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">自定义</span>
                    </label>
                  </div>

                  {osType === 'default' ? (
                    <div className="px-4 py-2 bg-gray-50 text-sm text-gray-700 rounded inline-block">
                      AnolisOS-8.2-QU1-x86_64-ANCK-2.5
                    </div>
                  ) : (
                    <div className="space-y-4 max-w-2xl">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">云服务器项目</label>
                        <select
                          value={cloudServerProject}
                          onChange={(e) => setCloudServerProject(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                        >
                          {cloudServerProjects.map((project) => (
                            <option key={project.id} value={project.id}>
                              {project.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">选择镜像</label>
                        <select
                          value={customImage}
                          onChange={(e) => setCustomImage(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                        >
                          {customImages.map((image) => (
                            <option key={image.id} value={image.id}>
                              {image.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                  </div>
                </div>

                {/* 节点数量 */}
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
                  <label className="shrink-0 text-sm font-medium text-gray-700 md:w-24 md:pt-2">
                    节点数量
                  </label>
                  <div className="min-w-0 flex flex-1 flex-wrap items-center gap-4">
                    <input
                      type="number"
                      value={nodeCount}
                      onChange={(e) => setNodeCount(Number(e.target.value))}
                      className="w-24 px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-500">台</span>
                    <span className="text-sm text-red-500">当前规格最多可创建100台</span>
                  </div>
                </div>
                
                {/* 主机名称 */}
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
                  <label className="shrink-0 text-sm font-medium text-gray-700 md:w-24 md:pt-2">
                    主机名称
                  </label>
                  <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="hostname"
                        value="random"
                        checked={hostnameType === 'random'}
                        onChange={() => setHostnameType('random')}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">随机主机名</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="hostname"
                        value="custom"
                        checked={hostnameType === 'custom'}
                        onChange={() => setHostnameType('custom')}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">自定义主机名</span>
                    </label>
                  </div>
                  </div>
                </div>

                {/* 标签 */}
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
                  <label className="shrink-0 text-sm font-medium text-gray-700 md:w-24 md:pt-2">
                    标签
                  </label>
                  <div className="min-w-0 flex-1">
                  {tags.length === 0 ? (
                    <button className="text-sm text-blue-600 hover:text-blue-700">
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
                            className="w-32 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                          />
                          <input
                            type="text"
                            value={tag.value}
                            placeholder="值"
                            className="w-32 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                          />
                          <button className="text-red-600 hover:text-red-700 text-sm">删除</button>
                        </div>
                      ))}
                      <button className="text-sm text-blue-600 hover:text-blue-700">
                        + 添加
                      </button>
                    </div>
                  )}
                  <p className="mt-1 text-xs text-gray-500">用于资源分类、检索</p>
                  </div>
                </div>
                </div>
              </div>

              {/* 底部按钮和成本预估 */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  <span className="font-medium">成本预估:</span> 
                  <span className="text-red-600 font-medium ml-2">¥ {calculateCost().toFixed(5)} 元/月</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={onCancel}
                    className="px-6 py-2 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handlePrevious}
                    className="px-6 py-2 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    上一步
                  </button>
                  <button
                    onClick={onNext}
                    className="px-6 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    提交
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
