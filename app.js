// ============================== Week 1 =========================================== //
/* 
const fs = require('fs')

fs.writeFileSync('test.txt', 'Hello World Secara Synchronus')
console.log(fs)

fs.readFile('test.txt', 'utf-8', (err, data) => {
    if (err) throw err;
    console.log(data)
})
*/

// noted : run with node bootcamp.js, not using nodemon
/*
const prompt = require('prompt-sync')();
const validator = require('validator');
const fs = require('fs');

const question = (ask) => {
  return new Promise((resolve, reject) => {
    const inputVariable = prompt(ask);
    resolve(inputVariable);
  });
};

const validatePhoneNumber = (number) => {
  return validator.isMobilePhone(number, 'id-ID');
};

const validateEmail = (email) => {
  return validator.isEmail(email);
};

const getInputWithValidation = async (questionText, validatorFn) => {
  let userInput;
  do {
    userInput = await question(questionText);
    if (!validatorFn(userInput)) {
      console.log("Invalid input. Please try again.");
    }
  } while (!validatorFn(userInput));
  return userInput;
};

(async () => {
  const isName = await question('What is Ur Name ? ');
  console.log('Hello ' + isName);

  const isNumber = await getInputWithValidation('Enter Ur Cellphone Number ? ', validatePhoneNumber);
  console.log('Phone Number Valid');

  const email = await getInputWithValidation('Enter Ur Email Address ? ', validateEmail);
  console.log('Email Valid');

  console.log("Your Name " + isName + " With The Number Phone " + isNumber + " and Email Is " + email);

  const contact = [{
    isName,
    isNumber,
    email
  }];

  const jsonData = JSON.stringify(contact);
  fs.writeFileSync('contact.json', jsonData);
})();

// */
// ============================== Week 1 End ======================================= //

// ============================== Week 2 ============================================ //
/*
// Import modul yang diperlukan

const fs = require("fs").promises;
const readline = require("node:readline");
const validator = require("validator");
const { stdin: input, stdout: output } = require("node:process");

// Buat interface readline untuk membaca input dari pengguna
const rl = readline.createInterface({ input, output });

// Fungsi untuk mengajukan pertanyaan dan mengembalikan promise
const question = (ask) => {
  return new Promise((resolve, reject) => {
    rl.question(ask, (inputVariable) => {
      resolve(inputVariable);
    });
  });
};

// Fungsi untuk validasi nomor telepon
const validatePhoneNumber = (phoneNumber) => {
  return validator.isMobilePhone(phoneNumber, "id-ID", { strictMode: false });
};

// Fungsi untuk validasi alamat email
const validateEmail = (email) => {
  return validator.isEmail(email);
};

// mengajukan pertanyaan kepada pengguna, validasi input, menyimpan ke contact.json, dan mencetak informasi
const askQuestions = async () => {
  // Ajukan pertanyaan untuk mendapatkan nama pengguna
  const name = await question("Nama ? ");

  //   let phoneNumber, email, address;
  const contact = {
    name,
    phoneNumber: null,
    email: null,
    address: null,
  };

  // Loop untuk validasi nomor telepon
  do {
    contact.phoneNumber = await question("No HP ? ");
  } while (!validatePhoneNumber(contact.phoneNumber));

  // Loop untuk validasi alamat email
  do {
    contact.email = await question("Email ? ");
  } while (!validateEmail(contact.email));

  // Loop untuk validasi dan memastikan alamat tidak kosong
  do {
    contact.address = await question("Alamat ? ");
  } while (!contact.address.trim()); // Lanjutkan selama alamat yang di-trim kosong

  // Simpan contact ke contact.json
  await saveContact(contact);

  console.log(
    `Nama Anda: ${contact.name} Dengan No HP: ${contact.phoneNumber} dan Alamat Email ${contact.email} dengan alamat ${contact.address}`
  );

// Tutup interface readline
  rl.close();
};

// Fungsi untuk menyimpan contact ke contact.json
const saveContact = async (contact) => {
  try {
    // Baca contact yang sudah ada 
    let existingContacts = [];
    try {
      const data = await fs.readFile("contact.json", "utf-8");
      existingContacts = JSON.parse(data);
    } catch (error) {
      // Abaikan jika file tidak ada atau memiliki JSON yang tidak valid
    }

    existingContacts.push(contact); // Tambahkan contact baru ke dalam array
    
    // Tulis kembali contact yang telah diperbarui ke dalam file
    await fs.writeFile("contact.json", JSON.stringify(existingContacts, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving contact:", error);
  }
};

// Panggil fungsi utama untuk mulai mengajukan pertanyaan
askQuestions();

// */


// */ using yargs
// const fs = require("fs").promises;
// const yargs = require("yargs");
// const validator = require("validator");

// const argv = yargs
//   .option("name", {
//     describe: "Nama pengguna",
//     demandOption: true,
//     type: "string",
//   })
//   .option("phoneNumber", {
//     describe: "Nomor HP",
//     demandOption: true,
//     type: "integer",
//   })
//   .option("email", {
//     describe: "Alamat email",
//     type: "string", // Tidak wajib
//   })
//   .option("address", {
//     describe: "Alamat",
//     type: "string", // Tidak wajib
//   })
//   .argv;

// const validatePhoneNumber = (phoneNumber) => {
//   return validator.isMobilePhone(phoneNumber, "id-ID", { strictMode: false });
// };

// const validateEmail = (email) => {
//   return !email || validator.isEmail(email); // Validasi hanya jika email diisi
// };

// const saveContact = async (contact) => {
//   try {
//     let existingContacts = [];
//     try {
//       const data = await fs.readFile("contact.json", "utf-8");
//       existingContacts = JSON.parse(data);
//     } catch (error) {
//       // Abaikan jika file tidak ada atau memiliki JSON yang tidak valid
//     }

