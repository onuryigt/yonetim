const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');
const dayjs = require('dayjs');
const jsPDF = require('jspdf').jsPDF;  // jsPDF modülünü doğru şekilde import ediyoruz
require('jspdf-autotable');
const fs = require('fs');
const xlsx = require('xlsx');


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('uploads'));

const db = mysql.createConnection({
  host: '92.112.193.81',
  user: 'root',
  password: 'Onur12404545?',
  database: 'restaurant_management',
  port: 3306,
  charset: 'utf8mb4' // Bu satırı ekleyin
});

db.connect(err => {
  if (err) {
    console.log('Veritabanı bağlantı hatası:', err);
    return;
  }
  console.log('MySQL connected...');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM managers WHERE email = ? AND password = ?';
  
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).json({ success: false, message: 'Database query error' });
      return;
    }

    if (results.length > 0) {
      const user = results[0];
      res.json({
        success: true,
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email
        },
        business_name: user.business_name,  // business_name'i ekle
        manager_id: user.id  // manager_id'yi ekle
      });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  });
});



app.get('/income-expense', (req, res) => {
  const query = 'SELECT * FROM income_expense';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(results);
    }
  });
});

app.post('/cash-operations', (req, res) => {
  const { date, posRevenue, ysRevenue, ysOnline, cashStart, cashEnd, pos1, pos2, pos3, ticket, multinet, sodexo, bank, expense, checkResult, managerId } = req.body;
  const query = 'INSERT INTO cash_operations (date, pos_revenue, ys_revenue, ys_online, cash_start, cash_end, pos1, pos2, pos3, ticket, multinet, sodexo, bank, expense, check_result, manager_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

  db.query(query, [date, posRevenue, ysRevenue, ysOnline, cashStart, cashEnd, pos1, pos2, pos3, ticket, multinet, sodexo, bank, expense, checkResult, managerId], (error, results) => {
    if (error) {
      console.error('Veritabanına ekleme hatası:', error);
      res.status(500).send('Veritabanına ekleme hatası');
    } else {
      res.send('Gün sonu verileri başarıyla kaydedildi!');
    }
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const date = dayjs().format('DDMMYYYY-HHmm');  // Tarihi formatlayalım
    const prefix = file.fieldname === 'expenseFile' ? 'HARCAMA' : (file.fieldname === 'stockFile' ? 'STOK' : 'ZAYI');
    cb(null, `${prefix}-${date}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

app.post('/expense-report', upload.single('expenseFile'), (req, res) => {
  res.send('Harcama dosyası başarıyla yüklendi');
});

app.post('/stock-report', upload.single('stockFile'), (req, res) => {
  res.send('Stok dosyası başarıyla yüklendi');
});

app.post('/add-waste', upload.single('wasteFile'), (req, res) => {
  res.send('Zayi dosyası başarıyla yüklendi');
});

app.post('/employee-operations', (req, res) => {
  const { firstName, lastName, phone, role, hourPrice, managerId } = req.body;
  const query = 'INSERT INTO employees (first_name, last_name, phone, role, hour_price, manager_id) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [firstName, lastName, phone, role, hourPrice, managerId], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send('Eleman başarıyla eklendi');
    }
  });
});

app.get('/dashboard-data', (req, res) => {
  const query = `
    SELECT 
      (SELECT COUNT(*) FROM applications) AS totalApplications,
      (SELECT COUNT(*) FROM applications WHERE status = 'shortlisted') AS shortlistedCandidates,
      (SELECT COUNT(*) FROM applications WHERE status = 'rejected') AS rejectedCandidates,
      (SELECT COUNT(*) FROM other_metrics) AS otherMetrics
  `;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(results[0]);
    }
  });
});



// Müdürlerin çalışanlarını listeleyen endpoint
app.get('/employees', (req, res) => {
  const { managerId } = req.query;
  const query = 'SELECT * FROM employees WHERE manager_id = ?';
  db.query(query, [managerId], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(results);
    }
  });
});

app.get('/get-employees', (req, res) => {
  const managerId = req.query.managerId;
  const query = 'SELECT * FROM employees WHERE manager_id = ?';
  
  db.query(query, [managerId], (err, results) => {
    if (err) {
      console.error('Error fetching employees:', err);
      res.status(500).json({ success: false, message: 'Error fetching employees' });
    } else {
   
      res.json(results);
    }
  });
});

app.post('/delete-employee', (req, res) => {
  const { id } = req.body;
  const query = 'DELETE FROM employees WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send('Eleman başarıyla silindi');
    }
  });
});

/// Vardiyaları kaydetme endpointi
app.post('/save-shifts', async (req, res) => {
  const { shiftData, managerId, week, employeeList } = req.body;
  console.log('Received week:', week); // Hafta değişkenini kontrol etme

  try {
    for (const [day, shifts] of Object.entries(shiftData)) {
      for (const [index, shift] of shifts.entries()) {
        const employeeId = employeeList[index].id;
        await db.query(
          'INSERT INTO shifts (manager_id, employee_id, day, shift, shift_time) VALUES (?, ?, ?, ?, ?)',
          [managerId, employeeId, day, shift, week]
        );
      }
    }
    res.status(200).json({ success: true, message: 'Vardiyalar başarıyla kaydedildi' });
  } catch (error) {
    console.error('Vardiyalar kaydedilirken hata oluştu:', error);
    res.status(500).json({ success: false, message: 'Vardiyalar kaydedilirken hata oluştu' });
  }
});

// Shift verilerini PDF olarak indiren endpoint
app.get('/download-shifts', (req, res) => {
  const { managerId } = req.query;

  const query = `
    SELECT e.first_name, e.last_name, s.day, s.shift
    FROM shifts s
    JOIN employees e ON s.employee_id = e.id
    WHERE s.manager_id = ?
  `;

  db.query(query, [managerId], (err, results) => {
    if (err) {
      return res.status(500).send('Shift verileri alınırken hata oluştu');
    }

    const doc = new jsPDF({ orientation: 'landscape' });
    const tableColumn = ['Elemanlar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
    const tableRows = [];

    const employees = results.reduce((acc, row) => {
      const key = `${row.first_name} ${row.last_name}`;
      if (!acc[key]) {
        acc[key] = { name: key, monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '' };
      }
      acc[key][row.day] = row.shift;
      return acc;
    }, {});

    Object.values(employees).forEach(employee => {
      tableRows.push([
        employee.name,
        employee.monday,
        employee.tuesday,
        employee.wednesday,
        employee.thursday,
        employee.friday,
        employee.saturday,
        employee.sunday
      ]);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    const fileName = `SHIFT${dayjs().format('DDMMYYYY')}.pdf`;
    const filePath = path.join(__dirname, 'uploads', fileName);
    fs.writeFileSync(filePath, Buffer.from(doc.output('arraybuffer')));

    res.download(filePath);
  });
});

app.post('/add-attendance', (req, res) => {
  const { employee_id, date, hours_worked, manager_id } = req.body;
  const query = 'INSERT INTO attendance (employee_id, date, hours_worked, manager_id) VALUES (?, ?, ?, ?)';
  db.query(query, [employee_id, date, hours_worked, manager_id], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send('Puantaj başarıyla eklendi');
    }
  });
});

// Belirli bir tarih için tüm çalışanların puantajlarını listeleme endpoint'i
app.get('/get-attendance', (req, res) => {
  const { managerId, date } = req.query;
  const query = 'SELECT * FROM attendance WHERE manager_id = ? AND date = ?';
  db.query(query, [managerId, date], (err, results) => {
      if (err) {
          res.status(500).send('Puantaj verileri alınırken hata oluştu');
      } else {
          res.send(results);
      }
  });
});

// Tüm cash_operations verilerini almak için GET endpoint
app.get('/api/cash-operations', (req, res) => {
  const query = 'SELECT * FROM cash_operations';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching cash operations:', err);
      res.status(500).json({ success: false, message: 'Error fetching cash operations' });
    } else {
      res.json({ success: true, data: results });
    }
  });
});



app.post('/add-manager', (req, res) => {
  const { first_name, last_name, email, password, business_name } = req.body;
  const query = 'INSERT INTO managers (first_name, last_name, email, password, business_name) VALUES (?, ?, ?, ?, ?)';
  
  db.query(query, [first_name, last_name, email, password, business_name], (err, results) => {
    if (err) {
      console.error('Müdür ekleme hatası:', err);
      res.status(500).json({ success: false, message: 'Müdür eklenirken bir hata oluştu' });
      return;
    }
    res.json({ success: true, message: 'Müdür başarıyla eklendi' });
  });
});

app.get('/managers', (req, res) => {
  const query = 'SELECT * FROM managers';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Müdürleri getirirken hata:', err);
      res.status(500).json({ success: false, message: 'Müdürleri getirirken bir hata oluştu' });
      return;
    }
    res.json({ success: true, managers: results });
  });
});

// Tüm yöneticileri almak için yeni bir endpoint
app.get('/managerss', (req, res) => {
  const query = 'SELECT id, first_name, last_name, business_name FROM managers';
  db.query(query, (error, results) => {
    if (error) {
      console.error('Veritabanı hatası:', error);
      res.status(500).send('Veritabanı hatası');
    } else {
      res.json(results);
    }
  });
});

app.get('/api/managers', async (req, res) => {
  try {
    const query = 'SELECT id, business_name FROM managers';
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database query error' });
      }
      res.json(results);
    });
  } catch (err) {
    console.error('Error fetching managers:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/shifts', (req, res) => {
  const { managerId, week } = req.query;

  if (!managerId) {
    return res.status(400).send('Manager ID is required');
  }

  let query = `
    SELECT 
      shifts.id, employees.first_name AS employee_name, shifts.day, shifts.shift, shifts.shift_time 
    FROM 
      shifts 
    JOIN 
      employees ON shifts.employee_id = employees.id 
    WHERE 
      shifts.manager_id = ?
  `;

  const queryParams = [managerId];

  if (week) {
    query += ' AND shifts.shift_time = ?';
    queryParams.push(week);
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error fetching shifts:', err);
      return res.status(500).send('Error fetching shifts');
    }
    res.json({ data: results });
  });
});

// Belirli bir işletmenin shift verilerini almak için GET endpoint
app.get('/api/shifts/:business_id', (req, res) => {
  const businessId = req.params.business_id;
  const query = 'SELECT * FROM shifts WHERE business_id = ?';
  db.query(query, [businessId], (err, results) => {
    if (err) {
      console.error('Error fetching shifts:', err);
      res.status(500).json({ success: false, message: 'Error fetching shifts' });
    } else {
      res.json({ success: true, data: results });
    }
  });
});

app.put('/api/updateShifts', (req, res) => {
  const shifts = req.body.shifts;

  shifts.forEach(shift => {
    const query = 'UPDATE shifts SET shift = ?, day = ? WHERE id = ?';
    db.query(query, [shift.shift, shift.day, shift.id], (err, result) => {
      if (err) {
        console.error('Veritabanı hatası:', err);
        return res.status(500).send('Veritabanı hatası');
      }
    });
  });

  res.send('Veriler başarıyla güncellendi');
});

app.get('/api/managers', async (req, res) => {
  try {
    const [results] = await db.query('SELECT id, business_name FROM managers');
    res.status(200).json(results);
  } catch (error) {
    console.error('İşletme adları alınırken hata oluştu:', error);
    res.status(500).json({ error: 'İşletme adları alınırken hata oluştu' });
  }
});

// Çalışan güncelleme endpointi
app.put('/api/update-employee/:id', (req, res) => {
  const employeeId = req.params.id;
  const { first_name, last_name, phone, role, hour_price } = req.body;

  const query = `
    UPDATE employees
    SET first_name = ?, last_name = ?, phone = ?, role = ?, hour_price = ?
    WHERE id = ?
  `;

  db.query(query, [first_name, last_name, phone, role, hour_price, employeeId], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ message: 'Employee updated successfully' });
    }
  });
});

app.get('/api/excel-files', (req, res) => {
  const directoryPath = path.join(__dirname, 'uploads');
  fs.readdir(directoryPath, (err, files) => {
      if (err) {
          return res.status(500).send('Unable to scan files');
      }
      const excelFiles = files.filter(file => file.startsWith('STOK'));
      res.json(excelFiles);
  });
});

app.get('/api/excel-file/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, 'uploads', fileName);
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  res.json(sheetData);
});

app.get('/api/harcama-files', (req, res) => {
  const directoryPath = path.join(__dirname, 'uploads');
  fs.readdir(directoryPath, (err, files) => {
      if (err) {
          return res.status(500).send('Unable to scan files');
      }

      const harcamaFiles = files.filter(file => file.startsWith('HARCAMA'));
      res.json(harcamaFiles);
  });
});

app.get('/api/harcama-excel/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  res.json(data);
});

app.get('/api/zayi-files', (req, res) => {
  const directoryPath = path.join(__dirname, 'uploads');
  fs.readdir(directoryPath, (err, files) => {
      if (err) {
          return res.status(500).send('Unable to scan files');
      }

      const zayiFiles = files.filter(file => file.startsWith('ZAYI'));
      res.json(zayiFiles);
  });
});

app.get('/api/zayi-excel/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  res.json(data);
});

// GET endpoint to fetch cash operations
app.get('/api/cash-operationss', (req, res) => {
  const { managerId } = req.query;

  const sql = `SELECT * FROM cash_operations WHERE manager_id = ?`;
  db.query(sql, [managerId], (err, results) => {
    if (err) {
      console.error('Error fetching cash operations: ' + err.stack);
      res.status(500).json({ error: 'Database query failed' });
    } else {
      res.json(results); // Dönen sonuçları JSON olarak döndürelim
    }
  });
});

app.get('/api/get-salary-details', (req, res) => {
  const { managerId, month, year } = req.query;
  const query = `
    SELECT e.id as employee_id, e.first_name, e.last_name, e.hour_price,
           SUM(a.hours_worked) as total_hours,
           JSON_ARRAYAGG(JSON_OBJECT('date', a.date, 'hours', a.hours_worked)) as daily_hours
    FROM employees e
    JOIN attendance a ON e.id = a.employee_id
    WHERE e.manager_id = ? AND MONTH(a.date) = ? AND YEAR(a.date) = ?
    GROUP BY e.id, e.first_name, e.last_name, e.hour_price;
  `;

  db.query(query, [managerId, month, year], (error, results) => {
    if (error) {
      console.error('Error fetching salary details:', error);
      res.status(500).json({ error: 'Error fetching salary details' });
    } else {
      res.json(results);
    }
  });
});

const PORT = 5018;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});