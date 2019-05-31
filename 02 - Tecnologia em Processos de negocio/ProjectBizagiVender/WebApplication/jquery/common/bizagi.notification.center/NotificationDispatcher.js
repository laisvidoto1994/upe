/**
 * Dispatch all queued notifications
 * @author: Edward Morales
 */


/**
 * Notifications decorators
 * @type {{PANEL: number, TOOLTIP: number}}
 * @private
 */
var _NOTIFICATION_TYPE = {
	PANEL: 0,
	TOOLTIP: 1,
	MODAL: 2
};

/**
 * Icons
 * @type {{BASE64: number, URL: number, CSS: number}}
 * @private
 */
var _NOTIFICATION_ICON_TYPE ={
	BASE64:0,
	URL:1,
	CSS:3
};

/**
 * Instances
 * @type {{}}
 * @private
 */
var _NOTIFICATION_INSTANCES = {};

/**
 * Constructor
 * @type {{dispatch}}
 */
var NotificationDispatcher = (function(instances) {
	var self = this;
	self._latestNotification = [];

	self._getInstance = function(type) {
		var instance = null;
		switch(type) {
			case _NOTIFICATION_TYPE.PANEL:
				if(instances[type]) {
					instance = instances[type];
				} else {
					instance = new NotificationCenter({container: $("#NotificationCenter")});
					instances[type] = instance;
				}
				break;
			case _NOTIFICATION_TYPE.TOOLTIP:
				if(instances[type]) {
					instance = instances[type];
				} else {
					instance = new NotificationTooltip();
					instances[type] = instance;
				}
				break;
			case _NOTIFICATION_TYPE.MODAL:
				if(instances[type]) {
					instance = instances[type];
				} else {
					instance = new NotificationModal();
					instances[type] = instance;
				}
				break;

			default:
			// code
		}
		return instance;
	};

	/**
	 * Factory of decorators
	 *
	 * @param notification
	 */
	self.dispatch = function(notification, type) {
		if(!notification) {
			return;
		}
		type = type || _NOTIFICATION_TYPE.PANEL;

		switch(type) {
			case _NOTIFICATION_TYPE.PANEL:
				var instance = self._getInstance(_NOTIFICATION_TYPE.PANEL);
				instance.addNotification(notification);
				break;
			case _NOTIFICATION_TYPE.TOOLTIP:
				var instance = self._getInstance(_NOTIFICATION_TYPE.TOOLTIP);
				instance.addNotification(notification);
				break;
			case _NOTIFICATION_TYPE.MODAL:
				var instance = self._getInstance(_NOTIFICATION_TYPE.MODAL);
				instance.addNotification(notification);
				break;
		}
	};

	/**
	 * Public interface
	 */
	return {
		dispatch: self.dispatch
	};
})(_NOTIFICATION_INSTANCES);