'use strict';

/**
 * @ngdoc directive
 * @name arcwThemerApp.directive:jquislider
 * @description
 * # jquislider
 */
angular.module('arcwThemerApp')
	.directive("slider", function () {
		return {
			restrict: 'A',
			require: 'ngModel',
			scope: {
				ngModel: '=',
				bindAttr: '='
			},
			//template: '<span class="val"> {{ ngModel }}px </span>',

			link: function ($scope, elem, attr) {

				jQuery(elem).slider({
					range: false,
					value: $scope.$parent.$eval(attr.ngModel),
					min: elem.data('min') ? elem.data('min') : 0,
					max: elem.data('max') ? elem.data('max') : 0,
					step: elem.data('step') ? elem.data('step') : 1,
					slide: function (event, ui) {
						$scope.$apply(function () {
							$scope.ngModel = ui.value;
						});
					}
				});

				$scope.$parent.$watch(attr.ngModel, function (newValue, oldValue) {
					jQuery(elem).slider("value", newValue);
				});

			}
		}
	});
