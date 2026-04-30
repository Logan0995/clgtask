const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config();

const LOCAL_URI = 'mongodb://127.0.0.1:27017/libraryDB';
const ATLAS_URI = process.env.MONGO_URI;

if (!ATLAS_URI) {
    console.error('ERROR: MONGO_URI is not defined in .env file. Please add your MongoDB Atlas connection string.');
    process.exit(1);
}

if (ATLAS_URI === LOCAL_URI || ATLAS_URI.includes('127.0.0.1') || ATLAS_URI.includes('localhost')) {
    console.error('ERROR: MONGO_URI seems to be a local database connection. Please provide the MongoDB Atlas connection string.');
    process.exit(1);
}

async function migrateData() {
    try {
        console.log('📡 Connecting to Local MongoDB...');
        const localConnection = await mongoose.createConnection(LOCAL_URI).asPromise();
        console.log('✅ Connected to Local MongoDB.');

        console.log('📡 Connecting to MongoDB Atlas...');
        const atlasConnection = await mongoose.createConnection(ATLAS_URI).asPromise();
        console.log('✅ Connected to MongoDB Atlas.');

        // The collections defined in the schemas
        const collectionsToMigrate = ['users', 'books', 'requests', 'histories', 'recommendations'];

        for (const collectionName of collectionsToMigrate) {
            console.log(`\n--- Migrating collection: ${collectionName} ---`);
            
            const localCollection = localConnection.collection(collectionName);
            const data = await localCollection.find({}).toArray();
            
            if (data.length === 0) {
                console.log(`⚠ No data found in local '${collectionName}'. Skipping.`);
                continue;
            }

            console.log(`📦 Found ${data.length} documents in local '${collectionName}'. Migrating...`);

            const atlasCollection = atlasConnection.collection(collectionName);
            
            // Using bulkWrite with upsert to avoid duplicate key errors and preserve exact _id
            const operations = data.map(doc => ({
                updateOne: {
                    filter: { _id: doc._id },
                    update: { $set: doc },
                    upsert: true
                }
            }));

            const result = await atlasCollection.bulkWrite(operations, { ordered: false });
            console.log(`✔ Successfully migrated '${collectionName}': ${result.upsertedCount + result.modifiedCount + result.matchedCount} documents processed.`);
        }

        console.log('\n🚀 ALL DATA MIGRATED SUCCESSFULLY WITHOUT DUPLICATION.');
        console.log('You can now safely run your backend connected to MongoDB Atlas!');
        
        await localConnection.close();
        await atlasConnection.close();
        process.exit(0);

    } catch (error) {
        console.error('\n❌ MIGRATION FAILED:', error);
        process.exit(1);
    }
}

migrateData();
