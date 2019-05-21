/**
 * Admin module to manage Holidays calendar
 *
 * @author Edward J Morales
 */
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.admin.holidays", {}, {
	/*
	 *   Returns the widget name
	 */
	getWidgetName: function() {
		return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_HOLIDAYS;
	},


	init: function(workportalFacade, dataService, params) {
		var self = this;
		self.holidaysObj = {
			calendarSelector: null,
			activeCalendar: "",
			schemas: [],
			schema: {},
			holidays: {},
			holidaysInServer: {}
		};

		// Call base
		self._super(workportalFacade, dataService, params);

		//Load templates
		self.loadTemplates({
			"admin.holidays": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.holidays").concat("#ui-bizagi-workportal-widget-admin-holidays"),
			"admin.holidays.calendar.schema": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.holidays").concat("#ui-bizagi-workportal-widget-admin-holidays-calendar-schema"),
			useNewEngine: false
		});
	},

	/*
	 *   Renders the content for the current controller
	 */
	renderContent: function() {
		var self = this;
		var template = self.getTemplate("admin.holidays");

		var content = self.content = $.tmpl(template);

		return content;
	},

	postRender: function() {
		var self = this;

		$.when(self.dataService.getHolidaysSchemas()).done(function(holidays) {
			self.holidaysObj.schemas = holidays;

			$.each(holidays, function(key, value) {
				self.holidaysObj.schema[value.id] = {};
			});
			self.renderHolidaysSchema(holidays);
		}).fail(function(e) {
			console.log("ERROR", e);
		});
	},

	/**
	 * Get schemas Object
	 * @param holidays
	 * @return {["guid": {} ]}
	 * @private
	 */
	_getSchemas: function(holidays) {
		holidays = holidays || [];
		var result = {};

		$.each(holidays, function(key, value) {
			result[value.id] = value;
		});
		return result;
	},

	/**
	 * Get days by schema
	 * @param guidSchema
	 * @param schemaObj
	 * @return [{guid:"", displayName:"", dates:[]}]
	 * @private
	 */
	_getDaysBySchema: function(guidSchema, schemaObj) {
		guidSchema = guidSchema || "";
		schemaObj = schemaObj || {};
		// Just if in the near future schemaObj change and its necessary apply a different algorithm
		return schemaObj[guidSchema] || [];
	},

	_calendarHasChanges: function() {
		var self = this;
		var isModified = false;
		if(self.holidaysObj.activeCalendar != "" && self.holidaysObj.schema[self.holidaysObj.activeCalendar].modified) {
			isModified = true;
		}
		return isModified;
	},

	_getChanges: function(schema) {
		var self = this;
		var deleted = [];
		var added = [];
		var actually = [];

		if(!schema) {
			return;
		}

		/**
		 *
		 * @param dateObj {date:{}, description:""}
		 * @return {*}
		 * @private
		 */
		var _convertObjToShortFormat = function(dateObj) {
			var result;
			if(dateObj.date.length == 19) {
				result = dateObj;
			} else {
				var dateArr = dateObj.date.split("T");
				var date = new Date(dateObj.date);
				dateObj.date = $.datepicker.formatDate("yy-mm-ddT00:00:00", date);
				result = dateObj;
			}
			return result;
		};

		var _searchDateInSchema = function(dateObj, schemaObj) {
			var result = -1;
			dateObj = dateObj || new Date();

			$.each(schemaObj, function(key, value) {
				if(new Date(value.date).getTime() == dateObj.getTime()) {
					result = key;
				}
			});
			return result;
		};

		var _getChanges = function(datesObjA, datesObjB, matchAction) {
			var primaryAction = (matchAction == "add") ? added : deleted;
			var inverseAction = (matchAction == "add") ? deleted : added;
			$.each(datesObjA, function(key, value) {
				var searchIndex = _searchDateInSchema(new Date(value.date), datesObjB);
				// Check if its a new date
				if(searchIndex >= 0) {
					var searchInActuallySchemaIndex = _searchDateInSchema(new Date(value.date), actually);
					if(searchInActuallySchemaIndex == -1) {
						actually.push(value);
					}

					// Date does not change, check description
					if(datesObjB[searchIndex].description != value.description) {
						var searchInSchemaToSaveIndex = _searchDateInSchema(new Date(datesObjB[searchIndex].date), inverseAction);
						if(searchInSchemaToSaveIndex == -1) {
							inverseAction.push(_convertObjToShortFormat(datesObjB[searchIndex]));
							primaryAction.push(_convertObjToShortFormat(value));
						}
					}
				} else {
					var convertedObj = _convertObjToShortFormat(value);
					primaryAction.push(convertedObj);
					actually.push(convertedObj);
				}
			});
		};
		_getChanges(self.holidaysObj.holidays[schema], self.holidaysObj.holidaysInServer[schema], "add");
		_getChanges(self.holidaysObj.holidaysInServer[schema], self.holidaysObj.holidays[schema], "delete");

		return {delete: deleted, add: added, actually: actually};
	},

	saveSchema: function(schema) {
		var self = this;
		var content = self.getContent();
		var $messageContainer = $(".bz-ui-save-status", content);

		$.when(self._saveSchema(schema)).done(function() {
			self.showSuccess(bizagi.localization.getResource("workportal-general-success"), $messageContainer);
		}).fail(function(error) {
			self.showError(bizagi.localization.getResource("workportal-general-error")+ " : "+ error.toString(), $messageContainer);
		})
	},

	_saveSchema: function(schema) {
		var self = this;
		var changes = self._getChanges(schema);
		var def = new $.Deferred();
		var data = {
			add: changes.add,
			delete: changes.delete
		};

		self.holidaysObj.calendarSelector.startLoading({
			overlay: true
		});
		$.when(self.dataService.saveHolidaysBySchema({
			schema: schema,
			data: JSON.encode(data)
		})).done(function(response) {
			self._resetSchemaChanges(schema);
			setTimeout(function() {
				self._changeSchema(schema);
				self.holidaysObj.calendarSelector.endLoading();
				def.resolve();
			}, 1000);
		}).fail(function(e) {
			self.holidaysObj.calendarSelector.endLoading();
			def.reject(e.toString());
		});
		return def.promise();
	},

	showError: function(error, $messageContainer) {
		var $message = '<i class="bz-icon bz-icon-error"></i>&nbsp; Error:' + error;
		$messageContainer.empty();
		$messageContainer.show();
		$messageContainer.removeClass("status-success");
		$messageContainer.addClass("status-error");
		$messageContainer.html($message);
	},

	showSuccess: function(success, $messageContainer) {
		var $message = '<i class="bz-icon bz-icon-test"></i>&nbsp;' + success;
		$messageContainer.empty();
		$messageContainer.show();
		$messageContainer.removeClass("status-error");
		$messageContainer.addClass("status-success");
		$messageContainer.html($message);
		window.setTimeout(function() {
			$messageContainer.fadeOut(600);
		}, 5000);
	},

	_resetSchemaChanges: function(schema) {
		if(schema) {
			var self = this;
			self.holidaysObj.schema[schema].modified = false;
			self.holidaysObj.holidays[schema] = {};
		}
	},


	renderHolidaysSchema: function(holidaysObj) {
		holidaysObj = holidaysObj || [];
		var self = this;
		var template = self.getTemplate("admin.holidays.calendar.schema");
		var content = self.getContent();
		var schemas = self._getSchemas(holidaysObj);

		var result = $.tmpl(template, {"schemas": schemas});
		self.holidaysObj.calendarSelector = $("#biz-wp-admin-holidays-calendar", result);

		$("#biz-wp-admin-holidays-schemas").append(result);

		self.holidaysSchemaHandlers();
		self.renderHolidaysCalendar();
		$("[name='save']", result).on("click", function() {
			if(self._calendarHasChanges()) {
				self.saveSchema(self.holidaysObj.activeCalendar);
			}
		});

		$("[name='cancel']", result).on("click", function() {
			self.params.dialogBox.dialog("close");
		});

		$("button", result).button();
	},

	_changeSchema: function(schema) {
		var self = this;
		self.holidaysObj.activeCalendar = schema;
		if(schema == "") {
			self.renderHolidaysCalendar();
		} else {
			self.holidaysObj.calendarSelector.startLoading();
			$.when(self.dataService.getHolidaysBySchema({"schema": schema})).done(function(data) {
				self.holidaysObj.holidaysInServer[schema] = JSON.parse(JSON.encode(data));
				self.holidaysObj.holidays[schema] = data;
				self.renderHolidaysCalendar({
					dates: self.holidaysObj.holidays[schema] || []
				});
			}).always(function() {
				self.holidaysObj.calendarSelector.endLoading();
			});
		}
	},

	holidaysSchemaHandlers: function() {
		var self = this;
		var $schemaSelector = $("#biz-wp-admin-holidays-schemas select");

		$schemaSelector.change(function(e) {
			self.holidays = [];
			var schema = e.currentTarget.value;

			if(self._calendarHasChanges()) {
				$.when(bizagi.showSaveBox(self.getResource("confirmation-savebox-message1"), self.getResource("confirmation-box-title"), "warning")).done(function() {
					$.when(self.saveSchema(self.holidaysObj.activeCalendar)).done(function(data) {
						self._changeSchema(schema);
					});
				}).fail(function(params) {
					self._resetSchemaChanges(self.holidaysObj.activeCalendar);
					self._changeSchema(schema);
				});
			} else {
				self._changeSchema(schema);
			}

		});
	},

	renderHolidaysCalendar: function(params) {
		params = params || {};
		var self = this;
		var content = self.getContent();
		var dates = params.dates || [];
		var calendar = $("#biz-wp-admin-holidays-calendar", content);
		var currentYear = new Date().getFullYear();
		//var selector = params.selector || $("#biz-wp-admin-holidays-calendar");
		var datePickerOptions = params.datePickerOptions || {};
		var _datePickerOptions = $.extend({
			minDate: "-5y",
			maxDate: "+10y",
			stepMonths: 12,
			numberOfMonths: [3, 4],
			defaultDate: "1/1/" + currentYear,
			onSelect: function(dateText, inst) {
				_addOrRemoveDate(dateText);
			},
			beforeShowDay: function(date) {
				// Calendar without schema
				if(self.holidaysObj && self.holidaysObj.activeCalendar == "") {
					return [false, "ui-datepicker-notselected"];
				}

				var today = new Date();
				var foundDate = _findDate(date);
				var enabled = ( today.getTime() > new Date(date).getTime()) ? false : true;
				if(foundDate.position > -1) {
					return [enabled, "ui-datepicker-selected", foundDate.description]
				} else {
					return [enabled, "ui-datepicker-notselected", "no selected"];
				}
			}
		}, datePickerOptions);

		var _findDate = function(date) {
			var result = {position: -1, description: ""};
			var formatDate = "yy/mm/dd";
			for(var i = 0, l = dates.length; i < l; i++) {
				var dateArr = dates[i].date.split("T");
				var convertedDate = dateArr[0].replace(/-/g, "/");
				if($.datepicker.formatDate(formatDate, new Date(date)) == $.datepicker.formatDate(formatDate, new Date(convertedDate))) {
					result.position = i;
					result.description = dates[i].description;
				}
			}
			return result;
		};

		var _addDate = function(dateObj) {
			dateObj.date = new Date(dateObj.date);
			dateObj.date.setHours(0);
			dateObj.date.setMinutes(0);
			dateObj.date.setSeconds(0);
			dateObj.date = dateObj.date.toISOString();

			dates.push(dateObj);
		};

		var _removeDate = function(index) {
			dates.splice(index, 1);
		};

		// Adds a date if we don't have it yet, else remove it
		var _addOrRemoveDate = function(date) {
			var foundDate = _findDate(date);
			if(foundDate.position > -1) {
				_removeDate(foundDate.position);
			} else {

				_addDate({date: date, description: ""});
			}
			self.holidaysObj.schema[self.holidaysObj.activeCalendar].modified = true;
		};

		// Destroy previous calendar
		if(self.holidaysObj.calendarSelector.data("datepicker")) {
			self.holidaysObj.calendarSelector.datepicker("destroy");
		}

		self.holidaysObj.calendarSelector.datepicker(_datePickerOptions);

		$("td.ui-datepicker-notselected", calendar).tooltip();
	},

	_showNotification: function(title, message, notificationType) {
		var self = this;
		var notification = new NotificationMessage(title, {
			body: message,
			iconType: _NOTIFICATION_ICON_TYPE.CSS
		});


		notification.onClick = function(event) {
			event.preventDefault();
			this.close();
			return false;
		};

		self.publish("notification", {notification: notification, type: notificationType});

	}
})
;

var tooltip = (function(params) {
	params = params || {};

	params.element = params.element || $("div");

	var _open = function() {
		_onOpen();
	};

	var _close = function() {
		_onClose();
	};

	var _onClose = function() {
		if(typeof params.onClose == "function") {
			params.onClose();
		}
	};

	var _onOpen = function() {
		if(typeof params.onOpen == "function") {
			params.onOpen();
		}
	};

	return {
		open: _open,
		close: _close
	}
})();



