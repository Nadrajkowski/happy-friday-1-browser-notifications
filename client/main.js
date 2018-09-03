main();

function main() {

    var keys = {
        public: 'BPDL3ABvZSg0SEX-M-jlIxH7luWz0NbN5lo8sg2KTSDyzMrsKayHG-SXPUI7xKj7FfyXyKPMRWBcP0q8L3y_zAs',
        private: 'dvwiaZDAeBykCTF7L-yNjy1r8fMEIPWpb7VpzFQfIWc'
    }

    console.log('Happy Friday !')
    browserSupportsIt();
    registerServiceWorker();
    askPermission();
    subscribeUserToPush(keys.public);
}

function browserSupportsIt() {
    if (!('serviceWorker' in navigator)) {
        // Service Worker isn't supported on this browser, disable or hide UI.
        console.log('nope');
        return false;
    }

    if (!('PushManager' in window)) {
        // Push isn't supported on this browser, disable or hide UI.
        console.log('nope');
        return false;
    }
    console.log('yip');
    return true;
}

function registerServiceWorker() {
    return navigator.serviceWorker.register('service-worker.js')
        .then(function (registration) {
            console.log('Service worker successfully registered.');
            return registration;
        })
        .catch(function (err) {
            console.error('Unable to register service worker.', err);
        });
}

function askPermission() {
    return new Promise(function (resolve, reject) {
            const permissionResult = Notification.requestPermission(function (result) {
                resolve(result);
            });

            if (permissionResult) {
                permissionResult.then(resolve, reject);
            }
        })
        .then(function (permissionResult) {
            if (permissionResult !== 'granted') {
                throw new Error('We weren\'t granted permission.');
            }
        });
}

function subscribeUserToPush(key) {
    return navigator.serviceWorker.register('service-worker.js')
        .then(function (registration) {
            const subscribeOptions = {
                userVisibleOnly: true,
                applicationServerKey: urlB64ToUint8Array(key)
            };

            return registration.pushManager.subscribe(subscribeOptions);
        })
        .then(function (pushSubscription) {
            console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
            sendSubscriptionToBackEnd(pushSubscription);
        });
}

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function sendSubscriptionToBackEnd(subscription) {
    console.log('sending subscription to backend');
    console.log('subscription :', subscription);
    return fetch('http://localhost:3333/api/save-subscription/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(subscription),
            mode: 'no-cors'
        })
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Bad status code from server.');
            }
            console.log('response :', response);
            //return response.json();
        })
        .then(function (responseData) {
            // if (!(responseData.data && responseData.data.success)) {
            //     throw new Error('Bad response from server.');
            // }
        });
}