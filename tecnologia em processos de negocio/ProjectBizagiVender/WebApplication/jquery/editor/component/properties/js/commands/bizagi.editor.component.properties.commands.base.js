/*
*   Name: BizAgi Editor Component Properties  Commands defaultvalue
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for command
*/

bizagi.editor.observableClass.extend("bizagi.editor.component.properties.commands.base", {}, {

    /*
    *   Sets up the command
    */
    init: function (args) {
        args = args || {};

        // Call base
        this._super();

        this.args = args;
        this.element = args.element;
        this.properties = args.element.properties;
        this.key = args.key;
        this.indexedProperty = args.indexedProperty;
        this.communicationProtocol = bizagi.editor.communicationprotocol.factory;

    },



    /*
    *   Executes the command, this method must be implemented in all inheritors
    */
    execute: function () { }




});

