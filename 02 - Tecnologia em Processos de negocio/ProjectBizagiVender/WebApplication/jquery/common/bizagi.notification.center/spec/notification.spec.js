describe("Test properties", function() {
	var notification = new NotificationMessage();
	it("Should has close", function() {
		expect(notification.close).toBeDefined();
	});

	it("Should has properties", function() {
		var properties = notification.getProperties();

		expect(properties.title).toBeDefined();
		expect(properties.dir).toBeDefined();
		expect(properties.lang).toBeDefined();
		expect(properties.body).toBeDefined();
		expect(properties.tag).toBeDefined();
		expect(properties.icon).toBeDefined();
		expect(properties.sound).toBeDefined();
		expect(properties.vibrate).toBeDefined();
		expect(properties.renotify).toBeDefined();
		expect(properties.silent).toBeDefined();
		expect(properties.noscreen).toBeDefined();
		expect(properties.sticky).toBeDefined();
		expect(properties.data).toBeDefined();
		expect(properties.type).toBeDefined();
	});

	it("Should set properties", function(){
		var newProperties = {
			title: "Title",
			dir:"dir",
			lang:"lang",
			body:"body",
			tag:"tag",
			icon:"icon",
			sound:"sound",
			vibrate:"vibrate",
			renotify:true,
			silent:true,
			noscreen:true,
			sticky:true,
			data:"data",
			type: _NOTIFICATION_TYPE.PANEL
		};
		notification.setProperties(newProperties);
		var properties = notification.getProperties();

		expect(properties.title).toBe(newProperties.title);
		expect(properties.dir).toBe(newProperties.dir);
		expect(properties.lang).toBe(newProperties.lang);
		expect(properties.body).toBe(newProperties.body);
		expect(properties.tag).toBe(newProperties.tag);
		expect(properties.icon).toBe(newProperties.icon);
		expect(properties.sound).toBe(newProperties.sound);
		expect(properties.vibrate).toBe(newProperties.vibrate);
		expect(properties.renotify).toBe(newProperties.renotify);
		expect(properties.silent).toBe(newProperties.silent);
		expect(properties.noscreen).toBe(newProperties.noscreen);
		expect(properties.sticky).toBe(newProperties.sticky);
		expect(properties.data).toBe(newProperties.data);
		expect(properties.type).toBe(newProperties.type);
	});
});

