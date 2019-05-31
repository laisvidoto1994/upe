/**
 * Notification object
 * Based on  standar https://dvcs.w3.org/hg/notifications/raw-file/tip/Overview.html
 * @author: Edward Morales
 */

/**
 * Constructor
 * @type {Function}
 */
var NotificationMessage = (function(title, properties){
	var self = this;
	properties = properties || {};
	title = title || "";
	self.properties = {
		title: title,
		element: "",
		dir:"",
		lang:"",
		body:"",
		tag:"",
		icon:"", // Base64, css class name or URL
		iconType:"",
		sound:"",
		vibrate:"",
		renotify:"",
		silent:"",
		noscreen:"",
		sticky:"",
		data:"",
		referer: ""
	};

	/**
	 * Permissions
	 * @type {{default: number, denied: number, granted: number}}
	 */
	var NotificationPermission = {
		"default":0,
		"denied":1,
		"granted":2
	};

	/**
	 * Notification Orientation
	 * @type {{auto: number, ltr: number, rtl: number}}
	 */
	var NotificationDirection = {
		"auto":0,
		"ltr":1,
		"rtl":2
	};

	/**
	 * Check secutiry
	 * @return {number}
	 * @private
	 */
	self._checkPermission = function(){
		return 0;
	};

	/**
	 * Set properties
	 * @param data
	 * @return {*}
	 * @private
	 */
	self._setProperties = function(data){
		data = data || {};
		self.properties = $.extend(self.properties,data);
		return self.properties;
	};

	/**
	 * Get Properties
	 * @return {*}
	 * @private
	 */
	self._getProperties = function(){
		return self.properties;
	};

	/**
	 * Binding to close modal
	 */
	self.close = function(){
		self.onClose();
		$(self.properties.element).remove();
	};

	/**
	 * Binding
	 */
	self.onClose = function(){};

	/**
	 * Binding
	 */
	self.onClick = function(){
		console.log("click");
	};

	/**
	 * Binding
	 */
	self.onError = function(){

	};

	/**
	 * Binding
	 */
	self.onShow = function(){
		console.log("show");
	};

	//Initialize properties
	self._setProperties(properties);

	/**
	 * Public interface
	 */
	return {
		checkPermission: self._checkPermission,
		setProperties: self._setProperties,
		getProperties: self._getProperties,
		close: self.close,
		onClose: self.onClose,
		onClick: self.onClick,
		onError: self.onError,
		onShow: self.onShow

	};
});