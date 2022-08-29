const mongoose = require('mongoose');
const paginate = require('mongoose-paginate');

const { Schema } = mongoose;

const FavouriteSchema = new Schema({
	property: {
		type: Schema.Types.ObjectId,
		ref: 'Property',
		required: [true, 'Property Id is required'],
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
	}
}, { timestamps: true });

FavouriteSchema.plugin(paginate);
const Favourite = mongoose.model('Favourite', FavouriteSchema);

module.exports = Favourite;
