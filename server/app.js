
let express = require('express'),
  path = require('path'),
  mongoose = require('mongoose'),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  dataBaseConfig = require('./database/db');

var session = require('express-session');
var flash = require('connect-flash');

// Connecting mongoDB
mongoose.Promise = global.Promise;
mongoose.connect(dataBaseConfig.db, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => {
    console.log('Database connected sucessfully ')
  },
  error => {
    console.log('Could not connected to database : ' + error)
  }
)

const MicrosoftAuthConfig = require('./microsoftAuthConfig');
var passport = require('passport');
var OIDCStrategy = require('passport-azure-ad').OIDCStrategy;

// Configure passport

// In-memory storage of logged-in users
// For demo purposes only, production apps should store
// this in a reliable storage
var users = {};

// Passport calls serializeUser and deserializeUser to
// manage users
passport.serializeUser(function(user, done) {
  // Use the OID property of the user as a key
  users[user.profile.oid] = user;
  done (null, user.profile.oid);
});

passport.deserializeUser(function(id, done) {
  done(null, users[id]);
});

var graph = require('./microsoftGraph');
// Configure simple-oauth2
const oauth2 = require('simple-oauth2').create({
  client: {
    id: MicrosoftAuthConfig.OAUTH_APP_ID,
    secret: MicrosoftAuthConfig.OAUTH_APP_PASSWORD
  },
  auth: {
    tokenHost: MicrosoftAuthConfig.OAUTH_AUTHORITY,
    authorizePath: MicrosoftAuthConfig.OAUTH_AUTHORIZE_ENDPOINT,
    tokenPath: MicrosoftAuthConfig.OAUTH_TOKEN_ENDPOINT
  }
});

var Gpio = require('onoff').Gpio;
var LED = new Gpio(4, 'out');

// Callback function called once the sign-in is complete
// and an access token has been obtained
async function signInComplete(iss, sub, profile, accessToken, refreshToken, params, done) {
  if (!profile.oid) {
    return done(new Error("No OID found in user profile."), null);
  }

  try{
    
    const user = await graph.getUserDetails(accessToken);
    
    
    while (1) {
      const unreadMailsNumber = await graph.getUnreadMailsNumber(accessToken)
      if (unreadMailsNumber != 0) {
        console.log("allumer led");
        LED.writeSync(1);
      } else if (unreadMailsNumber == 0) {
        console.log("éteindre led")
        LED.writeSync(0);
      }
      console.log(unreadMailsNumber);
    }
    
  
    //console.log(user);
    if (user) {
      // Add properties to profile
      profile['email'] = user.mail ? user.mail : user.userPrincipalName;
    }
  } catch (err) {
    done(err, null);
  }

  // Save the profile and tokens in user storage
  users[profile.oid] = { profile, accessToken };
  return done(null, users[profile.oid]);
}

// Configure OIDC strategy
passport.use(new OIDCStrategy(
  {
    identityMetadata:  MicrosoftAuthConfig.OAUTH_AUTHORITY + MicrosoftAuthConfig.OAUTH_ID_METADATA,  //`${process.env.OAUTH_AUTHORITY}${process.env.OAUTH_ID_METADATA}`,
    clientID: MicrosoftAuthConfig.OAUTH_APP_ID,
    responseType: 'code id_token',
    responseMode: 'form_post',
    redirectUrl: MicrosoftAuthConfig.OAUTH_REDIRECT_URI,
    allowHttpForRedirectUrl: true,
    clientSecret: MicrosoftAuthConfig.OAUTH_APP_PASSWORD,
    validateIssuer: false,
    passReqToCallback: false,
    scope: MicrosoftAuthConfig.OAUTH_SCOPES.split(' ')
  },
  signInComplete,
));

var microsoftAuthRouter = require('./routes/microsoftAuthRoute');

// Set up express js port
//const studentRoute = require('../backend/routes/student.route')
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cors());
app.use(express.static(path.join(__dirname, 'dist/PiNotifier')));
app.use('/', express.static(path.join(__dirname, 'dist/PiNotifier')));



// session
app.use(session({
  secret: '42',
  resave: false,
  saveUninitialized: false,
  unset: 'destroy'
}));

// Flash middleware
app.use(flash());

// Set up local vars for template layout
app.use(function(req, res, next) {
  // Read any flashed errors and save
  // in the response locals
  res.locals.error = req.flash('error_msg');

  // Check for simple error string and
  // convert to layout's expected format
  var errs = req.flash('error');
  for (var i in errs){
    res.locals.error.push({message: 'An error occurred', debug: errs[i]});
  }

  next();
});

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use('/microsoftAuth', microsoftAuthRouter);




// Create port
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log('Connected to port ' + port)
})

// Find 404 and hand over to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
})

app.use(function(req, res, next) {
  // Set the authenticated user in the
  console.log(req.user);
  // template locals
  if (req.user) {
    res.locals.user = req.user.profile;
    console.log(res.locals.user);
  }
  next();
});

