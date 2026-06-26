'use client';

import { useState } from 'react';

interface VersionData {
  id: number;
  version: string;
  releaseNote: string;
  image: string;
}

interface EditDeploymentVersionProps {
  deploymentName: string;
  version: VersionData;
  onBack: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function EditDeploymentVersion({ version, onBack, onCancel, onSave }: EditDeploymentVersionProps) {
  const [jobType, setJobType] = useState('ls');
  const [containerName, setContainerName] = useState('container1');
  const [containerType, setContainerType] = useState('standard');
  const [imageRegistry, setImageRegistry] = useState('basic');
  const [imageRepo, setImageRepo] = useState('library/nginx');
  const [imageTag, setImageTag] = useState(version.image.split(':')[1] || '1.25-alpine-ipv6toa');
  const [imagePullPolicy, setImagePullPolicy] = useState('IfNotPresent');
  const [cpu, setCpu] = useState('0.5');
  const [memory, setMemory] = useState('1Gi');
  const [disk, setDisk] = useState('');
  const [moreConfigTab, setMoreConfigTab] = useState('health');
  const [readinessProbe, setReadinessProbe] = useState(false);
  const [livenessProbe, setLivenessProbe] = useState(false);
  const [startupProbe, setStartupProbe] = useState(false);

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
          <button type="button" onClick={onBack} className="text-[#165DFF] cursor-pointer hover:text-[#0E4ADB]">
            版本列表
          </button>
          <span className="mx-2">&gt;</span>
          <span className="text-[#1F2329]">更新Deployment</span>
        </div>
        <a href="#" className="text-[#165DFF] text-sm hover:text-[#0E4ADB]">CIS帮助文档</a>
      </div>

      <div className="flex-1 overflow-auto px-5 py-4">
        <div className="bg-white border border-[#E5E6EB] rounded-sm min-h-full">
          <div className="h-12 px-5 flex items-center border-b border-[#E5E6EB]">
            <button type="button" onClick={onBack} className="text-[#4E5969] hover:text-[#1F2329] text-sm mr-4">
              &lt; 返回
            </button>
            <h1 className="text-sm font-medium text-[#1F2329]">更新Deployment[{version.version}]</h1>
          </div>

          <div className="p-5 max-w-6xl space-y-6">
            <section>
              <div className="flex items-center mb-4">
                <span className="w-1 h-4 bg-[#165DFF] rounded-r mr-2" />
                <h2 className="text-sm font-medium text-[#1F2329]">部署配置</h2>
              </div>

              <div className="space-y-5">
                <div className="flex items-center">
                  <label className="w-36 flex-shrink-0 text-sm text-[#1F2329] text-right pr-3 whitespace-nowrap">
                    <span className="text-[#F53F3F] mr-0.5">*</span>作业类型:
                  </label>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    {[
                      ['ls', '共享型（LS）'],
                      ['lsr', '独占优先型（LSR）'],
                      ['be', '离线型（BE）'],
                      ['lse', '独占排他型（LSE）'],
                    ].map(([value, label]) => (
                      <label key={value} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="updateJobType" checked={jobType === value} onChange={() => setJobType(value)} className="w-4 h-4 accent-[#165DFF]" />
                        <span className={`text-sm ${jobType === value ? 'text-[#165DFF]' : 'text-[#1F2329]'}`}>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border border-[#E5E6EB] rounded-sm overflow-hidden">
                  <div className="px-4 py-3 bg-[#F7F8FA] border-b border-[#E5E6EB] flex items-center justify-between">
                    <span className="text-sm font-medium text-[#1F2329]">容器配置</span>
                    <button type="button" className="text-sm text-[#165DFF] hover:text-[#0E4ADB]">+ 添加容器</button>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      <div className="flex items-center">
                        <label className="w-28 text-sm text-[#4E5969]">名称</label>
                        <input value={containerName} onChange={(event) => setContainerName(event.target.value)} className="flex-1 h-8 px-3 text-sm border border-[#E5E6EB] rounded focus:outline-none focus:border-[#165DFF]" />
                      </div>
                      <div className="flex items-center">
                        <label className="w-28 text-sm text-[#4E5969]">容器类型</label>
                        <select value={containerType} onChange={(event) => setContainerType(event.target.value)} className="flex-1 h-8 px-3 text-sm border border-[#E5E6EB] rounded bg-white focus:outline-none focus:border-[#165DFF]">
                          <option value="standard">标准容器</option>
                          <option value="init">Init容器</option>
                        </select>
                      </div>
                      <div className="flex items-center">
                        <label className="w-28 text-sm text-[#4E5969]">选择镜像</label>
                        <select value={imageRegistry} onChange={(event) => setImageRegistry(event.target.value)} className="flex-1 h-8 px-3 text-sm border border-[#E5E6EB] rounded bg-white focus:outline-none focus:border-[#165DFF]">
                          <option value="basic">基础镜像</option>
                          <option value="custom">自定义镜像</option>
                        </select>
                      </div>
                      <div className="flex items-center">
                        <label className="w-28 text-sm text-[#4E5969]">镜像仓库</label>
                        <input value={imageRepo} onChange={(event) => setImageRepo(event.target.value)} className="flex-1 h-8 px-3 text-sm border border-[#E5E6EB] rounded focus:outline-none focus:border-[#165DFF]" />
                      </div>
                      <div className="flex items-center">
                        <label className="w-28 text-sm text-[#4E5969]">镜像版本</label>
                        <input value={imageTag} onChange={(event) => setImageTag(event.target.value)} className="flex-1 h-8 px-3 text-sm border border-[#E5E6EB] rounded focus:outline-none focus:border-[#165DFF]" />
                      </div>
                      <div className="flex items-center">
                        <label className="w-28 text-sm text-[#4E5969]">资源配置</label>
                        <div className="flex items-center gap-2 flex-1">
                          <input value={cpu} onChange={(event) => setCpu(event.target.value)} className="w-20 h-8 px-2 text-sm border border-[#E5E6EB] rounded focus:outline-none focus:border-[#165DFF]" />
                          <span className="text-sm text-[#4E5969]">C</span>
                          <input value={memory} onChange={(event) => setMemory(event.target.value)} className="w-24 h-8 px-2 text-sm border border-[#E5E6EB] rounded focus:outline-none focus:border-[#165DFF]" />
                          <span className="text-sm text-[#4E5969]">内存</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <label className="w-28 text-sm text-[#4E5969]">本地盘</label>
                        <input value={disk} onChange={(event) => setDisk(event.target.value)} placeholder="不填则使用默认值" className="flex-1 h-8 px-3 text-sm border border-[#E5E6EB] rounded focus:outline-none focus:border-[#165DFF]" />
                      </div>
                    </div>

                    <div className="flex items-start">
                      <label className="w-28 text-sm text-[#4E5969] pt-1">镜像拉取策略</label>
                      <div className="flex flex-col gap-2">
                        {[
                          ['IfNotPresent', '镜像在本地不存在时才拉取（IfNotPresent）'],
                          ['Always', '总是从仓库拉取（Always）'],
                          ['Never', '禁止从仓库拉取，只能使用Pod所在Node上的镜像（Never）'],
                        ].map(([value, label]) => (
                          <label key={value} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="updateImagePullPolicy" checked={imagePullPolicy === value} onChange={() => setImagePullPolicy(value)} className="w-4 h-4 accent-[#165DFF]" />
                            <span className={`text-sm ${imagePullPolicy === value ? 'text-[#165DFF]' : 'text-[#1F2329]'}`}>{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center mb-5">
                    <span className="w-1 h-6 bg-[#168CFF] mr-3" />
                    <span className="text-base font-medium text-[#1F2329]">更多配置</span>
                    <span className="ml-2 text-[#8C9AAE] text-sm">⌄</span>
                  </div>

                  <div className="flex min-h-[204px]">
                    <div className="w-40 flex-shrink-0 py-1 space-y-8">
                      {[
                        ['health', '健康检查', '建议开启'],
                        ['log', '日志收集', ''],
                        ['command', '启动命令', ''],
                        ['volume', '数据卷', ''],
                        ['env', '环境变量', ''],
                        ['lifecycle', '生命周期', ''],
                      ].map(([key, label, desc]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setMoreConfigTab(key)}
                          className={`w-full flex items-start justify-between text-left pr-5 text-sm ${moreConfigTab === key ? 'text-[#168CFF] font-medium' : 'text-[#1F2329] hover:text-[#168CFF]'}`}
                        >
                          <span className="leading-5">
                            {label}
                            {desc && <span className="block">{desc}</span>}
                          </span>
                          <span className="mt-0.5 inline-flex items-center justify-center w-4 h-4 rounded-full border border-[#B8C2CC] text-[#8C9AAE] text-xs font-normal">?</span>
                        </button>
                      ))}
                    </div>

                    <div className="flex-1 bg-[#F6F8FB] border-l-2 border-[#168CFF] px-5 py-5">
                      {moreConfigTab === 'health' ? (
                        <div className="space-y-7 text-sm text-[#1F2329]">
                          <label className="flex items-center gap-3">
                            <span>就绪探针（建议开启）</span>
                            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-[#B8C2CC] text-[#8C9AAE] text-xs">!</span>
                            <button
                              type="button"
                              onClick={() => setReadinessProbe((prev) => !prev)}
                              className={`relative w-11 h-6 rounded-full transition-colors ${readinessProbe ? 'bg-[#168CFF]' : 'bg-[#B8C7D3]'}`}
                            >
                              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${readinessProbe ? 'left-6' : 'left-1'}`} />
                            </button>
                          </label>
                          <label className="flex items-center gap-3">
                            <span>存活探针</span>
                            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-[#B8C2CC] text-[#8C9AAE] text-xs">!</span>
                            <button
                              type="button"
                              onClick={() => setLivenessProbe((prev) => !prev)}
                              className={`relative w-11 h-6 rounded-full transition-colors ${livenessProbe ? 'bg-[#168CFF]' : 'bg-[#B8C7D3]'}`}
                            >
                              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${livenessProbe ? 'left-6' : 'left-1'}`} />
                            </button>
                          </label>
                          <label className="flex items-center gap-3">
                            <span>启动探针</span>
                            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-[#B8C2CC] text-[#8C9AAE] text-xs">!</span>
                            <button
                              type="button"
                              onClick={() => setStartupProbe((prev) => !prev)}
                              className={`relative w-11 h-6 rounded-full transition-colors ${startupProbe ? 'bg-[#168CFF]' : 'bg-[#B8C7D3]'}`}
                            >
                              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${startupProbe ? 'left-6' : 'left-1'}`} />
                            </button>
                          </label>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-sm text-[#8C9AAE]">
                          暂无配置项
                        </div>
                      )}
                    </div>
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
            更新
          </button>
        </div>
      </div>
    </div>
  );
}
