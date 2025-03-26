const app = require("./app");
const PORT = process.env.PORT || 3500;
const connectDB = require("./config/db");
require("dotenv").config();

connectDB();

app.listen(PORT, (req, res) => {
  console.log(`Listening on Port: ${PORT}`);
});
