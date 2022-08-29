const mongoose = require('mongoose');

const { Schema } = mongoose;
const paginate = require('mongoose-paginate');

const PropertySchema = new Schema({
	type: String,
	price: Number,
	viewCount: {
		type: Number,
		default: 0
	},
	favouriteCount: {
		type: Number,
		default: 0
	},
	contactCount: {
		type: Number,
		default: 0
	},
	city: String,
	location: String,
	address: {
		type: String,
		required: true,
		validate: [
			{
				validator(address) {
					return address && (address.length > 5);
				},
				message: 'Please, enter a valid address.',
			},
		],

	},
	src: String,
	gallery: Array,
	description: String,
	contact: {
		type: String,
		required: true,
		validate: [
			{
				validator(phone) {
					return /^[+]?[(]?[0-9]{1,3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,7}$/gm.test(phone);
				},
				message: 'Please, enter a valid phone number.',
			},
		],

	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'User Id is required'],
	},
	deletedAt: Date,
	deletedBy: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	forSale: {
		type: Boolean,
		default: false
	},
	isMine: {
		type: Boolean,
		default: false
	},
	isFeatured: {
		type: Boolean,
		default: false
	},
	featuredId: {
		type: Schema.Types.ObjectId,
		ref: 'Featured'
	}
}, { timestamps: true });

PropertySchema.plugin(paginate);
const Property = mongoose.model('Property', PropertySchema);

module.exports = Property;
