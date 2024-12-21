const mongoose = require("mongoose");
require("dotenv").config();

function connectToMongoDB() {
  mongoose.set("strictQuery", true);

  return new Promise((resolve, reject) => {
    const connectWithRetry = () => {
      mongoose
        .connect(process.env.MONGODB_URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then(() => {
          if (process.env.NODE_ENV !== "test") {
            console.log("Connected to DB successfully");
          }
          resolve(); // Resolve when the connection is successful
        })
        .catch((err) => {
          console.error(
            "Error connecting to DB. Retrying in 5 seconds...",
            err
          );
          setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
        });
    };

    connectWithRetry();

    mongoose.connection.on("disconnected", () => {
      console.log("Disconnected from DB. Attempting to reconnect...");
      connectWithRetry();
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("DB connection closed due to app termination");
      process.exit(0);
    });
  });
}

// Ensure you export both functions correctly
async function disconnectDB() {
  await mongoose.connection.close();
  console.log("DB connection closed");
}

module.exports = { connectToMongoDB, disconnectDB };
