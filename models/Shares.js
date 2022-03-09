import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db';

const Shares = sequelize.define('shares', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  share_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  share_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Shares;
