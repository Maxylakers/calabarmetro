function handlerController($scope, propertyProvider) {
	$scope.new_property = {};
	$scope.handler_property_error = '';
	$scope.firstName = localStorage.getItem('firstName');

	$scope.page_load_error = null;
	$scope.finished_loading = false;

	propertyProvider.getAllProperties((err, properties) => {
		$scope.finished_loading = true;
		if (err) {
			$scope.page_load_error = err.message;
		} else {
			$scope.properties = properties;
		}
	});
}
export default handlerController;
