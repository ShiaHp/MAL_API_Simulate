const buildDevLogger = require('./dev-logger');
const buildProdLogger = require('./prod-logger.js');

let logger = null;
logger = buildDevLogger();
// if (process.env.NODE_ENV === 'development') {
//   logger = buildDevLogger();
// } else {
  
// }


module.exports = logger;