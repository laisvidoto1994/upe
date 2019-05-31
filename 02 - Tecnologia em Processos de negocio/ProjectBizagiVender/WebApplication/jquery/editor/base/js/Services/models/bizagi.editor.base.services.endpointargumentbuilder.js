var EndPointArgument = bizagi.editor.base.services.EndPointArgument;


bizagi.editor.base.services.EndPointArgumentBuilder = (function () {
    function EndPointArgumentBuilder() {
    }
    // #endregion
    // #region "Setters"
    EndPointArgumentBuilder.prototype.setName = function (value) {
        this._name = value;
        return this;
    };
    EndPointArgumentBuilder.prototype.setType = function (value) {
        this._type = value;
        return this;
    };
    // #endregion
    // #region "public Methods"
    EndPointArgumentBuilder.prototype.create = function () {
        if (this._name == null) {
            throw 'Name is null';
        }
        if (this._type == null) {
            throw 'Type is null';
        }
        return new EndPointArgument(this._name, this._type);
    };
    return EndPointArgumentBuilder;
})();

