const handler = require('../server.js');
module.exports = (req, res) => {
  req.url = '/api/settings';
  return handler(req, res);
};
