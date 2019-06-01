/**
* jQuery.ScrollableTab - Scrolling multiple tabs.
* @copyright (c) 2010 Astun Technology Ltd - http://www.astuntechnology.com
* Dual licensed under MIT and GPL.
* Date: 28/04/2010
* @author Aamir Afridi - aamirafridi(at)gmail(dot)com | http://www.aamirafridi.com
* @version 1.0
*/

; (function ($) {
    //Global plugin settings
    var settings = {
        'animationSpeed': 100, //The speed in which the tabs will animate/scroll
        'closable': false, //Make tabs closable
        'resizable': false, //Alow resizing the tabs container
        'resizeHandles': 'e,s,se', //Resizable in North, East and NorthEast directions
        'loadLastTab': false, //When tabs loaded, scroll to the last tab - default is the first tab
        'easing': 'swing', //The easing equation, 
        'tooltipNext': 'Next tab', // Title for next button action
        'tooltipPrevious': 'Previous tab', // Title for previus button action
        'stWidthCheckerHeight': '30px', // Height for span stWidthChecker - bizagi
        'fixHeightTabsNav': '30px',
        'heightNextPrevious': '27px'
    };

    $.fn.scrollabletab = function(options) {
        //Check if scrollto plugin is available - (pasted the plugin at the end of this plugin)
        //if(!$.fn.scrollTo) return alert('Error:\nScrollTo plugin not available.');

        return this.each(function() {
            var o = $.extend({ }, settings, options), //Extend the options if any provided
                $tabs = $(this),
                $tabsNav = $tabs.find('.ui-tabs-nav'),
                $nav; //will save the refrence for the wrapper having next and previous buttons

            //initial position of active tab
            var $initialPosition = $tabsNav.offset();

            //Adjust the css class
            //$tabsNav.removeClass('ui-corner-all').addClass('ui-corner-top');
            $tabs.css({ 'padding': '2px 0', 'position': 'relative', 'overflow': 'hidden' });

            //Wrap inner items
            $tabs.wrap('<div id="stTabswrapper" class="stTabsMainWrapper" style="position:relative;"/>').find('.ui-tabs-nav').css({ 'width': 'auto', 'padding-top': '2px' }).wrapInner('<div class="stTabsInnerWrapper"><span class="stWidthChecker" style="display:inline-block; position:absolute; height:' + o.stWidthCheckerHeight + '; overflow:hidden;"></span></div>');


            var $widthChecker = $tabs.find('.stWidthChecker'),
                $tabsWrapper = $tabs.parents('#stTabswrapper').width("auto"/*$tabs.outerWidth(true)*/);

            //Fixing safari bug
            if ($.browser.safari) {
                $tabsWrapper.width(($tabs.width() == 0) ? "100%" : $tabs.width() + 6);
            }
            if (o.resizable) {
                if (!!$.fn.resizable) {
                    $tabsWrapper.resizable({
                            minWidth: $tabsWrapper.width(),
                            maxWidth: $tabsWrapper.width() * 2,
                            minHeight: $tabsWrapper.height(),
                            maxHeight: $tabsWrapper.height() * 2,
                            handles: o.resizeHandles,
                            alsoResize: $tabs,
                        //start : function(){  },
                            resize: function() {
                                $tabs.trigger('resized');
                            }
                            //stop: function(){ $tabs.trigger('scrollToTab',$tabsNav.find('li.ui-tabs-selected')); }
                        });
                }
                else {
                    alert('Error:\nCannot be resizable because "jQuery.resizable" plugin is not available.');
                }
            }


            //Add navigation icons
            //Total height of nav/2 - total height of arrow/2
            var arrowsTopMargin = (parseInt(parseInt($tabsNav.innerHeight(true) / 2) - 8)),
                arrowsCommonCss = { 'cursor': 'pointer', 'z-index': 4, 'position': 'absolute', 'top': 6, 'height': o.heightNextPrevious };

            $tabsWrapper.prepend(
                $nav = $('<div/>')
                    //.disableSelection()
                    .css({ 'position': 'relative', 'z-index': 5, 'display': 'block' })
                    .append(
                    $('<span/>')
                        //.disableSelection()
                        .attr('title', o.tooltipPrevious)
                        .css(arrowsCommonCss)
                        .addClass('ui-state-active ui-corner-tl ui-corner-bl stPrev stNav')
                        .css('left', 0)
                        .append($('<span/>')
                            //.disableSelection()
                                .addClass('ui-icon ui-icon-carat-1-w').html('Previous tab').css('margin-top', arrowsTopMargin))
                        .click(function() {
                            //Check if disabled
                            if ($(this).hasClass('ui-state-disabled')) return false;
                            //Just select the previous tab and trigger scrollToTab event
                            var prevIndex = $tabs.tabs("option", "active");

                            //Now select the tab
                            $tabsNav.find('a').eq(prevIndex - 1).trigger('click');
                            $tabs.tabs({ "active": prevIndex - 1 });
                            $tabs.trigger('navEnabler');
                            return false;
                        }),
                    $('<span/>')
                        //.disableSelection()
                        .attr('title', o.tooltipNext)
                        .css(arrowsCommonCss)
                        .addClass('ui-state-active ui-corner-tr ui-corner-br stNext stNav')
                        .css({ 'right': 0 })
                        .append($('<span/>').addClass('ui-icon ui-icon-carat-1-e').html('Next tab').css('margin-top', arrowsTopMargin))
                        .click(function() {
                            //Just select the previous tab and trigger scrollToTab event

                            if ($(this).hasClass('ui-state-disabled')) return  false;
                            var nextIndex = $tabs.tabs("option", "active");

                            $tabsNav.find('a').eq(nextIndex + 1).trigger('click');
                            $tabs.tabs({ "active": nextIndex + 1 });
                            $tabs.trigger('navEnabler');
                            return false;
                        })
					)
			);

            //Bind events to the $tabs
            $tabs
                .bind('tabsremove', function() {
                    $tabs.trigger('scrollToTab').trigger('navHandler').trigger('navEnabler');
                })
                /*         .bind("tabsactivate",function(e,ui){
                
            // $tabs.trigger('navEnabler');
            })*/
                .bind('addCloseButton', function() {
                    //Add close button if require
                    if (!o.closable) return;
                    $(this).find('.ui-tabs-nav li').each(function() {
                        if ($(this).find('.ui-tabs-close').length > 0) return; //Already has close button
                        var closeTopMargin = parseInt(parseInt($tabsNav.find('li:first').innerHeight() / 2, 10) - 8);
                        $(this)
                            //.disableSelection()
                            .append(
                            $('<span style="float:left;cursor:pointer;margin:' + closeTopMargin + 'px 2px 0 -11px" class="ui-tabs-close ui-icon ui-icon-close" title="Close this tab"></span>')
                                .click(function() {
                                    $tabs.tabs('remove', $(this).parents('li').prevAll().length);
                                    //If one tab remaining than hide the close button
                                    if ($tabs.tabs('length') == 1) {
                                        $tabsNav.find('.ui-icon-close').hide();
                                    }
                                    else {
                                        $tabsNav.find('.ui-icon-close').show();
                                    }
                                    //Call the method when tab is closed (if any)
                                    if ($.isFunction(o.onTabClose)) {
                                        o.onTabClose();
                                    }
                                    return false;
                                })
					);
                        //Show all close buttons if any hidden
                        $tabsNav.find('.ui-icon-close').show();
                    });
                })
                .bind('tabsadd', function() {
                    //Select it on Add
                    $tabs.tabs('select', $tabs.tabs('length') - 1);
                    //Now remove the extra span added to the tab (not needed)
                    var $lastTab = $tabsNav.find('li:last');
                    if ($lastTab.find('a span').length > 0) $lastTab.find('a').html($lastTab.find('a span').html());
                    //Move the li to the innerwrapper
                    $lastTab.appendTo($widthChecker);
                    //Scroll the navigation to the newly added tab and also add close button to it
                    $tabs
                        .trigger('addCloseButton')
                        .trigger('bindTabClick')
                        .trigger('navHandler')
                        .trigger('scrollToTab');
                })//End tabsadd
                .bind('addTab', function(event, label, content) {
                    //Generate a random id
                    var tabid = 'stTab-' + (Math.floor(Math.random() * 10000));
                    //Append the content to the body
                    $('body').append($('<div id="' + tabid + '"/>').append(content));
                    //Add the tab
                    $tabs.tabs('add', '#' + tabid, label);
                })//End addTab
                .bind('bindTabClick', function() {
                    //Handle scroll when user manually click on a tab
                    $tabsNav.find('a').click(function(event) {

                        var $liClicked = $(this).parent();
                        var $tabPosition = $tabsNav.position();
                        var $liPosition = $liClicked.offset();
                        var $liPositionWidth = $liPosition.left + $liClicked.width();
                        var $tabsPositionWidth = $tabs.width() + $tabs.offset().left;

                        if (($liPositionWidth + 2) > $tabsPositionWidth) {

                            animateContainer($tabsNav, $tabPosition.left - ($liPositionWidth - $tabsPositionWidth + ($initialPosition.left * 2)));

                        } else if ($liPosition.left < $initialPosition.left) {

                            animateContainer($tabsNav, $initialPosition.left - $liClicked.position().left);
                        }

                        $tabs.trigger('navEnabler');
                        event.preventDefault();

                    });
                })
                //Bind the event to act when tab is added
                .bind('scrollToTab', function(event, $tabToScrollTo, clickedFrom, hiddenOnSide) {
                    //If tab not provided than scroll to the last tab
                    $tabToScrollTo = (typeof $tabToScrollTo != 'undefined') ? $($tabToScrollTo) : $tabsNav.find('li.ui-tabs-selected');
                    //Scroll the pane to the last tab
                    var navWidth = $nav.is(':visible') ? $nav.find('.stPrev').outerWidth(true) : 0;
                    //debug($tabToScrollTo.prevAll().length)

                    var offsetLeft = -($tabs.width() - ($tabToScrollTo.outerWidth(true) + navWidth + parseInt($tabsNav.find('li:last').css('margin-right'), 10)));
                    offsetLeft = (clickedFrom == 'tabClicked' && hiddenOnSide == 'left') ? -navWidth : offsetLeft;
                    offsetLeft = (clickedFrom == 'tabClicked' && hiddenOnSide == 'right') ? offsetLeft : offsetLeft;
                    //debug(offsetLeft);
                    var scrollSettings = { 'axis': 'x', 'margin': true, 'offset': { 'left': offsetLeft }, 'easing': o.easing || '' };
                    //debug(-($tabs.width()-(116+navWidth)));
                    $tabsNav.scrollTo($tabToScrollTo, o.animationSpeed, scrollSettings);
                })
                .bind('navEnabler', function() {

                    //Check if last or first tab is selected than disable the navigation arrows
                    var index = $tabs.tabs("option", "active");
                    var tabActive = $tabsNav.find('li').eq(index);

                    var isLast = tabActive.is(':last-child'),
                        isFirst = tabActive.is(':first-child'),
                        $ntNav = $tabsWrapper.find('.stNext'),
                        $pvNav = $tabsWrapper.find('.stPrev');
                    //debug('isLast = '+isLast+' - isFirst = '+isFirst);
                    if (isLast) {
                        $pvNav.removeClass('ui-state-disabled');
                        $ntNav.addClass('ui-state-disabled');
                    }
                    else if (isFirst) {
                        $ntNav.removeClass('ui-state-disabled');
                        $pvNav.addClass('ui-state-disabled');
                    }
                    else {
                        $ntNav.removeClass('ui-state-disabled');
                        $pvNav.removeClass('ui-state-disabled');
                    }

                })
                //Now check if tabs need navigation (many tabs out of sight)
                .bind('navHandler', function() {
                    //Check the width of $widthChecker against the $tabsWrapper. If widthChecker has bigger width than show the $nav else hide it

                    if ($widthChecker.width() > $tabsNav.width()) {
                        $nav.show();
                        $('#ui-bizagi-details-tabs .ui-tabs-panel').css({ 'border-top-right-radius': 0, 'border-top-left-radius': 0 });
                        $widthChecker.css('width', '3000px');
                        //Put some margin to the first tab to make it visible if selected
                        $tabsNav.find('li:first').css('margin-left', $nav.find('.stPrev').outerWidth(true));
                    }
                    else {
                        $nav.hide();
                        //Remove the margin from the first element
                        $tabsNav.find('li:first').css('margin-left', 0);
                    }
                })
                .bind('tabsselect', function() {
                    //$tabs.trigger('navEnabler');
                })
                .bind('resized', function() {
                    $tabs.trigger('navHandler');
                    $tabs.trigger('scrollToTab', $tabsNav.find('li.ui-tabs-selected'));
                })
                //To add close buttons to the already existing tabs
                .trigger('addCloseButton')
                .trigger('bindTabClick')
                //For the tabs that already exists
                .trigger('navHandler')
                .trigger('navEnabler');

            // fix height
            $tabsNav.css({ "height": o.fixHeightTabsNav, "margin": " 0 6px" });

            //Select last tab if option is true
            if (o.loadLastTab) {
                setTimeout(function() { $tabsNav.find('li:last a').trigger('click'); }, o.animationSpeed);
            }


            //bind event to the active tab
            $tabsNav.find('li').on('focus', function() {

                $(this).blur();
            });
        });

        //Animate tab container
        function animateContainer($tabsNav, newPosition) {
            $tabsNav.css({ 'left': newPosition });
        }

        //Just for debuging
        function debug(obj)
        { console.log(obj); }
    

    };
})(jQuery);



