const validator = require("validator");
const fs = require("fs").promises;

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
      // Ignore if the file doesn't exist or has invalid JSON
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

const readFile = async () => {
  try {
    const data = await fs.readFile("contact.json", "utf-8");
    const contacts = JSON.parse(data);
    return contacts;
  } catch (error) {
    // Handle errors, e.g., file not found or invalid JSON format
    console.error("Error reading contact.json:", error);
    return []; // Return an empty array or handle the error in an appropriate way
  }
};


module.exports = { validatePhoneNumber, validateEmail, saveContact, readFile };
