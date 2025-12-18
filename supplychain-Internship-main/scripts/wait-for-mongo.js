const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://mongo:27017';
const retries = parseInt(process.env.WAIT_RETRIES || '30', 10);
const delayMs = parseInt(process.env.WAIT_DELAY_MS || '2000', 10);

async function wait() {
  for (let i = 0; i < retries; i++) {
    try {
      const client = new MongoClient(uri, { serverSelectionTimeoutMS: 2000 });
      await client.connect();
      await client.db().admin().ping();
      await client.close();
      console.log('Mongo is available at', uri);
      process.exit(0);
    } catch (err) {
      const left = retries - i - 1;
      console.log(`Mongo not available yet (${i + 1}/${retries}), retrying in ${delayMs}ms...`, err.message);
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
  console.error('Timed out waiting for Mongo at', uri);
  process.exit(1);
}

wait();
