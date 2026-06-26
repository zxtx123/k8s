'use client';

import { useState } from 'react';

const mockData = [
  { id: 19588, title: 'test', monitorItem: '内存使用率(含缓存)', resource: 'zxtest-test', container: '全部', pod: 'zxtest-test-5d9f8b7d4b-8nkrv', cluster: 'bjpdc-c-1', level: '一般', category: '历史', time: '2023-06-09 18:28:00', message: '内存使用率(含缓存):100.00% > 0' },
  { id: 19587, title: 'test', monitorItem: '内存使用率(含缓存)', resource: 'zxtest-test', container: '全部', pod: 'zxtest-test-5d9f8b7d4b-xk9lk', cluster: 'bjpdc-c-1', level: '一般', category: '历史', time: '2023-06-09 18:28:00', message: '内存使用率(含缓存):100.00% > 0' },
  { id: 19586, title: 'test', monitorItem: '内存使用率(含缓存)', resource: 'zxtest-test', container: '全部', pod: 'zxtest-test-5d9f8b7d4b-qfh6v', cluster: 'bjpdc-c-1', level: '一般', category: '历史', time: '2023-06-09 18:13:00', message: '内存使用率(含缓存):100.00% > 0' },
  { id: 19585, title: 'test', monitorItem: '内存使用率(含缓存)', resource: 'zxtest-test', container: '全部', pod: 'zxtest-test-5d9f8b7d4b-8nkrv', cluster: 'bjpdc-c-1', level: '一般', category: '历史', time: '2023-06-09 18:13:00', message: '内存使用率(含缓存):100.00% > 0' },
  { id: 19584, title: 'test', monitorItem: '内存使用率(含缓存)', resource: 'zxtest-test', container: '全部', pod: 'zxtest-test-5d9f8b7d4b-xk9lk', cluster: 'bjpdc-c-1', level: '一般', category: '历史', time: '2023-06-09 17:58:00', message: '内存使用率(含缓存):100.00% > 0' },
  { id: 19583, title: 'test', monitorItem: '内存使用率(含缓存)', resource: 'zxtest-test', container: '全部', pod: 'zxtest-test-5d9f8b7d4b-qfh6v', cluster: 'bjpdc-c-1', level: '一般', category: '历史', time: '2023-06-09 17:58:00', message: '内存使用率(含缓存):100.00% > 0' },
  { id: 19582, title: 'test', monitorItem: '内存使用率(含缓存)', resource: 'zxtest-test', container: '全部', pod: 'zxtest-test-5d9f8b7d4b-8nkrv', cluster: 'bjpdc-c-1', level: '一般', category: '历史', time: '2023-06-09 17:43:00', message: '内存使用率(含缓存):100.00% > 0' },
  { id: 19581, title: 'test', monitorItem: '内存使用率(含缓存)', resource: 'zxtest-test', container: '全部', pod: 'zxtest-test-5d9f8b7d4b-xk9lk', cluster: 'bjpdc-c-1', level: '一般', category: '历史', time: '2023-06-09 17:43:00', message: '内存使用率(含缓存):100.00% > 0' },
  { id: 19580, title: 'test', monitorItem: '内存使用率(含缓存)', resource: 'zxtest-test', container: '全部', pod: 'zxtest-test-5d9f8b7d4b-qfh6v', cluster: 'bjpdc-c-1', level: '一般', category: '历史', time: '2023-06-09 17:28:00', message: '内存使用率(含缓存):100.00% > 0' },
  { id: 19579, title: 'test', monitorItem: '内存使用率(含缓存)', resource: 'zxtest-test', container: '全部', pod: 'zxtest-test-5d9f8b7d4b-8nkrv', cluster: 'bjpdc-c-1', level: '一般', category: '历史', time: '2023-06-09 17:28:00', message: '内存使用率(含缓存):100.00% > 0' },
];

