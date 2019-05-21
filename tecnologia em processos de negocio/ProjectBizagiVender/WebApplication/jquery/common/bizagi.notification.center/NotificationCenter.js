/**
 * Notification center decorator
 * @author: Edward Morales
 */


/**
 * Constructor
 * @type {Function}
 */
var NotificationCenter =(function(params){
	var self = this;
	self.notifications = [];
	params = params || {};
	var $container = params.container || $("body");


	var markupContainer = "<div class='notification-panel'><ul class='wrapper'></ul></div>";
	var markupItem = "<li class='message'>				\
		{{if icon}}										\
			{{if iconType == 0 || iconType==1}}			\
			<img class='icon' src='${icon}'>			\
			{{else iconType == 3}}						\
			<i class='icon ${icon}'></i>						\
			{{/if}}										\
		{{/if}}											\
				<p class='title'>{{html title}}</p>		\
				<p class='description'>${body}</p>		\
				<i class='close fa fa-times'></i>		\
		</li>";
	var $markupContainer = $.tmpl(markupContainer);
	$container.append($markupContainer);
	var $notificationContainer = $("ul",$container);

	self._processNotification = function(notification){
		var notificationProperties = notification.getProperties();
		var $content = $.tmpl(markupItem, notificationProperties);
		var notificationClose = notification.close;

		$notificationContainer.append($content);
		notification.close = function(){
			notificationClose();

			if(self.notifications.length == 0){
				$markupContainer.hide();
			}
		};

		notification.onShow();
		notification.setProperties({"element": $content});

		$(".close",$content).on("click", function(){
			notification.close();
		});

		$content.on("click", function(event){
			notification.onClick(event);
		});
	};

	/**
	 * Add a new notification
	 * @param notification
	 * @private
	 */
	self._addNotification = function(notification){
		self.notifications.push(notification);
		$markupContainer.show();
	};

	/**
	 * Show notifications
	 * @private
	 */
	self._showNotifications = function(){
		var notification;
		while(notification = self.notifications.shift()){
			self._processNotification(notification);
		}
	};

	/**
	 * Clear all notifications
	 * @private
	 */
	self._clearNotifications = function(){
		$container.empty();
	};

	window.setInterval(function(){
		self._showNotifications();
	},1000);

	/**
	 * Public interface
	 */
	return {
		addNotification : self._addNotification,
		showNotifications: self._showNotifications,
		clearNotifications: self._clearNotifications
	};
});
