function userProvider($http) {
	const self = this;
	self.user = null;

	this.addUser = (userData, callback) => {
		$http({ method: 'put', url: '/api/v1/signup', data: userData })
			.then((response) => {
				callback(null, response.data);
			}, (response) => {
				callback(response);
			});
	};

	this.verifyEmail = (data, callback) => {
		$http({
			method: 'post', url: '/api/v1/verify-email', data
		})
			.then((response) => {
				callback(null, response.data);
			}, (response) => {
				callback(response);
			});
	};

	this.loginUser = (userData, callback) => {
		$http({
			method: 'post', url: '/api/v1/login', data: userData
		})
			.then((response) => {
				callback(null, response.data);
			}, (response) => {
				callback(response);
			});
	};

	this.sendPasswordEmail = (data, callback) => {
		$http({
			method: 'post', url: '/api/v1/password-reset-email', data
		})
			.then((response) => {
				callback(null, response.data);
			}, (response) => {
				callback(response);
			});
	};

	this.changePasswordEmail = (data, callback) => {
		$http({
			method: 'post', url: '/api/v1/reset-password', data
		})
			.then((response) => {
				callback(null, response.data);
			}, (response) => {
				callback(response);
			});
	};

	this.logout = (callback) => {
		$http({
			method: 'get', url: '/api/v1/logout'
		})
			.then((response) => {
				callback(null, response.data);
				self.user = null;
			}, (response) => {
				callback(response);
			});
	};

	this.isLoggedIn = () => !!self.user;

	this.getUserStatus = () => $http({
		method: 'get',
		url: '/api/v1/status'
	}).then((response) => {
		if (response.data.status) {
			self.user = response.data.user;
			return true;
		}
		self.user = null;
		return false;
	}, () => {
		self.user = null;
		return false;
	});


	this.getAllUsers = callback => $http({ method: 'get', url: '/api/v1/users' })
		.then((response) => {
			callback(null, response.data);
		}, (response) => {
			callback(response);
		});

	this.getAllHeads = callback => $http({ method: 'get', url: '/api/v1/heads' })
		.then((response) => {
			callback(null, response.data);
		}, (response) => {
			callback(response);
		});

	this.delete = (_id, callback) => {
		$http({ method: 'delete', url: `/api/v1/users/${_id}` })
			.then((response) => {
				callback(null, response.data);
			}, (response) => {
				callback(response);
			});
	};

	this.restore = (_id, callback) => {
		$http({ method: 'patch', url: `/api/v1/users/${_id}/restore` })
			.then((response) => {
				callback(null, response.data);
			}, (response) => {
				callback(response);
			});
	};

	// send a get request to the server
	this.logout = callback => $http({ method: 'get', url: '/api/v1/logout' })
		.then(
			// handle success
			(response) => {
				self.user = null;
				callback(null, response.data);
			},
			// handle error
			(response) => {
				self.user = null;
				callback(response);
			},
		);
}

export default userProvider;
