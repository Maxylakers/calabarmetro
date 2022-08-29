/* eslint-disable max-len */
function viewPropertyController($window, $scope, $http, $location, $routeParams, userProvider, propertyProvider) {
	$scope.finished_loading = false;
	$scope.page_load_error = null;
	$scope.failed_error = null;

	$scope.user = userProvider.user;

	propertyProvider.getPropertyById($routeParams._id, (err, property) => {
		$scope.finished_loading = true;
		if (err) {
			if (err.status === 401) {
				$scope.page_load_error = 'Sorry, you are not authorised to perform this operation';
			} else {
				$scope.page_load_error = 'Unable to load property';
			}
		} else if (!property) {
			$location.path('/properties');
		} else {
			$scope.property = property;
		}
	});

	$scope.delete = (_id) => {
		const confirmed = $window.confirm('Are you sure you want to delete this property?');
		if (confirmed) {
			propertyProvider.delete(_id, (err) => {
				if (err) {
					if (err.status === 401) {
						$scope.page_load_error = 'Sorry, you are not authorised to perform this operation';
					} else {
						$scope.page_load_error = 'Unable to delete property';
					}
				} else {
					$('#deleteproperty').modal('show');
				}
			});
		}
	};

	$scope.addFeatured = (_id) => {
		const confirmed = $window.confirm('Are you sure you want to add this property to featured?');
		if (confirmed) {
			propertyProvider.addFeatured(_id, (err, featured) => {
				if (err) {
					if (err.status === 401) {
						$scope.page_load_error = 'Sorry, you are not authorised to perform this operation';
					} else {
						$scope.page_load_error = 'Unable to add property to featured properties';
					}
				} else {
					$scope.property.isFeatured = true;
					$scope.property.featuredId = featured._id;
					$('#addfeatured').modal('show');
				}
			});
		}
	};

	$scope.removeFeatured = (_id) => {
		const confirmed = $window.confirm('Are you sure you want to remove this property from featured?');
		if (confirmed) {
			propertyProvider.removeFeatured(_id, (err) => {
				if (err) {
					if (err.status === 401) {
						$scope.page_load_error = 'Sorry, you are not authorised to perform this operation';
					} else {
						$scope.page_load_error = 'Unable to delete featured property';
					}
				} else {
					$scope.property.isFeatured = false;
					$scope.property.featuredId = undefined;
					$('#removefeatured').modal('show');
				}
			});
		}
	};

	$scope.addFavourite = (_id) => {
		propertyProvider.addFavourite(_id, (err) => {
			if (err) {
				if (err.status === 401) {
					$scope.page_load_error = 'Sorry, you are not authorised to perform this operation';
				} else if (err.status === 400) {
					$scope.failed_error = err.data.message;
					$('#failed').modal('show');
				} else {
					$scope.page_load_error = 'Unable to add property to favourite properties';
				}
			} else {
				$scope.property.isFavorite = true;
				$scope.property.favouriteCount += 1;
				$('#addfavorite').modal('show');
			}
		});
	};

	$scope.contactOwner = (_id) => {
		propertyProvider.contactOwner(_id, () => {});
	};

	$scope.loginUser = (e) => {
		e.preventDefault();
		$('#viewcontact').modal('hide');
		$('#viewcontact').on('hidden.bs.modal', () => {
			$location.path('/login');
			$scope.$apply();
		});
	};


	$('#deleteproperty').on('hidden.bs.modal', () => {
		$location.path('/properties');
		$scope.$apply();
	});
}

export default viewPropertyController;
