'use client';

import { useState } from 'react';

interface EditDeploymentData {
  id: number;
  name: string;
  description: string;
}

interface EditDeploymentProps {
  deployment: EditDeploymentData;
  onBack: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function EditDeployment({ deployment, onBack, onCancel, onSave }: EditDeploymentProps) {
  const [releaseNote, setReleaseNote] = useState(deployment.description || 'fffffffff');
  const [inPlaceUpgrade, setInPlaceUpgrade] = useState(false);
  const [networkType, setNetworkType] = useState<'classic' | 'vpc'>('classic');
  const [regions, setRegions] = useState<string[]>(['beijing']);
  const [zones, setZones] = useState<string[]>(['bjpgdc']);

  const regionOptions = [
    { id: 'beijing', label: '北京' },
    { id: 'frankfurt', label: '德国（法兰克福）' },
    { id: 'singapore', label: '新加坡' },
    { id: 'beijingzp', label: '北京中鹏云' },
    { id: 'shanghai', label: '上海' },
    { id: 'zhengzhou', label: '郑州' },
  ];

  const zoneOptions = [
    { id: 'bjpgdc', label: 'bjpgdc(北京联通25G)', recommended: true },
    { id: 'alicn', label: 'alicn(北京阿里云)' },
    { id: 'bjcm', label: 'bjcm(北京移动)' },
    { id: 'bjmd', label: 'bjmd(北京联通)' },
    { id: 'bjwdt', label: 'bjwdt(北京电信25G-特价)' },
    { id: 'bjzdt', label: 'bjzdt(北京电信25G)' },
  ];

  const toggleRegion = (regionId: string) => {
    setRegions((prev) =>
      prev.includes(regionId) ? prev.filter((item) => item !== regionId) : [...prev, regionId]
    );
  };

  const toggleZone = (zoneId: string) => {
    setZones((prev) =>
      prev.includes(zoneId) ? prev.filter((item) => item !== zoneId) : [...prev, zoneId]
    );
  };

  const toggleAllZones = () => {
    setZones((prev) => (prev.length === zoneOptions.length ? [] : zoneOptions.map((zone) => zone.id)));
  };

  return (
    <div className="h-full flex flex-col bg-[#F7F9FB]">
      <div className="h-14 flex items-center justify-between px-5 flex-shrink-0 bg-white border-b border-[#E5E6EB]">
        <div className="flex items-center text-sm text-[#86909C]">
          <span className="text-[#165DFF] cursor-pointer hover:text-[#0E4ADB]">stark测试</span>
          <span className="mx-2">&gt;</span>
          <span className="text-[#165DFF] cursor-pointer hover:text-[#0E4ADB]">zxtest</span>
          <span className="mx-2">&gt;</span>
          <button type="button" onClick={onBack} className="text-[#165DFF] cursor-pointer hover:text-[#0E4ADB]">
            Deployment
          </button>
          <span className="mx-2">&gt;</span>
          <span className="text-[#1F2329]">编辑Deployment</span>
        </div>
        <a href="#" className="text-[#165DFF] text-sm hover:text-[#0E4ADB]">CIS帮助文档</a>
      </div>

      <div className="flex-1 overflow-auto px-5 py-4">
        <div className="bg-white border border-[#E5E6EB] rounded-sm min-h-full">
          <div className="h-12 px-5 flex items-center border-b border-[#E5E6EB]">
            <button type="button" onClick={onBack} className="text-[#4E5969] hover:text-[#1F2329] text-sm mr-4">
              &lt; 返回
            </button>
            <h1 className="text-sm font-medium text-[#1F2329]">编辑Deployment</h1>
          </div>

          <div className="p-5 max-w-6xl space-y-6">
            <section>
              <div className="flex items-center mb-4">
                <span className="w-1 h-4 bg-[#165DFF] rounded-r mr-2" />
                <h2 className="text-sm font-medium text-[#1F2329]">基本信息</h2>
              </div>

              <div className="space-y-5">
                <div className="flex items-center">
                  <label className="w-36 flex-shrink-0 text-sm text-[#1F2329] text-right pr-3 whitespace-nowrap">
                    <span className="text-[#F53F3F] mr-0.5">*</span>Deployment名称:
                  </label>
                  <div className="flex-1 flex items-center gap-3">
                    <input
                      type="text"
                      value={deployment.name}
                      disabled
                      className="flex-1 h-8 px-3 text-sm border border-[#D8E0E8] rounded bg-[#F2F3F5] text-[#86909C] cursor-not-allowed"
                    />
                    <span className="text-xs text-[#8C9AAE] whitespace-nowrap">Deployment名称创建后不可修改</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <label className="w-36 flex-shrink-0 text-sm text-[#1F2329] text-right pr-3 whitespace-nowrap">
                    <span className="text-[#F53F3F] mr-0.5">*</span>版本名称:
                  </label>
                  <div className="flex-1">
                    <input
                      type="text"
                      value="V1"
                      disabled
                      className="w-full h-8 px-3 text-sm border border-[#D8E0E8] rounded bg-[#F2F3F5] text-[#86909C] cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="flex items-start">
                  <label className="w-36 flex-shrink-0 text-sm text-[#1F2329] text-right pr-3 whitespace-nowrap pt-1.5">
                    <span className="text-[#F53F3F] mr-0.5">*</span>发布说明:
                  </label>
                  <div className="flex-1">
                    <textarea
                      value={releaseNote}
                      onChange={(event) => setReleaseNote(event.target.value)}
                      className="w-full h-24 px-3 py-2 text-sm border border-[#D8E0E8] rounded focus:border-[#165DFF] focus:outline-none resize-y"
                      placeholder="请至少输入8个字符（一个汉字=2个字符），最大512个字符或者256个汉字"
                    />
                    {!releaseNote && <p className="mt-1 text-xs text-[#F53F3F]">请输入发布说明</p>}
                  </div>
                </div>

                <div className="flex items-start">
                  <label className="w-36 flex-shrink-0 text-sm text-[#1F2329] text-right pr-3 whitespace-nowrap pt-1">原地升级:</label>
                  <div className="flex-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inPlaceUpgrade}
                        onChange={(event) => setInPlaceUpgrade(event.target.checked)}
                        className="w-4 h-4 rounded border-[#D8E0E8] accent-[#165DFF]"
                      />
                      <span className="text-sm text-[#1F2329]">原地升级</span>
                      <span className="text-xs text-[#8C9AAE] ml-1">选择支持原地升级后，在发布或更新时会支持原地升级选项。</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center">
                  <label className="w-36 flex-shrink-0 text-sm text-[#1F2329] text-right pr-3 whitespace-nowrap">
                    <span className="text-[#F53F3F] mr-0.5">*</span>网络类型:
                  </label>
                  <div className="flex-1 flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="editNetworkType" checked={networkType === 'classic'} onChange={() => setNetworkType('classic')} className="w-4 h-4 accent-[#165DFF]" />
                      <span className={`text-sm ${networkType === 'classic' ? 'text-[#165DFF]' : 'text-[#1F2329]'}`}>经典网络</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="editNetworkType" checked={networkType === 'vpc'} onChange={() => setNetworkType('vpc')} className="w-4 h-4 accent-[#165DFF]" />
                      <span className={`text-sm ${networkType === 'vpc' ? 'text-[#165DFF]' : 'text-[#1F2329]'}`}>专有网络</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-start">
                  <label className="w-36 flex-shrink-0 text-sm text-[#1F2329] text-right pr-3 whitespace-nowrap pt-1">
                    <span className="text-[#F53F3F] mr-0.5">*</span>地域:
                  </label>
                  <div className="flex-1 flex flex-wrap gap-x-4 gap-y-2">
                    {regionOptions.map((region) => (
                      <label key={region.id} className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={regions.includes(region.id)} onChange={() => toggleRegion(region.id)} className="w-4 h-4 rounded border-[#D8E0E8] accent-[#165DFF]" />
                        <span className="text-sm text-[#1F2329]">{region.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-start">
                  <label className="w-36 flex-shrink-0 text-sm text-[#1F2329] text-right pr-3 whitespace-nowrap pt-1">
                    <span className="text-[#F53F3F] mr-0.5">*</span>可用区:
                  </label>
                  <div className="flex-1">
                    <label className="flex items-center gap-1.5 cursor-pointer mb-2">
                      <input type="checkbox" checked={zones.length === zoneOptions.length} onChange={toggleAllZones} className="w-4 h-4 rounded border-[#D8E0E8] accent-[#165DFF]" />
                      <span className="text-sm text-[#1F2329]">全选</span>
                    </label>
                    <div className="flex flex-wrap gap-x-3 gap-y-2">
                      {zoneOptions.map((zone) => (
                        <label key={zone.id} className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                          <input type="checkbox" checked={zones.includes(zone.id)} onChange={() => toggleZone(zone.id)} className="w-4 h-4 rounded border-[#D8E0E8] accent-[#165DFF]" />
                          <span className="text-sm text-[#1F2329]">{zone.label}</span>
                          {zone.recommended && <span className="text-xs text-[#00B42A]">推荐</span>}
                        </label>
                      ))}
                    </div>
                    {zones.length === 0 && <p className="mt-1 text-xs text-[#F53F3F]">请至少选择一个可用区</p>}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 bg-white border-t border-[#E5E6EB]">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#F53F3F]">单实例预估费用:</span>
          <span className="text-[#1F2329]">折后价 <span className="font-medium">16.21元/月</span></span>
          <span className="text-xs text-[#86909C] line-through">官方价 38.97元/月</span>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={onCancel} className="h-8 px-4 text-sm border border-[#E5E6EB] rounded text-[#1F2329] bg-white hover:bg-[#F2F3F5]">
            取消
          </button>
          <button type="button" className="h-8 px-4 text-sm border border-[#E5E6EB] rounded text-[#1F2329] bg-white hover:bg-[#F2F3F5]">
            Yaml
          </button>
          <button type="button" onClick={onSave} className="h-8 px-4 text-sm bg-[#165DFF] text-white rounded hover:bg-[#0E4ADB]">
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
