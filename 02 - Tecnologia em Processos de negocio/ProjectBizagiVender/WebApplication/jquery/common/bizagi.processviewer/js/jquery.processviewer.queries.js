// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ processviewer SVG 1.0.0 - JavaScript BPMN Bizagi Queries                  │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © bizagi                                                 │ \\
// └────────────────────────────────────────────────────────────────────┘ \\
/*! */
(function ($) {

    $.fn.processviewerQueries = function() {
        this.css( "color", "green" );
        var self = this;
        self.data = this[0];
        self.internalDataSource = {
            elements:[]
        };

        self.datasource = {
            hotspots:[],
            formatStyles:[]
        };
        
        self.deferred = $.Deferred();

        self.padding = 80;

        self.typeDefinitions = $.bizagi.processviewer.configuration.validTypeDefinitions;
        self.constants = $.bizagi.processviewer.configuration.constants;

        

        this.methods = {
            init:function(){
                var self = this;
                var deferredInternal = $.Deferred();


                self.typeDefinitions.unshift('owner');

                self.data.definition.owner = {
                        processType: self.data.definition.processType,
                        elementType: self.data.definition.elementType,
                        displayName: self.data.definition.displayName,
                        id:          self.data.definition.id
                    };

                $.when(self.methods.processElements.apply(self,[])).done(function(){

                    deferredInternal.resolve(self.datasource);
                });




                return deferredInternal.promise();
            },
            processElements:function(){
                var self = this,
                    elements = [];

                for(var prop in self.data.definition){

                    var el = self.data.definition[prop];

                    if(self.methods.validateKindObject.apply(self, [prop])){
                        if(prop === self.constants.LANESETS){
                            if(el){
                                var lanes = self.methods.getLanesFromLaneSet.apply(self, [el]);
                                elements = elements.concat(lanes);
                            }
                        }else{
                            elements = elements.concat(el);
                        }
                    }
                }

                self.internalDataSource.elements = self.internalDataSource.elements.concat(elements);

                for(var i=0; i<self.internalDataSource.elements.length; i++){
                    var id = self.internalDataSource.elements[i].id;
                    var hotspot = self.methods.getElementGraphicDataById.apply(self, [id]);

                    if(hotspot){
                        var h = $.extend({}, hotspot, self.internalDataSource.elements[i]);
                        self.datasource.hotspots.push(h);
                    }
                }


                self.datasource.dimentions = self.methods._getMaxDimentions.apply(self, []);

                self.datasource.formatStyles = self.methods.getStylesFormat.apply(self, []);

            },
            getStylesFormat: function(){
                var self = this, styles;

                var formatStyles= {};

                if(self.data.graphics[self.constants.BPMNLABELSTYLES]){
                    styles = self.data.graphics[self.constants.BPMNLABELSTYLES];

                    for(var i=0; i<styles.length; i++){
                        var o = styles[i];


                        var fSize = (o.font.size) ? $._ptToem(o.font.size) : '1em';

                        formatStyles[o.id] = {
                                                    css:{
                                                        "fontFamily": o.font.name || 'Arial',
                                                        "fontSize": fSize,
                                                        "fontWeight": (o.font.isBold)? 'bold': 'normal',
                                                        "fontStyle": (o.font.isItalic)? 'italic': 'normal',
                                                        "color": o.font.color || 'Black'
                                                    },
                                                    cssClass:[
                                                        'alignment-'+o.alignment
                                                        ]
                                                };
                    }
                }

                return formatStyles;

            },
            _getMaxDimentions:function(){
                var self = this;
                var maxWidth = 0;
                var maxHeight = 0;
                var lanes = [];

                for(var prop in self.data.definition){
                    var el = self.data.definition[prop];

                    if(prop === self.constants.LANESETS){
                        if(el){
                            lanes = self.methods.getLanesFromLaneSet.apply(self, [el]);
                        }
                    }
                }

                var dataGraphicTmp;
                for(var i=0; i<lanes.length; i++){
                    if(lanes[i].id){
                        dataGraphicTmp = self.methods.getElementGraphicDataById.apply(self, [lanes[i].id]);
                    }

                    if(typeof dataGraphicTmp === 'object'){
                        if(maxWidth < dataGraphicTmp.bounds.width){
                            maxWidth = dataGraphicTmp.bounds.width + self.padding;
                        }

                        maxHeight += dataGraphicTmp.bounds.height + self.padding;

                    }
                }

                return {width:maxWidth, height:maxHeight};
            },
            _ptToEM:function(pt){

                return pt /self.pixelFontSize ;
            },
            getElementGraphicDataById: function(id){
                var self = this;
                var diagramElements = self.data.graphics.bpmnPlane.diagramElements;
                var rValue;

                for(var i=0; i<diagramElements.length; i++){
                    var hasID = self.methods.hasReferenceId(diagramElements[i]);

                    if(hasID){
                        localID = hasID;
                        if(localID === id){
                            rValue = diagramElements[i];
                            break;
                        }
                    }
                }

                return rValue;
            },

            getLanesFromLaneSet: function(el){
                var self = this;
                var lanes = [];

                for(var i=0; i<el.length; i++){
                    lanes = lanes.concat(el[i].lanes);
                }


                return lanes;
            },
            validateKindObject:function(kind){
                var self = this;
                var rValue = false;
                for(var i=0; i<self.typeDefinitions.length; i++){
                    if(self.typeDefinitions[i] === kind){
                        rValue = true;
                        break;
                    }
                }

                return rValue;

            },
            hasReferenceId:function(obj){
                var self = this;
                var rValue = false;
                if(obj.bpmnElement){
                    if(obj.bpmnElement.baref){
                        if(obj.bpmnElement.baref.ref){
                            rValue = obj.bpmnElement.baref.ref;
                        }
                    }

                }else if(obj.bpmnElementRef){
                   rValue = obj.bpmnElementRef;
                }

                return rValue;
            }
        };


        return this.methods.init.apply(this,[]);
    };

})(jQuery);



