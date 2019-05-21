/**
 * This file contain public API of selenium in order to access to
 * Bizagi Render elements
 *
 * @author: Edward Morales
 */

/*
 getRenderById
 getRenderByType
 getRenderByXpath
 getRenderByDisplayName
 getRenderByValue
 ready
 */

/* RENDER BY ID */
PageBot.prototype.locateElementByRenderObjById = function (locator) {
    var bizagi = this.browserbot.getUserWindow().bizagi;
    return bizagi.e2e.getRenderById(locator);
};
PageBot.prototype.locateElementByRenderElmById = function (locator) {
    var obj = this.locateElementByRenderObjById(locator).element[0] || null;
    return obj;
};

/* RENDER BY TYPE */
PageBot.prototype.locateElementByRenderObjByType = function (identifier) {
    var bizagi = this.browserbot.getUserWindow().bizagi;
    return bizagi.e2e.getRenderByType(identifier);
};
PageBot.prototype.locateElementByRenderElmByType = function (identifier) {
    var obj = this.locateElementByRenderObjByType(identifier).element[0] || null;
    return obj;
};

/* RENDER BY XPATH */
PageBot.prototype.locateElementByRenderObjByXpath = function (identifier) {
    var bizagi = this.browserbot.getUserWindow().bizagi;
    return bizagi.e2e.getRenderByXpath(identifier);
};
PageBot.prototype.locateElementByRenderElmByXpath = function (identifier) {
    var obj = this.locateElementByRenderObjByXpath(identifier).element[0] || null;
    return obj;
};

/* RENDER BY DISPLAY NAME */
PageBot.prototype.locateElementByRenderObjByDisplayName = function (identifier) {
    var bizagi = this.browserbot.getUserWindow().bizagi;
    return bizagi.e2e.getRenderByDisplayName(identifier);
};
PageBot.prototype.locateElementByRenderElmByDisplayName = function (identifier) {
    var obj = this.locateElementByRenderObjByDisplayName(identifier).element[0] || null;
    return obj;
};

/* RENDER BY VALUE */
PageBot.prototype.locateElementByRenderObjByValue = function (identifier) {
    var bizagi = this.browserbot.getUserWindow().bizagi;
    return bizagi.e2e.getRenderByValue(identifier);
};
PageBot.prototype.locateElementByRenderElmByValue = function (identifier) {
    var obj = this.locateElementByRenderObjByValue(identifier).element[0] || null;
    return obj;
};

PageBot.prototype.locateElementByStoredVar = function (variableName) {
    variableName = variableName || "";

    return (typeof storedVar[variableName] !== "undefined") ? storedVar[variableName] : "";
};

PageBot.prototype.findBizagiElement = function (locatorString) {
    var locatorArray = locatorString.split("=");
    var locator = locatorArray[0];
    var toLocate = locatorArray[1];
    var result;

    switch (locator) {
        case "renderObjById":
            result = this.locateElementByRenderObjById(toLocate);
            break;
        case "renderObjByType":
            result = this.locateElementByRenderObjByType(toLocate);
            break;
        case "renderObjByXpath":
            result = this.locateElementByRenderObjByXpath(toLocate);
            break;
        case "renderObjByDisplayName":
            result = this.locateElementByRenderObjByDisplayName(toLocate);
            break;
        case "renderObjByValue":
            result = this.locateElementByRenderObjByValue(toLocate);
            break;
        case "renderElmById":
            result = this.locateElementByRenderElmById(toLocate);
            break;
        case "renderElmByType":
            result = this.locateElementByRenderElmByType(toLocate);
            break;
        case "renderElmByXpath":
            result = this.locateElementByRenderElmByXpath(toLocate);
            break;
        case "renderElmByDisplayName":
            result = this.locateElementByRenderElmByDisplayName(toLocate);
            break;
        case "renderElmByValue":
            result = this.locateElementByRenderElmByValue(toLocate);
            break;
    }
    return result;
};


/*isRequired
 getControl
 getDisplayName     ok
 getValue
 getValueDisplay
 getFocus
 find
 getType
 RenderIsReady
 */


/*==============  BEGIN DISPLAY NAME ==============*/
/**
 * ACTION:getDisplayName
 * @param locator define specific locator
 * @param storeName Name of var where will be stored
 */
/*Selenium.prototype.doGetDisplayName = function (locator, storeName) {};*/


/**
 *  ACTION: storeRenderDisplayName
 * @param locator
 * @returns object
 */
Selenium.prototype.getRenderDisplayName = function (locator) {
    var element = this.browserbot.findElement(locator);
    var displayName = element.getDisplayNameText() || "";
    return displayName;
};
/**
 * ACTION: assertRenderDisplayName
 * @param locator
 * @param pattern
 * @returns {boolean}
 */
