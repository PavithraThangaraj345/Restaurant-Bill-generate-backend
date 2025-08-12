const bcrypt = require('bcrypt');

// IMPORTANT: Replace 'your_super_secret_admin_password' with the actual password
// you want for your admin user. Choose a strong, unique password!
const plainAdminPassword = 'Admin123!';
const saltRounds = 10; // This is the recommended cost factor for bcrypt

bcrypt.hash(plainAdminPassword, saltRounds, function(err, hash) {
    if (err) {
        console.error("Error hashing password:", err);
        return;
    }
    console.log("--------------------------------------------------");
    console.log("COPY THIS HASH:");
    console.log(hash);
    console.log("--------------------------------------------------");
    console.log("You can now safely delete this 'generateAdminHash.js' file.");
});