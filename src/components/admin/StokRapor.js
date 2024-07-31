import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardSidebar from './DashboardSidebar';
import './StockReport.css';

const StockReport = () => {
    const [excelFiles, setExcelFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState('');
    const [excelData, setExcelData] = useState([]);

    useEffect(() => {
        const fetchExcelFiles = async () => {
            try {
                const response = await axios.get('http://92.112.193.8:5018/api/excel-files');
                setExcelFiles(response.data);
            } catch (error) {
                console.error('Error fetching excel files:', error);
            }
        };

        fetchExcelFiles();
    }, []);

    const handleFileChange = async (e) => {
        const fileName = e.target.value;
        setSelectedFile(fileName);
        if (fileName) {
            try {
                const response = await axios.get(`http://92.112.193.8:5018/api/excel-file/${fileName}`);
                setExcelData(response.data);
            } catch (error) {
                console.error('Error fetching excel file data:', error);
            }
        }
    };

    return (
        <div className="stock-report-container">
            <DashboardSidebar />
            <div className="stock-report-content">
                <h1>Stok Raporu</h1>
                <div className="filter-section">
                    <label>Excel Dosyası Seçin</label>
                    <select value={selectedFile} onChange={handleFileChange}>
                        <option value="">Dosya Seçin</option>
                        {excelFiles.map((file, index) => (
                            <option key={index} value={file}>{file}</option>
                        ))}
                    </select>
                </div>
                <div className="excel-table-section">
                    <table className="excel-table">
                        <thead>
                            <tr>
                                {excelData.length > 0 && Object.keys(excelData[0]).map((header, index) => (
                                    <th key={index}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {excelData.map((row, index) => (
                                <tr key={index}>
                                    {Object.values(row).map((cell, cellIndex) => (
                                        <td key={cellIndex}>{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StockReport;