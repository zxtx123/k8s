'use client';

import { useMemo, useState } from 'react';
import { Clock3, Grid3X3, Star } from 'lucide-react';
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

const appContextMenuItems = new Set([
  'workload',
  'deployment',
  'statefulset',
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
  const [activeMenuItem, setActiveMenuItem] = useState('app-list');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplicationName, setSelectedApplicationName] = useState<string | null>(null);
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
    return applications.filter((app) => {
      const keyword = searchTerm.toLowerCase();
      const matchesSearch =
        app.name.toLowerCase().includes(keyword) ||
        app.displayName.toLowerCase().includes(keyword) ||
        app.description.toLowerCase().includes(keyword);

      if (activeTab === 'favorites') return false;
      return matchesSearch;
    });
  }, [activeTab, searchTerm]);

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
    setCurrentPage(1);
    resetCreatePages();

    if (itemId === 'app-list') {
      setSelectedApplicationName(null);
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

  const renderContent = () => {
    if (activeMenuItem === 'app-list') {
      return selectedApplicationName ? (
        <ApplicationDetail applicationName={selectedApplicationName} onBack={() => setSelectedApplicationName(null)} />
      ) : (
        <ApplicationList
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
          onViewApplication={setSelectedApplicationName}
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
          isApplicationContext={Boolean(selectedApplicationName)}
        />
        <div className="min-w-0 flex-1 overflow-hidden">{renderContent()}</div>
        <FloatingButtons />
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
