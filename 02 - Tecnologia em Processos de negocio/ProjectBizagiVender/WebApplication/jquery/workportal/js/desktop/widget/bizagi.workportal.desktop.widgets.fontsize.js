
/*
 *   Name: BizAgi Workportal Fontsize Controller
 *   Author: Jair Cardenas
 *   Comments:
 *   -	This script will provide base library for fontsize
 */

// Auto extend
bizagi.workportal.widgets.fontsize.extend("bizagi.workportal.widgets.fontsize", {}, {

	/*
	 *	 Constructor
	 */
	init: function(workportalFacade, dataService, params) {
		var self = this;

		// Call base
		this._super(workportalFacade, dataService, params);

	    //Load templates
		self.loadTemplates({
		    "fontsize": bizagi.getTemplate("bizagi.workportal.desktop.widget.fontsize"),
		    useNewEngine: false
		});
	},
	/*
	 *	 To be overriden in each device to apply layouts
	 */
	postRender: function() {
		var self = this;
		var content = self.getContent();
		var sizeSelected = $('body').data('sizeselected') || 'font-large';

	    // Set templates
		self.fontsizeTemplate = self.getTemplate("fontsize");

		// Set focus
		$('.ui-bizagi-wp-font-content a', content).removeClass('active');
		$('.ui-bizagi-wp-font-content .' + sizeSelected + ' a', content).addClass('active');

		var fontButton = $('.font-switcher', content);
		$(fontButton).click(function() {
			var textSize = $(this).parent().attr('class');
			$('body').data('sizeselected', textSize);
			$('.ui-bizagi-wp-font-content a', content).removeClass('active');
			$('.ui-bizagi-wp-font-content .' + textSize + ' a', content).addClass('active');

			$('html, body').removeClass('font-medium font-large font-x-large').addClass(textSize);
			return true;
		});

	}
});
