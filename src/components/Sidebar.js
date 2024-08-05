import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css'; 

const Sidebar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

<<<<<<< HEAD
    

=======
>>>>>>> 7c6f6c8d43779df8e8dbf0480c87948c882aea2f
    return (
        <div className="sidebar">
            {user && (
                <div className="user-info">
                    <img src="https://w7.pngwing.com/pngs/945/530/png-transparent-male-avatar-boy-face-man-user-flat-classy-users-icon-thumbnail.png" alt="User Avatar" className="user-avatar" />
                    <div className="user-name">{user.first_name} {user.last_name}</div>
                </div>
            )}
            <ul>
                <li onClick={() => navigate('/cash-operations')}>Gün Sonu Yap</li>
                <li onClick={() => navigate('/upload-expense')}>Aylık Harcama Exceli Yükle</li>
                <li onClick={() => navigate('/stock-operations')}>Stok Sayım Ekle</li>
                <li onClick={() => navigate('/add-waste')}>Zayi Ekle</li>
                <li onClick={() => navigate('/employee-operations')}>Eleman Ekle</li>
                <li onClick={() => navigate('/attendance')}>Puantaj</li>
                <li onClick={() => navigate('/shift')}>Shift</li>
                <li onClick={handleLogout}>Çıkış Yap</li>
            </ul>
        </div>
    );
};

export default Sidebar;