"use strict";
const request = require('request');
class getapiFB{
    constructor(){
        this._token = "EAAD0iXJrxfoBAPpIi87RT1xEZCUrqvE8sHyO7ZBX9ZAJuFczgAwPKaDhpkBwqcKBMcsEZAAFZBCldi05kqZAKn7Mvx4MZCeT2YqqRcwZCZA8ukSTULZATw4NM1KPQJNtGjatU0tJHnjWRjoMKNUPX0nUZBqrYlaRRiAS0qoG3BbZCiKLrAZBpZB875qwjwfDsNlPiBnUIZD";
    }
 getSenderName(senderId) {
    return new Promise((resolve, reject) => {
        request({
                    url: `https://graph.facebook.com/v2.6/${senderId}`,
                    qs: {
                        access_token: this._token
                    },
                    method: 'GET',

                }, function(error, response, body) {
                    var person = JSON.parse(body);
                    resolve({
                         first_name: person.first_name,
                        last_name : person.last_name
                    });
                });
            });
    }
 callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": this._token},
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}
}
module.exports = new getapiFB();