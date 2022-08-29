import Uppy from 'uppy';
import { scrollToEl, scrollToTop } from '../utils';

const API_URL = process.env.NODE_ENV === 'production' ? process.env.API_URL : process.env.STAGING_API_URL;

require('uppy/dist/uppy.css');

function addPropertyController($scope, $location, propertyProvider) {
	$scope.new_property = {
		type: '',
		price: '',
		city: '',
		location: '',
		address: '',
		contact: '',
		description: '',
		forSale: null,
		displayImage: '',
		galleryFiles: {}
	};
	$scope.add_property_error = '';
	$scope.image_count = 0;

	$scope.page_load_error = null;
	$scope.finished_loading = false;

	const uppy = Uppy.Core({
		autoProceed: false,
		restrictions: {
			maxFileSize: 2048000,
			maxNumberOfFiles: 10,
			minNumberOfFiles: 1,
			allowedFileTypes: ['image/*']
		}
	});
	uppy.use(Uppy.Dashboard, {
		trigger: '.UppyModalOpenerBtn',
		inline: true,
		target: '.DashboardContainer',
		replaceTargetContent: true,
		hideUploadButton: true,
		note: 'Images only, Max size of 2MB',
		maxHeight: 450,
		metaFields: [
			{ id: 'license', name: 'License', placeholder: 'specify license' },
			{ id: 'caption', name: 'Caption', placeholder: 'describe what the image is about' },
		],
	});
	uppy.use(Uppy.XHRUpload, {
		endpoint: `${API_URL}/api/v1/upload`,
		formData: true,
		fieldName: 'file'
	});

	uppy.on('file-added', (file) => {
		$scope.add_property_error = null;
		$scope.image_count += 1;
		if ($scope.image_count === 1) {
			$scope.new_property.displayImage = file.name;
		} else {
			$scope.new_property.galleryFiles[file.id] = file.name;
		}
	});

	uppy.on('file-removed', (file) => {
		$scope.image_count -= 1;
		delete $scope.new_property.galleryFiles[file.id];
	});

	uppy.run();

	$scope.addProperty = () => {
		if ($scope.image_count === 0) {
			($scope.add_property_error = 'Please, select property images');
			scrollToTop();
			return false;
		}

		if (!$scope.new_property.type) {
			$scope.add_property_error = 'Please choose a Property type';
			scrollToTop();
			return false;
		}

		if (!$scope.new_property.price) {
			($scope.add_property_error = 'Please specify price');
			scrollToTop();
			return false;
		}

		if (!$scope.new_property.city) {
			($scope.add_property_error = 'Please choose a city');
			scrollToTop();
			return false;
		}

		if (!$scope.new_property.location) {
			($scope.add_property_error = 'Please choose a Property location');
			scrollToTop();
			return false;
		}

		if (!$scope.new_property.address) {
			($scope.add_property_error = 'Enter Address');
			scrollToTop();
			return false;
		}

		if (!$scope.new_property.contact) {
			($scope.add_property_error = 'Enter Contact');
			scrollToTop();
			return false;
		}

		if (typeof $scope.new_property.forSale !== 'string') {
			($scope.add_property_error = 'Choose whether the property is for sale or for rent');
			scrollToTop();
			return false;
		}

		$('#add-property').button('loading');

		return propertyProvider.addProperty($scope.new_property, (err, property) => {
			if (err) {
				$scope.add_property_error = '';
				if (err.status === 400) {
					Object.keys(err.data.errors).forEach((error) => {
						$scope.add_property_error += `${err.data.errors[error]}\n`;
					});
				} else if (err.status === 403) {
					$scope.add_property_error = `(${err.data.error}) ${err.data.message}`;
				}
				scrollToEl('#content');
				$('#add-property').button('reset');
			} else {
				$scope.add_property_error = null;
				$scope.image_count = 0;
				$scope.propertyId = property._id;
				uppy.setMeta({ propertyId: $scope.propertyId, resize: 190 });

				uppy.upload().then((result) => {
					if (result.failed.length > 0) {
						console.error('Errors:');
						result.failed.forEach((file) => {
							console.error(file.error);
						});
					} else {
						uppy.reset();
						$scope.new_property = {
							type: '',
							price: '',
							location: '',
							address: '',
							contact: '',
							description: '',
							forSale: null,
							displayImage: '',
							galleryFiles: {}
						};
						$scope.$apply();
						$('#addproperty').modal('show');
					}
					$('#add-property').button('reset');
				});
			}
		});
	};

	$scope.viewProperty = () => {
		const modal = $('#addproperty');
		modal.modal('hide');
		modal.on('hidden.bs.modal', () => {
			$location.path(`/properties/${$scope.propertyId}`);
			$scope.$apply();
		});
	};
}

export default addPropertyController;
