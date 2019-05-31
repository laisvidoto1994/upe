/**
 * Activity map plugin, create a sequence of activities related to a process
 *
 * @author Edward J Morales
 */
(function($) {

	$.widget("diagram.activityMap", {
		options: {
			width: 100,
			height: 100,
			format: {},
			spaceInterLine: 110,
			verticalPadding: 50,
			background: {
				lineColor: "#D8D8D8"
			},
			activities: {},
			legendProcess: {},
			showByTime: false,
			timeWindowInterval: 2000, // MilliSeconds,
			cssClass: "activity-map-tooltip activity-map-activity-default-status",
			cssClassHighlight: "activity-map-tooltip activity-map-activity-highlight",
			colorCurrentActivity: "rgba(255, 0, 0, 0.2)",
			colorList: "#FEC107,#FF5521,#795549,#0173BF,#7cb5ec,#434348,#90ed7d,#f7a35c,#8085e9,#f15c80,#e4d354,#2b908f,#F44236,#E91D62,#9C26B0,#6739B6,#3E50B4,#01BBD4,#019587,#4BAF4F,#8BC24A".split(","),
			data: {},
            currentActivity:""
		},
		/**
		 * Constructor
		 * @private
		 */
		_create: function() {
			var self = this;
			var options = this.options;
			var data = options.data || {};
			var id = self.element.context.id || "body";
			var $legend = $("<div id='legend-box'></div>");
			$(self.element.parent()).prepend($legend);
			self._stickPath = false;
			self._stickActivity = "";
			self.activitiesPositionReference = {};
			self.nodePosition = {};

			self.mouseEventHelper = {
				hover: function (el, funcIn, funcOut) {
					var entered = false;
					el.hover(
						function (e) {
							if (entered) {
								return;
							}

							funcIn(e);
							entered = true;
						},
						function (e) {
							funcOut(e);
							entered = false;
						}
					);
				}
			};


			this.diagram = Raphael(id, options.width, options.height);

			var processList = self._mapProcessListWithColors(self._getProcessList(data.processes), options.colorList);
			var circleRadius = 10;

			var legendProcess = self._getLegendProcess({
				paper: '#legend-box',
				processList: processList
			});

			$(this.diagram.canvas).append();
			var sortedData = self.sortWorkItemsByDate(data.activities);
			var uniqueDateReference = self._getUniqueTimeReference(sortedData);

			// Draw Background
			self.dateColumnsPosition = self._drawBackgroundDateColumns({
				paper: this.diagram,
				dateList: uniqueDateReference,
				positionX: 0,
				spaceInterLine: options.spaceInterLine,
				lineColor: options.background.lineColor
			});

			var activities = self._drawActivities({
				paper: this.diagram,
				activityList: self._getActivityTree(sortedData),
				processList: processList,
				positionX: (options.spaceInterLine / 2),
				positionY: 80,
				spaceInterLine: options.spaceInterLine,
				verticalPadding: 50,
				circleRadius: circleRadius,
				textPosition: "top", //top,bottom,left,right,
				cssClass: options.cssClass,
				cssClassHighlight: options.cssClassHighlight,
				attributes: {
					"font-size": "11"
				}
			});

			self.lines = self._drawActivityLines({
				paper: this.diagram,
				activitiesPositionReference: activities,
				attributes: {}
			});

			self._viewBoxWidth = self.element.outerWidth();
			self._viewBoxHeight = self.element.outerHeight();

			self.viewBox = this.diagram.setViewBox(-1, -1, self._viewBoxWidth, self._viewBoxHeight);
			self.viewBox.X = 0;
			self.viewBox.Y = 0;

			var widthContainerCanvas = (self.diagram.canvas.getBBox && self.diagram.canvas.getBBox() && self.diagram.canvas.getBBox().width) ? self.diagram.canvas.getBBox().width : self.diagram.canvas.attributes.width;
			var heightContainerCanvas = (self.diagram.canvas.getBBox && self.diagram.canvas.getBBox() && self.diagram.canvas.getBBox().height) ? self.diagram.canvas.getBBox().height : self.diagram.canvas.attributes.height;

		    var containerWidth = self.element.outerWidth() > widthContainerCanvas ? self.element.outerWidth() : (widthContainerCanvas + 25),
				containerHeight = self.element.outerHeight() > heightContainerCanvas ? self.element.outerHeight() : heightContainerCanvas;


			self._configureHandlers();
		},

		/**
		 * Set binding of diagram elements
		 * @private
		 */
		_configureHandlers: function() {
			var self = this;
			var _startX, _startY;
			var _mousedown = false;
			var _dX = 0, _dY = 0;

			self.element.bind("zoom", function(e, value) {
				self._zoom(value);
			});

			self.element.mousedown(function(e) {
				if(self.diagram.getElementByPoint(e.pageX, e.pageY) != null) {
					return;
				}
				_mousedown = true;
				_startX = e.pageX;
				_startY = e.pageY;
			});

			self.element.mousemove(function(e) {
				if(_mousedown == false) {
					return;
				}
				_dX = _startX - e.pageX;
				_dY = _startY - e.pageY;

				var x = self._viewBoxWidth / self.element.outerWidth(),
					y = self._viewBoxHeight / self.element.outerHeight();
				_dX *= x;
				_dY *= y;
				self.diagram.setViewBox(self.viewBox.X + _dX, self.viewBox.Y + _dY, self._viewBoxWidth, self._viewBoxHeight);

			});

			self.element.mouseup(function(e) {
				if(_mousedown == false) return;
				self.viewBox.X += _dX;
				self.viewBox.Y += _dY;
				_mousedown = false;
			});

		},

		/**
		 * Make zoom in or zoom out
		 * @param delta
		 * @private
		 */
		_zoom: function(delta) {
			var vBHo = this.element.outerHeight();
			var vBWo = this.element.outerWidth();
			delta = parseFloat(delta);
			this._viewBoxWidth = vBWo * (2 - delta);
			this._viewBoxHeight = vBHo * (2 - delta);
			this.diagram.setViewBox(this.viewBox.X, this.viewBox.Y, this._viewBoxWidth, this._viewBoxHeight);
		},

		/**
		 * Detect circle collision
		 * @param x1
		 * @param y1
		 * @param r1
		 * @param x2
		 * @param y2
		 * @param r2
		 * @return {boolean}
		 * @private
		 */
		_circleCollision: function(x1, y1, r1, x2, y2, r2) {
			var circle1 = {radius: r1, x: x1, y: y1};
			var circle2 = {radius: r2, x: x2, y: y2};

			var dx = circle1.x - circle2.x;
			var dy = circle1.y - circle2.y;
			var distance = Math.sqrt(dx * dx + dy * dy);

			return (distance < circle1.radius + circle2.radius)
		},

		/**
		 * Verify if some position already have a node
		 * @param x
		 * @param y
		 * @param guidWorkitem
		 * @param activityList
		 * @return {boolean}
		 * @private
		 */
		_hasNodeCollision: function(x, y, guidWorkitem,activityList) {
			activityList = activityList || [];
			guidWorkitem = guidWorkitem || "";
			var collision = false;
			var radio = 20;
			var self = this;

			$.each(activityList, function(key, value) {
				if(value.rendered && guidWorkitem != value.guidWorkitem && self._circleCollision(value.x, value.y, radio, x, y, radio)) {
					collision = true;
				}
			});

			return collision;
		},


		/**
		 * Get object with legend of process
		 * @param args
		 * @private
		 */
		_getLegendProcess: function(args) {
			var self = this;
			var processList = args.processList || {};
			var $node;

			// Make a wrapper of legend
			var $content = $("<div></div>");

			$.each(processList, function(key, value) {
				$node = $('<div class="activity-map-legend-row"><a class="activity-map-legend-row-process"></a><span class="activity-map-legend-row-label">' + value.name + '</span></div>');
				$node.find(".activity-map-legend-row-process").css({
					"background-color": value.color,
					"border-color": value.color
				});

				$node.data({
					"guidProcess": key
				});

				$content.append($node);
			});

			if(Object.keys(processList).length > 1){
				$(args.paper).append('<h2 class="activity-map-legend-title">Processes</h2>');
			}
			$(args.paper).append($content);

			self.element.bind("activity.mouseenter", function(e, args) {
				$(".activity-map-legend-row").filter(function() {
					return $(this).data("guidProcess") == args.guidProcess;
				}).each(function() {
					$(this).addClass("activity-map-highlight");
				});
			}).bind("activity.mouseleave", function() {
				$(".activity-map-highlight").removeClass("activity-map-highlight");
			});

		},

		/**
		 * Process a data, make transformations if its necessary
		 * @param data
		 * @return {*|{}}
		 * @private
		 */
		_getProcessList: function(data) {
			data = data || {};
			return data;
		},

		/**
		 * Create mapping of process with colors
		 * @param processList
		 * @param colorList
		 * @return {{}}
		 * @private
		 */
		_mapProcessListWithColors: function(processList, colorList) {
			var mapProcessList = {};
			var processColor;
			processList = processList || [];
			colorList = colorList || [];

			$.each(processList, function(key, value) {
				processColor = (processColor && processColor.length > 0) ? processColor : colorList.slice(0);
				mapProcessList[key] = {name: value, color: processColor.pop()};
			});
			return mapProcessList;
		},

		/**
		 * Get Activity list, make transformations if its necessary
		 * @param data
		 * @return {*|{}}
		 * @private
		 */
		_getActivityList: function(data) {
			data = data || {};
			return data;
		},


		/**
		 * Create a tree of activities, make an object with activity: {a:"",b:"",children:objectReference}
		 * @param data
		 * @return {Array}
		 * @private
		 */
		_getActivityTree: function(data) {
			var tree = [];
			data = data || {};

			var findByProperty = function(property, propertyValue) {
				var node = [];
				property = property || "";

				$.each(data, function(key, value) {
					if(typeof value[property] != "undefined" && value[property] == propertyValue) {
						// Mark node to referenced
						value.referenced = true;
						node.push(value);
					}
				});
				return node;
			};

			$.each(data, function(key, value) {
				value.children = findByProperty("parentWorkItem", value.guidWorkitem);
				tree.push(value);
			});
			return tree;
		},

		/**
		 * Keep a global object reference of position of each node
		 * @param guidNode
		 * @param position
		 * @private
		 */
		_addNodePosition: function(guidNode, position) {
			guidNode = guidNode || "";
			this.nodePosition[guidNode] = position;
		},

		/**
		 * Get a specific position of node
		 * @param guidNode
		 * @return {*}
		 * @private
		 */
		_getNodePosition: function(guidNode) {
			return (guidNode) ? this.nodePosition[guidNode] : this.nodePosition;
		},

		/**
		 * Engine that calculate a rigth position of one node
		 * @param args
		 * @return {{x: (*|number), y: (number|*)}}
		 * @private
		 */
		_getActivityPositionEngine: function(args) {
			var activity = args.activity;
			var previousActivity = args.previousActivity;
			var initialPosition = {x: args.positionX || 10, y: args.positionY || 10};
			var verticalPadding = args.verticalPadding || 20;
			var spaceInterLine = args.spaceInterLine || 50;
			var activityList = args.activityList || [];

			if(!previousActivity) {
				return initialPosition;
			}
			var initialColumnPositionX = this._getColumnPositionByGuidWorkItem(activity.guidWorkitem);


			var incrementY = function(basePosition) {
				initialPosition.y = (basePosition) ? basePosition.y : initialPosition.y;
				initialPosition.y = initialPosition.y + verticalPadding;
			};


			// This node and his parent are activities of the same process
			if(previousActivity.guidProcess == activity.guidProcess && previousActivity.idCase == activity.idCase  && activity.parentWorkItem == previousActivity.guidWorkitem) {
				if(this._hasNodeCollision(initialColumnPositionX, initialPosition.y, activity.guidWorkitem, activityList)) {
					incrementY();
				}
			} else if(previousActivity.parentWorkItem == activity.parentWorkItem) {
				// This node has the same parent that previous node
				incrementY();
			} else {
				// This is a subprocess
				var positionReference = this._getNodePosition(activity.parentWorkItem);
				//	incrementX(positionReference.positionReference); // Base position is his parent
				incrementY();
			}
			initialPosition.x = initialColumnPositionX;
			return initialPosition;
		},

		/**
		 * Sort data by Parent Guid Process
		 * @param workitems
		 * @param parentGuidProcess
		 * @return {*|Array}
		 * @private
		 */
		_sortWorkItemsByParentGuidProcess: function(workitems, parentGuidProcess) {
			workitems = workitems || [];
			try {
				workitems.sort(function(workitemA, workitemB) {
					if(workitemA.guidProcess == parentGuidProcess) {
						return -1;
					} else if(workitemB.guidProcess == parentGuidProcess) {
						return 1;
					} else {
						return 0;
					}
				});
			} catch(e) {
				e.toString();
			}
			return workitems;
		},

		/**
		 * Sort data by creation date
		 * @param workitems
		 * @return {*|Array}
		 */
		sortWorkItemsByDate: function(workitems) {
			workitems = workitems || [];
			var dateA, dateB, timeA, timeB;

			try {
				workitems.sort(function(workitemA, workitemB) {
					dateA = new Date(workitemA.creationDate);
					dateB = new Date(workitemB.creationDate);
					timeA = dateA.getTime();
					timeB = dateB.getTime();

					if(timeA < timeB) {
						return -1;
					} else if(timeA > timeB) {
						return 1;
					} else {
						return 0;
					}
				});
			} catch(e) {
				e.toString();
			}
			return workitems;
		},

		/**
		 * Get an Object with list of distinct creationdate values
		 * @param data
		 * @return {{}}
		 * @private
		 */
		_getUniqueTimeReference: function(data) {
			data = data || {}; // sorted list of activities
			var timeColumns = {};
			var actualTime, previousTime, previousTimeMillisecond = 0;
			var timeWindowInterval = this.options.timeWindowInterval;

			$.each(data, function(key, value) {
				actualTime = new Date(value.creationDate);

				if(!previousTime) {
					// Add first node or new node
					timeColumns[value.creationDate] = [];
					timeColumns[value.creationDate].push(value);
					previousTime = value.creationDate;
					var a = new Date(value.creationDate);
					previousTimeMillisecond = a.getTime();
				} else if(actualTime.getTime() < (previousTimeMillisecond + timeWindowInterval)) {
					// Add node within previous column interval
					timeColumns[previousTime].push(value);
				} else {
					// Add new column interval
					timeColumns[value.creationDate] = [];
					timeColumns[value.creationDate].push(value);
					previousTime = value.creationDate;
					var a = new Date(value.creationDate);
					previousTimeMillisecond = a.getTime();
				}
			});
			return timeColumns;
		},

		/**
		 * Get X position of column
		 * @param guidWorkitem
		 * @return {number}
		 * @private
		 */
		_getColumnPositionByGuidWorkItem: function(guidWorkitem) {
			var self = this;
			var workItemPosition = 0;
			guidWorkitem = guidWorkitem || "";

			$.each(self.dateColumnsPosition, function(key, value) {
				if(key == guidWorkitem) {
					workItemPosition = value;
				}
			});
			return workItemPosition;
		},

		/**
		 * Draw background lines indicate each distinct creationdate
		 * @param args
		 * @private
		 */
		_drawBackgroundDateColumns: function(args) {
			var dateList = args.dateList || [];
			var paper = args.paper || Raphael("body", 0, 0);
			var initialPosition = {x: args.positionX || 0};
			var positionReference, creationDate, currentDate, currentTime, columnPositionX, workItemPositionX = {};
			var linesPathPattern = "M%d,%d L%d,%d";
			var spaceInterLine = args.spaceInterLine || 50;
			var lineColor = args.lineColor || "#000000";


			//plus 50 px to leave a margin in the bottom
			var heightDiagramCanvas = (this.diagram.canvas.getBBox && this.diagram.canvas.getBBox() && this.diagram.canvas.getBBox().height )? this.diagram.canvas.getBBox().height:this.diagram.canvas.attributes.height;

			var heightLines = this.element.outerHeight() >heightDiagramCanvas ? this.element.outerHeight() + 150 : (heightDiagramCanvas + 150);

			var index = 0;
			$.each(dateList, function(key, value) {
				positionReference = (positionReference) ? positionReference : $.extend(true, {}, initialPosition);


				creationDate = new Date(key);
				currentDate = $.datepicker.formatDate("M, dd", creationDate);
				currentTime = key.split(" ")[1];


				columnPositionX = (positionReference.x + (spaceInterLine / 2));

				if(index > 0) {

					var path = paper.path(printf(linesPathPattern, positionReference.x, 0, positionReference.x, heightLines)).attr({
						"stroke": lineColor,
						"stroke-width": "1px",
						"stroke-opacity": 0.4
					});
					$(path.node).addClass("activity-map-background-line");
				}

				var activityDate = paper.text(columnPositionX, 10, currentDate).attr({"font-size": "20px"});
				activityDate.node.setAttribute("class", "activity-map-activity-date");

				var activityTime = paper.text(columnPositionX, 30, currentTime).attr({"font-size": "16px"});
				activityTime.node.setAttribute("class", "activity-map-activity-time");

				// Keep position reference for each workitem
				$.each(value, function(key, value) {
					workItemPositionX[value.guidWorkitem] = columnPositionX;
				});

				// Set new position of reference, next column
				positionReference.x = positionReference.x + spaceInterLine;
				index += 1;
			});
			return workItemPositionX;
		},

		/**
		 * Draw all activities on paper with respective position
		 * @param args
		 * @return {*}
		 * @private
		 */
		_drawActivities: function(args) {
			var self = this;
			var paper = args.paper || Raphael("body", 0, 0);
			var activityList = args.activityList || [];
			var textPosition = args.textPosition || "top"; //top,bottom,left,right
			var initialPosition = {x: args.positionX || 0, y: args.positionY || 10};
			var processList = args.processList || {};
			var verticalPadding = args.verticalPadding || 20;
			var spaceInterLine = args.spaceInterLine || 50;
			var circleRadius = args.circleRadius || 10;
			var circleDiameter = circleRadius * 2;
			var positionReference, positionReferenceText, circleColor, previousActivity;
			var attributes = args.attributes || {};
			var cssClass = args.cssClass || "";
			var st = paper.set();
			/**
			 * Draw list of nodes
			 * @param node
			 */
			var drawNodes = function(node) {
				if(!node.rendered) {
					positionReference = (positionReference) ? positionReference : $.extend(true, {}, initialPosition);
					positionReference = self._getActivityPositionEngine({
						previousActivity: previousActivity,
						activity: node,
						positionX: positionReference.x,
						positionY: positionReference.y,
						verticalPadding: verticalPadding,
						spaceInterLine: spaceInterLine,
						activityList: activityList
					});
					node.x = positionReference.x;
					node.y = positionReference.y;
					drawNode(positionReference, node);

					// Draw node and his childs
					if(node.children.length > 0) {
						// Sort children based on his parent
						node.children = self._sortWorkItemsByParentGuidProcess(node.children, node.guidProcess);
						$.each(node.children, function(childKey, childValue) {
							drawNodes(childValue);
						});
					}
				}
			};

            /**
             * Set data to element
             * @param elementJquery
             * @param data
             */
            var assignDataToElement = function(elementJquery, data){
                elementJquery.data({
                    "guidProcess": data.guidProcess,
                    "guidWorkitem": data.guidWorkitem,
                    "idCase": data.idCase,
                    "idWorkflow": data.idWorkFlow
                });
            };

			/**
			 * Draw a specific node
			 * @param positionReference
			 * @param value
			 * @return {*}
			 */
			var drawNode = function(positionReference, value) {
                circleColor = processList[value.guidProcess].color;

				// Draw elements
				var circle = paper.circle(positionReference.x, positionReference.y, circleRadius).attr({
					"fill": circleColor,
					"stroke": circleColor
				});

                assignDataToElement($(circle.node), value);
                assignDataToElement(circle, value);

				circle.toFront();

				if (self.options.currentActivity == value.idCase) {
				    var currentActivityCircle = paper.circle(positionReference.x, positionReference.y, circleRadius + 5).attr({
				        "fill": self.options.colorCurrentActivity,
				        "stroke": self.options.colorCurrentActivity
				    });

                    assignDataToElement($(currentActivityCircle.node), value);
                    assignDataToElement(currentActivityCircle, value);

                    currentActivityCircle.toBack();
				    st.push(currentActivityCircle);
				}

				circle.node.setAttribute("class", cssClass);
				st.push(circle);

				circle.hover(function() {
					var node = this.data();
					self.element.trigger("activity.mouseenter", [node]);

					if(!self._stickPath) {
						$(this.node).addClass("activity-map-activity-highlight");
						self._highlight({guidWorkitem: node["guidWorkitem"], highlight: true});
					}
				}, function() {
					var node = this.data();
					self.element.trigger("activity.mouseleave", [node]);

					if(!self._stickPath) {
						$(this.node).removeClass("activity-map-activity-highlight");
						self._highlight({guidWorkitem: node["guidWorkitem"], highlight: false});
					}

				}).click(function() {
					var node = this.data();
					self._stickAllPath(node["guidWorkitem"]);
				});

				$("#bz-activity-map").mouseover(function () {
				    $(".activity-map-tooltip").mouseout();
				});

				positionReferenceText = drawText(value.name, positionReference, value.guidWorkitem, value.creationDate);

				// Keep references
				self._addNodePosition(value.guidWorkitem, {
					positionReference: positionReference,
					positionReferenceText: positionReferenceText,
					color: circleColor,
					parentWorkItem: value.parentWorkItem,
					circleRadius: circleRadius
				});

				previousActivity = value;

				// Mark node that has been rendered
				value.rendered = true;

				return positionReference;
			};

			/**
			 * Draw name of activity
			 * @param name
			 * @param positionReference
			 * @param guid
			 * @param date
			 * @return {*}
			 */
			var drawText = function(name, positionReference, guid, date) {
				//Set position reference of text
				switch(textPosition) {
					case "top":
						positionReferenceText = {x: positionReference.x, y: (positionReference.y - circleDiameter)};
						break;
					case "bottom":
						positionReferenceText = {x: positionReference.x, y: (positionReference.y + circleDiameter)};
						break;
					case "left":
						positionReferenceText = {
							x: positionReference.x - circleDiameter,
							y: positionReference.y,
							'text-anchor': 'end'
						};
						break;
					case "right":
						positionReferenceText = {
							x: positionReference.x + circleDiameter,
							y: positionReference.y,
							'text-anchor': 'start'
						};
						break;
				}

				// Extend attributes
				positionReferenceText = $.extend({fill: "#3E5664"}, attributes, positionReferenceText);
				// Draw name of activity
				paper.text(positionReferenceText.x, positionReferenceText.y, name + " ").attr(positionReferenceText);

				return positionReferenceText;
			};

			$.each(activityList, function(key, value) {
				drawNodes(value);
			});
			self.activities = st;
			paper.setFinish();

			return self._getNodePosition();
		},


		_stickAllPath: function(guid) {
			var self = this;
			self._stickPath = (self._stickActivity != "" && self._stickActivity !== guid) ? true : !self._stickPath;
			self._stickActivity = guid;

			self.activities.items.forEach(function(el, key) {
				if(el.data("guidWorkitem") !== guid) {
					el.node.setAttribute("class", self.options.cssClass);
				}
			});

			self.lines.items.forEach(function(el, key) {
				if(el.data("visible")) {
					el.toBack();
					el.node.setAttribute("class", self.options.cssClass);
				} else {
					el.toFront();
				}
			});
			self._highlight({guidWorkitem: guid, highlight: self._stickPath});
		},

		/**
		 * Create HighLight of lines and activities
		 * @param args
		 * @private
		 */
		_highlight: function(args) {
			var self = this;
			if(!args.guidWorkitem) {
				return;
			}

			var highlight = args.highlight || false;

			if(self.activities) {
				self.activities.items.forEach(function(el) {
					if(el.data("guidWorkitem") == args.guidWorkitem) {
						if(highlight) {
							//el.toFront();
							el.node.setAttribute("class", self.options.cssClassHighlight);
						} else {
							//el.toBack();
							el.node.setAttribute("class", self.options.cssClass);
						}
					}
				});
			}

			if(self.lines) {
				self.lines.items.filter(function(el) {
					return el.data("workItem") == args.guidWorkitem && el.data("visible");
				}).forEach(function(el) {
					if(highlight) {
						el.toFront();
						el.node.setAttribute("class", self.options.cssClassHighlight);
					} else {
						el.toBack();
						el.node.setAttribute("class", self.options.cssClass);
					}
					self._highlight({guidWorkitem: el.data("parentWorkItem"), highlight: highlight});
				});
			}
		},

		/**
		 * Calculate two points of activities and create a string path to join it
		 * @param path
		 * @param clusterPaths
		 * @param paper
		 * @return {Array}
		 * @private
		 */
		_getPath: function(path, clusterPaths, paper) {
			var intersection, targetIntersectionLines = [], startPointY, endPointY;
			var intersectionDirection = 0; //0=left 1=right
			path = path || "";
			clusterPaths = clusterPaths || [];
			var strPath = [];
			var skipRadio = 5;
			var skipDiameter = skipRadio * 2;

			$.each(clusterPaths, function(key, value) {
				if((value.maxY < path.maxY && value.maxY > path.minY) && (value.minX < path.minX && value.maxX > path.minX)) {
					targetIntersectionLines.push(value.strPath);
				}
			});

			if(targetIntersectionLines.length > 0) {
				intersection = Raphael.pathIntersection(path.strPath, targetIntersectionLines);

				// Super Cool feature
				$.each(intersection, function(ikey, ivalue) {
					// Create a new line
					startPointY = (ikey == 0) ? path.minY : intersection[ikey - 1].y + skipRadio;
					endPointY = ivalue.y - skipRadio;

					strPath.push(printf("M%d,%d L%d,%d", path.minX, startPointY, path.minX, endPointY));

					// Add skip curve
					strPath.push(printf("M%d,%d A%d,%d 0 0,%d %d,%d", path.minX, endPointY, skipRadio, skipRadio, intersectionDirection, path.minX, endPointY + skipDiameter));
				});
				strPath.push(printf("L%d,%d L%d,%d", path.minX, path.maxY, path.maxX, path.maxY));
			} else {
				strPath.push(path.strPath);
			}

			return strPath;
		},

		/**
		 * Draw all lines to join activities
		 * @param args
		 * @return {*}
		 * @private
		 */
		_drawActivityLines: function(args) {
			var self = this;
			var paper = args.paper || Raphael("body", 0, 0);
			var activitiesPositionReference = args.activitiesPositionReference || {};
			var linesPathPattern = "M%d,%d L%d,%d L%d,%d";
			var parent, parentPoint, strPath, minX, maxX, minY, maxY, arrowWidth = 3;
			var circleRadius = args.circleRadius || 10;
			var attributes = args.attributes || {};
			var paths = [];
			attributes = $.extend(attributes, {'arrow-end': 'classic-wide-long', 'stroke-linejoin': 'round'});

			var st = paper.set();
			$.each(activitiesPositionReference, function(key, value) {

				if(value.parentWorkItem != "" && activitiesPositionReference[value.parentWorkItem]) {
					parent = activitiesPositionReference[value.parentWorkItem];
					parentPoint = parent.positionReference;
					if(parent.positionReference.y == value.positionReference.y) {
						minX = parentPoint.x + circleRadius;
						maxX = (value.positionReference.x - circleRadius - arrowWidth);
						minY = parentPoint.y;
						maxY = value.positionReference.y;
						strPath = printf(linesPathPattern, minX, minY, maxX, maxY);
					}else if(parentPoint.x == value.positionReference.x){
						// Special Case: When both nodes, parent and child was created at the same time
						// So, join line must be enter on top of node, not by the left
						minX = parentPoint.x;
						minY = parentPoint.y + circleRadius;
						maxY = value.positionReference.y - circleRadius - arrowWidth;
						strPath = printf("M%d,%d L%d,%d", minX, minY, minX, maxY);
					} else {
						minX = parentPoint.x;
						maxX = value.positionReference.x - circleRadius - arrowWidth;
						minY = parentPoint.y + circleRadius;
						maxY = value.positionReference.y;
						strPath = printf(linesPathPattern, minX, minY, parentPoint.x, value.positionReference.y, maxX, maxY);
					}
					var arrPath = {
						strPath: strPath,
						minX: minX,
						maxX: maxX,
						minY: minY,
						maxY: maxY
					};
					strPath = self._getPath(arrPath, paths, paper);
					paths.push(arrPath);
					var path = paper.path(strPath).attr(attributes).toBack();
					path.data({"workItem": key, "parentWorkItem": value.parentWorkItem, visible: true});
					path.node.setAttribute("class", "activity-map-connector");
					path.node.setAttribute("stroke", "#7cb5ec");

					var hidden_path = paper.path(strPath).attr({"stroke-opacity": 0, "stroke-width": 15});
					hidden_path.data({"workItem": key, "parentWorkItem": value.parentWorkItem, visible: false});

					self.mouseEventHelper.hover(
						hidden_path,
						function (e) {
							if(!self._stickPath) {
								self._highlight({guidWorkitem: hidden_path.data("workItem"), highlight: true});
								hidden_path.toFront();
							}
						},
						function (e) {
							if(!self._stickPath) {
								self._highlight({guidWorkitem: hidden_path.data("workItem"), highlight: false});
								hidden_path.toFront();
							}
						}
					);

					hidden_path.click(function() {
						var node = this.data();
						self._stickAllPath(node["workItem"]);
						this.toFront();
					});

					st.push(path);
					st.push(hidden_path);
				}
			});
			$("#raphael-marker-endclassic55 use").attr("fill", "#7cb5ec")
			paper.setFinish();
			return st;
		},



		destroy: function() {
			// Call the base destroy function.
			$.Widget.prototype.destroy.call(this);
		}
	});
})(jQuery);

