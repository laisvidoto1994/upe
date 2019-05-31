var EndPointMethod;
(function (EndPointMethod) {
    EndPointMethod[EndPointMethod["GET"] = 0] = "GET";
    EndPointMethod[EndPointMethod["POST"] = 1] = "POST";
    EndPointMethod[EndPointMethod["PUT"] = 2] = "PUT";
    EndPointMethod[EndPointMethod["DELETE"] = 3] = "DELETE";
})(EndPointMethod || (EndPointMethod = {}));