const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

// Endpoint สำหรับการดึงข้อมูล CSV
app.get('/data', (req, res) => {
    const results = [];
    fs.createReadStream(path.join(__dirname, 'Wood_data_for_test.csv'))
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            res.json(results);
        });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
