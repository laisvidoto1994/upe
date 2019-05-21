/**
 * Created by RicardoPD on 3/12/2015.
 */

(function($){
    /**
     * Set it up as an object under the jQuery namespace
     */
    $.notifier = {};

    /**
     * Set up global options that the user can over-ride
     */
    $.notifier.options = {
        position: '',
        class_name: '', // could be set to 'notifier-light' to use white notifications
        fade_in_speed: 'medium', // how fast notifications fade in
        fade_out_speed: 1000, // how fast the notices fade out
        time: 3000 // hang on the screen for...
    }

    /**
     * Add a notifier notification to the screen
     * @see Notifier#add();
     */
    $.notifier.add = function(params){
        try {
            return Notifier.add(params || {});
        } catch(e) {

            var err = 'Notifier Error: ' + e;
            (typeof(console) != 'undefined' && console.error) ?
                console.error(err, params) :
                alert(err);

        }
    }

    /**
     * Remove a notifier notification from the screen
     * @see Notifier#removeSpecific();
     */
    $.notifier.remove = function(id, params){
        Notifier.removeSpecific(id, params || {});
    }

    /**
     * Remove all notifications
     * @see Notifier#stop();
     */
    $.notifier.removeAll = function(params){
        Notifier.stop(params || {});
    }

    /**
     * Big fat Notifier object
     * @constructor (not really since its object literal)
     */
    var Notifier = {
        // Public - options to over-ride with $.notifier.options in "add"
        position: '',
        fade_in_speed: '',
        fade_out_speed: '',
        time: '',


        _custom_timer: 0,
        _item_count: 0,
        _is_setup: 0,
        _tpl_close: '<div class="notifier-close km-button"><span class="bz-mo-icon bz-cancel"></span></div>',
        _tpl_item: '<div id="notifier-item-[[number]]" class="notifier-item-wrapper [[item_class]]" style="display:none"><div class="notifier-item">[[image]]<div class="[[class_name]]"><span class="notifier-title">[[username]]</span><p>[[text]]</p></div>[[close]]</div>[[progress]]</div>',
        _tpl_progress: '<div class="progress-bar"></div>',
        _tpl_wrap: '<div id="notifier-notice-wrapper"></div>',

        /**
         * Add a notifier notification to the screen
         * @param {Object} params The object that contains all the options for drawing the notification
         * @return {Integer} The specific numeric id to that notifier notification
         */
        add: function(params){

            // We might have some issues if we don't have a title or text!
            if(params.title === '' && params.text === ''){
                throw 'You need to fill out the params: "title" or "text", one at least';
            }

            // Check the options and set them once
            if(!this._is_setup){
                this._runSetup();
            }

            // Basics
            var user = params.title || '',
                text = params.text || '',
                image = params.image || '',
                sticky = params.sticky || false,
                item_class = params.class_name || $.notifier.options.class_name,
                position = $.notifier.options.position,
                time_alive = params.time || '';

            this._verifyWrapper();

            this._item_count++;
            var number = this._item_count,
                tmp = this._tpl_item;

            // Assign callbacks
            $(['before_open', 'after_open', 'before_close', 'after_close']).each(function(i, val){
                Notifier['_' + val + '_' + number] = ($.isFunction(params[val])) ? params[val] : function(){}
            });

            // Reset
            this._custom_timer = 0;

            // A custom fade time set
            if(time_alive){
                this._custom_timer = time_alive;
            }

            var image_str = (image != '') ? '<img src="' + image + '" class="notifier-image" />' : '',
                class_name = (image != '') ? 'notifier-with-image' : 'notifier-without-image';

            var progress = sticky ? '': this._tpl_progress;

            // String replacements on the template
            tmp = this._str_replace(
                ['[[username]]', '[[text]]', '[[close]]', '[[image]]', '[[number]]', '[[class_name]]', '[[item_class]]', '[[progress]]'],
                [user, text, this._tpl_close, image_str, this._item_count, class_name, item_class, progress], tmp
            );

            // If it's false, don't show another notifier message
            if(this['_before_open_' + number]() === false){
                return false;
            }

            $('#notifier-notice-wrapper').addClass(position).append(tmp);

            var item = $('#notifier-item-' + this._item_count);

            item.fadeIn(this.fade_in_speed, function(){
                Notifier['_after_open_' + number]($(this));
            });

            if(!sticky){
                this._setFadeTimer(item, number);
            }

            // Bind the hover/unhover states
            $(item).bind('mouseenter mouseleave', function(event){
                if(event.type == 'mouseenter'){
                    if(!sticky){
                        Notifier._restoreItemIfFading($(this), number);
                    }
                }
                else {
                    if(!sticky){
                        Notifier._setFadeTimer($(this), number);
                    }
                }
                Notifier._hoverState($(this), event.type);
            });

            // Clicking (X) makes the perdy thing close
            $(item).find('.notifier-close').click(function(){
                var unique_id = $(item).attr('id').split('-')[2];
                Notifier.removeSpecific(unique_id, {}, $(item), true);
            });

            return number;

        },

        /**
         * If we don't have any more notifier notifications, get rid of the wrapper using this check
         * @private
         * @param {Integer} unique_id The ID of the element that was just deleted, use it for a callback
         * @param {Object} e The jQuery element that we're going to perform the remove() action on
         * @param {Boolean} manual_close Did we close the notifier dialog with the (X) button
         */
        _countRemoveWrapper: function(unique_id, e, manual_close){

            // Remove it then run the callback function
            e.remove();
            this['_after_close_' + unique_id](e, manual_close);

            // Check if the wrapper is empty, if it is.. remove the wrapper
            if($('.notifier-item-wrapper').length == 0){
                $('#notifier-notice-wrapper').remove();
            }

        },

        /**
         * Fade out an element after it's been on the screen for x amount of time
         * @private
         * @param {Object} e The jQuery element to get rid of
         * @param {Integer} unique_id The id of the element to remove
         * @param {Object} params An optional list of params to set fade speeds etc.
         * @param {Boolean} unbind_events Unbind the mouseenter/mouseleave events if they click (X)
         */
        _fade: function(e, unique_id, params, unbind_events){

            var params = params || {},
                fade = (typeof(params.fade) != 'undefined') ? params.fade : true;
            fade_out_speed = params.speed || this.fade_out_speed,
                manual_close = unbind_events;

            this['_before_close_' + unique_id](e, manual_close);

            // If this is true, then we are coming from clicking the (X)
            if(unbind_events){
                e.unbind('mouseenter mouseleave');
            }

            // Fade it out or remove it
            if(fade){

                e.animate({
                    opacity: 0
                }, fade_out_speed, function(){
                    e.animate({ height: 0 }, 300, function(){
                        Notifier._countRemoveWrapper(unique_id, e, manual_close);
                    })
                })

            }
            else {

                this._countRemoveWrapper(unique_id, e);

            }

        },

        /**
         * Perform actions based on the type of bind (mouseenter, mouseleave)
         * @private
         * @param {Object} e The jQuery element
         * @param {String} type The type of action we're performing: mouseenter or mouseleave
         */
        _hoverState: function(e, type){

            // Change the border styles and add the (X) close button when you hover
            if(type == 'mouseenter'){

              /*  e.addClass('hover');

                // Show close button
                e.find('.notifier-close').show();

                // Clicking (X) makes the perdy thing close
                e.find('.notifier-close').click(function(){
                    var unique_id = e.attr('id').split('-')[2];
                    Notifier.removeSpecific(unique_id, {}, e, true);
                });*/
                e.find('.progress-bar').hide();
            }
            // Remove the border styles and hide (X) close button when you mouse out
            else {

             /*   e.removeClass('hover');

                // Hide close button
                e.find('.notifier-close').hide();*/
                e.find('.progress-bar').show();
            }

        },

        /**
         * Remove a specific notification based on an ID
         * @param {Integer} unique_id The ID used to delete a specific notification
         * @param {Object} params A set of options passed in to determine how to get rid of it
         * @param {Object} e The jQuery element that we're "fading" then removing
         * @param {Boolean} unbind_events If we clicked on the (X) we set this to true to unbind mouseenter/mouseleave
         */
        removeSpecific: function(unique_id, params, e, unbind_events){

            if(!e){
                var e = $('#notifier-item-' + unique_id);
            }

            // We set the fourth param to let the _fade function know to
            // unbind the "mouseleave" event.  Once you click (X) there's no going back!
            this._fade(e, unique_id, params || {}, unbind_events);

        },

        /**
         * If the item is fading out and we hover over it, restore it!
         * @private
         * @param {Object} e The HTML element to remove
         * @param {Integer} unique_id The ID of the element
         */
        _restoreItemIfFading: function(e, unique_id){

            clearTimeout(this['_int_id_' + unique_id]);
            clearInterval(this['_interval_id_' + unique_id]);
            e.stop().css({ opacity: '', height: '' });

        },

        /**
         * Setup the global options - only once
         * @private
         */
        _runSetup: function(){

            for(opt in $.notifier.options){
                this[opt] = $.notifier.options[opt];
            }
            this._is_setup = 1;

        },

        /**
         * Set the notification to fade out after a certain amount of time
         * @private
         * @param {Object} item The HTML element we're dealing with
         * @param {Integer} unique_id The ID of the element
         */
        _setFadeTimer: function($e, unique_id){
            var self = this,
                timer_str = (this._custom_timer) ? this._custom_timer : this.time,
                start_time = new Date().getTime(),
                end_time = start_time + timer_str;

            var $progress = $(".progress-bar", $e);

            this['_interval_id_' + unique_id] = setInterval(function () {
                var percentage =  ((end_time - new Date().getTime()) * 100) / timer_str;
                $progress.width(percentage + '%');
            }, 10);


            this['_int_id_' + unique_id] = setTimeout(function(){
                Notifier._fade($e, unique_id);
                clearInterval(self['_interval_id_' + unique_id]);
            }, timer_str);
        },

        /**
         * Bring everything to a halt
         * @param {Object} params A list of callback functions to pass when all notifications are removed
         */
        stop: function(params){

            // callbacks (if passed)
            var before_close = ($.isFunction(params.before_close)) ? params.before_close : function(){};
            var after_close = ($.isFunction(params.after_close)) ? params.after_close : function(){};

            var wrap = $('#notifier-notice-wrapper');
            before_close(wrap);
            wrap.fadeOut(function(){
                $(this).remove();
                after_close();
            });

        },

        /**
         * An extremely handy PHP function ported to JS, works well for templating
         * @private
         * @param {String/Array} search A list of things to search for
         * @param {String/Array} replace A list of things to replace the searches with
         * @return {String} sa The output
         */
        _str_replace: function(search, replace, subject, count){

            var i = 0, j = 0, temp = '', repl = '', sl = 0, fl = 0,
                f = [].concat(search),
                r = [].concat(replace),
                s = subject,
                ra = r instanceof Array, sa = s instanceof Array;
            s = [].concat(s);

            if(count){
                this.window[count] = 0;
            }

            for(i = 0, sl = s.length; i < sl; i++){

                if(s[i] === ''){
                    continue;
                }

                for (j = 0, fl = f.length; j < fl; j++){

                    temp = s[i] + '';
                    repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
                    s[i] = (temp).split(f[j]).join(repl);

                    if(count && s[i] !== temp){
                        this.window[count] += (temp.length-s[i].length) / f[j].length;
                    }

                }
            }

            return sa ? s : s[0];

        },

        /**
         * A check to make sure we have something to wrap our notices with
         * @private
         */
        _verifyWrapper: function(){

            if($('#notifier-notice-wrapper').length == 0){
                $('body').append(this._tpl_wrap);
            }

        }

    }

})(jQuery);
