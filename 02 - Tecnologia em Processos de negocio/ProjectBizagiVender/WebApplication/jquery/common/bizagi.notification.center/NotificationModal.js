/**
 * Modal decorator
 * @author: Edward Morales
 */


/**
 * Constructor
 * @type {Function}
 */
var NotificationModal =(function(params){
	var self = this;
	self.notifications = [];
	params = params || {};

	var markupItem = "<div class='notification-modal'>\
	<div class='message'>				\
		{{if icon}}										\
			{{if iconType == 0 || iconType==1}}			\
			<img class='icon' src='${icon}'>			\
			{{else iconType == 3}}						\
			<i class='icon ${icon}'></i>						\
			{{/if}}										\
		{{/if}}											\
				<p class='description'>{{html body}}</p>		\
					\
		</div>\
		</div>";


	self._processNotification = function(notification){
		var notificationProperties = notification.getProperties();
		var $content = $.tmpl(markupItem, notificationProperties);

		$content.dialog({
			title: notificationProperties.title || bizagi.localization.getResource("workportal-general-word-message"),
			modal:true,
			minimize:false,
			maximize:false,
			draggable:false,
			width: 480
		});

		notification.onShow();
		notification.setProperties({"element": $content});

		$(".close",$content).on("click", function(){
			notification.close();
		});

		$content.on("click", function(event){
			notification.onClick(event);
		});
	};

	self._addNotification = function(notification){
		self.notifications.push(notification);
	};

	self._showNotifications = function(){
		var notification;
		while(notification = self.notifications.shift()){
			self._processNotification(notification);
		}
	};

	self._clearNotifications = function(){
		$container.empty();
	};

	window.setInterval(function(){
		self._showNotifications();
	},500);

	return {
		addNotification : self._addNotification,
		showNotifications: self._showNotifications,
		clearNotifications: self._clearNotifications
	};
});
