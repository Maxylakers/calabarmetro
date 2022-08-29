require('../../../css/properties.css');

function userPropertiesController($scope, propertyProvider, userProvider) {
	$scope.new_property = {};
	$scope.search = {
		type: '', city: '', location: '', price: ''
	};
	$scope.isSearch = false;
	$scope.add_property_error = '';
	$scope.user = userProvider.user;

	$scope.page_load_error = null;

	$scope.getProperties = (limit, page) => {
		$scope.finished_loading = false;
		propertyProvider.getUserProperties((err, results) => {
			$scope.isSearch = !!($scope.search.type ||
				$scope.search.city ||
				$scope.search.location ||
				$scope.search.price);
			$scope.finished_loading = true;
			if (err) {
				$scope.page_load_error = err.message;
			} else {
				$scope.properties = results.docs;
				$scope.limit = results.limit;
				$scope.total = results.total;
				$scope.page = results.page;
				$scope.pages = results.pages;
				$scope.all = [];
				for (let i = 0; i < $scope.pages;) {
					$scope.all.push(i);
					i += 1;
				}
				window.scroll({ top: 0, left: 0, behavior: 'smooth' });
			}
		}, Object.assign({}, { page, limit }, $scope.search));
	};

	$scope.getProperties();
}

export default userPropertiesController;
