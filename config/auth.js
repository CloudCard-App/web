module.exports = {
    // These will not work if they don't match the ones defined in Google API
    'googleAuth': { //Can be found right after you create new credentials.
        'clientID': '282384112298-iaq8n3j02r73hjkcut2cat26n9kbmeii.apps.googleusercontent.com',
        'clientSecret': '1WnJVe7GV8Mb4gV_6QYZzPWx',
        'callbackURL': 'http://localhost:8080/auth/google/callback' //Should match that defined in the Google credentials!
    }
};
