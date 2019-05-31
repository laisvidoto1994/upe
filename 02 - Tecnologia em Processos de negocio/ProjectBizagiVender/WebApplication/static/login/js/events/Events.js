(function(bizagi) {
    'use strict';

    /**
     * @namespace events
     */
    bizagi.events = bizagi.events || {};

    bizagi.events.Events = (function() {

        var _eventCallbacks = {};

        /**
         * @constructor
         */
        (function() {
            //console.log('event listeners');
        }());

        /**
         * Adds a new event listener
         * @param {String}   type     The event type
         * @param {Function} callback The event callback
         * @function
         */
        function addEventListener(type, callback) {
            if (!_eventCallbacks[type]) {
                _eventCallbacks[type] = [];
            }
            _eventCallbacks[type].push(callback);
        }

        /**
         * Dispatch the event with the required callback
         * @param  {String}   type     The event type
         * @param  {Array.<Object>} data The data passed to the listener
         * @function
         */
        function dispatchEvent(type, data) {
            var i, callbacks = _eventCallbacks[type];

            data = data || {};
            
            for (i in callbacks) {
                try{
                    callbacks[i].apply(this, data);
                }catch(e){}
            }
        }

        /**
         * Removes a desired event and his call back
         * @param  {String}   type     The event type
         * @param  {Function} callback The event callback
         * @function
         */
        function removeEventListener(type, callback) {
            var i;
            if (_eventCallbacks[type]) {
                for (i in _eventCallbacks[type]) {
                    if (!!_eventCallbacks[type][i] && !!callback && _eventCallbacks[type][i].toString() === callback.toString()) {
                        _eventCallbacks[type].slice(i, 1);
                    }
                }
            }
        }


        return {
            addEventListener: addEventListener,
            dispatchEvent: dispatchEvent
        };
    }());
})(window.bizagi);