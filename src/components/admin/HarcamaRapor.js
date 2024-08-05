import React, { useState, useEffect } from 'react';
import axios from 'axios';
<<<<<<< HEAD
 
import DashboardSidebar from './DashboardSidebar';
import './HarcamaRapor.css';

const HarcamaRapor = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [excelData, setExcelData] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get('http://92.112.193.81:5018/api/harcama-files');
        setFiles(response.data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, []);

  const handleFileChange = async (event) => {
    const filename = event.target.value;
    setSelectedFile(filename);
    if (filename) {
      try {
        const response = await axios.get(`http://92.112.193.81:5018/api/harcama-excel/${filename}`);
        setExcelData(response.data);
      } catch (error) {
        console.error('Error fetching Excel data:', error);
      }
    } else {
      setExcelData([]);
    }
  };

  return (
    <div className="harcama-rapor-container">
<<<<<<< HEAD
      <DashboardSidebar />
      <div className="harcama-rapor-content">
        <h1>Harcama Raporu</h1>
        <div className="filter-section">
          <label>Excel Dosyası Seçin</label>
          <select value={selectedFile} onChange={handleFileChange}>
            <option value="">Excel Dosyası Seçin</option>
            {files.map((file, index) => (
              <option key={index} value={file}>
                {file}
              </option>
            ))}
          </select>
        </div>
        <div className="excel-table-section">
          {excelData.length > 0 && (
            <table className="excel-table">
              <thead>
                <tr>
                  {excelData[0].map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {excelData.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default HarcamaRapor;