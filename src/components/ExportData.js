import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExportData = () => {
    const [packets, setPackets] = useState([]);

    useEffect(() => {
        const fetchPackets = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/packets');
                setPackets(response.data);
            } catch (error) {
                console.error("Error fetching packets", error);
            }
        };

        fetchPackets();
    }, []);

    const downloadCSV = () => {
        const csvRows = [];
        const headers = ['Timestamp', 'Source IP', 'Destination IP', 'Protocol', 'Source Port', 'Destination Port', 'Length'];
        csvRows.push(headers.join(','));

        packets.forEach(packet => {
            const row = [
                new Date(packet.timestamp * 1000).toLocaleString(),
                packet.src_ip,
                packet.dst_ip,
                packet.protocol_name,
                packet.src_port,
                packet.dst_port,
                packet.length,
            ];
            csvRows.push(row.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'network_data.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="export-container">
            <h1>Export Network Data</h1>
            <button onClick={downloadCSV}>Download CSV</button>
        </div>
    );
};

export default ExportData;
