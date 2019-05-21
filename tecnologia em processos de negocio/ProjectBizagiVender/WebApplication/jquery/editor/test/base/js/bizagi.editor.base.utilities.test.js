/*  Tittle : Test utilities
 *  Author : David Montoya
 *  Date   : 13mar12
 *  Description : 
 *        Test the basic stuff for utilities performed for the modeller
 *
 *
*/

bizagi.loader.then(function () {


    module("Test_utilities");

    test("Test_resolve_Resources", function () {

        stop();

        /// Expected assertions in the test
        expect(118);

        var validateOneResource = function (resourceKey, resourcesFromFile) {

            ok(!!resourcesFromFile.hasOwnProperty(resourceKey), "Resource key '" + resourceKey + "' is present in the resource file");
            var valueResource = bizagi.editor.utilities.resolveResource(resourceKey);
            strictEqual(valueResource, resourcesFromFile[resourceKey], "Resource value from utility is the same in the resource file");
        };

        var validateInexistentResource = function (resourceKey, resourcesFromFile) {

            ok(!!!resourcesFromFile.hasOwnProperty(resourceKey), "Resource key '" + resourceKey + "' is NOT present in the resource file");
            //var valueResource = bizagi.editor.utilities.resolveResource(resourceKey);
            //ok(valueResource, resourcesFromFile[resourceKey], "Resource value from utility is the same in the resource file");
        };

        var validateInexistentResourceCallingResolveResource = function (resourceKey) {

            //ok(!!!resourcesFromFile.hasOwnProperty(resourceKey), "Resource key '" + resourceKey + "' is NOT present in the resource file");
            var valueResource = bizagi.editor.utilities.resolveResource(resourceKey);
            strictEqual(valueResource, undefined, "resolveResource return undefined because resource '" + resourceKey + "' don´t exist in the resource file");
        };

        validateInexistentResourceCallingResolveResource("george-Grid");
        $.ajax({
            url: "jquery/editor/base/mocks/stub.renders.json.txt",
            dataType: "text"
        }).done(function (json) {
            ok(!!json, "controls loaded successfuly");
            /// TODO: Separate resource BAS from resource workportal for better performance
            $.ajax({
                url: "jquery/resources/bizagi.resources.json.txt",
                dataType: "text"
            }).done(function (jsonResource) {

                ok(!!jsonResource, "Resource loaded successfuly");
                var controls = JSON.parse(json);
                var resourcesFromFile = JSON.parse(jsonResource);

                /// This render has no metadata implementation so this dont be validated
                var ommitThisRenders = [undefined, "button", "number", "group", "tab", "money", "boolean" , "date", "combo", "list", "cascadingCombo", "search", "radio", "link", "formLink", "upload", "letter", "hidden", "grid", "association", "searchList", "innerForm", "userField", "queryForm", "uploadECM", "panel" ];

                /// Validate inexistent resource in the file
                validateInexistentResource("George-grid", resourcesFromFile);

                $.each(controls.renders, function (index, value) {

                    if (ommitThisRenders.indexOf(value.render.name) !== -1) {
                        ok(true, "**Don't forget include render " + value.render.name);
                        return true;
                    }
                    ok(true, "/////////////// Testing render: " + value.render.name + " ///////////////");
                /// Debug if any error ocurred maybe add invaldi renders in the stub
                try {
                    validateOneResource(value.render.elements[0].container.displayName.resource, resourcesFromFile);
                } catch (e) {
                    console.log('error: '+e); //works
                }
                    console.log(value.render);
                    $.each(value.render.elements[0].container.elements, function (index, value) {
                        if (value.property.displayName != undefined)
                            validateOneResource(value.property.displayName.resource, resourcesFromFile);
                        if (value.property.helptext != undefined)
                            validateOneResource(value.property.helptext.resource, resourcesFromFile);
                        if (value.property.tooltip != undefined)
                            validateOneResource(value.property.tooltip.resource, resourcesFromFile);

                    });
                    if (value.render.name == 'tab')
                        var b = 1;
                    ok(true, "//////// End testing render: " + value.render.name + " ///////////////");
                    start();

                })
            })
        });

        setTimeout(function () {
            start();
        }, 2000);


    });

});
