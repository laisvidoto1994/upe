
describe("Test Notification Dispatcher", function(){
	var $container = $("body");
	var notificationTitle = "Notification Title";
	var notificationBody = "Notification Body";
	var notificationCenter, notificationTooltip,notificationDispatcher;

	beforeEach(function(){

		notificationCenter = new NotificationMessage(notificationTitle,{
			body: notificationBody,
			type: _NOTIFICATION_TYPE.PANEL
		});


		notificationTooltip = new NotificationMessage(notificationTitle,{
			body: notificationBody,
			type: _NOTIFICATION_TYPE.TOOLTIP
		});

		notificationDispatcher = NotificationDispatcher;

	});

	it("Should distpatch notifications", function(done){
		var displayed = false;
		notificationCenter.onShow = function(){
			displayed = true;
			expect(displayed).toBe(true);
			done();
		}
		notificationDispatcher.dispatch(notificationCenter);
	});

	it("Should make singleton of decorator", function(done){
		var displayed = false;
		notificationCenter.onShow = function(){
			displayed = true;
			expect(displayed).toBe(true);
			done();
		}
		notificationDispatcher.dispatch(notificationCenter);
	});

	it("Should distpatch tooltip notification", function(done){
		var displayed = false;
		notificationTooltip.onShow = function(){
			displayed = true;
			expect(displayed).toBe(true);
			done();
		}
		notificationDispatcher.dispatch(notificationTooltip);
	});
});