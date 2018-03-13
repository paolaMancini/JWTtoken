// Create Guest Tokens (using JWT standard) to authenticate guest users and perform actions against the Cisco Spark API.

var jwt = require('jsonwebtoken');

require('node-env-file')(__dirname + '/.env');
console.log('process.env.guestName:', process.env.guestName);
if (!process.env.guestName) {
    console.log("GuestName value not found.");
    process.exit(1);
} else {
    var name = process.env.guestName;
}

if (!process.env.guestId) {
    console.log("guestId value not found.");
    process.exit(2);
} else {
    var id = process.env.guestId;
}

if (!process.env.guestSecret) {
    console.log("guestSecret value not found.");
    process.exit(3);
} else {
    var secret = process.env.guestSecret;
}

if (!process.env.guestSub) {
    console.log("guestSub value not found.");
    process.exit(4);
} else {
    var sub = process.env.guestSub;
}

if (!process.env.timestamp) {
    console.log("timestamp value not found.");
    process.exit(5);
} else {
    var timestamp = process.env.timestamp;
}

// PAYLOAD Description
//sub	The subject of the token—a description of the use of the token. Required
//name	The display name of the guest user. This will be the name shown in Cisco Spark clients.
//iss	The issuer of the token. Use the Guest Issuer ID provided in My Apps. This claim is required.
//exp	The expiration time of the token, as a UNIX timestamp in seconds. Use the lowest practical 
//value for the use of the token. This claim is required.


// Create the signature, the encoded header and payload, along with the secret (provided when the app is created).
// they are combined and signed using the algorithm specified in the header.


//var encodedData = base64urlEncode(header) + '.' + base64urlEncode(payload);
//HMACSHA256(encodedData, 'HZFIrkagVPocJNIBIOQkRQEPqYSEbnTP5VW+mAVsAKw=');


var token = jwt.sign({
    'sub': sub,
    'name': name,
    'iss': id
}, Buffer.from(secret, 'base64'), { expiresIn: timestamp });

console.log('token: ', token);


var CiscoSpark = require('ciscospark');
var spark = CiscoSpark.init();

// wait until the SDK is loaded and ready
spark.once(`ready`, function() {
    if (spark.canAuthorize) {
        // the user is already authenticated
        // proceed with your app logic
        console.log("the user is already authenticated");
    } else {
        spark.authorization.requestAccessTokenFromJwt({ jwt })
            .then(() => {
                // the user is now authenticated with a JWT
                console.log("the user is now authenticated with a JWT");
            })
    }
});
