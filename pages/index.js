import fs from 'fs';
import path from 'path';
import React from 'react';
import LogViewer from '../components/LogViewer';
import LogFileButton from '../components/LogFileButton';

const Home = ({ logFiles }) => {
    const [currentLogs, setCurrentLogs] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    // Function to read log files and set logs
    const readLogFile = async (filePath) => {
        setLoading(true);
        const response = await fetch(filePath);
        const data = await response.text();
        setCurrentLogs(data.split('\n'));
        setLoading(false);
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-6">
                    <h3 className="text-center">PM2 Logs</h3>
                    <div className="d-flex flex-column align-items-center mb-3">
                        <LogFileButton 
                            fileName="gaspol-api-out.log" 
                            onClick={() => readLogFile('/pm2logs/gaspol-api-out.log')} 
                        />
                        <LogFileButton 
                            fileName="gaspol-api-error.log" 
                            onClick={() => readLogFile('/pm2logs/gaspol-api-error.log')} 
                        />
                    </div>

                    {loading && 
                        <div className="text-center">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    }

                    <div
                        style={{ 
                            height: '400px', 
                            border: '1px solid #ccc', 
                            overflowY: 'auto', 
                            padding: '10px',
                            width: '100%', // Full width for the log viewer
                            marginTop: '20px'
                        }}>
                        <LogViewer logs={currentLogs} />
                    </div>
                </div>
                
                <div className="col-md-6">
                    <h3 className="text-center">Log Files</h3>
                    <div 
                        className="d-flex flex-wrap justify-content-center" 
                        style={{ 
                            maxHeight: '400px', 
                            overflowY: 'auto', 
                            padding: '10px', 
                            border: '1px solid #ccc',
                            gap: '10px' // Optional spacing for button layout
                        }}>
                        {logFiles.length > 0 ? (
                            logFiles.map(fileName => (
                                <LogFileButton 
                                    key={fileName} 
                                    fileName={fileName} 
                                    onClick={() => readLogFile(`/logs/${fileName}`)} 
                                />
                            ))
                        ) : (
                            <div className="text-muted">Tidak ada file log ditemukan.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Static Generation
export async function getStaticProps() {
    const logsDirectory = path.join(process.cwd(), 'logs-gaspol-api', 'logs');

    try {
        const logFiles = fs.readdirSync(logsDirectory);
        return {
            props: {
                logFiles,
            },
        };
    } catch (error) {
        console.error("Error reading logs folder:", error);
        return {
            props: {
                logFiles: [],
            },
        };
    }
}

export default Home;