function allContactAgentsController($scope, contactAgentProvider) {
	$scope.contactagents = [];
	$scope.add_contactagent_error = '';

	$scope.page_load_error = null;
	$scope.finished_loading = false;

	contactAgentProvider.getAllContactAgents((err, contactAgents) => {
		$scope.finished_loading = true;
		if (err) {
			$scope.page_load_error = err.message;
		} else {
			$scope.contactagents = contactAgents;
		}
	});

	$scope.delete = (_id, index) => {
		contactAgentProvider.delete(_id, (err) => {
			$scope.finished_loading = true;
			if (err) {
				$scope.page_load_error = err.message;
			} else {
				$scope.contactagents.splice(index, 1);
			}
		});
	};
}

export default allContactAgentsController;
