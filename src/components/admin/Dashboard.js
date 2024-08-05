import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const Dashboard = () => {
  const [businesses, setBusinesses] = useState([]);
  const [cashOperations, setCashOperations] = useState({});
  const [employeeCount, setEmployeeCount] = useState(0);
  const [employeeCountsByBusiness, setEmployeeCountsByBusiness] = useState({});
  const [monthlyAverage, setMonthlyAverage] = useState(0);
  const [monthlyAveragesByBusiness, setMonthlyAveragesByBusiness] = useState({});
  const [chartData, setChartData] = useState({});
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    fetchBusinesses();
    fetchEmployeeCount();
    fetchMonthlyAverage();
  }, []);

  useEffect(() => {
    if (selectedBusiness) {
      fetchMonthlyAverage(selectedBusiness);
    }
  }, [selectedBusiness]);

  const fetchBusinesses = async () => {
    try {
      const response = await axios.get('http://92.112.193.81:5018/api/managers');
      setBusinesses(response.data);
      fetchAllCashOperations(response.data);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    }
  };

  const fetchEmployeeCount = async () => {
    try {
      const response = await axios.get('http://92.112.193.81:5018/api/employee-count');
      setEmployeeCount(response.data.count);
    } catch (error) {
      console.error('Error fetching employee count:', error);
    }
  };

  const fetchEmployeeCountsByBusiness = async () => {
    try {
      const response = await axios.get('http://92.112.193.81:5018/api/employee-count-by-business');
      setEmployeeCountsByBusiness(response.data);
    } catch (error) {
      console.error('Error fetching employee counts by business:', error);
    }
  };

  const fetchMonthlyAverage = async (businessId = null) => {
    try {
      const response = await axios.get('http://92.112.193.81:5018/api/monthly-average-cash', {
        params: businessId ? { managerId: businessId } : {},
      });
      if (businessId) {
        setMonthlyAveragesByBusiness(prevState => ({
          ...prevState,
          [businessId]: response.data.averageCash
        }));
      } else {
        setMonthlyAverage(response.data.averageCash);
        setMonthlyAveragesByBusiness(response.data.averageCashByBusiness || {});
      }
    } catch (error) {
      console.error('Error fetching monthly average:', error);
    }
  };

  const fetchAllCashOperations = async (businessesList) => {
    try {
      const operations = {};
      const chartLabels = [];
      const chartData = [];
      const backgroundColors = [
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
      ];
      for (const business of businessesList) {
        const response = await axios.get('http://92.112.193.81:5018/api/cash-operations', {
          params: { managerId: business.id },
        });
        const latestOperation = response.data.data
          .filter(op => op.manager_id === business.id)
          .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        operations[business.id] = latestOperation ? latestOperation.pos_revenue : 0;
        chartLabels.push(business.business_name);
        chartData.push(latestOperation ? latestOperation.pos_revenue : 0);
      }
      setCashOperations(operations);
      setChartData({
        labels: chartLabels,
        datasets: [
          {
            label: 'POS Ciro',
            data: chartData,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching all cash operations:', error);
    }
  };

  const handleExpandCard = (card) => {
    if (expandedCard === card) {
      setExpandedCard(null);
    } else {
      setExpandedCard(card);
      if (card === 'eleman') {
        fetchEmployeeCountsByBusiness();
      }
    }
  };

  const handleBusinessClick = (managerId) => {
    setSelectedBusiness(managerId);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <h1>Dashboard</h1>
        <div className="cards-container">
          <div className={`card ciro ${expandedCard === 'ciro' ? 'expanded' : ''}`} onClick={() => handleExpandCard('ciro')}>
            <h2 style={{ color: 'white', fontWeight: 'bold' }}>En Son Ciro</h2>
            {expandedCard === 'ciro' ? (
              <div className="expanded-content">
                <div className="business-list">
                  {businesses.map((business) => (
                    <button key={business.id} className={`business-button ${selectedBusiness === business.id ? 'selected' : ''}`} onClick={(e) => { e.stopPropagation(); handleBusinessClick(business.id); }}>
                      {business.business_name}
                    </button>
                  ))}
                </div>
                {Object.keys(cashOperations).length > 0 ? (
                  <div className="cash-details">
                    {businesses.map((business) => (
                      <p key={business.id}>{business.business_name} POS Ciro: {cashOperations[business.id] !== undefined ? cashOperations[business.id] : 0}</p>
                    ))}
                  </div>
                ) : (
                  <p>Veri bulunamadı.</p>
                )}
                {chartData.labels && <Bar data={chartData} />}
              </div>
            ) : (
              <div className="rotating-ciro">
                {businesses.map((business) => (
                  <p key={business.id}>{business.business_name}: {cashOperations[business.id] !== undefined ? cashOperations[business.id] : 0}</p>
                ))}
              </div>
            )}
          </div>
          <div className={`card eleman ${expandedCard === 'eleman' ? 'expanded' : ''}`} onClick={() => handleExpandCard('eleman')}>
            <h2 style={{ color: 'white', fontWeight: 'bold' }}>Toplam Eleman Sayısı</h2>
            {expandedCard === 'eleman' ? (
              <div className="expanded-content">
                <div className="employee-counts">
                  {Object.keys(employeeCountsByBusiness).map((businessId) => (
                    <p key={businessId}>{businesses.find((b) => b.id === businessId)?.business_name}: {employeeCountsByBusiness[businessId]}</p>
                  ))}
                </div>
              </div>
            ) : (
              <p style={{ color: 'white', fontWeight: 'bold', fontSize: '45px', textAlign: 'center' }}> {employeeCount}</p>
            )}
          </div>
          <div className={`card stok ${expandedCard === 'stok' ? 'expanded' : ''}`} onClick={() => handleExpandCard('stok')}>
            <h2 style={{ color: 'white', fontWeight: 'bold' }}>Stok Rapor Sayısı</h2>
            {expandedCard === 'stok' && <div className="expanded-content">{/* Stok rapor sayısı detayları burada */}</div>}
          </div>
          <div className={`card gunSonu ${expandedCard === 'gunSonu' ? 'expanded' : ''}`} onClick={() => handleExpandCard('gunSonu')}>
            <h2 style={{ color: 'white', fontWeight: 'bold' }}>Gün Sonu Ortalaması</h2>
            {expandedCard === 'gunSonu' ? (
              <div className="expanded-content">
                <div className="monthly-averages">
                  {businesses.map((business) => (
                    <p key={business.id}>{business.business_name}: {monthlyAveragesByBusiness[business.id] !== undefined ? monthlyAveragesByBusiness[business.id] : 'Veri yok'}</p>
                  ))}
                </div>
              </div>
            ) : (
              <p style={{ color: 'white', fontWeight: 'bold' }}>Aylık Ortalama POS Ciro: {monthlyAverage}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;