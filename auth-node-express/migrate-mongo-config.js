const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const config = {
  mongodb: {
    url: process.env.MONGODB_URI,

    databaseName: "auth-node-express",

    options: {
      useNewUrlParser: true, 
      useUnifiedTopology: true, 
      //   connectTimeoutMS: 3600000, // increase connection timeout to 1 hour
      //   socketTimeoutMS: 3600000, // increase socket timeout to 1 hour
    }
  },
  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
  lockCollectionName: "changelog_lock",
  lockTtl: 0,
  migrationFileExtension: ".js",
  useFileHash: false,
  moduleSystem: 'commonjs',
};

module.exports = config;
