/*
* jQuery BizAgi Container Factory Method
* Creates a container instance based on the type
*
* Copyright (c) http://www.bizagi.com
*
*/
function buildContainer(container) {
    // Process panels
    if (container.hasClass("ui-bizagi-container-panel")) {
        container.panelContainer();
    }

    // Process tabs
    if (container.hasClass("ui-bizagi-container-tabContainer")) {
        container.tabContainer();
    }

    // Process accordeons
    if (container.hasClass("ui-bizagi-container-accordionContainer")) {
        container.accordionContainer();
    }

    // Process groups
    if (container.hasClass("ui-bizagi-container-group")) {
        container.groupContainer();
    }

    // Process horizontals
    if (container.hasClass("ui-bizagi-container-horizontal")) {
        container.horizontalContainer();
    }
}