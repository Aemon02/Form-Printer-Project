let selectedRows = []; // เก็บแถวที่เลือก

// ฟังก์ชันโหลดข้อมูลและแสดงในตาราง
function loadCSVData() {
    fetch('http://localhost:3200/data')
    // fetch('https://form-printer-project-backend.vercel.app')
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

    // สร้างคอลัมน์สำหรับ checkbox ที่ส่วนหัว
    const checkboxHeader = document.createElement('th');
    checkboxHeader.textContent = 'select';
    headerRow.appendChild(checkboxHeader);

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
        
        // เพิ่ม checkbox เพื่อเลือกแถว
        const checkboxCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', () => toggleRowSelection(rowElement, checkbox.checked)); // ใช้ rowElement แทน row
        checkboxCell.appendChild(checkbox);
        rowElement.appendChild(checkboxCell);

        // เพิ่มข้อมูลในแต่ละเซลล์
        Object.values(row).forEach(cellText => {
            const cell = document.createElement('td');
            cell.textContent = cellText;
            rowElement.appendChild(cell);
        });
        table.appendChild(rowElement);
    });

    formContainer.appendChild(table);
}

// ฟังก์ชันเพิ่มหรือลบแถวที่เลือกจาก array
function toggleRowSelection(rowElement, isSelected) {
    const rowData = {};
    const cells = rowElement.cells;  // ใช้ row.cells แทนการใช้ querySelectorAll

    // ดึงข้อมูลจากแต่ละเซลล์ในแถว
    rowData.no = cells[1]?.textContent.trim() || 'N/A';
    rowData.code = cells[2]?.textContent.trim() || 'N/A';
    rowData.list = cells[3]?.textContent.trim() || 'N/A';
    rowData.detail = cells[4]?.textContent.trim() || 'N/A';
    rowData.length = cells[5]?.textContent.trim() || 'N/A';
    rowData.width = cells[6]?.textContent.trim() || 'N/A';
    rowData.thickness = cells[7]?.textContent.trim() || 'N/A';
    rowData.amount = cells[8]?.textContent.trim() || 'N/A';

    // เพิ่มหรือลบแถวที่เลือกจาก selectedRows
    if (isSelected) {
        selectedRows.push(rowData); // เพิ่มแถวที่เลือก
    } else {
        selectedRows = selectedRows.filter(selectedRow => selectedRow.no !== rowData.no); // ลบแถวที่ไม่เลือก
    }

    console.log('Selected rows:', selectedRows); // ตรวจสอบข้อมูลที่ถูกเก็บไว้
}

// ฟังก์ชันส่งข้อมูลแถวที่เลือกไปยังหน้า show.html
function toPrint() {
    if (selectedRows.length > 0) {
        console.log('Sending selected rows:', selectedRows);  // เพิ่มการ log ก่อนส่งข้อมูล
        fetch('http://localhost:3200/submitSelectedRows', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(selectedRows)  // ส่งข้อมูลแถวที่เลือก
        })
        .then(response => response.json())
        .then(data => {
            console.log('Data successfully submitted:', data);
            // เก็บข้อมูลจาก selectedRows ที่เลือกไปใน localStorage
            localStorage.setItem('selectedRows', JSON.stringify(selectedRows)); 
            window.location.href = 'show.html';
        })
        .catch(error => console.error('Error:', error));
    } else {
        alert('กรุณาเลือกข้อมูลที่ต้องการพิมพ์');
    }
}

// ฟังก์ชันเลือกทั้งหมด
function selectAllRows() {
    const checkboxes = document.querySelectorAll('.data-row input[type="checkbox"]');
    selectedRows = []; // รีเซ็ต selectedRows ก่อนเลือกทั้งหมด

    checkboxes.forEach(checkbox => {
        checkbox.checked = true;  // เลือกทุก checkbox
        const row = checkbox.closest('tr'); // ดึงแถวที่เกี่ยวข้องกับ checkbox
        toggleRowSelection(row, true);  // เพิ่มแถวที่เลือก
    });
}

// ฟังก์ชันยกเลิกการเลือกทั้งหมด
function deselectAllRows() {
    // ลบข้อมูลจาก selectedRows
    selectedRows = [];

    // ลบข้อมูลจาก localStorage
    localStorage.removeItem('selectedRows');

    // รีเซ็ตสถานะการเลือกในตาราง
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => checkbox.checked = false);

    console.log('All selections have been cleared');
}

loadCSVData();
