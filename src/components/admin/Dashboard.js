import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardSidebar from './DashboardSidebar';
import './Dashboard.css';

const Dashboard = () => {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [cashOperations, setCashOperations] = useState({});
  const [expandedCard, setExpandedCard] = useState(null);
  const [rotatingCiro, setRotatingCiro] = useState('');
  const [rotatingBusiness, setRotatingBusiness] = useState('');

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await axios.get('http://92.112.193.8:5018/api/managers');
        setBusinesses(response.data);
        if (response.data.length > 0) {
          startRotatingCiro(response.data);
        }
      } catch (error) {
        console.error('Error fetching businesses:', error);
      }
    };

    fetchBusinesses();
  }, []);

  const startRotatingCiro = (businesses) => {
    let index = 0;
    const interval = setInterval(async () => {
      const business = businesses[index];
      await handleFetchLatestCashOperation(business.id, true);
      index = (index + 1) % businesses.length;
    }, 10000);

    return () => clearInterval(interval);
  };

  const handleFetchLatestCashOperation = async (managerId, isRotating = false) => {
    try {
      const response = await axios.get('http://92.112.193.8:5018/api/cash-operations', {
        params: { managerId: managerId },
      });
      const latestOperation = response.data.data[0];
      if (isRotating) {
        const business = businesses.find((b) => b.id === managerId);
        setRotatingBusiness(business ? business.business_name : '');
        setRotatingCiro(latestOperation ? latestOperation.pos_revenue : 'Veri yok');
      } else {
        setSelectedBusiness(managerId);
        setCashOperations((prev) => ({
          ...prev,
          [managerId]: latestOperation ? latestOperation.pos_revenue : 'Veri yok',
        }));
      }
    } catch (error) {
      console.error('Error fetching latest cash operation:', error);
    }
  };

  const handleFetchAllCashOperations = async () => {
    try {
      const operations = {};
      for (const business of businesses) {
        const response = await axios.get('http://92.112.193.8:5018/api/cash-operations', {
          params: { managerId: business.id },
        });
        const latestOperation = response.data.data[0];
        operations[business.id] = latestOperation ? latestOperation.pos_revenue : 'Veri yok';
      }
      setCashOperations(operations);
    } catch (error) {
      console.error('Error fetching all cash operations:', error);
    }
  };

  const handleExpandCard = (card) => {
    if (expandedCard === card) {
      setExpandedCard(null);
    } else {
      setExpandedCard(card);
      handleFetchAllCashOperations();
    }
  };

  const handleBusinessClick = (managerId) => {
    handleFetchLatestCashOperation(managerId);
  };

  return (
    <div className="dashboard">
      <DashboardSidebar />
      <div className="dashboard-content">
        <h1>Dashboard</h1>
        <div className="cards-container">
          <div
            className={`card ciro ${expandedCard === 'ciro' ? 'expanded' : ''}`}
            onClick={() => handleExpandCard('ciro')}
          >
            <h2>Ciro</h2>
            {expandedCard === 'ciro' ? (
              <div className="expanded-content">
                <div className="business-list">
                  {businesses.map((business) => (
                    <button
                      key={business.id}
                      className={`business-button ${
                        selectedBusiness === business.id ? 'selected' : ''
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBusinessClick(business.id);
                      }}
                    >
                      {business.business_name}
                    </button>
                  ))}
                </div>
                {Object.keys(cashOperations).length > 0 ? (
                  <div className="cash-details">
                    {businesses.map((business) => (
                      <p key={business.id}>
                        {business.business_name} POS Ciro: {cashOperations[business.id]}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p>Veri bulunamadı.</p>
                )}
              </div>
            ) : (
              <div className="rotating-ciro">
                <p>{rotatingBusiness}: {rotatingCiro}</p>
              </div>
            )}
          </div>
          <div
            className={`card eleman ${expandedCard === 'eleman' ? 'expanded' : ''}`}
            onClick={() => handleExpandCard('eleman')}
          >
            <h2>Eleman Sayısı</h2>
            {expandedCard === 'eleman' && (
              <div className="expanded-content">
                {/* Eleman sayısı detayları burada */}
              </div>
            )}
          </div>
          <div
            className={`card stok ${expandedCard === 'stok' ? 'expanded' : ''}`}
            onClick={() => handleExpandCard('stok')}
          >
            <h2>Stok Rapor Sayısı</h2>
            {expandedCard === 'stok' && (
              <div className="expanded-content">
                {/* Stok rapor sayısı detayları burada */}
              </div>
            )}
          </div>
          <div
            className={`card gunSonu ${expandedCard === 'gunSonu' ? 'expanded' : ''}`}
            onClick={() => handleExpandCard('gunSonu')}
          >
            <h2>Gün Sonu Ortalaması</h2>
            {expandedCard === 'gunSonu' && (
              <div className="expanded-content">
                {/* Gün sonu ortalaması detayları burada */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;