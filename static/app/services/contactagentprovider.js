function contactAgentProvider($http) {
	this.getAllContactAgents = (callback) => {
		$http({ method: 'get', url: '/api/v1/contactagents' })
			.then((response) => {
				callback(null, response.data);
			}, (response) => {
				callback(response);
			});
	};

	this.addContactAgents = (contactAgentData, callback) => {
		$http({
			method: 'put',
			url: '/api/v1/contactagents',
			data: contactAgentData,
		})
			.then((response) => {
				callback(null, response.data);
			}, (response) => {
				callback(response);
			});
	};

	this.delete = (_id, callback) => {
		$http({ method: 'delete', url: `/api/v1/contactagents/${_id}` })
			.then((response) => {
				callback(null, response.data);
			}, (response) => {
				callback(response);
			});
	};

	this.getContactById = (_id, callback) => {
		$http({ method: 'get', url: `/api/v1/contactagents/${_id}` })
			.then((response) => {
				callback(null, response.data);
			}, (response) => {
				callback(response);
			});
	};
}

export default contactAgentProvider;
