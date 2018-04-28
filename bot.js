/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/


This is a sample Facebook bot built with Botkit.

# RUN THE BOT:
  Follow the instructions here to set up your Facebook app and page:
    -> https://developers.facebook.com/docs/messenger-platform/implementation
  Run your bot from the command line:
    page_token=<MY PAGE TOKEN> verify_token=<MY_VERIFY_TOKEN> node bot.js



~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//var env = require('node-env-file');
//env(__dirname + '/.env');


var Botkit = require('botkit');
var debug = require('debug')('botkit:main');

console.log(process.env.verify_token)
console.log(process.env.page_token)

// Create the Botkit controller, which controls all instances of the bot.
var controller = Botkit.facebookbot({
    verify_token: process.env.verify_token,
    access_token: process.env.page_token
});

// Set up an Express-powered webserver to expose oauth and webhook endpoints
var webserver = require(__dirname + '/components/express_webserver.js')(controller);

// Tell Facebook to start sending events to this application
require(__dirname + '/components/subscribe_events.js')(controller);

// Set up Facebook "thread settings" such as get started button, persistent menu
require(__dirname + '/components/thread_settings.js')(controller);


// Send an onboarding message when a user activates the bot
require(__dirname + '/components/onboarding.js')(controller);

// Load in some helpers that make running Botkit on Glitch.com better
require(__dirname + '/components/plugin_glitch.js')(controller);

// enable advanced botkit studio metrics
require('botkit-studio-metrics')(controller);

var normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
    console.log('---<<', file);
    if(file.indexOf('.') <= -1){
      require("./skills/" + file)(controller);
    }
});
console.log('===========================================================')
console.log(process.env.verify_token)
console.log(process.env.page_token)

controller.on('message_received', function(bot, message) {

   console.log("message rcvd : ", message.text)
   bot.reply(bot, "hellooo");

});


// This captures and evaluates any message sent to the bot as a DM
// or sent to the bot in the form "@bot message" and passes it to
// Botkit Studio to evaluate for trigger words and patterns.
// If a trigger is matched, the conversation will automatically fire!
// You can tie into the execution of the script using the functions
// controller.studio.before, controller.studio.after and controller.studio.validate

function usage_tip() {
    console.log('~~~~~~~~~~');
    console.log('Botkit Studio Starter Kit');
    console.log('Execute your bot application like this:');
    console.log('page_token=<MY PAGE TOKEN> verify_token=<MY VERIFY TOKEN> studio_token=<MY BOTKIT STUDIO TOKEN> node bot.js');
    console.log('Get Facebook token here: https://developers.facebook.com/docs/messenger-platform/implementation')
    console.log('Get a Botkit Studio token here: https://studio.botkit.ai/')
    console.log('~~~~~~~~~~');
}
