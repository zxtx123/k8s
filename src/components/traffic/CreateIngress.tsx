'use client';

import { useState } from 'react';

interface AccessRule {
  id: number;
  pathType: string;
  path: string;
  service: string;
  port: string;
}

export default function CreateIngress({ onCancel }: { onCancel: () => void }) {
  const [ingressType, setIngressType] = useState<'lb7' | 'nginx'>('lb7');
  const [ingressName, setIngressName] = useState('');
  const [releaseNote, setReleaseNote] = useState('');
  const [region, setRegion] = useState(false);
  const [activeRuleTab, setActiveRuleTab] = useState<'rules' | 'annotations'>('rules');
  const [domain, setDomain] = useState('');
  const [httpsCert, setHttpsCert] = useState('');
  const [rules, setRules] = useState<AccessRule[]>([
    { id: 1, pathType: '前缀匹配', path: '', service: '', port: '' },
  ]);

  const addRule = () => {
    setRules([...rules, { id: Date.now(), pathType: '前缀匹配', path: '', service: '', port: '' }]);
  };

  const removeRule = (id: number) => {
    if (rules.length > 1) {
      setRules(rules.filter((r) => r.id !== id));
    }
  };

  const updateRule = (id: number, field: keyof AccessRule, value: string) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 头部 */}
      <div className="px-6 py-4 border-b border-[#E5E6EB]">
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="text-[#4E5969] hover:text-[#165DFF]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-base font-semibold text-[#1D2129]">创建Ingress</h1>
          <div className="flex items-center gap-4 ml-6">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <span
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  ingressType === 'lb7' ? 'border-[#165DFF]' : 'border-[#C9CDD4]'
                }`}
                onClick={() => setIngressType('lb7')}
              >
                {ingressType === 'lb7' && <span className="w-2 h-2 rounded-full bg-[#165DFF]" />}
              </span>
              <span className={`text-sm ${ingressType === 'lb7' ? 'text-[#165DFF]' : 'text-[#4E5969]'}`}>七层负载均衡</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <span
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  ingressType === 'nginx' ? 'border-[#165DFF]' : 'border-[#C9CDD4]'
                }`}
                onClick={() => setIngressType('nginx')}
              >
                {ingressType === 'nginx' && <span className="w-2 h-2 rounded-full bg-[#165DFF]" />}
              </span>
              <span className={`text-sm ${ingressType === 'nginx' ? 'text-[#165DFF]' : 'text-[#4E5969]'}`}>Nginx Ingress</span>
            </label>
          </div>
        </div>
      </div>

      {/* 表单区域 */}
      <div className="flex-1 overflow-auto px-6 py-5">
        <div className="max-w-3xl space-y-5">
          {/* 基础信息 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-red-500">*</span>
              <label className="text-sm text-[#4E5969] whitespace-nowrap">ingress名称:</label>
              <input
                type="text"
                value={ingressName}
                onChange={(e) => setIngressName(e.target.value)}
                placeholder="请输入名称"
                className="flex-1 h-9 px-3 text-sm border border-[#E5E6EB] rounded focus:outline-none focus:border-[#165DFF]"
              />
            </div>

            <div className="flex items-start gap-2">
              <span className="text-red-500 mt-2">*</span>
              <label className="text-sm text-[#4E5969] whitespace-nowrap mt-2">发布说明:</label>
              <textarea
                value={releaseNote}
                onChange={(e) => setReleaseNote(e.target.value)}
                className="flex-1 h-20 px-3 py-2 text-sm border border-[#E5E6EB] rounded resize-y focus:outline-none focus:border-[#165DFF]"
              />
            </div>

            <div className="flex items-start gap-2">
              <span className="text-red-500 mt-2">*</span>
              <label className="text-sm text-[#4E5969] whitespace-nowrap mt-2">地域:</label>
              <div className="flex flex-col gap-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={region}
                    onChange={(e) => setRegion(e.target.checked)}
                    className="w-4 h-4 rounded border-[#C9CDD4]"
                  />
                  <span className="text-sm text-[#4E5969]">北京</span>
                </label>
                {!region && (
                  <span className="text-xs text-[#F53F3F]">请至少选择一个地域</span>
                )}
              </div>
            </div>
          </div>

          {/* 规则Tab */}
          <div>
            <div className="flex items-center border-b border-[#E5E6EB] mb-4">
              <button
                className={`px-4 py-2 text-sm border-b-2 transition-colors ${
                  activeRuleTab === 'rules'
                    ? 'text-[#165DFF] border-[#165DFF]'
                    : 'text-[#4E5969] border-transparent hover:text-[#165DFF]'
                }`}
                onClick={() => setActiveRuleTab('rules')}
              >
                规则
              </button>
              <button
                className={`px-4 py-2 text-sm border-b-2 transition-colors ${
                  activeRuleTab === 'annotations'
                    ? 'text-[#165DFF] border-[#165DFF]'
                    : 'text-[#4E5969] border-transparent hover:text-[#165DFF]'
                }`}
                onClick={() => setActiveRuleTab('annotations')}
              >
                标签与注解
              </button>
            </div>

            {activeRuleTab === 'rules' && (
              <div className="space-y-4">
                {/* 域名 */}
                <div className="flex items-center gap-2">
                  <span className="text-red-500">*</span>
                  <label className="text-sm text-[#4E5969] whitespace-nowrap">域名:</label>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="请输入"
                    className="flex-1 h-9 px-3 text-sm border border-[#E5E6EB] rounded focus:outline-none focus:border-[#165DFF]"
                  />
                </div>

                {/* 访问规则表格 */}
                <div className="flex items-start gap-2">
                  <span className="text-red-500">*</span>
                  <label className="text-sm text-[#4E5969] whitespace-nowrap mt-2">访问:</label>
                  <div className="flex-1 border border-[#E5E6EB] rounded overflow-hidden">
                    {/* 表头 */}
                    <div className="grid grid-cols-[1fr_1fr_1fr_80px_60px] bg-[#F7F8FA] text-xs text-[#86909C] px-3 py-2">
                      <span>路径类型</span>
                      <span>访问路径</span>
                      <span>Service</span>
                      <span>端口</span>
                      <span>操作</span>
                    </div>
                    {/* 规则行 */}
                    {rules.map((rule) => (
                      <div key={rule.id} className="grid grid-cols-[1fr_1fr_1fr_80px_60px] px-3 py-2 border-t border-[#F2F3F5] items-center">
                        <select
                          value={rule.pathType}
                          onChange={(e) => updateRule(rule.id, 'pathType', e.target.value)}
                          className="h-8 px-2 text-sm border border-[#E5E6EB] rounded mr-1 focus:outline-none focus:border-[#165DFF]"
                        >
                          <option>前缀匹配</option>
                          <option>精确匹配</option>
                          <option>正则匹配</option>
                        </select>
                        <input
                          type="text"
                          value={rule.path}
                          onChange={(e) => updateRule(rule.id, 'path', e.target.value)}
                          placeholder="请输入"
                          className="h-8 px-2 text-sm border border-[#E5E6EB] rounded mr-1 focus:outline-none focus:border-[#165DFF]"
                        />
                        <select
                          value={rule.service}
                          onChange={(e) => updateRule(rule.id, 'service', e.target.value)}
                          className="h-8 px-2 text-sm border border-[#E5E6EB] rounded mr-1 focus:outline-none focus:border-[#165DFF]"
                        >
                          <option value="">请选择</option>
                          <option>zxtest-service</option>
                          <option>nginx-service</option>
                        </select>
                        <input
                          type="text"
                          value={rule.port}
                          onChange={(e) => updateRule(rule.id, 'port', e.target.value)}
                          className="h-8 px-2 text-sm border border-[#E5E6EB] rounded mr-1 focus:outline-none focus:border-[#165DFF]"
                        />
                        <button
                          onClick={() => removeRule(rule.id)}
                          className="text-[#165DFF] text-sm hover:underline"
                        >
                          删除
                        </button>
                      </div>
                    ))}
                    {/* 新增行 */}
                    <div className="border-t border-[#F2F3F5] bg-[#FAFBFC]">
                      <button
                        onClick={addRule}
                        className="flex items-center gap-1 px-3 py-2 text-sm text-[#165DFF] hover:text-[#0E4ADB]"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        新增
                      </button>
                    </div>
                  </div>
                </div>

                {/* HTTPS证书 */}
                <div className="flex items-center gap-2">
                  <label className="text-sm text-[#4E5969] whitespace-nowrap">Https证书:</label>
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <select
                        value={httpsCert}
                        onChange={(e) => setHttpsCert(e.target.value)}
                        className="flex-1 h-9 px-3 text-sm border border-[#E5E6EB] rounded focus:outline-none focus:border-[#165DFF]"
                      >
                        <option value="">请选择</option>
                        <option>cert-1</option>
                        <option>cert-2</option>
                      </select>
                      <span className="text-[#86909C]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                    </div>
                    <span className="text-xs text-[#86909C]">
                      可通过Hulk进行证书管理，<span className="text-[#165DFF] cursor-pointer">查看</span>
                    </span>
                  </div>
                </div>

                {/* 添加规则按钮 */}
                <button className="px-4 py-1.5 bg-[#165DFF] text-white text-sm rounded hover:bg-[#0E4ADB] transition-colors">
                  添加规则
                </button>
              </div>
            )}

            {activeRuleTab === 'annotations' && (
              <div className="py-8 text-center text-sm text-[#86909C]">
                暂无标签与注解配置
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="flex items-center justify-end gap-3 px-6 py-3 border-t border-[#E5E6EB]">
        <button
          onClick={onCancel}
          className="px-4 py-1.5 text-sm text-[#4E5969] border border-[#E5E6EB] rounded hover:bg-[#F2F3F5] transition-colors"
        >
          取消
        </button>
        <button className="px-4 py-1.5 text-sm text-white bg-[#165DFF] rounded hover:bg-[#0E4ADB] transition-colors">
          Yaml
        </button>
        <button className="px-4 py-1.5 text-sm text-[#4E5969] border border-[#E5E6EB] rounded hover:bg-[#F2F3F5] transition-colors">
          保存
        </button>
        <button className="px-4 py-1.5 text-sm text-[#4E5969] border border-[#E5E6EB] rounded hover:bg-[#F2F3F5] transition-colors">
          发布
        </button>
      </div>
    </div>
  );
}
