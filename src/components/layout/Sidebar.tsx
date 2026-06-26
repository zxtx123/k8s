'use client';

import { useState } from 'react';

interface MenuItem {
  id: string;
  icon?: string;
  label: string;
  hasDropdown: boolean;
  active: boolean;
  children?: MenuItem[];
}

interface SidebarProps {
  collapsed: boolean;
  onCollapse: () => void;
  activeMenuItem?: string;
  onMenuItemChange?: (itemId: string) => void;
  isApplicationContext?: boolean;
}

export default function Sidebar({ collapsed, onCollapse, activeMenuItem, onMenuItemChange, isApplicationContext = false }: SidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set(['cis']));

  // 全局菜单（应用列表页）
  const globalMenuItems: MenuItem[] = [
    {
      id: 'cis',
      icon: 'server',
      label: '容器实例服务CIS',
      hasDropdown: true,
      active: false,
      children: [
        { id: 'project', icon: 'folder', label: '项目管理', hasDropdown: false, active: false },
        { id: 'cluster', icon: 'cluster', label: '独享集群', hasDropdown: false, active: false },
        { id: 'app-list', icon: 'list', label: '应用列表', hasDropdown: false, active: true },
        { id: 'billing', icon: 'money', label: '费用账单', hasDropdown: false, active: false },
        { id: 'migration', icon: 'transfer', label: '容器迁移', hasDropdown: false, active: false },
        { id: 'alert', icon: 'bell', label: '告警中心', hasDropdown: true, active: false, children: [
          { id: 'alert-policy', icon: 'policy', label: '告警策略', hasDropdown: false, active: false },
          { id: 'alert-history', icon: 'history', label: '告警历史', hasDropdown: false, active: false },
        ]},
        { id: 'apikeys', icon: 'key', label: 'APIKeys', hasDropdown: false, active: false },
        { id: 'members', icon: 'users', label: '成员管理', hasDropdown: false, active: false },
        { id: 'settings', icon: 'settings', label: '设置', hasDropdown: false, active: false },
      ]
    },
    { id: 'crs', icon: 'image', label: '容器镜像服务CRS', hasDropdown: true, active: false },
    { id: 'pricing', icon: 'tag', label: '定价和资源包', hasDropdown: false, active: false },
    { id: 'resources', icon: 'grid', label: '资源组详情', hasDropdown: false, active: false },
  ];

  // 应用上下文菜单（应用详情页）
  const appMenuItems: MenuItem[] = [
    {
      id: 'cis',
      icon: 'server',
      label: '容器实例服务CIS',
      hasDropdown: true,
      active: false,
      children: [
        { 
          id: 'workload', 
          icon: 'box', 
          label: '工作负载', 
          hasDropdown: true, 
          active: false,
          children: [
            { id: 'deployment', label: 'Deployment管理', hasDropdown: false, active: false },
            { id: 'statefulset', label: 'StatefulSet管理', hasDropdown: false, active: false },
            { id: 'cronjob', label: 'CronJob管理', hasDropdown: false, active: false },
            { id: 'job', label: 'Job管理', hasDropdown: false, active: false },
          ]
        },
        { 
          id: 'traffic', 
          icon: 'network', 
          label: '流量接入', 
          hasDropdown: true, 
          active: false,
          children: [
            { id: 'service', label: 'Service（集群内4层）', hasDropdown: false, active: false },
            { id: 'ingress', label: 'Ingress（集群外7层）', hasDropdown: false, active: false },
            { id: 'loadbalancer', label: '负载均衡（集群外7层）', hasDropdown: false, active: false },
          ]
        },
        { 
          id: 'config', 
          icon: 'settings', 
          label: '配置中心', 
          hasDropdown: true, 
          active: false,
          children: [
            { id: 'configmap', label: 'ConfigMap管理', hasDropdown: false, active: false },
            { id: 'secret', label: 'Secret管理', hasDropdown: false, active: false },
          ]
        },
        { 
          id: 'storage', 
          icon: 'database', 
          label: '存储管理', 
          hasDropdown: true, 
          active: false,
          children: [
            { id: 'pvc', label: 'PVC管理', hasDropdown: false, active: false },
          ]
        },
        { 
          id: 'app-alert', 
          icon: 'bell', 
          label: '告警中心', 
          hasDropdown: true, 
          active: false,
          children: [
            { id: 'app-alert-policy', label: '告警策略', hasDropdown: false, active: false },
            { id: 'app-alert-history', label: '告警历史', hasDropdown: false, active: false },
          ]
        },
        { 
          id: 'log', 
          icon: 'document', 
          label: '日志中心', 
          hasDropdown: true, 
          active: false,
          children: [
            { id: 'event', label: '事件', hasDropdown: false, active: false },
            { id: 'audit', label: '操作审计', hasDropdown: false, active: false },
          ]
        },
        { 
          id: 'platform', 
          icon: 'tool', 
          label: '平台管理', 
          hasDropdown: true, 
          active: false,
          children: [
            { id: 'app-members', label: '成员管理', hasDropdown: false, active: false },
            { id: 'app-apikeys', label: 'APIKeys', hasDropdown: false, active: false },
            { id: 'app-config', label: '应用配置', hasDropdown: false, active: false },
          ]
        },
      ]
    },
    { id: 'crs', icon: 'image', label: '容器镜像服务CRS', hasDropdown: true, active: false },
    { id: 'pricing', icon: 'tag', label: '定价和资源包', hasDropdown: false, active: false },
    { id: 'resources', icon: 'grid', label: '资源组详情', hasDropdown: false, active: false },
  ];

  const menuItems = isApplicationContext ? appMenuItems : globalMenuItems;

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(menuId)) {
        newSet.delete(menuId);
      } else {
        newSet.add(menuId);
      }
      return newSet;
    });
  };

  const handleMenuClick = (itemId: string, hasDropdown: boolean) => {
    if (hasDropdown && !menuItems.find(item => item.id === itemId)) {
      toggleMenu(itemId);
    } else if (hasDropdown) {
      toggleMenu(itemId);
    } else {
      if (onMenuItemChange) {
        onMenuItemChange(itemId);
      }
    }
  };

  const isExpanded = (menuId: string) => expandedMenus.has(menuId);

  // 渲染标签，将括弧内的文字用较小字体显示
  const renderLabel = (label: string) => {
    const match = label.match(/^(.+?)（(.+?)）$/);
    if (match) {
      return (
        <>
          {match[1]}<span className="text-xs text-gray-500">（{match[2]}）</span>
        </>
      );
    }
    return label;
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'server':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 11-2 0 1 1 0 012 0zM2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm14 1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
          </svg>
        );
      case 'folder':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
          </svg>
        );
      case 'cluster':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6zM2 6h2v8H2V6zm14 0h2v8h-2V6z" />
          </svg>
        );
      case 'list':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'money':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
          </svg>
        );
      case 'transfer':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'bell':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        );
      case 'key':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'users':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
        );
      case 'settings':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        );
      case 'image':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        );
      case 'tag':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        );
      case 'grid':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        );
      case 'policy':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'history':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case 'box':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2L2 5.5v9L10 18l8-3.5v-9L10 2zm0 2.236l5.957 2.604L10 9.34 4.043 6.84 10 4.236zM4 8.5v5.82l5 2.186V10.6L4 8.5zm7 8.006l5-2.186V8.5l-5 2.1v5.906z" clipRule="evenodd" />
          </svg>
        );
      case 'network':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 5a2 2 0 012-2h8a2 2 0 012 2v3a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm0 8a2 2 0 012-2h8a2 2 0 012 2v3a2 2 0 01-2 2H6a2 2 0 01-2-2v-3z" />
          </svg>
        );
      case 'database':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
          </svg>
        );
      case 'document':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
      case 'tool':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        );
      case 'layers':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 4.5A2.5 2.5 0 014.5 2h11a2.5 2.5 0 010 5h-11A2.5 2.5 0 012 4.5zM2.5 9.5A1.5 1.5 0 014 8h12a1.5 1.5 0 010 3H4a1.5 1.5 0 01-1.5-1.5zm0 5A1.5 1.5 0 014 13h12a1.5 1.5 0 010 3H4a1.5 1.5 0 01-1.5-1.5z" />
          </svg>
        );
      case 'stack':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
          </svg>
        );
      case 'clock':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case 'task':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'link':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
          </svg>
        );
      case 'globe':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.083 9a1 1 0 01.154.993 6.958 6.958 0 00-.154 1.007 6.958 6.958 0 00.154 1.007 1 1 0 01-.154.993H3.5a.5.5 0 01-.5-.5v-3a.5.5 0 01.5-.5h.583zM10 2a8 8 0 100 16 8 8 0 000-16zm1 14.93A7.001 7.001 0 0010 16a7.001 7.001 0 00-1 .93V14a1 1 0 112 0v2.93zM10 4a6 6 0 100 12 6 6 0 000-12z" clipRule="evenodd" />
          </svg>
        );
      case 'balance':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
          </svg>
        );
      case 'file-text':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
      case 'lock':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        );
      case 'hard-drive':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 10h12v2H4v-2zm2-2a1 1 0 100-2 1 1 0 000 2zm3-1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
          </svg>
        );
      case 'zap':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        );
      case 'clipboard':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
          </svg>
        );
      case 'sliders':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  // 检查某个菜单项或其子项是否被选中
  const isMenuOrChildActive = (itemId: string, children?: MenuItem[]): boolean => {
    if (activeMenuItem === itemId) return true;
    if (children) {
      return children.some(child => isMenuOrChildActive(child.id, child.children));
    }
    return false;
  };

  return (
    <div className="w-[200px] bg-white border-r border-gray-200 flex flex-col flex-shrink-0 overflow-visible">
      {/* 容器云标题 */}
      <div className="h-14 flex items-center px-4 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          {/* 容器云文字 */}
          <span className="text-gray-900 font-semibold text-base">容器云</span>
        </div>
        {/* 黄色五角星收藏标记 */}
        <svg className="w-4 h-4 text-yellow-400 ml-auto" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      </div>

      {/* 菜单项 */}
      <div className="flex-1 py-2">
        {menuItems.map((item, index) => {
          const hasChildren = Boolean(item.children && item.children.length > 0);
          const expanded = isExpanded(item.id);
          
          return (
            <div key={index}>
              {/* 一级菜单 - 不显示选中状态 */}
              <div
                onClick={() => handleMenuClick(item.id, hasChildren)}
                className="px-4 py-2.5 cursor-pointer flex items-center gap-2.5 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-500">
                  {item.icon && getIcon(item.icon)}
                </span>
                <span className="flex-1 text-sm whitespace-nowrap">{item.label}</span>
                {hasChildren && (
                  <svg 
                    className={`w-3 h-3 flex-shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </div>
              
              {/* 二级菜单 */}
              {hasChildren && expanded && (
                <div>
                  {item.children?.map((child, childIndex) => {
                    const isChildActive = isMenuOrChildActive(child.id, child.children);
                    const hasGrandChildren = Boolean(child.children && child.children.length > 0);
                    
                    return (
                      <div key={childIndex} className="relative group">
                        <div
                          onClick={() => handleMenuClick(child.id, false)}
                          className={`px-4 py-2.5 cursor-pointer flex items-center gap-2.5 transition-colors ${
                            isChildActive
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <span className={isChildActive ? 'text-white' : 'text-gray-500'}>
                            {child.icon && getIcon(child.icon)}
                          </span>
                          <span className="flex-1 text-sm">{child.label}</span>
                          {hasGrandChildren && (
                            <svg 
                              className={`w-3 h-3 flex-shrink-0 ${isChildActive ? 'text-white' : 'text-gray-400'}`} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                        </div>
                        
                        {/* 三级菜单 - 右侧弹出 */}
                        {hasGrandChildren && (
                          <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute left-full top-0 ml-0 w-auto min-w-36 bg-white border border-gray-200 rounded shadow-lg z-50 transition-all duration-150 whitespace-nowrap">
                            {child.children?.map((grandChild, grandChildIndex) => {
                              const isGrandChildActive = activeMenuItem === grandChild.id;
                              return (
                                <div
                                  key={grandChildIndex}
                                  onClick={() => handleMenuClick(grandChild.id, false)}
                                  className={`px-3 py-2.5 first:rounded-t last:rounded-b cursor-pointer flex items-center gap-2 transition-colors ${
                                    isGrandChildActive
                                      ? 'bg-blue-600 text-white'
                                      : 'text-gray-600 hover:bg-gray-50'
                                  }`}
                                >
                                  {grandChild.icon && getIcon(grandChild.icon)}
                                  <span className="flex-1 text-sm">{renderLabel(grandChild.label)}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
