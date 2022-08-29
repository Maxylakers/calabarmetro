const express = require('express');

const router = express.Router();

const Feedback = require('../models/feedback');
const response = require('../response');

router.put('/feedbacks', (req, res) => {
	const {
		name, title, message, contact, email,
	} = req.body;

	try {
		if (!name) throw new Error('missing_name');
		if (!title) throw new Error('missing_title');
		if (!contact) throw new Error('missing_contact');
		if (!email) throw new Error('missing_message');
		if (!message) throw new Error('missing_email');
	} catch (e) {
		return response.sendErrorResp(res, 400, e.message, 'feedback information is invalid.');
	}

	const feedback = new Feedback({
		name,
		title,
		message,
		contact,
		email,
	});

	return feedback.save((err) => {
		if (err) {
			console.warn(err);
			return response.sendErrorResp(res, 404, 'Err', "couldn't save feedback.");
		}
		console.log('feedback sent successfully');
		return response.sendSuccessResp(res, feedback);
	});
});

router.get('/feedbacks', (req, res) => {
	const conditions = { deletedAt: undefined };
	if (req.isAuthenticated() && req.user.userType === 1) {
		conditions.user = req.user._id;
	}

	Feedback.find(conditions, (error, feedbacks) => {
		if (error) {
			console.warn(error);
			return response.sendErrorResp(res, 404, 'no_feedbacks', "couldn't find any Feedback.");
		}

		return response.sendSuccessResp(res, feedbacks);
	});
});

router.get('/feedbacks/:_id', (req, res) => {
	Feedback.findOne({ _id: req.params._id, deletedAt: undefined }, (error, feedback) => {
		if (error) {
			console.warn(error);
			return response.sendErrorResp(res, 404, 'no_feedback', "couldn't find a feedback with the given feedback_id.");
		}

		return response.sendSuccessResp(res, feedback);
	});
});

router.delete('/feedbacks/:_id', (req, res) => {
	const id = req.params._id;
	if (!req.isAuthenticated()) {
		return response.sendErrorResp(res, 401, 'Err', 'Unauthorised');
	}

	return Feedback.update(
		{ _id: id },
		{ $set: { deletedAt: Date.now().valueOf(), deletedBy: req.user._id } },
		(error, feedback) => {
			if (error) {
				console.warn(error);
				return response.sendErrorResp(res, 404, 'no_feedback', "couldn't delete feedback.");
			}

			return response.sendSuccessResp(res, feedback);
		}
	);
});

module.exports = router;
