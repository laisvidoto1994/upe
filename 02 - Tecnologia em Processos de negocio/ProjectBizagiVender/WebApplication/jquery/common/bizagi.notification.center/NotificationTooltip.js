var NotificationMain = function(params){
	var self = this;
	params = params || {};
	self.notifications = [];
	self.$container = (params.container)?params.container : $("body");

	self.processNotification = function(notification){
		notification.onShow();
		console.log("Calling ProcessNotification");
	};

	self.addNotification = function(notification){
		self.notifications.push(notification);
	};

	self.showNotifications = function(){
		var notification;
		while(notification = self.notifications.shift()){
			self.processNotification(notification);
		}
	};

	self.clearNotifications = function(){
		self.$container.empty();
	};

	window.setInterval(function(){
		self.showNotifications();
	},100);
};

var NotificationTooltip = function(params){
	NotificationMain.call(this, params);
	var self = this;


	var markupItem = "<div class='notification-tooltip'><ul class='wrapper'>\
            <li class='message'>\
                {{if icon}}\
                    <img class='icon' src='${icon}'>\
                {{/if}}\
                <h6 class='title'>${title}</h6>\
                <p class='description'>${body}</p>\
                <button class='close'>X</button>\
            </li></ul></div>";

	$.template("markupItem",markupItem);

	self.processNotification = function(notification){
		var notificationProperties = notification.getProperties();
		var $content = $.tmpl("markupItem", notificationProperties);
		console.log("Calling ProcessNotification children");
		$content.position({
			of: notificationProperties.referer,
			my: 'left top',
			at: 'left button',
			offset: '50 90'
		});

		self.$container.append($content);

		notification.onShow();
		notification.setProperties({"element": $content});

		$(".close",$content).on("click", function(){
			notification.close();
		});

		$content.on("click", function(){
			notification.onClick();
			notification.close();
		});
	};
};

