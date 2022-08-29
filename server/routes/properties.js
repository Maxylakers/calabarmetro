const express = require('express'),
	fs = require('fs'),
	path = require('path'),
	// rimraf = require('rimraf'),
	resizeImg = require('resize-img');

const router = express.Router();
const Property = require('../models/property');
const Featured = require('../models/featured');
const Favourite = require('../models/favourite');
const response = require('../response');
// For add properties
router.put('/properties', (req, res) => {
	if (!req.isAuthenticated()) {
		return response.sendErrorResp(res, 401, 'Err', 'Unauthorised');
	}

	const {
		type, price, address, description, contact, city, location, displayImage, galleryFiles, forSale
	} = req.body;

	try {
		if (!type) throw new Error('missing_type');
		if (!price) throw new Error('missing_price');
		if (!address) throw new Error('missing_address');
		if (!description) throw new Error('missing_description');
		if (!contact) throw new Error('missing_contact');
		if (!city) throw new Error('missing_city');
		if (!location) throw new Error('missing_location');
		if (!displayImage) throw new Error('missing_display_image');
		if (!forSale) throw new Error('missing_for_sale');
	} catch (e) {
		return response.sendErrorResp(res, 400, e.message, 'You have entered an invalid property.');
	}

	const property = new Property({
		type,
		price,
		city,
		location,
		address,
		description,
		contact,
		user: req.user._id,
		forSale: Number(forSale) === 1
	});

	const uploadDir = `/static/img/uploads/property_images/${property._id}`;

	property.src = `${uploadDir}/${displayImage}`;

	Object.keys(galleryFiles).forEach(fileId => property.gallery.push(`${uploadDir}/${galleryFiles[fileId]}`));

	return property.save((err) => {
		if (err) {
			console.warn(err);
			if (err.name === 'ValidationError') {
				const errors = {};
				if (err.errors) {
					Object.keys(err.errors).forEach((error) => {
						errors[error] = err.errors[error].message;
					});
				}
				return res.status(400).json({ errors });
			}
			return response.sendErrorResp(res, 404, 'Err', "couldn't Create Property.");
		}
		return response.sendSuccessResp(res, property);
	});
});

router.delete('/properties/:_id', (req, res) => {
	const id = req.params._id;

	if (!req.isAuthenticated()) {
		return response.sendErrorResp(res, 401, 'Err', 'Unauthorised');
	}

	return Property.findOne({ _id: id }, (error, property) => {
		if (error) {
			return response.sendErrorResp(res, 404, 'not_found', "Couldn't find this property.");
		}
		if (req.user._id.equals(property.user) || req.user.userType === 0) {
			return Property.update(
				{ _id: id },
				{
					$set:
					{
						deletedAt: Date.now().valueOf(),
						deletedBy: req.user._id
					}
				},
				(error2, property2) => {
					if (error2) {
						console.log(error2);
						return response.sendErrorResp(res, 404, 'no_property', "couldn't delete property.");
					}

					// remove the property from featured list.
					Featured.update(
						{ property: id },
						{ $set: { deletedAt: Date.now().valueOf(), deletedBy: req.user._id } },
						{ multi: true },
						() => {
						}
					);

					// remove the property from favourites.
					Favourite.update(
						{ property: id },
						{ $set: { deletedAt: Date.now().valueOf(), deletedBy: req.user._id } },
						{ multi: true },
						() => {
						}
					);

					const filePath = process.env.NODE_ENV === 'production' ? 'server/static' : 'static';
					const imageDir = path.join(__dirname, `../../${filePath}/img/uploads/property_images/${id}`);
					// rimraf(imageDir, () => {}); // remove the property's images.
					if (fs.existsSync(imageDir)) {
						fs.renameSync(imageDir, `${imageDir}-deleted`);
					}
					return response.sendSuccessResp(res, property2);
				}
			);
		}

		return response.sendErrorResp(res, 401, 'Err', 'Unauthorised user');
	});
});

router.patch('/properties/:_id/restore', (req, res) => {
	const id = req.params._id;

	if (!req.isAuthenticated()) {
		return response.sendErrorResp(res, 401, 'Err', 'Unauthorised');
	}

	return Property.findOne({ _id: id }, (error, property) => {
		if (error) {
			return response.sendErrorResp(res, 404, 'not_found', "Couldn't find this property.");
		}
		if (req.user._id.equals(property.user) || req.user.userType === 0) {
			return Property.update(
				{ _id: id },
				{
					$set:
					{
						deletedAt: undefined,
						deletedBy: undefined
					}
				},
				(error2, property2) => {
					if (error2) {
						console.log(error2);
						return response.sendErrorResp(res, 404, 'no_property', "couldn't delete property.");
					}

					// remove the property from featured list.
					Featured.update(
						{ property: id },
						{ $set: { deletedAt: undefined, deletedBy: undefined } },
						{ multi: true },
						() => {
						}
					);

					// remove the property from favourites.
					Favourite.update(
						{ property: id },
						{ $set: { deletedAt: undefined, deletedBy: undefined } },
						{ multi: true },
						() => {
						}
					);

					const filePath = process.env.NODE_ENV === 'production' ? 'server/static' : 'static';
					const imageDir = path.join(__dirname, `../../${filePath}/img/uploads/property_images/${id}`);
					// rimraf(imageDir, () => {}); // remove the property's images.
					if (fs.existsSync(imageDir)) {
						fs.renameSync(`${imageDir}-deleted`, `${imageDir}`);
					}
					return response.sendSuccessResp(res, property2);
				}
			);
		}

		return response.sendErrorResp(res, 401, 'Err', 'Unauthorised user');
	});
});

