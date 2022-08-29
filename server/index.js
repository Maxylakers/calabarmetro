/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();
const express = require('express'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	FileStore = require('session-file-store')(session),
	passport = require('passport'),
	mongoose = require('mongoose'),
	LocalStrategy = require('passport-local').Strategy,
	expressValidator = require('express-validator'),
	fileUpload = require('express-fileupload'),
	api = require('./routes/api'),
	messages = require('express-messages'),
	path = require('path'),
	cors = require('cors'),
	helmet = require('helmet'),
	$http = require('axios'),
	User = require('./models/user');

const { DB_URL: dbUrl = 'mongodb://127.0.0.1', DB_PORT: dbPort = 27017, DB_NAME: dbName = 'propertyApp' } = process.env;

$http.defaults.baseURL = process.env.NODE_ENV === 'production' ? `${process.env.API_URL}/node` : `${process.env.STAGING_API_URL}/node`;
$http.defaults.headers.common.node = true;

// Connection URL
const url = `${dbUrl}:${dbPort}/${dbName}`;

mongoose.Promise = global.Promise;
global.db = mongoose.connect(url);

global.db.then(() => {
	console.log('Connected to Mongo...');
}, (error) => {
	console.warn(error);
});

passport.serializeUser((user, done) => {
	done(null, user._id);
});
//
passport.deserializeUser((_id, done) => {
	User.getUserById(_id, (err, user) => {
		if (err) {
			return done(err);
		}
		return done(null, user);
	});
});

passport.use(new LocalStrategy(
	{
		usernameField: 'email',
		passwordField: 'password',
	}
	, ((email, password, done) => {
		User.getUserByEmail(email, (err, user) => {
			if (err) return done(err);
			if (!user) {
				return done(null, false, { message: 'User account not found', code: 404 });
			}
			if (user.deletedAt) {
				return done(null, false, { message: 'Sorry, this account has been deleted, please contact us for more.', code: 403 });
			}
			if (!user.verified) {
				return done(null, false, { message: 'Account not yet verified, please check your email.', code: 403 });
			}

			return User.comparePassword(password, user.password, (err2, isMatch) => {
				if (err2) return done(err2);
				if (isMatch) {
					return done(null, user);
				}
				return done(null, false, { message: 'Incorrect email or password', code: 401 });
			});
		});
	}),
));

const whitelist = [
	'http://localhost:8080',
	'http://localhost:8081',
	'https://calabarmetro.com',
	'http://calabarmetro.com',
	'https://www.calabarmetro.com',
	'http://www.calabarmetro.com',
	'https://staging.calabarmetro.com',
	'http://staging.calabarmetro.com'
];
const corsOptions = {
	origin(origin, callback) {
		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else if (typeof origin === 'undefined') {
			callback(null, false);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	credentials: true
};

const port = process.env.NODE_ENV === 'production' ? process.env.API_PORT : process.env.STAGING_API_PORT;

const app = express();

// Express security
app.set('x-powered-by', false);
app.use(helmet());

// use other dependencies
app.use(cookieParser('Afr!ca Un!t3'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Validator
app.use(expressValidator());
app.use(cors(corsOptions));
app.use(morgan('dev'));

// Handle Sessions
const maxAge = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)); // 1 week
app.use(session({
	store: new FileStore({ path: './server/sessions', secret: 'Afr!ca Un!t3' }),
	secret: 'Afr!ca Un!t3',
	saveUninitialized: false,
	resave: false,
	cookie: {
		sameSite: false, maxAge
	}
}));

app.use(express.static(`${__dirname}/../static`));

// passport
app.use(passport.initialize());
app.use(passport.session());
app.use(fileUpload());

app.use('/api/v1', api);

// Send all other requests to the Angular app
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.use((req, res, next) => {
	res.locals.messages = messages(req, res);
	next();
});

console.error('Starting Server.');
app.listen(port);
console.log(`server now running on port ${port}`);
