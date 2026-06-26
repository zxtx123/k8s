'use client';

import { useState } from 'react';

export default function Header() {
  const [searchValue, setSearchValue] = useState('');

  return (
    <header className="relative z-[2000] h-14 bg-white border-b border-gray-200 flex items-center px-5 flex-shrink-0 justify-between shadow-[0_2px_6px_rgba(49,49,71,0.26)]">
      {/* 左侧 Logo 区域 */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {/* 左侧 Logo 区域 */}
        <div className="flex items-center gap-2">
          {/* Logo 图标 - 360智汇云logo */}
          <img src="/logo.svg" alt="360智汇云" className="h-7" />
        </div>

        {/* 工作台总览 */}
        <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded text-gray-700 text-sm hover:bg-gray-200 transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
          </svg>
          <span>工作台总览</span>
        </button>

        {/* 产品团队选择器 */}
        <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded text-gray-700 text-sm hover:bg-gray-50 transition-colors">
          <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
          </svg>
          <span className="font-medium">产品团队-专用: stark测试</span>
          <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* 右侧区域 - 搜索框、功能按钮、用户信息 */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {/* 搜索框 */}
        <div className="relative">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="支持应用、PodIP、PodName、VIP查询"
            className="w-64 px-4 py-2 pl-4 pr-10 bg-gray-100 border border-transparent rounded text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
          />
          <svg className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* 功能入口 */}
        <div className="flex items-center gap-5 text-sm text-gray-700">
          <button className="hover:text-blue-600 transition-colors">费用</button>
          <button className="hover:text-blue-600 transition-colors">工单</button>
          <button className="relative hover:text-blue-600 transition-colors">
            消息
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              99+
            </span>
          </button>
          <button className="hover:text-blue-600 transition-colors">帮助</button>
        </div>

        {/* 用户信息 */}
        <div className="flex items-center gap-3 border-l border-gray-300 pl-6">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-800">zhangxing5</div>
            <div className="text-xs text-gray-500">子账号</div>
          </div>
        </div>
      </div>
    </header>
  );
}
