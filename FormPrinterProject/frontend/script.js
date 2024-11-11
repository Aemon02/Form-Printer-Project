function loadCSVData() {
    fetch('http://localhost:3200/data')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.length > 0) {
                displayData(data); 
            } else {
                console.error('No data available');
                displayData([]);
            }
        })
        .catch(error => console.error('Error:', error));
}


function displayData(data) {
    const formContainer = document.getElementById('formContainer');
    formContainer.innerHTML = ''; // ล้างข้อมูลเก่าออก

    if (data.length === 0) {
        formContainer.innerHTML = '<p>ไม่มีข้อมูลในไฟล์ CSV</p>';
        return;
    }

    // สร้างตารางข้อมูล
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');

    // สร้างส่วนหัวของตารางจากคีย์ของข้อมูล
    Object.keys(data[0]).forEach(key => {
        const th = document.createElement('th');
        th.textContent = key;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // เพิ่มข้อมูลแต่ละแถวและตั้งค่าให้คลิกเพื่อแสดงรายละเอียด
    data.forEach(row => {
        const rowElement = document.createElement('tr');
        rowElement.classList.add('data-row');
        rowElement.addEventListener('click', () => sendRowDetailsToBackend(row)); // ส่งข้อมูลผ่าน POST เมื่อคลิกแถว

        Object.values(row).forEach(cellText => {
            const cell = document.createElement('td');
            cell.textContent = cellText;
            rowElement.appendChild(cell);
        });
        table.appendChild(rowElement);
    });

    formContainer.appendChild(table);
}


// ฟังก์ชันส่งข้อมูลแถวไปยัง backend ผ่าน POST request
function sendRowDetailsToBackend(row) {
    fetch('http://localhost:3200/submitData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(row)  // ส่งข้อมูลแถวในรูปแบบ JSON
    })
    .then(response => response.json())
    .then(data => {
        console.log('Data successfully submitted:', data);
        // คุณสามารถทำการ redirect หรือแสดงข้อความหลังจากส่งข้อมูลสำเร็จ
        window.location.href = 'show.html'; // ตัวอย่างการเปลี่ยนหน้าไปยัง show.html
    })
    .catch(error => console.error('Error:', error));
}

loadCSVData();
