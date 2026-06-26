'use client';

import { useState } from 'react';

export default function SettingsManagement() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    cpuLimitDefault: '9',
    cpuLimitMax: '65',
    memoryLimitDefault: '16',
    memoryLimitMax: '128',
    replicaLimitDefault: '400',
    replicaLimitMax: '400',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-5">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-sm text-[#8C9AAE]">
          <span className="cursor-pointer hover:text-[#165DFF]">产品团队-专用</span>
          <span className="mx-1.5">&gt;</span>
          <span className="cursor-pointer hover:text-[#165DFF]">stark测试</span>
          <span className="mx-1.5">&gt;</span>
          <span className="text-[#1F2329]">设置</span>
        </div>
        <a href="#" className="text-sm text-[#165DFF]">CIS帮助文档</a>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-[#E5E6EB] mb-5">
        <div className="flex">
          <button className="px-4 pb-2.5 text-sm font-medium text-[#165DFF] border-b-2 border-[#165DFF]">
            工作负载配额
          </button>
        </div>
        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-1.5 text-sm border border-[#D8E0E8] rounded text-[#1F2329] hover:bg-[#F8F9FA]"
            >
              取消
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-1.5 text-sm bg-[#165DFF] text-white rounded hover:bg-[#0E4BD8]"
            >
              保存
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-1.5 text-sm bg-[#165DFF] text-white rounded hover:bg-[#0E4BD8]"
          >
            编辑
          </button>
        )}
      </div>

      {/* 单容器资源限制 */}
      <div className="bg-white border border-[#E5E6EB] rounded p-5">
        <h3 className="text-base font-medium text-[#1F2329] mb-5">单容器资源限制</h3>
        
        <div className="grid grid-cols-2 gap-x-16 gap-y-5">
          {/* CPU Limit默认值 */}
          <div className="flex items-center">
            <label className="w-44 text-sm text-[#1F2329] shrink-0">CPU Limit默认值</label>
            <div className="flex items-center flex-1">
              <input
                type="text"
                value={formData.cpuLimitDefault}
                onChange={(e) => handleChange('cpuLimitDefault', e.target.value)}
                readOnly={!isEditing}
                className={`w-full h-9 px-3 text-sm rounded border ${
                  isEditing 
                    ? 'border-[#D8E0E8] bg-white focus:border-[#165DFF] focus:outline-none' 
                    : 'border-[#E5E6EB] bg-[#F7F8FA]'
                }`}
              />
              <span className="ml-2 text-sm text-[#8C9AAE] shrink-0">核</span>
            </div>
          </div>

          {/* CPU Limit最大值 */}
          <div className="flex items-center">
            <label className="w-44 text-sm text-[#1F2329] shrink-0">CPU Limit最大值</label>
            <div className="flex items-center flex-1">
              <input
                type="text"
                value={formData.cpuLimitMax}
                onChange={(e) => handleChange('cpuLimitMax', e.target.value)}
                readOnly={!isEditing}
                className={`w-full h-9 px-3 text-sm rounded border ${
                  isEditing 
                    ? 'border-[#D8E0E8] bg-white focus:border-[#165DFF] focus:outline-none' 
                    : 'border-[#E5E6EB] bg-[#F7F8FA]'
                }`}
              />
              <span className="ml-2 text-sm text-[#8C9AAE] shrink-0">核</span>
            </div>
          </div>

          {/* Memory Limit默认值 */}
          <div className="flex items-center">
            <label className="w-44 text-sm text-[#1F2329] shrink-0">Memory Limit默认值</label>
            <div className="flex items-center flex-1">
              <input
                type="text"
                value={formData.memoryLimitDefault}
                onChange={(e) => handleChange('memoryLimitDefault', e.target.value)}
                readOnly={!isEditing}
                className={`w-full h-9 px-3 text-sm rounded border ${
                  isEditing 
                    ? 'border-[#D8E0E8] bg-white focus:border-[#165DFF] focus:outline-none' 
                    : 'border-[#E5E6EB] bg-[#F7F8FA]'
                }`}
              />
              <span className="ml-2 text-sm text-[#8C9AAE] shrink-0">G</span>
            </div>
          </div>

          {/* Memory Limit最大值 */}
          <div className="flex items-center">
            <label className="w-44 text-sm text-[#1F2329] shrink-0">Memory Limit最大值</label>
            <div className="flex items-center flex-1">
              <input
                type="text"
                value={formData.memoryLimitMax}
                onChange={(e) => handleChange('memoryLimitMax', e.target.value)}
                readOnly={!isEditing}
                className={`w-full h-9 px-3 text-sm rounded border ${
                  isEditing 
                    ? 'border-[#D8E0E8] bg-white focus:border-[#165DFF] focus:outline-none' 
                    : 'border-[#E5E6EB] bg-[#F7F8FA]'
                }`}
              />
              <span className="ml-2 text-sm text-[#8C9AAE] shrink-0">G</span>
            </div>
          </div>

          {/* 单集群副本数限制默认值 */}
          <div className="flex items-center">
            <label className="w-44 text-sm text-[#1F2329] shrink-0">单集群副本数限制默认值</label>
            <div className="flex items-center flex-1">
              <input
                type="text"
                value={formData.replicaLimitDefault}
                onChange={(e) => handleChange('replicaLimitDefault', e.target.value)}
                readOnly={!isEditing}
                className={`w-full h-9 px-3 text-sm rounded border ${
                  isEditing 
                    ? 'border-[#D8E0E8] bg-white focus:border-[#165DFF] focus:outline-none' 
                    : 'border-[#E5E6EB] bg-[#F7F8FA]'
                }`}
              />
              <span className="ml-2 text-sm text-[#8C9AAE] shrink-0">份</span>
            </div>
          </div>

          {/* 单集群副本数限制最大值 */}
          <div className="flex items-center">
            <label className="w-44 text-sm text-[#1F2329] shrink-0">单集群副本数限制最大值</label>
            <div className="flex items-center flex-1">
              <input
                type="text"
                value={formData.replicaLimitMax}
                onChange={(e) => handleChange('replicaLimitMax', e.target.value)}
                readOnly={!isEditing}
                className={`w-full h-9 px-3 text-sm rounded border ${
                  isEditing 
                    ? 'border-[#D8E0E8] bg-white focus:border-[#165DFF] focus:outline-none' 
                    : 'border-[#E5E6EB] bg-[#F7F8FA]'
                }`}
              />
              <span className="ml-2 text-sm text-[#8C9AAE] shrink-0">份</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
