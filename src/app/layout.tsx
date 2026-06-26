import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';

export const metadata: Metadata = {
  title: '360 智汇云容器云 | 弹性伸缩阈值配置',
  description: '360 智汇云容器云平台独享集群弹性伸缩阈值配置页面。',
  keywords: ['360 智汇云', '容器云', '独享集群', '弹性伸缩', '扩容阈值'],
  authors: [{ name: '360 智汇云' }],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">
        {isDev && <Inspector />}
        {children}
      </body>
    </html>
  );
}
