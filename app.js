const https = require('https');
const { Client } = require('whatsapp-web.js');
const client = new Client({
    puppeteer: {
        executablePath: "/app/.apt/usr/bin/google-chrome",
    },
});

client.on('qr', (qr) => {
    https.get('https://qwix.kz/api/wa/send-qr?data=' + encodeURIComponent(qr));
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', msg => {
    var phone = msg.from.substr(1, 10);
    console.log(phone);
    https.get('https://qwix.kz/api/wa/get-code?phone=' + phone, (res) => {
        res.on('data', (code) => {
            msg.reply(code.toString());
        });
    });
});

client.on('change_state', (e) => {
    https.get('https://qwix.kz/api/wa/report?msg=' + encodeURIComponent(e));
});

client.initialize();


