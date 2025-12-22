const { CosmosClient } = require("@azure/cosmos");

// Only use the secure connection string in production/when env var is set
// For local development without env vars, this might fail unless mocked
const connectionString = process.env.COSMOS_DB_CONNECTION_STRING;

let client = null;

async function getContainer(containerName) {
    if (!connectionString) {
        throw new Error("COSMOS_DB_CONNECTION_STRING is not defined. Please set it in your .env file or Azure Portal.");
    }

    if (!client) {
        client = new CosmosClient(connectionString);
    }

    // Database name: 'punjabi-db'
    const database = client.database("punjabi-db");

    // Create container if it doesn't exist
    const { container } = await database.containers.createIfNotExists({
        id: containerName,
        partitionKey: { paths: ["/id"] }
    });

    return container;
}

module.exports = { getContainer };
