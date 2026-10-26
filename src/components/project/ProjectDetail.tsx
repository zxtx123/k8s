'use client';

import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import ProjectSwitcherBreadcrumb, { type ProjectSwitcherApplication, type ProjectSwitcherProject } from '@/components/layout/ProjectSwitcherBreadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MemberManagement from '@/components/member/MemberManagement';
import APIKeysManagement from '@/components/api/APIKeysManagement';
import SettingsManagement from '@/components/settings/SettingsManagement';
import type { Project } from './ProjectManagement';
import ProjectResourceStatistics from './ProjectResourceStatistics';
import ProjectReleaseHistory from './ProjectReleaseHistory';
import ProjectClusterUsage from './ProjectClusterUsage';

const detailTabs = [
  { id: 'overview', label: '概览' },
  { id: 'members', label: '成员管理' },
  { id: 'apikeys', label: 'APIkeys' },
  { id: 'resources', label: '资源统计' },
  { id: 'releases', label: '上线记录' },
  { id: 'settings', label: '设置' },
];

interface ProjectDetailProps {
  project: Project;
  projects: ProjectSwitcherProject[];
  applicationsByProject: Record<number, ProjectSwitcherApplication[]>;
  onProjectChange?: (project: ProjectSwitcherProject) => void;
  onApplicationChange?: (project: ProjectSwitcherProject, application: ProjectSwitcherApplication) => void;
  onApplicationListClick?: () => void;
  onBack: () => void;
  initialTab?: 'overview' | 'members';
}

export default function ProjectDetail({ project, projects, applicationsByProject, onProjectChange, onApplicationChange, onApplicationListClick, onBack, initialTab = 'overview' }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  return (
    <div className="flex h-full flex-col bg-[#F0F5F7] text-sm text-[#202020]">
      <ProjectSwitcherBreadcrumb projectName={project.name} projects={projects} applicationsByProject={applicationsByProject} onProjectChange={selectedProject => { setActiveTab('overview'); onProjectChange?.(selectedProject); }} onApplicationChange={onApplicationChange} onApplicationListClick={onApplicationListClick} />
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 bg-white px-6 py-5">
        <div className="flex min-w-0 items-center gap-3"><button aria-label="返回项目列表" onClick={onBack} className="cursor-pointer text-[#63748A] hover:text-[#0066FF]"><ArrowLeft className="h-5 w-5" /></button><h1 className="truncate text-lg font-medium">{project.name}</h1><span className="rounded-sm bg-[#EEF6FF] px-2 py-1 text-xs text-[#0066FF]">项目</span></div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="min-h-0 flex-1 gap-0">
        <div className="shrink-0 overflow-x-auto border-b border-[#E6E6E6] bg-white px-6">
          <TabsList aria-label="项目详情" className="h-11 w-max justify-start gap-7 rounded-none bg-white p-0">
            {detailTabs.map(tab => <TabsTrigger key={tab.id} value={tab.id} className="h-11 flex-none cursor-pointer rounded-none border-0 border-b-2 border-transparent px-1 text-[#666666] data-[state=active]:border-[#0066FF] data-[state=active]:text-[#0066FF] data-[state=active]:shadow-none">{tab.label}</TabsTrigger>)}
          </TabsList>
        </div>
        <TabsContent value="overview" className="min-h-0 overflow-auto p-5">
          <section className="bg-white p-6"><h2 className="mb-6 text-base font-medium">项目基础信息</h2><dl className="grid grid-cols-1 gap-x-10 gap-y-6 lg:grid-cols-2">
            {[
              ['名称', project.name], ['K8S命名空间', project.namespace], ['项目ID', String(project.id)], ['资源组', '产品团队-专用'], ['创建者', project.creator || '—'], ['创建时间', project.createTime],
            ].map(([label, value]) => <div key={label} className="flex gap-4"><dt className="w-28 shrink-0 text-[#63748A]">{label}</dt><dd className="min-w-0 break-all">{value}</dd></div>)}
          </dl></section>
          <ProjectClusterUsage />
        </TabsContent>
        <TabsContent value="members" className="min-h-0 overflow-auto"><MemberManagement embedded /></TabsContent>
        <TabsContent value="apikeys" className="min-h-0 overflow-auto"><APIKeysManagement embedded /></TabsContent>
        <TabsContent value="resources" className="min-h-0 overflow-auto p-3"><ProjectResourceStatistics /></TabsContent>
        <TabsContent value="releases" className="min-h-0 overflow-auto p-3"><ProjectReleaseHistory /></TabsContent>
        <TabsContent value="settings" className="min-h-0 overflow-auto"><SettingsManagement embedded /></TabsContent>
      </Tabs>
    </div>
  );
}
