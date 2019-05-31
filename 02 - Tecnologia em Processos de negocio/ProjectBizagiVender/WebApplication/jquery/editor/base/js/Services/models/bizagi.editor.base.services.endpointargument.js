bizagi.editor.base.services.EndPointArgument = (function () {
    // #endregion
    // #region "Constructor"
    function EndPointArgument(name, type) {
        this._name = name;
        this._type = type;
    }
    // #endregion
    // #region "Properties"
    EndPointArgument.prototype.getName = function () {
        return this._name;
    };
    EndPointArgument.prototype.setName = function (value) {
        this._name = value;
    };
    EndPointArgument.prototype.getType = function () {
        return this._type;
    };
    EndPointArgument.prototype.setType = function (value) {
        this._type = value;
    };
    return EndPointArgument;
})();