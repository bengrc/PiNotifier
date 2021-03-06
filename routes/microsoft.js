var express = require('express');
var passport = require('passport');
var router = express.Router();
var tokens = require('../api/microsoft_tokens.js');
var graph = require('../api/microsoft_graph.js');
var Gpio = require('onoff').Gpio;
var LED = new Gpio(4, 'out');

global.mails = false;

/* GET auth callback. */
router.get('/signin',
  function  (req, res, next) {
    passport.authenticate('azuread-openidconnect',
      {
        response: res,
        prompt: 'login',
        failureRedirect: '/',
        failureFlash: true,
        successRedirect: '/'
      }
    )(req,res,next);
  }
);

router.post('/callback',
  function(req, res, next) {
    passport.authenticate('azuread-openidconnect',
      {
        response: res,
        failureRedirect: '/',
        failureFlash: true
      }
    )(req,res,next);
  },
  function(req, res) {;
    req.flash('error_msg', {message: 'Access token', debug: req.user.accessToken});
    res.redirect("/");
  }
);

router.get('/signout',
  function(req, res) {
    req.session.destroy(function(err) {
      req.logout();
      res.redirect('/');
    });
  }
);

router.get('/getmails',
  async function(req, res) {
    if (global.mails == false) {
      global.mails = true 
    } else if (global.mails == true) {
      global.mails = false;
    }
    if (!req.isAuthenticated()) {
      // Redirect unauthenticated requests to home page
      res.redirect('/')
    } else if (global.mails == true) {
      let params = {
        title: 'PiNotifier', 
        home: true, 
        user: res.locals.user, 
        microsoft: {
          unreadMails: 0
        }
      };
      // Get the access token
      var accessToken;
      try {
        accessToken = await tokens.getAccessToken(req);
      } catch (err) {
        req.flash('error_msg', {
          message: 'Could not get access token. Try signing out and signing in again.',
          debug: JSON.stringify(err)
        });
      }

      // Get unread mails
      if (accessToken && accessToken.length > 0) {
        while (global.mails == true) {
          var unreadMails = await graph.getUserMails(accessToken);
          console.log("You have " + unreadMails + " unread mail(s) in your Office365 mailbox");
          if (unreadMails != 0) {
            console.log("LED on");
            if (LED.readSync() === 0) {
              LED.writeSync(1);
            }
          } else if (unreadMails == 0) {
            console.log("LED off")
            LED.writeSync(0);
          }
          sleep(4000);
        }
        LED.writeSync(0);
      }
      res.render('index', params);  
    }
  }
);

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

module.exports = router;