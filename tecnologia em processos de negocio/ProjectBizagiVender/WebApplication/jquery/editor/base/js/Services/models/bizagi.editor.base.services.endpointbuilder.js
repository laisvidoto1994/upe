

bizagi.editor.base.services.EndPointBuilder = (function () {
    function EndPointBuilder() {
        // #region "Attributes"
        this._name = null;
        this._url = null;
        this._method = null;
        this._arguments = null;
        this._headers = null;
        this._isArray = false;

        this.EndPoint = bizagi.editor.base.services.EndPoint;
    }
    // #endregion
    // #region "Setters"
    EndPointBuilder.prototype.setName = function (value) {
        this._name = value;
        return this;
    };
    EndPointBuilder.prototype.setUrl = function (value) {
        this._url = value;
        return this;
    };
    EndPointBuilder.prototype.setMethod = function (value) {
        this._method = value;
        return this;
    };
    EndPointBuilder.prototype.setArguments = function (value) {
        this._arguments = value;
        return this;
    };
    EndPointBuilder.prototype.setIsArray = function (isArray) {
        this._isArray = isArray;
        return this;
    };
    // #endregion
    // #region "Methods"
    EndPointBuilder.prototype.create = function () {
        if (this._name == null) {
            throw 'Name is null';
        }
        if (this._url == null) {
            throw 'Url is null';
        }
        if (this._method == null) {
            throw 'Method is null';
        }
        if (this._arguments == null) {
            throw 'Arguments is null';
        }
        if (this._isArray == null) {
            throw 'isArray is null';
        }
        return new this.EndPoint(this._name, this._url, this._method, this._arguments, this._isArray);
    };

    return EndPointBuilder;

})();