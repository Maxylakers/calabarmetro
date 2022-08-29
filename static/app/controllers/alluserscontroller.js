function allUsersController($window, $scope, userProvider) {
	$scope.users = [];
	$scope.heads = [];
	$scope.add_property_error = '';

	$scope.page_load_error = null;
	$scope.finished_loading = false;

	userProvider.getAllUsers((err, users) => {
		if (err) {
			$scope.page_load_error = err.message;
		} else {
			$scope.users = users;
		}
	});

	userProvider.getAllHeads((err, heads) => {
		if (err) {
			$scope.page_load_error = err.message;
		} else {
			$scope.heads = heads;
		}
	});

	$scope.deleteUser = (_id, index) => {
		const confirmed = $window.confirm('Are you sure you want to delete this users?');
		if (confirmed) {
			userProvider.delete(_id, (err, data) => {
				if (err) {
					$scope.page_load_error = err.message;
				} else {
					$scope.users[index].deletedAt = data.deletedAt;
				}
			});
		}
	};

	$scope.restoreUser = (_id, index) => {
		const confirmed = $window.confirm('Are you sure you want to restore this user?');
		if (confirmed) {
			userProvider.restore(_id, (err) => {
				if (err) {
					$scope.page_load_error = err.message;
				} else {
					$scope.users[index].deletedAt = undefined;
				}
			});
		}
	};

	$scope.deleteHead = (_id, index) => {
		const confirmed = $window.confirm('Are you sure you want to delete this admin?');
		if (confirmed) {
			userProvider.delete(_id, (err, data) => {
				if (err) {
					$scope.page_load_error = err.message;
				} else {
					$scope.heads[index].deletedAt = data.deletedAt;
				}
			});
		}
	};

	$scope.restoreHead = (_id, index) => {
		const confirmed = $window.confirm('Are you sure you want to restore this admin?');
		if (confirmed) {
			userProvider.restore(_id, (err) => {
				if (err) {
					$scope.page_load_error = err.message;
				} else {
					$scope.heads[index].deletedAt = undefined;
				}
			});
		}
	};
}

export default allUsersController;
