/* 
 * Simple actionSheet Control for Bizagi Mobile
 * @author: Ricardo Pérez <Ricardo.Perez@Bizagi.com>
 */


(function ($) {
    $.fn.actionSheet = function (options) {
        var self = this;
        var defaults = {
            setDataToShow: function () { },
            actionClicked: function () { },
            cancelClicked: function () { },
            actions: [],
            titleLabel: null,
            cancelLabel: bizagi.localization.getResource("text-cancel") || "Cancel"
        };

        var settings = $.extend(defaults, options || {});

        self.guid = randomGuid();

        self.template =
            "<ul id='actionsheet-#=data.id#' class='bz-actionsheet #if(data.isCaseFolder){#bz-rn-case-folder#}#' data-cancel='#=data.cancelLabel#'>" +
            "	# if(data.titleLabel){#" +
            "		<li class='km-actionsheet-title bz-actionsheet-title'><span>#=data.titleLabel#<span></li>" +
            "	# } #" +
            "	# for(var i = 0; i < data.actions.length; i++){#" +
            "		<li class='bz-render-as-option #if(i === data.actions.length-1){#bz-render-last-child#}#'>" +
            "			<a #if(data.actions[i].guid !== 'back'){#" +
            "					data-bz-ordinal='#= data.actions[i].guid #'" +
            "				#} else {#" +
            "					data-bz-ordinal='-1'" +
            "				#} #>#= data.actions[i].displayName #" +
            "               #if(data.isCaseFolder){#" +
            "                   <span class='bz-rn-action-sheet-icons #=data.actions[i].icon#'></span>" +
            "               #}#" +
            "			</a>" +
            "		</li>" +
            "	#}#" +
            "</ul>";

        // Private functions        
        function randomGuid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }

            return (s4() + s4() + "-" + s4() + "-4" + s4().substr(0, 3) + "-" + s4() + "-" + s4() + s4() + s4()).toLowerCase();
        }

        var methods = {
            init: function () {
                methods.bindElements();
            },

            bindElements: function () {
                self.unbind("click.actionSheet").bind("click.actionSheet", methods.showActionSheet);
            },

            showActionSheet: function (event) {
                event.preventDefault();
                event.stopPropagation();

                $.when(settings.setDataToShow(event))
                    .done(function (actions) {

                        actions = typeof (actions) !== "undefined" ? actions : settings.actions;

                        if (actions.length > 0) {

                            $.each($(".bz-actionsheet", "body"), function (index, item) {
                                $(item).data("kendoMobileActionSheet").destroy();
                            });

                            var item;
                            var index = -1;

                            while ((item = actions[++index])) {
                                if (typeof(item.guid) === "undefined") {
                                    item.guid = randomGuid();
                                }
                            }

                            var actionSheetTmpl = kendo.template(self.template, { useWithBlock: false });
                            $("body").append(actionSheetTmpl({
                                id: self.guid,
                                actions: actions,
                                titleLabel: settings.titleLabel,
                                cancelLabel: settings.cancelLabel,
                                isCaseFolder: settings.isCaseFolder
                            }));

                            var actionsheet = $("#actionsheet-" + self.guid)
                                .kendoMobileActionSheet({
                                    type: "phone",
                                    close: function (event) {
                                        // Atttach cancel
                                        settings.cancelClicked(event);

                                        this.destroy();
                                        this.element.remove();
                                    }
                                });

                            // Atttach actions
                            $("a[data-bz-ordinal]", actionsheet)
                                .kendoMobileButton({
                                    click: function (event) {
                                        var action = actions.find(function (element) {
                                            return element.guid === event.button.data("bz-ordinal");
                                        });

                                        settings.actionClicked(action);
                                    }
                                });

                            $(actionsheet).data("kendoMobileActionSheet").open();
                        }
                    });
            },

            getGUID: function () {
                return self.guid;
            }

        };

        methods.init();

        return methods;
    }

})(jQuery);
