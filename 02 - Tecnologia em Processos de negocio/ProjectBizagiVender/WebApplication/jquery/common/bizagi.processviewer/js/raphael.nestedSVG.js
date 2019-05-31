// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Rphael Plugin by bizagi                                            │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © bizagi                                                 │ \\
// └────────────────────────────────────────────────────────────────────┘ \\
/*! */
(function ($) {
        Raphael.fn.nestedSVG = function(context, w, h) {

                var r = this,
                        cfg = (arguments[0] instanceof Array) ? {} : arguments[0],
                        items = (arguments[0] instanceof Array) ? arguments[0] : arguments[1];
                
                function nestedSVG(cfg, items) {
                        var inst,
                                set = r.set(items),
                                svg = new Raphael(context, w, h);

                        svg.canvas.setAttribute('x',0);
                        svg.canvas.setAttribute('y',0);
                        
                        r.canvas.appendChild(svg.canvas);
                        
                        inst = {
                                move: function(x,y) {
                                        svg.canvas.setAttribute('x', x);
                                        svg.canvas.setAttribute('y', y);
                                }

                        };

                        $.extend(svg, inst);
                                        
                        return svg;
                }
                
                return nestedSVG(cfg, items);

        };

})(jQuery);