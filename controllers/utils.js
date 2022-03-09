import { Op } from 'sequelize';

import Orders from '../models/Orders';
import Shares from '../models/Shares';
import Portfolios from '../models/Portfolios';
import Transactions from '../models/Transactions';

export const checkShare = async (shareId) => {
  return await Shares.findOne({ where: { share_code: shareId } });
};

export const checkIsExistInPortfolio = async (shareId, userId) => {
  const portfolio = await Portfolios.findOne({
    where: { user_id: userId.toString() },
  });

  if (!portfolio) return {};

  const portfolioShares = new DBArray(portfolio.share_list);

  return {
    shareExists: portfolioShares.includes(shareId),
    portfolioShareArray: portfolioShares,
    portfolio,
  };
};

// AKB,CCC,TRY,KML -> ["AKB", "CCC", ...]
export class DBArray {
  delimeter = ',';

  constructor(arrStr) {
    this.arrStr = arrStr;
  }

  get array() {
    return this.arrStr.split(this.delimeter);
  }

  get string() {
    return this.arrStr;
  }

  push(str) {
    this.arrStr += this.delimeter + str;
  }

  remove(str) {
    this.arrStr = this.array
      .filter((item) => item !== str)
      .join(this.delimeter);
  }

  includes(str) {
    return this.array.includes(str);
  }
}

export const isShareExist = async (shareId) => {
  const share = await Shares.findOne({ where: { share_code: shareId } });
  return !!share;
};

const addToPortfolio = async (userId, shareId) => {
  const { portfolioShareArray, portfolio } = await checkIsExistInPortfolio(
    shareId,
    userId
  );

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

const removeFromPortfolio = async (userId, shareId) => {
  const { portfolioShareArray, portfolio } = await checkIsExistInPortfolio(
    shareId,
    userId
  );

  portfolioShareArray.remove(shareId);

  const portfolioObj = await Portfolios.update(
    { ...portfolio, share_list: portfolioShareArray.string },
    {
      where: { user_id: userId },
    }
  );

  // If successfully updated
  if (portfolioObj) console.log('Portfolio updated');
};

export const addToOrders = async (user_id, share_count, share, price, type) => {
  const [oldOrder, createdOrder] = await Orders.findOrCreate({
    where: { user_id, share },
    defaults: {
      user_id,
      share_count,
      share,
      price,
      type,
    },
  });

  if (oldOrder) {
    const orderUpdateTimeValid =
      oldOrder.updatedAt < new Date(Date.now() - 1 * 60 * 60 * 1000);
    const orderTypeChanged = !(oldOrder.type === type);

    if (!orderTypeChanged && !orderUpdateTimeValid) {
      console.log('| Order is LOCKED');

      return { ...oldOrder, locked: true };
    }

    const updatedOrder = await oldOrder.update({
      ...(orderTypeChanged
        ? { price, type }
        : orderUpdateTimeValid
        ? { price }
        : {}),
    });

    console.log('| Order is updated =>', updatedOrder.dataValues);

    return updatedOrder;
  } else return createdOrder;
};

export const deleteOrder = async (user_id, share) => {
  const deleted = await Orders.destroy({ where: { user_id, share } });

  return deleted === 1;
};

export const updateOrder = async (user_id, share, price, amount) => {
  const updatedOrder = await Orders.update(
    {
      ...(price ? { price } : amount ? { amount } : {}),
    },
    { where: { user_id, share } }
  );

  return updatedOrder;
};

export const getLatestPrice = async (share) => {
  const transaction = await Transactions.findAll({
    where: { share },
    order: [['updatedAt', 'ASC']],
  });
  console.log('transactions', transaction);

  return transaction.map(({ dataValues }) => dataValues.price)[
    transaction.length - 1
  ];
};

export const swipeOldOrders = async (share) => {
  await Orders.destroy({
    where: {
      share,
      updatedAt: {
        [Op.lte]: Date.now() - 3 * 60 * 60 * 1000, // Order time limit : 3 hours
      },
    },
  });
};

export const makeTransaction = async (user_id, share, price, amount, type) => {
  await swipeOldOrders(share);
  await addToOrders(user_id, amount, share, price, type);

  const allOrders = await Orders.findAll({
    where: { share, price },
    order: [['updatedAt', 'ASC']],
  });
  const orders = allOrders.map(({ dataValues }) => dataValues);

  const sellOrders = orders.filter(({ type }) => type === 'SELL');
  const buyOrders = orders.filter(({ type }) => type === 'BUY');

  buyOrders.forEach(async (buyOrder) => {
    const priceMatchedSell = sellOrders.find(
      (sellOrder) => buyOrder.price === sellOrder.price
    );

    if (priceMatchedSell) {
      const sellAmount = priceMatchedSell.share_count;
      const buyAmount = buyOrder.share_count;

      if (sellAmount < buyAmount) {
        await updateOrder(
          buyOrder.user_id,
          share,
          buyOrder.price,
          buyAmount - sellAmount
        );
        await deleteOrder(priceMatchedSell.user_id, share);
      } // Update Buy and Delete Sell
      else if (sellAmount === buyAmount) {
        await deleteOrder(priceMatchedSell.user_id, share);
        await deleteOrder(buyOrder.user_id, share);
      } // Delete Both
      else {
        await updateOrder(
          priceMatchedSell.user_id,
          share,
          priceMatchedSell.price,
          sellAmount - buyAmount
        );
        await deleteOrder(buyOrder.user_id, share);
      } // Update Sell and Delete Buy

      // Create Transaction for Both BUY-SELL
      const sellTransaction = await Transactions.create({
        user_id: priceMatchedSell.user_id,
        share,
        price: buyOrder.price,
        share_count: Math.min(sellAmount, buyAmount),
        type: 'SELL',
      });
      const buyTransaction = await Transactions.create({
        user_id: buyOrder.user_id,
        share,
        price: buyOrder.price,
        share_count: Math.min(sellAmount, buyAmount),
        type: 'BUY',
      });
      console.log('| Buy Transaction created =>', buyTransaction);
      console.log('| Sell Transaction created =>', sellTransaction);

      // For successful transactions add/remove share @ portfolio
      // await addToPortfolio()
    }
  });

  return await Transactions.findAll({ where: { share } });
};