//     existingContacts.push(contact);

//     await fs.writeFile(
//       "contact.json",
//       JSON.stringify(existingContacts, null, 2),
//       "utf-8"
//     );
//   } catch (error) {
//     console.error("Error saving contact:", error);
//   }
// };

// const contact = {
//   name: argv.name,
//   phoneNumber: null,
//   email: null,
//   address: null,
// };

// if (!validatePhoneNumber(argv.phoneNumber)) {
//   console.error("Nomor HP tidak valid");
//   process.exit(1);
// } else {
//   contact.phoneNumber = argv.phoneNumber;
// }

// // Validasi email hanya jika diisi
// if (argv.email && !validateEmail(argv.email)) {
//   console.error("Alamat email tidak valid");
//   process.exit(1);
// } else {
//   contact.email = argv.email;
// }

// // Validasi alamat hanya jika diisi
// if (argv.address && !argv.address.trim()) {
//   console.error("Alamat tidak boleh kosong");
//   process.exit(1);
// } else {
//   contact.address = argv.address;
// }

// saveContact(contact);

// console.log(
// "Terima Kasih"
//     );

// command.js
const fs = require("fs").promises;
const validator = require("validator");

const validatePhoneNumber = (phoneNumber) => {
  return validator.isMobilePhone(phoneNumber, "id-ID", { strictMode: false });
};

const validateEmail = (email) => {
  return !email || validator.isEmail(email);
};

const saveContact = async (contact) => {
  try {
    let existingContacts = [];
    try {
      const data = await fs.readFile("contact.json", "utf-8");
      existingContacts = JSON.parse(data);
    } catch (error) {
      // Abaikan jika file tidak ada atau memiliki JSON yang tidak valid
    }

    existingContacts.push(contact);

    await fs.writeFile(
      "contact.json",
      JSON.stringify(existingContacts, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error("Error saving contact:", error);
  }
};

const addContact = async (argv) => {
  const contact = {
    name: argv.name,
    phoneNumber: argv.phoneNumber,
    email: argv.email || null,
    address: argv.address || null,
  };

  if (!validatePhoneNumber(contact.phoneNumber)) {
    console.error("Nomor HP tidak valid");
    process.exit(1);
  }

  if (contact.email && !validateEmail(contact.email)) {
    console.error("Alamat email tidak valid");
    process.exit(1);
  }

  if (contact.address && !contact.address.trim()) {
    console.error("Alamat tidak boleh kosong");
    process.exit(1);
  }

  await saveContact(contact);
  console.log("Kontak berhasil ditambahkan.");
  process.exit(0); // Exit the script after the asynchronous operation is complete
};

// Rest of the code remains the same
const listContacts = async () => {
  try {
    const data = await fs.readFile("contact.json", "utf-8");
    const contacts = JSON.parse(data);

    if (contacts.length === 0) {
      console.log("Tidak ada kontak yang tersedia.");
    } else {
      console.log("Daftar Kontak:");
      contacts.forEach((contact) => {
        console.log(`Nama: ${contact.name}, Nomor HP: ${contact.phoneNumber}`);
      });
    }
  } catch (error) {
    console.error("Error reading contact.json:", error);
  }
};

const showContactDetails = async (name) => {
  try {
    const data = await fs.readFile("contact.json", "utf-8");
    const contacts = JSON.parse(data);

    if (contacts.length === 0) {
      console.log("Tidak ada kontak yang tersedia.");
    } else {
      const matchingContacts = contacts.filter((contact) => contact.name === name);

      if (matchingContacts.length === 0) {
        console.log(`Tidak ada kontak dengan nama ${name}.`);
      } else {
        console.log(`Detail Kontak untuk ${name}:`);
        matchingContacts.forEach((contact) => {
          console.log(`Nama: ${contact.name}`);
          console.log(`Nomor HP: ${contact.phoneNumber}`);
          console.log(`Alamat Email: ${contact.email || "-"}`);
          console.log(`Alamat: ${contact.address || "-"}`);
          console.log("------------");
        });
      }
    }
  } catch (error) {
    console.error("Error reading contact.json:", error);
  }
};

const deleteContact = async (name) => {
  try {
    const data = await fs.readFile("contact.json", "utf-8");
    let contacts = JSON.parse(data);

    const updatedContacts = contacts.filter((contact) => {
      const contactName = contact.name || contact; // Menangani kasus di mana "name" bisa langsung atau sebagai nilai dalam objek
      return contactName !== name;
    });


      await fs.writeFile("contact.json", JSON.stringify(updatedContacts, null, 2), "utf-8");
      console.log(`Kontak dengan nama ${name} berhasil dihapus.`);
  } catch (error) {
    console.error("Error reading or writing contact.json:", error);
  }
};
// app.js
const updateContact = async (name, updatedContact) => {
  try {
    const data = await fs.readFile("contact.json", "utf-8");
    let contacts = JSON.parse(data);

    const updatedContacts = contacts.map((contact) => {
      if (contact.name === name) {
        // Update the existing contact with new information
        return {
          name,
          phoneNumber: updatedContact.phoneNumber || contact.phoneNumber,
          email: updatedContact.email || contact.email,
          address: updatedContact.address || contact.address,
        };
      }
      return contact;
    });

    await fs.writeFile("contact.json", JSON.stringify(updatedContacts, null, 2), "utf-8");
    console.log(`Kontak dengan nama ${name} berhasil diperbarui.`);
  } catch (error) {
    console.error("Error reading or writing contact.json:", error);
  }
};

module.exports = { addContact, listContacts, showContactDetails, deleteContact, updateContact };

  // ============================== Week 2 End ======================================= //
