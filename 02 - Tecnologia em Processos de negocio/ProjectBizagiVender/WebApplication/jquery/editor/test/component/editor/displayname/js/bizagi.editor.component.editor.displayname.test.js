/*
@title: Test Editor Boolean Component
@authors: Alexander Mejia
@date: 14-jun-12
*/
bizagi.loader.then(function() {
     
     module("Editor DisplayName Test");
     
     test("Check Editor DisplayName creation", 4, function() {
        
        ok(!!$.fn.bizagi_editor_component_editor, "Widget (plugin $.Controller father/base) bizagi_editor_component_editor creation");
        ok(!!$.fn.bizagi_editor_component_editor_displayname, "Widget (plugin $.Controller) bizagi_editor_component_editor_boolean creation");
        
        var container = $("<div></div>");
        var displayname = new bizagi.editor.component.editor.displayname(container);
        
        // Se ha ejecutado correctamente la funcion setup del widget
        ok(!!container.data("controllers")["bizagi_editor_component_editor_displayname"], "Widget (plugin) $.data register (call to setup)");
        
        displayname.update( {value: "value"} );
        
        // Se revisa la actualizacion del componente
        strictEqual(displayname.options.value, "value", "Value is updated in this.options in bizagi.editor.component.editor.boolean");
        
    });
});
    