// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Rphael Plugin by bizagi                                            │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © bizagi                                                 │ \\
// └────────────────────────────────────────────────────────────────────┘ \\
/*! */
(function ($) {
        Raphael.fn.marker = function() {

                var r = this,
                        cfg = (arguments[0] instanceof Array) ? {} : arguments[0],
                        items = (arguments[0] instanceof Array) ? arguments[0] : arguments[1];
                
                function marker(cfg, items) {
                        var inst,
                                set = r.set(items),
                                _marker = r.raphael.vml ?
                                        document.createElement("marker") : 
                                        document.createElementNS("http://www.w3.org/2000/svg", "marker");

                                var _markerAssociation = r.path('M2,2 L2,10 L10,6 L2,2');
                                _markerAssociation.node.setAttribute('fill','black');

                        r.defs.appendChild(_marker);
                        _marker.appendChild(_markerAssociation.node);
                        
                        inst = {
                                scale: function (newScaleX, newScaleY) {
                                        var transform = _marker.getAttribute('transform');
                                        _marker.attr('transform', updateScale(transform, newScaleX, newScaleY));
                                        return this;
                                },
                                move: function(x,y) {
                                        _marker.setAttribute('x', x);
                                        _marker.setAttribute('y', y);
                                },
                                attr:function(attribute, value){
                                        _marker.setAttribute(attribute, value);
                                },
                                attrs:function(attributes){
                                        for(var prop in attributes){
                                                _marker.setAttribute(prop, attributes[prop]);
                                        }
                                },
                                type: 'marker',
                                node: _marker
                        };
                                        
                        return inst;
                }
                
                return marker(cfg, items);

        };

})(jQuery);