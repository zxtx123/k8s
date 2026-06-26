'use client';

import { useState } from 'react';
import { ChevronLeft, Plus, X, HelpCircle } from 'lucide-react';

interface CreateServiceProps {
  onCancel: () => void;
}

interface LabelRow {
  id: number;
  key: string;
  value: string;
  isDefault?: boolean;
}

interface PortRow {
  id: number;
  protocol: string;
  portName: string;
  containerPort: string;
  servicePort: string;
}

export default function CreateService({ onCancel }: CreateServiceProps) {
  const [name, setName] = useState('zxtest-');
  const [regions, setRegions] = useState<string[]>([]);
  const [serviceType, setServiceType] = useState('ClusterIP');
  const [releaseNote, setReleaseNote] = useState('');
  const [selector, setSelector] = useState('none');
  const [labels, setLabels] = useState<LabelRow[]>([
    { id: 1, key: 'app', value: 'zxtest-', isDefault: true },
  ]);
  const [ports, setPorts] = useState<PortRow[]>([
    { id: 1, protocol: 'TCP', portName: 'tcp-', containerPort: '', servicePort: '' },
  ]);
  const [sessionAffinity, setSessionAffinity] = useState(false);
  const [zones, setZones] = useState<string[]>([]);
  const [selectedCluster, setSelectedCluster] = useState('');

  const regionOptions = [
    { value: 'beijing', label: '北京' },
    { value: 'germany', label: '德国(法兰克福)' },
    { value: 'singapore', label: '新加坡' },
    { value: 'beijing-zpy', label: '北京中鹏云' },
    { value: 'shanghai', label: '上海' },
    { value: 'zhengzhou', label: '郑州' },
  ];

  const zoneOptions = [
    { value: 'bjpdc', label: 'bjpdc(北京联通25G)', recommended: true },
    { value: 'alicn', label: 'alicn(北京阿里云)' },
    { value: 'bjcm', label: 'bjcm(北京移动)' },
    { value: 'bjmd', label: 'bjmd(北京联通)' },
    { value: 'bjwdt', label: 'bjwdt(北京电信25G-特价)' },
    { value: 'bjzdt', label: 'bjzdt(北京电信25G)' },
  ];

  const clusterOptions = [
    { value: 'pub-bjpdc', label: 'pub-bjpdc' },
    { value: 'pub-bjmd', label: 'pub-bjmd' },
    { value: 'pub-bjwdt', label: 'pub-bjwdt' },
    { value: 'pub-bjzdt', label: 'pub-bjzdt' },
    { value: 'pub-bjyt', label: 'pub-bjyt' },
  ];

  const handleRegionChange = (value: string) => {
    setRegions((prev) =>
      prev.includes(value) ? prev.filter((r) => r !== value) : [...prev, value]
    );
    setZones([]);
    setSelectedCluster('');
  };

  const handleZoneChange = (value: string) => {
    setZones((prev) =>
      prev.includes(value) ? prev.filter((z) => z !== value) : [...prev, value]
    );
  };

  const addLabel = () => {
    setLabels([...labels, { id: Date.now(), key: '', value: '' }]);
  };

  const removeLabel = (id: number) => {
    setLabels(labels.filter((l) => l.id !== id));
  };

  const updateLabel = (id: number, field: 'key' | 'value', val: string) => {
    setLabels(labels.map((l) => (l.id === id ? { ...l, [field]: val } : l)));
  };

  const addPort = () => {
    setPorts([
      ...ports,
      { id: Date.now(), protocol: 'TCP', portName: 'tcp-', containerPort: '', servicePort: '' },
    ]);
  };

  const removePort = (id: number) => {
    setPorts(ports.filter((p) => p.id !== id));
  };

  const updatePort = (id: number, field: keyof PortRow, val: string) => {
    setPorts(ports.map((p) => (p.id === id ? { ...p, [field]: val } : p)));
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center px-6 py-3 border-b border-[#E5E6EB]">
        <button
          onClick={onCancel}
          className="flex items-center text-[#86909C] hover:text-[#1F2329] mr-3"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold text-[#1F2329]">创建Service</h1>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-auto px-6 py-5 space-y-5">
        {/* 名称 */}
        <div className="flex items-start">
          <label className="w-28 flex-shrink-0 pt-2 text-sm text-[#1F2329]">
            <span className="text-[#F53F3F]">* </span>名称:
          </label>
          <div className="flex-1">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full max-w-xl h-9 px-3 text-sm border border-[#E5E6EB] rounded focus:outline-none focus:border-[#165DFF]"
            />
            <p className="mt-1 text-xs text-[#86909C]">
              验证规则[a-z0-9]([-a-z0-9]*[a-z0-9])?
            </p>
          </div>
        </div>

        {/* 地域 */}
        <div className="flex items-start">
          <label className="w-28 flex-shrink-0 pt-0.5 text-sm text-[#1F2329]">
            <span className="text-[#F53F3F]">* </span>地域:
          </label>
          <div className="flex-1">
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {regionOptions.map((region) => (
                <label key={region.value} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={regions.includes(region.value)}
                    onChange={() => handleRegionChange(region.value)}
                    className="w-4 h-4 rounded border-[#C9CDD4] text-[#165DFF] focus:ring-[#165DFF]"
                  />
                  <span className="text-sm text-[#1F2329]">{region.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 可用区 */}
        <div className="flex items-start">
          <label className="w-28 flex-shrink-0 pt-0.5 text-sm text-[#1F2329]">
            <span className="text-[#F53F3F]">* </span>可用区:
          </label>
          <div className="flex-1">
            {regions.length === 0 ? (
              <p className="text-sm text-[#F53F3F]">请至少选择一个地域</p>
            ) : (
              <div>
                <label className="flex items-center gap-1.5 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={zones.length === zoneOptions.length}
                    onChange={() => {
                      if (zones.length === zoneOptions.length) {
                        setZones([]);
                      } else {
                        setZones(zoneOptions.map((z) => z.value));
                      }
                    }}
                    className="w-4 h-4 rounded border-[#C9CDD4] text-[#165DFF] focus:ring-[#165DFF]"
                  />
                  <span className="text-sm text-[#1F2329]">全选</span>
                </label>
                <div className="flex flex-wrap gap-x-5 gap-y-2 pl-5">
                  {zoneOptions.map((zone) => (
                    <label key={zone.value} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={zones.includes(zone.value)}
                        onChange={() => handleZoneChange(zone.value)}
                        className="w-4 h-4 rounded border-[#C9CDD4] text-[#165DFF] focus:ring-[#165DFF]"
                      />
                      <span className="text-sm text-[#1F2329]">{zone.label}</span>
                      {zone.recommended && (
                        <span className="text-xs text-white bg-[#F53F3F] rounded px-1.5 py-0.5 leading-none">推荐</span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 集群 */}
        <div className="flex items-start">
          <label className="w-28 flex-shrink-0 pt-0.5 text-sm text-[#1F2329]">
            <span className="text-[#F53F3F]">* </span>集群:
          </label>
          <div className="flex-1">
            {zones.length === 0 ? (
              <p className="text-sm text-[#F53F3F]">请至少选择一个集群</p>
            ) : (
              <div className="relative w-80">
                <select
                  value={selectedCluster}
                  onChange={(e) => setSelectedCluster(e.target.value)}
                  className="w-full h-9 pl-3 pr-16 text-sm border border-[#E5E6EB] rounded bg-white focus:outline-none focus:border-[#165DFF] appearance-none"
                >
                  <option value="">请选择集群</option>
                  {clusterOptions.map((cluster) => (
                    <option key={cluster.value} value={cluster.value}>
                      {cluster.label}
                    </option>
                  ))}
                </select>
                {selectedCluster && (
                  <button
                    onClick={() => setSelectedCluster('')}
                    className="absolute right-7 top-1/2 -translate-y-1/2 text-[#86909C] hover:text-[#1F2329]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-[#86909C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 类型 */}
        <div className="flex items-center">
          <label className="w-28 flex-shrink-0 text-sm text-[#1F2329]">
            <span className="text-[#F53F3F]">* </span>类型
          </label>
          <div className="flex items-center gap-1">
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="h-9 px-3 text-sm border border-[#E5E6EB] rounded bg-white focus:outline-none focus:border-[#165DFF]"
            >
              <option value="ClusterIP">集群IP访问(ClusterIP)</option>
              <option value="NodePort">节点端口访问(NodePort)</option>
              <option value="LoadBalancer">负载均衡(LoadBalancer)</option>
            </select>
            <HelpCircle className="w-4 h-4 text-[#86909C] cursor-help" />
          </div>
        </div>

        {/* 发布说明 */}
        <div className="flex items-start">
          <label className="w-28 flex-shrink-0 pt-2 text-sm text-[#1F2329]">
            <span className="text-[#F53F3F]">* </span>发布说明:
          </label>
          <textarea
            value={releaseNote}
            onChange={(e) => setReleaseNote(e.target.value)}
            className="flex-1 max-w-xl h-24 px-3 py-2 text-sm border border-[#E5E6EB] rounded resize-y focus:outline-none focus:border-[#165DFF]"
          />
        </div>

        {/* 选择器 */}
        <div className="flex items-start">
          <label className="w-28 flex-shrink-0 pt-2 text-sm text-[#1F2329]">
            <span className="text-[#F53F3F]">* </span>选择器:
          </label>
          <div className="flex-1">
            <select
              value={selector}
              onChange={(e) => setSelector(e.target.value)}
              className="h-9 px-3 text-sm border border-[#E5E6EB] rounded bg-white focus:outline-none focus:border-[#165DFF] mb-3"
            >
              <option value="none">不指定Workload</option>
              <option value="deployment">指定Deployment</option>
              <option value="statefulset">指定StatefulSet</option>
            </select>

            {/* 提示 */}
            <div className="flex items-center gap-2 px-3 py-2 bg-[#E8F3FF] rounded mb-3">
              <div className="w-4 h-4 rounded-full bg-[#165DFF] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs">i</span>
              </div>
              <span className="text-sm text-[#86909C]">默认标签不可以编辑和删除</span>
            </div>

            {/* 标签表格 */}
            <div className="border border-[#E5E6EB] rounded overflow-hidden mb-3">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F7F8FA]">
                    <th className="text-left text-sm text-[#86909C] font-normal px-3 py-2">键</th>
                    <th className="text-left text-sm text-[#86909C] font-normal px-3 py-2">值</th>
                    <th className="text-center text-sm text-[#86909C] font-normal px-3 py-2 w-16">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {labels.map((label) => (
                    <tr key={label.id} className="border-t border-[#E5E6EB]">
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={label.key}
                          onChange={(e) => updateLabel(label.id, 'key', e.target.value)}
                          disabled={label.isDefault}
                          className="w-full h-8 px-2 text-sm border border-[#E5E6EB] rounded bg-white disabled:bg-[#F7F8FA] disabled:text-[#86909C] focus:outline-none focus:border-[#165DFF]"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={label.value}
                          onChange={(e) => updateLabel(label.id, 'value', e.target.value)}
                          disabled={label.isDefault}
                          className="w-full h-8 px-2 text-sm border border-[#E5E6EB] rounded bg-white disabled:bg-[#F7F8FA] disabled:text-[#86909C] focus:outline-none focus:border-[#165DFF]"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        {!label.isDefault && (
                          <button
                            onClick={() => removeLabel(label.id)}
                            className="text-sm text-[#86909C] hover:text-[#F53F3F]"
                          >
                            删除
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 添加按钮 */}
            <button
              onClick={addLabel}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#165DFF] text-white text-sm rounded hover:bg-[#0E4ADB]"
            >
              <Plus className="w-4 h-4" />
              添加
            </button>
          </div>
        </div>

        {/* 端口 */}
        <div className="flex items-start">
          <label className="w-28 flex-shrink-0 pt-2 text-sm text-[#1F2329]">
            <span className="text-[#F53F3F]">* </span>端口:
          </label>
          <div className="flex-1">
            <div className="border border-[#E5E6EB] rounded overflow-hidden mb-3">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F7F8FA]">
                    <th className="text-left text-sm text-[#86909C] font-normal px-3 py-2">协议</th>
                    <th className="text-left text-sm text-[#86909C] font-normal px-3 py-2">端口名称</th>
                    <th className="text-left text-sm text-[#86909C] font-normal px-3 py-2">容器端口</th>
                    <th className="text-left text-sm text-[#86909C] font-normal px-3 py-2">服务端口</th>
                    <th className="text-center text-sm text-[#86909C] font-normal px-3 py-2 w-16">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {ports.map((port) => (
                    <tr key={port.id} className="border-t border-[#E5E6EB]">
                      <td className="px-3 py-2">
                        <select
                          value={port.protocol}
                          onChange={(e) => updatePort(port.id, 'protocol', e.target.value)}
                          className="h-8 px-2 text-sm border border-[#E5E6EB] rounded bg-white focus:outline-none focus:border-[#165DFF]"
                        >
                          <option value="TCP">TCP</option>
                          <option value="UDP">UDP</option>
                          <option value="SCTP">SCTP</option>
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={port.portName}
                          onChange={(e) => updatePort(port.id, 'portName', e.target.value)}
                          className="w-full h-8 px-2 text-sm border border-[#E5E6EB] rounded focus:outline-none focus:border-[#165DFF]"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={port.containerPort}
                          onChange={(e) => updatePort(port.id, 'containerPort', e.target.value)}
                          placeholder="1-65535"
                          className="w-full h-8 px-2 text-sm border border-[#E5E6EB] rounded focus:outline-none focus:border-[#165DFF] placeholder:text-[#C9CDD4]"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={port.servicePort}
                          onChange={(e) => updatePort(port.id, 'servicePort', e.target.value)}
                          placeholder="1-65535"
                          className="w-full h-8 px-2 text-sm border border-[#E5E6EB] rounded focus:outline-none focus:border-[#165DFF] placeholder:text-[#C9CDD4]"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        {ports.length > 1 && (
                          <button
                            onClick={() => removePort(port.id)}
                            className="text-sm text-[#86909C] hover:text-[#F53F3F]"
                          >
                            删除
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 新增端口按钮 */}
            <button
              onClick={addPort}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#165DFF] text-white text-sm rounded hover:bg-[#0E4ADB]"
            >
              <Plus className="w-4 h-4" />
              新增端口
            </button>
          </div>
        </div>

        {/* 会话保持 */}
        <div className="flex items-center">
          <label className="w-28 flex-shrink-0 text-sm text-[#1F2329]">会话保持:</label>
          <button
            onClick={() => setSessionAffinity(!sessionAffinity)}
            className={`relative w-10 h-5 rounded-full transition-colors ${
              sessionAffinity ? 'bg-[#165DFF]' : 'bg-[#C9CDD4]'
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                sessionAffinity ? 'left-5' : 'left-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E5E6EB]">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm text-[#4E5969] border border-[#E5E6EB] rounded hover:bg-[#F7F8FA]"
        >
          取消
        </button>
        <button className="px-4 py-2 text-sm text-white bg-[#165DFF] rounded hover:bg-[#0E4ADB]">
          Yaml
        </button>
        <button className="px-4 py-2 text-sm text-white bg-[#165DFF] rounded hover:bg-[#0E4ADB]">
          保存
        </button>
        <button className="px-4 py-2 text-sm text-white bg-[#165DFF] rounded hover:bg-[#0E4ADB]">
          发布
        </button>
      </div>
    </div>
  );
}
