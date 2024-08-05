import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import CashOperations from './components/manager/CashOperations';
import UploadExpense from './components/manager/UploadExpense';
import StockOperations from './components/manager/StockOperations';
import AddWaste from './components/manager/AddWaste';
import EmployeeOperations from './components/manager/EmployeeOperations';
import Attendance from './components/manager/Attendance';
import Shift from './components/manager/Shift';
import InvoiceEntry from './components/manager/InvoiceEntry';
import Dashboard from './components/admin/Dashboard';
import CiroRapor from './components/admin/CiroRapor';
import ShiftRapor from './components/admin/ShiftRapor';
import Eleman from './components/admin/Eleman';
import StokRapor from './components/admin/StokRapor';
import HarcamaRapor from './components/admin/HarcamaRapor';
import ZayiRapor from './components/admin/ZayiRapor';
import MaasRapor from './components/admin/MaasRapor';
import Hesaplama from './components/admin/Hesaplama';
import Analiz from './components/admin/Analiz';
import AddManager from './components/admin/AddManager';
import Layout from './components/Layout'; // Layout bileşenini import edin

const App = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={<Layout />}
        >
          <Route path="/cash-operations" element={<CashOperations />} />
          <Route path="/upload-expense" element={<UploadExpense />} />
          <Route path="/employee-operations" element={<EmployeeOperations />} />
          <Route path="/stock-operations" element={<StockOperations />} />
          <Route path="/add-waste" element={<AddWaste />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/shift" element={<Shift />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/ciro-rapor" element={<CiroRapor />} />
          <Route path="/dashboard/shift-rapor" element={<ShiftRapor />} />
          <Route path="/dashboard/eleman" element={<Eleman />} />
          <Route path="/dashboard/stok-rapor" element={<StokRapor />} />
          <Route path="/dashboard/harcama-rapor" element={<HarcamaRapor />} />
          <Route path="/dashboard/zayi-rapor" element={<ZayiRapor />} />
          <Route path="/dashboard/maas-rapor" element={<MaasRapor />} />
          <Route path="/dashboard/hesaplama" element={<Hesaplama />} />
          <Route path="/dashboard/analiz" element={<Analiz />} />
          <Route path="/invoice-entry" element={<InvoiceEntry />} />
          <Route path="/dashboard/add-manager" element={<AddManager />} />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;