const express = require('express');

const router = express.Router();
const response = require('../response');

const Featured = require('../models/featured');
const Property = require('../models/property');

router.put('/featured', (req, res) => {
	try {
		if (!req.body.property_id) throw new Error('No Property');
	} catch (e) {
		return response.sendErrorResp(res, 400, e.message, 'You have clicked on an invalid property.');
	}

	const featured = new Featured({
		property: req.body.property_id,
	});

	return featured.save((err) => {
		if (err) {
			console.log(err);
			return response.sendErrorResp(res, 404, 'Err', 'Could not add featured property');
		}
		console.log('Successfully added to featured');
		Property.update({ _id: req.body.property_id }, {
			$set: { isFeatured: true, featuredId: featured._id }
		})
			.then((err2) => {
				if (err2) {
					console.log(err2);
				} else {
					console.log('Successfully set the property as featured');
				}
			});
		return response.sendSuccessResp(res, featured);
	});
});

router.get('/featured', (req, res) => {
	Featured.find({ deletedAt: undefined })
		.populate('property')
		.exec((error, featured) => {
			if (error) {
				console.warn(error);
				return response.sendErrorResp(res, 404, 'no_property', 'couldn\'t find any featured property');
			}

			return response.sendSuccessResp(res, featured);
		});
});

router.delete('/featured/:_id', (req, res) => {
	const id = req.params._id;
	if (!req.isAuthenticated()) {
		return response.sendErrorResp(res, 401, 'Err', 'Unauthorised');
	}

	return Featured.findById(id, (error, featured) => {
		if (error) {
			console.warn(error);
			return response.sendErrorResp(res, 404, 'no_featured', 'couldn\'t find featured property.');
		}
		return Featured.update(
			{ _id: id },
			{ $set: { deletedAt: Date.now().valueOf(), deletedBy: req.user._id } },
			(err) => {
				if (err) {
					console.warn(err);
					return response.sendErrorResp(res, 404, 'no_featured', 'couldn\'t remove featured.');
				}

				const propertyId = featured.property;
				Property.update({ _id: propertyId }, { $set: { isFeatured: false, featuredId: undefined } })
					.then((err2) => {
						if (err2) {
							console.log(err2);
						} else {
							console.log('Successfully removed the property from featured');
						}
					});

				return response.sendSuccessResp(res, featured);
			}
		);
	});
});

module.exports = router;
