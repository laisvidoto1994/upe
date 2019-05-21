/**
 * Process Map plugin
 *
 * @author: Edward Morales, Based on Fabian Moreno diagram
 */
(function($) {
	$.widget("diagram.processMap", {
		options: {
			data: {}
		},
		_create: function() {
			var self = this;
			var options = this.options;
			var data = options.data || {};
			var indexedData = self.indexingData(data); 

			self.element.addClass("tree");
			self.drawEngine(indexedData);

			self._configureHandlers();

			return this;
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

			self.element.draggable();


		},


	/**
	 * Make zoom in or zoom out
	 * @param delta
	 * @private
	 */
	_zoom: function(delta) {
		var self = this;
		$(self.element).css({
			'font-size':delta + 'em'
		});
	},



	indexingData: function(data) {
			var self = this;
			self.indexedData = {
				maxVerticalLevels: 0,
				maxHorizontalNodes: 0,
				parentNode: {},
				latestChild: {},
				data: data || {},
				nodesByLevel: {},
				nodesById: {}
			};
			var parent, children, depth;
			var findByProperty = function(property, propertyValue) {
				var node = [];
				property = property || "";

				$.each(self.indexedData.data, function(key, value) {
					if(typeof value[property] != "undefined" && value[property] == propertyValue) {
						node.push(value);
					}
				});
				return node;
			};

			$.each(self.indexedData.data, function(key, value) {
				parent = findByProperty("guidCase", value.guidParentCase);
				children = findByProperty("guidParentCase", value.guidCase);
				if(parent.length == 0) {
					// Its a parent node
					depth = 0;
					self.indexedData.parentNode = value;
				} else {
					depth = (parent[0].relation) ? parent[0].relation.depth + 1 : 0;
				}
				self.indexedData.data[key].relation = {
					parent: parent,
					children: children,
					depth: depth,
					limitX: {min: 0, max: 0}
				};

				// Add relation to each level
				if(typeof self.indexedData.nodesByLevel[depth] == "undefined") {
					self.indexedData.nodesByLevel[depth] = [];
				}
				self.indexedData.nodesByLevel[depth].push(self.indexedData.data[key]);

				// Update maxHorizontalNodes
				if(self.indexedData.nodesByLevel[depth].length > self.indexedData.maxHorizontalNodes) {
					self.indexedData.maxHorizontalNodes = self.indexedData.nodesByLevel[depth].length;
				}

				// Update maxVerticalLevels
				if(depth > self.indexedData.maxVerticalLevels) {
					self.indexedData.maxVerticalLevels = depth;
					self.indexedData.latestChild = self.indexedData.data[key];
				}

				self.indexedData.nodesById[value.guidCase] = self.indexedData.data[key];
			});
			return self.indexedData;
		},


		drawEngine: function(indexedData) {
			var self = this;
			var $ul, $a,$li;

			function addData(element, data) {
				var d = {
					idcase : data.idCase,
					idworkflow : data.idWorkFlow,
					enddate : data.finishDate,
					startdate : data.creationDate,
					process : data.name
				};
				element.data(d);
				element.addClass('subprocess-tooltip');
				return element;
			}

			function getChildren(d) {
				if(d.relation.children.length) {
					var $a,$currentChildLabel,$currentChild,$arrow;

					var $children = $("<ul>");


					for(var i = 0; i < d.relation.children.length; i++) {
						$a = addData($("<a>"),d.relation.children[i]);
						$arrow = $("<span class='arrow'>");
						$currentChildLabel = $a.html(d.relation.children[i].name);
						$currentChild = $("<li>");
						$currentChild.append($arrow);
						$currentChild.append($currentChildLabel);

						$currentChild.append(getChildren(d.relation.children[i]));

						$children.append($currentChild);
					}

					return $children;
				}
				return null;
			}

			$ul = $("<ul>");
			$a = addData($("<a>"),indexedData.parentNode).html(indexedData.parentNode.name);
			$li = $("<li class='center'>").append($a);
			$ul.append($li);

			$li.append(getChildren(indexedData.parentNode));

			self.element.css({
				"min-width": "5000px",

				'transform': 'translateY(20%)',
				'-ms-transform': 'translateY(20%)',
				'-moz-transform': 'translateY(20%)',
				'-webkit-transform': 'translateY(20%)'
			});

			self.element.html($ul);

            $element = $('.bz-subprocess-map');
            $parent = $element.parent();
            var parentWidth = $parent.width();
            var contentWidth = $element.width();
            $parent.scrollLeft((contentWidth-parentWidth)/2);
		}


	});
})(jQuery);
