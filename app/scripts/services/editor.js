'use strict';

/**
 * @ngdoc service
 * @name arcwThemerApp.editor
 * @description
 * # editor
 * Service in the arcwThemerApp.
 */
angular.module('arcwThemerApp')
	.service('editor', function () {
		var monthList = [
			'january',
			'february',
			'march',
			'aplril',
			'may',
			'june',
			'july',
			'august',
			'september',
			'october',
			'november',
			'december'
		];

		var today = new Date();

		return {

			monthList: monthList,

			theme: {

				name: 'arw-theme1',

				global: {
					color: '#FFFFFF',
					fontSize: 13,
					preview: '#FFFFFF'
				},

				navigation: {
					height: 30,

					marginTop: 0,
					marginRight: 0,
					marginBottom: 1,
					marginLeft: 0,

					borderRadius: 0,
					borderColor: '#4e4e4e',

					border: 0,
					borderTop: 0,
					borderRight: 0,
					borderBottom: 0,
					borderLeft: 0,

					color: '#FFFFFF',
					fontSize: 13,

					background: '#4e4e4e',

					button: {
						width: 32,
						color: '',
						fontSize: 15,
						border: '',
						borderRadius: '',
						borderColor: '#FFFFFF',
						borderWidth: 1,
						background: 'none',
						hover: {
							background: '#707070',
							color: '#FFFFFF'
						},
						disabled: {
							opacity: 40
						}
					},

					arrow: {
						width: 24,
						borderWidth: 1,
						borderColor: '#4e4e4e',
						active: {
							borderColor: '#4e4e4e',
							background: '#707070'
						},
						hover: {
							borderColor: '#FFFFFF',
							background: '#909090'
						}
					},

					menu: {
						background: "#FFFFFF",
						color: "#7e7e7e",
						a: {
							hover: {
								background: '#7e7e7e',
								color: '#FFFFFF'
							},
							selected: {
								background: '#7e7e7e',
								color: '#FFFFFF'
							}
						},
						shadow: {
							x: 0,
							y: 0,
							blur: 10,
							spread: 0,
							hex: '#000000',
							color: '#000000',
							opacity: 100
						},
						shadowValue: ''
					}
				},

				month: {
					calBg: '#FFFFFF',
					sepBorderColor: '#FFFFFF',
					spacer: 0,
					spacerBottom: 0,
					spacerRight: 0,

					weekdays: {
						background: '#7e7e7e',
						height: 22,
						marginBottom: 1,
						color: '#FFFFFF',
						fontSize: 11,
						bold: false
					},

					background: "#f0f0f0",
					color: "#CCCCCC",
					borderRadius: 0,
					height: 50,
					haspost: {
						background: "#707070",
						color: "#FFFFFF",
						hoverbg: "#4E4E4E",
						hoverColor: "#FFFFFF"
					},
					empty: {
						postcount: {
							display: true,
							color: '#CCCCCC'
						}
					},
					name: {
						fontSize: 16,
						x: 8,
						y: 6
					},
					postcount: {
						x: 6,
						y: 6,
						xFrom: 'right',
						yFrom: 'bottom',
						color: '#FFFFFF',
						hoverColor: '#FFFFFF',
						number: {
							fontSize: 14
						},
						text: {
							display: true,
							fontSize: 9
						}
					}
				},

				day: {
					height: 25,
					fontSize: 14,
					fontWeight: 'normal',
					haspost: {
						fontWeight: 'normal'
					},
					today: {
						border: 3,
						borderColor: '#f0ad4e'
					}
				}
			},

			extend: function (theme) {
				return $.extend({}, this.theme, theme);
			},

			init: function () {
				var self = this;
				console.log(today);
				self.printMonth();
			},

			currentYear: today.getFullYear(),
			currentDate: today.getDate(),
			currentMonth: today.getMonth(),

			monthStart: function () {
				var self = this,
					tmp = new Date(self.currentYear, self.currentMonth, 1);
				return tmp.getDay();
			},

			getMonthDays: function () {
				var self = this;
				var month = self.currentMonth + 1,
					year = self.currentYear;
				switch (month) {
					case 4:
					case 6:
					case 9:
					case 11:
						return 30;
					case 2:
						return (year % 400 == 0 || ( year % 100 != 0 && year % 4 == 0 )) ? 29 : 28;
					default:
						return 31;
				}
			},

			printMonth: function () {
				var self = this;
				var k = 0,
					j = 1, // 1 = monday => first day of week
					postDays = [],
					month = [],
					week = [];

				var monthdays = self.getMonthDays();
				var dposts = Math.floor(Math.random() * 11) + 6;

				for (var i = 0; i < dposts; i++) {
					var ranDay = Math.floor(Math.random() * monthdays) + 1;
					postDays.push(ranDay);
				}

				while (j != self.monthStart()) {
					k++;
					week.push({
						date: '&nbsp;',
						noday: true,
						last: k % 7 == 0,
					});
					j++;
					if (j == 7)
						j = 0;
				}

				for (j = 1; j <= monthdays; j++) {
					k++;

					if (postDays.indexOf(k) != -1)
						week.push({
							date: j,
							noday: false,
							last: k % 7 == 0,
							today: j == self.currentDate,
							posts: true,
							link: '<a href="#">' + j + '</a>'
						});
					else
						week.push({
							date: j,
							noday: false,
							last: k % 7 == 0,
							today: j == self.currentDate
						});

					if (k % 7 == 0) {
						month.push(week);
						week = [];
					}
				}

				while (k < 42) {
					k++;
					week.push({
						date: '&nbsp;',
						noday: true,
						last: k % 7 == 0
					});
					if (k % 7 == 0) {
						month.push(week);
						week = [];
					}
				}
				return month;
			},

			hex2rgba: function (hex) {
				var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
				return result ? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16)
				} : null;
			},

			setRgba: function (hex, alpha) {
				var self = this;
				if (alpha == 100)
					return hex;

				var rgb = self.hex2rgba(hex);
				return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + alpha / 100 + ')';
			},

			saveData: function (data, fileName, css) {
				//a.style = "display: none";
				var a = document.createElement("a");
				document.body.appendChild(a);
				console.log('plop');
				var json = !css ? window.btoa(JSON.stringify(data)) : data,
					blob = new Blob([json], {type: "octet/stream"}),
					url = window.URL.createObjectURL(blob);
				a.href = url;
				a.download = fileName;
				a.click();
				window.URL.revokeObjectURL(url);
			},

			importTheme: function (file) {
				console.log(file);
			}


		};

	});