'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ChevronLeft, ChevronRight, Clock3, Grid3X3, Star, X } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import FloatingButtons from '@/components/common/FloatingButtons';
import ApplicationList from '@/components/application/ApplicationList';
import ApplicationDetail from '@/components/application/ApplicationDetail';
import ClusterList from '@/components/cluster/ClusterList';
import ClusterDetail from '@/components/cluster/ClusterDetail';
import CreateCluster from '@/components/cluster/CreateCluster';
import AlertPolicy from '@/components/alert/AlertPolicy';
import AlertHistory from '@/components/alert/AlertHistory';
import DeploymentManagement from '@/components/workload/DeploymentManagement';
import DeploymentDetail from '@/components/workload/DeploymentDetail';
import CreateDeployment from '@/components/workload/CreateDeployment';
import EditDeployment from '@/components/workload/EditDeployment';
import EditDeploymentVersion from '@/components/workload/EditDeploymentVersion';
import StatefulSetManagement from '@/components/workload/StatefulSetManagement';
import CronJobManagement from '@/components/workload/CronJobManagement';
import JobManagement from '@/components/workload/JobManagement';
import ServiceManagement from '@/components/traffic/ServiceManagement';
import CreateService from '@/components/traffic/CreateService';
import IngressManagement from '@/components/traffic/IngressManagement';
import CreateIngress from '@/components/traffic/CreateIngress';
import LoadBalancerManagement from '@/components/traffic/LoadBalancerManagement';
import CreateLoadBalancer from '@/components/traffic/CreateLoadBalancer';
import PVCManagement from '@/components/storage/PVCManagement';
import ConfigMapManagement from '@/components/config/ConfigMapManagement';
import SecretManagement from '@/components/config/SecretManagement';
import EventManagement from '@/components/log/EventManagement';
import AuditManagement from '@/components/log/AuditManagement';
import APIKeysManagement from '@/components/api/APIKeysManagement';
import MemberManagement from '@/components/member/MemberManagement';
import SettingsManagement from '@/components/settings/SettingsManagement';
import ProjectManagement, { initialProjects } from '@/components/project/ProjectManagement';
import ProjectDetail from '@/components/project/ProjectDetail';
import ImageService from '@/components/crs/ImageService';
import type { ProjectSwitcherApplication, ProjectSwitcherProject } from '@/components/layout/ProjectSwitcherBreadcrumb';
import { ProjectBreadcrumbProvider } from '@/components/layout/ProjectSwitcherBreadcrumb';

const applications = [
  {
    id: 1,
    name: 'gengjie',
    displayName: 'gengjie',
    description: '勿删，蚂蚁专用',
    createTime: '2026-01-20 15:52:35',
    creator: 'gengjie',
  },
  {
    id: 2,
    name: 'aiuitest',
    displayName: 'aiuitest',
    description: 'AIUI test',
    createTime: '2025-12-24 14:49:39',
    creator: 'yangxue3',
  },
  {
    id: 3,
    name: 'yunzhou-guance',
    displayName: 'yunzhou-guance',
    description: '云舟专用',
    createTime: '2025-09-02 14:36:42',
    creator: 'zongju',
  },
  {
    id: 4,
    name: 'zetao-test',
    displayName: 'zetao-test',
    description: '',
    createTime: '2025-08-08 14:40:32',
    creator: 'zhangzetao',
  },
  {
    id: 5,
    name: 'yjy-test',
    displayName: 'yjy-test',
    description: '',
    createTime: '2025-07-11 11:48:01',
    creator: 'yangjiaying',
  },
  {
    id: 6,
    name: 'aaa',
    displayName: 'aaa',
    description: '',
    createTime: '2025-04-25 13:18:13',
    creator: 'liangzhenyang',
  },
  {
    id: 7,
    name: 'wjw-test',
    displayName: 'wjw-test',
    description: '',
    createTime: '2025-04-17 17:37:36',
    creator: 'wangjinwei',
  },
  {
    id: 8,
    name: 'lxx4',
    displayName: 'lxx4',
    description: '没有绑定hulk项目 历史数据',
    createTime: '2024-10-28 14:18:24',
    creator: 'lixiaoxing1',
  },
  {
    id: 9,
    name: 'lxx2',
    displayName: 'lxx2',
    description: '新建vip',
    createTime: '2024-10-17 15:41:07',
    creator: 'lixiaoxing1',
  },
  {
    id: 10,
    name: 'fee',
    displayName: 'fee',
    description: '',
    createTime: '2024-10-10 17:49:20',
    creator: 'yangxue3',
  },
  {
    id: 11,
    name: 'autotest-cluster-monitor',
    displayName: 'autotest-cluster-monitor',
    description: '观测线上独享集群稳定性',
    createTime: '2024-07-26 15:07:33',
    creator: 'lixiaoxing1',
  },
  {
    id: 12,
    name: 'lxc-test',
    displayName: 'lxc-test',
    description: '',
    createTime: '2024-06-07 17:57:35',
    creator: 'liuxuecheng',
  },
  {
    id: 13,
    name: 'testa',
    displayName: 'testa',
    description: '',
    createTime: '2024-04-25 17:37:58',
    creator: 'lixiaoxing1',
  },
  {
    id: 14,
    name: 'autotest-ui-monitor',
    displayName: 'autotest-ui-monitor',
    description: '',
    createTime: '2024-04-01 18:06:26',
    creator: 'yangxue3',
  },
  {
    id: 15,
    name: 'autotest-ui',
    displayName: 'autotest-ui',
    description: '',
    createTime: '2024-04-01 18:06:15',
    creator: 'yangxue3',
  },
  {
    id: 16,
    name: 'test-vvl',
    displayName: 'test-vvl',
    description: '通知',
    createTime: '2024-03-25 20:24:32',
    creator: 'yanqvalin1',
  },
];

