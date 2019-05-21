
describe("Notification Center",function(){
	var $container = $("body");
	var notificationTitle = "Notification Title";
	var notificationBody = "Notification Body";
	var notification, notificationCenter;

	beforeEach(function(){

		$container.empty();

		notification = new NotificationMessage(notificationTitle,{
			body: notificationBody,
			type: _NOTIFICATION_TYPE.PANEL
		});

		notificationCenter = new NotificationCenter({container: $container});


		notificationCenter.addNotification(notification);
		notificationCenter.showNotifications();
	});

	it("Should show notifications",function(){
		expect($container.text()).toMatch(notificationTitle);
		expect($container.text()).toMatch(notificationBody);
	});

	it("Should execute onClick Event", function(){
		var clicked = false;
		var notificationProperties = notification.getProperties();

		notification.onClick = function(){
			clicked = true;
		}

		$(notificationProperties.element).click();
		expect(clicked).toBe(true);
	});

	it("Should execute close Event", function(){
		var closed = false;
		var notificationProperties = notification.getProperties();

		notification.onClose = function(){
			console.log("onClose");
			closed = true;
		}

		$(".close", notificationProperties.element).click();
		expect(closed).toBe(true);
	});

	xit("Should execute onError Event", function(){
		var error = false;
		var notificationProperties = notification.getProperties();
		notification.onClick = function(){
			throw new Error();
		};

		notification.onError = function(e){
			console.log("onError");
			error = true;
		}

		$(notificationProperties.element).click();
		expect(error).toBe(true);
	});

	it("Should execute onShow Event", function(){
		var displayed = false;
		var notificationProperties = notification.getProperties();

		notificationCenter.clearNotifications();

		notification.onShow = function(){
			console.log("onShow");
			displayed = true;
		};

		notificationCenter.addNotification(notification);
		notificationCenter.showNotifications();

		expect(displayed).toBe(true);
	});


});