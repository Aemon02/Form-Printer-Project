const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = 3200;

app.use(cors());
app.use(express.json()); // Use for parsing JSON body
app.use(express.static(path.join(__dirname, 'frontend'))); // Serve static files

// Path for the uploads folder
const uploadsDir = path.join(__dirname, 'uploads');

// Check if the uploads directory exists, if not, create it
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);  // Create the folder if it doesn't exist
}

// Configure multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);  // Store the file in the 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null, 'datawood.csv');  // Set the uploaded file's name as 'datawood.csv'
    }
});

const upload = multer({ storage: storage });

// Variable to store CSV data
let csvData = []; // Variable to store CSV data

// Endpoint to receive the uploaded file
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });  // Respond in JSON format
    }

    csvData = []; // Clear old data before processing a new file

    fs.createReadStream(path.join(uploadsDir, 'datawood.csv'))
        .pipe(csv())
        .on('data', (row) => {
            csvData.push(row); // Store CSV data
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
            res.json({ message: 'File uploaded and processed successfully', data: csvData });
        });
});



// Endpoint to get CSV data
app.get('/data', (req, res) => {
    if (csvData.length > 0) {
        res.json(csvData);  // ส่งข้อมูล CSV ที่ประมวลผลแล้ว
    } else {
        res.status(404).json({ message: 'No CSV data available' });  // ถ้าไม่มีข้อมูล
    }
});

// Endpoint for receiving row data from frontend
let lastRowData = null;

app.post('/submitData', (req, res) => {
    const rowData = req.body;
    lastRowData = rowData;  // Store the clicked row data
    res.json({ message: 'Data received successfully', data: rowData });
});

// Endpoint to fetch the latest clicked row data
app.get('/getRowData', (req, res) => {
    if (lastRowData) {
        res.json(lastRowData);
    } else {
        res.status(404).json({ message: 'No data available' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
