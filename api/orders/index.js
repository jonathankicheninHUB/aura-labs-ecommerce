const handler = require('../../server.js');
module.exports = (req, res) => {
  req.url = '/api/orders';
  return handler(req, res);
};
