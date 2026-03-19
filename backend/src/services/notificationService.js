const { broadcastNotification } = require('../utils/notifications');
const { client: redisClient } = require('../config/redis');

const queueNotification = async (type, data) => {
  await redisClient.lPush('notifications', JSON.stringify({ type, data, timestamp: new Date() }));
};

const processNotifications = async () => {
  const notification = await redisClient.rPop('notifications');
  
  if (notification) {
    const parsed = JSON.parse(notification);
    broadcastNotification(parsed.type, parsed.data);
  }
};

setInterval(processNotifications, 1000);

module.exports = { queueNotification };
