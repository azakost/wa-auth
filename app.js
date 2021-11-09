const https = require('https');
const fs = require('fs');
const { Client } = require('whatsapp-web.js');

const SESSION_FILE_PATH = './session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionCfg = require(SESSION_FILE_PATH);
}

const client = new Client({
    session: sessionCfg,
    // Comment this when running locally
    puppeteer: {
        browserWSEndpoint: 'ws://browserless:3000',
    },
});

client.initialize();


client.on('qr', (qr) => {
    console.log(qr);
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



