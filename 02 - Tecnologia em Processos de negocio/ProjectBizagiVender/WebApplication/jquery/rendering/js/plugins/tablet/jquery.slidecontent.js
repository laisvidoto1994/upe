/* 
 * Simple slide content widget
 * @author:  Edward Morales
 */
(function($){  
  
  
    $.widget("ui.slideContent",{
        // Define options    
        options:{
            container: "<div/>",
            content: "",
            buttons:[],
            zIndex:1,
            autoOpen: true,
            
            // Define styles
            cssWrapContainer:"slide-container",
            //cssButtonsContainer:"slide-bt-container"
            cssButtonsContainer:"ui-slide-button-container"
        },
        
        _create: function(){
            this._layout = $("<div class='"+this.options.cssWrapContainer+"'></div>").append(this.element);
        	
            // Set a property to the selector to check if the plugin has been applied or not
            this.element.addClass("slide-container-applied");
            
            // Add buttons container
            if(this.options.buttons.length >= 1){
                this._layout.append(this._createButtons());
            }
                        
            this._layout.hide();            
        },
        
        _init: function(){
            if(this.options.autoOpen){
                this._isOpen = false;
                this.open();
            }
            return this;
        },
        
        _createButtons: function(){
            var self = this;
            var content=$("<div class="+self.options.cssButtonsContainer+"></div>");
            $.each(this.options.buttons, function(ui, value){
                var button = $("<input type='button' value='"+value.text+"' >").click(
                    value.click
                    ).appendTo(content);
            });
            
            this.buttonContainer = content;
            return content;
        },
                
        destroy: function(){
            $.Widget.prototype.destroy.apply(this);
        	
            // Remove
            this.element.removeClass("slide-container-applied");
        },
        
        setContent: function(content){
            this.options.content = content;
        },
        
        open: function(){
            if (this._isOpen) {
                return;
            }
            // Hide container element
        	this.parentCurrentScroll = this.options.container.parent().scrollTop();
            this.options.container.hide();
            
            this.options.container.after(this._layout);
        	
            // Check if the content has applied this plugin
            if (this.element.parents(".slide-container-applied").length > 0) {
                // Hide buttons for previous slide
                $(this.element.parents(".slide-container-applied")[0]).slideContent("hideButtons");
            }

            this._layout.show();
            
            this._isOpen = true;
            this._trigger('open');
        },
        
        isOpen: function() {
            return this._isOpen;
        },
        
        close: function() {
            var self = this;
		
            if (false === self._trigger('beforeclose')) {
                return;
            }

            if (self.isOpen()) {
                // Show container element
                this.options.container.show();
            	this.options.container.parent().scrollTop(this.parentCurrentScroll);
            	
                // Check if the content has applied this plugin
                if (this.element.parents(".slide-container-applied").length > 0) {
                    // Show buttons for previous slide
                    $(this.element.parents(".slide-container-applied")[0]).slideContent("showButtons");
                }
            
                // Hide slide content
                this._layout.hide();
                self._isOpen = false;
            }
            
            this._trigger('close');
        },
    	
        showButtons: function () {
            this.buttonContainer.show();	
        },
    	
        hideButtons: function () {
            this.buttonContainer.hide();	
        }
    });  
})(jQuery); 

