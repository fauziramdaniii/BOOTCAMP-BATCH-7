const { Pool } = require('pg');
const express = require("express");
const app = express();
const port = 3000;
const layoutExpress = require("express-ejs-layouts");
const bodyParser = require("body-parser")
const { check, validationResult } = require("express-validator");
const {isMobilePhone, isEmail} = require("validator")
const client = require("./commons/connection");
const cors = require('cors');

app.use(cors());
app.use(express.static('public')); 
app.set('view engine', 'ejs')
app.use(layoutExpress);
app.set("layout", "layouts/main")
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

client.connect(err => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("database connected");
    }
});

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "P@ssw0rd",
    database: "contact"
});

const handleValidate = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()})
    }
        next()
}

// GET Home
app.get("/", (req, res) => {
    try {
        res.render("page/home", { nama: "Uzi", title: "Home" });
    } catch (error) {
        console.error("Error in / route:", error);
        res.status(500).send("Internal Server Error");
    }
});

// GET About
app.get("/about", (req, res) => {
    try {
        res.render("page/about", { title: "About" });
    } catch (error) {
        console.error("Error in /about route:", error);
        res.status(500).send("Internal Server Error");
    }
});

// GET Contact
app.get('/contact', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contact');
    const data = result.rows;
    res.render('page/contact', { data, errors: [], title: 'Contact' });
  } catch (error) {
    console.error('Error in /contacts route:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/contacts', [
  check('name').matches(/^[A-Za-z\s]+$/).withMessage('Name should contain only letters and spaces'),
  check('email').isEmail().withMessage('Email is not valid'),
  check('phone').custom(value => isMobilePhone(value, 'id-ID')).withMessage('Phone Number is not valid'),
], handleValidate, async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;

    const result = await pool.query('SELECT * FROM contact WHERE name = $1', [name]);
    if (result.rows.length > 0) {
      return res.status(400).json({ success: false, errors: [{ msg: 'Name already exists' }] });
    }

    const query = {
      text: 'INSERT INTO contact (name, phone, email, address) VALUES ($1, $2, $3, $4)',
      values: [name, phone, email, address],
    };

    await pool.query(query);

    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error in /contacts POST route:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.put('/contacts/:id', [
  check("name").matches(/^[A-Za-z\s]+$/).withMessage("Name should contain only letters and spaces"),
  check('email', 'Email is not valid').isEmail(),
  check('phone').custom(value => isMobilePhone(value, 'id-ID')).withMessage('Phone Number is not valid'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const id = req.params.id;
    const updatedData = req.body;

    const nameExistsQuery = 'SELECT * FROM contact WHERE name = $1 AND id <> $2';
    const nameExistsValues = [updatedData.name, id];
    const { rowCount: nameExists } = await pool.query(nameExistsQuery, nameExistsValues);

    if (nameExists) {
      return res.json({ success: false, errors: [{ msg: 'Name already exists' }] });
    }

    const updateQuery = 'UPDATE contact SET name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING *';
    const updateValues = [updatedData.name, updatedData.email, updatedData.phone, id];
    const { rows: updatedContact } = await pool.query(updateQuery, updateValues);

    res.status(200).json({ success: true, message: 'Contact updated successfully', data: updatedContact[0] });
  } catch (error) {
    console.error('Error in /contacts PUT route:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/contacts/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const query = {
      text: 'DELETE FROM contact WHERE id = $1 RETURNING *',
      values: [id]
    };

    const { rows: deletedContacts } = await pool.query(query);

    if (deletedContacts.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    console.log(deletedContacts); 

    return res.json({ message: 'Contact deleted successfully', data: deletedContacts[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/contacts/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const query = {
      text: 'SELECT * FROM contact WHERE id = $1',
      values: [id]
    };

    const { rows: contact } = await pool.query(query);

    if (contact.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    console.log(contact)

    return res.json(contact[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.use('/', (req, res) => {
    res.status(404);
    res.render("page/notfound", {title: "404 Not Found"})
});


