import React from 'react';

const LogFileButton = ({ fileName, onClick }) => {
    return (
        <button 
            onClick={onClick}
            className="btn btn-outline-primary btn-sm m-1 text-truncate"
            style={{
                maxWidth: '250px',
                cursor: 'pointer',
            }}
        >
            {fileName}
        </button>
    );
};

export default LogFileButton;
