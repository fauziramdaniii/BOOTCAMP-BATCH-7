const fs = require("fs");
const express = require("express");
const app = express();
const morgan = require("morgan");
const port = 3000;
const layoutExpress = require("express-ejs-layouts");
const Joi = require('joi');
const bodyParser = require("body-parser")
const { check, validationResult } = require("express-validator");

app.use(express.static('public')); // For Izin Akses Chrome
app.set('view engine', 'ejs')
app.use(layoutExpress);
app.set("layout", "layouts/main")
app.use(morgan('dev'))
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const filePath = './contact.json';

const schema = Joi.object({
  name: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  email: Joi.string().email().required(),
  address: Joi.string().allow('').optional(), // Allow an empty string or make it optional
});


// readFile
function readData() {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// writeFile
async function writeData(data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// GET Home
// Example: Add logging to your route handlers
app.get("/", (req, res) => {
    try {
        // Your existing code
        res.render("page/home", {nama: "Uzi", title: "Home"});
    } catch (error) {
        console.error("Error in / route:", error);
        res.status(500).send("Internal Server Error");
    }
});

// GET About
app.get("/about", (req, res) => {
    res.render("page/about", {title: 'About'})
});

// GET, POST, PUT, DELETE, DETAIL Contact
app.get('/contact', async (req, res) => {
  const data = await readData();
  res.render('page/contact', { data, errors: [], title: "Contact" });
});

const isAlphaOnly = (value) => {
  const regex = /^[A-Za-z\s]+$/;
  return regex.test(value);
};

app.post('/contact', [
  check("name", "Name should contain only letters and spaces").custom(isAlphaOnly),
  check("email", "Email is not valid").isEmail(),
  check("phoneNumber", "Phone Number is not valid").isMobilePhone(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ success: false, errors: errors.array() });
    }

    const newData = {
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      address: req.body.address || '', // Use an empty string if address is not provided
    };

    // Check if the name already exists
    const data = await readData();
    const nameExists = data.some(contact => contact.name === newData.name);
    if (nameExists) {
      return res.status(400).json({ success: false, errors: [{ msg: "Name already exists" }] });
    }

    await schema.validateAsync(newData);

    data.push(newData);
    await writeData(data);

    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.put('/contact/:name', [
  check("name", "Name should contain only letters").custom(isAlphaOnly),
  check("email", "Email is not valid").isEmail(),
  check("phoneNumber", "Phone Number is not valid").isMobilePhone(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ success: false, errors: errors.array() });
    }

    const name = req.params.name;
    const updatedData = req.body;

    // Check if the updated name already exists
    const data = await readData();
    const nameExists = data.some(contact => contact.name === updatedData.name && contact.name !== name);
    if (nameExists) {
      return res.json({ success: false, errors: [{ msg: "Name already exists" }] });
    }

    await schema.validateAsync(updatedData);

    const index = data.findIndex((contact) => contact.name === name);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }

    data[index] = { ...data[index], ...updatedData };
    await writeData(data);

    res.json({ success: true, message: 'Contact updated successfully', data: data[index] });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});


app.delete('/contact/:name', async (req, res) => {
  try {
    const name = req.params.name; // Treat it as a string

    const data = await readData();
    const index = data.findIndex((contact) => contact.name === name);

    if (index === -1) {
      res.status(404).json({ error: 'Contact not found' });
    } else {
      const deletedContact = data.splice(index, 1)[0];
      await writeData(data);

      res.json({ message: 'Contact deleted successfully', data: deletedContact });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/detail/:name', async (req, res) => {
  try {
    const name = req.params.name;

    const data = await readData();
    const contact = data.find((contact) => contact.name === name);

    if (!contact) {
      res.status(404).json({ error: 'Contact not found' });
    } else {
      res.json(contact);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// LISTEN PORT
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// 404 Not Found
app.use('/', (req, res) => {
    res.status(404);
    res.render("page/notfound", {title: "404 Not Found"})
});


