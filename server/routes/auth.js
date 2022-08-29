const express = require('express');
const passport = require('passport');
const sgMail = require('@sendgrid/mail');
const response = require('../response');
const User = require('../models/user');
const { verifyEmail, passwordResetEmail, passwordChangeEmail } = require('../templates/email');

const router = express.Router();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


router.post(
	'/login',
	(req, res, next) => {
		passport.authenticate('local', (error, user, info) => {
			if (error) {
				return next(error);
			}
			if (!user) {
				return response.sendErrorResp(res, info.code, 'unauthorized', info.message);
			}
			return req.logIn(user, (err) => {
				if (err) {
					return next(error);
				}
				return response.sendSuccessResp(res, {
					user: {
						email: user.email,
						firstName: user.firstName,
						_id: user._id
					},
					redirect: user.userType === 0 ? '/my-account/head' : '/properties',
					authenticated: true
				});
			});
		})(req, res, next);
	},
);

router.post('/password-reset-email', (req, res) => {
	const { email } = req.body;

	try {
		if (!email) throw new Error('missing_email');
	} catch (e) {
		return response.sendErrorResp(res, 400, e.message, 'Email is required.');
	}

	return User.findOne({ email }, (error, user) => {
		if (!user) {
			return response.sendErrorResp(res, 404, 'not_found', "Sorry, we couldn't find a user with this email.");
		}

		return User.createPasswordResetToken(user, (error2, updatedUser) => {
			if (error2) {
				return response.sendErrorResp(res, 403, 'Err', 'An error prevented us from sending password reset link, please try again later.');
			}
			const data = {
				from: 'CalabarMetro <support@calabarmetro.com>',
				to: email,
				subject: 'Password reset - CalabarMetro',
				html: passwordResetEmail(user.firstName, updatedUser.password_reset_token, user._id)
			};
			return sgMail.send(data, (err) => {
				if (err) {
					return response.sendErrorResp(res, 403, 'Err', "couldn't send password reset email.");
				}
				return response.sendSuccessResp(res, { email, sent: true });
			});
		});
	});
});

router.post('/reset-password', (req, res) => {
	const { _id, token, password } = req.body;

	try {
		if (!_id) throw new Error('missing_id');
		if (!token) throw new Error('missing_token');
		if (!password) throw new Error('missing_password');
	} catch (e) {
		return response.sendErrorResp(res, 400, e.message, 'ID, password, and password reset token are required.');
	}

	return User.findOne({ _id }, (error, user) => {
		if (!user) {
			return response.sendErrorResp(res, 404, 'not_found', "Sorry, we couldn't find this user.");
		}

		if (!user.password_reset_token) {
			return response.sendErrorResp(res, 404, 'not_found', 'Sorry, this password reset link has expired.');
		}

		if (user.password_reset_token !== token) {
			return response.sendErrorResp(res, 404, 'not_found', 'Sorry, password reset token mismatch.');
		}

		user.password = password; // eslint-disable-line
		user.password_reset_token = null; // eslint-disable-line
		return user.save((error2, updatedUser) => {
			if (error2) {
				return response.sendErrorResp(res, 403, 'Err', 'An error prevented us from changing your password, please try again later.');
			}
			const data = {
				from: 'CalabarMetro <support@calabarmetro.com>',
				to: user.email,
				subject: 'Password succesfully changed - CalabarMetro',
				html: passwordChangeEmail(updatedUser.firstName)
			};
			return sgMail.send(data, (err) => {
				if (err) {
					console.log('Err', "couldn't send password change email.");
				}
				return response.sendSuccessResp(res, { changed: true });
			});
		});
	});
});

router.put('/signup', (req, res) => {
	const {
		firstName, lastName, email, password, phoneNumber,
	} = req.body;

	try {
		if (!firstName) throw new Error('missing_firstName');
		if (!lastName) throw new Error('missing_lastName');
		if (!email) throw new Error('missing_email');
		if (!password) throw new Error('missing_password');
		if (!phoneNumber) throw new Error('missing_phoneNumber');
	} catch (e) {
		return response.sendErrorResp(res, 400, e.message, 'User information is invalid.');
	}

	const user = {
		firstName,
		lastName,
		email,
		password,
		phoneNumber
	};

	return User.create(user, (err, result) => {
		if (err) {
			const errors = {};
			if (err.code === 11000) {
				errors.email = 'An account with this email already exits.';
				return res.status(400).json({ errors });
			} else if (err.name === 'ValidationError') {
				if (err.errors) {
					Object.keys(err.errors).forEach((error) => {
						errors[error] = err.errors[error].message;
					});
				}
				return res.status(400).json({ errors });
			}
			return response.sendErrorResp(res, 403, 'Err', "couldn't Create Your account.");
		}
		const data = {
			from: 'CalabarMetro <support@calabarmetro.com>',
			to: email,
			subject: 'Welcome - CalabarMetro',
			html: verifyEmail(user.firstName, result._id)
		};
		return sgMail.send(data, (err2) => {
			let message = 'Verification email sent successfully, please check your email to activate your account.';
			if (err2) {
				message = "Couldn't send account verification email, Contact Us with your registered email.";
			}
			return response.sendSuccessResp(res, { created: true, message });
		});
	});
});

router.post('/verify-email', (req, res) => {
	const { _id } = req.body;

	try {
		if (!_id) throw new Error('missing_id');
	} catch (e) {
		return response.sendErrorResp(res, 400, e.message, 'Activation token is required.');
	}

	return User.findOne({ _id }, (error, user) => {
		if (!user) {
			return response.sendErrorResp(res, 404, 'not_found', "Sorry, we couldn't find this user.");
		}

		if (user.verified) {
			return response.sendErrorResp(res, 400, 'not_found', 'Sorry, this account is already verified.');
		}

		user.verified = true; // eslint-disable-line
		return user.save((error2) => {
			if (error2) {
				return response.sendErrorResp(res, 403, 'Err', 'An error prevented us from verifying your account, please try again later.');
			}
			return response.sendSuccessResp(res, { verified: true });
		});
	});
});

router.get('/logout', (req, res) => {
	req.logout();
	req.session.destroy(() => {
		res.status(200).json({
			status: 'Bye!',
		});
	});
});

router.get('/confirm-login', (req, res) => {
	res.send({ user: req.user });
});

router.get('/status', (req, res) => {
	if (!req.isAuthenticated()) {
		return res.status(200).json({
			status: false,
		});
	}

	const user = { _id: req.user._id, firstName: req.user.firstName, role: req.user.userType };

	return res.status(200).json({
		status: true,
		user,
	});
});

module.exports = router;
