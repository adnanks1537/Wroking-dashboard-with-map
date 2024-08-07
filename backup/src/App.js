import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import LoadingSpinner from './components/LoadingSpinner';
import Map from './components/Map';
import Alerts from './components/Alerts';
import Network from './components/Network';
import ExportData from './components/ExportData';

import Visualizer from './components/Visualizer';
import Globe from './components/Globe';  // Ensure Globe component is imported

const App = () => {
    const [loading, setLoading] = useState(true);
    const [systemInfo, setSystemInfo] = useState({ hostname: '', internal_ip: '' });
    const [topIps, setTopIps] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSystemInfo = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/system_info');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setSystemInfo(data);
            } catch (error) {
                setError('Failed to fetch system information.');
            } finally {
                setLoading(false);
            }
        };

        fetchSystemInfo();
    }, []);

    useEffect(() => {
        const fetchTopIps = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/top_ips');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setTopIps(data);
            } catch (error) {
                console.error('Error fetching top IPs:', error);
            }
        };

        fetchTopIps();
        const interval = setInterval(fetchTopIps, 3000);

        return () => clearInterval(interval);
    }, []);

    const ipLocations = topIps.map(ipInfo => ({
        ip: ipInfo.ip,
        count: ipInfo.count,
        lat: ipInfo.latitude,
        lon: ipInfo.longitude,
    }));

    return (
        <Router>
            <div className="dashboard">
                <header className="dashboard-header">
                    <h1>SOC Dashboard</h1>
                </header>
                <div className="dashboard-navbar">
                    <nav>
                        <ul>
                            <li><Link to="/">Overview</Link></li>
                            <li><Link to="/alerts">Alerts</Link></li>
                            <li><Link to="/network">Network</Link></li>
                            <li><Link to="/export">Export Data</Link></li>
                        
                            <li><Link to="/visualizer">Visualizer</Link></li>
                        </ul>
                    </nav>
                </div>
                <main className="dashboard-main">
                    <Routes>
                        <Route path="/" element={
                            <>
                                {loading ? (
                                    <LoadingSpinner />
                                ) : error ? (
                                    <div className="error-message">{error}</div>
                                ) : (
                                    <div className="system-info">
                                        <h2>System Information</h2>
                                        <p><strong>Hostname:</strong> {systemInfo.hostname}</p>
                                        <p><strong>Internal IP:</strong> {systemInfo.internal_ip}</p>
                                    </div>
                                )}
                                <div className="map-card">
                                    <h2>Top 10 IP Locations</h2>
                                    <Map locations={ipLocations} />
                                </div>
                                <div className="top-ips">
                                    <h2>Top 10 IP Addresses</h2>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>IP Address</th>
                                                <th>Count</th>
                                                <th>City</th>
                                                <th>Region</th>
                                                <th>Country</th>
                                                <th>ISP</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {topIps.map((ipInfo, index) => (
                                                <tr key={index}>
                                                    <td>{ipInfo.ip}</td>
                                                    <td>{ipInfo.count}</td>
                                                    <td>{ipInfo.city}</td>
                                                    <td>{ipInfo.region}</td>
                                                    <td>{ipInfo.country}</td>
                                                    <td>{ipInfo.isp}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        } />
                        <Route path="/alerts" element={<Alerts />} />
                        <Route path="/network" element={<Network />} />
                        <Route path="/export" element={<ExportData />} />
                       
                        <Route path="/visualizer" element={<Visualizer />} />
                        <Route path="/globe" element={<Globe />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;
