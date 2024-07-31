import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardSidebar.css';
import profilePic from '../img/onur.png'; // Profil resmini ekleyin

const DashboardSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="sidebar">
      <div className="profile">
        <img src={profilePic} alt="Profile" />
        <h3>{user ? `${user.first_name} ${user.last_name}` : ''}</h3>
      </div>
      <div className="sidebar-header">
        <h2>Menu</h2>
      </div>
      <ul>
        <li onClick={() => navigate('/dashboard')}>Dashboard</li>
        <li onClick={() => navigate('/dashboard/ciro-rapor')}>Ciro Rapor</li>
        <li onClick={() => navigate('/dashboard/shift-rapor')}>Shift Rapor</li>
        <li onClick={() => navigate('/dashboard/eleman')}>Eleman</li>
        <li onClick={() => navigate('/dashboard/stok-rapor')}>Stok Rapor</li>
        <li onClick={() => navigate('/dashboard/harcama-rapor')}>Harcama Rapor</li>
        <li onClick={() => navigate('/dashboard/zayi-rapor')}>Zayi Rapor</li>
        <li onClick={() => navigate('/dashboard/maas-rapor')}>Maaş Rapor</li>
        <li onClick={() => navigate('/dashboard/hesaplama')}>Hesaplama</li>
        <li onClick={() => navigate('/dashboard/analiz')}>Analiz</li>
        <li onClick={() => navigate('/dashboard/add-manager')}>Müdür</li>
        <li className="logout" onClick={handleLogout}>Çıkış Yap</li>
      </ul>
    </div>
  );
};

export default DashboardSidebar;