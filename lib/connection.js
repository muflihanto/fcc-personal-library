// Do not change this file
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
/**
 * @callback MainCallback
 * @param {import('mongodb').MongoClient} client - MongoClient
 * @returns {void}
 */

/**
 * @param {MainCallback} callback - Callback
 */
async function main(callback) {
  const URI = process.env["DB"];
  const client = new MongoClient(URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // Make the appropriate DB calls
    await callback(client);
  } catch (e) {
    // Catch any errors
    console.error(e);
    throw new Error("Unable to Connect to Database");
  }
}

module.exports = main;
