const express = require('express');
const app = express();
const { initDb } = require('./db/connect');
const contactRoutes = require('./routes/contact');

app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Contacts API route
app.use('/contact', contactRoutes);

const PORT = process.env.PORT || 3000;

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(` Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(' Failed to connect to MongoDB', err);
  });

