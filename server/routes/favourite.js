const express = require('express');

const router = express.Router();
const response = require('../response');

const Favourite = require('../models/favourite');
const Property = require('../models/property');

router.put('/favourite', (req, res) => {
	if (!req.isAuthenticated()) {
		return response.sendErrorResp(res, 401, 'Err', 'Unauthorised');
	}
	const user = req.user._id;
	const { property } = req.body;

	try {
		if (!property) throw new Error('No Property');
	} catch (e) {
		return response.sendErrorResp(res, 400, e.message, 'You have clicked on an invalid property.');
	}

	return Favourite.findOne({ property, user, deletedAt: undefined }, (error, prop) => {
		if (prop) {
			return response.sendErrorResp(res, 400, 'favourite_exists', 'This property is already among your favourites');
		}
		const favourite = new Favourite({
			user,
			property
		});

		favourite.save((err) => {
			if (err) {
				console.log(err);
			} else {
				console.log('Successfully added to favourite');
				Property.update({ _id: property }, { $inc: { favouriteCount: 1 } }, () => {});
			}
		});

		return response.sendSuccessResp(res, favourite);
	});
});

router.get('/favourites', (req, res) => {
	const conditions = { deletedAt: undefined };
	const options = { limit: 20, sort: { _id: -1 } };
	if (!req.isAuthenticated()) {
		return response.sendErrorResp(res, 401, 'Err', 'Unauthorised');
	}
	conditions.user = req.user._id;

	if (req.query.limit) {
		options.limit = +req.query.limit <= 20 ? +req.query.limit : 20;
	}

	if (req.query.page) {
		options.page = +req.query.page;
	}

	return Favourite.paginate(conditions, options, (error, results) => {
		if (error) {
			console.warn(error);
			return response.sendErrorResp(res, 404, 'no_favorites', "couldn't find any favorite property.");
		}

		return Property.populate(results.docs, { path: 'property' }, (error2) => {
			if (error2) {
				console.warn(error2);
				return response.sendErrorResp(res, 404, 'no_property', "couldn't populate property");
			}

			return response.sendSuccessResp(res, results);
		});
	});
});

router.delete('/favourite/:_id', (req, res) => {
	const id = req.params._id;
	if (!req.isAuthenticated()) {
		return response.sendErrorResp(res, 401, 'Err', 'Unauthorised');
	}

	return Favourite.findOneAndUpdate(
		{ _id: id },
		{ $set: { deletedAt: Date.now().valueOf(), deletedBy: req.user._id } },
		{ new: true },
		(error, favourite) => {
			if (error) {
				console.warn(error);
				return response.sendErrorResp(res, 404, 'no_favourite', "couldn't remove favourite.");
			}
			Property.update({ _id: favourite.property }, { $inc: { favouriteCount: -1 } }, () => {});
			return response.sendSuccessResp(res, favourite);
		}
	);
});

module.exports = router;
