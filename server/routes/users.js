const express = require('express');
const $http = require('axios/index');

const router = express.Router();
const response = require('../response');

const User = require('../models/user');
const Property = require('../models/property');

router.get('/users', (req, res) => {
	if (!req.isAuthenticated() || (req.isAuthenticated() && req.user.userType !== 0)) {
		return response.sendErrorResp(res, 401, 'Err', 'Unauthorised');
	}

	return User.getAllUsers((error, users) => {
		if (error) {
			console.warn(error);
			return response.sendErrorResp(res, 404, 'no_Users', "couldn't find any User.");
		}

		return response.sendSuccessResp(res, users);
	});
});

router.get('/heads', (req, res) => {
	if (!req.isAuthenticated() || (req.isAuthenticated() && req.user.userType !== 0)) {
		return response.sendErrorResp(res, 401, 'Err', 'Unauthorised');
	}

	return User.getAllHeads((error, heads) => {
		if (error) {
			console.warn(error);
			return response.sendErrorResp(res, 404, 'no_Admins', "couldn't find any Admin.");
		}

		return response.sendSuccessResp(res, heads);
	});
});

router.delete('/users/:_id', (req, res) => {
	const id = req.params._id;
	if (!req.isAuthenticated() || (req.isAuthenticated() && req.user.userType !== 0)) {
		return response.sendErrorResp(res, 401, 'Err', 'Unauthorised');
	}

	return User.update(
		{ _id: id },
		{ $set: { deletedAt: Date.now().valueOf(), deletedBy: req.user._id } },
		(error) => {
			if (error) {
				console.warn(error);
				return response.sendErrorResp(res, 404, 'no_user', "couldn't delete user.");
			}

			return Property.find({ user: id }, (err, properties) => {
				if (error) {
					console.warn(error);
					return response.sendErrorResp(res, 404, 'no_user', "couldn't fetch user properties.");
				}

				properties.forEach((property) => {
					$http.delete(`/properties/${property._id}`).then((resp) => {
						console.log(resp.data);
					}).catch((error2) => {
						console.warn(error2);
					});
				});

				return response.sendSuccessResp(res, { deletedAt: Date.now().valueOf() });
			});
		}
	);
});

router.patch('/users/:_id/restore', (req, res) => {
	const id = req.params._id;
	if (!req.isAuthenticated() || (req.isAuthenticated() && req.user.userType !== 0)) {
		return response.sendErrorResp(res, 401, 'Err', 'Unauthorised');
	}

	return User.update(
		{ _id: id },
		{ $set: { deletedAt: undefined, deletedBy: undefined } },
		(error) => {
			if (error) {
				console.warn(error);
				return response.sendErrorResp(res, 404, 'no_user', "couldn't restore user.");
			}

			return Property.find({ user: id }, (err, properties) => {
				if (error) {
					console.warn(error);
					return response.sendErrorResp(res, 404, 'no_user', "couldn't fetch user properties.");
				}

				properties.forEach((property) => {
					$http.patch(`/properties/${property._id}/restore`).then((resp) => {
						console.log(resp.data);
					}).catch((error2) => {
						console.warn(error2);
					});
				});

				return response.sendSuccessResp(res, {});
			});
		}
	);
});

module.exports = router;
