import { getLatestPrice } from './utils';
export const SharePrice = async (req, res) => {
  const { share } = req.params;
  console.log('share', share);
  const result = await getLatestPrice(share);
  res.status(200).send(`${result}`);
};
