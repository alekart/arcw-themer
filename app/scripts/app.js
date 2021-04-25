'use strict';

/**
 * @ngdoc overview
 * @name arcwThemerApp
 * @description
 * # arcwThemerApp
 *
 * Main module of the application.
 */

angular
	.module('arcwThemerApp', [
		'ngAnimate',
		'ngCookies',
		'ngResource',
		'ngRoute',
		'ngSanitize'
	])
	.config(function () {

	}).run([
		'$rootScope',
		function ($rootScope) {
			$rootScope.beta = 'beta';
			$rootScope.version = '0.3.5';

			if (typeof adson === 'undefined') {
				$rootScope.adBlock = true;
			}
		}
	]);

