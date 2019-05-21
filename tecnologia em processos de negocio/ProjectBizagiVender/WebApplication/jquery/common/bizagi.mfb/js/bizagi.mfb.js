/**
 * Material floating button
 * By: Nobita
 * Repo and docs: https://github.com/nobitagit/material-floating-button
 *
 * License: MIT
 */

// build script hook - don't remove
(function ($) {
    $.fn.mfb = function (options) {
        "use strict";

        var animations = ["mfb-zoomin", "mfb-slidein", "mfb-slidein-spring", "mfb-fountain"];
        var placements = ["mfb-component--tl", "mfb-component--tr", "mfb-component--bl", "mfb-component--br"];

        /**
         * Some defaults
         */
        var self = this;
        var overlay = {
            element: $("<div class='mfb-component__overlay'></div>"),
            opened: false
        };

        options = options || {};
        options.buttons = options.buttons || [];
        options.activePrincipalButton = options.activePrincipalButton || false;
        options.placement = typeof options.placement !== "undefined" ? (placements.indexOf(options.placement) != -1 ? options.placement : "mfb-component--br") : "mfb-component--br";
        options.efect = typeof options.efect !== "undefined" ? (animations.indexOf(options.efect) != -1 ? options.efect : "mfb-slidein") : "mfb-slidein";
        options.clickHoverOpt = options.clickHoverOpt ||"click";
        options.toggleMethod = options.toggleMethod || "data-mfb-toggle";
        options.menuState = options.menuState || "data-mfb-state";
        options.menuStateValue =  options.menuStateValue || "closed";
        options.isOpen = options.isOpen||  "open";
        options.isClosed = options.isClosed || "closed";
        options.mainButtonClass = options.mainButtonClass || "mfb-component__button--main";
        options.restingIcon = options.restingIcon || "plus";
        options.activeIcon = options.activeIcon || "cross";

        $("[" + options.toggleMethod + "='" + options.clickHoverOpt + "'] ." + options.mainButtonClass, this).remove();

        var tmpl =
            "<ul class=\"#: data.placement # #: data.efect #\" #: data.toggleMethod #=\"#: data.clickHoverOpt #\" #: data.menuState#=\"#: data.menuStateValue #\">" +
            "   <li class=\"mfb-component__wrap\">" +
            "      #if (data.activePrincipalButton && data.buttons.length >= 2){#" +
            "       <a #if(typeof data.buttons[0].label !== \"undefined\"){# data-mfb-label=\"#: data.buttons[0].label #\"#}# class=\"mfb-component__button--main\">" +
            "           <i class=\"mfb-component__main-icon--resting mfb-icon-font bz-#:data.restingIcon#\"></i><i class=\"mfb-component__main-icon--active mfb-icon-font bz-#:data.buttons[0].icon#\"></i>" +
            "       </a>" +
            "       #}else{#" +
            "       <a #if(typeof data.label !== \"undefined\"){# data-mfb-label=\"#: data.label #\"#}# class=\"mfb-component__button--main\">" +
            "           <i class=\"mfb-component__main-icon--resting mfb-icon-font bz-#:data.restingIcon#\"></i><i class=\"mfb-component__main-icon--active mfb-icon-font bz-#:data.activeIcon#\"></i>" +
            "       </a>" +
            "       #}#" +
            "       # if(data.buttons.length > 0){#" +
            "       <ul class=\"mfb-component__list\">" +
            "           #for(var i = (data.activePrincipalButton ? 1 : 0), len = data.buttons.length; i< len;i++){#" +
            "           <li>" +
            "               <a href=\"#: data.buttons[i].link #\" data-index=\"#: i#\" #if(typeof data.buttons[i].label !== \"undefined\"){# data-mfb-label=\"#: data.buttons[i].label #\"#}# class=\"mfb-component__button--child\">" +
            "                  <i class=\"mfb-component__child-icon mfb-icon-font bz-#: data.buttons[i].icon #\"></i>" +
            "               </a>" +
            "           </li>" +
            "           #}#" +
            "       </ul>" +
            "       #}#" +
            "   </li>" +
            "</ul>";

        /**
         * Internal references
         */
        var target,
            currentState;

        /**
         * For every menu we need to get the main button and attach the appropriate evt.
         */
        function attachEvt(elems, evt, handler) {
            for (var i = 0, len = elems.length; i < len; i++) {
                elems[i].addEventListener(evt, handler, false);
            }
        }

        /**
         * The open/close action is performed by toggling an attribute
         * on the menu main element.
         *
         * First, check if the target is the menu itself. If it's a child
         * keep walking up the tree until we found the main element
         * where we can toggle the state.
         */
        function toggleButton(evt) {
            target = evt.target;
            while (target && !target.getAttribute(options.toggleMethod)) {
                target = target.parentNode;
                if (!target) {
                    return;
                }
            }
            currentState = target.getAttribute(options.menuState) === options.isOpen ? options.isClosed : options.isOpen;

            if (options.activePrincipalButton && currentState !== "open") {
                var button = options.buttons[0];
                if (options.click) {
                    options.click(evt, $.extend(button, {principal: true}), this);
                }
            }

            if (currentState === "open" && !overlay.opened){
                overlay.element.appendTo(target).bind("click", function () {
                    this.remove();
                    overlay.opened = false;
                    target.setAttribute(options.menuState, "close");
                });
            }else{
                overlay.element.remove();
            }

            overlay.opened = !overlay.opened;

            target.setAttribute(options.menuState, currentState);
        }

        function clickChildButton(evt) {
            var index = $(this).data("index");
            var button = options.buttons[index];

            $(".mfb-component__overlay", self).click();

            if (options.click){
                evt.preventDefault();
                options.click(evt, $.extend(button, {principal: false}), this);
            }
        }

        function clickPrincipalButton(evt){
            if (options.click){
                evt.preventDefault();
                options.click(evt, {principal: true}, this);
            }
        }

        var template = kendo.template(tmpl, { useWithBlock: false });
        var html = template(options);

        if (options.position == "prepend"){
            this.prepend(html);
        }
        else{
            this.append(html);
        }

        //principal button to toggle
        if (options.buttons.length > 0) {
            attachEvt($("[" + options.toggleMethod + "='" + options.clickHoverOpt + "'] ." + options.mainButtonClass, this), "click", toggleButton);
        }
        else{
            attachEvt($("[" + options.toggleMethod + "='" + options.clickHoverOpt + "'] ." + options.mainButtonClass, this), "click", clickPrincipalButton);
        }

        //secondary buttons to click
        attachEvt($(".mfb-component__button--child", this), "click", clickChildButton);
    };
// build script hook - don't remove
})(jQuery);