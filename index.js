const express = require('express');
const db = require('./config/db');

const app = express();

const PORT = process.env.PORT || 3000;

db.sync({ alter: true }).then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
});