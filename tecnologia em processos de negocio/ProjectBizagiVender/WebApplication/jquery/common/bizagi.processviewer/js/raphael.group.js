// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Rphael Plugin by bizagi                                            │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © bizagi                                                 │ \\
// └────────────────────────────────────────────────────────────────────┘ \\
/*! */
(function ($) {

    Raphael.fn.group = function () {

        var r = this,
                        cfg = (arguments[0] instanceof Array) ? {} : arguments[0],
                        items = (arguments[0] instanceof Array) ? arguments[0] : arguments[1];

        function Group(cfg, items) {
            var inst,
                                set = r.set(items),
                                _group = r.raphael.vml ?
                                        document.createElement("group") :
                                        document.createElementNS("http://www.w3.org/2000/svg", "g");


            r.canvas.appendChild(_group);

            _group.canvas = _group;



            inst = {
                setScale: function (newScale) {

                    if (r.raphael.vml) {
                        this.forEach(function (el) {

                            var rotation = el.data("rotation") || 0;
                            el.transform("S" + newScale + "," + newScale + ", 0, 0, r" + rotation);

                        });
                    } else {
                        _group.setAttribute('transform', 'scale(' + newScale + ')');
                    }

                    return this;
                },
                getScale: function () {
                    var attr = _group.getAttribute('transform');
                    if (attr === null) {
                        attr = 'scale(1)';
                    }

                    var scale = attr.replace('scale(', '').replace(')', '');
                    return scale;
                }
            };

            $.extend(inst, r);

            inst.scale = inst.setScale;
            inst.canvas = _group;
            inst[0] = _group;
            inst.type = 'group';
            inst.node = _group;

            return inst;
        }

        return Group(cfg, items);

    };

})(jQuery);