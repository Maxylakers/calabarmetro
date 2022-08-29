// global $
function addFeedbackController($scope, $location, feedbackProvider) {
	$scope.new_feedback = {};
	$scope.add_feedback_error = '';

	$scope.page_load_error = null;
	$scope.finished_loading = false;

	$scope.addFeedback = (feedbackData) => {
		if (!feedbackData.name) {
			$scope.add_feedback_error = 'Please Enter Your Name';
			return false;
		}

		if (!feedbackData.title) {
			($scope.add_feedback_error = 'Please Enter a Title for Your Message');
			return false;
		}

		if (!feedbackData.message) {
			($scope.add_feedback_error = ' Enter Your Message');
			return false;
		}
		if (!feedbackData.contact) {
			($scope.add_feedback_error = ' Enter Your Contact');
			return false;
		}

		if (!feedbackData.email) {
			($scope.add_feedback_error = ' Enter Your Email');
			return false;
		}

		return feedbackProvider.addFeedback(feedbackData, (err) => {
			if (err) {
				$scope.add_feedback_error = `(${err.data.error}) ${err.data.message}`;
			} else {
				$scope.add_feedback_error = null;
				$scope.add_feedback_success = true;
				$scope.email = $scope.new_feedback.email;
				$scope.new_feedback = {};
				const modal = $('#sendfeedback');
				modal.modal('show');
				modal.on('hidden.bs.modal', () => {
					$location.path('/');
					$scope.$apply();
				});
			}
		});
	};
}

export default addFeedbackController;
