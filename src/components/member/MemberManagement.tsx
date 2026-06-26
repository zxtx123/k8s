'use client';

import { useState } from 'react';

interface Member {
  id: number;
  userName: string;
  groups: string[];
  createTime: string;
}

const memberData: Member[] = [
  { id: 1, userName: 'jinriyang', groups: ['项目管理员'], createTime: '2023-02-20 14:30:00' },
  { id: 2, userName: 'gengjie', groups: ['项目管理员', '项目成员'], createTime: '2023-03-15 10:20:00' },
  { id: 3, userName: 'yinlu', groups: ['项目成员'], createTime: '2023-04-10 09:15:00' },
  { id: 4, userName: 'shijianpeng', groups: ['项目成员'], createTime: '2023-05-22 16:45:00' },
  { id: 5, userName: 'zhangping', groups: ['项目成员'], createTime: '2023-06-18 11:30:00' },
  { id: 6, userName: 'sunyunfeng', groups: ['项目成员'], createTime: '2023-07-05 08:20:00' },
  { id: 7, userName: 'jidongdong', groups: ['项目成员'], createTime: '2023-08-14 13:50:00' },
  { id: 8, userName: 'guohongbo', groups: ['项目成员'], createTime: '2023-09-25 15:10:00' },
  { id: 9, userName: 'zengyan', groups: ['项目成员'], createTime: '2024-01-08 10:00:00' },
  { id: 10, userName: 'j-zhangcheng-jk', groups: ['项目成员'], createTime: '2025-09-12 09:30:00' },
];

export default function MemberManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  const filteredData = memberData.filter(item =>
    item.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-5">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-sm text-[#86909C]">
          <span className="cursor-pointer hover:text-[#165DFF]">产品团队-专用</span>
          <span className="mx-2">&gt;</span>
          <span className="cursor-pointer hover:text-[#165DFF]">stark测试</span>
          <span className="mx-2">&gt;</span>
          <span className="text-[#1F2329]">成员管理</span>
        </div>
        <a href="#" className="text-[#165DFF] text-sm hover:underline">CIS帮助文档</a>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between mb-4">
        <button className="h-8 px-4 bg-[#165DFF] text-white text-sm rounded hover:bg-[#0E42D2] flex items-center">
          <span className="mr-1">+</span> 关联项目用户
        </button>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="用户名称"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-48 pl-3 pr-8 text-sm border border-[#E5E6EB] rounded focus:outline-none focus:border-[#165DFF]"
            />
            <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86909C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button className="h-8 px-3 text-sm border border-[#E5E6EB] rounded text-[#1F2329] hover:bg-[#F2F3F5]">
            批量关联应用
          </button>
          <button className="w-8 h-8 flex items-center justify-center border border-[#E5E6EB] rounded text-[#86909C] hover:bg-[#F2F3F5]">
            <span className="text-sm font-bold">C</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E5E6EB] rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F7F8FA] border-b border-[#E5E6EB]">
              <th className="text-left py-3 px-4 text-[#1F2329] font-medium">用户名称</th>
              <th className="text-left py-3 px-4 text-[#1F2329] font-medium">所属群组</th>
              <th className="text-left py-3 px-4 text-[#1F2329] font-medium">创建时间</th>
              <th className="text-left py-3 px-4 text-[#1F2329] font-medium w-32">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-b border-[#E5E6EB] hover:bg-[#F7F8FA]">
                <td className="py-3 px-4 text-[#1F2329]">{item.userName}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1 flex-wrap">
                    {item.groups.map((group, idx) => (
                      <span
                        key={idx}
                        className={`inline-block px-2 py-0.5 text-xs rounded ${
                          group === '项目管理员'
                            ? 'bg-[#EEF6FF] text-[#165DFF]'
                            : 'bg-[#F2F3F5] text-[#86909C]'
                        }`}
                      >
                        {group}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4 text-[#86909C]">{item.createTime}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <button className="text-[#165DFF] hover:underline text-sm">编辑</button>
                    <button className="text-[#165DFF] hover:underline text-sm">删除</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-[#86909C]">共41条记录 第{currentPage}/{totalPages}页</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center border border-[#E5E6EB] rounded text-[#86909C] disabled:opacity-50"
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 flex items-center justify-center rounded text-sm ${
                currentPage === page
                  ? 'bg-[#165DFF] text-white'
                  : 'border border-[#E5E6EB] text-[#1F2329] hover:bg-[#F2F3F5]'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center border border-[#E5E6EB] rounded text-[#86909C] disabled:opacity-50"
          >
            &gt;
          </button>
          <select className="h-8 px-2 border border-[#E5E6EB] rounded text-sm text-[#1F2329] focus:outline-none">
            <option>10条/页</option>
            <option>20条/页</option>
            <option>50条/页</option>
          </select>
        </div>
      </div>
    </div>
  );
}
