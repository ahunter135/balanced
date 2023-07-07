const { onRequest } = require('firebase-functions/v2/https');
  const server = import('firebase-frameworks');
  exports.ssrbalancedbudget90f1f = onRequest({}, (req, res) => server.then(it => it.handle(req, res)));
  