Selenium.prototype.assertRenderDisplayName= function(locator, pattern){
    pattern = pattern|| "";
    var regPattern = new RegExp(pattern,"g");
    //var element = this.browserbot.findElement(locator);
    var displayName = this.getRenderDisplayName(locator);

    return (displayName.match(regPattern) !== null )? true: Assert.fail("Assertion: Display Name: "+displayName+" do not match with expression:"+pattern);
};
/*==============  END DISPLAY NAME ==============*/




/*==============  BEGIN GET CONTROL ==============*/
/**
 *  ACTION: storeRenderControl
 * @param locator
 * @returns object
 */
Selenium.prototype.getRenderControl = function (locator) {
    var element = this.browserbot.findElement(locator);
    var controlObj = element.getControl() || {};
    return controlObj;
};
/**
 * ACTION: assertRenderDisplayName
 * @param locator
 * @param pattern
 * @returns {boolean}
 */
Selenium.prototype.assertRenderControl= function(locator, pattern){
    pattern = pattern|| "";
    var regPattern = new RegExp(pattern,"g");
    var element = this.browserbot.findElement(locator);
    var controlObj = element.getControl().html() || "";

    return (controlObj.match(regPattern) !== null )? true: Assert.fail("Assertion: Control do not match with expression:"+pattern);
};
/*==============  END GET CONTROL ==============*/


/*==============  BEGIN IS REQUIRED ==============*/
/**
 *  ACTION: storeRenderIsRequired
 * @param locator
 * @returns object
 */
Selenium.prototype.getRenderIsRequired = function (locator) {
    var element = this.browserbot.findElement(locator);
    var required = element.isRequired().toString() || "false";
    return required;
};
/**
 * ACTION: assertRenderIsRequired
 * @param locator
 * @param pattern
 * @returns {boolean}
 */
Selenium.prototype.assertRenderIsRequired= function(locator, pattern){
    pattern = pattern|| "";
    var regPattern = new RegExp(pattern,"g");
    //var element = this.browserbot.findElement(locator);
    var required = this.getRenderIsRequired(locator);

    return (required.match(regPattern) !== null )? true: Assert.fail("Assertion: Control do not match with expression:"+pattern);
};
/*==============  END GET CONTROL ==============*/


/*==============  BEGIN GET TYPE ==============*/
/**
 *  ACTION: storeRenderType
 * @param locator
 * @returns object
 */
Selenium.prototype.getRenderType= function (locator) {
    var element = this.browserbot.findElement(locator);
    var required = element.getType() || "";
    return required;
};
/**
 * ACTION: assertRenderType
 * @param locator
 * @param pattern
 * @returns {boolean}
 */
Selenium.prototype.assertRenderType= function(locator, pattern){
    pattern = pattern|| "";
    var regPattern = new RegExp(pattern,"g");
    var type = this.getRenderType(locator);

    return (type.match(regPattern) !== null )? true: Assert.fail("Assertion: Control do not match with expression:"+pattern);
};
/*==============  END GET CONTROL ==============*/

/**
 * Get value of display name
 * @param locator
 * @param storeName
 */
/*Selenium.prototype.getGetDisplayNameText = function (locator,a) {
 var storeName = "getGetDisplayNameText";

 // Define displayName and save it on stored var
 this.doStoreDisplayNameText(locator,storeName);

 // return storedVars[storeName];
 };*7

 /**
 * Store within storeName value of display name
 * @param locator
 * @param storeName
 */
/*Selenium.prototype.doStoreDisplayNameText = function (locator, storeName) {
 // storeName = storeName || "getGetDisplayNameText";
 var element = this.browserbot.findBizagiElement(locator);
 if (element.hasOwnProperty("length")) {
 storedVars[storeName] = [];
 for (var i = 0; i < element.length; i++) {
 storedVars[storeName].push(element[i].properties.displayName);
 }
 } else {
 storedVars[storeName] = element.properties.displayName;
 }
 };*/

/*Selenium.prototype.doGetIsRequired = function (locator) {
 return locator.isRequired();
 };*/


/*Selenium.prototype.getRenderIsReady = function () {
 return Selenium.decorateFunctionWithTimeout(function () {
 var bizagi = Selenium.browserbot.getUserWindow().bizagi;
 return bizagi.e2e.ready();
 }, this.defaultTimeout);
 };*/


PageBot.prototype.findElement = function (locator, win) {
    var elm = this.browserbot.findBizagiElement(locator);

    if (typeof elm !== "undefined") {
        return elm;
    } else {
        var element = this.findElementOrNull(locator, win);
        if (element == null) throw new SeleniumError("Element " + locator + " not found");
        return element;
    }
};