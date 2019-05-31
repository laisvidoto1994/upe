/*
*   Name: Bizagi FormModeler XpathNavigator Equiv
*   Author: Rhony Pedraza
*/
$.Class.extend("bizagi.editor.component.xpathnavigator.equiv", {
    rule: {
        xpathtosimple: {
            "boolean": ["boolean"],
            "number": ["currency", "number", "float", "oracleNumber"],
            "date": ["date"],
            "string": ["string", "text"],
            "upload": ["upload", "attachment"],
            "letter": ["letter"],
            "image": ["image"],
            "uploadecm": ["uploadecm"]
        },
        xpathtocollection: {
            "xpathtocollection": ["collection"]
        },
        xpathmultiple: {
            "entity": ["entity-parametric", "entity-master", "entity-stakeholder", "entity-system"],
            "upload": ["upload", "attachment"],
            "image": ["image"],
            "uploadecm": ["uploadecm"]
        }
    }
}, {});