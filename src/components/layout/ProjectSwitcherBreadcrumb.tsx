'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { Portal } from '@radix-ui/react-popover';
import { ChevronDown, ChevronRight, Search, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface ProjectSwitcherProject {
  id: number;
  name: string;
}

export interface ProjectSwitcherApplication {
  name: string;
  displayName?: string;
}

interface ProjectSwitcherBreadcrumbProps {
  projectName: string;
  applicationName?: string;
  projects: ProjectSwitcherProject[];
  applicationsByProject: Record<number, ProjectSwitcherApplication[]>;
  onProjectChange?: (project: ProjectSwitcherProject) => void;
  onApplicationChange?: (project: ProjectSwitcherProject, application: ProjectSwitcherApplication) => void;
  onApplicationListClick?: () => void;
  suffix?: ReactNode;
}

export interface ProjectBreadcrumbContextValue {
  projectName: string;
  applicationName: string;
  projects: ProjectSwitcherProject[];
  applicationsByProject: Record<number, ProjectSwitcherApplication[]>;
  onProjectChange?: (project: ProjectSwitcherProject) => void;
  onApplicationChange?: (project: ProjectSwitcherProject, application: ProjectSwitcherApplication) => void;
  onApplicationListClick?: () => void;
}

const ProjectBreadcrumbContext = createContext<ProjectBreadcrumbContextValue | null>(null);

export function ProjectBreadcrumbProvider({ value, children }: { value: ProjectBreadcrumbContextValue; children: ReactNode }) {
  return <ProjectBreadcrumbContext.Provider value={value}>{children}</ProjectBreadcrumbContext.Provider>;
}

export function useProjectBreadcrumb() {
  return useContext(ProjectBreadcrumbContext);
}

export default function ProjectSwitcherBreadcrumb({
  projectName,
  applicationName,
  projects,
  applicationsByProject,
  onProjectChange,
  onApplicationChange,
  onApplicationListClick,
  suffix,
}: ProjectSwitcherBreadcrumbProps) {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const close = () => { setOpen(false); setKeyword(''); };
  const normalizedKeyword = keyword.trim().toLowerCase();
  const visibleProjects = projects.map(project => {
    const applications = applicationsByProject[project.id] ?? [];
    const matchesProject = project.name.toLowerCase().includes(normalizedKeyword);
    return { ...project, applications: applications.filter(app => matchesProject || `${app.name} ${app.displayName ?? ''}`.toLowerCase().includes(normalizedKeyword)), matchesProject };
  }).filter(project => project.matchesProject || project.applications.length > 0);

  const currentProject = projects.find(project => project.name === projectName);

  return (
    <div role="navigation" aria-label="面包屑" className="relative flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 text-sm text-gray-600">
      <div className="flex min-w-0 items-center gap-2">
        <span className="shrink-0">当前项目</span>
        <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
        <Popover modal open={open} onOpenChange={value => { setOpen(value); if (!value) setKeyword(''); }}>
        <PopoverTrigger asChild><button
          type="button"
          aria-label="切换项目"
          className="inline-flex max-w-[220px] items-center gap-1 truncate font-medium text-[#0066FF] hover:text-[#0052CC]"
        >
          <span className="truncate">{projectName}</span>
          <ChevronDown fill="currentColor" strokeWidth={0} className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button></PopoverTrigger>
        {open && <Portal><div aria-hidden="true" className="pointer-events-auto fixed inset-0 z-[1100] bg-black/40" onClick={close} /></Portal>}
        <PopoverContent aria-label="切换项目和应用" align="start" side="bottom" sideOffset={16} className="z-[1200] w-[470px] max-w-[calc(100vw-32px)] overflow-hidden rounded border border-[#D8E0E8] bg-white p-0 text-sm shadow-[0_6px_20px_rgba(31,35,41,0.16)]">
          <div className="flex items-center justify-between border-b border-[#E6E6E6] px-5 py-4">
            <h2 className="text-base font-medium text-[#202020]">切换项目</h2>
            <button type="button" aria-label="关闭切换项目" onClick={close} className="text-[#8C9AAE] hover:text-[#202020]"><X className="h-5 w-5" /></button>
          </div>
          <div className="border-b border-[#E6E6E6] bg-[#F8F9FA] px-5 py-5">
            <div className="relative w-[296px] max-w-full">
              <input
                aria-label="搜索项目和应用"
                value={keyword}
                onChange={event => setKeyword(event.target.value)}
                placeholder="请输入关键词"
                className="h-8 w-full rounded border border-[#D8E0E8] bg-white px-3 pr-9 text-sm outline-none placeholder:text-[#B8C2D0] focus:border-[#0066FF]"
              />
              <Search className="pointer-events-none absolute right-3 top-2 h-4 w-4 text-[#8C9AAE]" />
            </div>
          </div>
          <div className="max-h-[min(430px,calc(var(--radix-popover-content-available-height)-150px))] space-y-2 overflow-y-auto bg-[#F8F9FA] px-5 py-3">
            {visibleProjects.map(project => {
              const filteredApplications = project.applications;
              return (
                <section key={project.id} className="overflow-hidden rounded border border-[#D8E0E8] bg-white">
                  <button
                    type="button"
                    onClick={() => { onProjectChange?.(project); close(); }}
                    className={`flex h-10 w-full items-center gap-2 border-b border-[#E6E6E6] px-3 text-left text-sm font-medium ${project.id === currentProject?.id ? 'text-[#0066FF]' : 'text-[#202020]'} hover:bg-[#F5F9FF]`}
                  >
                    <span className="rounded-sm bg-[#EEF6FF] px-1.5 py-0.5 text-xs text-[#0066FF]">项</span>
                    <span className="truncate">{project.name}</span>
                  </button>
                  {filteredApplications.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 p-3">
                      {filteredApplications.map(application => (
                        <button
                          type="button"
                          key={`${project.id}-${application.name}`}
                          onClick={() => { onApplicationChange?.(project, application); close(); }}
                          className="truncate rounded border border-[#E6EDF5] px-2 py-1.5 text-left text-sm text-[#63748A] hover:border-[#8DBBFF] hover:bg-[#F5F9FF] hover:text-[#0066FF]"
                        >
                          {application.displayName || application.name}
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
            {!visibleProjects.length && <div className="py-8 text-center text-sm text-[#8C9AAE]">暂无匹配项目或应用</div>}
          </div>
        </PopoverContent>
        </Popover>
        {applicationName && <><ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />{onApplicationListClick ? <button type="button" onClick={onApplicationListClick} className="shrink-0 cursor-pointer text-[#202020] hover:underline">应用</button> : <span className="shrink-0 text-[#202020]">应用</span>}<ChevronRight className="h-4 w-4 shrink-0 text-gray-400" /><span className="max-w-[180px] truncate font-medium text-gray-900">{applicationName}</span></>}
        {suffix}
      </div>
      <a href="#" className="shrink-0 text-blue-600 hover:underline">CIS帮助文档</a>
    </div>
  );
}
