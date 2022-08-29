function allFeedbackController($scope, feedbackProvider) {
	$scope.feedbacks = [];
	$scope.add_property_error = '';

	$scope.page_load_error = null;
	$scope.finished_loading = false;

	feedbackProvider.getAllFeedbacks((err, feedbacks) => {
		$scope.finished_loading = true;
		if (err) {
			$scope.page_load_error = err.message;
		} else {
			$scope.feedbacks = feedbacks;
		}
	});

	$scope.delete = (_id, index) => {
		feedbackProvider.delete(_id, (err) => {
			$scope.finished_loading = true;
			if (err) {
				$scope.page_load_error = err.message;
			} else {
				$scope.feedbacks.splice(index, 1);
			}
		});
	};
}
export default allFeedbackController;
