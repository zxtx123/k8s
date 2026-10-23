'use client';

import { useState } from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { AlertTriangle, ChevronLeft, ChevronRight, Plus, RotateCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogDescription, AlertDialogFooter, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle } from '@/components/ui/alert-dialog';
import ProjectForm, { type ProjectConfiguration } from './ProjectForm';
import ProjectDetail from './ProjectDetail';
import { type ProjectSwitcherApplication, type ProjectSwitcherProject } from '@/components/layout/ProjectSwitcherBreadcrumb';
import ResourceBreadcrumb from '@/components/layout/ResourceBreadcrumb';

export interface Project {
  id: number;
  name: string;
  namespace: string;
  creator: string;
  createTime: string;
  isDefault?: boolean;
  configuration?: ProjectConfiguration;
}

export const initialProjects: Project[] = [
  { id: 1, name: '默认项目', namespace: 'n-starkdef-4703', creator: '', createTime: '2025-01-17 17:47:34', isDefault: true },
  { id: 2, name: 'zxproject', namespace: 'n-zxproject', creator: '360U3368514064', createTime: '2025-01-17 14:08:47' },
];

interface ProjectManagementProps {
  projectName: string;
  projects: Project[];
  applicationsByProject?: Record<number, ProjectSwitcherApplication[]>;
  onProjectsChange: (projects: Project[]) => void;
  onViewApplications: (project: Project) => void;
  onProjectChange?: (project: ProjectSwitcherProject) => void;
  onApplicationChange?: (project: ProjectSwitcherProject, application: ProjectSwitcherApplication) => void;
}

