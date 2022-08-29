const mongoose = require('mongoose');

const { Schema } = mongoose;

const FeedbackSchema = new Schema({
	name: String,
	title: String,
	message: String,
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
	email: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		validate: [
			{
				validator(email) {
					return email.length >= 6;
				},
				message: 'Length of Email is too short',
			},
			{
				validator(email) {
					return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(email);
				},
				message: 'Please, enter a valid email.',
			},
		],
	},
	deletedAt: Date,
	deletedBy: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', FeedbackSchema);

module.exports = Feedback;
