const User = require("../models/User");

const seedAdmin = async () => {
  const { ADMIN_NAME = "Admin", ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.log("Admin seed skipped: ADMIN_EMAIL or ADMIN_PASSWORD not set");
    return;
  }

  const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

  if (existingAdmin) {
    existingAdmin.name = existingAdmin.name || ADMIN_NAME;
    existingAdmin.password = ADMIN_PASSWORD;
    existingAdmin.role = "admin";
    await existingAdmin.save();
    console.log(`Admin user ready: ${ADMIN_EMAIL}`);
    return;
  }

  await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: "admin"
  });

  console.log(`Admin user created: ${ADMIN_EMAIL}`);
};

module.exports = seedAdmin;
