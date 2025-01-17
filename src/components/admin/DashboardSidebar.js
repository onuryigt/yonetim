import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './DashboardSidebar.css';
import profilePic from '../img/onur.png';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const DashboardSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const user = JSON.parse(localStorage.getItem('user'));

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const excludedPaths = ['/login', '/register', '/some-other-page'];
  if (excludedPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="profile">
        <img src={profilePic} alt="Profile" />
        <h3>{user ? `${user.first_name} ${user.last_name}` : ''}</h3>
      </div>
      <div className="sidebar-header" onClick={toggleSidebar}>
        <h2>Menu {isOpen ? <FaChevronUp /> : <FaChevronDown />}</h2>
      </div>
      {isOpen && (
        <ul>
          <li onClick={() => handleNavigate('/dashboard')}>Dashboard</li>
          <li onClick={() => handleNavigate('/dashboard/ciro-rapor')}>Ciro Rapor</li>
          <li onClick={() => handleNavigate('/dashboard/shift-rapor')}>Shift Rapor</li>
          <li onClick={() => handleNavigate('/dashboard/eleman')}>Eleman</li>
          <li onClick={() => handleNavigate('/dashboard/stok-rapor')}>Stok Rapor</li>
          <li onClick={() => handleNavigate('/dashboard/harcama-rapor')}>Harcama Rapor</li>
          <li onClick={() => handleNavigate('/dashboard/zayi-rapor')}>Zayi Rapor</li>
          <li onClick={() => handleNavigate('/dashboard/maas-rapor')}>Maaş Rapor</li>
          <li onClick={() => handleNavigate('/dashboard/hesaplama')}>Hesaplama</li>
          <li onClick={() => handleNavigate('/dashboard/analiz')}>Analiz</li>
          <li onClick={() => handleNavigate('/dashboard/add-manager')}>Müdür</li>
          <li className="logout" onClick={handleLogout}>Çıkış Yap</li>
        </ul>
      )}
    </div>
  );
};

export default DashboardSidebar;