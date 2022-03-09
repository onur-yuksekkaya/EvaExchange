import User from '../models/Users';
export const checkUserMiddleWare = async (req, res, next) => {
  const {
    body: { userId },
  } = req;

  if (!userId) res.status(401).send('userId is required');
  const user = await User.findOne({ where: { user_id: userId + '' } });

  if (user) next();
  else res.status(401).send('User not exists.');
};
