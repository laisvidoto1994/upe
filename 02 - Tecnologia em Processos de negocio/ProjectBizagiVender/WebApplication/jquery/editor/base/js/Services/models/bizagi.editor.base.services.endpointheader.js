bizagi.editor.base.services.EndPointHeader = (function () {
    // #endregion
    // #region "Constructor"
    function EndPointHeader(name, value) {
        this._name = name;
        this._value = value;
    }
    // #endregion
    // #region "Properties"
    EndPointHeader.prototype.getName = function () {
        return this._name;
    };
    EndPointHeader.prototype.setName = function (value) {
        this._name = value;
    };
    EndPointHeader.prototype.getValue = function () {
        return this._value;
    };
    EndPointHeader.prototype.setValue = function (value) {
        this._value = value;
    };
    return EndPointHeader;
})();