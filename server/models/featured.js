const mongoose = require('mongoose');

const { Schema } = mongoose;

const FeaturedSchema = new Schema({

	property: {
		type: Schema.Types.ObjectId,
		ref: 'Property',
		required: [true, 'Property Id is required'],
	},
	deletedAt: Date,
	deletedBy: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
}, { timestamps: true });

const Featured = mongoose.model('Featured', FeaturedSchema);

module.exports = Featured;
