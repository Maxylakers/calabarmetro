function propertyProvider($http) {
	this.getAllProperties = (callback, options) => {
		let query = '';
		// pagination
		if (options && options.limit && options.page) {
			query = `?limit=${options.limit}&page=${options.page}`;
		}

		// search
		if (options && options.type) {
			query = query ? `${query}&type=${options.type}` : `?type=${options.type}`;
		}
		if (options && options.city) {
			query = query ? `${query}&city=${options.city}` : `?city=${options.city}`;
		}
		if (options && options.location) {
			query = query ? `${query}&location=${options.location}` : `?location=${options.location}`;
		}
		if (options && options.price) {
			query = query ? `${query}&price=${options.price}` : `?price=${options.price}`;
		}

		$http({ method: 'get', url: `/api/v1/properties${query}` })
			.then((response) => {
				callback(null, response.data);
			}, (response) => {
				callback(response);
			});
	};

	this.getUserProperties = (callback, options) => {
		let query = '';
		// pagination
		if (options && options.limit && options.page) {
			query = `?limit=${options.limit}&page=${options.page}`;
		}

		// search
		if (options && options.type) {
			query = query ? `${query}&type=${options.type}` : `?type=${options.type}`;
		}
		if (options && options.city) {
			query = query ? `${query}&city=${options.city}` : `?city=${options.city}`;
		}
		if (options && options.location) {
			query = query ? `${query}&location=${options.location}` : `?location=${options.location}`;
		}
		if (options && options.price) {
			query = query ? `${query}&price=${options.price}` : `?price=${options.price}`;
		}

		$http({ method: 'get', url: `/api/v1/my-account/properties${query}` })
			.then((response) => {
				callback(null, response.data);
			}, (response) => {
				callback(response);
			});
	};

	this.addProperty = (propertyData, callback) => {
		$http({ method: 'put', url: '/api/v1/properties', data: propertyData })
			.then((response) => {
				callback(null, response.data);
			}, (response) => {
				callback(response);
			});
	};

	this.delete = (_id, callback) => {
		$http({ method: 'delete', url: `/api/v1/properties/${_id}` })
			.then((response) => {
				callback(null, response.data);
			}, (response) => {
				callback(response);
			});
	};

	this.getPropertyById = (_id, callback) => {
		$http({ method: 'get', url: `/api/v1/properties/${_id}` })
			.then((response) => {
				callback(null, response.data);
			}, (response) => {
				callback(response);
			});
	};

	this.addFavourite = (_id, callback) => {
		$http({
			method: 'put',
			url: '/api/v1/favourite',
			data: { property: _id },
		})
			.then((response) => {
				callback(null, response.data);
			}, (response) => {
				callback(response);
			});
	};

	this.contactOwner = (_id, callback) => {
		$http({
			method: 'patch',
			url: '/api/v1/properties/contact',
			data: { _id },
		})
			.then((response) => {
				callback(null, response.data);
			}, (response) => {
				callback(response);
			});
	};

	this.addFeatured = (_id, callback) => {
		$http({
			method: 'put',
			url: '/api/v1/featured',
			data: { property_id: _id },
		})
			.then((response) => {
				callback(null, response.data);
			}, (response) => {
				callback(response);
			});
	};

	this.removeFeatured = (_id, callback) => {
		$http({ method: 'delete', url: `/api/v1/featured/${_id}`	})
			.then((response) => {
				callback(null, response.data);
			}, (response) => {
				callback(response);
			});
	};

	this.getAllFeatured = (callback) => {
		$http({ method: 'get', url: '/api/v1/featured' })
			.then((response) => {
				callback(null, response.data);
			}, (response) => {
				callback(response);
			});
	};

	this.getAllFavourites = (callback, options) => {
		let query = '';
		// pagination
		if (options && options.limit && options.page) {
			query = `?limit=${options.limit}&page=${options.page}`;
		}

		$http({ method: 'get', url: `/api/v1/favourites${query}` })
			.then((response) => {
				callback(null, response.data);
			}, (response) => {
				callback(response);
			});
	};
}

export default propertyProvider;