const PRODUCT_GUIDE_STORAGE_KEY = 'container-cloud-menu-guide-v3';

function ProductGuide({ onStepChange }: { onStepChange: (step: number) => void }) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const initialized = useRef(false);
  const [targetRect, setTargetRect] = useState<{ left: number; top: number; width: number; height: number; cardLeft: number; cardTop: number } | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (initialized.current) return;
      initialized.current = true;
      try {
        if (window.localStorage.getItem(PRODUCT_GUIDE_STORAGE_KEY) !== 'dismissed') {
          onStepChange(0);
          setVisible(true);
        }
      } catch {
        onStepChange(0);
        setVisible(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [onStepChange]);

  useLayoutEffect(() => {
    if (!visible) return;
    const update = () => {
      const target = document.querySelector(`[data-guide="${['context-switcher', 'project-tabs', 'application-tabs'][step]}"]`);
      if (!target) return;
      const rect = target.getBoundingClientRect();
      setTargetRect({ left: rect.left - 6, top: rect.top - 6, width: rect.width + 12, height: rect.height + 12,
        cardLeft: Math.max(16, Math.min(rect.left, window.innerWidth - 496)), cardTop: rect.bottom + 22 });
    };
    const frame = requestAnimationFrame(update);
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', update); window.removeEventListener('scroll', update, true); };
  }, [step, visible]);

  const changeStep = (next: number) => {
    setTargetRect(null);
    onStepChange(next);
    setStep(next);
  };

  const updateDontShowAgain = (checked: boolean) => {
    setDontShowAgain(checked);
    try {
      if (checked) {
        window.localStorage.setItem(PRODUCT_GUIDE_STORAGE_KEY, 'dismissed');
      } else {
        window.localStorage.removeItem(PRODUCT_GUIDE_STORAGE_KEY);
      }
    } catch {
      // Keep the guide usable when browser storage is unavailable.
    }
  };

  const close = () => setVisible(false);

  if (!visible) return null;

  const steps = [
    {
      label: '01',
      title: '切换项目和应用的入口已迁移',
      description: '项目和应用切换入口已统一移动到页面顶部面包屑。点击项目名称即可打开切换弹窗，选择项目或应用。',
      location: '页面顶部：当前项目 > 项目名称',
    },
    {
      label: '02',
      title: '项目级成员、APIkeys、设置等已集中到项目详情',
      description: '这里是项目详情页。成员管理、APIkeys、资源统计、上线记录和项目设置已移到上方高亮的标签栏中。',
      location: '项目管理 > 项目名称 > 项目详情 TAB',
    },
    {
      label: '03',
      title: '应用级成员、APIkeys、配置功能已集中到应用详情',
      description: '这里是应用详情页。成员管理、APIkeys和应用配置已移到上方高亮的标签栏中，点击对应标签即可使用。',
      location: '应用列表 > 应用名称 > 应用详情 TAB',
    },
  ];
  const current = steps[step];

  return (
    <Dialog.Root open={visible} onOpenChange={open => { if (!open) close(); }}>
      <Dialog.Portal>
      <Dialog.Overlay className={`fixed inset-0 z-[3000] ${targetRect ? 'bg-transparent' : 'bg-[#0F172A]/45'}`} />
      {targetRect && <div aria-hidden="true" className="pointer-events-none fixed z-[3001] rounded border-2 border-[#0066FF] shadow-[0_0_0_9999px_rgba(15,23,42,0.45)]" style={{ left: targetRect.left, top: targetRect.top, width: targetRect.width, height: targetRect.height }} />}
      <Dialog.Content onPointerDownOutside={event => event.preventDefault()} style={targetRect ? { left: targetRect.cardLeft, top: targetRect.cardTop, maxHeight: `calc(100dvh - ${targetRect.cardTop + 16}px)` } : undefined} className={`fixed z-[3002] w-[calc(100%-32px)] max-w-[480px] overflow-y-auto rounded-lg bg-white shadow-[0_16px_48px_rgba(15,23,42,0.2)] outline-none ${targetRect ? '' : 'left-1/2 top-1/2 max-h-[calc(100dvh-32px)] -translate-x-1/2 -translate-y-1/2'}`}>
        <div className="flex items-center justify-between border-b border-[#E6E6E6] px-6 py-3">
          <div>
            <p className="mb-1 text-xs font-medium tracking-[0.12em] text-[#0066FF]">功能导航更新</p>
            <Dialog.Title className="text-lg font-medium text-[#202020]">切换项目与菜单调整说明</Dialog.Title>
          </div>
          <button type="button" aria-label="关闭引导" onClick={close} className="rounded p-1 text-[#8C9AAE] hover:bg-[#F5F7FA] hover:text-[#202020]"><X className="h-5 w-5" /></button>
        </div>
        <div className="px-6 py-3">
          <div className="mb-3 flex items-center gap-2" aria-label={`第 ${step + 1} 步，共 3 步`}>
            {steps.map((item, index) => <div key={item.label} className={`flex items-center gap-2 ${index < steps.length - 1 ? 'flex-1' : ''}`}><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium ${index === step ? 'bg-[#0066FF] text-white' : index < step ? 'bg-[#E8F1FF] text-[#0066FF]' : 'bg-[#F2F4F7] text-[#8C9AAE]'}`}>{item.label}</span>{index < steps.length - 1 && <span className={`h-px w-full ${index < step ? 'bg-[#8DBBFF]' : 'bg-[#E6EAF0]'}`} />}</div>)}
          </div>
          <div aria-live="polite" className="rounded-md border border-[#D8E8FF] bg-[#F5F9FF] p-4">
            <h3 className="mb-2 text-base font-semibold text-[#202020]">{current.title}</h3>
            <Dialog.Description className="mb-3 text-sm leading-6 text-[#4B5563]">{current.description}</Dialog.Description>
            <div className="rounded bg-white px-3 py-2 text-xs text-[#0066FF]">位置：{current.location}</div>
          </div>
          <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm text-[#63748A]">
            <input type="checkbox" checked={dontShowAgain} onChange={event => updateDontShowAgain(event.target.checked)} className="h-4 w-4 cursor-pointer accent-[#0066FF]" />
            下次不再显示
          </label>
        </div>
        <div className="flex items-center justify-between border-t border-[#E6E6E6] px-6 py-3">
          <button type="button" onClick={close} className="text-sm text-[#63748A] hover:text-[#202020]">跳过引导</button>
          <div className="flex items-center gap-3">
            {step > 0 && <button type="button" onClick={() => changeStep(step - 1)} className="inline-flex h-9 items-center gap-1 rounded border border-[#D8E0E8] px-3 text-sm text-[#4B5563] hover:border-[#8DBBFF] hover:text-[#0066FF]"><ChevronLeft className="h-4 w-4" />上一步</button>}
            {step < steps.length - 1 ? <button type="button" onClick={() => changeStep(step + 1)} className="inline-flex h-9 items-center gap-1 rounded bg-[#0066FF] px-4 text-sm text-white hover:bg-[#0052CC]">下一步<ChevronRight className="h-4 w-4" /></button> : <button type="button" onClick={close} className="h-9 rounded bg-[#0066FF] px-4 text-sm text-white hover:bg-[#0052CC]">开始使用</button>}
          </div>
        </div>
      </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const appContextMenuItems = new Set([
  'workload',
  'deployment',
  'statefulset',
  'daemonset',
  'cronjob',
  'job',
  'traffic',
  'service',
  'ingress',
  'loadbalancer',
  'config',
  'configmap',
  'secret',
  'storage',
  'pvc',
  'app-alert',
  'app-alert-policy',
  'app-alert-history',
  'log',
  'event',
  'audit',
  'platform',
  'app-members',
  'app-apikeys',
  'app-config',
]);

export default function Page() {
  const [activeMenuItem, setActiveMenuItem] = useState('project');
  const [projects, setProjects] = useState(initialProjects);
  const [selectedProjectDetailId, setSelectedProjectDetailId] = useState<number | null>(null);
  const [applicationProjectName, setApplicationProjectName] = useState<string | undefined>();
  const currentProjectName = projects.find(project => project.name === applicationProjectName)?.name ?? projects[0]?.name ?? '—';
  const applicationsByProject = useMemo<Record<number, typeof applications>>(() => ({
    1: applications.slice(0, applications.length / 2),
    2: applications.slice(applications.length / 2),
  }), []);
  const currentProjectId = projects.find(project => project.name === currentProjectName)?.id;
  const currentProjectApplications = currentProjectId === undefined ? [] : applicationsByProject[currentProjectId] ?? [];
  const defaultApplicationName = currentProjectApplications[0]?.name ?? '—';
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplicationName, setSelectedApplicationName] = useState<string | null>(null);
  const [applicationDetailInitialTab, setApplicationDetailInitialTab] = useState<'overview' | 'members'>('overview');
  const [currentApplicationName, setCurrentApplicationName] = useState<string | null>(null);
  const breadcrumbApplicationName = currentProjectApplications.find(app => app.name === currentApplicationName)?.name ?? defaultApplicationName;
  const [selectedClusterName, setSelectedClusterName] = useState<string | null>(null);
  const [selectedDeploymentName, setSelectedDeploymentName] = useState<string | null>(null);
  const [selectedDeploymentId, setSelectedDeploymentId] = useState<number | null>(null);
  const [editingDeployment, setEditingDeployment] = useState<{
    id: number;
    name: string;
    description: string;
  } | null>(null);
  const [editingDeploymentVersion, setEditingDeploymentVersion] = useState<{
    id: number;
    version: string;
    releaseNote: string;
    image: string;
  } | null>(null);
  const [showCreateCluster, setShowCreateCluster] = useState(false);
  const [showCreateDeployment, setShowCreateDeployment] = useState(false);
  const [showCreateService, setShowCreateService] = useState(false);
  const [showCreateIngress, setShowCreateIngress] = useState(false);
  const [showCreateLoadBalancer, setShowCreateLoadBalancer] = useState(false);

  const itemsPerPage = 10;

  const filteredApplications = useMemo(() => {
    return (currentProjectId === undefined ? [] : applicationsByProject[currentProjectId] ?? []).filter((app) => {
      const keyword = searchTerm.toLowerCase();
      const matchesSearch =
        app.name.toLowerCase().includes(keyword) ||
        app.displayName.toLowerCase().includes(keyword) ||
        app.description.toLowerCase().includes(keyword);

      if (activeTab === 'favorites') return false;
      return matchesSearch;
    });
  }, [activeTab, searchTerm, applicationsByProject, currentProjectId]);

  const totalPages = Math.max(1, Math.ceil(filteredApplications.length / itemsPerPage));

  const resetCreatePages = () => {
    setShowCreateCluster(false);
    setShowCreateDeployment(false);
    setShowCreateService(false);
    setShowCreateIngress(false);
    setShowCreateLoadBalancer(false);
  };

  const handleMenuChange = (itemId: string) => {
    setActiveMenuItem(itemId);
    setSelectedProjectDetailId(null);
    setCurrentPage(1);
    resetCreatePages();

    if (itemId === 'app-list') {
      setSelectedApplicationName(null);
      setSearchTerm('');
      setActiveTab('all');
    } else if (!appContextMenuItems.has(itemId)) {
      setSelectedApplicationName(null);
    }
    if (itemId !== 'cluster') {
      setSelectedClusterName(null);
    }
    setSelectedDeploymentName(null);
    setSelectedDeploymentId(null);
    setEditingDeployment(null);
    setEditingDeploymentVersion(null);
  };

  const handleProjectChange = (project: ProjectSwitcherProject) => {
    setApplicationProjectName(project.name);
    setCurrentApplicationName(null);
    setSearchTerm('');
    setActiveTab('all');
    handleMenuChange('project');
    setSelectedProjectDetailId(project.id);
  };

  const handleApplicationChange = (project: ProjectSwitcherProject, application: ProjectSwitcherApplication) => {
    handleMenuChange('app-list');
    setApplicationProjectName(project.name);
    setSelectedApplicationName(application.name);
    setApplicationDetailInitialTab('overview');
    setCurrentApplicationName(application.name);
    setSearchTerm('');
    setActiveTab('all');
  };

  const handleApplicationDetailProjectChange = (project: ProjectSwitcherProject) => {
    const nextApplication = (applicationsByProject[project.id] ?? [])[0];
    setApplicationProjectName(project.name);
    setCurrentApplicationName(nextApplication?.name ?? null);
    setSelectedApplicationName(nextApplication?.name ?? '—');
  };

  const handleApplicationDetailChange = (project: ProjectSwitcherProject, application: ProjectSwitcherApplication) => {
    setApplicationProjectName(project.name);
    setCurrentApplicationName(application.name);
    setSelectedApplicationName(application.name);
  };

  const handleGuideStepChange = useCallback((step: number) => {
    const project = projects.find(item => item.name === currentProjectName) ?? projects[0];
    setActiveMenuItem(step === 2 ? 'app-list' : 'project');
    setSelectedProjectDetailId(step === 1 ? project?.id ?? null : null);
    setSelectedApplicationName(step === 2 ? breadcrumbApplicationName : null);
    setApplicationDetailInitialTab('overview');
    setSelectedClusterName(null);
    setSelectedDeploymentName(null);
    setShowCreateCluster(false);
    setShowCreateDeployment(false);
    setShowCreateService(false);
    setShowCreateIngress(false);
    setShowCreateLoadBalancer(false);
  }, [projects, currentProjectName, breadcrumbApplicationName]);

  const projectSwitcherProps = {
    projectName: currentProjectName,
    applicationName: breadcrumbApplicationName,
    projects,
    applicationsByProject,
    onProjectChange: handleProjectChange,
    onApplicationChange: handleApplicationChange,
    onApplicationListClick: () => handleMenuChange('app-list'),
  };

  const listProjectSwitcherProps = {
    ...projectSwitcherProps,
    onProjectChange: (project: ProjectSwitcherProject) => {
      setApplicationProjectName(project.name);
      setCurrentApplicationName(null);
    },
    onApplicationChange: (project: ProjectSwitcherProject, application: ProjectSwitcherApplication) => {
      if (['project', 'cluster', 'app-list'].includes(activeMenuItem)) {
        handleApplicationChange(project, application);
        return;
      }
      setApplicationProjectName(project.name);
      setCurrentApplicationName(application.name);
    },
  };

  const isResourceListPage = [
    'deployment', 'statefulset', 'daemonset', 'cronjob', 'job',
    'service', 'ingress', 'loadbalancer', 'configmap', 'secret', 'pvc',
    'alert-policy', 'app-alert-policy', 'alert-history', 'app-alert-history', 'event', 'audit',
    'image-service',
  ].includes(activeMenuItem) && !selectedDeploymentName && !editingDeployment && !editingDeploymentVersion
    && !showCreateDeployment && !showCreateService && !showCreateIngress && !showCreateLoadBalancer;

  const renderContent = () => {
    if (activeMenuItem === 'project' && selectedProjectDetailId !== null) {
      const project = projects.find(item => item.id === selectedProjectDetailId);
      if (project) return <ProjectDetail {...projectSwitcherProps} key={project.id} project={project} initialTab="overview" onBack={() => setSelectedProjectDetailId(null)} />;
    }
    if (activeMenuItem === 'project') return <ProjectManagement {...projectSwitcherProps} onProjectsChange={setProjects} onViewProject={handleProjectChange} />;

    if (activeMenuItem === 'app-list') {
      return selectedApplicationName ? (
        <ApplicationDetail {...projectSwitcherProps} key={applicationDetailInitialTab} applicationName={selectedApplicationName} initialTab={applicationDetailInitialTab} onProjectChange={handleApplicationDetailProjectChange} onApplicationChange={handleApplicationDetailChange} onBack={() => setSelectedApplicationName(null)} onViewResource={handleMenuChange} />
      ) : (
        <ApplicationList
          {...listProjectSwitcherProps}
          applications={filteredApplications}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalPages={totalPages}
          totalItems={filteredApplications.length}
          itemsPerPage={itemsPerPage}
          onViewApplication={(name, initialTab = 'overview') => { setSelectedApplicationName(name); setCurrentApplicationName(name); setApplicationDetailInitialTab(initialTab); }}
        />
      );
    }

    if (activeMenuItem === 'cluster') {
      if (showCreateCluster) {
        return <CreateCluster onCancel={() => setShowCreateCluster(false)} onNext={() => setShowCreateCluster(false)} />;
      }

      if (selectedClusterName) {
        return <ClusterDetail clusterName={selectedClusterName} onBack={() => setSelectedClusterName(null)} />;
      }

      return (
        <ClusterList
          {...listProjectSwitcherProps}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalPages={1}
          totalItems={10}
          itemsPerPage={itemsPerPage}
          onCreateCluster={() => setShowCreateCluster(true)}
          onViewDetail={setSelectedClusterName}
        />
      );
    }

    if (activeMenuItem === 'deployment') {
      if (editingDeploymentVersion && selectedDeploymentName) {
        return (
          <EditDeploymentVersion
            deploymentName={selectedDeploymentName}
            version={editingDeploymentVersion}
            onBack={() => setEditingDeploymentVersion(null)}
            onCancel={() => setEditingDeploymentVersion(null)}
            onSave={() => setEditingDeploymentVersion(null)}
          />
        );
      }

      if (editingDeployment) {
        return (
          <EditDeployment
            deployment={editingDeployment}
            onBack={() => setEditingDeployment(null)}
            onCancel={() => setEditingDeployment(null)}
            onSave={() => setEditingDeployment(null)}
          />
        );
      }

      if (showCreateDeployment) {
        return (
          <CreateDeployment
            onBack={() => setShowCreateDeployment(false)}
            onCancel={() => setShowCreateDeployment(false)}
            onNext={() => setShowCreateDeployment(false)}
          />
        );
      }

      if (selectedDeploymentName && selectedDeploymentId) {
        return (
          <DeploymentDetail
            deploymentName={selectedDeploymentName}
            deploymentId={selectedDeploymentId}
            onBack={() => {
              setEditingDeploymentVersion(null);
              setSelectedDeploymentName(null);
              setSelectedDeploymentId(null);
            }}
            onEditVersion={(version) => {
              setEditingDeploymentVersion({
                id: version.id,
                version: version.version,
                releaseNote: version.releaseNote,
                image: version.image,
              });
            }}
          />
        );
      }

      return (
        <DeploymentManagement
          onCreateDeployment={() => {
            setEditingDeployment(null);
            setShowCreateDeployment(true);
          }}
          onViewDetail={(name, id) => {
            setEditingDeployment(null);
            setSelectedDeploymentName(name);
            setSelectedDeploymentId(id);
          }}
          onEditDeployment={(deployment) => {
            setShowCreateDeployment(false);
            setSelectedDeploymentName(null);
            setSelectedDeploymentId(null);
            setEditingDeployment({
              id: deployment.id,
              name: deployment.name,
              description: deployment.description,
            });
          }}
        />
      );
    }

    if (activeMenuItem === 'statefulset') return <StatefulSetManagement />;
    if (activeMenuItem === 'daemonset') return <StatefulSetManagement key="daemonset" workloadType="DaemonSet" />;
    if (activeMenuItem === 'cronjob') return <CronJobManagement />;
    if (activeMenuItem === 'job') return <JobManagement />;

    if (activeMenuItem === 'service') {
      return showCreateService ? (
        <CreateService onCancel={() => setShowCreateService(false)} />
      ) : (
        <ServiceManagement onCreateService={() => setShowCreateService(true)} />
      );
    }

    if (activeMenuItem === 'ingress') {
      return showCreateIngress ? (
        <CreateIngress onCancel={() => setShowCreateIngress(false)} />
      ) : (
        <IngressManagement onCreateIngress={() => setShowCreateIngress(true)} />
      );
    }

    if (activeMenuItem === 'loadbalancer') {
      return showCreateLoadBalancer ? (
        <CreateLoadBalancer onBack={() => setShowCreateLoadBalancer(false)} />
      ) : (
        <LoadBalancerManagement onCreateLoadBalancer={() => setShowCreateLoadBalancer(true)} />
      );
    }

    if (activeMenuItem === 'pvc') return <PVCManagement />;
    if (activeMenuItem === 'configmap') return <ConfigMapManagement />;
    if (activeMenuItem === 'secret') return <SecretManagement />;
    if (activeMenuItem === 'image-service') return <ImageService />;
    if (activeMenuItem === 'alert-policy' || activeMenuItem === 'app-alert-policy') return <AlertPolicy />;
    if (activeMenuItem === 'alert-history' || activeMenuItem === 'app-alert-history') return <AlertHistory />;
    if (activeMenuItem === 'event') return <EventManagement />;
    if (activeMenuItem === 'audit') return <AuditManagement />;
    if (activeMenuItem === 'apikeys' || activeMenuItem === 'app-apikeys') return <APIKeysManagement />;
    if (activeMenuItem === 'members' || activeMenuItem === 'app-members') return <MemberManagement />;
    if (activeMenuItem === 'settings' || activeMenuItem === 'app-settings') return <SettingsManagement />;

    return (
      <div className="flex h-full items-center justify-center bg-gray-50 text-sm text-gray-500">
        当前页面暂未配置内容
      </div>
    );
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      <Header />
      <div className="flex min-h-0 flex-1">
        <ProductIconBar />
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapse={() => setSidebarCollapsed((value) => !value)}
          activeMenuItem={activeMenuItem}
          onMenuItemChange={handleMenuChange}
        />
        <div className="min-w-0 flex-1 overflow-hidden"><ProjectBreadcrumbProvider value={activeMenuItem === 'project' || isResourceListPage ? listProjectSwitcherProps : projectSwitcherProps}>{renderContent()}</ProjectBreadcrumbProvider></div>
        <FloatingButtons />
        <ProductGuide onStepChange={handleGuideStepChange} />
      </div>
    </div>
  );
}

function ProductIconBar() {
  const quickItems = [
    {
      label: '全部',
      active: true,
      icon: Grid3X3,
    },
    {
      label: '最近',
      active: false,
      icon: Clock3,
    },
    {
      label: '收藏',
      active: false,
      icon: Star,
    },
  ];
  const productItems = ['OBS', 'Sbox', 'TLP', 'TLG', 'CIS', 'GC', 'TLM', 'MySQL', 'ECS', 'FC'];

  return (
    <div className="w-[50px] flex-shrink-0 overflow-y-auto bg-[#2e8cff] text-white">
      <div className="border-b border-white/20 pb-1">
        {quickItems.map((item) => (
          <button
            key={item.label}
            className={`relative flex h-[50px] w-full cursor-pointer flex-col items-center justify-center text-[10px] leading-none transition-colors hover:bg-[#0066FF] hover:text-white ${
              item.active ? 'bg-[#0066FF] text-white' : 'text-[#E5EAF3]'
            }`}
            title={item.label}
          >
            {item.active && <span className="absolute left-0 top-2 h-9 w-0.5 bg-white" />}
            <item.icon className="mb-1 h-5 w-5" strokeWidth={2} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="py-1">
        {productItems.map((item) => (
          <button
            key={item}
            className={`flex h-[40px] w-full cursor-pointer flex-col items-center justify-center text-[9px] leading-none transition-colors hover:bg-[#0066FF] hover:text-white ${
              item === 'CIS' ? 'bg-[#0066FF] text-white' : 'text-[#E5EAF3]'
            }`}
            title={item}
          >
            <svg className="mb-0.5 h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 11-2 0 1 1 0 012 0zM2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm14 1a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
            <span>{item}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
