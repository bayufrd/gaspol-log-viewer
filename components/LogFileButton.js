// components/LogFileButton.js
import React from 'react';

const LogFileButton = ({ fileName, onClick }) => {
    return (
        <button 
            onClick={onClick}
            className="btn btn-outline-primary mb-2"
            style={{
                cursor: 'pointer',
            }}>
            {fileName}
        </button>
    );
};

export default LogFileButton;