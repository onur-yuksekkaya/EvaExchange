import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db';

const Transactions = sequelize.define('transactions', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  share: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  share_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING, // BUY - SELL
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Transactions;
