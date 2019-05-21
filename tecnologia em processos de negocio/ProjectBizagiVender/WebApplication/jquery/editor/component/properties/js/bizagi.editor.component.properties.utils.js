/*
*   Name: Bizagi Properties Utils
*   Author: Rhony Pedraza
*   Comments:
*   -   This class will provide misc helpers to properties
*/

/*
 * Parser for rule
 */
bizagi.editor.component.properties.parser = function(map, property) {
    //console.log("property", property);
};

bizagi.editor.component.properties.processrules = function(rules, model, map) {
    var mapRules = {};
    var getRule = function(pathRule) {
        var rule = "", tokens, i, property, entry;
        tokens = pathRule.split(",");
        
        for(i=0; i<tokens.length; i++) {
            if(i === 0) {
                // si es el nombre de la propiedad
                entry = map[tokens[i]];
                property = model.elements[0].tabs[entry.tab].elements[entry.index].property;
            } else {
                if(i === tokens.length-1) {
                    // ultimo token
                    rule = property[tokens[i]];
                    mapRules[pathRule] = property;
                } else {
                    property = updatePathProperty(property, tokens[i]);
                }
            }
        }
        return rule;
    };
    
    var updatePathProperty = function(property, token) {
        if(/^.+\[.+\]\(.+\)$/.test(token)) {
            // arreglo
            var values = token.replace(/^(.+)\[(.+)\]\((.+)\)$/, "$1:$2:$3").split(":");
            return property[values[0]][parseInt(values[1])].property;
        } else {
            // propiedad
            return property[token];
        }
    };
    
    var getValue = function(rule) {
        var value = undefined, i;
        if(/^<.+:+.+$/.test(rule)) {
            var stringRule = rule.substring(1, rule.length-1);
            var tokens = stringRule.split(":");
            for(i=0; i<tokens.length; i++) {
                if(i === 0) {
                    switch(tokens[i]) {
                        case "design":
                            break;
                        default:
                            return undefined;
                    }
                } else {
                    // SE DEBE DEFINIR QUÉ HACER EN ESTE CASO
                    // ¿CÓMO SE DEBE PASEAR LA REGLA?
                }
            }
        }
        return value;
    };
    
    var applyRule = function(pathRule, rule) {
        var value = getValue(rule);
    };
    
    // entry point
    if($.isArray(rules) && rules.length > 0) {
        var i, rule;
        for(i=0; i<rules.length; i++) {
            // se obtiene la regla a partir de su path
            rule = getRule(rules[i]);
            // se aplica la regla
            applyRule(rules[i], rule);
        }
    }
};

bizagi.editor.component.properties.hasRule = function(property) {
    var result = undefined, number = -1;
    var expr = /^<.*:+.*>$/;
    var predAttributes = [
        {
            name : "subproperties",
            more : [
                {
                    name : "editor-parameters",
                    more : [
                        {
                            name : "entity"
                        }
                    ]
                }
            ]
        },
        {
            name : "editor-parameters",
            more : [
                {
                    name : "entity"
                }
            ]
        },
        {
            name : "subproperties",
            more : [
                {
                    name : "default"
                }
            ]
        },
        {
            name : "subproperties",
            more : [
                {
                    name : "editor-parameters",
                    more : [
                        {
                            name : "context"
                        }
                    ]
                }
            ]
        },
        {
            name : "editor-parameters",
            more : [
                {
                    name : "showtime",
                    more : [
                        {
                            name : "rule"
                        }
                    ]
                }
            ]
        },
        {
            name : "editor-parameters",
            more : [
                {
                    name : "allowdecimals",
                    more : [
                        {
                            name : "rule"
                        }
                    ]
                }
            ]
        }
    ];
    var updatePath = function(name, notRoot, external) {
        if(result === undefined) {
            result = [];
            number++;
            result[number] = name;
        } else {
            if(notRoot === undefined) {
                number++;
                result[number] = name;
            } else {
                if(external === undefined) {
                    result[number] = name + "," + result[number];
                } else {
                    for(var i=0; i<=number; i++) {
                        result[i] = name + "," + result[i];
                    }
                }
            }
        }
    };
    var showMore = function(attributes, prop, extCom) {
        var object, ref;
        for(var i=0; i<attributes.length; i++) {
            object = attributes[i];
            if(object.more === undefined) {
                if(prop[object.name] !== undefined) {
                    if(expr.test(prop[object.name])) {
                        updatePath(object.name);
                        extCom.paint = true;
                    }
                }
            } else {
                if(prop[object.name] !== undefined) {
                    if($.isArray(prop[object.name])) {
                        for(var j=0; j<prop[object.name].length; j++) {
                            ref = {};
                            showMore(object.more, prop[object.name][j].property, ref);
                            if(ref.paint !== undefined) {
                                updatePath(object.name + "[" + j + "](" + prop[object.name][j].property.name + ")", true);
                                extCom.paint = true;
                            }
                        }
                    } else {
                        ref = {};
                        showMore(object.more, prop[object.name], ref);
                        if(ref.paint !== undefined) {
                            updatePath(object.name, true);
                            extCom.paint = true;
                        }
                    }
                }
            }
        }
    };
    var ref = {};
    showMore(predAttributes, property, ref);
    if(ref.paint !== undefined) {
        updatePath(property.name, true, true);
    }
    
    return result;
};