/*!
 * jQuery UI Touch Punch 0.2.2
 *
 * Copyright 2011, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
(function ($) {

  // Detect touch support
  $.support.touch = 'ontouchend' in document;

  // Ignore browsers without touch support
  if (!$.support.touch) {
    return;
  }

  var mouseProto = $.ui.mouse.prototype,
      _mouseInit = mouseProto._mouseInit,
      touchHandled;

  /**
   * Simulate a mouse event based on a corresponding touch event
   * @param {Object} event A touch event
   * @param {String} simulatedType The corresponding mouse event
   */
  function simulateMouseEvent (event, simulatedType) {

    // Ignore multi-touch events
    if (event.originalEvent.touches.length > 1) {
      return;
    }

    event.preventDefault();

    var touch = event.originalEvent.changedTouches[0],
        simulatedEvent = document.createEvent('MouseEvents');
    
    // Initialize the simulated mouse event using the touch event's coordinates
    simulatedEvent.initMouseEvent(
      simulatedType,    // type
      true,             // bubbles                    
      true,             // cancelable                 
      window,           // view                       
      1,                // detail                     
      touch.screenX,    // screenX                    
      touch.screenY,    // screenY                    
      touch.clientX,    // clientX                    
      touch.clientY,    // clientY                    
      false,            // ctrlKey                    
      false,            // altKey                     
      false,            // shiftKey                   
      false,            // metaKey                    
      0,                // button                     
      null              // relatedTarget              
    );

    // Dispatch the simulated event to the target element
    event.target.dispatchEvent(simulatedEvent);
  }

  /**
   * Handle the jQuery UI widget's touchstart events
   * @param {Object} event The widget element's touchstart event
   */
  mouseProto._touchStart = function (event) {

    var self = this;

    // Ignore the event if another widget is already being handled
    if (touchHandled || !self._mouseCapture(event.originalEvent.changedTouches[0])) {
      return;
    }

    // Set the flag to prevent other widgets from inheriting the touch event
    touchHandled = true;

    // Track movement to determine if interaction was a click
    self._touchMoved = false;

    // Simulate the mouseover event
    simulateMouseEvent(event, 'mouseover');

    // Simulate the mousemove event
    simulateMouseEvent(event, 'mousemove');

    // Simulate the mousedown event
    simulateMouseEvent(event, 'mousedown');
  };

  /**
   * Handle the jQuery UI widget's touchmove events
   * @param {Object} event The document's touchmove event
   */
  mouseProto._touchMove = function (event) {

    // Ignore event if not handled
    if (!touchHandled) {
      return;
    }

    // Interaction was not a click
    this._touchMoved = true;

    // Simulate the mousemove event
    simulateMouseEvent(event, 'mousemove');
  };

  /**
   * Handle the jQuery UI widget's touchend events
   * @param {Object} event The document's touchend event
   */
  mouseProto._touchEnd = function (event) {

    // Ignore event if not handled
    if (!touchHandled) {
      return;
    }

    // Simulate the mouseup event
    simulateMouseEvent(event, 'mouseup');

    // Simulate the mouseout event
    simulateMouseEvent(event, 'mouseout');

    // If the touch interaction did not move, it should trigger a click
    if (!this._touchMoved) {

      // Simulate the click event
      simulateMouseEvent(event, 'click');
    }

    // Unset the flag to allow other widgets to inherit the touch event
    touchHandled = false;
  };

  /**
   * A duck punch of the $.ui.mouse _mouseInit method to support touch events.
   * This method extends the widget with bound touch event handlers that
   * translate touch events to mouse events and pass them to the widget's
   * original mouse event handling methods.
   */
  mouseProto._mouseInit = function () {
    
    var self = this;

    // Delegate the touch handlers to the widget's element
    self.element
      .bind('touchstart', $.proxy(self, '_touchStart'))
      .bind('touchmove', $.proxy(self, '_touchMove'))
      .bind('touchend', $.proxy(self, '_touchEnd'));

    // Call the original $.ui.mouse init method
    _mouseInit.call(self);
  };

})(jQuery);