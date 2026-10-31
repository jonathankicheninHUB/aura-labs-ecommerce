const handler = require('../../server.js');
module.exports = (req, res) => {
  const queryIdx = req.url.indexOf('?');
  const qs = queryIdx !== -1 ? req.url.slice(queryIdx) : '';
  req.url = '/api/orders/track' + qs;
  return handler(req, res);
};
