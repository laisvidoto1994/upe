// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ processviewer SVG 1.0.0 - JavaScript BPMN Bizagi Draw              │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © bizagi                                                 │ \\
// └────────────────────────────────────────────────────────────────────┘ \\
/*! */
(function ($) {


    $.widget("ui.processviewer", {
        constants: $.bizagi.processviewer.configuration.constants,
        options: {
            image: null,
            zoomRange: 50,
            hotspots: [],
            dragMessage: 'Drag Image (Image Pane)',
            processMessage: 'Process Image....',
            previewWidth: 120,
            previewHeight: 120,
            hotspotsCSS: '',
            draggable: true,
            controls: true,
            zoomImageOptions: false,
            moveIncrement: 20,
            isIE8: false,
            device: "desktop",
            minZoom: 0.5,
            minZoomIE8: 0.5,
            maxZoomIE8: 1.5,
            maxZoom: 1.5,
            template: false,
            unavailableImage: 'img/unavailable_image.png',
            tmpl: 'bizagi.processviewer.template',
            hotSpotsSVG: false,
            formatStyles: {},
            milestonesHeight: 25,
            animation: {
                path: [],
                interval: 0,
                instance: 0,
                time: 200,
                counter: 0
            },
            configuration: {
                localTemplate: '',
                processviewerStageId: '',
                processviewerStage: '',
                $processviewerStage: '',
                processviewerStageSet: '',
                processviewerImageStage: '',
                processviewerHotSpotsContainer: '',
                processviewerStagePathsSet: '',
                errorImageCSS: 'processviewer-error-image',
                sliderOptions: {}
            },
            getTemplate: function (name) {
                return bizagi.getTemplate(name);
            }
        },
        _create: function () {
            var self = this;

            // Detect touch support
            $.support.touch = 'ontouchend' in document;

            if(self._isInWorkportal()){
                if(typeof bizagi !== 'undefined'){
                    if(typeof bizagi.util !== 'undefined'){
                        self.options.isIE8 = bizagi.util.isIE8();
                        self.options.device = bizagi.util.detectDevice();
                    }
                }
            }else{
                bizagi = {
                    workportal:false
                }
            }

            self.$el = $('<div class="wdg-processviewer"></div>');
            self.$el.attr('role', 'widget.bizagi.processviewer');

            self.element.append(self.$el);

            if (self.options.jsonBizagi) {


                if (typeof self.options.jsonBizagi.processDefinition === 'string' && typeof self.options.jsonBizagi.processDefinition === 'string') {

                    $.when($.get(self.options.jsonBizagi.processDefinition), $.get(self.options.jsonBizagi.processGraphicsInfo)).done(function (a, b) {
                        self._processDataForPlugin({ definition: a[0], graphics: b[0] });
                    }).fail(function (e) {
                        self.$el.text(e.message);
                    });

                } else {
                    self._processDataForPlugin({
                        definition: self.options.jsonBizagi.processDefinition,
                        graphics: self.options.jsonBizagi.processGraphicsInfo
                    });

                }
            } else {
                self._loadTemplate();
            }

        },
        _processDataForPlugin: function (jsonProcess) {
            var self = this;

            if (!jsonProcess.definition.status && !jsonProcess.graphics.status) {

                $.when($(jsonProcess).processviewerQueries()).done(function (extendedObject) {
                    $.extend(self.options, extendedObject);
                    self._loadTemplate();
                });
            } else {
                self._triggers.error({ message: jsonProcess.definition.message, json: jsonProcess });
            }


        },
        _triggerError: function (obj) {

        },
        _loadTemplate: function () {
            var self = this;
            var template = self.options.template;

            if(bizagi.workportal){
                self.loader = new bizagi.ui.controls.tmplloader();
            
                if (template) {
                    if (template.indexOf('.html')) {
                        $.when(self.loader.loadTemplates({ "processviewer": template })).done(function () {

                            self.options.configuration.localTemplate = self.loader.getTemplate("processviewer");
                            self._buildprocessviewer();
                        });
                    }
                } else {
                    template = self.options.getTemplate(self.options.tmpl);

                    $.when(self.loader.loadTemplates({ "processviewer": template })).done(function () {

                        self.options.configuration.localTemplate = self.loader.getTemplate("processviewer");
                        self._buildprocessviewer();
                    });
                }
            }else{
                    if(template){
                        if (template.indexOf('.html')) {
                            $.when($.get(self.options.template)).done(function (a) {
                                
                                self.options.configuration.localTemplate = a;
                                self._buildprocessviewer();
                            });
                        }
                    } else {
                        template = self.options.getTemplate(self.options.tmpl);
                        $.when($.get(template)).done(function(a){
                            self.options.configuration.localTemplate = a;


                            self._buildprocessviewer();
                        });
                    }
            }
        },
        _buildprocessviewer: function () {
            var self = this,
                createOwnId,
                resultTemplate;

            self.$el.empty();
            createOwnId = self.options.configuration.processviewerStageId = self._generateID();

            resultTemplate = $.tmpl(self.options.configuration.localTemplate, { id: createOwnId, isIE8: self.options.isIE8 });
            self.$el.append(resultTemplate);

            self._createStage();
        },
        resize: function (height, width) {
            var self = this;

            width = width || self.options.width;
            h = height || self.options.height;

            self.$el.outerWidth(width);
            self.$el.outerHeight(height);
        },
        _createStage: function () {
            var self = this,
                w,
                h,
                x = 0,
                y = 0,
                imageW,
                imageH,
                paper,
                nestedPaper,
                wPercent,
                paperFlows;

            w = (self.options.width) ? self.options.width : '100%';
            h = (self.options.height) ? self.options.height : 150;


            self.$el.outerWidth(w);
            self.$el.outerHeight(h);

            var dimentionsAtPercentWidth = ((self.options.dimentions.width * 100) / 150) + self.options.dimentions.width;
            var dimentionsAtPercentHeight = ((self.options.dimentions.height * 100) / 150) + self.options.dimentions.height;

            self.options.configuration.processviewerStage = paper = new Raphael(self._getStageContainer(), dimentionsAtPercentWidth, dimentionsAtPercentHeight);
            self.options.configuration.processviewerPathsStageGroup = nestedPaper = paper.group();


            paper.canvas.setAttribute('id', self._generateID());
            paper.canvas.setAttribute('id', self._generateID());

            paper.canvas.setAttribute('class', 'processviewer-zvg-container');
            paper.canvas.setAttribute('class', 'processviewer-zvg-nested');

            self.options.configuration.processviewerStageSet = paper.set();

            self.options.configuration.processviewerstageHotSpotSet = paper.set();

            $('[data-processviewercontainer]', self.element).height(self.options.dimentions.height);

            if (self.options.dimentions.height < h) {
                $('[data-processviewercontainer]', self.element).height(h);
            }


            if (w.indexOf('%')) {
                wPercent = true;
            }

            if (wPercent || self.options.dimentions.width < w) {
                $('[data-processviewercontainer]', self.element).width('100%');
            } else {
                $('[data-processviewercontainer]', self.element).width(self.options.dimentions.width);
            }


            if (self.options.dimentions.width < w) {
                $('[data-processviewercontainer]', self.element).width(w);
            }


            if (self.options.image) {

                $.when(self._verifyingImage(self.options.image)).done(function (image) {

                    imageW = (image.width) ? image.width : '150';
                    imageH = (image.height) ? image.height : '150';

                    self.options.configuration.processviewerImageStage = self.options.configuration.processviewerStage.image(image.src, x, y, imageW, imageH);

                    self.options.configuration.processviewerStageSet.push(self.options.configuration.processviewerImageStage);
                    self.options.configuration.processviewerRectStage.attr('fill', 'rgba(255,255,255,0)');
                    self.options.configuration.processviewerRectStage.attr('stroke', 'none');

                    self._createUIControls();


                }).fail(function (src) {
                    self._createUIFailView(src);
                });

            } else {

                imageW = (self.element.width()) ? self.element.width() : '150';
                imageH = (self.element.height()) ? self.element.height() : '150';


                self.options.configuration.processviewerRectStage = self.options.configuration.processviewerStage.rect(x, y, w * 2, h * 2);
                self.options.configuration.processviewerRectStage.attr('fill', 'rgba(255,255,255,0)');
                self.options.configuration.processviewerRectStage.attr('stroke', 'none');

                self.options.configuration.processviewerRectStage[0].setAttribute('id', 'BaseStage' + self._generateID());

                self._createUIControls();

            }

        },
        _createUIControls: function () {
            var self = this;
            var paper = self.options.configuration.processviewerStage;
            var image = self.options.configuration.processviewerImageStage;


            if (self.options.draggable) {
                self._setDraggable();
            }

            $.when(self._createSVGProcessPool(), self._createSVGLanes(), self._createSVGMilestones(), self._createSVGSequenceFlows()).done(function () {

                self._createStyleFormats();
                // markers aren't support in IE8
                if (!self.options.isIE8) self._createMarkers();
                self._addHandlers();
                self._createSlider();

                if (self.options.hotSpotsSVG) {
                    self._createSVGHotSpots();
                } else {

                    $.when(self._createHTMLHotSpots()).done(function () {
                        self._adjustLabelsPosition();

                        var controlProperties = {
                            type: "pvComplete",
                            message: "processviewer complete",
                            time: new Date(),
                            ui: self.$el
                        };

                        self.element.trigger(controlProperties);

                    });
                }

            });
        },
        _createSlider: function () {
            var self = this;

            var rangeIsValid = self.validateHTML5Features.checkInput('range');

            if ($.support.touch || rangeIsValid) {
                $('.ui-for-desktop').remove();

                var range = $("input[type='range']");

                range.attr('min', self.options.minZoom);
                range.attr('max', self.options.maxZoom);
                range.attr('step', 0.1);
                range.attr('value', 1);

                if (!$.support.touch || self.options.device === "desktop") {
                    range.mouseenter(function () {
                        var el = $(this);
                        el.prev("output").addClass("is-visible-output");
                        self._updateOutputSlider(this);
                    }).mouseleave(function () {
                        var el = $(this);
                        el.prev("output").removeClass("is-visible-output");
                    });
                    range.change(function (event) {
                        // Cache this for efficiency
                        self._updateOutputSlider(this);
                        var _value = $(this).val();
                        self.options.configuration.processviewerPathsStageGroup.scale(_value);
                        self.options.configuration.processviewerHotSpotsContainer.css('font-size', _value + 'em');

                        //Fix IE11 markers
                        var defs = $(self.options.configuration.processviewerStage.defs);
                        $(self.options.configuration.processviewerStage.canvas).append(defs);

                        self._updateHotSpotsScale(_value);

                        event.stopPropagation();
                    });
                } else {
                    range.change(function () {
                        self._updateOutputSlider(this);
                    });

                    range.bind('touchstart', function () {
                        var el = $(this);
                        el.prev("output").addClass("is-visible-output");
                        self._updateOutputSlider(this);
                    });


                    range.bind('touchend', function () {
                        var _value = $(this).val();
                        var el = $(this);
                        el.prev("output").removeClass("is-visible-output");
                        self.options.configuration.processviewerPathsStageGroup.scale(_value);
                        self.options.configuration.processviewerHotSpotsContainer.css('font-size', _value + 'em');
                        self._updateHotSpotsScale(_value);

                        self._updateOutputSlider(this);

                    });
                }
            } else {
                $('.ui-for-touch').remove();
                var svgNested = $('.processviewer-zvg-nested');

                svgNested.data('real-width', svgNested.width());
                svgNested.data('real-height', svgNested.height());

                var initialValue = 1;
                var sliderTooltip = function(event, ui) {
                    var curValue = ui.value || initialValue;
                    var curValPercent = Math.round(curValue * 100) + '%';
                    var tooltip = '<div class="tooltip"><div class="tooltip-inner">' + curValPercent + '</div></div>';

                    $('.sliderTooltip').html(tooltip);

                }

                self.options.configuration.sliderOptions = {
                    min: self.options.minZoomIE8,
                    max: self.options.maxZoomIE8,
                    step: 0.1,
                    value: initialValue,
                    create: sliderTooltip,
                    slide: sliderTooltip,
                    stop: function (event, ui) {

                        if (ui.value > 1) {

                            svgNested[0].setAttribute('width', svgNested.data('real-width') * ui.value);
                            svgNested[0].setAttribute('height', svgNested.data('real-height') * ui.value);
                        }

                        self.options.configuration.processviewerPathsStageGroup.scale(ui.value);
                        self.options.configuration.processviewerHotSpotsContainer.css('font-size', ui.value + 'em');
                        self._updateHotSpotsScale(ui.value);
                        self._setDraggable();
                    }
                };

                $('[data-processviewerslider]', self.element).slider(self.options.configuration.sliderOptions);
            }

        },
        _updateOutputSlider: function (base) {
            // Cache this for efficiency
            var el = $(base);

            el
             .prev("output")
             .text(Math.round(el.val() * 100) + '%');
        },
        _updateHotSpotsScale: function (scale) {
            var self = this;
            var hotspots = self.options.configuration.hotspotsList;

            $('[data-processviewerhotspots]').hide();

            var g = $('.processviewer-hotspot-icon svg g');

            g.each(function () {
                this.setAttribute('transform', 'scale(' + scale / 10 + ')');
            });

            for (var i = 0; i < hotspots.length; i++) {
                var hspot = $(hotspots[i]);
                var scaleW = hspot.data('real-width') * scale;
                var scaleH = hspot.data('real-height') * scale;

                var scaleX = hspot.data('real-left') * scale;
                var scaleY = hspot.data('real-top') * scale;

                hspot.outerWidth(scaleW);
                hspot.outerHeight(scaleH);
                hspot.css('left', scaleX);
                hspot.css('top', scaleY);

            }

            $('[data-processviewerhotspots]').show();
        },
        _scaleSVG: function () {

        },
        _addHandlers: function () {
            var self = this;
            $(window).on('resize.processviewer', function () {
                self._setDraggable();
            });
        },
        _setDraggable: function () {
            var self = this,
                limits;

            if ($.support.touch  && self.options.device !== "desktop") {
                var scale = self.options.configuration.processviewerPathsStageGroup.getScale();
                var opWidth = self.options.configuration.processviewerStage.canvas.getAttribute('width') * scale;
                var opHeight = self.options.configuration.processviewerStage.canvas.getAttribute('height') * scale;

                $('.processviewer-wrapper').addClass('ui-scroll-touch');

                $('[data-processviewercontainer]', self.element).width(opWidth);
                $('[data-processviewercontainer]', self.element).height(opHeight);



            } else {
                self.options.configuration.$processviewerStage = $(self.options.configuration.processviewerStage.canvas).parent();

                var pos = $('[data-processviewercontainer]', self.element).position();

                if (pos) {
                    var scale = self.options.configuration.processviewerPathsStageGroup.getScale();

                    var windowWidth = self.element.width();
                    var windowHeight = self.element.height();

                    var opWidth = self.options.configuration.processviewerStage.width * scale;
                    var opHeight = self.options.configuration.processviewerStage.height * scale;

                    maxleft = pos.left;
                    maxTop = pos.top;

                    var isDraggable = $('[data-processviewer-wrapper-container]', self.element).is(':ui-draggable');

                    if (windowWidth < opWidth || windowHeight < opHeight) {



                        if (!isDraggable) {

                            self.$el.addClass(' processviewer-drag');
                            limits = self._dragLimits();
                            self.options.configuration.$processviewerStage.draggable({
                                refreshPositions: true,
                                drag: function (event, ui) {

                                    limits = self._dragLimits();

                                    if (ui.position.left >= 0) {
                                        ui.position.left = 0;
                                    }

                                    if (ui.position.top >= 0) {
                                        ui.position.top = 0;
                                    }

                                    if (ui.position.top < limits.y) {
                                        ui.position.top = limits.y;
                                    }

                                    if (ui.position.left < limits.x) {
                                        ui.position.left = limits.x;
                                    }
                                }
                            });
                        }


                    } else {
                        if (isDraggable) {
                            self.options.configuration.$processviewerStage.draggable("destroy");
                            self.element.removeClass('processviewer-drag');

                            self.options.configuration.$processviewerStage.css({ left: 0, top: 0 });
                            self.options.configuration.processviewerHotSpotsContainer.css({ left: 0, top: 0 });
                        }
                    }
                }
            }


        },
        _dragLimits: function () {
            var self = this;
            var scale = self.options.configuration.processviewerPathsStageGroup.getScale();

            var windowWidth = self.element.width();
            var windowHeight = self.element.height();

            var opWidth = self.options.configuration.processviewerStage.width * scale;
            var opHeight = self.options.configuration.processviewerStage.height * scale;

            var limitx = 0;
            var limity = 0;

            if (windowWidth < opWidth) {
                limitx = windowWidth - opWidth;
            }

            if (windowHeight < opHeight) {
                limity = windowHeight - opHeight;
            }

            return { x: limitx, y: limity };

        },
        _movePaths: function (x, y) {
            var self = this;

            self.options.configuration.processviewerStage.move(x, y);
        },
        _createMarkers: function () {
            var self = this;

            var markers = $.bizagi.processviewer.design.markers;
            if (markers) {
                for (var prop in markers) {
                    var propertiesTmp = markers[prop].properties;
                    var propertiesMarker = {
                        id: prop,
                        css: prop,
                        markerHeight: 10,
                        markerWidth: 10,
                        refX: 10,
                        refY: 5,
                        orient: "auto"
                    };

                    var markerTmp = self.options.configuration.processviewerStage.marker();

                    $(markerTmp.node).attrSVG(propertiesMarker);
                    $(markerTmp.node.lastElementChild).attrSVG(propertiesTmp);

                    if (!self.options.configuration.processviewerMarkerEndArrow) {
                        self.options.configuration.processviewerMarkerEndArrow = [];
                    }

                    self.options.configuration.processviewerMarkerEndArrow.push(markerTmp);
                }
            }

        },
        _createStyleFormats: function () {
            var self = this;
            var formats = self.options.formatStyles;

            var divTmp = $('<div></div>');

            var styleTag = '<style>';

            for (var prop in formats) {

                var styleTagTmp = '.' + prop.toLowerCase() + '{';

                divTmp.css(formats[prop].css);

                styleTagTmp += divTmp.attr('style') + '}';

                styleTag += styleTagTmp;
            }


            styleTag += '</style>';

            $('head').append($(styleTag));

        },
        _asignLabelFormat: function (obj, o) {
            var self = this;

            if (o.bpmnLabel) {
                if (o.bpmnLabel.labelStyle) {
                    var label = o.bpmnLabel.labelStyle;
                    var format = self.options.formatStyles[label];

                    if ($(obj).closest('svg').length > 0) {
                        $(obj).css(format.css);
                    }

                    var addClass = format.cssClass;

                    addClass.push(label);

                    for (var i = 0; i < addClass.length; i++) {
                        $(obj).addClass(addClass[i].toLowerCase());
                    }
                }
            }

        },
        _createSVGProcessPool: function () {
            var self = this, nTextRect;
            var processPool = [];

            var paper = self.options.configuration.processviewerPathsStageGroup;

            for (var k = self.options.hotspots.length - 1; k >= 0; k--) {
                if (self.options.hotspots[k].elementType === self.constants.ELEMENT_TYPE.PROCESS) {
                    processPool.push(self.options.hotspots[k]);
                    self.options.hotspots.splice(k, 1);
                }
            }

            self._createSVGRect(paper, processPool, 'processPool');
        },
        _createSVGLanes: function () {
            var self = this;
            var lanes = [];

            var paper = self.options.configuration.processviewerPathsStageGroup;

            for (var k = self.options.hotspots.length - 1; k >= 0; k--) {
                if (self.options.hotspots[k].elementType === self.constants.ELEMENT_TYPE.LANE) {
                    lanes.push(self.options.hotspots[k]);
                    self.options.hotspots.splice(k, 1);
                }
            }

            self._createSVGRect(paper, lanes, 'lanes');
        },
        _createSVGMilestones: function () {
            var self = this, nTextRect;
            var milestones = [];

            var paper = self.options.configuration.processviewerPathsStageGroup;

            for (var k = self.options.hotspots.length - 1; k >= 0; k--) {
                if (self.options.hotspots[k].elementType === self.constants.ELEMENT_TYPE.MILESTONES) {
                    milestones.push(self.options.hotspots[k]);
                    self.options.hotspots.splice(k, 1);
                }
            }

            self._createSVGRect(paper, milestones, 'milestones');
        },
        _createSVGSequenceFlows: function () {
            var self = this, nText;
            var sequencesResults = [];
            var sequences = [];

            var paper = self.options.configuration.processviewerPathsStageGroup;


            for (var j = self.options.hotspots.length - 1; j >= 0; j--) {
                if ((self.options.hotspots[j].elementType === self.constants.ELEMENT_TYPE.SEQUENCEFLOW ||
                         self.options.hotspots[j].elementType === self.constants.ELEMENT_TYPE.ASSOCIATION) && self.options.hotspots[j].hasOwnProperty(self.constants.PROPERTIES.WAYPOINTS)) {
                    
                    sequences.push(self.options.hotspots[j]);
		    
		            if(self.options.hotspots[j].conditionType === self.constants.CONDITION_TYPE.NORMAL){
                    		self.options.hotspots.splice(j, 1);
		            }
                }
            }

            self._createSVGPaths(paper, sequences);

        },
        _createSVGRect: function (paper, elements, type) {

            var self = this;
            var textPadding = 16;
            var nTextRect;

            for (var l = 0; l < elements.length; l++) {
                var o = elements[l];

                if (o[self.constants.PROPERTIES.BOUNDS] === undefined) {
                    console.log(o);
                } else {

                    var bounds = o[self.constants.PROPERTIES.BOUNDS];
                    var nRect = paper.rect(bounds.x, bounds.y, bounds.width, bounds.height);

                    /* Set id for element */
                    if (o.bpmnElementRef) {
                        nRect[0].setAttribute('id', o.bpmnElementRef);
                    } else if (o.bpmnElement) {
                        if (o.bpmnElement.baref) {
                            if (o.bpmnElement.baref.ref) {
                                nRect[0].setAttribute('id', o.bpmnElement.baref.ref);
                            }
                        }
                    }

                    if (o.displayName === "")
                        o.displayName = "Lane";
                    if (o.displayName) {
                        nTextRect = paper.text((bounds.height / 2) * -1, 10, o.displayName);
                    }

                    if (o.elementType === self.constants.ELEMENT_TYPE.PROCESS) {
                        nTextRect.attr({
                            'font-weight': '600',
                            'y': (o.bounds.y + (bounds.height / 2)),
                            'x': 10                            
                        }).data("rotation", -90);

                        nTextRect.transform("r-90");
                    }

                    if (o.elementType === self.constants.ELEMENT_TYPE.MILESTONES) {
                        nTextRect.attr({
                            'font-weight': '600',
                            'y': o.bounds.y + textPadding,
                            'x': o.bounds.x + bounds.width / 2,
                        });

                        nRect.attr('height', self.options.milestonesHeight);

                        var pathX = o.bounds.x + o.bounds.width;
                        var initPathY = o.bounds.y + self.options.milestonesHeight;
                        var endPathY = o.bounds.height;

                        var pathLineString = self._getPathString([{ x: pathX, y: initPathY }, { x: pathX, y: endPathY}]);
                        var nPathLine = paper.path(pathLineString);

                        nPathLine.attr({ 'stroke': '#CCC', 'stroke-dasharray': '--' });

                        var ApathX = pathX - 1;

                        var pathArrowString = self._getPathString([{ x: ApathX, y: o.bounds.y }, { x: ApathX + self.options.milestonesHeight, y: self.options.milestonesHeight / 2 }, { x: ApathX, y: self.options.milestonesHeight}]);
                        var nPathArrow = paper.path(pathArrowString);

                        nPathArrow.attr({ 'stroke': '#CCC', 'fill': '#FFF' });
                    }

                    if (o.elementType === self.constants.ELEMENT_TYPE.LANE) {
                        var nTextWidth = ($(nTextRect.node).width() / 2) + (o.bounds.height / 2);
                        var nTextHeight = $(nTextRect.node).height();

                        nTextRect.attr({
                            'y': (o.bounds.y + (o.bounds.height / 2)),
                            'x': (o.bounds.x + 10),
                            'font-weight': '600'                       
                        }).data("rotation", -90);

                        nTextRect.transform("r-90");

                        var initPathLaneX = o.bounds.x + 30;
                        var endPathLaneY = o.bounds.height;

                        var nPathLaneString = self._getPathString([{ x: initPathLaneX, y: o.bounds.y + 25 }, { x: initPathLaneX, y: endPathLaneY}]);
                        var nPathLaneLimit = paper.path(nPathLaneString);

                        nPathLaneLimit.attr({ "stroke": "#E6E6E6", "fill": "none" });
                    }

                    var $nRect = $(nRect[0]);

                    if ($nRect.attr('id') && o.displayName) {
                        $(nTextRect[0]).data('id', o.id);
                    }

                    nRect.attr({ 'stroke': '#E6E6E6', 'fill': 'none' });

                    self._asignLabelFormat(nTextRect[0], o);
                }
            }
        },
        _createSVGPaths: function (paper, elements) {
            var self = this;

            for (var i = 0; i < elements.length; i++) {
                var o = elements[i];

                if (o[self.constants.PROPERTIES.WAYPOINTS] === undefined) {
                    console.log(o);
                } else {
                    var showRows = false;
                    
                    if (o.elementType !== self.constants.ELEMENT_TYPE.TEXTANNOTATION &&
                            o.conditionType !== self.constants.CONDITION_TYPE.RELATION &&
                                o.conditionType !== self.constants.CONDITION_TYPE.COMPENSATION){
                            showRows = true;
                    }
                    
                    var pathString = self._getPathString(o[self.constants.PROPERTIES.WAYPOINTS]);
                        pathString += (self.options.isIE8 && showRows)? self._getArrowPathString(o[self.constants.PROPERTIES.WAYPOINTS]) : "";
                    var nPath = paper.path(pathString);

                    /* Set id for element */
                    if (o.bpmnElementRef) {
                        nPath[0].setAttribute('id', o.bpmnElementRef);
                    } else if (o.bpmnElement) {
                        if (o.bpmnElement.baref) {
                            if (o.bpmnElement.baref.ref) {
                                nPath[0].setAttribute('id', o.bpmnElement.baref.ref);
                            }
                        }
                    }
                    
                    if (showRows) {
                        $(nPath.node).setMarkerSVG('normal');
                    }

                    var pathLength = nPath.getTotalLength() / 2;
                    var pathPoints = nPath.getPointAtLength(pathLength);
                    if (o.displayName) {
                        nText = paper.text(pathPoints.x, pathPoints.y, o.displayName);
                    }

                    var $path = $(nPath[0]);

                    if ($path.attr('id') && o.displayName) {
                        $(nText[0]).data('id', o.id);
                    }

                    if(o.conditionType === self.constants.CONDITION_TYPE.RELATION || o.conditionType === self.constants.CONDITION_TYPE.COMPENSATION){
                          nPath.attr({'stroke-dasharray': '.', 'stroke-width': '2'});
                    }

                    self._asignLabelFormat(nPath[0], o);
                }
            }
        },
 
        _createHTMLHotSpots: function () {
            var self = this;
            var hotSpotsResults = [];
            var hotspots = self.options.hotspots;
            var hotspotsContainer = self.options.configuration.processviewerHotSpotsContainer = $('<div class="processviewer-hotspots-container" data-processviewerhotspots style="position:absolute;"></div>');

            for (var i = 0; i < hotspots.length; i++) {
                var o = hotspots[i];
                if (o.bounds || o.x) {
                    o.number = i;
                    var resultHotSpot = self._createHotSpotDiv(o);

                    hotSpotsResults.push(resultHotSpot);
                    hotspotsContainer.append(resultHotSpot);
                }
            }

            $("[data-processviewer-wrapper-container]", self.element).prepend(hotspotsContainer);

            hotspotsContainer.on('click', '.processviewer-hotspot', function (event) {
                var numberHotSpot = $(this).data('number');
                var $this = $(this);
                if (self.options.hotspots[numberHotSpot].onClick) {
                    self.options.hotspots[numberHotSpot].onClick(event, $this);
                }
                self._triggers.click.apply($this, [self.element]);

            });

            hotspotsContainer.on('mouseenter', '.processviewer-hotspot', function (event) {
                var numberHotSpot = $(this).data('number');
                var $this = $(this);
                if (self.options.hotspots[numberHotSpot].onMouseOver) {
                    self.options.hotspots[numberHotSpot].onMouseOver(event, $this);
                }
                self._triggers.onMouseOver.apply($this, [self.element]);
            });

            hotspotsContainer.on('mouseout', '.processviewer-hotspot', function (event) {
                var numberHotSpot = $(this).data('number');
                var $this = $(this);
                if (self.options.hotspots[numberHotSpot].onMouseOut) {
                    self.options.hotspots[numberHotSpot].onMouseOut(event, $this);
                }
                self._triggers.onMouseOut.apply($this, [self.element]);

            });

            self.options.configuration.hotspotsList = $('.processviewer-hotspot');

        },
        _createHotSpotDiv: function (o) {
            var self = this, iconTmp, svgTmp;
            var hotSpot = $('<div class="processviewer-hotspot processviewer-hotspot-div" data-processviewerhotspot></div>');
            var hotSpotLabel = $('<div class="processviewer-hotspot-label" data-processviewerlabel></div>');
            var hsData = self._getHotSpotData(o);

            hotSpot.outerWidth(hsData.w);
            hotSpot.outerHeight(hsData.h);
            hotSpot.css('left', hsData.x + 'px');
            hotSpot.css('top', hsData.y + 'px');

            hotSpot.data('number', o.number);
            hotSpot.attr('number', o.number);

            if (o.bounds) {

                hotSpot.data('real-width', o.bounds.width);
                hotSpot.data('real-height', o.bounds.height);

                hotSpot.data('real-left', o.bounds.x);
                hotSpot.data('real-top', o.bounds.y);
            }


            if (o.displayName && o.elementType !== self.constants.ELEMENT_TYPE.SEQUENCEFLOW) {
                hotSpotLabel.text(o.displayName);
                hotSpot.append(hotSpotLabel);
            }

            if (o.elementType) {
                self._createIconsForHotSpots(hotSpot, o);
            }

            if (o.text) {
                if (o.text.content) {
                    hotSpotLabel.text(o.text.content);
                    hotSpot.append(hotSpotLabel);
                }
            }


            if (o.dataState) {
                if (o.dataState.displayName) {
                    hotSpotLabel.text(o.dataState.displayName);
                    hotSpot.append(hotSpotLabel);
                }
            }

            if (o.radius) {
                hotSpot.css('border-radius', o.radius);
            }

            if (o.css) {
                hotSpot.addClass(o.css);
            }

            if (o.loopCharacteristics) {

                if (o.loopCharacteristics.isSequential) {
                    hotSpot.addClass('issequential');
                } else if (!o.loopCharacteristics.isSequential) {
                    hotSpot.addClass('isparallel');
                }
            }

            self._asignLabelFormat(hotSpotLabel[0], o);


            /* CSS for BPM definition */
            if (o.elementType) 
                hotSpot.addClass(o.elementType.toLowerCase());

            if (o.conditionType)
                hotSpot.addClass(o.conditionType.toLowerCase());

            if (o.eventType)
                hotSpot.addClass(o.eventType.toLowerCase());

            if (o.subProcessType)
                hotSpot.addClass(o.subProcessType.toLowerCase());

            if (o.isForCompensation)
                hotSpot.addClass('isforcompensation');



            /* Set id for element */
            if (o.bpmnElementRef) {
                hotSpot.attr('id', o.bpmnElementRef);
            } else if (o.bpmnElement) {
                if (o.bpmnElement.baref) {
                    if (o.bpmnElement.baref.ref) {
                        hotSpot.attr('id', o.bpmnElement.baref.ref);
                    }
                }
            }



            if (o.content) {
                hotSpot.append(o.content);
            }

            return hotSpot;
        },
        _createIconsForHotSpots: function (hs, o) {
            var self = this;
            var iconTmp = o.elementType.toLowerCase();
            var hotSpotSVGIcon = $('<div class="processviewer-hotspot-icon" data-processviewericon></div>');
            hs.append(hotSpotSVGIcon);

            if ($.bizagi.processviewer.design.icons) {
                var scale = $.bizagi.processviewer.design.icons.scale;

                var w = $.bizagi.processviewer.design.icons.bounds.width * scale;
                var h = $.bizagi.processviewer.design.icons.bounds.height * scale;

                var svg = new Raphael(hotSpotSVGIcon[0], w, h);
                var g = svg.group();

                if (o.isForCompensation) {
                    iconTmp = 'isforcompensation';
                }

                var icon = $.bizagi.processviewer.design.icons.iconset[iconTmp];

                if (icon) {
                    svgTmp = icon.svg;
                    for (var i = 0; i < svgTmp.length; i++) {
                        var actSVG = svgTmp[i];
                        var typeTmp = actSVG.type;

                        var objSVGTmp = g[typeTmp]();

                        if (scale < 1) {
                            g.node.setAttribute('transform', 'scale(' + scale + ')');
                        }

                        for (var prop in actSVG.properties) {
                            objSVGTmp[0].setAttribute(prop, actSVG.properties[prop]);
                        }
                    }
                }
            }



        },
        _getPathString: function (points) {
            var self = this;
            var pathString = '';

            for (var i = 0; i < points.length; i++) {
                if (i === 0) {
                    pathString += 'M';
                }
                if (i > 0) {
                    pathString += 'L';
                }
                pathString += points[i].x + ',';
                pathString += points[i].y + ',';
            }

            return pathString;
        },
        _getArrowPathString: function(points){

            var pathString = "";
            var last = points[points.length - 1], nlast = points[points.length - 2];
            var x2 = nlast.x, x1 = last.x, y2 = nlast.y, y1 = last.y;

            var angle = Raphael.angle(x1, y1, x2, y2);
            var a135  = Raphael.rad(angle-135);
            var a135m = Raphael.rad(angle+135);
            var x1a = x1 + Math.cos(a135) * 10;
            var y1a = y1 + Math.sin(a135) * 10;
            var x1b = x1 + Math.cos(a135m) * 10;
            var y1b = y1 + Math.sin(a135m) * 10;

            return "M"+x1+","+y1+",L"+x1a+","+y1a+",M"+x1+","+y1+",L"+x1b+","+y1b;
        },
        _getHotSpotData: function (o) {
            var rValue = { x: 0, y: 0, w: 0, h: 0 };

            if (o.x) {
                rValue.x = o.x;
            } else if (o.bounds.x) {
                rValue.x = o.bounds.x;
            }

            if (o.y) {
                rValue.y = o.y;
            } else if (o.bounds.y) {
                rValue.y = o.bounds.y;
            }

            if (o.w) {
                rValue.w = o.w;
            } else if (o.bounds.width) {
                rValue.w = o.bounds.width;
            }

            if (o.h) {
                rValue.h = o.h;
            } else if (o.bounds.height) {
                rValue.h = o.bounds.height;
            }

            return rValue;
        },

        //TODO:
        _createSVGHotSpots: function () {
            var self = this;
            var hotspots = self.options.hotspots;

            for (var i = 0; i < hotspots.length; i++) {
                //console.log('hotspots: '+ i);
                var o = hotspots[i];
                var tmpHotSpot = self.options.configuration.processviewerStage.rect(o.x, o.y, 50, 50);
                tmpHotSpot.id = o.id;

                if (typeof o.onClick === 'function') {
                    tmpHotSpot.click(o.onClick);
                } else {
                    tmpHotSpot.click(self._triggers.click);
                }

                var hsMouseOver = self._triggers.onMouseOver;
                var hsMouseOut = self._triggers.onMouseOut;

                if (typeof o.onMouseOver === 'function') {
                    hsMouseOver = o.onMouseOver;
                }

                if (typeof o.onMouseOut === 'function') {
                    hsMouseOut = o.onMouseOut;
                }

                tmpHotSpot.hover(hsMouseOver, hsMouseOut);

                tmpHotSpot.node.id = o.id;
                tmpHotSpot.node['class'] = o.css;

                self.options.configuration.processviewerstageHotSpotSet.push(tmpHotSpot);
            }

            self.options.configuration.processviewerStageSet.push(self.options.configuration.processviewerstageHotSpotSet);
        },
        _triggers: {
            click: function ($element) {
                var hsProperties = {
                    type: "pvClick",
                    message: "hotspot clicked",
                    time: new Date(),
                    ui: {
                        control: this,
                        id: $(this).attr('id')
                    }
                };

                $element.trigger(hsProperties);
            },
            onMouseOver: function ($element) {
                var hsProperties = {
                    type: "pvMouseIn",
                    message: "hotspot mouse in",
                    time: new Date(),
                    ui: {
                        control: this,
                        id: $(this).attr('id')
                    }
                };

                $element.trigger(hsProperties);
            },
            onMouseOut: function ($element) {
                var hsProperties = {
                    type: "pvMouseOut",
                    message: "hotspot mouse out",
                    time: new Date(),
                    ui: {
                        control: this,
                        id: $(this).attr('id')
                    }
                };

                $element.trigger(hsProperties);
            },
            error: function (obj) {
                var self = this;
                var controlProperties = {
                    type: "pvError",
                    time: new Date()
                };

                $.extend(obj, controlProperties);

                $.event.trigger(obj);
            }
        },
        _createUIFailView: function (src) {
            var self = this;

            var errorDiv = $('<div class="' + self.options.configuration.errorImageCSS + ' svg-error-content"><div class="processviewer-absolute-center"><img src="' + self.options.unavailableImage + '" class="processviewer-absolute-center"/></div><span class="processviewer-message">' + src + '</span></div>');

            $('[data-processviewercontainer]', self.element).append(errorDiv);
        },
        _verifyingImage: function (src) {
            var self = this;
            var deferred = $.Deferred();

            var image = document.createElement('img');
            image.onload = function () {

                deferred.resolve(image);
            };

            image.onerror = function () {
                deferred.reject(src);
            };

            image.src = src;

            return deferred.promise();

        },
        _getStageContainer: function (id) {
            var self = this;
            //console.log('_getStageContainer',$('[data-processviewer-wrapper-container]', self.element)[0]);
            return $('[data-processviewer-wrapper-container]', self.element)[0];
        },
        _generateID: function () {
            var self = this;

            var d = new Date().getTime();
            var uuid = 'processviewer-xxxxxxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
            });

            if ($('#' + uuid).length > 0) {
                return self._generateID();
            } else {
                return uuid;
            }
        },
        _adjustLabelsPosition: function () {
            var self = this;

            var labels = $('.processviewer-hotspot-label', self.element);
            var container = labels.closest('.processviewer-hotspot');

            for (var i = 0; i < labels.length; i++) {
                var lbl = $(labels[i]);
                var lblParent = lbl.closest('.processviewer-hotspot');
                var lblParentH = lblParent.outerHeight();

                if (!lblParent.hasClass('subprocess') && !lblParent.hasClass('callactivity') && !lblParent.hasClass('dataobject')) {
                   if(self.options.isIE8) lbl.css({ paddingTop: "1.8em" });
                } else {
                    var tmpTop = $._ptToem(lblParentH + 10);
                    lbl.css({ paddingTop: tmpTop });
                }
            }
        },
        _setOption: function (key, value) {
            this.options[key] = value;
            this._update();
        },

        _update: function () {
            var progress = this.options.value + "%";
            this.element.text(progress);
            if (this.options.value === 100) {
                this._trigger("complete", null, { value: 100 });
            }
        },

        _destroy: function () {
            this.element
                        .empty()
                        .removeAttr('style', '')
                        .removeAttr('role', '');
            clearInterval(this.options.animation.interval);
        },

        _getSelectedClassCSSByWorkitemState: function(guid, currentTasks){
            var self = this;
            var WORKITEM_STANDBY_STATE = 14;

            //Determinate workitem have standby state
            var currentWorkItemByGuid;
            if(currentTasks && currentTasks.filter){
                currentWorkItemByGuid = currentTasks.filter(function (task) {
                    return task.guidTask === guid;
                });
            }
            var standByWorkItem = (currentWorkItemByGuid && currentWorkItemByGuid.length > 0 && currentWorkItemByGuid[0].wiState == WORKITEM_STANDBY_STATE);

            var classCSSSelected = 'processviewer-shape-selected';
            if(standByWorkItem){
                classCSSSelected = 'processviewer-shape-selected-standby';
            }
            return classCSSSelected;
        },

        selectShape: function (shape, currentTasks) {

            var self = this;
            var guids = ($.isArray(shape)) ? shape : [shape];

            for (var i = 0, length = guids.length; i < length; i++) {
                var el = $('#' + guids[i], self.$el);
                
                if(el.length){

                    var classCSSSelected = self._getSelectedClassCSSByWorkitemState( guids[i], currentTasks);

                    var tagName = el.prop('tagName').toLowerCase();

                    if (tagName !== 'div') {
                        el.addClassSVG(classCSSSelected);
                        el.setMarkerSVG('selected');
                    } else {
                        el.addClass(classCSSSelected);
                    }
                }
            }
        },

        unSelectShape: function (shape, currentTasks) {
            var self = this;
            var guids = ($.isArray(shape)) ? shape : [shape];

            for (var i = 0, length = guids.length; i < length; i++) {

                var el = $('#' + guids[i], self.$el);
                var tagName = el.prop('tagName').toLowerCase();

                var classCSSSelected = self._getSelectedClassCSSByWorkitemState( guids[i], currentTasks);

                if (tagName !== 'div') {
                    el.removeClassSVG(classCSSSelected);
                    el.reverseMarkerSVG();
                } else {
                    el.removeClass(classCSSSelected);
                }
            }
        },

        unSelectAllShapes: function () {
            var self = this;
            var shapes = $('.processviewer-shape-selected', self.$el);

            for (var i = 0; i < shapes.length; i++) {
                var el = $(shapes[i]);
                var tagName = el.prop('tagName').toLowerCase();

                if (tagName !== 'div') {
                    el.removeClassSVG('processviewer-shape-selected');
                    el.reverseMarkerSVG();
                } else {
                    el.removeClass('processviewer-shape-selected');
                }
            }
        },
        drawRoute: function (shapes) {
            var self = this;
            var errShapes = [];

            for (var i = 0; i < shapes.length; i++) {
                var el = $('#' + shapes[i], self.$el);
                if (el.length > 0) {
                    var tagName = el.prop('tagName').toLowerCase();

                    if (tagName !== 'div') {
                        el.addClassSVG('processviewer-highlighted');
                        el.setMarkerSVG('highlighted');
                    } else {
                        el.addClass('processviewer-highlighted');
                    }
                } else {
                    errShapes.push(shapes[i]);
                }
            }

            self._triggers.error({ message: "Doesn't find element", ui: errShapes });
        },
        animateRoute: function (path) {

            var self = this;
            var counter = self.option.counter;

            //if path exist, reset animation vars
            if (($.isArray(path))) {
                self.options.animation.counter = 0;
                self.options.animation.path = path;
                self.options.animation.status = 0;
            }

            if (self.options.animation.status === 0) {
                self._startRouteAnimation();
            } else {
                self._stopRouteAnimation();
            }

        },
        _startRouteAnimation: function () {

            var self = this;
            var path = self.options.animation.path;

            //change status
            self.options.animation.status = 1;

            if (self.options.animation.counter === 0) self.clearRoute();

            self.options.animation.interval = setInterval(function () {


                if (self.options.animation.counter < path.length) {
                    var el = $('[id=' + path[self.options.animation.counter] + ']', self.$el).last();
                    if (el.length > 0) {
                        var tagName = el.prop('tagName').toLowerCase();

                        if (tagName !== 'div') {
                            el.addClassSVG('processviewer-highlighted');
                            el.setMarkerSVG('highlighted');

                            el[0].strokecolor = "#FF7F00";

                            
                        } else {
                            el.addClass('processviewer-highlighted');
                        }
                    }
                    self.options.animation.counter++;
                } else { 

                    self.element.trigger({
                            type: "animationComplete",
                            message: "animation end!",
                            time: new Date(),
                            ui: self.$el
                    });
                            
                    self.options.animation.counter = 0;
                    self._stopRouteAnimation();
                }
            }, self.options.animation.time);

        },
        _stopRouteAnimation: function () {
            var self = this;

            //change status
            self.options.animation.status = 0;
            clearInterval(self.options.animation.interval);
        },
        _isInWorkportal:function(){
            var result = false;

            if(typeof bizagi !== 'undefined'){
                if(typeof bizagi.workportal !== 'undefined'){
                    result = true;
                }
            }

            return result;
        },
        clearRoute: function () {
            var self = this;

            var shapes = $('.processviewer-highlighted', self.$el);

            for (var i = 0; i < shapes.length; i++) {
                var el = $(shapes[i]);
                var tagName = el.prop('tagName').toLowerCase();

                if (tagName !== 'div') {
                    el.removeClassSVG('processviewer-highlighted');
                    el[0].strokecolor = "#000";
                    el.reverseMarkerSVG();
                } else {
                    el.removeClass('processviewer-highlighted');
                }
            }
        },
        validateHTML5Features: {
            checkInput: function (type) {
                var input = document.createElement("input");
                input.setAttribute("type", type);
                return input.type == type;
            }
        }

    });

    $.fn.addClassSVG = function (options) {

        var nClass = arguments[0];

        options = $.extend({}, $.fn.addClassSVG.config, options);

        return this.each(function () {

            var element = this;
            var oldClass = element.getAttribute('class');
            var newClass = '';

            if (oldClass === null) {
                oldClass = '';
            }


            if (typeof nClass === "string") {
                if (oldClass.indexOf(nClass) === -1) {
                    newClass = oldClass + ' ' + nClass;

                    element.setAttribute('class', newClass);
                }
            }


        });
    };

    $.fn.addClassSVG.config = {};


    $.fn.setMarkerSVG = function (options) {
        var nMarker = 'url(#' + arguments[0] + ')';

        options = $.extend({}, $.fn.addClassSVG.config, options);

        return this.each(function () {

            var element = this;
            var oldMarker = element.getAttribute('marker-end');

            if (oldMarker != nMarker) {
                element.setAttribute('marker-end', nMarker);
                element.setAttribute('toggle-marker-end', oldMarker);
            }

        });
    };

    $.fn.reverseMarkerSVG = function () {

        return this.each(function () {

            var element = this;
            var actualMarker = element.getAttribute('marker-end');
            var oldMarker = element.getAttribute('toggle-marker-end');
            if (oldMarker !== null && actualMarker !== null) {
                element.setAttribute('marker-end', oldMarker);
                element.removeAttribute('toggle-marker-end');
            }

        });
    };

    $.fn.removeClassSVG = function (options) {

        var nClass = arguments[0];

        options = $.extend({}, $.fn.addClassSVG.config, options);

        return this.each(function () {

            var element = this;
            var oldClass = element.getAttribute('class');
            var newClass = '';

            if (oldClass !== null) {
                if (typeof nClass === "string") {
                    if (oldClass.indexOf(nClass) !== -1) {
                        newClass = oldClass.replace(nClass, '').replace('  ', ' ');
                        element.setAttribute('class', newClass);
                    }
                }
            }

        });
    };

    $.fn.removeClassSVG.config = {};


    $.fn.hasClassSVG = function (options) {

        var nClass = arguments[0];
        var element = this[0];
        var oldClass = element.getAttribute('class');
        var newClass = '';
        var hClass = false;

        if (oldClass !== null) {
            if (typeof nClass === "string") {
                if (oldClass.indexOf(nClass) !== -1) {
                    hClass = true;
                }
            }
        }

        return hClass;
    };

    $.fn.attrSVG = function (properties) {
        var self = this[0];
        for (var prop in properties) {
            self.setAttribute(prop, properties[prop]);
        }

        return self;

    };


    $._ptToem = function (pt, pf) {
        if (!pf) {
            pf = 12;
        }
        return (pt / pf) + 'em';
    };




})(jQuery);