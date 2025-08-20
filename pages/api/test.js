import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const { filePath, ispm2Log } = req.query;

    try {
        const rootPath = process.cwd(); // Root project directory
        const logBasePath = path.join(
            rootPath, 
            'logs-gaspol-api',
            ispm2Log === 'true' ? 'pm2logs' : 'logs'
        );
        
        const fullLogPath = path.join(logBasePath, filePath);

        // Baca file
        const logContent = fs.readFileSync(fullLogPath, 'utf8');
        
        // Proses log
        const lines = logContent.split('\n')
            .filter(line => line.trim() !== '')
            .map(line => line.trim());

        // Ambil 100 baris terakhir
        const last100Lines = lines.slice(-100);

        res.status(200).json({
            success: true,
            lines: last100Lines,
            totalLines: lines.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            suggestions: [
                'Pastikan path file benar',
                'Periksa izin akses file',
                'Cek apakah file log ada'
            ]
        });
    }
}