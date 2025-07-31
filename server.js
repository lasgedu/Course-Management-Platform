require('dotenv').config();
const app = require('./src/app');
const { testConnection, syncDatabase } = require('./src/config/database');
const { redisClient } = require('./src/config/redis');
const cron = require('node-cron');
const { checkMissingLogs } = require('./src/workers/notificationWorker');

const PORT = process.env.PORT || 3000;

// Initialize server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Sync database models
    await syncDatabase();
    
    // Connect to Redis
    await redisClient.connect();
    
    // Schedule cron jobs
    // Check for missing logs every Monday at 9 AM
    cron.schedule(process.env.NOTIFICATION_CHECK_INTERVAL || '0 9 * * 1', checkMissingLogs);
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await redisClient.quit();
  process.exit(0);
});