'use client';

import { useState } from 'react';

interface DeploymentInitialData {
  name?: string;
  versionName?: string;
  releaseNote?: string;
}

interface CreateDeploymentProps {
  mode?: 'create' | 'edit';
  initialData?: DeploymentInitialData;
  onBack?: () => void;
  onNext?: () => void;
  onCancel?: () => void;
}

interface ClusterItem {
  name: string;
  type: 'public' | 'dedicated';
  replicas: number;
  hostGroup: string;
  runtime: string;
  resource: string;
  selected: boolean;
}

interface HostAliasItem {
  ip: string;
  hostname: string;
}

export default function CreateDeployment({ mode = 'create', initialData, onBack, onNext, onCancel }: CreateDeploymentProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const isEdit = mode === 'edit';
  const [formData, setFormData] = useState({
    name: initialData?.name ?? 'zxtest-',
    versionName: initialData?.versionName ?? 'V1',
    releaseNote: initialData?.releaseNote ?? '',
    inPlaceUpgrade: false,
    networkType: 'classic' as 'classic' | 'vpc',
    regions: ['beijing'] as string[],
    availabilityZones: ['bjpgdc'] as string[],
    // Step 2 fields
    jobType: 'ls' as string,
    containerName: 'container1' as string,
    containerType: 'standard' as string,
    imageRegistry: 'basic' as string,
    imageRepo: 'library/nginx' as string,
    imageTag: '1.25-alpine-ipv6toa' as string,
    imagePullPolicy: 'IfNotPresent' as string,
    resourceConfig: 'default' as string,
    cpu: '0.5' as string,
    memory: '1Gi' as string,
    disk: '' as string,
  });

  const [showMoreConfig, setShowMoreConfig] = useState(false);
  const [showAdvancedConfig, setShowAdvancedConfig] = useState(false);
  const [moreConfigTab, setMoreConfigTab] = useState('health');
  const [advancedConfigTab, setAdvancedConfigTab] = useState('nodeAffinity');
  const [hostAliases, setHostAliases] = useState<HostAliasItem[]>([
    { ip: '10.10.10.100', hostname: 'api.example.com' },
    { ip: '', hostname: 'test.example.com' },
  ]);

  const [clusters, setClusters] = useState<ClusterItem[]>([
    { name: 'pub-bjpdc', type: 'public', replicas: 1, hostGroup: 'default(默认主机组)', runtime: '', resource: '986C,1972G', selected: true },
    { name: 'wjwtest-temp-0330', type: 'dedicated', replicas: 1, hostGroup: 'default(默认主机组)', runtime: '', resource: '0C,0G', selected: false },
    { name: 'wjwtest-0421-01', type: 'dedicated', replicas: 1, hostGroup: 'default(默认主机组)', runtime: '', resource: '10C,22G', selected: false },
  ]);

  const steps = [
    { id: 1, label: '基本信息' },
    { id: 2, label: '部署配置' },
    { id: 3, label: '确认' },
  ];

  const regions = [
    { id: 'beijing', label: '北京' },
    { id: 'frankfurt', label: '德国（法兰克福）' },
    { id: 'singapore', label: '新加坡' },
    { id: 'beijingzp', label: '北京中鹏云' },
    { id: 'shanghai', label: '上海' },
    { id: 'zhengzhou', label: '郑州' },
  ];

  const availabilityZones = [
    { id: 'bjpgdc', label: 'bjpgdc(北京联通25G)', recommended: true },
    { id: 'alicn', label: 'alicn(北京阿里云)', recommended: false },
    { id: 'bjcm', label: 'bjcm(北京移动)', recommended: false },
    { id: 'bjmd', label: 'bjmd(北京联通)', recommended: false },
    { id: 'bjwdt', label: 'bjwdt(北京电信25G-特价)', recommended: false },
    { id: 'bjzdt', label: 'bjzdt(北京电信25G)', recommended: false },
  ];

  const updateFormData = (field: string, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleRegion = (regionId: string) => {
    setFormData((prev) => ({
      ...prev,
      regions: prev.regions.includes(regionId)
        ? prev.regions.filter((r) => r !== regionId)
        : [...prev.regions, regionId],
    }));
  };

  const toggleAvailabilityZone = (zoneId: string) => {
    setFormData((prev) => ({
      ...prev,
      availabilityZones: prev.availabilityZones.includes(zoneId)
        ? prev.availabilityZones.filter((z) => z !== zoneId)
        : [...prev.availabilityZones, zoneId],
    }));
  };

  const selectAllZones = () => {
    if (formData.availabilityZones.length === availabilityZones.length) {
      setFormData((prev) => ({ ...prev, availabilityZones: [] }));
    } else {
      setFormData((prev) => ({ ...prev, availabilityZones: availabilityZones.map((z) => z.id) }));
    }
  };

  const toggleCluster = (index: number) => {
    setClusters((prev) =>
      prev.map((c, i) => (i === index ? { ...c, selected: !c.selected } : c))
    );
  };

  const updateClusterReplicas = (index: number, replicas: number) => {
    setClusters((prev) =>
      prev.map((c, i) => (i === index ? { ...c, replicas } : c))
    );
  };

  const updateClusterHostGroup = (index: number, hostGroup: string) => {
    setClusters((prev) =>
      prev.map((c, i) => (i === index ? { ...c, hostGroup } : c))
    );
  };

  const updateClusterRuntime = (index: number, runtime: string) => {
    setClusters((prev) =>
      prev.map((c, i) => (i === index ? { ...c, runtime } : c))
    );
  };

  const updateHostAlias = (index: number, field: keyof HostAliasItem, value: string) => {
    setHostAliases((prev) => prev.map((item, itemIndex) => (
      itemIndex === index ? { ...item, [field]: value } : item
    )));
  };

  const addHostAlias = () => {
    setHostAliases((prev) => [...prev, { ip: '', hostname: '' }]);
  };

  const removeHostAlias = (index: number) => {
    setHostAliases((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const selectedClusterCount = clusters.filter((c) => c.selected).length;

  return (
    <div className="h-full flex flex-col">
      {/* 面包屑 + 帮助 */}
      <div className="h-14 flex items-center justify-between px-5 border-b border-[#E6E6E6] flex-shrink-0">
        <div className="flex items-center text-sm text-[#666666]">
          <span className="text-[#0066FF] cursor-pointer hover:underline">stark测试</span>
          <span className="mx-2">&gt;</span>
          <span className="text-[#0066FF] cursor-pointer hover:underline">zxtest</span>
          <span className="mx-2">&gt;</span>
          <span className="text-[#0066FF] cursor-pointer hover:underline">Deployment</span>
        </div>
        <a href="#" className="text-[#0066FF] text-sm hover:underline">CIS帮助文档</a>
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-auto px-5 py-4">
        {/* 返回 + 标题 + 步骤条 同一行 */}
        <div className="flex items-center justify-center mb-6 relative">
          <div className="flex items-center gap-3 absolute left-0">
            <button
              onClick={onBack}
              className="text-[#666666] hover:text-[#202020] text-sm"
            >
              &lt; 返回
            </button>
            <h1 className="text-sm font-medium text-[#202020]">{isEdit ? '编辑Deployment' : '创建Deployment'}</h1>
          </div>
          {/* 步骤条 - 居中 */}
          <div className="flex items-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      currentStep >= step.id
                        ? 'bg-[#0066FF] text-white'
                        : 'bg-[#D8E0E8] text-white'
                    }`}
                  >
                    {step.id}
                  </div>
                  <span
                    className={`text-sm ${
                      currentStep >= step.id ? 'text-[#0066FF] font-medium' : 'text-[#8C9AAE]'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <svg className="w-4 h-4 mx-3 text-[#D8E0E8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 分割线 */}
        <div className="border-b border-[#E6E6E6] mb-6"></div>

        {/* 表单内容 - 基本信息 */}
        {currentStep === 1 && (
          <div className="max-w-6xl">
            {/* Deployment名称 - 水平布局 */}
            <div className="flex items-center mb-5">
              <label className="w-36 flex-shrink-0 text-sm text-[#202020] text-right pr-3 whitespace-nowrap">
                <span className="text-red-500 mr-0.5">*</span>Deployment名称:
              </label>
              <div className="flex-1 flex items-center gap-3">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  className="flex-1 h-8 px-3 text-sm border border-[#D8E0E8] rounded focus:border-[#0066FF] focus:outline-none"
                  placeholder="请输入Deployment名称"
                />
                <span className="text-xs text-[#8C9AAE] whitespace-nowrap">
                  验证规则[a-z]([-a-z0-9]*[a-z0-9])?，不能超过44个字符
                </span>
              </div>
            </div>

            {/* 版本名称 - 水平布局 */}
            <div className="flex items-center mb-5">
              <label className="w-36 flex-shrink-0 text-sm text-[#202020] text-right pr-3 whitespace-nowrap">
                <span className="text-red-500 mr-0.5">*</span>版本名称:
                <button className="ml-1 text-[#8C9AAE] hover:text-[#666666] inline" title="版本名称说明">
                  <svg className="w-3.5 h-3.5 inline" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                </button>
              </label>
              <div className="flex-1">
                <input
                  type="text"
                  value={formData.versionName}
                  onChange={(e) => updateFormData('versionName', e.target.value)}
                  className="w-full h-8 px-3 text-sm border border-[#D8E0E8] rounded focus:border-[#0066FF] focus:outline-none"
                  placeholder="请输入版本名称"
                />
              </div>
            </div>

            {/* 发布说明 - 水平布局 */}
            <div className="flex mb-5">
              <label className="w-36 flex-shrink-0 text-sm text-[#202020] text-right pr-3 whitespace-nowrap pt-1.5">
                <span className="text-red-500 mr-0.5">*</span>发布说明:
              </label>
              <div className="flex-1">
                <textarea
                  value={formData.releaseNote}
                  onChange={(e) => updateFormData('releaseNote', e.target.value)}
                  className="w-full h-24 px-3 py-2 text-sm border border-[#D8E0E8] rounded focus:border-[#0066FF] focus:outline-none resize-y"
                  placeholder="请至少输入8个字符（一个汉字=2个字符），最大512个字符或者256个汉字"
                />
                {!formData.releaseNote && (
                  <p className="mt-1 text-xs text-red-500">请输入发布说明</p>
                )}
              </div>
            </div>

            {/* 原地升级 - 水平布局 */}
            <div className="flex mb-5">
              <label className="w-36 flex-shrink-0 text-sm text-[#202020] text-right pr-3 whitespace-nowrap pt-1">
                原地升级:
              </label>
              <div className="flex-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inPlaceUpgrade}
                    onChange={(e) => updateFormData('inPlaceUpgrade', e.target.checked)}
                    className="w-4 h-4 rounded border-[#D8E0E8] text-[#0066FF] focus:ring-[#0066FF]"
                  />
                  <span className="text-sm text-[#202020]">原地升级</span>
                  <span className="text-xs text-[#8C9AAE] ml-1">
                    选择支持原地升级后，在发布或更新时，会支持原地升级选项，Pod不会重建，PodIP不变，挂载盘、GPU等资源不会释放。
                  </span>
                </label>
              </div>
            </div>

            {/* 网络类型 - 水平布局 */}
            <div className="flex items-center mb-5">
              <label className="w-36 flex-shrink-0 text-sm text-[#202020] text-right pr-3 whitespace-nowrap">
                <span className="text-red-500 mr-0.5">*</span>网络类型:
                <button className="ml-1 text-[#8C9AAE] hover:text-[#666666] inline" title="网络类型说明">
                  <svg className="w-3.5 h-3.5 inline" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                </button>
              </label>
              <div className="flex-1 flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="networkType"
                    checked={formData.networkType === 'classic'}
                    onChange={() => updateFormData('networkType', 'classic')}
                    className="w-4 h-4 text-[#0066FF] focus:ring-[#0066FF]"
                  />
                  <span className="text-sm text-[#202020]">经典网络</span>
                  <button className="text-[#8C9AAE] hover:text-[#666666]" title="经典网络说明">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                  </button>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="networkType"
                    checked={formData.networkType === 'vpc'}
                    onChange={() => updateFormData('networkType', 'vpc')}
                    className="w-4 h-4 text-[#0066FF] focus:ring-[#0066FF]"
                  />
                  <span className="text-sm text-[#202020]">专有网络</span>
                  <button className="text-[#8C9AAE] hover:text-[#666666]" title="专有网络说明">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                  </button>
                </label>
              </div>
            </div>

            {/* 地域 - 水平布局 */}
            <div className="flex mb-5">
              <label className="w-36 flex-shrink-0 text-sm text-[#202020] text-right pr-3 whitespace-nowrap pt-1">
                <span className="text-red-500 mr-0.5">*</span>地域:
              </label>
              <div className="flex-1 flex flex-wrap gap-x-4 gap-y-2">
                {regions.map((region) => (
                  <label key={region.id} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.regions.includes(region.id)}
                      onChange={() => toggleRegion(region.id)}
                      className="w-4 h-4 rounded border-[#D8E0E8] text-[#0066FF] focus:ring-[#0066FF]"
                    />
                    <span className="text-sm text-[#202020]">{region.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 可用区 - 水平布局 */}
            <div className="flex mb-5">
              <label className="w-36 flex-shrink-0 text-sm text-[#202020] text-right pr-3 whitespace-nowrap pt-1">
                <span className="text-red-500 mr-0.5">*</span>可用区:
              </label>
              <div className="flex-1">
                <div className="mb-2">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.availabilityZones.length === availabilityZones.length}
                      onChange={selectAllZones}
                      className="w-4 h-4 rounded border-[#D8E0E8] text-[#0066FF] focus:ring-[#0066FF]"
                    />
                    <span className="text-sm text-[#202020]">全选</span>
                  </label>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-2">
                  {availabilityZones.map((zone) => (
                    <label key={zone.id} className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={formData.availabilityZones.includes(zone.id)}
                        onChange={() => toggleAvailabilityZone(zone.id)}
                        className="w-4 h-4 rounded border-[#D8E0E8] text-[#0066FF] focus:ring-[#0066FF]"
                      />
                      <span className="text-sm text-[#202020] whitespace-nowrap">{zone.label}</span>
                      {zone.recommended && (
                        <span className="text-xs text-red-500 bg-red-50 px-1 rounded">推荐</span>
                      )}
                    </label>
                  ))}
                </div>
                {formData.availabilityZones.length === 0 && (
                  <p className="mt-1 text-xs text-red-500">至少选择一个可用区</p>
                )}
              </div>
            </div>

            {/* 集群 - 水平布局 */}
            <div className="flex mb-5">
              <label className="w-36 flex-shrink-0 text-sm text-[#202020] text-right pr-3 whitespace-nowrap pt-1">
                <span className="text-red-500 mr-0.5">*</span>集群: <span className="text-xs text-[#8C9AAE] font-normal">至少选择一个集群</span>
              </label>
              <div className="flex-1">
                <div className="border border-[#E6E6E6] rounded overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#F8F9FA]">
                        <th className="text-left px-4 py-2 font-medium text-[#666666]">
                          集群
                          <button className="ml-1 text-[#8C9AAE] hover:text-[#666666]" title="搜索集群">
                            <svg className="w-3.5 h-3.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                          </button>
                        </th>
                        <th className="text-left px-4 py-2 font-medium text-[#666666]">
                          副本数
                          <button className="ml-1 text-[#8C9AAE] hover:text-[#666666]" title="副本数说明">
                            <svg className="w-3.5 h-3.5 inline" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                          </button>
                        </th>
                        <th className="text-left px-4 py-2 font-medium text-[#666666]">主机组</th>
                        <th className="text-left px-4 py-2 font-medium text-[#666666]">运行时</th>
                        <th className="text-left px-4 py-2 font-medium text-[#666666]">资源用量</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clusters.map((cluster, index) => (
                        <tr key={cluster.name} className="border-t border-[#E6E6E6] hover:bg-[#F8F9FA]">
                          <td className="px-4 py-2.5">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={cluster.selected}
                                onChange={() => toggleCluster(index)}
                                className="w-4 h-4 rounded border-[#D8E0E8] text-[#0066FF] focus:ring-[#0066FF]"
                              />
                              <span className="text-sm text-[#202020]">{cluster.name}</span>
                              {cluster.type === 'public' ? (
                                <span className="text-xs text-green-700 bg-green-50 px-1.5 py-0.5 rounded">公共集群</span>
                              ) : (
                                <span className="text-xs text-[#0066FF] bg-[#EEF6FF] px-1.5 py-0.5 rounded">独享集群</span>
                              )}
                            </label>
                          </td>
                          <td className="px-4 py-2.5">
                            <input
                              type="number"
                              min={1}
                              value={cluster.replicas}
                              onChange={(e) => updateClusterReplicas(index, parseInt(e.target.value) || 1)}
                              className="w-16 h-7 px-2 text-sm text-center border border-[#D8E0E8] rounded focus:border-[#0066FF] focus:outline-none"
                            />
                          </td>
                          <td className="px-4 py-2.5">
                            <select
                              value={cluster.hostGroup}
                              onChange={(e) => updateClusterHostGroup(index, e.target.value)}
                              className="h-7 px-2 text-sm border border-[#D8E0E8] rounded bg-white focus:border-[#0066FF] focus:outline-none"
                            >
                              <option value="default(默认主机组)">default(默认主机组)</option>
                            </select>
                          </td>
                          <td className="px-4 py-2.5">
                            <select
                              value={cluster.runtime}
                              onChange={(e) => updateClusterRuntime(index, e.target.value)}
                              className="h-7 px-2 text-sm border border-[#D8E0E8] rounded bg-white focus:border-[#0066FF] focus:outline-none w-24"
                            >
                              <option value="">请选择</option>
                              <option value="docker">docker</option>
                              <option value="containerd">containerd</option>
                            </select>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="text-sm text-[#8C9AAE]">集群剩余可用资源: {cluster.resource}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {selectedClusterCount === 0 && (
                  <p className="mt-1 text-xs text-red-500">至少选择一个集群</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 步骤2: 部署配置 */}
        {currentStep === 2 && (
          <div className="max-w-6xl">
            {/* Pod配置 */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-1 h-5 bg-[#165DFF] mr-2 rounded-sm"></div>
                <h3 className="text-base font-medium text-[#1F2329]">Pod配置</h3>
              </div>
              <div className="mb-4">
                <label className="flex items-center text-sm text-[#1F2329] mb-2">
                  <span className="text-[#F53F3F] mr-0.5">*</span>作业类型
                  <button className="ml-1 text-[#86909C] hover:text-[#4E5969]" title="作业类型说明">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                  </button>
                </label>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {[
                    { id: 'ls', label: '共享型（LS）', desc: '' },
                    { id: 'lsr', label: '独占优先型（LSR）', desc: '' },
                    { id: 'be', label: '离线型（BE）', desc: '' },
                    { id: 'lse', label: '独占排他型（LSE）', desc: '' },
                  ].map((type) => (
                    <label key={type.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="jobType"
                        checked={formData.jobType === type.id}
                        onChange={() => updateFormData('jobType', type.id)}
                        className="w-4 h-4 text-[#165DFF] focus:ring-[#165DFF] border-[#C9CDD4]"
                      />
                      <span className={`text-sm ${formData.jobType === type.id ? 'text-[#165DFF]' : 'text-[#1F2329]'}`}>{type.label}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-[#86909C] mt-2">在线作业，适合运行低负载应用，性能比独占型作业要低</p>
              </div>
            </div>

            {/* 容器配置 */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-1 h-5 bg-[#165DFF] mr-2 rounded-sm"></div>
                <h3 className="text-base font-medium text-[#1F2329]">容器配置</h3>
                <span className="text-sm text-[#FAAD14] ml-3">请检查&quot;容器1&quot;tab页内容是否按要求填写，比如未填写必填项</span>
              </div>

              {/* 容器Tab栏 */}
              <div className="flex items-center border-b border-[#E5E6EB] mb-4">
                <div className="flex items-center gap-1 px-3 py-2 text-sm text-[#1F2329] border-b-2 border-[#FAAD14] -mb-px">
                  <svg className="w-3.5 h-3.5 text-[#FAAD14]" fill="currentColor" viewBox="0 0 20 20"><path d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" /></svg>
                  <span>容器1</span>
                  <button className="ml-1 text-[#86909C] hover:text-[#4E5969] text-base leading-none">&times;</button>
                </div>
                <button className="flex items-center gap-1 px-3 py-2 text-sm text-[#165DFF] hover:bg-[#F2F3F5]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  添加容器
                </button>
              </div>

              {/* 容器名称 */}
              <div className="mb-4">
                <label className="block text-sm text-[#1F2329] mb-2">
                  <span className="text-[#F53F3F] mr-0.5">*</span>容器名称
                </label>
                <input
                  type="text"
                  value={formData.containerName}
                  onChange={(e) => updateFormData('containerName', e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-[#E5E6EB] rounded focus:border-[#165DFF] focus:outline-none"
                  placeholder="小写英文和数字，必须以字母开头，如container1"
                />
              </div>

              {/* 容器类型 */}
              <div className="mb-4">
                <label className="flex items-center text-sm text-[#1F2329] mb-2">
                  <span className="text-[#F53F3F] mr-0.5">*</span>容器类型
                  <button className="ml-1 text-[#86909C] hover:text-[#4E5969]" title="容器类型说明">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                  </button>
                </label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="containerType"
                      checked={formData.containerType === 'standard'}
                      onChange={() => updateFormData('containerType', 'standard')}
                      className="w-4 h-4 text-[#165DFF] focus:ring-[#165DFF] border-[#C9CDD4]"
                    />
                    <span className={`text-sm ${formData.containerType === 'standard' ? 'text-[#165DFF]' : 'text-[#1F2329]'}`}>标准容器</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="containerType"
                      checked={formData.containerType === 'init'}
                      onChange={() => updateFormData('containerType', 'init')}
                      className="w-4 h-4 text-[#165DFF] focus:ring-[#165DFF] border-[#C9CDD4]"
                    />
                    <span className={`text-sm ${formData.containerType === 'init' ? 'text-[#165DFF]' : 'text-[#1F2329]'}`}>init容器</span>
                  </label>
                </div>
              </div>

              {/* 选择镜像 */}
              <div className="mb-4">
                <label className="block text-sm text-[#1F2329] mb-2">
                  <span className="text-[#F53F3F] mr-0.5">*</span>选择镜像
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={formData.imageRegistry}
                    onChange={(e) => updateFormData('imageRegistry', e.target.value)}
                    className="h-9 px-2 text-sm border border-[#E5E6EB] rounded bg-white focus:border-[#165DFF] focus:outline-none"
                  >
                    <option value="basic">基础镜像</option>
                    <option value="custom">自定义镜像</option>
                  </select>
                  <select
                    value={formData.imageRepo}
                    onChange={(e) => updateFormData('imageRepo', e.target.value)}
                    className="h-9 px-2 text-sm border border-[#E5E6EB] rounded bg-white focus:border-[#165DFF] focus:outline-none flex-1"
                  >
                    <option value="library/nginx">library/nginx</option>
                    <option value="library/redis">library/redis</option>
                    <option value="library/mysql">library/mysql</option>
                  </select>
                  <select
                    value={formData.imageTag}
                    onChange={(e) => updateFormData('imageTag', e.target.value)}
                    className="h-9 px-2 text-sm border border-[#E5E6EB] rounded bg-white focus:border-[#165DFF] focus:outline-none"
                  >
                    <option value="1.25-alpine-ipv6toa">1.25-alpine-ipv6toa</option>
                    <option value="latest">latest</option>
                    <option value="stable">stable</option>
                  </select>
                </div>
              </div>

              {/* 镜像拉取策略 */}
              <div className="mb-4">
                <label className="block text-sm text-[#1F2329] mb-2">镜像拉取策略</label>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="imagePullPolicy"
                      checked={formData.imagePullPolicy === 'IfNotPresent'}
                      onChange={() => updateFormData('imagePullPolicy', 'IfNotPresent')}
                      className="w-4 h-4 text-[#165DFF] focus:ring-[#165DFF] border-[#C9CDD4]"
                    />
                    <span className={`text-sm ${formData.imagePullPolicy === 'IfNotPresent' ? 'text-[#165DFF]' : 'text-[#1F2329]'}`}>镜像在本地不存在时才拉取（IfNotPresent）</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="imagePullPolicy"
                      checked={formData.imagePullPolicy === 'Always'}
                      onChange={() => updateFormData('imagePullPolicy', 'Always')}
                      className="w-4 h-4 text-[#165DFF] focus:ring-[#165DFF] border-[#C9CDD4]"
                    />
                    <span className={`text-sm ${formData.imagePullPolicy === 'Always' ? 'text-[#165DFF]' : 'text-[#1F2329]'}`}>总是从仓库拉取（Always）</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="imagePullPolicy"
                      checked={formData.imagePullPolicy === 'Never'}
                      onChange={() => updateFormData('imagePullPolicy', 'Never')}
                      className="w-4 h-4 text-[#165DFF] focus:ring-[#165DFF] border-[#C9CDD4]"
                    />
                    <span className={`text-sm ${formData.imagePullPolicy === 'Never' ? 'text-[#165DFF]' : 'text-[#1F2329]'}`}>禁止从仓库拉取，只能使用Pod所在Node上的镜像（Never）</span>
                  </label>
                </div>
              </div>

              {/* 资源配置 */}
              <div className="mb-4">
                <label className="flex items-center text-sm text-[#1F2329] mb-2">
                  <span className="text-[#F53F3F] mr-0.5">*</span>资源配置
                  <button className="ml-1 text-[#86909C] hover:text-[#4E5969]" title="资源配置说明">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                  </button>
                </label>
                <div className="flex items-center gap-6 mb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="resourceConfig"
                      checked={formData.resourceConfig === 'default'}
                      onChange={() => updateFormData('resourceConfig', 'default')}
                      className="w-4 h-4 text-[#165DFF] focus:ring-[#165DFF] border-[#C9CDD4]"
                    />
                    <span className={`text-sm ${formData.resourceConfig === 'default' ? 'text-[#165DFF]' : 'text-[#1F2329]'}`}>默认</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="resourceConfig"
                      checked={formData.resourceConfig === 'custom'}
                      onChange={() => updateFormData('resourceConfig', 'custom')}
                      className="w-4 h-4 text-[#165DFF] focus:ring-[#165DFF] border-[#C9CDD4]"
                    />
                    <span className={`text-sm ${formData.resourceConfig === 'custom' ? 'text-[#165DFF]' : 'text-[#1F2329]'}`}>自定义</span>
                  </label>
                </div>
                {formData.resourceConfig === 'default' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#1F2329]"><span className="text-[#F53F3F] mr-0.5">*</span>CPU</span>
                      <select
                        value={formData.cpu}
                        onChange={(e) => updateFormData('cpu', e.target.value)}
                        className="h-9 px-2 text-sm border border-[#E5E6EB] rounded bg-white focus:border-[#165DFF] focus:outline-none w-28"
                      >
                        <option value="0.5">0.5核</option>
                        <option value="1">1核</option>
                        <option value="2">2核</option>
                        <option value="4">4核</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#1F2329]"><span className="text-[#F53F3F] mr-0.5">*</span>内存</span>
                      <select
                        value={formData.memory}
                        onChange={(e) => updateFormData('memory', e.target.value)}
                        className="h-9 px-2 text-sm border border-[#E5E6EB] rounded bg-white focus:border-[#165DFF] focus:outline-none w-28"
                      >
                        <option value="1Gi">1Gi</option>
                        <option value="2Gi">2Gi</option>
                        <option value="4Gi">4Gi</option>
                        <option value="8Gi">8Gi</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 更多配置（默认折叠） */}
            <div className="mb-6">
              <button
                onClick={() => setShowMoreConfig(!showMoreConfig)}
                className="flex items-center gap-2 mb-4 cursor-pointer"
              >
                <div className="w-1 h-4 bg-[#0066FF] mr-1 rounded-sm"></div>
                <h3 className="text-sm font-medium text-[#202020]">更多配置</h3>
                <svg className={`w-4 h-4 text-[#8C9AAE] transition-transform ${showMoreConfig ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showMoreConfig && (
                <div className="flex">
                  {/* 左侧导航 */}
                  <div className="w-48 flex-shrink-0 border-r border-[#E6E6E6] pr-4">
                    {[
                      { id: 'health', label: '健康检查（建议开启）', hasIcon: true },
                      { id: 'lifecycle', label: '生命周期', hasIcon: false },
                      { id: 'env', label: '环境变量', hasIcon: true },
                      { id: 'volume', label: '存储挂载', hasIcon: true },
                      { id: 'hostAliases', label: 'HostAliases', hasIcon: false },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setMoreConfigTab(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded mb-1 ${
                          moreConfigTab === item.id
                            ? 'bg-[#EEF6FF] text-[#0066FF] font-medium'
                            : 'text-[#202020] hover:bg-[#F8F9FA]'
                        }`}
                      >
                        <span className="text-left">{item.label}</span>
                        {item.hasIcon && (
                          <svg className="w-3.5 h-3.5 text-[#8C9AAE] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                        )}
                      </button>
                    ))}
                  </div>
                  {/* 右侧内容 */}
                  <div className="flex-1 pl-4">
                    {moreConfigTab === 'health' && (
                      <div className="bg-[#F8F9FA] rounded p-4 space-y-4">
                        {[
                          { id: 'readiness', label: '就绪探针（建议开启）', enabled: false },
                          { id: 'liveness', label: '存活探针', enabled: false },
                          { id: 'startup', label: '启动探针', enabled: false },
                        ].map((probe) => (
                          <div key={probe.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-[#202020]">{probe.label}</span>
                              <svg className="w-3.5 h-3.5 text-[#8C9AAE]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                            </div>
                            <button
                              className={`w-9 h-5 rounded-full transition-colors ${probe.enabled ? 'bg-[#0066FF]' : 'bg-[#D8E0E8]'}`}
                            >
                              <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${probe.enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {moreConfigTab === 'lifecycle' && (
                      <div className="bg-[#F8F9FA] rounded p-6 text-center text-sm text-[#8C9AAE]">
                        配置容器的生命周期钩子
                      </div>
                    )}
                    {moreConfigTab === 'env' && (
                      <div className="bg-[#F8F9FA] rounded p-6 text-center text-sm text-[#8C9AAE]">
                        配置环境变量
                      </div>
                    )}
                    {moreConfigTab === 'volume' && (
                      <div className="bg-[#F8F9FA] rounded p-6 text-center text-sm text-[#8C9AAE]">
                        配置存储挂载
                      </div>
                    )}
                    {moreConfigTab === 'hostAliases' && (
                      <div className="bg-[#F8F9FA] rounded p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-sm font-medium text-[#202020]">HostAliases</h4>
                            <p className="mt-1 text-xs text-[#8C9AAE]">自定义 Host 映射，一个 IP 地址可以对应多个 Hostname</p>
                          </div>
                          <button
                            type="button"
                            onClick={addHostAlias}
                            className="text-sm text-[#0066FF] hover:text-[#0E4ADB]"
                          >
                            + 添加 HostAliases
                          </button>
                        </div>
                        <div className="border border-[#E5E6EB] rounded bg-white overflow-hidden">
                          <div className="grid grid-cols-[1fr_1fr_64px] gap-3 px-3 py-2 bg-[#F7F8FA] border-b border-[#E5E6EB] text-xs text-[#4E5969]">
                            <span>IP 地址</span>
                            <span>Hostname</span>
                            <span>操作</span>
                          </div>
                          {hostAliases.length === 0 ? (
                            <div className="px-3 py-6 text-center text-sm text-[#8C9AAE]">
                              暂无 HostAliases，点击右上角添加
                            </div>
                          ) : (
                            hostAliases.map((item, index) => (
                              <div key={index} className="grid grid-cols-[1fr_1fr_64px] gap-3 items-center px-3 py-2 border-b border-[#F2F3F5] last:border-b-0">
                                <input
                                  type="text"
                                  value={item.ip}
                                  onChange={(event) => updateHostAlias(index, 'ip', event.target.value)}
                                  placeholder="如 10.10.10.100"
                                  className="h-8 w-full px-2 text-sm border border-[#E5E6EB] rounded focus:border-[#165DFF] focus:outline-none"
                                />
                                <input
                                  type="text"
                                  value={item.hostname}
                                  onChange={(event) => updateHostAlias(index, 'hostname', event.target.value)}
                                  placeholder="如 api.example.com"
                                  className="h-8 w-full px-2 text-sm border border-[#E5E6EB] rounded focus:border-[#165DFF] focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeHostAlias(index)}
                                  className="text-sm text-[#F53F3F] hover:text-[#D92D20]"
                                >
                                  删除
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 高级配置（默认折叠） */}
            <div className="mb-6">
              <button
                onClick={() => setShowAdvancedConfig(!showAdvancedConfig)}
                className="flex items-center gap-2 mb-4 cursor-pointer"
              >
                <div className="w-1 h-4 bg-[#0066FF] mr-1 rounded-sm"></div>
                <h3 className="text-sm font-medium text-[#202020]">高级配置</h3>
                <svg className={`w-4 h-4 text-[#8C9AAE] transition-transform ${showAdvancedConfig ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showAdvancedConfig && (
                <div className="flex">
                  {/* 左侧导航 */}
                  <div className="w-48 flex-shrink-0 border-r border-[#E6E6E6] pr-4">
                    {[
                      { id: 'nodeAffinity', label: '节点亲和性', hasIcon: true },
                      { id: 'podAntiAffinity', label: 'Pod反亲和性', hasIcon: false },
                      { id: 'networkPolicy', label: '网络策略', hasIcon: true },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setAdvancedConfigTab(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded mb-1 ${
                          advancedConfigTab === item.id
                            ? 'bg-[#EEF6FF] text-[#0066FF] font-medium'
                            : 'text-[#202020] hover:bg-[#F8F9FA]'
                        }`}
                      >
                        <span className="text-left">{item.label}</span>
                        {item.hasIcon && (
                          <svg className="w-3.5 h-3.5 text-[#8C9AAE] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                        )}
                      </button>
                    ))}
                  </div>
                  {/* 右侧内容 */}
                  <div className="flex-1 pl-4">
                    {advancedConfigTab === 'nodeAffinity' && (
                      <div className="bg-[#F8F9FA] rounded p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#202020]">必须满足</span>
                          <button className="text-sm text-[#0066FF] hover:underline flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            添加规则
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#202020]">尽量满足</span>
                          <button className="text-sm text-[#0066FF] hover:underline flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            添加规则
                          </button>
                        </div>
                      </div>
                    )}
                    {advancedConfigTab === 'podAntiAffinity' && (
                      <div className="bg-[#F8F9FA] rounded p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#202020]">必须满足</span>
                          <button className="text-sm text-[#0066FF] hover:underline flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            添加规则
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#202020]">尽量满足</span>
                          <button className="text-sm text-[#0066FF] hover:underline flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            添加规则
                          </button>
                        </div>
                      </div>
                    )}
                    {advancedConfigTab === 'networkPolicy' && (
                      <div className="bg-[#F8F9FA] rounded p-4 space-y-4">
                        <button className="text-sm text-[#0066FF] hover:underline flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                          允许进入的访问IP段
                        </button>
                        <button className="text-sm text-[#0066FF] hover:underline flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                          允许出口的访问IP段
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* 步骤3: 确认 */}
        {currentStep === 3 && (
          <div className="max-w-6xl">
            {/* 基本信息模块 */}
            <div className="mb-6">
              <h3 className="text-base font-medium text-[#1F2329] mb-3">基本信息</h3>
              <div className="border border-[#E5E6EB] rounded overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    <tr>
                      <td className="bg-[#F7F8FA] text-[#86909C] px-4 py-2.5 w-32 border-b border-r border-[#E5E6EB]">名称</td>
                      <td className="px-4 py-2.5 border-b border-r border-[#E5E6EB] text-[#1F2329]">{formData.name}</td>
                      <td className="bg-[#F7F8FA] text-[#86909C] px-4 py-2.5 w-32 border-b border-r border-[#E5E6EB]">版本名称</td>
                      <td className="px-4 py-2.5 border-b border-r border-[#E5E6EB] text-[#1F2329]">{formData.versionName}</td>
                      <td className="bg-[#F7F8FA] text-[#86909C] px-4 py-2.5 w-32 border-b border-[#E5E6EB]">发布说明</td>
                      <td className="px-4 py-2.5 border-b border-[#E5E6EB] text-[#1F2329]">{formData.releaseNote || '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 部署配置模块 */}
            <div className="mb-6">
              <h3 className="text-base font-medium text-[#1F2329] mb-3">部署配置</h3>
              <div className="border border-[#E5E6EB] rounded overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    <tr>
                      <td className="bg-[#F7F8FA] text-[#86909C] px-4 py-2.5 w-32 border-b border-r border-[#E5E6EB]">作业类型</td>
                      <td className="px-4 py-2.5 border-b border-[#E5E6EB] text-[#1F2329]" colSpan={5}>
                        {formData.jobType === 'ls' ? '共享型（LS）' : formData.jobType === 'lsr' ? '独占优先型（LSR）' : formData.jobType === 'be' ? '离线型（BE）' : '独占排他型（LSE）'}
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-[#F7F8FA] text-[#86909C] px-4 py-2.5 w-32 border-b border-r border-[#E5E6EB]">名称</td>
                      <td className="px-4 py-2.5 border-b border-r border-[#E5E6EB] text-[#1F2329]">{formData.containerName}</td>
                      <td className="bg-[#F7F8FA] text-[#86909C] px-4 py-2.5 w-32 border-b border-r border-[#E5E6EB]">容器类型</td>
                      <td className="px-4 py-2.5 border-b border-r border-[#E5E6EB] text-[#1F2329]">{formData.containerType === 'standard' ? '标准容器' : 'init容器'}</td>
                      <td className="bg-[#F7F8FA] text-[#86909C] px-4 py-2.5 w-32 border-b border-[#E5E6EB]">资源配置</td>
                      <td className="px-4 py-2.5 border-b border-[#E5E6EB] text-[#1F2329]">{formData.cpu === '0.5' ? '0.5' : formData.cpu}C{formData.memory}</td>
                    </tr>
                    <tr>
                      <td className="bg-[#F7F8FA] text-[#86909C] px-4 py-2.5 w-32 border-r border-[#E5E6EB]">镜像拉取策略</td>
                      <td className="px-4 py-2.5 border-r border-[#E5E6EB] text-[#1F2329]">{formData.imagePullPolicy}</td>
                      <td className="bg-[#F7F8FA] text-[#86909C] px-4 py-2.5 w-32 border-r border-[#E5E6EB]">镜像&amp;版本</td>
                      <td className="px-4 py-2.5 text-[#1F2329]" colSpan={3}>harbor.qihoo.net/{formData.imageRepo}:{formData.imageTag}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 底部操作按钮 */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-t border-[#E6E6E6]">
        {(currentStep === 2 || currentStep === 3) && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-red-500">单实例预估费用:</span>
            <svg className="w-3.5 h-3.5 text-[#86909C]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
            <span className="text-sm text-[#1F2329]">折后价 <span className="font-medium">16.21元/月</span></span>
            <span className="text-xs text-[#86909C] line-through">官方价 38.97元/月</span>
          </div>
        )}
        {currentStep === 1 && <div />}
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="h-8 px-4 text-sm border border-[#E5E6EB] rounded text-[#1F2329] bg-white hover:bg-[#F2F3F5]"
          >
            取消
          </button>
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="h-8 px-4 text-sm bg-[#165DFF] text-white rounded hover:bg-[#0E4ADB]"
            >
              上一步
            </button>
          )}
          {currentStep === 2 && (
            <button
              className="h-8 px-4 text-sm border border-[#E5E6EB] rounded text-[#1F2329] bg-white hover:bg-[#F2F3F5]"
            >
              Yaml
            </button>
          )}
          {currentStep === 3 && (
            <button
              className="h-8 px-4 text-sm bg-[#165DFF] text-white rounded hover:bg-[#0E4ADB]"
            >
              {isEdit ? '保存' : '保存'}
            </button>
          )}
          <button
            onClick={() => {
              if (currentStep < 3) {
                setCurrentStep((prev) => prev + 1);
              } else {
                onNext?.();
              }
            }}
            className="h-8 px-4 text-sm bg-[#165DFF] text-white rounded hover:bg-[#0E4ADB]"
          >
            {currentStep < 3 ? '下一步' : isEdit ? '保存' : '发布上线'}
          </button>
        </div>
      </div>
    </div>
  );
}
