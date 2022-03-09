require('dotenv').config();
import express from 'express';
import routes from './routes';
import db from './config/db';

const app = express();
db.sync();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App started @ localhost:${PORT}`);
});
