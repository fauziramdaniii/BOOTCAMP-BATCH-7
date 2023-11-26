const express = require("express");
const bodyParser = require("body-parser");
const {check, validationResult} = require("express-validator")
const {isMobilePhone, isEmail} = require("validator")
const cors = require("cors")

const client = require("./commons/connection");
const app = express();
const port = 3000;

app.use(bodyParser.json())

const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

app.get('/contacts', (req, res) => {
    client.query('SELECT * FROM contact', (err, result) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Internal Server Error");
        } else {
            console.log(result.rows);
            res.json(result.rows);
        }
    });
});

app.listen(port, () => {
    console.log("server is running in port" + port);
});

client.connect(err => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("database connected");
    }
});

const handleValidate = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()})
    }
        next()
}



app.post('/contacts',[
    check("name").matches(/^[A-Za-z\s]+$/).withMessage("Name should contain only letters and spaces"),
    check("email").isEmail().withMessage("Email is not valid"),
    check("phone").custom(value => isMobilePhone(value, "id-ID")).withMessage("Phone Number is not valid"),
], handleValidate, (req, res) => {
    const { name, phone, email, address } = req.body;

    const query = {
        text: 'INSERT INTO contact (name, phone, email, address) VALUES ($1, $2, $3, $4)',
        values: [name, phone, email, address]
    };

    client.query(query, (err, result) => {
        if (!err) {
            res.status(201).send("Insert Success");
        } else {
            console.error(err.message);
            res.status(500).send("Internal Server Error");
        }
    });
});

app.put('/contacts/:id', [
    check("name").matches(/^[A-Za-z\s]+$/).withMessage("Name should contain only letters and spaces"),
    check("email").isEmail().withMessage("Email is not valid"),
    check("phone").custom(value => isMobilePhone(value, "id-ID")).withMessage("Phone Number is not valid"),
], handleValidate,(req, res) => {
    const { name, phone, email, address } = req.body;
    const contactId = req.params.id;

    const query = {
        text: 'UPDATE contact SET name = $1, phone = $2, email = $3, address = $4 WHERE id = $5',
        values: [name, phone, email, address, contactId]
    };

    client.query(query, (err, result) => {
        if (!err) {
            res.status(200).send("Update Success");
        } else {
            console.error(err.message);
            res.status(500).send("Internal Server Error");
        }
    });
});

app.delete('/contacts/:id', (req, res) => {
    const contactId = req.params.id;
    const query = {
        text: 'DELETE FROM contact WHERE id = $1',
        values: [contactId]
    };

    client.query(query, (err, result) => {
        if (!err) {
            res.status(200).send("Delete Success");
        } else {
            console.error(err.message);
            res.status(500).send("Internal Server Error");
        }
    });
});

