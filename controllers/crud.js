const { validatePhoneNumber, validateEmail, saveContact, readFile } = require("../validation/validation");
const fs = require("fs").promises;

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

const listContacts = async () => {
  try {
    const contacts = await readFile();

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
    const contacts = await readFile();

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
    const contacts = await readFile();

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

const updateContact = async (oldName, updatedContact) => {
  try {
    const data = await fs.readFile("contact.json", "utf-8");
    let contacts = JSON.parse(data);

    const existingContactIndex = contacts.findIndex((contact) => contact.name === oldName);

    if (existingContactIndex === -1) {
      console.error(`Kontak dengan nama ${oldName} tidak ditemukan.`);
      return;
    }

    const updatedName = updatedContact.name || oldName;

    // Check if the updated name is already taken
    const nameAlreadyExists = contacts.some((contact, index) => index !== existingContactIndex && contact.name === updatedName);

    if (nameAlreadyExists) {
      console.error(`Nama ${updatedName} sudah digunakan oleh kontak lain.`);
      return;
    }

    // Update the existing contact with new information
    contacts[existingContactIndex] = {
      name: updatedName,
      phoneNumber: updatedContact.phoneNumber || contacts[existingContactIndex].phoneNumber,
      email: updatedContact.email || contacts[existingContactIndex].email,
      address: updatedContact.address || contacts[existingContactIndex].address,
    };

    await fs.writeFile("contact.json", JSON.stringify(contacts, null, 2), "utf-8");
    console.log(`Kontak dengan nama ${oldName} berhasil diperbarui menjadi ${updatedName}.`);
  } catch (error) {
    console.error("Error reading or writing contact.json:", error);
  }
};

module.exports = { addContact, listContacts, showContactDetails, deleteContact, updateContact };
