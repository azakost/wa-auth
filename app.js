const https = require('https');
const fs = require('fs');
const { Client } = require('whatsapp-web.js');

const SESSION_FILE_PATH = './session.json';

let sessionData;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}


const client = new Client({
    session: sessionData,
    puppeteer: {
        executablePath: "/app/.apt/usr/bin/google-chrome",
    },
});

client.on('authenticated', (session) => {
    sessionData = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
        if (err) {
            console.error(err);
        }
    });
});

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

client.initialize();
