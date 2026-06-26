'use client';

interface Application {
  id: number;
  name: string;
  displayName: string;
  description: string;
  createTime: string;
  creator: string;
  isFavorite?: boolean;
}

interface ApplicationListProps {
  applications: Application[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onViewApplication?: (appName: string) => void;
}

export default function ApplicationList({
  applications,
  activeTab,
  onTabChange,
  searchTerm,
  onSearchChange,
  currentPage,
  onPageChange,
  totalPages,
  totalItems,
  itemsPerPage,
  onViewApplication,
}: ApplicationListProps) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedApplications = applications.slice(startIndex, endIndex);

  return (
    <div className="h-full flex flex-col">
      {/* 面包屑导航区域 */}
      <div className="flex items-center justify-between h-14 px-6 text-sm text-gray-600 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span>产品团队-专用</span>
          <span className="text-gray-400">{'>'}</span>
          <span>stark测试</span>
          <span className="text-gray-400">{'>'}</span>
          <span className="text-gray-900 font-medium">应用列表</span>
        </div>
        <a href="#" className="text-blue-600 hover:underline">
          CIS帮助文档
        </a>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
        {/* 操作栏 */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 flex-shrink-0">
          {/* 标签页 */}
          <div className="flex gap-2">
            <button
              onClick={() => onTabChange('all')}
              className={`px-4 py-2 text-sm rounded transition-colors ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white border border-blue-600'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              所有内容
            </button>
            <button
              onClick={() => onTabChange('favorites')}
              className={`px-4 py-2 text-sm rounded transition-colors ${
                activeTab === 'favorites'
                  ? 'bg-blue-600 text-white border border-blue-600'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              已收藏
            </button>
          </div>

          {/* 搜索框和按钮 */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="点击输入筛选过滤应用"
                className="w-64 px-4 py-2 pl-4 pr-10 bg-gray-100 border border-transparent rounded text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
              <svg className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button className="px-4 py-2 text-sm bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors">
              集群资源
            </button>
            <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              创建应用
            </button>
          </div>
        </div>

        {/* 表格容器 - 自适应高度，内部滚动 */}
        <div className="flex-1 px-6 py-4 overflow-hidden">
          <div className="border border-gray-200 rounded bg-white h-full flex flex-col">
            <div className="overflow-auto flex-1">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                  <tr className="text-sm text-gray-700 font-semibold">
                    <th className="px-4 py-3 text-left">名称</th>
                    <th className="px-4 py-3 text-left">显示名</th>
                    <th className="px-4 py-3 text-left">描述</th>
                    <th className="px-4 py-3 text-left">创建时间</th>
                    <th className="px-4 py-3 text-left">创建者</th>
                    <th className="px-4 py-3 text-left">操作</th>
                  </tr>
                </thead>
                <tbody>
                {displayedApplications.map((app) => (
                  <tr
                    key={app.id}
                    className="text-sm border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onViewApplication?.(app.name)}
                        className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                      >
                        {app.name}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-gray-900">{app.displayName}</td>
                    <td className="px-4 py-3 text-gray-600">{app.description}</td>
                    <td className="px-4 py-3 text-gray-600">{app.createTime}</td>
                    <td className="px-4 py-3 text-gray-600">{app.creator}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="text-gray-600 hover:text-blue-600 text-sm">
                          收藏
                        </button>
                        <span className="text-gray-300">|</span>
                        <button className="text-gray-600 hover:text-blue-600 text-sm">
                          详情
                        </button>
                        <span className="text-gray-300">|</span>
                        <button className="text-gray-600 hover:text-blue-600 text-sm">
                          编辑
                        </button>
                        <button className="text-gray-400 hover:text-gray-600 p-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 分页栏 - 固定在底部 */}
        <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200 flex-shrink-0">
          <div className="text-sm text-gray-600">
            共 {totalItems} 条记录 第 {currentPage} / {totalPages} 页
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`px-3 py-1 text-sm border rounded ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="ml-4 flex items-center gap-2">
              <select className="px-2 py-1 text-sm border border-gray-300 rounded bg-white">
                <option>10条/页</option>
                <option>20条/页</option>
                <option>50条/页</option>
                <option>100条/页</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
