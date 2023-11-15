// command.js
const yargs = require("yargs");
const {
  addContact,
  listContacts,
  showContactDetails,
  deleteContact,
  updateContact,
} = require("./app");

const argv = yargs
  .command({
    command: "add",
    describe: "Menambahkan kontak baru",
    builder: {
      // ... (unchanged)
    },
    handler: (argv) => {
      addContact(argv);
    },
  })
  .command({
    command: "list",
    describe: "Menampilkan semua nama dan nomor HP dari contact.json",
    handler: () => {
      listContacts();
    },
  })
  .command({
    command: "detail",
    describe: "Menampilkan detail informasi dari contact.json berdasarkan nama",
    builder: {
      name: {
        describe: "Nama pengguna",
        demandOption: true,
        type: "string",
      },
    },
    handler: (argv) => {
      showContactDetails(argv.name);
    },
  })
  .command({
    command: "delete",
    describe: "Menghapus kontak dari contact.json berdasarkan nama",
    builder: {
      name: {
        describe: "Nama pengguna",
        demandOption: true,
        type: "string",
      },
    },
    handler: (argv) => {
      deleteContact(argv.name);
    },
  })
  .command({
    command: "update",
    describe: "Memperbarui kontak dari contact.json berdasarkan nama",
    builder: {
      name: {
        describe: "Nama pengguna",
        demandOption: true,
        type: "string",
      },
      phoneNumber: {
        describe: "Nomor HP baru",
        type: "integer",
      },
      email: {
        describe: "Alamat email baru",
        type: "string",
      },
      address: {
        describe: "Alamat baru",
        type: "string",
      },
    },
    handler: (argv) => {
      const { name, phoneNumber, email, address } = argv;
      const updatedContact = { phoneNumber, email, address };
      updateContact(name, updatedContact);
    },
  })
  .demandCommand()
  .help().argv;
