const { Sequelize } = require('sequelize');

export const sequelize = new Sequelize(process.env.DB_URL, {
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

export const sync = () =>
  sequelize.sync().then(() => {
    console.log('Database initialized!');
  });

const db = {
  Sequelize,
  sequelize,
  sync,
};

export default db;