/**
* jQuery.ScrollTo - Easy element scrolling using jQuery.
* Copyright (c) 2007-2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
* Dual licensed under MIT and GPL.
* Date: 5/25/2009
* @author Ariel Flesler
* @version 1.4.2
*
* http://flesler.blogspot.com/2007/10/jqueryscrollto.html
*/
; (function (d) { var k = d.scrollTo = function (a, i, e) { d(window).scrollTo(a, i, e); }; k.defaults = { axis: 'xy', duration: parseFloat(d.fn.jquery) >= 1.3 ? 0 : 1 }; k.window = function (a) { return d(window)._scrollable(); }; d.fn._scrollable = function () { return this.map(function() { var a = this, i = !a.nodeName || d.inArray(a.nodeName.toLowerCase(), ['iframe', '#document', 'html', 'body']) != -1; if (!i) return a; var e = (a.contentWindow || a).document || a.ownerDocument || a; return d.browser.safari || e.compatMode == 'BackCompat' ? e.body : e.documentElement; }); }; d.fn.scrollTo = function (n, j, b) { if (typeof j == 'object') { b = j; j = 0; } if (typeof b == 'function') b = { onAfter: b }; if (n == 'max') n = 9e9; b = d.extend({}, k.defaults, b); j = j || b.speed || b.duration; b.queue = b.queue && b.axis.length > 1; if (b.queue) j /= 2; b.offset = p(b.offset); b.over = p(b.over); return this._scrollable().each(function() { var q = this, r = d(q), f = n, s, g = { }, u = r.is('html,body'); switch (typeof f) { case 'number': case 'string': if ( /^([+-]=)?\d+(\.\d+)?(px|%)?$/ .test(f)) { f = p(f); break; } f = d(f, this); case 'object': if (f.is || f.style) s = (f = d(f)).offset(); } d.each(b.axis.split(''), function(a, i) { var e = i == 'x' ? 'Left' : 'Top', h = e.toLowerCase(), c = 'scroll' + e, l = q[c], m = k.max(q, i); if (s) { g[c] = s[h] + (u ? 0 : l - r.offset()[h]); if (b.margin) { g[c] -= parseInt(f.css('margin' + e)) || 0; g[c] -= parseInt(f.css('border' + e + 'Width')) || 0; } g[c] += b.offset[h] || 0; if (b.over[h]) g[c] += f[i == 'x' ? 'width' : 'height']() * b.over[h]; } else { var o = f[h]; g[c] = o.slice && o.slice(-1) == '%' ? parseFloat(o) / 100 * m : o; } if ( /^\d+$/ .test(g[c])) g[c] = g[c] <= 0 ? 0 : Math.min(g[c], m); if (!a && b.queue) { if (l != g[c]) t(b.onAfterFirst); delete g[c]; } }); t(b.onAfter); function t(a) { r.animate(g, j, b.easing, a && function() { a.call(this, n, b); }); } }).end(); }; k.max = function (a, i) { var e = i == 'x' ? 'Width' : 'Height', h = 'scroll' + e; if (!d(a).is('html,body')) return a[h] - d(a)[e.toLowerCase()](); var c = 'client' + e, l = a.ownerDocument.documentElement, m = a.ownerDocument.body; return Math.max(l[h], m[h]) - Math.min(l[c], m[c]); }; function p(a) { return typeof a == 'object' ? a : { top: a, left: a }; } })(jQuery);