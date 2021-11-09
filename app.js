const { Client } = require('whatsapp-web.js');

const host = 'localhost';
const port = 3000;

const client = new Client({
    puppeteer: {
        browserWSEndpoint: `ws://${host}:${port}`
    }
});

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
});

client.initialize();