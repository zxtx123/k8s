'use client';

import { type ReactNode } from 'react';
import ProjectSwitcherBreadcrumb, { useProjectBreadcrumb } from './ProjectSwitcherBreadcrumb';

export default function ResourceBreadcrumb({ resource }: { resource?: ReactNode }) {
  const context = useProjectBreadcrumb();
  if (!context) return null;
  return <ProjectSwitcherBreadcrumb {...context} suffix={resource ? <><span className="text-gray-400">&gt;</span>{resource}</> : null} />;
}