router.delete('/node/properties/:_id', (req, res) => {
	const id = req.params._id;

	return Property.findOne({ _id: id, deletedAt: undefined }, (error) => {
		if (error) {
			return response.sendErrorResp(res, 404, 'not_found', "Couldn't find this property.");
		}
		return Property.update(
			{ _id: id },
			{
				$set:
					{
						deletedAt: Date.now().valueOf(),
						deletedBy: undefined
					}
			},
			(error2, property2) => {
				if (error2) {
					console.log(error2);
					return response.sendErrorResp(res, 404, 'no_property', "couldn't delete property.");
				}

				// remove the property from featured list.
				Featured.update(
					{ property: id, deletedAt: undefined },
					{ $set: { deletedAt: Date.now().valueOf(), deletedBy: undefined } },
					{ multi: true },
					() => {
					}
				);

				// remove the property from favourites.
				Favourite.update(
					{ property: id, deletedAt: undefined },
					{ $set: { deletedAt: Date.now().valueOf(), deletedBy: undefined } },
					{ multi: true },
					() => {
					}
				);

				const filePath = process.env.NODE_ENV === 'production' ? 'server/static' : 'static';
				const imageDir = path.join(__dirname, `../../${filePath}/img/uploads/property_images/${id}`);
				// rimraf(imageDir, () => {}); // remove the property's images.
				if (fs.existsSync(imageDir)) {
					fs.renameSync(imageDir, `${imageDir}-deleted`);
				}
				return response.sendSuccessResp(res, property2);
			}
		);
	});
});

router.patch('/node/properties/:_id/restore', (req, res) => {
	const id = req.params._id;

	return Property.findOne({
		_id: id,
		deletedAt: {
			$lte: Date.now().valueOf()
		},
		deletedBy: undefined
	}, (error) => {
		if (error) {
			return response.sendErrorResp(res, 404, 'not_found', "Couldn't find this property.");
		}
		return Property.update(
			{ _id: id },
			{
				$set:
					{
						deletedAt: undefined
					}
			},
			(error2, property2) => {
				if (error2) {
					console.log(error2);
					return response.sendErrorResp(res, 404, 'no_property', "couldn't delete property.");
				}

				// remove the property from featured list.
				Featured.update(
					{ property: id, deletedAt: { $lte: Date.now().valueOf() }, deletedBy: undefined },
					{ $set: { deletedAt: undefined } },
					{ multi: true },
					() => {
					}
				);

				// remove the property from favourites.
				Favourite.update(
					{ property: id, deletedAt: { $lte: Date.now().valueOf() }, deletedBy: undefined },
					{ $set: { deletedAt: undefined } },
					{ multi: true },
					() => {
					}
				);

				const filePath = process.env.NODE_ENV === 'production' ? 'server/static' : 'static';
				const imageDir = path.join(__dirname, `../../${filePath}/img/uploads/property_images/${id}`);
				// rimraf(imageDir, () => {}); // remove the property's images.
				if (fs.existsSync(imageDir)) {
					fs.renameSync(`${imageDir}-deleted`, `${imageDir}`);
				}
				return response.sendSuccessResp(res, property2);
			}
		);
	});
});

router.get('/properties', (req, res) => {
	const conditions = { deletedAt: undefined };
	const options = { limit: 20, sort: { _id: -1 } };

	if (req.query.limit) {
		options.limit = +req.query.limit <= 20 ? +req.query.limit : 20;
	}

	if (req.query.page) {
		options.page = +req.query.page;
	}

	if (req.query.type) {
		try {
			conditions.type = new RegExp(req.query.type, 'i');
		} catch (e) {
			conditions.type = req.query.type;
		}
		console.log(conditions.type);
	}

	if (req.query.city) {
		conditions.city = req.query.city;
	}

	if (req.query.location) {
		try {
			conditions.location = new RegExp(req.query.location, 'i');
		} catch (e) {
			conditions.location = req.query.location;
		}
	}

	if (req.query.price) {
		const range = req.query.price.split('-');
		conditions.price = { $gte: range[0], $lte: range[1] };
	}

	Property.paginate(conditions, options, (error, results) => {
		if (error) {
			console.warn(error);
			return response.sendErrorResp(res, 404, 'no_properties', "couldn't find any property.");
		}
		if (!req.isAuthenticated()) {
			// eslint-disable-next-line
			results.docs = results.docs.map((property) => {
				// eslint-disable-next-line
				property.contact = (property.contact && `${property.contact.slice(0, 2)}...${property.contact.slice(4, 6)}...`) || '';
				// eslint-disable-next-line
				property.address = (property.address && `${property.address.slice(0, 5)}...`) || '';
				// eslint-disable-next-line
				property.description = (property.description && `${property.description.slice(0, 5)}...`) || '';
				return property;
			});
		}
		return response.sendSuccessResp(res, results);
	});
});

