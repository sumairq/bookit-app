const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting Down....');
  console.log(err);
  // server.close allows us to deal with any pending requests before we exit the process.
  process.exit(1);
});

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log('DB connection Successful!'));

// 4) START SERVER
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
// TEST
//Vid-122
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting Down....');
  // server.close allows us to deal with any pending requests before we exit the process.
  server.close(() => {
    // 1 is code , which means uncaught exception, 0 means success in this case Vid-122
    process.exit(1);
  });
});
