'use client';

import { useState } from 'react';

interface LoadBalancerManagementProps {
  onMenuItemChange?: (item: string) => void;
  onCreateLoadBalancer?: () => void;
}

const mockData = [
  {
    id: 28047,
    name: 'zxtest-fsdfsdfsdf',
    vip: '',
    ports: '8080:80/TCP',
    onlineCluster: '',
    configCluster: 'pub-bjmd',
    alarmGroup: '暂无',
    description: 'fsdfsdfsdfsd',
    alarmEnabled: false,
    createTime: '2024-11-07 16:49:30',
    creator: 'zhangxing5',
  },
  {
    id: 12961,
    name: 'zxtest-ghfghfgh',
    vip: '',
    ports: '848:5984/TCP, 80:80/TCP',
    onlineCluster: '',
    configCluster: 'pub-bjmd',
    alarmGroup: '暂无',
    description: 'ghgfghfghfh',
    alarmEnabled: false,
    createTime: '2023-12-11 19:44:11',
    creator: 'zhangxing5',
  },
  {
    id: 10836,
    name: 'zxtest-test',
    vip: '',
    ports: '8080:80/TCP',
    onlineCluster: '',
    configCluster: 'pub-bjzdt',
    alarmGroup: '暂无',
    description: 'ffgsdgsd',
    alarmEnabled: false,
    createTime: '2023-07-24 18:34:54',
    creator: 'zhangxing5',
  },
];

