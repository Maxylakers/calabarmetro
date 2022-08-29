import { scrollToEl } from '../utils';

function signupController($scope, $routeParams, userProvider) {
	$scope.new_user = {};
	$scope.add_user_error = '';
	$scope.add_user_success = false;
	$scope.errors = {};

	$scope.page_load_error = null;
	$scope.finished_loading = false;

	$scope.addUser = () => {
		const {
			firstName, lastName, email, password, password2, phoneNumber
		} = $scope.new_user;
		$scope.errors = {};
		$scope.add_user_error = '';
		if (!firstName) {
			$scope.errors.firstName = 'Please enter your firstName';
			scrollToEl('#form-wrapper');
			return false;
		}

		if (!lastName) {
			($scope.errors.lastName = 'Please enter your last name');
			scrollToEl('#first-name-wrapper');
			return false;
		}

		if (!email) {
			($scope.errors.email = 'Enter your email address');
			scrollToEl('#last-name-wrapper');
			return false;
		}

		if (!password) {
			($scope.errors.password = 'Enter your password');
			scrollToEl('#email-wrapper');
			return false;
		}

		if (password.length < 6) {
			($scope.errors.password = 'Password too short');
			scrollToEl('#email-wrapper');
			return false;
		}

		if (!password2) {
			($scope.errors.password2 = 'Enter re-enter your password for validation');
			scrollToEl('#email-wrapper');
			return false;
		}

		if (password !== password2) {
			($scope.errors.password = 'Password does not match!');
			scrollToEl('#email-wrapper');
			return false;
		}

		if (!phoneNumber) {
			($scope.errors.phoneNumber = 'Enter your phone number');
			scrollToEl('#password-wrapper');
			return false;
		}
		$('#signUp').button('loading');
		$scope.loading = true;
		return userProvider.addUser($scope.new_user, (err, data) => {
			if (err) {
				if (err.status === 400) {
					Object.keys(err.data.errors).forEach((error) => {
						$scope.add_user_error += `${err.data.errors[error]}\n`;
						$scope.errors[error] = err.data.errors[error];
					});
				} else if (err.status === 403) {
					$scope.add_user_error = `(${err.data.error}) ${err.data.message}`;
				}
				scrollToEl('#content');
			} else {
				$scope.add_user_error = null;
				$scope.add_user_success = true;
				$scope.new_user = {};
				$scope.message = data.message;
				const singUpModal = $('#signupUser');
				singUpModal.modal('show');
			}
			$('#signUp').button('reset');
			$scope.loading = false;
		});
	};

	$scope.verifyEmail = () => {
		const { _id } = $routeParams;
		if (!_id) {
			$scope.verification_error = 'Some required fields are missing';
			scrollToEl('#login-wrapper');
			return false;
		}

		$scope.loading = true;
		return userProvider.verifyEmail({ _id }, (err, data) => {
			if (err) {
				if (err.data && err.data.message) {
					$scope.verification_error = err.data.message;
				}
			} else {
				$scope.verification_success = data.verified;
				$scope.verification_error = null;
			}
			$scope.loading = false;
			scrollToEl('#login-wrapper');
		});
	};

	$(() => {
		$('[data-toggle="popover"]').popover({ trigger: 'focus', animation: false });
	});
}

export default signupController;
