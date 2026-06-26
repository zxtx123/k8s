'use client';

import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Info, HelpCircle } from 'lucide-react';

interface CreateLoadBalancerProps {
  onBack: () => void;
}

interface PortConfig {
  id: number;
  vipPort: string;
  scheduleMethod: string;
  rsPort: string;
  healthCheckMethod: string;
}

interface LabelItem {
  id: number;
  key: string;
  value: string;
  isDefault?: boolean;
}

export default function CreateLoadBalancer({ onBack }: CreateLoadBalancerProps) {
  const [name, setName] = useState('zxtest-');
  const [releaseNote, setReleaseNote] = useState('');
  const [vipType, setVipType] = useState('ipv4');
  const [createMethod, setCreateMethod] = useState('new');
  const [networkType, setNetworkType] = useState('classic');
  const [regions, setRegions] = useState<string[]>(['beijing']);
  const [zones, setZones] = useState<string[]>(['bjpdc']);
  const [cluster, setCluster] = useState('pub-bjpdc');
  const [receiveAlarm, setReceiveAlarm] = useState('no');
  const [rsBackend, setRsBackend] = useState('none');
  const [labels, setLabels] = useState<LabelItem[]>([
    { id: 1, key: 'app', value: 'zxtest-', isDefault: true },
  ]);
  const [portConfigs, setPortConfigs] = useState<PortConfig[]>([
    { id: 1, vipPort: '', scheduleMethod: 'wrr', rsPort: '', healthCheckMethod: 'tcp' },
  ]);
  const [expandedPorts, setExpandedPorts] = useState<number[]>([1]);

  const regionOptions = [
    { key: 'beijing', label: '北京' },
    { key: 'beijingzpy', label: '北京中鹏云' },
    { key: 'shanghai', label: '上海' },
    { key: 'zhengzhou', label: '郑州' },
  ];

  const zoneOptions = [
    { key: 'bjpdc', label: 'bjpdc(北京联通25G)', recommended: true },
    { key: 'alicn', label: 'alicn(北京阿里云)' },
    { key: 'bjcm', label: 'bjcm(北京移动)' },
    { key: 'bjmd', label: 'bjmd(北京联通)' },
    { key: 'bjwdt', label: 'bjwdt(北京电信25G-特价)' },
    { key: 'bjzdt', label: 'bjzdt(北京电信25G)' },
  ];

  const clusterOptions = [
    'pub-bjpdc',
    'pub-bjmd',
    'pub-bjwdt',
    'pub-bjzdt',
    'pub-bjyt',
  ];

  const toggleRegion = (key: string) => {
    setRegions(prev =>
      prev.includes(key) ? prev.filter(r => r !== key) : [...prev, key]
    );
  };

  const toggleZone = (key: string) => {
    setZones(prev =>
      prev.includes(key) ? prev.filter(z => z !== key) : [...prev, key]
    );
  };

  const toggleAllZones = () => {
    if (zones.length === zoneOptions.length) {
      setZones([]);
    } else {
      setZones(zoneOptions.map(z => z.key));
    }
  };

  const togglePortExpand = (id: number) => {
    setExpandedPorts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const addLabel = () => {
    setLabels([...labels, { id: Date.now(), key: '', value: '' }]);
  };

  const removeLabel = (id: number) => {
    setLabels(labels.filter(l => l.id !== id));
  };

  const updateLabel = (id: number, field: 'key' | 'value', val: string) => {
    setLabels(labels.map(l => (l.id === id ? { ...l, [field]: val } : l)));
  };

  const addPortConfig = () => {
    const newId = Date.now();
    setPortConfigs([
      ...portConfigs,
      { id: newId, vipPort: '', scheduleMethod: 'wrr', rsPort: '', healthCheckMethod: 'tcp' },
    ]);
    setExpandedPorts([...expandedPorts, newId]);
  };

  const removePortConfig = (id: number) => {
    setPortConfigs(portConfigs.filter(p => p.id !== id));
    setExpandedPorts(expandedPorts.filter(p => p !== id));
  };

  const updatePortConfig = (id: number, field: keyof PortConfig, val: string) => {
    setPortConfigs(portConfigs.map(p => (p.id === id ? { ...p, [field]: val } : p)));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center bg-[#F7F8FA] px-6 py-3 border-b border-[#E5E6EB]">
        <button onClick={onBack} className="mr-3 text-[#86909C] hover:text-[#1F2329]">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-sm font-semibold text-[#1F2329]">创建负载均衡</h1>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl space-y-4">
          {/* 名称 */}
          <div className="flex items-start">
            <label className="w-32 flex-shrink-0 text-sm text-[#1F2329] pt-2 text-right pr-3 whitespace-nowrap">
              <span className="text-[#F53F3F]">* </span>名称:
            </label>
            <div className="flex-1">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full h-9 px-3 border border-[#E5E6EB] rounded text-sm text-[#1F2329] focus:outline-none focus:border-[#165DFF]"
                placeholder="请输入名称"
              />
              <p className="mt-1 text-xs text-[#86909C]">请输入名称，由小写字母、数字、中划线(-)组成，且中划线不可位于开头或结尾</p>
            </div>
          </div>

          {/* 发布说明 */}
          <div className="flex items-start">
            <label className="w-32 flex-shrink-0 text-sm text-[#1F2329] pt-2 text-right pr-3 whitespace-nowrap">
              <span className="text-[#F53F3F]">* </span>发布说明:
            </label>
            <div className="flex-1">
              <textarea
                value={releaseNote}
                onChange={e => setReleaseNote(e.target.value)}
                className="w-full h-20 px-3 py-2 border border-[#E5E6EB] rounded text-sm text-[#1F2329] focus:outline-none focus:border-[#165DFF] resize-y"
                placeholder="请输入发布说明"
              />
            </div>
          </div>

          {/* VIP类型 */}
          <div className="flex items-center">
            <label className="w-32 flex-shrink-0 text-sm text-[#1F2329] text-right pr-3 whitespace-nowrap">
              <span className="text-[#F53F3F]">* </span>VIP类型:
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="vipType" checked={vipType === 'ipv4'} onChange={() => setVipType('ipv4')} className="w-4 h-4 accent-[#165DFF]" />
                <span className={`text-sm ${vipType === 'ipv4' ? 'text-[#165DFF]' : 'text-[#1F2329]'}`}>IPv4</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="vipType" checked={vipType === 'ipv6'} onChange={() => setVipType('ipv6')} className="w-4 h-4 accent-[#165DFF]" />
                <span className={`text-sm ${vipType === 'ipv6' ? 'text-[#165DFF]' : 'text-[#1F2329]'}`}>IPv6</span>
              </label>
            </div>
          </div>

          {/* 创建方式 */}
          <div className="flex items-center">
            <label className="w-32 flex-shrink-0 text-sm text-[#1F2329] text-right pr-3 whitespace-nowrap">
              <span className="text-[#F53F3F]">* </span>创建方式:
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="createMethod" checked={createMethod === 'new'} onChange={() => setCreateMethod('new')} className="w-4 h-4 accent-[#165DFF]" />
                <span className={`text-sm ${createMethod === 'new' ? 'text-[#165DFF]' : 'text-[#1F2329]'}`}>新建VIP</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="createMethod" checked={createMethod === 'existing'} onChange={() => setCreateMethod('existing')} className="w-4 h-4 accent-[#165DFF]" />
                <span className={`text-sm ${createMethod === 'existing' ? 'text-[#165DFF]' : 'text-[#1F2329]'}`}>已有VIP</span>
                <HelpCircle className="w-4 h-4 text-[#86909C] cursor-help" />
              </label>
            </div>
          </div>

          {/* 网络类型 */}
          <div className="flex items-center">
            <label className="w-32 flex-shrink-0 text-sm text-[#1F2329] text-right pr-3 whitespace-nowrap">
              <span className="text-[#F53F3F]">* </span>网络类型:
            </label>
            <div className="flex items-center gap-6">
              {[
                { key: 'classic', label: '经典网络(原内网)' },
                { key: 'public', label: '公网' },
                { key: 'vpc', label: '专有网络' },
              ].map(opt => (
                <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="networkType" checked={networkType === opt.key} onChange={() => setNetworkType(opt.key)} className="w-4 h-4 accent-[#165DFF]" />
                  <span className={`text-sm ${networkType === opt.key ? 'text-[#165DFF]' : 'text-[#1F2329]'}`}>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 地域 */}
          <div className="flex items-start">
            <label className="w-32 flex-shrink-0 text-sm text-[#1F2329] pt-1 text-right pr-3 whitespace-nowrap">
              <span className="text-[#F53F3F]">* </span>地域:
            </label>
            <div className="flex-1 flex flex-wrap gap-4">
              {regionOptions.map(opt => (
                <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={regions.includes(opt.key)} onChange={() => toggleRegion(opt.key)} className="w-4 h-4 accent-[#165DFF] rounded" />
                  <span className="text-sm text-[#1F2329]">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 可用区 */}
          <div className="flex items-start">
            <label className="w-32 flex-shrink-0 text-sm text-[#1F2329] pt-1 text-right pr-3 whitespace-nowrap">
              <span className="text-[#F53F3F]">* </span>可用区:
            </label>
            <div className="flex-1">
              {regions.length === 0 ? (
                <p className="text-sm text-[#F53F3F]">请至少选择一个地域</p>
              ) : (
                <div>
                  <label className="flex items-center gap-2 cursor-pointer mb-2">
                    <input type="checkbox" checked={zones.length === zoneOptions.length} onChange={toggleAllZones} className="w-4 h-4 accent-[#165DFF] rounded" />
                    <span className="text-sm text-[#1F2329]">全选</span>
                  </label>
                  <div className="flex gap-4 pl-5 whitespace-nowrap">
                    {zoneOptions.map(opt => (
                      <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={zones.includes(opt.key)} onChange={() => toggleZone(opt.key)} className="w-4 h-4 accent-[#165DFF] rounded" />
                        <span className="text-sm text-[#1F2329]">{opt.label}</span>
                        {opt.recommended && (
                          <span className="px-1.5 py-0.5 bg-[#F53F3F] text-white text-xs rounded">推荐</span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 集群 */}
          <div className="flex items-center">
            <label className="w-32 flex-shrink-0 text-sm text-[#1F2329] text-right pr-3 whitespace-nowrap">
              <span className="text-[#F53F3F]">* </span>集群:
            </label>
            <div className="flex-1">
              {zones.length === 0 ? (
                <p className="text-sm text-[#F53F3F]">请至少选择一个集群</p>
              ) : (
                <select
                  value={cluster}
                  onChange={e => setCluster(e.target.value)}
                  className="w-80 h-9 px-3 border border-[#E5E6EB] rounded text-sm text-[#1F2329] focus:outline-none focus:border-[#165DFF] bg-white"
                >
                  {clusterOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* 接收报警 */}
          <div className="flex items-center">
            <label className="w-32 flex-shrink-0 text-sm text-[#1F2329] text-right pr-3 whitespace-nowrap">
              <span className="text-[#F53F3F]">* </span>接收报警:
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="receiveAlarm" checked={receiveAlarm === 'no'} onChange={() => setReceiveAlarm('no')} className="w-4 h-4 accent-[#165DFF]" />
                <span className={`text-sm ${receiveAlarm === 'no' ? 'text-[#165DFF]' : 'text-[#1F2329]'}`}>否</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="receiveAlarm" checked={receiveAlarm === 'yes'} onChange={() => setReceiveAlarm('yes')} className="w-4 h-4 accent-[#165DFF]" />
                <span className={`text-sm ${receiveAlarm === 'yes' ? 'text-[#165DFF]' : 'text-[#1F2329]'}`}>是</span>
              </label>
            </div>
          </div>

          {/* RS后端名称 */}
          <div className="flex items-start">
            <label className="w-32 flex-shrink-0 text-sm text-[#1F2329] pt-2 text-right pr-3 whitespace-nowrap">
              <span className="text-[#F53F3F]">* </span>RS后端名称:
              <HelpCircle className="w-4 h-4 text-[#86909C] cursor-help inline ml-1" />
            </label>
            <div className="flex-1">
              <select
                value={rsBackend}
                onChange={e => setRsBackend(e.target.value)}
                className="w-80 h-9 px-3 border border-[#E5E6EB] rounded text-sm text-[#1F2329] focus:outline-none focus:border-[#165DFF] bg-white"
              >
                <option value="none">不指定Workload</option>
                <option value="deployment">指定Deployment</option>
                <option value="statefulset">指定StatefulSet</option>
              </select>

              {/* 提示信息 */}
              <div className="mt-3 flex items-start gap-2 bg-[#E8F3FF] rounded p-3">
                <Info className="w-4 h-4 text-[#165DFF] flex-shrink-0 mt-0.5" />
                <span className="text-xs text-[#86909C]">默认标签不可以编辑和删除</span>
              </div>

              {/* 标签表 */}
              <div className="mt-3 border border-[#E5E6EB] rounded">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F7F8FA]">
                      <th className="text-left text-xs text-[#86909C] font-normal px-3 py-2">键</th>
                      <th className="text-left text-xs text-[#86909C] font-normal px-3 py-2">值</th>
                      <th className="text-left text-xs text-[#86909C] font-normal px-3 py-2 w-16">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labels.map(label => (
                      <tr key={label.id} className="border-t border-[#E5E6EB]">
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={label.key}
                            onChange={e => updateLabel(label.id, 'key', e.target.value)}
                            disabled={label.isDefault}
                            className={`w-full h-8 px-2 border border-[#E5E6EB] rounded text-sm focus:outline-none focus:border-[#165DFF] ${label.isDefault ? 'bg-[#F7F8FA] text-[#86909C]' : 'text-[#1F2329]'}`}
                            placeholder="请输入键"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={label.value}
                            onChange={e => updateLabel(label.id, 'value', e.target.value)}
                            disabled={label.isDefault}
                            className={`w-full h-8 px-2 border border-[#E5E6EB] rounded text-sm focus:outline-none focus:border-[#165DFF] ${label.isDefault ? 'bg-[#F7F8FA] text-[#86909C]' : 'text-[#1F2329]'}`}
                            placeholder="请输入值"
                          />
                        </td>
                        <td className="px-3 py-2">
                          {!label.isDefault && (
                            <button
                              onClick={() => removeLabel(label.id)}
                              className="text-xs text-[#86909C] hover:text-[#F53F3F]"
                            >
                              删除
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-3 py-2 border-t border-[#E5E6EB]">
                  <button
                    onClick={addLabel}
                    className="flex items-center gap-1 text-sm text-[#165DFF] hover:underline"
                  >
                    <Plus className="w-4 h-4" /> 添加
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 端口配置 */}
          <div className="flex items-start">
            <label className="w-32 flex-shrink-0 text-sm text-[#1F2329] pt-2 text-right pr-3 whitespace-nowrap">
              <span className="text-[#F53F3F]">* </span>端口:
            </label>
            <div className="flex-1 space-y-3">
              {portConfigs.map((port) => (
                <div key={port.id} className="border border-[#E5E6EB] rounded">
                  {/* 折叠头部 */}
                  <div
                    className="flex items-center justify-between bg-[#F7F8FA] px-4 py-2.5 cursor-pointer"
                    onClick={() => togglePortExpand(port.id)}
                  >
                    <div className="flex items-center gap-2">
                      <svg
                        className={`w-3 h-3 text-[#86909C] transition-transform ${expandedPorts.includes(port.id) ? 'rotate-0' : '-rotate-90'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-[#1F2329]">端口配置</span>
                    </div>
                    {portConfigs.length > 1 && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          removePortConfig(port.id);
                        }}
                        className="text-[#86909C] hover:text-[#F53F3F]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* 折叠内容 */}
                  {expandedPorts.includes(port.id) && (
                    <div className="p-4 space-y-3">
                      {/* VIP端口 + RS端口 */}
                      <div className="flex gap-6">
                        <div className="flex items-center flex-1">
                          <label className="w-24 flex-shrink-0 text-sm text-[#1F2329] text-right pr-3 whitespace-nowrap">
                            <span className="text-[#F53F3F]">* </span>VIP端口:
                          </label>
                          <input
                            type="text"
                            value={port.vipPort}
                            onChange={e => updatePortConfig(port.id, 'vipPort', e.target.value)}
                            className="flex-1 h-9 px-3 border border-[#E5E6EB] rounded text-sm text-[#1F2329] focus:outline-none focus:border-[#165DFF]"
                            placeholder="请输入VIP端口"
                          />
                        </div>
                        <div className="flex items-center flex-1">
                          <label className="w-24 flex-shrink-0 text-sm text-[#1F2329] text-right pr-3 whitespace-nowrap">
                            <span className="text-[#F53F3F]">* </span>RS端口:
                          </label>
                          <input
                            type="text"
                            value={port.rsPort}
                            onChange={e => updatePortConfig(port.id, 'rsPort', e.target.value)}
                            className="flex-1 h-9 px-3 border border-[#E5E6EB] rounded text-sm text-[#1F2329] focus:outline-none focus:border-[#165DFF]"
                            placeholder="请输入RS端口"
                          />
                        </div>
                      </div>

                      {/* 调度方式 + 健康检查方式 */}
                      <div className="flex">
                        <div className="flex items-center flex-1">
                          <label className="w-24 flex-shrink-0 text-sm text-[#1F2329] text-right pr-3 whitespace-nowrap">
                            <span className="text-[#F53F3F]">* </span>调度方式:
                          </label>
                          <div className="flex items-center gap-4">
                            {[
                              { key: 'wrr', label: 'Wrr(轮询)' },
                              { key: 'srch', label: 'Srch(ip hash)' },
                              { key: 'wlc', label: 'Wlc(最小连接数)' },
                            ].map(opt => (
                              <label key={opt.key} className="flex items-center gap-1.5 cursor-pointer">
                                <input type="radio" name={`scheduleMethod-${port.id}`} checked={port.scheduleMethod === opt.key} onChange={() => updatePortConfig(port.id, 'scheduleMethod', opt.key)} className="w-4 h-4 accent-[#165DFF]" />
                                <span className={`text-sm ${port.scheduleMethod === opt.key ? 'text-[#165DFF]' : 'text-[#1F2329]'}`}>{opt.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center flex-1">
                          <label className="w-24 flex-shrink-0 text-sm text-[#1F2329] text-right pr-3 whitespace-nowrap">
                            <span className="text-[#F53F3F]">* </span>健康检查:
                          </label>
                          <div className="flex items-center gap-4">
                            {[
                              { key: 'tcp', label: 'TCP_CHECK' },
                              { key: 'http', label: 'HTTP_GET' },
                              { key: 'ssl', label: 'SSL_GET' },
                            ].map(opt => (
                              <label key={opt.key} className="flex items-center gap-1.5 cursor-pointer">
                                <input type="radio" name={`healthCheck-${port.id}`} checked={port.healthCheckMethod === opt.key} onChange={() => updatePortConfig(port.id, 'healthCheckMethod', opt.key)} className="w-4 h-4 accent-[#165DFF]" />
                                <span className={`text-sm ${port.healthCheckMethod === opt.key ? 'text-[#165DFF]' : 'text-[#1F2329]'}`}>{opt.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* 添加端口按钮 */}
              <button
                onClick={addPortConfig}
                className="flex items-center gap-1 text-sm text-[#165DFF] hover:underline"
              >
                <Plus className="w-4 h-4" /> 添加端口
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="flex items-center justify-end gap-3 px-6 py-3 border-t border-[#E5E6EB] bg-white">
        <button
          onClick={onBack}
          className="px-4 py-1.5 text-sm text-[#1F2329] border border-[#E5E6EB] rounded hover:bg-[#F7F8FA]"
        >
          取消
        </button>
        <button className="px-4 py-1.5 text-sm text-[#1F2329] border border-[#E5E6EB] rounded hover:bg-[#F7F8FA]">
          Yaml
        </button>
        <button className="px-4 py-1.5 text-sm text-white bg-[#165DFF] rounded hover:bg-[#0E4ADB]">
          保存
        </button>
        <button className="px-4 py-1.5 text-sm text-white bg-[#165DFF] rounded hover:bg-[#0E4ADB]">
          发布
        </button>
      </div>
    </div>
  );
}
