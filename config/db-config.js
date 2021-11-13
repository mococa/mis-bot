const mongoose = require("mongoose");

const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const db_connection = () => {
  mongoose.connect(process.env.MONGO_URI, config);
  const connection = mongoose.connection;
  connection.once("open", () => {
    console.log("Database connected");
  });
};
module.exports = db_connection;
