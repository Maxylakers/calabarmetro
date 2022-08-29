// eslint-disable-next-line max-len
function viewFeedbackController($window, $scope, $http, $location, $routeParams, userProvider, feedbackProvider) {
	$scope.finished_loading = false;
	$scope.page_load_error = null;
	$scope.user = userProvider.user;

	feedbackProvider.getFeedbackById($routeParams._id, (err, feedback) => {
		$scope.finished_loading = true;
		if (err) {
			$scope.page_load_error = `Unable to load feedback: ${JSON.stringify(err)}`;
		} else if (!feedback) {
			$location.path('/feedbacks');
		} else {
			$scope.feedback = feedback;
		}
	});

	$scope.delete = (_id) => {
		const confirm = $window.confirm('Are you sure you want to delete this feedback?');
		if (confirm) {
			feedbackProvider.delete(_id, (err) => {
				$scope.finished_loading = true;
				if (err) {
					$scope.page_load_error = `Unable to delete feedback: ${JSON.stringify(err)}`;
				} else {
					$('#deletefeedback').modal('show');
				}
			});
		}
	};

	$('#deletefeedback').on('hidden.bs.modal', () => {
		$location.path('/feedbacks');
		$scope.$apply();
	});
}

export default viewFeedbackController;
