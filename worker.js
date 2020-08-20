const { promisify } = require('util');
const sleep = promisify(setTimeout);
 
module.exports = async ({ a, b }) => {
  // Fake some async activity
  console.log('worker { a, b, }', a, b);
  await sleep(1000);
  return a + b;
};