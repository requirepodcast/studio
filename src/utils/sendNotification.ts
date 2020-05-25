import axios from 'axios';

export async function sendNotification(data: object): Promise<void> {
  return await axios.post('https://require-bot.glitch.me/render/webhook', data, {
    headers: { authorization: process.env.WEBHOOK_KEY },
  });
}
