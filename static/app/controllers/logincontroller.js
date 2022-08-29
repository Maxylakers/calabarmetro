import { scrollToEl } from '../utils';

function loginController($scope, $location, $routeParams, $timeout, userProvider) {
	$scope.user = {};
	$scope.login_user_error = '';

	$scope.page_load_error = null;
	$scope.finished_loading = false;

	$scope.loginUser = () => {
		const { email, password } = $scope.user;
		if (!email) {
			$scope.login_user_error = 'Email is required';
			return false;
		}

		if (!password) {
			($scope.login_user_error = 'password is required');
			return false;
		}

		$('#login').button('loading');

		$scope.loading = true;
		return userProvider.loginUser({ email, password }, (err, data) => {
			if (err) {
				if (err.data && err.data.message) {
					$scope.login_user_error = err.data.message;
				}
			} else {
				$scope.login_user_error = null;
				$scope.login_user_success = true;
				localStorage.setItem('dashboard_url', data.redirect);
				localStorage.setItem('firstName', data.user.firstName);
				$timeout(() => {
					$location.path(data.redirect);
				}, 2000); // redirect after 2 seconds
			}
			$('#login').button('reset');
			$scope.loading = false;
			scrollToEl('#login-wrapper');
		});
	};

	$scope.sendPasswordEmail = () => {
		const { email } = $scope.user;
		if (!email) {
			$scope.reset_email_error = 'Email is required';
			return false;
		}

		$('#login').button('loading');

		$scope.loading = true;
		return userProvider.sendPasswordEmail({ email }, (err, data) => {
			if (err) {
				if (err.data && err.data.message) {
					$scope.reset_email_error = err.data.message;
				}
			} else {
				$scope.reset_email_success = data.sent;
				$scope.reset_email_error = null;
			}
			$('#login').button('reset');
			$scope.loading = false;
			scrollToEl('#login-wrapper');
		});
	};

	$scope.changePasswordEmail = () => {
		const { _id, token } = $routeParams;
		const { password, confirmPassword } = $scope.user;
		if (!_id) {
			$scope.change_password_error = 'Some required fields are missing';
			scrollToEl('#login-wrapper');
			return false;
		}
		if (!token) {
			$scope.change_password_error = 'Password reset token is required';
			scrollToEl('#login-wrapper');
			return false;
		}
		if (!password) {
			$scope.change_password_error = 'Password is required';
			scrollToEl('#login-wrapper');
			return false;
		}
		if (password.length < 6) {
			$scope.change_password_error = 'Password too short';
			scrollToEl('#login-wrapper');
			return false;
		}
		if (!confirmPassword) {
			$scope.change_password_error = 'Password confirmation is required';
			scrollToEl('#login-wrapper');
			return false;
		}
		if (confirmPassword !== password) {
			$scope.change_password_error = 'Password confirmation does not match';
			scrollToEl('#login-wrapper');
			return false;
		}

		$('#login').button('loading');

		$scope.loading = true;
		return userProvider.changePasswordEmail({ password, token, _id }, (err, data) => {
			if (err) {
				if (err.data && err.data.message) {
					$scope.change_password_error = err.data.message;
				}
			} else {
				$scope.change_password_success = data.changed;
				$scope.change_password_error = null;
			}
			$('#login').button('reset');
			$scope.loading = false;
			scrollToEl('#login-wrapper');
		});
	};
}

export default loginController;
