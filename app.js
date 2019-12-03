'use strict';
var async = require("asyncawait/async");
var await = require("asyncawait/await");
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
// Imports dependencies and set up http server
const 
  request = require('request'),
  express = require('express'),
  body_parser = require('body-parser'),
  app = express().use(body_parser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

app.get('/', (req, res) => {  
  res.send("Server chạy ngon lành.");
 });
// Accepts POST requests at /webhook endpoint
app.post('/webhook', (req, res) => {  

  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    body.entry.forEach(function(entry) {

      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);


      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender ID: ' + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);        
      } else if (webhook_event.postback) {
        
        handlePostback(sender_psid, webhook_event.postback);
      }
      
    });
    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

// Accepts GET requests at the /webhook endpoint
app.get('/webhook', (req, res) => {
  
  /** UPDATE YOUR VERIFY TOKEN **/
  const VERIFY_TOKEN = "ma_xac_nhan_cua_ban";
  
  // Parse params from the webhook verification request
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Check if a token and mode were sent
  if (mode && token) {
  
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});

function handleMessage(sender_psid, received_message) {
 let response;
  // Checks if the message contains text
  if (received_message.text) 
  {    
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    if(received_message.text == "help")
    {
    response = {
        "text" : `Dưới đây là những chức năng tôi có thể giúp bạn :
        1. Thông tin về chủ tôi
        2. Tra cứu giá vàng
        3. Tra cứu thời tiết
        4. Tin tức về Bitcoin
        5. Xem và đặt lịch những sân bóng mini của cũng tôi.
        Cảm ơn ! 😉`
                }
        callSendAPI(sender_psid, response); 
    }
    else if (received_message.text == "hello") {
              async(() => {
          var getname = await (getSenderName(sender_psid));
         response = {
            "text": `Chào ${getname.last_name} ${getname.first_name},bạn cần gì ở tôi! \n - Bạn có thể gõ "help" để biết thêm các chức năng của tôi nhá`
            }
            callSendAPI(sender_psid, response); 
      })();
    }
    else
    {
        response = {
            "text" : `Bạn nói là: "${received_message.text}".Xin lỗi bạn bot còn nhỏ dại nên không hiểu. Bạn bấm gõ help xem? 😊😊😊 `
        }
        callSendAPI(sender_psid, response); 
    }
  }
  else if (received_message.attachments) 
  {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Is this the right picture?",
            "subtitle": "Tap a button to answer.",
            "image_url": attachment_url,
            "buttons": [
              {
                "type": "postback",
                "title": "Yes!",
                "payload": "yes",
              },
              {
                "type": "postback",
                "title": "No!",
                "payload": "no",
              }
            ],
          }]
        }
      }
    }
    callSendAPI(sender_psid, response);
  } 
  
  // Send the response message
      
}

function handlePostback(sender_psid, received_postback) {
  console.log('ok')
   let response;
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = { "text": "Thanks!" }
  } else if (payload === 'no') {
    response = { "text": "Oops, try sending another image." }
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response); 
}
 function  getSenderName(senderId) {
        return new Promise((resolve, reject) => {
                request({
                    url: `https://graph.facebook.com/v2.6/${senderId}`,
                    qs: {
                        access_token: "EAAD0iXJrxfoBAPpIi87RT1xEZCUrqvE8sHyO7ZBX9ZAJuFczgAwPKaDhpkBwqcKBMcsEZAAFZBCldi05kqZAKn7Mvx4MZCeT2YqqRcwZCZA8ukSTULZATw4NM1KPQJNtGjatU0tJHnjWRjoMKNUPX0nUZBqrYlaRRiAS0qoG3BbZCiKLrAZBpZB875qwjwfDsNlPiBnUIZD"
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

function callSendAPI(sender_psid, response) {
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
    "qs": { "access_token": "EAAD0iXJrxfoBAPpIi87RT1xEZCUrqvE8sHyO7ZBX9ZAJuFczgAwPKaDhpkBwqcKBMcsEZAAFZBCldi05kqZAKn7Mvx4MZCeT2YqqRcwZCZA8ukSTULZATw4NM1KPQJNtGjatU0tJHnjWRjoMKNUPX0nUZBqrYlaRRiAS0qoG3BbZCiKLrAZBpZB875qwjwfDsNlPiBnUIZD" },
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
