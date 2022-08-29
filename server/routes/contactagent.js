const express = require('express');

const router = express.Router();

const ContactAgent = require('../models/contactagent');
const response = require('../response');

router.put('/contactagents', (req, res) => {
	const {
		name, location, message, contact, email,
	} = req.body;

	try {
		if (!name) throw new Error('missing_name');
		if (!location) throw new Error('missing_location');
		if (!message) throw new Error('missing_email');
		if (!contact) throw new Error('missing_contact');
		if (!email) throw new Error('missing_message');
	} catch (e) {
		return response.sendErrorResp(res, 400, e.message, 'contactAgent infomation is invalid.');
	}

	const contactAgent = new ContactAgent({
		name,
		location,
		message,
		contact,
		email,
	});

	return contactAgent.save((err) => {
		if (err) {
			return response.sendErrorResp(res, 404, 'Err', "couldn't save request to contact agent.");
		}
		return response.sendSuccessResp(res, contactAgent);
	});
});

router.get('/contactagents', (req, res) => {
	const conditions = { deletedAt: undefined };
	if (req.isAuthenticated() && req.user.userType === 1) {
		conditions.user = req.user._id;
	}

	ContactAgent.find(conditions, (error, contactAgents) => {
		if (error) {
			return response.sendErrorResp(res, 404, 'no_request_to_contact_agents', "couldn't find any request to contact agent.");
		}

		return response.sendSuccessResp(res, contactAgents);
	});
});

router.get('/contactagents/:_id', (req, res) => {
	ContactAgent.findOne({ _id: req.params._id, deletedAt: undefined }, (error, contactAgent) => {
		if (error) {
			console.warn(error);
			return response.sendErrorResp(res, 404, 'no_request_to_contact_agent', "couldn't find a request to contact agent with the given contactagent_id.");
		}

		return response.sendSuccessResp(res, contactAgent);
	});
});

router.delete('/contactagents/:_id', (req, res) => {
	const id = req.params._id;
	if (!req.isAuthenticated()) {
		return response.sendErrorResp(res, 401, 'Err', 'Unauthorised');
	}

	return ContactAgent.update(
		{ _id: id },
		{ $set: { deletedAt: Date.now().valueOf(), deletedBy: req.user._id } },
		(error, contactAgent) => {
			if (error) {
				console.warn(error);
				return response.sendErrorResp(res, 404, 'no_contactagent', "couldn't remove contact request.");
			}

			return response.sendSuccessResp(res, contactAgent);
		}
	);
});

module.exports = router;
