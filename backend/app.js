function handleFileUpload() {
    const fileInput = document.getElementById('csvFileInput');
    const file = fileInput.files[0];

    if (file) {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                // ลบคอลัมน์แรกและเปลี่ยนชื่อคอลัมน์
                const cleanedData = processData(results.data);
                displayData(cleanedData); // แสดงข้อมูลที่จัดการแล้ว
            },
            error: function(error) {
                console.error("Error reading file:", error);
            }
        });
    } else {
        alert("กรุณาเลือกไฟล์ CSV ก่อน");
    }
}


// ฟังก์ชันสำหรับอัปโหลดไฟล์ CSV ไปยัง backend
function uploadFile() {
    const fileInput = document.getElementById('csvFileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a CSV file first!');
        return;
    }

    // อ่านข้อมูลจากไฟล์ CSV โดยใช้ PapaParse
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            // ประมวลผลข้อมูลที่ได้จากไฟล์ CSV
            const cleanedData = processData(results.data);

            // แปลงข้อมูลที่จัดการแล้วกลับไปเป็น CSV
            const csvContent = Papa.unparse(cleanedData);

            // สร้าง Blob จากข้อมูล CSV เพื่อส่งไปยัง backend
            const blob = new Blob([csvContent], { type: 'text/csv' });

            // สร้าง FormData และแนบ Blob (ไฟล์ CSV)
            const formData = new FormData();
            formData.append('file', blob, 'processed_data.csv');

            // ส่งไฟล์ CSV ที่จัดการแล้วไปยัง backend
            fetch('http://localhost:3200/upload', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Data from server:', data);
                    alert('File processed and uploaded successfully');
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        },
        error: function (error) {
            console.error("Error reading file:", error);
        }
    });
}

function processData(data) {
    return data
        .filter(row => Object.values(row).some(value => value !== ""))  // Filter out empty rows
        .map(row => {
            // ลบค่า ',,,,ขนาด,,,,'
            // Object.keys(row).forEach(key => {
            //     if (row[key] === ',,,,ขนาด,,,,') {
            //         delete row[key];  // ลบค่าไม่จำเป็น
            //     }
            // });

            // ตรวจสอบชื่อคอลัมน์และทำการเปลี่ยนชื่อคอลัมน์ตามที่ต้องการ
            const englishPart = (row["คำอธิบาย (ยาวฟุต*กว้าง*หนา)"] || row["คำอธิบาย(ยาวฟุต*กว้าง*หนา)"]) ? extractEnglish(row["คำอธิบาย (ยาวฟุต*กว้าง*หนา)"] || row["คำอธิบาย(ยาวฟุต*กว้าง*หนา)"])  : '';

            return {
                no: row["No"],
                code: row["รหัส"],
                list: row["รายการ (หนา*กว้าง*ยาวฟุต)"],
                detail: englishPart,
                length: row["ยาว (ฟุต)"],
                width: row["กว้าง (นิ้ว)"],
                thickness: row["หนา (นิ้ว)"],
                amount: row["จำนวน/แผ่น"]
            };
        });
}


// ฟังก์ชันดึงข้อมูลภาษาอังกฤษจากข้อความ
function extractEnglish(text) {
    const match = text.match(/[A-Za-z]+/);
    return match ? match[0] : '';
}
