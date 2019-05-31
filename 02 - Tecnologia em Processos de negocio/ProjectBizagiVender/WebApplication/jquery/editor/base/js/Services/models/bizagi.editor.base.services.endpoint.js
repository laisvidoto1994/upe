bizagi.editor.base.services = bizagi.editor.base.services || {};

bizagi.editor.base.services.EndPoint = (function () {
    // #endregion
    // #region "Constructor"
    function EndPoint(name, url, method, parameters, isArray) {
        this._name = name;
        this._url = url;
        this._method = method;
        this._arguments = parameters;
        this._isArray = isArray;
    }
    // #endregion
    // #region "Properties"
    EndPoint.prototype.getName = function () {
        return this._name;
    };
    EndPoint.prototype.setName = function (value) {
        this._name = value;
    };
    EndPoint.prototype.getUrl = function () {
        return this._url;
    };
    EndPoint.prototype.setUrl = function (value) {
        this._url = value;
    };
    EndPoint.prototype.getIsArray = function () {
        return this._isArray;
    };
    EndPoint.prototype.setisArray = function (isArray) {
        this._isArray = isArray;
    };
    EndPoint.prototype.getMethod = function () {
        return this._method;
    };
    EndPoint.prototype.setMethod = function (value) {
        this._method = value;
    };
    EndPoint.prototype.getArguments = function () {
        return this._arguments;
    };
    EndPoint.prototype.setArguments = function (value) {
        this._arguments = value;
    };
    EndPoint.prototype.setHeaders = function (value) {
        this._headers = value;
    };
    return EndPoint;
})();