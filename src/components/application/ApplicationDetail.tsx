'use client';

import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MemberManagement from '@/components/member/MemberManagement';
import APIKeysManagement from '@/components/api/APIKeysManagement';
import ApplicationConfiguration from './ApplicationConfiguration';
import ProjectClusterUsage, { type ResourceMenuId } from '@/components/project/ProjectClusterUsage';
import ProjectSwitcherBreadcrumb, { type ProjectSwitcherApplication, type ProjectSwitcherProject } from '@/components/layout/ProjectSwitcherBreadcrumb';

const detailTabs = [
  { id: 'overview', label: '概览' },
  { id: 'members', label: '成员管理' },
  { id: 'apikeys', label: 'APIkeys' },
  { id: 'config', label: '应用配置' },
];

interface ApplicationDetailProps {
  projectName?: string;
  projects?: ProjectSwitcherProject[];
  applicationsByProject?: Record<number, ProjectSwitcherApplication[]>;
  onProjectChange?: (project: ProjectSwitcherProject) => void;
  onApplicationChange?: (project: ProjectSwitcherProject, application: ProjectSwitcherApplication) => void;
  applicationName: string;
  initialTab?: 'overview' | 'members';
  onBack: () => void;
  onViewResource: (menuId: ResourceMenuId) => void;
}

export default function ApplicationDetail({ applicationName, initialTab = 'overview', projectName = '默认项目', projects = [{ id: 1, name: '默认项目' }], applicationsByProject = {}, onProjectChange, onApplicationChange, onBack, onViewResource }: ApplicationDetailProps) {
  // 应用基础信息
  const appInfo = {
    projectName,
    name: applicationName,
    appId: '2893',
    creator: 'zhangxing5',
    createTime: '2023-02-09 16:38:06',
    relatedApp: '测试hulk专用',
    description: 'zx',
  };

  return (
    <div className="flex h-full flex-col bg-gray-50">
      {/* 面包屑导航 */}
      <ProjectSwitcherBreadcrumb projectName={appInfo.projectName} projects={projects} applicationsByProject={applicationsByProject} onProjectChange={onProjectChange} onApplicationChange={onApplicationChange} suffix={<><span className="text-gray-400">{'>'}</span><button onClick={onBack} className="text-[#202020] hover:underline">应用</button><span className="text-gray-400">{'>'}</span><span className="font-medium text-gray-900">{appInfo.name}</span></>} />

      <div className="flex shrink-0 items-center gap-3 bg-white px-6 py-5"><button aria-label="返回应用列表" onClick={onBack} className="cursor-pointer text-[#63748A] hover:text-[#0066FF]"><ArrowLeft className="h-5 w-5" /></button><h1 className="text-lg font-medium">{appInfo.name}</h1><span className="rounded-sm bg-[#EEF6FF] px-2 py-1 text-xs text-[#0066FF]">应用</span></div>
      <Tabs defaultValue={initialTab} className="min-h-0 flex-1 gap-0">
        <div className="shrink-0 overflow-x-auto border-b border-[#E6E6E6] bg-white px-6">
          <TabsList aria-label="应用详情" className="h-11 w-max justify-start gap-7 rounded-none bg-white p-0">
            {detailTabs.map(tab => <TabsTrigger key={tab.id} value={tab.id} className="h-11 flex-none cursor-pointer rounded-none border-0 border-b-2 border-transparent px-1 text-[#666666] data-[state=active]:border-[#0066FF] data-[state=active]:text-[#0066FF] data-[state=active]:shadow-none">{tab.label}</TabsTrigger>)}
          </TabsList>
        </div>
      {/* 内容区域 */}
      <TabsContent value="overview" className="min-h-0 overflow-auto p-6 space-y-6">
        {/* 应用基础信息 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-base font-medium text-gray-900 mb-4">应用基础信息</h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
            <div className="flex">
              <span className="text-sm text-gray-500 w-24 flex-shrink-0">应用名称:</span>
              <span className="text-sm text-gray-900">{appInfo.name}</span>
            </div>
            <div className="flex">
              <span className="text-sm text-gray-500 w-24 flex-shrink-0">应用ID:</span>
              <span className="text-sm text-gray-900">{appInfo.appId}</span>
            </div>
            <div className="flex">
              <span className="text-sm text-gray-500 w-24 flex-shrink-0">所属项目:</span>
              <span className="text-sm text-gray-900">{appInfo.projectName}</span>
            </div>
            <div className="flex">
              <span className="text-sm text-gray-500 w-24 flex-shrink-0">创建者:</span>
              <span className="text-sm text-gray-900">{appInfo.creator}</span>
            </div>
            <div className="flex min-w-0">
              <span className="text-sm text-gray-500 w-24 flex-shrink-0">创建时间:</span>
              <span className="whitespace-nowrap text-sm text-gray-900">{appInfo.createTime}</span>
            </div>
            <div className="flex">
              <span className="whitespace-nowrap text-sm text-gray-500 w-24 flex-shrink-0">关联HULK项目:</span>
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

        <ProjectClusterUsage onViewResource={onViewResource} />
      </TabsContent>
      <TabsContent value="members" className="min-h-0 overflow-auto"><MemberManagement embedded scope="application" /></TabsContent>
      <TabsContent value="apikeys" className="min-h-0 overflow-auto"><APIKeysManagement embedded showPlatformAuthorization={false} /></TabsContent>
      <TabsContent value="config" className="min-h-0 overflow-auto"><ApplicationConfiguration /></TabsContent>
      </Tabs>
    </div>
  );
}
