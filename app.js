const app = require('./index')
const db = require("./db");

const PORT = process.env.PORT || 5000

// connect to database
db.connectToMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
