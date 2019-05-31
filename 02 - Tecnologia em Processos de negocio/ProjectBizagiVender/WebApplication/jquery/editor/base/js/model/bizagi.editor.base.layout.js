/*
*   Name: BizAgi FormModeler Editor layout
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for layout(model)
*/

bizagi.editor.base.container.extend("bizagi.editor.base.layout", {}, {

	/*
	*   Constructor
	*/
	init: function (data, elementFactory, regenerateGuid) {
	    var self = this;

	    // Set the element name
	    self.type = "layout";

	    self.repeaters = {};

	    // Call base
	    this._super(data, elementFactory, regenerateGuid);	       
	    
	    
	},

    /*
    * Initialize the layout
    */
	initialize: function (data) {
	    var self = this,
            properties = self.properties,
            elements = self.elements,
            regexPlaceholder = /\{\{(placeholder(\:\w*)?)\}\}/g,            
            regexRepeaters = /{{(repeater( {"id":"([\w-]+)"})?)}}\s*({{repeater:item}}([\w\W]+){{\/repeater:item}})/g,	        
            regexRepeaterItem = /{{repeater:item}}(<\w{2,10}\s*(class="[a-z]*")?([\sa-z0-9-="]*style="display: none;")>[\w\W]+){{\/repeater:item}}/;
                   	       	    
	    var html = properties.html;

	    var repeaters = html.split('\{\{\/repeater\}\}');

	    for (var i = 0, l = repeaters.length; i < l; i++) {
	        var repeater = repeaters[i];

	        repeater = repeater.replace(regexRepeaters, function () {
	            var idRepeater = (arguments[3] != undefined) ? arguments[3] : Math.guid(),
                    content = arguments[5],
                    repeaterItem = arguments[4],
                    elements = {},
                    match = arguments[0];

	            function findElements(repeaterItem) {
	                return repeaterItem.replace(/({{placeholder(:\w*)?)(\s*\{"id":"([\w-]+)"\})?/gm, function () {
	                    var id = arguments[4];
	                    if (id) {
	                        elements[id] = true;
	                    }
	                    return arguments[1];
	                });
	            }

	            if (arguments[3] != undefined) {
	                var matchRepeaterItem = regexRepeaterItem.exec(repeaterItem);
	                content = matchRepeaterItem[1];
	                findElements(content);	                
	                repeaterItem = matchRepeaterItem[0].replace(matchRepeaterItem[3], '');	                
	            } else {	                
	                match = match.replace(content, $(content).attr('id', Math.guid())[0].outerHTML);
	            }

	            self.repeaters[idRepeater] = {
	                content: content,
	                item: repeaterItem,
	                elements: elements
	            }

	            var match = (arguments[3] != undefined) ? match : match.replace('{{repeater}}', '{{repeater ' + JSON.stringify({ id: idRepeater }) + '}}');
                return match + '{{/repeater}}'

	        });

	        // replace controls
	        repeater = repeater.replace(regexPlaceholder, function (match, g1, g2, offset, string) {
	            var id = Math.guid();

	            var elementType = 'layoutPlaceholder';

	            if (g2 == ':image') {
	                elementType = 'layoutImage';
	            }

	            var child = self.elementFactory.createElement(elementType, { guid: id, properties: { type: g2 || 'Value' } }, false);

	            // set parent
	            child.setParent(self);

	            // Add to internal collection
	            elements.push(child);

	            return '{{' + 'placeholder ' + JSON.stringify({ id: id }) + '}}';

	        });

	        repeaters[i] = repeater;
	    }
	    	    
	    properties.html = repeaters.join('');


	    return self._super(data);
	},

    
	getRenderingModel: function () {
	    var self = this,
            properties = self.properties,
            elements = self.elements,            
            regexPlaceholder = /({{placeholder(:\w*)?(\s*\{"id":"([\w-]+)"\})?)/g,            
            regexRepeater = /\{\{repeater \{"id":"([a-zA-Z0-9-]+)"\}\}\}\s*\{\{repeater:item\}\}[\w\W]+/g,
            match,
            html = properties.html;

	    var repeaters = html.split('\{\{\/repeater\}\}');

	    for (var i = 0, l = repeaters.length; i < l; i++) {
	        var repeater = repeaters[i];

	        // replace controls
	        repeater = repeater.replace(regexRepeater, function (match, g1, offset, string) {
	            var id = g1;
	            var repeaterElement = self.repeaters[id];

	            if (repeaterElement && self.addAditionalItem(repeaterElement)) {

	                match = match.replace('noshow="true"', '');
	                match = match.replace('style="display: none;"', '');
	                repeaterElement.elements = {};

	                var content = $(self.repeaters[id].content)
                                    .css({ display: 'none' })
                                    .attr('noShow', true)
                                    .attr('id', Math.guid())

	                content = content[0].outerHTML;
	                content = '{{separator}}{{repeater:item}}' + content + '{{/repeater:item}}';
	                content = content.replace(regexPlaceholder, function (match, g1, g2, offset, string) {
	                    var id = Math.guid();
	                    var child = self.elementFactory.createElement('layoutPlaceholder', {
	                        guid: id,
	                        properties: {
	                            type: g2 || 'Value',
	                            repeaterId: id
	                        }
	                    }, false);

	                    repeaterElement.elements[id] = true;

	                    // set parent
	                    child.setParent(self);

	                    // Add to internal collection
	                    elements.push(child);

	                    return (arguments[3] != undefined) ? match.replace(arguments[3], JSON.stringify({ id: id })): match + ' ' + JSON.stringify({ id: id });

	                });

	                return match + content + '{{/repeater}}';
	            }

	            return match + '{{/repeater}}'

	        });

	        repeaters[i] = repeater;
	    }

	    properties.html = repeaters.join('');
                    
	    return self._super();
	},

    /*
    * Returns true if the repeater needs an item aditional
    */
	addAditionalItem: function (repeaterElement) {

	    if ($.isEmptyObject(repeaterElement.elements)) {
	        return true;
	    }

	    for (var id in repeaterElement.elements) {
	        var element = this.getElement(id);

	        if (!element) {
	            return true;    
	        }

	        if (element.hasValue()) {
	            return true;
	        }
	    }        
	    return false;
	}
});