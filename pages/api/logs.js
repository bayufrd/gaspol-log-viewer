// pages/api/logs.js

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    // Tentukan direktori logs
    const logsDirectory = path.join(process.cwd(), '.....', 'gaspol-repo', 'gaspol-api', 'logs');
    
    // Baca isi direktori
    fs.readdir(logsDirectory, (err, files) => {
        if (err) {
            res.status(500).json({ error: 'Tidak bisa membaca folder logs' });
            return;
        }

        // Filter nama file yang relevan
        const syncFiles = files.filter(file => file.startsWith('sync-'));
        const errorFiles = files.filter(file => file.startsWith('error-'));

        // Baca konten file log
        const readLogFiles = (fileList) => {
            return fileList.map(file => {
                try {
                    const filePath = path.join(logsDirectory, file);
                    const content = fs.readFileSync(filePath, 'utf8');
                    
                    // Split konten menjadi baris-baris log
                    // Gunakan filter untuk menghapus baris kosong atau baris yang tidak valid
                    return content.split('\n')
                        .filter(line => line.trim() !== '' && !line.includes('<!DOCTYPE') && !line.includes('<html>'));
                } catch (readErr) {
                    console.error(`Gagal membaca file ${file}:`, readErr);
                    return [];
                }
            }).flat(); // Gabungkan semua log dari berbagai file
        };

        // Gabungkan logs dari file sync dan error
        const syncLogs = readLogFiles(syncFiles);
        const errorLogs = readLogFiles(errorFiles);

        res.status(200).json({ 
            sync: syncLogs, 
            error: errorLogs 
        });
    });
}
