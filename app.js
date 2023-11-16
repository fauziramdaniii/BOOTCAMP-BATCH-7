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
  address: Joi.string().required(),
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
app.get("/", (req, res) => {
        res.render("page/home", {nama: "Uzi", title: "Home"})
});

// GET About
app.get("/about", (req, res) => {
    res.render("page/about", {title: 'About'})
});

// GET, POST, PUT, DELETE, DETAIL Contact
app.get('/contact', async (req, res) => {
  const data = await readData();
  res.render('page/contact', { data, title: "Contact" });
});

app.post('/contact', [
  check("email", "Email is not valid").isEmail(),
  check("phoneNumber", "Phone Number is not valid").isMobilePhone(),
], async (req, res) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.render('page/contact', {
      data: await readData(),
      title: "Contact",
      errors: errors.array(), // Use errors.array() to get an array of error objects
    });
  }
  console.log(errors);
  try {
    const newData = {
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      address: req.body.address,
    };
    await schema.validateAsync(newData);
    const data = await readData();
    data.push(newData);
    await writeData(data);
    return res.redirect('/contact');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/contact/:name', async (req, res) => {
  try {
    const name = req.params.name;
    const updatedData = req.body;
    await schema.validateAsync(updatedData);

    const data = await readData();
    const index = data.findIndex((contact) => contact.name === name);

    if (index === -1) {
      res.status(404).json({ error: 'Contact not found' });
    } else {
      data[index] = { ...data[index], ...updatedData };
      await writeData(data);

      // Set Content-Type header
      res.setHeader('Content-Type', 'application/json');
      res.json({ message: 'Contact updated successfully', data: data[index] });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
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


