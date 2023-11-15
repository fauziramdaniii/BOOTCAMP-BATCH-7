const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;
const layoutExpress = require("express-ejs-layouts")

app.set('view engine', 'ejs')
app.use(layoutExpress);
app.set("layout", "layouts/main")
app.get("/", (req, res) => {
    res.render("page/home", {nama: "Uzi", title: "Home"})
});

app.get("/about", (req, res) => {
    res.render("page/about", {title: 'About'})
    });

app.get("/contact", (req, res) => {
    const title = "Contact"
    const contact = [
        {
            name: "Fauzi Ramdani",
            email: "fauziramdhan38@gmail.com",
        },
        {
            name: "Ramdani",
            email: "ramdhan38@gmail.com",
        },
        {
            name: "Uzi",
            email: "uzir@gmail.com",
        },
    ]
    res.render("page/contact", { contact, title })
});

app.get("/product/:id", (req, res) => {
     req.params.id;
     req.query.category;

    res.send('product id: ' + req.params.id + ' category: ' + req.query.category);
});

app.use('/', (req, res) => {
    res.status(404);
    res.render("page/notfound", {title: "404 Not Found"})
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
