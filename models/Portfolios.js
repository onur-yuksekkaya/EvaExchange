import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db';

const Portfolios = sequelize.define('portfolios', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  share_list: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Portfolios;
