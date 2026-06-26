'use client';

interface ApplicationDetailProps {
  applicationName: string;
  onBack: () => void;
}

// 资源卡片配置
interface ResourceCardConfig {
  type: string;
  count: number;
  color: string;
  bgColor: string;
  trendColor: string;
}

export default function ApplicationDetail({ applicationName, onBack }: ApplicationDetailProps) {
  // 应用基础信息
  const appInfo = {
    projectName: 'stark测试',
    name: applicationName,
    appId: '2893',
    creator: 'zhangxing5',
    createTime: '2023-02-09 16:38:06',
    relatedApp: '测试hulk专用',
    description: 'zx',
  };

  // 集群资源使用统计
  const clusterResources = [
    {
      name: 'SO-SHYC2',
      cpuUsed: 0,
      cpuTotal: 0,
      cpuPercent: 0,
      memUsed: 0,
      memTotal: 0,
      memPercent: 0,
    },
    {
      name: 'ali-alifr',
      cpuUsed: 0,
      cpuTotal: 0,
      cpuPercent: 0,
      memUsed: 0,
      memTotal: 0,
      memPercent: 0,
    },
    {
      name: 'monitor-vpc-docker',
      cpuUsed: 0,
      cpuTotal: 0,
      cpuPercent: 0,
      memUsed: 0,
      memTotal: 0,
      memPercent: 0,
    },
    {
      name: 'pub-alisg',
      cpuUsed: 0,
      cpuTotal: 0,
      cpuPercent: 0,
      memUsed: 0,
      memTotal: 0,
      memPercent: 0,
    },
  ];

  // Kubernetes资源统计 - 带配色和趋势数据
  const k8sResources: ResourceCardConfig[] = [
    { type: 'Deployment', count: 11, color: '#3B82F6', bgColor: '#EFF6FF', trendColor: '#3B82F6' },
    { type: 'StatefulSet', count: 2, color: '#06B6D4', bgColor: '#ECFEFF', trendColor: '#06B6D4' },
    { type: 'DaemonSet', count: 0, color: '#8B5CF6', bgColor: '#F5F3FF', trendColor: '#8B5CF6' },
    { type: 'CronJob', count: 1, color: '#EC4899', bgColor: '#FDF2F8', trendColor: '#EC4899' },
    { type: 'Job', count: 1, color: '#F59E0B', bgColor: '#FFFBEB', trendColor: '#F59E0B' },
    { type: 'Service', count: 2, color: '#10B981', bgColor: '#ECFDF5', trendColor: '#10B981' },
    { type: 'Ingress', count: 0, color: '#6366F1', bgColor: '#EEF2FF', trendColor: '#6366F1' },
    { type: '负载均衡', count: 2, color: '#14B8A6', bgColor: '#F0FDFA', trendColor: '#14B8A6' },
    { type: 'PVC', count: 3, color: '#F97316', bgColor: '#FFF7ED', trendColor: '#F97316' },
  ];

  // 简单的趋势图SVG路径生成
  const generateTrendPath = (count: number): string => {
    // 基于count生成一个模拟的趋势线
    const baseHeight = 20;
    const width = 80;
    const points: string[] = [];
    
    for (let i = 0; i <= 8; i++) {
      const x = (i / 8) * width;
      const variance = Math.sin(i * 0.8) * 8;
      const y = baseHeight - (count > 0 ? Math.min(count, 10) * 1.5 + variance : variance);
      points.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
    }
    
    return points.join(' ');
  };

  // 生成填充区域路径
  const generateAreaPath = (count: number): string => {
    const linePath = generateTrendPath(count);
    return `${linePath} L 80 20 L 0 20 Z`;
  };

  return (
    <div className="min-h-full bg-gray-50">
      {/* 面包屑导航 */}
      <div className="flex items-center justify-between h-14 px-6 text-sm text-gray-600 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span>{appInfo.projectName}</span>
          <span className="text-gray-400">{'>'}</span>
          <button 
            onClick={onBack}
            className="text-blue-600 hover:text-blue-700 hover:underline"
          >
            {appInfo.name}
          </button>
          <span className="text-gray-400">{'>'}</span>
          <span className="text-gray-900 font-medium">应用概览</span>
        </div>
        <a href="#" className="text-blue-600 hover:underline">
          CIS帮助文档
        </a>
      </div>

      {/* 内容区域 */}
      <div className="p-6 space-y-6">
        {/* 应用基础信息 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-base font-medium text-gray-900 mb-4">应用基础信息</h2>
          <div className="grid grid-cols-4 gap-6">
            <div className="flex">
              <span className="text-sm text-gray-500 w-24 flex-shrink-0">项目名称:</span>
              <span className="text-sm text-gray-900">{appInfo.projectName}</span>
            </div>
            <div className="flex">
              <span className="text-sm text-gray-500 w-24 flex-shrink-0">名称:</span>
              <span className="text-sm text-gray-900">{appInfo.name}</span>
            </div>
            <div className="flex">
              <span className="text-sm text-gray-500 w-24 flex-shrink-0">应用ID:</span>
              <span className="text-sm text-gray-900">{appInfo.appId}</span>
            </div>
            <div className="flex">
              <span className="text-sm text-gray-500 w-24 flex-shrink-0">创建者:</span>
              <span className="text-sm text-gray-900">{appInfo.creator}</span>
            </div>
            <div className="flex">
              <span className="text-sm text-gray-500 w-24 flex-shrink-0">创建时间:</span>
              <span className="text-sm text-gray-900">{appInfo.createTime}</span>
            </div>
            <div className="flex">
              <span className="text-sm text-gray-500 w-24 flex-shrink-0">关联应用:</span>
              <span className="text-sm text-gray-900">{appInfo.relatedApp}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 w-24 flex-shrink-0">说明:</span>
              <span className="text-sm text-gray-900">{appInfo.description}</span>
              <button className="ml-2 text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 集群资源使用统计 */}
        <div>
          <h2 className="text-base font-medium text-gray-900 mb-4">集群资源使用统计</h2>
          <div className="grid grid-cols-4 gap-4">
            {clusterResources.map((cluster, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="text-sm font-medium text-gray-900 mb-4">{cluster.name}</div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>CPU使用</span>
                      <span>{cluster.cpuUsed} / {cluster.cpuTotal} ({cluster.cpuPercent}%)</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${cluster.cpuPercent}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>内存使用</span>
                      <span>{cluster.memUsed} / {cluster.memTotal} ({cluster.memPercent}%)</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${cluster.memPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <button className="mt-4 text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  展开
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Kubernetes资源统计 */}
        <div>
          <h2 className="text-base font-medium text-gray-900 mb-4">Kubernetes资源统计</h2>
          <div className="grid grid-cols-4 gap-4">
            {k8sResources.map((resource, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* 资源名称 */}
                <div className="text-sm text-gray-600 mb-2">{resource.type}</div>
                
                {/* 核心数值 */}
                <div className="text-4xl font-bold text-gray-900 mb-3" style={{ color: resource.color }}>
                  {resource.count}
                </div>
                
                {/* 趋势图 */}
                <div className="h-12 relative">
                  <svg width="100%" height="48" viewBox="0 0 80 20" preserveAspectRatio="none">
                    {/* 渐变填充 */}
                    <defs>
                      <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={resource.trendColor} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={resource.trendColor} stopOpacity="0.05" />
                      </linearGradient>
                    </defs>
                    <path
                      d={generateAreaPath(resource.count)}
                      fill={`url(#gradient-${index})`}
                    />
                    <path
                      d={generateTrendPath(resource.count)}
                      fill="none"
                      stroke={resource.trendColor}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* 末端圆点 */}
                    <circle
                      cx="80"
                      cy={20 - (resource.count > 0 ? Math.min(resource.count, 10) * 1.5 : 0)}
                      r="2.5"
                      fill={resource.trendColor}
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
