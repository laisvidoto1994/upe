/**
 * Bizagi Workportal Desktop Accumulated Context Services
 * @author Danny González
 */

bizagi.workportal.services.accumulatedcontext = (function () {

    var self = this;
    self.context = [];

    /**
     * Organize all data to accumulated context
     * @param {String} params.entityGuid 
     * @param {Number} params.surrogateKey
     */
    self.addContext = function (params) {
        if (params.surrogateKey && params.entityGuid) {
            // New position
            self.context.push({
                entityGuid: params.entityGuid,
                surrogateKey: params.surrogateKey
            });
        } 
    };

    /**
     * Update the last position on the accumulated context
     * @param {Object} params
     */
    self.updateLastPosition = function (params) {
        self.context[self.context.length - 1][params.key] = params.value;
    }

    /**
     * Delete the last position on the accumulated context
     * @param {Object} params
     */
    self.deleteContext = function (guid) {
        self.context.pop();
    };

    /**
     * Return all accumulated Context
     * @param {Object} params
     * @return {*}
     */
    self.getContext = function (params) {
        var empty = params.empty || false;
        if (empty) {
            return { "context": [] };
        } else {
            return { context: self.context };
        }
    };

    /**
     * Clean all accumulated Context
     * @param {Object} params
     */
    self.clean = function (params) {
        self.context = [];
    };

    /**
     * Cut the accumulated Context in a specific position
     * @param pos
     */
    self.cutContext = function (pos) {
        var pos = pos || 1;
        var cut = self.context.length - pos;
            if (cut > 0) {
                self.context = self.context.slice(0, -cut);
            } else {
                self.clean();
            }
    };

    /**
     * Get value for specific attribute in a specific position
     * @param key
     * @param pos
     */
    self.getSpecificValue = function (key, pos) {
        if( self.context.length > 0 ){
            if (key) {
                return self.context[pos][key];
            }
        } else {
            return undefined;
        }
    };

    /**
     * Validate if the surrogeteKey or guidEntity are present in the last position of accumulated context
     * @param key
     * @param pos
     */
    self.isValidData = function (key,data) {
        if (self.getSpecificValue(key, self.countContext() - 1) == data) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Return the count of accumulated context
     * @return total
     */
    self.countContext = function () {
        var total = self.context.length;
        return total;
    };

    return {
        addContext: self.addContext,
        updateLastPosition: self.updateLastPosition,
        deleteContext: self.deleteContext,
        clean: self.clean,
        getContext: self.getContext,
        cutContext: self.cutContext,
        getSpecificValue: self.getSpecificValue,
        isValidData: self.isValidData,
        countContext: self.countContext
    }

});

bizagi.injector.register('accumulatedcontext', [bizagi.workportal.services.accumulatedcontext]);