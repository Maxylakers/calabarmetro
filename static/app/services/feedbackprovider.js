function feedbackProvider($http) {
	this.getAllFeedbacks = (callback) => {
		$http({ method: 'get', url: '/api/v1/feedbacks' })
			.then((response) => {
				callback(null, response.data);
			}, (response) => {
				callback(response);
			});
	};

	this.addFeedback = (feedbackData, callback) => {
		$http({ method: 'put', url: '/api/v1/feedbacks', data: feedbackData })
			.then((response) => {
				callback(null, response.data);
			}, (response) => {
				callback(response);
			});
	};

	this.delete = (_id, callback) => {
		$http({ method: 'delete', url: `/api/v1/feedbacks/${_id}` })
			.then((response) => {
				callback(null, response.data);
			}, (response) => {
				callback(response);
			});
	};

	this.getFeedbackById = (_id, callback) => {
		$http({ method: 'get', url: `/api/v1/feedbacks/${_id}` })
			.then((response) => {
				callback(null, response.data);
			}, (response) => {
				callback(response);
			});
	};
}

export default feedbackProvider;