export default function ProjectManagement({ projects, applicationsByProject = {}, onProjectsChange, onViewApplications, onProjectChange, onApplicationChange }: ProjectManagementProps) {
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<{ project?: Project } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [detailProjectId, setDetailProjectId] = useState<number | null>(null);
  const [detailInitialTab, setDetailInitialTab] = useState<'overview' | 'members'>('overview');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const keyword = search.trim().toLowerCase();
  const filteredProjects = projects.filter(project => [project.name, project.namespace, project.creator].some(value => value.toLowerCase().includes(keyword)));
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleProjects = filteredProjects.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const saveProject = (values: { name: string; namespace: string; configuration: ProjectConfiguration }) => {
    if (form?.project) {
      const projectId = form.project.id;
      onProjectsChange(projects.map(project => project.id === projectId ? { ...project, ...values } : project));
    } else {
      const createTime = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date());
      onProjectsChange([...projects, { id: Date.now(), ...values, creator: 'zhangxing5', createTime }]);
      setSearch('');
      setPage(Math.ceil((projects.length + 1) / pageSize));
    }
    setForm(null);
  };

  if (form) {
    return <ProjectForm project={form.project} projects={projects} onCancel={() => setForm(null)} onSave={saveProject} />;
  }

  const detailProject = projects.find(project => project.id === detailProjectId);
  if (detailProject) {
    return <ProjectDetail key={detailProject.id} project={detailProject} projects={projects} applicationsByProject={applicationsByProject} onProjectChange={onProjectChange} onApplicationChange={onApplicationChange} initialTab={detailInitialTab} onBack={() => setDetailProjectId(null)} />;
  }

  return (
    <div className="flex h-full flex-col bg-[#F0F5F7] text-sm text-[#202020]">
      <ResourceBreadcrumb />
      <div className="m-3 flex min-h-0 flex-1 flex-col bg-white">
        <div className="flex shrink-0 flex-wrap items-center gap-4 border-b border-[#E6E6E6] px-4 py-4">
          <Button onClick={() => setForm({})} className="h-10 rounded bg-[#0066FF] px-4 hover:bg-[#0052CC]"><Plus />创建项目</Button>
          <p className="min-w-48 flex-1 text-xs leading-6 text-[#63748A]">一个项目对应k8s集群的一个Namespace，不同项目间通过Namespace实现逻辑上的资源隔离，一个项目下可创建多个应用。</p>
          <div className="ml-auto flex items-center gap-3">
            <div className="relative"><Input aria-label="搜索项目" value={search} onChange={event => { setSearch(event.target.value); setPage(1); }} placeholder="搜索" className="h-10 w-56 rounded border-[#D8E0E8] pr-9 shadow-none" /><Search className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-[#8C9AAE]" /></div>
            <span className="h-6 border-l border-[#E6E6E6]" />
            <Button variant="outline" size="icon" aria-label="刷新项目列表" onClick={() => { setSearch(''); setPage(1); }} className="h-10 w-10 rounded border-[#D8E0E8] shadow-none"><RotateCw className="text-[#8C9AAE]" /></Button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead className="sticky top-0 bg-[#F8F9FA]"><tr className="border-b border-[#E6E6E6] font-medium"><th className="w-1/5 px-3 py-3 font-medium">名称</th><th className="w-1/5 px-3 py-3 font-medium">K8S命名空间</th><th className="w-1/5 px-3 py-3 font-medium">创建者</th><th className="px-3 py-3 font-medium">创建时间</th><th className="w-32 px-3 py-3 font-medium">操作</th></tr></thead>
            <tbody>
              {visibleProjects.map(project => (
                <tr key={project.id} className="border-b border-[#D8E0E8] hover:bg-gray-50">
                  <td className="px-3 py-3"><button onClick={() => onViewApplications(project)} className="cursor-pointer text-[#0066FF] hover:underline" aria-label={`查看项目 ${project.name} 的应用列表`}>{project.name}</button></td><td className="px-3 py-3">{project.namespace}</td><td className="px-3 py-3">{project.creator}</td><td className="whitespace-nowrap px-3 py-3">{project.createTime}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <div className="flex items-center gap-4">
                      <button onClick={() => { setDetailInitialTab('overview'); setDetailProjectId(project.id); }} className="cursor-pointer text-[#0066FF] hover:underline" aria-label={`查看项目 ${project.name} 详情`}>详情</button>
                      <button onClick={() => { setDetailInitialTab('members'); setDetailProjectId(project.id); }} className="cursor-pointer text-[#0066FF] hover:underline" aria-label={`管理项目 ${project.name} 成员`}>成员</button>
                      <button onClick={() => setForm({ project })} className="cursor-pointer text-[#0066FF] hover:underline" aria-label={`编辑项目 ${project.name}`}>编辑</button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><button aria-label={`项目 ${project.name} 更多操作`} className="cursor-pointer text-[#0066FF] p-1"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg></button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded border-[#D8E0E8]">
                          <DropdownMenuItem disabled={project.isDefault} onSelect={() => setDeleteTarget(project)} className="cursor-pointer" aria-label={`删除项目 ${project.name}`}>删除</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
              {!visibleProjects.length && <tr><td colSpan={5} className="py-16 text-center text-gray-400">暂无项目</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-[#E6E6E6] px-6 py-4">
          <span>共 <span className="text-[#0066FF]">{filteredProjects.length}</span> 条记录　第 <span className="text-[#0066FF]">{currentPage}</span> / {totalPages} 页</span>
          <div className="flex items-center gap-2"><Button variant="outline" size="icon" disabled={currentPage === 1} aria-label="上一页" onClick={() => setPage(currentPage - 1)} className="rounded"><ChevronLeft /></Button><span className="flex h-9 min-w-9 items-center justify-center rounded border border-[#0066FF] px-2 text-[#0066FF]">{currentPage}</span><Button variant="outline" size="icon" disabled={currentPage === totalPages} aria-label="下一页" onClick={() => setPage(currentPage + 1)} className="rounded"><ChevronRight /></Button><select aria-label="每页记录数" value={pageSize} onChange={event => { setPageSize(Number(event.target.value)); setPage(1); }} className="ml-3 h-9 rounded border border-[#D8E0E8] bg-white px-3"><option value={10}>10 条/页</option><option value={20}>20 条/页</option><option value={50}>50 条/页</option></select></div>
        </div>
      </div>
      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={open => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogPortal>
        <AlertDialogOverlay className="z-[2050]" />
        <AlertDialogPrimitive.Content className="fixed left-1/2 top-1/2 z-[2100] w-[calc(100%-2rem)] max-w-[640px] -translate-x-1/2 -translate-y-1/2 rounded bg-white p-8 shadow-lg outline-none">
          <div className="flex gap-4"><AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-[#FAAD14]" /><div><AlertDialogTitle className="text-lg font-medium">删除项目确认</AlertDialogTitle><AlertDialogDescription className="mt-3 text-sm text-[#666666]">你确认删除项目 <span className="text-[#0066FF]">{deleteTarget?.name}</span> 吗?</AlertDialogDescription></div></div>
          <AlertDialogFooter className="mt-8 gap-2"><AlertDialogCancel className="rounded border-[#D8E0E8] px-5 shadow-none">取消</AlertDialogCancel><AlertDialogAction className="rounded bg-[#0066FF] px-5 hover:bg-[#0052CC]" onClick={() => { if (deleteTarget && !deleteTarget.isDefault) onProjectsChange(projects.filter(project => project.id !== deleteTarget.id)); setDeleteTarget(null); }}>确定</AlertDialogAction></AlertDialogFooter>
        </AlertDialogPrimitive.Content>
        </AlertDialogPortal>
      </AlertDialog>
    </div>
  );
}