export default function AlertHistory() {
  const [categoryFilter, setCategoryFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [resourceFilter, setResourceFilter] = useState('');
  const [monitorItemFilter, setMonitorItemFilter] = useState('');
  const [clusterFilter, setClusterFilter] = useState('');
  const [containerFilter, setContainerFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const totalRecords = 19587;
  const pageSize = 10;
  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <div className="flex flex-col h-full">
      {/* 面包屑导航 */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#E5E6EB]">
        <div className="text-sm text-[#86909C]">
          <span>stark测试</span>
          <span className="mx-1">&gt;</span>
          <span>zxtest</span>
          <span className="mx-1">&gt;</span>
          <span className="text-[#1F2329]">告警历史</span>
        </div>
        <a href="#" className="text-sm text-[#165DFF]">
          CIS帮助文档
        </a>
      </div>

      {/* 筛选栏 */}
      <div className="px-6 py-3 bg-[#F7F8FA] border-b border-[#E5E6EB]">
        <div className="flex items-center gap-3 flex-wrap">
          <select
            className="h-8 text-xs border border-[#E5E6EB] rounded px-2 text-[#1F2329] bg-white min-w-[100px]"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">告警类别</option>
            <option value="history">历史</option>
            <option value="realtime">实时</option>
          </select>
          <select
            className="h-8 text-xs border border-[#E5E6EB] rounded px-2 text-[#1F2329] bg-white min-w-[100px]"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
          >
            <option value="">告警级别</option>
            <option value="critical">紧急</option>
            <option value="important">重要</option>
            <option value="normal">一般</option>
          </select>
          <select
            className="h-8 text-xs border border-[#E5E6EB] rounded px-2 text-[#1F2329] bg-white min-w-[100px]"
            value={resourceFilter}
            onChange={(e) => setResourceFilter(e.target.value)}
          >
            <option value="">资源</option>
          </select>
          <select
            className="h-8 text-xs border border-[#E5E6EB] rounded px-2 text-[#1F2329] bg-white min-w-[100px]"
            value={monitorItemFilter}
            onChange={(e) => setMonitorItemFilter(e.target.value)}
          >
            <option value="">监控项</option>
          </select>
          <select
            className="h-8 text-xs border border-[#E5E6EB] rounded px-2 text-[#1F2329] bg-white min-w-[100px]"
            value={containerFilter}
            onChange={(e) => setContainerFilter(e.target.value)}
          >
            <option value="">容器</option>
          </select>
          <select
            className="h-8 text-xs border border-[#E5E6EB] rounded px-2 text-[#1F2329] bg-white min-w-[100px]"
            value={clusterFilter}
            onChange={(e) => setClusterFilter(e.target.value)}
          >
            <option value="">集群</option>
          </select>
          <div className="flex items-center gap-1">
            <input
              type="text"
              placeholder="开始时间"
              className="h-8 text-xs border border-[#E5E6EB] rounded px-2 text-[#1F2329] w-[130px]"
            />
            <span className="text-[#86909C]">~</span>
            <input
              type="text"
              placeholder="结束时间"
              className="h-8 text-xs border border-[#E5E6EB] rounded px-2 text-[#1F2329] w-[130px]"
            />
          </div>
          <button className="h-8 px-4 bg-[#165DFF] text-white text-xs rounded hover:bg-[#0E4ADB]">
            查询
          </button>
        </div>
      </div>

      {/* 表格 */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="border border-[#E5E6EB] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F7F8FA]">
                <th className="text-left px-3 py-3 text-[#1F2329] font-medium whitespace-nowrap">ID</th>
                <th className="text-left px-3 py-3 text-[#1F2329] font-medium whitespace-nowrap">标题</th>
                <th className="text-left px-3 py-3 text-[#1F2329] font-medium whitespace-nowrap">监控项</th>
                <th className="text-left px-3 py-3 text-[#1F2329] font-medium whitespace-nowrap">资源</th>
                <th className="text-left px-3 py-3 text-[#1F2329] font-medium whitespace-nowrap">容器</th>
                <th className="text-left px-3 py-3 text-[#1F2329] font-medium whitespace-nowrap">pod</th>
                <th className="text-left px-3 py-3 text-[#1F2329] font-medium whitespace-nowrap">集群</th>
                <th className="text-left px-3 py-3 text-[#1F2329] font-medium whitespace-nowrap">告警级别</th>
                <th className="text-left px-3 py-3 text-[#1F2329] font-medium whitespace-nowrap">类别</th>
                <th className="text-left px-3 py-3 text-[#1F2329] font-medium whitespace-nowrap">告警时间</th>
                <th className="text-left px-3 py-3 text-[#1F2329] font-medium whitespace-nowrap">告警信息</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((item) => (
                <tr key={item.id} className="border-t border-[#E5E6EB] hover:bg-[#F7F8FA]">
                  <td className="px-3 py-2.5 text-[#1F2329] text-xs">{item.id}</td>
                  <td className="px-3 py-2.5 text-[#1F2329] text-xs">{item.title}</td>
                  <td className="px-3 py-2.5 text-[#1F2329] text-xs">{item.monitorItem}</td>
                  <td className="px-3 py-2.5 text-[#1F2329] text-xs">{item.resource}</td>
                  <td className="px-3 py-2.5 text-[#1F2329] text-xs">{item.container}</td>
                  <td className="px-3 py-2.5 text-[#1F2329] text-xs font-mono">{item.pod}</td>
                  <td className="px-3 py-2.5 text-[#1F2329] text-xs">{item.cluster}</td>
                  <td className="px-3 py-2.5 text-xs">{item.level}</td>
                  <td className="px-3 py-2.5 text-xs">{item.category}</td>
                  <td className="px-3 py-2.5 text-xs text-[#86909C] whitespace-nowrap">{item.time}</td>
                  <td className="px-3 py-2.5 text-xs text-[#86909C] max-w-[200px] truncate" title={item.message}>
                    {item.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 分页 */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-[#E5E6EB]">
        <span className="text-xs text-[#86909C]">共{totalRecords}条记录 第{currentPage}/{totalPages}页</span>
        <div className="flex items-center gap-2">
          <button
            className="w-7 h-7 flex items-center justify-center rounded text-[#86909C] border border-[#E5E6EB] hover:text-[#165DFF]"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          >
            &lt;
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded bg-[#165DFF] text-white text-xs">
            {currentPage}
          </button>
          <button
            className="w-7 h-7 flex items-center justify-center rounded text-[#86909C] border border-[#E5E6EB] hover:text-[#165DFF]"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          >
            &gt;
          </button>
          <select className="h-7 text-xs border border-[#E5E6EB] rounded px-1 text-[#1F2329]">
            <option>10条/页</option>
            <option>20条/页</option>
            <option>50条/页</option>
          </select>
        </div>
      </div>
    </div>
  );
}
