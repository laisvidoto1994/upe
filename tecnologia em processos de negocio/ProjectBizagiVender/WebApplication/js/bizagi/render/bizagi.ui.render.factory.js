/*
* jQuery BizAgi Render Factory Method
* Creates a render instance based on the type
*
* Copyright (c) http://www.bizagi.com
*
*/
function buildRender(render, type, options) {
    // Destroy instance of the render, if there is any
    render.baseRender("destroy");

    // Process each type of render
    if (type == "text") {
        if (!render.properties.isExtended) {
            // Text render
            render.textRender(options);
        } else {
            // Extended Text Render
            render.extendedTextRender(options);
        }

    } else if (type == "boolean") {
        if (render.properties.display == "option") {
            // Yes-No render
            render.yesNoRender(options);
        } else {
            // Check Render
            render.checkRender(options);
        }

    } else if (type == "number") {
        // Numeric and money renders
        render.numericRender(options);

    } else if (type == "spinner") {
        // Spinner render
        render.spinnerRender(options);

    } else if (type == "slider") {
        // Slider render
        render.sliderRender(options);

    } else if (type == "date") {
        // Date render
        render.dateRender(options);

    } else if (type == "button") {
        // Button render
        render.buttonRender(options);

    } else if (type == "label") {
        // Label render
        render.labelRender(options);

    } else if (type == "link") {
        // Link render
        render.linkRender(options);

    } else if (type == "hidden") {
        // Hidden render
        render.hiddenRender(options);

    } else if (type == "combo") {
        // Combo render
        render.comboRender(options);

    } else if (type == "cascadingCombo") {
        // Cascading combo render
        render.cascadingComboRender(options);

    } else if (type == "list") {
        // List render
        render.listRender(options);

    } else if (type == "radio") {
        // Radio render
        render.radioRender(options);

    } else if (type == "search") {
        // Search render
        render.searchRender(options);

    } else if (type == "multisearch") {
        // Multi-Search render
        render.multisearchRender(options);

    } else if (type == "tree") {
        // Tree render
        render.treeRender(options);

    } else if (type == "multitree") {
        // Multi-Tree render
        render.multitreeRender(options);

    } else if (type == "combotree") {
        // Combo-Tree render
        render.combotreeRender(options);

    } else if (type == "letter") {
        // Letter render
        render.letterRender(options);

    } else if (type == "richText") {
        // Rich Text render
        render.richTextRender(options);

    } else if (type == "grid") {
        // Grid render
        render.gridRender(options);

    } else if (type == "repeater") {
        // Repeater render
        render.repeaterRender(options);

    } else if (type == "association") {
        // Association render
        render.associationRender(options);

    } else if (type == "upload") {
        // Upload render
        render.uploadRender(options);
    
    }    else if (type == "calculated") {
        // Calculated render
        render.calculatedRender(options);
    
    } else if (type == "userfield") {
        // Special case for user fields
        var userfield = render.properties.userfield;
        var userfieldImpl = $.bizAgiUserFields[userfield];
        eval("render." + $.bizAgiUserFields[userfield] + "(options);");
    
    } 
}