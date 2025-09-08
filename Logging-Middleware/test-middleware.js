const LoggingMiddleware = require('./logging-middleware');
const config = require('./config');

async function testMiddleware() {
  console.log('🧪 Testing Logging Middleware...\n');

  if (config.ACCESS_TOKEN === 'YOUR_ACCESS_TOKEN_HERE') {
    console.error('❌ Please update ACCESS_TOKEN in config.js first!');
    return;
  }

  const logger = new LoggingMiddleware(config.ACCESS_TOKEN);

  console.log('Test 1: Info log');
  await logger.info('backend', 'service', 'Testing logging middleware functionality');
  await sleep(500);

  console.log('Test 2: Error log');
  await logger.error('backend', 'handler', 'Sample error message for testing');
  await sleep(500);

  console.log('Test 3: Database log');
  await logger.debug('backend', 'db', 'Database connection test');
  await sleep(500);

  console.log('Test 4: Frontend log');
  await logger.info('frontend', 'api', 'Frontend API call test');
  await sleep(500);

  console.log('Test 5: Warning log');
  await logger.warn('backend', 'auth', 'Authentication warning test');

  console.log('\n✅ All tests completed!');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

if (require.main === module) {
  testMiddleware().catch(console.error);
}