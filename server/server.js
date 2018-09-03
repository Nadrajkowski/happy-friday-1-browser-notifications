const express = require('express');
const webpush = requrie('webpush');

const app = express();
const PORT = 3333;

const db = [{
    "endpoint": "https://fcm.googleapis.com/fcm/send/dN43DBJE3dE:APA91bGBmbuv3iK9Mir_3XMgBtpy8xv-n2mzOmu_RtkcAp6wdhiEKX5qV8881V8euGChGNwL2uDoHF9s_DV_5m9dn35vRvnb_ZrnCfAMUyDztBotRMgCyNRYoBypWiB3e3lT5rYtN3bl",
    "expirationTime": null,
    "keys": {
        "p256dh": "BFTkZ6pCLqHsGNU7P4k8QqBA_HWnHi4OQ2ymzlI_LhmDgZ1ycp8GbDyy4QmPMvoMR8mwFEzIcaaodgbibxl4e8o",
        "auth": "U0mlt89iE4jWkmEPO9EMVg"
    }
}];

const keys = {
    public: 'BPDL3ABvZSg0SEX-M-jlIxH7luWz0NbN5lo8sg2KTSDyzMrsKayHG-SXPUI7xKj7FfyXyKPMRWBcP0q8L3y_zAs',
    private: 'dvwiaZDAeBykCTF7L-yNjy1r8fMEIPWpb7VpzFQfIWc'
}

webpush.setVapidDetails(
    'mailto:kasper@bluestonepim.com',
    keys.publick,
    keys.private
);

const triggerPushMsg = (subscription, dataToSend) => {
    return webpush.sendNotification(subscription, dataToSend)
        .catch((err) => {
            console.log('Subscription is no longer valid: ', err);
        });
};

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });

app.get('/', (req, res) => {
    res.send('main');
});

app.post('/api/save-subscription/', (req, res) => {
    // console.log('req :', req);
    db.push(req.body)
    console.log('db after push :', db);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        data: {
            success: true
        }
    }));
});

app.get('sayHi/{name}', (req, res) => {

});

app.listen(PORT, () => {
    console.log(`listenning on port ${PORT}`);
});