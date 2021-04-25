'use strict';

/**
 * @ngdoc function
 * @name arcwThemerApp.controller:editorCtrl
 * @description
 * # editorCtrl
 * Controller of the arcwThemerApp
 */
angular.module('arcwThemerApp')
	.controller('editorCtrl', [
		'editor',
		'$rootScope',
		'$scope',
		'$timeout',
		function (editor, $rootScope, $scope, $timeout) {

			$rootScope.loaded = true;
			$scope.modalTitle = "generated";

			$scope.showMenu = false;
			$scope.showPostCount = true;
			$scope.menuDropShadow = true;

			$scope.currentYear = editor.currentYear;
			$scope.currentDate = editor.currentDate;
			$scope.currentMonth = editor.currentMonth;
			$scope.monthList = editor.monthList;
			$scope.hex2rgb = editor.hex2rgba;

			$scope.setDefaults = function () {
				$scope.setTheme(editor.theme);
			};

			$scope.setTheme = function (data) {
				data = editor.extend(data);
				$scope.theme = data.name;
				$scope.global = data.global;
				$scope.navigation = data.navigation;
				$scope.month = data.month;
				$scope.day = data.day;
				$scope.updateStyle();
			};

			$scope.setMenuShadow = function (newValue) {
				$scope.navigation.menu.shadowValue = (newValue.x ? newValue.x + 'px' : 0);
				$scope.navigation.menu.shadowValue += ' ' + (newValue.y ? newValue.y + 'px' : 0);
				$scope.navigation.menu.shadowValue += ' ' + (newValue.blur ? newValue.blur + 'px' : 0);
				$scope.navigation.menu.shadowValue += ' ' + (newValue.spread ? newValue.spread + 'px' : 0);
				$scope.navigation.menu.shadowValue += ' ' + newValue.color;
				$scope.updateStyle();
			};

			$scope.updateStyle = function () {
				$timeout(
					function () {
						jQuery('#style').html(jQuery('#css').text());
					}, 0
				);
			};

			$scope.updateStyle();


			/* CSS CHANGES WATCHERS */
			$scope.$watch('global', function () {
				$scope.updateStyle();
			}, true);
			$scope.$watch('navigation', function () {
				$scope.updateStyle();
			}, true);
			$scope.$watch('month', function () {
				$scope.updateStyle();
			}, true);
			$scope.$watch('day', function () {
				$scope.updateStyle();
			}, true);


			$scope.$watch('navigation.border', function (newValue) {
				$scope.navigation.borderBottom =
					$scope.navigation.borderTop =
						$scope.navigation.borderLeft = $scope.navigation.borderRight = newValue;
				$scope.updateStyle();
			});

			$scope.$watch('month.spacer', function (newValue) {
				$scope.month.spacerBottom =
					$scope.month.spacerRight = newValue;
				$scope.updateStyle();
			});


			$scope.$watch('menuDropShadow', function (newValue) {
				if (newValue == true) {
					$scope.setMenuShadow($scope.navigation.menu.shadow);
					return
				}
				$scope.navigation.menu.shadowValue = 'none';
				$scope.updateStyle();
			});
			$scope.$watch('navigation.menu.shadow', function (newValue) {
				$scope.setMenuShadow(newValue);
			}, true);

			$scope.$watch('navigation.menu.shadow.opacity', function (newValue) {
				var color = $scope.navigation.menu.shadow.hex;
				$scope.navigation.menu.shadow.color = editor.setRgba(color, newValue);
			});
			$scope.$watch('navigation.menu.shadow.hex', function (newValue) {
				var alpha = $scope.navigation.menu.shadow.opacity;
				$scope.navigation.menu.shadow.color = editor.setRgba(newValue, alpha);
			});


			$scope.openModal = function (selector, title) {
				var $modal = jQuery(selector);
				if (title)
					$modal.find('h4.modal-title').html(title);
				$modal.modal('show');
			};

			$scope.importCode = function (input) {
				var $txtarea = $('#import-code-text');
				var code = input || $txtarea.val(),
					json;
				try {
					json = window.atob(code);
				} catch (e) {
					console.log(e.code);
					$txtarea.val('Error: this is not a arcw theme or the code is not complete');
					json = '';
				}
				if (json != '')
					json = JSON.parse(json);

				if (json.navigation && json.day) {
					$scope.setTheme(json);
					$timeout(function () {
						jQuery('input.wp-color-picker').trigger('input').trigger('keyup');
					}, 0);
				}
			};

			$scope.openFileDialog = function () {
				var elem = document.getElementById('files');
				if(elem && document.createEvent) {
					var evt = document.createEvent("MouseEvents");
					evt.initEvent("click", true, false);
					elem.dispatchEvent(evt);
				}
			};

			function handleFileSelect(evt) {
				var files = evt.target.files; // FileList object

				// files is a FileList of File objects. List some properties.
				if (!files.length) {
					alert('Please select a file!');
					return;
				}

				var file = files[0];
				var start = 0;
				var stop = file.size - 1;

				var reader = new FileReader();

				// If we use onloadend, we need to check the readyState.
				reader.onloadend = function(evt) {
					if (evt.target.readyState == FileReader.DONE) { // DONE == 2
						$scope.importCode(evt.target.result);
					}
				};

				var blob = file.slice(start, stop + 1);
				reader.readAsBinaryString(blob);
			}

			document.getElementById('files').addEventListener('change', handleFileSelect, false);

			$scope.getCSS = function () {
				$scope.modalTitle = "Generated CSS";
				var modal = $('#generated-modal'),
					pre = modal.find('textarea');

				pre.html($('#style').html());
				modal.modal('show');
			};

			$scope.getCODE = function () {
				$scope.modalTitle = "Generated Theme CODE for later modifications";
				var modal = $('#generated-modal'),
					pre = modal.find('textarea'),
					data = {
						navigation: $scope.navigation,
						month: $scope.month,
						day: $scope.day
					};

				pre.html(window.btoa(JSON.stringify(data)));
				modal.modal('show');

			};

			$scope.saveCSS = function () {
				editor.saveData($('#style').html(), 'arcw-theme.css', true);
			};

			$scope.saveJSON = function () {
				var data = {
					navigation: $scope.navigation,
					month: $scope.month,
					day: $scope.day
				};
				editor.saveData(data, 'arcw-theme.arcw', false);
			};

			$timeout(function () {
				jQuery('input.wp-color-picker').trigger('input');
				/* PREVIEW CALENDAR MENU */
				var $calendarArchives = $('.calendar-archives');

				$calendarArchives.find('.arrow-down').on('click', function () {
					$(this).parent().children('.menu').show();
				});

				$calendarArchives.find('.menu')
					.mouseleave(function () {
						var menu = $(this);
						window.arctimer = setTimeout(
							function () {
								menu.parent().children('.menu').hide();
							},
							300
						);
					})
					.mouseenter(function () {
						if (window.arctimer) {
							clearTimeout(window.arctimer);
							window.arctimer = undefined;
						}
					});
			}, 1000);

			$scope.cal = editor.printMonth();

			$scope.setDefaults();

			$scope.reset = function () {
				$scope.setDefaults();
			}
		}
	]);
