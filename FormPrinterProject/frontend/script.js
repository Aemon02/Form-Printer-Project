function loadCSVData() {
    fetch('http://localhost:3000/data') // แก้ไข URL ให้ตรงกับที่ Backend 
        .then(response => response.json())
        .then(data => displayData(data))
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
        rowElement.addEventListener('click', () => displayRowDetails(row)); // เพิ่ม event ให้แถว

        Object.values(row).forEach(cellText => {
            const cell = document.createElement('td');
            cell.textContent = cellText;
            rowElement.appendChild(cell);
        });
        table.appendChild(rowElement);
    });

    formContainer.appendChild(table);
}

// ฟังก์ชันแสดงรายละเอียดของข้อมูลในแถวที่เลือก
function displayRowDetails(row) {
    const formContainer = document.getElementById('formContainer');
    formContainer.innerHTML = ''; // ล้างเนื้อหาเก่าออก

    const a4Container = document.createElement('div');
    a4Container.classList.add('a4-container');
    
    // สร้างหัวข้อสำหรับรายละเอียด
    const title = document.createElement('h2');
    title.textContent = 'รายละเอียดข้อมูล';
    a4Container.appendChild(title);

    // แบ่งข้อมูลออกเป็นข้อๆ โดยชื่อคอลัมเป็นชื่อหัวข้อ
    Object.entries(row).forEach(([key, value]) => {
        const detailItem = document.createElement('div');
        detailItem.classList.add('detail-item');
        
        const heading = document.createElement('h3');
        heading.textContent = key;
        
        const content = document.createElement('p');
        content.textContent = value;
        
        detailItem.appendChild(heading);
        detailItem.appendChild(content);
        a4Container.appendChild(detailItem);
    });

    formContainer.appendChild(a4Container);

    // ปุ่มสำหรับกลับไปหน้าตารางข้อมูล
    // const backButton = document.createElement('button');
    // backButton.textContent = 'กลับไปที่ตารางข้อมูล';
    // backButton.onclick = loadCSVData;
    // formContainer.appendChild(backButton);
}

loadCSVData()