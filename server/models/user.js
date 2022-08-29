/* eslint-disable no-empty-pattern */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: {
		type: String,
		required: true,
		unique: [
			true,
			'An account already exits with this email.',
		],
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
	password: {
		type: String,
		required: [
			true,
			'Please a password is required.',
		],
		validate: [
			{
				validator(password) {
					return password.length >= 6;
				},
				message: 'Please a password greater than 6 characters is required',
			},
		],
	},
	phoneNumber: {
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
	userType: {
		type: Number,
		default: 1
	},
	password_reset_token: { type: String, default: null },
	verified: { type: Boolean, default: false },
	deletedAt: Date,
	deletedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
}, { timestamps: true });

function preSave(next) {
	const user = this;

	if (!user.isModified('password')) {
		return next();
	}

	return bcrypt.genSalt(10, (err, salt) => {
		if (err) return next(err);

		return bcrypt.hash(user.password, salt, (err2, hash) => {
			if (err2) return next(err2);

			user.password = hash;
			return next();
		});
	});
}

UserSchema.pre('save', preSave);

const User = mongoose.model('User', UserSchema);

User.getUserById = (id, callback) => {
	User.findOne({ _id: id, deletedAt: undefined }, callback);
};

User.getUserByEmail = (email, callback) => {
	const query = { email };
	User.findOne(query, callback);
};

User.getAllUsers = (callback) => {
	const query = 'firstName lastName email createdAt userType updatedAt deletedAt';
	User.find({ userType: { $gt: 0 } }, query, callback);
};

User.getAllHeads = (callback) => {
	const query = 'firstName lastName email createdAt updatedAt deletedAt';
	User.find({ userType: 0 }, query, callback);
};

User.comparePassword = (candidatePassword, hash, callback) => {
	bcrypt.compare(candidatePassword, hash).then((isMatch) => {
		callback(null, isMatch);
	});
};

User.createUser = (user, callback) => {
	bcrypt.genSalt(10).then((err, salt) => {
		bcrypt.hash(user.password, salt).then((hash) => {
			user.password = hash; // eslint-disable-line
			user.save(callback);
		});
	});
};

User.createPasswordResetToken = (user, callback) => {
	crypto.randomBytes(24, (err, buf) => {
		if (err) throw err;
		user.password_reset_token = buf.toString('hex'); // eslint-disable-line
		user.save(callback);
	});
};

module.exports = User;