export default function LoadBalancerManagement({ onMenuItemChange, onCreateLoadBalancer }: LoadBalancerManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [alarmStates, setAlarmStates] = useState<Record<number, boolean>>(
    Object.fromEntries(mockData.map((item) => [item.id, item.alarmEnabled]))
  );

  const filteredData = mockData.filter((item) => {
    const matchesSearch =
      searchTerm === '' ||
      item.id.toString().includes(searchTerm) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOnline = !showOnlineOnly || item.onlineCluster !== '';
    return matchesSearch && matchesOnline;
  });

  const toggleAlarm = (id: number) => {
    setAlarmStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col h-full">
      {/* 操作栏 */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#F7F8FA] border-b border-[#E5E6EB]">
        <div className="flex items-center gap-3">
          <button onClick={onCreateLoadBalancer} className="inline-flex items-center gap-1 px-4 py-1.5 bg-[#165DFF] text-white text-sm rounded hover:bg-[#0E4DDB]">
            + 创建负载均衡
          </button>
          <span className="text-xs text-[#86909C] whitespace-nowrap">
            集群外部流量4层负载均衡，通过VIP进行访问，通过轮询、ip hash、最小连接数来路由到后端，实现负载均衡。
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#4E5969]">只显示上线版本</span>
            <button
              onClick={() => setShowOnlineOnly(!showOnlineOnly)}
              className={`relative w-8 h-4 rounded-full transition-colors ${
                showOnlineOnly ? 'bg-[#165DFF]' : 'bg-[#C9CDD4]'
              }`}
            >
              <span
                className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${
                  showOnlineOnly ? 'left-4.5 translate-x-0' : 'left-0.5'
                }`}
              />
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="ID/名称"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-40 h-7 pl-3 pr-8 text-sm border border-[#E5E6EB] rounded bg-white focus:outline-none focus:border-[#165DFF]"
            />
            <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86909C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button className="w-7 h-7 flex items-center justify-center rounded border border-[#E5E6EB] bg-white hover:bg-[#F2F3F5]">
            <svg className="w-4 h-4 text-[#4E5969]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* 表格 */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#F7F8FA] border-b border-[#E5E6EB]">
              <th className="text-left py-2.5 px-4 text-[#4E5969] font-medium">ID</th>
              <th className="text-left py-2.5 px-4 text-[#4E5969] font-medium">名称</th>
              <th className="text-left py-2.5 px-4 text-[#4E5969] font-medium">VIP</th>
              <th className="text-left py-2.5 px-4 text-[#4E5969] font-medium">端口号</th>
              <th className="text-left py-2.5 px-4 text-[#4E5969] font-medium">上线集群</th>
              <th className="text-left py-2.5 px-4 text-[#4E5969] font-medium">配置集群</th>
              <th className="text-left py-2.5 px-4 text-[#4E5969] font-medium">报警组</th>
              <th className="text-left py-2.5 px-4 text-[#4E5969] font-medium">发布说明</th>
              <th className="text-left py-2.5 px-4 text-[#4E5969] font-medium">报警状态</th>
              <th className="text-left py-2.5 px-4 text-[#4E5969] font-medium">创建时间</th>
              <th className="text-left py-2.5 px-4 text-[#4E5969] font-medium">创建者</th>
              <th className="text-left py-2.5 px-4 text-[#4E5969] font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-b border-[#F2F3F5] hover:bg-[#F7F8FA]">
                <td className="py-2.5 px-4 text-[#4E5969]">{item.id}</td>
                <td className="py-2.5 px-4">
                  <span className="text-[#165DFF] cursor-pointer hover:underline">{item.name}</span>
                </td>
                <td className="py-2.5 px-4 text-[#4E5969]">{item.vip || '-'}</td>
                <td className="py-2.5 px-4 text-[#4E5969]">{item.ports}</td>
                <td className="py-2.5 px-4">
                  {item.onlineCluster ? (
                    <span className="text-[#4E5969]">{item.onlineCluster}</span>
                  ) : (
                    <span className="inline-block px-2 py-0.5 text-xs text-[#86909C] bg-[#F2F3F5] rounded">未发布</span>
                  )}
                </td>
                <td className="py-2.5 px-4 text-[#4E5969]">{item.configCluster}</td>
                <td className="py-2.5 px-4 text-[#4E5969]">{item.alarmGroup}</td>
                <td className="py-2.5 px-4 text-[#4E5969] max-w-[120px] truncate">{item.description}</td>
                <td className="py-2.5 px-4">
                  <button
                    onClick={() => toggleAlarm(item.id)}
                    className={`relative w-8 h-4 rounded-full transition-colors ${
                      alarmStates[item.id] ? 'bg-[#165DFF]' : 'bg-[#C9CDD4]'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${
                        alarmStates[item.id] ? 'left-4.5 translate-x-0' : 'left-0.5'
                      }`}
                    />
                  </button>
                </td>
                <td className="py-2.5 px-4 text-[#4E5969]">{item.createTime}</td>
                <td className="py-2.5 px-4 text-[#4E5969]">{item.creator}</td>
                <td className="py-2.5 px-4 whitespace-nowrap">
                  <span className="text-[#165DFF] cursor-pointer hover:underline mr-3">发布</span>
                  <span className="text-[#165DFF] cursor-pointer hover:underline mr-3">编辑</span>
                  <span className="text-[#165DFF] cursor-pointer hover:underline mr-3">详情</span>
                  <button className="text-[#86909C] hover:text-[#4E5969]">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#F7F8FA] border-t border-[#E5E6EB] flex-shrink-0">
        <span className="text-xs text-[#4E5969]">共{filteredData.length}条记录 第1/1页</span>
        <div className="flex items-center gap-2">
          <button className="w-7 h-7 flex items-center justify-center rounded border border-[#E5E6EB] bg-white text-[#C9CDD4] cursor-not-allowed">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="w-7 h-7 flex items-center justify-center rounded bg-[#165DFF] text-white text-xs">1</span>
          <button className="w-7 h-7 flex items-center justify-center rounded border border-[#E5E6EB] bg-white text-[#C9CDD4] cursor-not-allowed">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <select className="h-7 px-2 text-xs border border-[#E5E6EB] rounded bg-white text-[#4E5969]">
            <option>10条/页</option>
            <option>20条/页</option>
            <option>50条/页</option>
          </select>
        </div>
      </div>
    </div>
  );
}
