import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardSidebar from './admin/DashboardSidebar';

const Layout = () => {
  const location = useLocation();

  const adminPages = [
    '/dashboard',
    '/dashboard/ciro-rapor',
    '/dashboard/shift-rapor',
    '/dashboard/eleman',
    '/dashboard/stok-rapor',
    '/dashboard/harcama-rapor',
    '/dashboard/zayi-rapor',
    '/dashboard/maas-rapor',
    '/dashboard/hesaplama',
    '/dashboard/analiz',
    '/dashboard/add-manager'
  ];

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="layout">
      {user && location.pathname !== '/login' && !adminPages.includes(location.pathname) && <Sidebar />}
      {user && adminPages.includes(location.pathname) && <DashboardSidebar />}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;