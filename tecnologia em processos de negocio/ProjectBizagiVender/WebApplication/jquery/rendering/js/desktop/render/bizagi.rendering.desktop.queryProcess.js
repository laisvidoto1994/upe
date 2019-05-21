/*
 *   Name: BizAgi Desktop Render Query Process Extension
 *   Author: Jeison Borja
 *   Comments:
 *   -   This script will redefine the query process render class to adjust to desktop devices
 */
// Extends itself

bizagi.rendering.queryProcess.extend("bizagi.rendering.queryProcess", {}, {
    /*
     * Template method to implement in each device to customize each render after processed
     */
    postRender: function () {
        var self = this;
    // Call base
        this._super();
        var template = self.renderFactory.getTemplate("queryProcessWrapper");
        var control = self.getControl();
        self.getElement("row").bind("click", function(){
            var wrapper = self.getWrapper();
            if(wrapper.properties.visible){
                wrapper.element.hide();
                wrapper.element.css("visibility","hidden");
                wrapper.element.empty();
            }else{
                wrapper.element.show();
                wrapper.element.css("visibility","visible");
                var data = self.loadData("aplications");
                self.renderData(data, wrapper.element);
            }
        });

    },

    /**
     * get wrapper html and their properties
     *
     * @return {element: html, properties{visible:boolean}}
     */
    getWrapper: function(){
        var self = this;
        var wrapperElement = self.getElement("wrapper");
        var result = {
            element: wrapperElement,
            properties:{}
        };
        // Check visibility
        result.properties.visible = (wrapperElement.css("visibility") === "visible")?true: false;
        return result;
    },

    /**
     * @return {key(row|wrapper): html element}
     */
    getElement: function(key){
        var control = this.getControl();
        var objectMapper = {
            row : $(".ui-selectmenu-btn , .ui-bizagi-container-query-process :input[type=text]", control),
            wrapper: $(".ui-selectmenu-wrapper", control),
            linkApplication: $(".linkApplication", control)
        };

        return objectMapper[key];
    },

    /**
     * get data from server
     * @return {applications:[{id:integer, appName: string},...] }
     */
    loadData: function(type){
        if(type == "aplications"){
            var result = {
                items: [
                    {
                        id:1,
                        displayName: "My App 1"
                    },
                    {
                        id:2,
                        displayName: "My App 2"
                    },
                    {
                        id:3,
                        displayName: "My App 3"
                    }
                ]
            };
        }

        if(type == "process"){
            var result = {
                items: [
                    {
                        id:4,
                        displayName: "My Category 1",
                        process: false
                    },
                    {
                        id:5,
                        displayName: "My Process 1",
                        process: true
                    },
                    {
                        id:6,
                        displayName: "My Category 2",
                        process: false
                    }
                ]
            };
        }
        return result;
    },

    /**
     * Render data within canvas
     * @param data
     * @param canvas
     */
    renderData: function(data, canvas){
        var self = this;
        $(canvas).empty();
        if(data.items[0].process===undefined){
            canvas.append('<a class="linkApplication" data-idcategory="0" data-typeitem="process"><i class="biz-ico biz-wp-tree-icon biz-wp-tree-image-process"></i>All process </a>');
        }
        $.each(data.items, function(key,value){
            canvas.append('<a class="linkApplication" data-idCategory="'+value.id+'"><i  name="app" class="biz-wp-tree-icon biz-wp-tree-expand-icon"></i><i class="biz-ico biz-wp-tree-icon"></i>'+value.displayName+'</a>');
            var itemElement =   $('[data-idCategory='+value.id+']',canvas);
            if(value.process){
                var iconProcess =   itemElement.find('i').last();
                iconProcess.addClass('biz-wp-tree-image-process');
                itemElement.find('i').first().remove();
                itemElement.css('margin-left','25px');
                itemElement.attr('data-typeItem','process');
           }
           else{
               // item category
               if(value.process==false){
                   var iconCategory =   itemElement.find('i').last();
                   iconCategory.addClass('biz-wp-tree-image-category');
                   itemElement.attr('data-typeItem','category');
               }
               else{
                   //item application
                   var iconApp =   itemElement.find('i').last();
                   iconApp.addClass('biz-wp-tree-image-application');
                   itemElement.attr('data-typeItem','app');
               }
               var idParent   = ($(canvas).attr('class')!="ui-selectmenu-wrapper") ? $(canvas).attr('id').replace('category_','') : "";
               var idContCategory   = (idParent!="") ? "category_"+idParent+"-"+value.id : "category_"+value.id;
               canvas.append("<div class='ui-bizagi-contCategory' id='"+idContCategory+"'></div>");
           }
        });
        self.setupLinks(canvas);
    },

    setupLinks: function(canvas){
        var self = this;
        $(".linkApplication", canvas).on("click", function(){
            var idCategory      = $(this).attr("data-idCategory");
            var idParent   = ($(canvas).attr('class')!="ui-selectmenu-wrapper") ? $(canvas).attr('id').replace('category_','') : "";
            var elementRender   = (idParent!="") ? $("#category_"+idParent+"-"+idCategory) : $("#category_"+idCategory);
            if($(this).attr('data-typeItem')=='process'){
                var processSelect   =   $(this).text();
                var wrapper  =   self.getWrapper();
                wrapper.element.hide();
                wrapper.element.css("visibility","hidden");
                var parentType  = '';
                var item        = this;
                var routeProcess= [];
                if($(this).attr("data-idcategory")>0){
                    while (parentType != "app" ||parentType == null) {
                        item = $(item).closest('div').prev();
                        parentType = item[0].getAttribute("data-typeItem");
                        routeProcess.push(item.text());
                    }
                }
                wrapper.element.empty();
                routeProcess = routeProcess.reverse().join(" > ");
                routeProcess = (routeProcess=="")?processSelect: routeProcess+=  ' > '+processSelect;

                $('.ui-bizagi-container-query-process :input[type=text]').val(routeProcess);
            }
            else{
                var iconProcess =    $(this).find('i').first();
                if(elementRender.css("visibility") === "visible"){
                    iconProcess.addClass('biz-wp-tree-expand-icon');
                    iconProcess.removeClass('biz-wp-tree-collapse-icon');
                    elementRender.hide();
                    elementRender.css("visibility","hidden");
                    elementRender.empty();
                }
                else{
                    var data        = self.loadData("process");
                    iconProcess.removeClass('biz-wp-tree-expand-icon');
                    iconProcess.addClass('biz-wp-tree-collapse-icon');
                    elementRender.show();
                    elementRender.css("visibility","visible");
                    self.renderData(data, elementRender);
                }
            }
        });
    }
});