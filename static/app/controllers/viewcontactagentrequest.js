/* eslint-disable max-len */
function viewContactAgentRequest($window, $scope, $http, $location, $routeParams, userProvider, contactAgentProvider) {
	$scope.finished_loading = false;
	$scope.page_load_error = null;
	$scope.user = userProvider.user;

	contactAgentProvider.getContactById($routeParams._id, (err, contactAgent) => {
		$scope.finished_loading = true;
		if (err) {
			$scope.page_load_error = `Unable to load contact request: ${JSON.stringify(err)}`;
		} else if (!contactAgent) {
			$location.path('/contact-requests');
		} else {
			$scope.contactagent = contactAgent;
		}
	});

	$scope.delete = (_id) => {
		const confirmed = $window.confirm('Are you sure you want to delete this contact Agent request?');
		if (confirmed) {
			contactAgentProvider.delete(_id, (err) => {
				$scope.finished_loading = true;
				if (err) {
					$scope.page_load_error = `Unable to delete contact request: ${JSON.stringify(err)}`;
				} else {
					$('#deletecontactrequest').modal('show');
				}
			});
		}
	};

	$('#deletecontactrequest').on('hidden.bs.modal', () => {
		$location.path('/contact-requests');
		$scope.$apply();
	});
}

export default viewContactAgentRequest;
