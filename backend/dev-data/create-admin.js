const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/userModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const EMAIL = 'admin@bookit.test';
const PASSWORD = 'AdminPass123!';
const NAME = 'Admin User';

(async () => {
  try {
    await mongoose.connect(DB);

    const existing = await User.findOne({ email: EMAIL }).select('+password');

    if (existing) {
      existing.role = 'admin';
      existing.password = PASSWORD;
      existing.passwordConfirm = PASSWORD;
      existing.active = true;
      await existing.save();
      console.log(`Updated existing user → admin: ${EMAIL}`);
    } else {
      await User.create({
        name: NAME,
        email: EMAIL,
        password: PASSWORD,
        passwordConfirm: PASSWORD,
        role: 'admin',
      });
      console.log(`Created admin: ${EMAIL}`);
    }

    console.log('---');
    console.log(`Email:    ${EMAIL}`);
    console.log(`Password: ${PASSWORD}`);
    console.log('---');
  } catch (err) {
    console.error('Failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
