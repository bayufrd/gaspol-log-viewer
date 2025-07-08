// pages/api/logs.js

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    // Tentukan direktori logs
    const logsDirectory = path.join(process.cwd(), '.....', 'gaspol-repo' , 'gaspol-api', 'logs');
    console.log(logsDirectory);

    // Baca isi direktori
    fs.readdir(logsDirectory, (err, files) => {
        if (err) {
            res.status(500).json({ error: 'Tidak bisa membaca folder logs' });
            return;
        }

        // Filter nama file yang relevan
        const syncFiles = files.filter(file => file.startsWith('sync-'));
        const errorFiles = files.filter(file => file.startsWith('error-'));

        res.status(200).json({ sync: syncFiles, error: errorFiles });
    });
}