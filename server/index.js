const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '127.0.0.1', () => { 
  console.log(`Server running on port ${PORT}`);
 });
