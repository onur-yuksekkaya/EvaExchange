import Orders from '../models/Orders';
import Portfolios from '../models/Portfolios';
import {
  addToOrders,
  makeTransaction,
  checkIsExistInPortfolio,
  isShareExist,
  swipeOldOrders,
} from './utils';

const addToPortfolio = async (
  portfolio,
  portfolioShareArray,
  userId,
  shareId
) => {
  // If share is not in Portfolio
  // Add To Portfolio

  portfolioShareArray.push(shareId);

  const portfolioObj = await Portfolios.update(
    { ...portfolio, share_list: portfolioShareArray.string },
    {
      where: { user_id: userId },
    }
  );

  // If successfully updated
  if (portfolioObj) console.log('Portfolio updated');
};

export const buyStock = async (req, res) => {
  const {
    query: { shareId },
    body: { userId, amount, price },
  } = req;

  if (!shareId || !userId || !amount || !price)
    res.status(400).send('Bad Request |- Parameters');

  // Check: Share
  const shareExist = await isShareExist(shareId);
  if (!shareExist) res.status(400).send('Share does not exist');

  // Check: Share is in User's Portfolio
  const { shareExists, portfolioShareArray, portfolio } =
    await checkIsExistInPortfolio(shareId, userId);
  if (!portfolio) res.status(400).send('Portfolio does not exist');

  const transactions = await makeTransaction(
    userId,
    shareId,
    price,
    amount,
    'BUY'
  );

  if (!shareExists && transactions)
    await addToPortfolio(portfolio, portfolioShareArray, userId, shareId);

  if (transactions) res.send(200, "You've successfully registered the order!");
  else res.send(400, "Transactions didn't complete");
};
