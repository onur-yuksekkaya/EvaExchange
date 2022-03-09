import { Router } from 'express';
import { buyStock } from '../controllers/BuyController';
import { sellStock } from '../controllers/SellController';
import { SharePrice } from '../controllers/ShareController';

import { checkUserMiddleWare } from '../middlewares/checkUserMiddleware';

const routes = Router();

routes.get('/', (req, res) => {
  res.send('Hey There');
});

routes.post('/buy', checkUserMiddleWare, buyStock);
routes.post('/sell', checkUserMiddleWare, sellStock);
routes.get('/getLatestPrice/:share', SharePrice);

export default routes;