router.get('/my-account/properties', (req, res) => {
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

	if (req.query.type) {
		try {
			conditions.type = new RegExp(req.query.type, 'i');
		} catch (e) {
			conditions.type = req.query.type;
		}
	}

	if (req.query.city) {
		conditions.city = req.query.city;
	}

	if (req.query.location) {
		try {
			conditions.location = new RegExp(req.query.location, 'i');
		} catch (e) {
			conditions.location = req.query.location;
		}
	}

	if (req.query.price) {
		const range = req.query.price.split('-');
		conditions.price = { $gte: range[0], $lte: range[1] };
	}

	return Property.paginate(conditions, options, (error, results) => {
		if (error) {
			console.warn(error);
			return response.sendErrorResp(res, 404, 'no_properties', "couldn't find any property.");
		}
		return response.sendSuccessResp(res, results);
	});
});

router.get('/properties/:_id', (req, res) => {
	const id = req.params._id;
	Property.findOne({ _id: id, deletedAt: undefined }, (error, property) => {
		if (error) {
			console.warn(error);
			return response.sendErrorResp(res, 404, 'no_property', "couldn't find a property with the given property_id.");
		}
		if (req.isAuthenticated() && req.user._id.equals(property.user)) {
			property.isMine = true; // eslint-disable-line
			return response.sendSuccessResp(res, property);
		}
		return Property.findOneAndUpdate(
			{ _id: id }, { $inc: { viewCount: 1 } },
			{ new: true }, (err, updatedProperty) => {
				if (err) {
					console.warn(err);
					// eslint-disable-next-line
					property.viewCount += 1;
					return response.sendSuccessResp(res, property);
				}
				if (!req.isAuthenticated()) {
					// eslint-disable-next-line
					updatedProperty.contact = (updatedProperty.contact && `${updatedProperty.contact.slice(0, 2)}...${updatedProperty.contact.slice(4, 6)}...`) || '';
					// eslint-disable-next-line
					updatedProperty.address = (updatedProperty.address && `${updatedProperty.address.slice(0, 5)}...`) || '';
					// eslint-disable-next-line
					updatedProperty.description = (updatedProperty.description && `${updatedProperty.description.slice(0, 5)}...`) || '';
				}
				return response.sendSuccessResp(res, updatedProperty);
			}
		);
	});
});

router.patch('/properties/contact', (req, res) => {
	const id = req.body._id;
	Property.findOneAndUpdate({ _id: id }, { $inc: { contactCount: 1 } }, { new: true }, (err) => {
		if (err) {
			console.warn(err);
			return response.sendErrorResp(res, 404, 'no_property', "couldn't find a property with the given property_id.");
		}
		return response.sendSuccessResp(res, { contacted: true });
	});
});

router.post('/upload', (req, res) => {
	if (!req.files) {
		return res.status(400).send('No files were uploaded.');
	}

	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
	const { file } = req.files;

	const filePath = process.env.NODE_ENV === 'production' ? 'server/static' : 'static';
	const imageDir = path.join(__dirname, `../../${filePath}/img/uploads/property_images/${req.body.propertyId}`);

	if (!fs.existsSync(path.join(__dirname, `../../${filePath}/img/uploads`))) {
		fs.mkdirSync(path.join(__dirname, `../../${filePath}/img/uploads`));
	}
	if (!fs.existsSync(path.join(__dirname, `../../${filePath}/img/uploads/property_images`))) {
		fs.mkdirSync(path.join(__dirname, `../../${filePath}/img/uploads/property_images`));
	}
	if (!fs.existsSync(imageDir)) {
		fs.mkdirSync(imageDir);
	}
	const image = path.join(imageDir, file.name);

	// Use the mv() method to place the file somewhere on your server
	return file.mv(image, (err) => {
		if (err) {
			return res.status(500).send(err);
		}

		resizeImg(fs.readFileSync(image), { width: 230, height: 230 }).then((buf) => {
			fs.writeFileSync(image, buf);
		});

		return res.send({ success: true });
	});
});

module.exports = router;
