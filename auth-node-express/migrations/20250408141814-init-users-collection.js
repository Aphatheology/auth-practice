module.exports = {
  async up(db, client) {
    await db.createCollection('users');
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
  },

  async down(db, client) {
    await db.collection('users').drop();
  }
};
