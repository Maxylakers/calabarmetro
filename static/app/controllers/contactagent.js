function contactAgentController($scope, $location, contactAgentProvider) {
	$scope.new_contactagent = {};
	$scope.add_contactagent_error = '';

	$scope.page_load_error = null;
	$scope.finished_loading = false;

	$scope.addContactAgents = (contactAgentData) => {
		if (!contactAgentData.name) {
			$scope.add_contactagent_error = 'Please Enter Your Name';
			return false;
		}

		if (!contactAgentData.location) {
			($scope.add_contactagent_error = 'Please Enter your location');
			return false;
		}

		if (!contactAgentData.message) {
			($scope.add_contactagent_error = ' Please describe reason for contacting Agent');
			return false;
		}

		if (!contactAgentData.contact) {
			($scope.add_contactagent_error = ' Enter Your Contact');
			return false;
		}

		if (!contactAgentData.email) {
			($scope.add_contactagent_error = ' Enter Your Email');
			return false;
		}

		return contactAgentProvider.addContactAgents(contactAgentData, (err, contactAgent) => {
			if (err) {
				$scope.add_contactagent_error = `(${err.data.error}) ${err.data.message}`;
			} else {
				$scope.add_contactagent_error = null;
				$scope.add_contactagent_success = true;
				$scope.email = $scope.new_contactagent.email;
				$scope.new_contactagent = {};
				const sendRequestModal = $('#sendrequest');
				sendRequestModal.modal('show');
				sendRequestModal.on('hidden.bs.modal', () => {
					$location.path('/');
					$scope.$apply();
				});

				$scope.contactagentId = contactAgent._id;
			}
		});
	};
}

export default contactAgentController;
