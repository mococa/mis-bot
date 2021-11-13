const db_connection = require("./db-config");
const dbConfig = require("./db-config");

module.exports = (app) => {
  app.get("/", (req, res) => {
    res.send("Fé");
  });
  app.listen(3000, () => {
    console.log("Server started on port 3000 🚀");
    db_connection();
  });
};
