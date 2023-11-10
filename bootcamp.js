
// -------------------------------------Bootcamp-------------------------------------------

// ============================== Materi 1 =========================================== //
/* 
const fs = require('fs')

fs.writeFileSync('test.txt', 'Hello World Secara Synchronus')
console.log(fs)

fs.readFile('test.txt', 'utf-8', (err, data) => {
    if (err) throw err;
    console.log(data)
})
*/
// ============================== Materi 1 End ======================================= //

// ============================== Materi 2 =========================================== //

// noted : run with node bootcamp.js, not using nodemon
// /*
const prompt = require('prompt-sync')(); //import modul dari npm i prompt-sync
const validator = require('validator'); //import modul dari npm i validator

const isName = prompt('What is Ur Name ? '); //buat pertanyaan inputan menggunakan prompt
console.log('Halow ' + isName); //hasil dari variable const isName

let isNumber, email; //deklarasi variabel nomor telpon dan email

//perulangan dimana jika jawaban inputan user invalid maka diulang kembali untuk valid
do {
    isNumber = prompt('Enter Ur Cellphone Number ? '); //pertanyaannya
    validator.isMobilePhone(isNumber, 'id-ID') ? // if ternary untuk mengecek nomor telpon
    console.log("Phone Number Valid") : //jika benar
    console.log("Phone Number Incorrect For ID, Try Again."); //jika salah
} while (!validator.isMobilePhone(isNumber, 'id-ID')); //condisi apabila no telpon salah di akan do(melkaukan lagi pertanyaan)

//perulangan dimana jika jawaban inputan user invalid maka diulang kembali untuk valid
do {
    email = prompt('Enter Ur Email Address ? '); //pertanyaannya
    validator.isEmail(email) ? // if ternary untuk mengecek nomor telpon
    console.log("Email Valid") :  //jika benar
    console.log("Emailnya Incorrect, Try Again.");  //jika salah
} while (!validator.isEmail(email)); //condisi apabila no telpon salah di akan do(melkaukan lagi pertanyaan)

console.log("Your Name " + isName + " With The Number Phone " + isNumber + " and Surel Is " + email  );
// */
// ============================== Materi 2 End ======================================= //