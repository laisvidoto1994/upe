/*
 *   Name: BizAgi Workportal Desktop Folders Widget Controller
 *   Author: Edward Morales
 *   Comments:
 *   -   This script will provide desktop overrides to implement the folder widget
 */

// Auto extend
bizagi.workportal.widgets.folders.extend("bizagi.workportal.widgets.folders", {}, {

    /**
     *   To be overriden in each device to apply layouts
     */
    postRender: function(){
        var self = this;

        self.params.options.onlyFolderMode = self.params.options.onlyFolderMode || false;

        // Set bind event for last element
        self.configureTreeNavigation();

        // Bind back button
        self.configureBackButton();

        // Render default folders
        // self.renderDefaultFolders();

        // Render base categories
        self.renderFolders((self.params.options.onlyFolderMode)?"-1":"");

        // set vertical scroll
        self.scrollVertical({
            "autohide":false
        });
    },

    renderDefaultFolders: function(){
        var self = this;
        var content = self.getContent();
        var template = self.getTemplate("folders-default");
        var container = $("#queries", content);

        container.empty();
        $.tmpl(template).appendTo(container);

    },

    /**
     * Render List categories for each idCategory
     */
    renderFolders: function(id,appendElement){
        var self = this;
        var content = self.getContent();
        var template = (self.params.options.onlyFolderMode != undefined && self.params.options.onlyFolderMode)?self.getTemplate("folders-add-case"):self.getTemplate("folders-elements");
        var emptyTemplate = self.getTemplate("folders-empty-elements");
        var container = $("#queries", content);
        var queryContent;
        var mergeData;
        var mergeNewFolder ={};

        id = id || "";

        $.when(self.dataService.getFolders(id))
        .done(function(data) {

            container.empty();

            // check if service have nodes
            data = data || undefined;
            var idParent = "";
            try{
                if(data.folders != undefined && data.folders.length > 0){
                    idParent = data.folders[0]["idParent"];
                }
            }catch(e){}


            if(data.folders != undefined && data.folders != ""){
                // Check if have appendElement
                if(appendElement != undefined){
                    mergeData = {
                        folders:
                        (data != undefined)?appendElement.concat(data.folders):appendElement
                    };
                //$.merge({folders:appendElement},data)
                //$.merge(appendElement, data); //appendElement.concat(data.folders)
                }else{
                    mergeData = data;
                }
                // Count number of childs
                $.each(mergeData.folders,function(key,value){
                    if(value != undefined && value.childs.folders != undefined){
                        mergeData.folders[key]["countChilds"] = mergeData.folders[key]["childs"]["folders"].length;
                    }else{
                        mergeData.folders[key]["countChilds"]=0;
                    }
                });

                // Append "new folder"element
                if(id != "" && !self.params.options.onlyFolderMode){
                    mergeNewFolder.folders = mergeData.folders.concat({
                        "name": self.getResource("workportal-widget-folders-new"),
                        "id": 'newFolder',
                        "idParent": idParent,
                        "childs": [],
                        "categoryWithLink": "true",
                        "countChilds":0
                    });
                }else{
                    mergeNewFolder = mergeData;
                }

                queryContent = $.tmpl(template, mergeNewFolder);
            }else if(!self.params.options.onlyFolderMode){
                //Don't have results
                mergeNewFolder.folders = [{
                    "name": self.getResource("workportal-widget-folders-new"),
                    "id": 'newFolder',
                    "idParent": idParent,
                    "childs": [],
                    "categoryWithLink": "true",
                    "countChilds":0
                }];
                queryContent = $.tmpl(template,mergeNewFolder);
            }else{
                queryContent = $.tmpl(emptyTemplate);
            }
            queryContent.appendTo(container);

            // set actions to rendered html
            self.configureNavTree(container);
        });
    },


    configureNavTree: function(queriesContainer) {
        var self = this;
        var confirm = self.getTemplate("folders-query-confirm");

        // Bind for list elements
        $("li", "#queries").click(function(e) {
            e.stopPropagation();
            var id =$(this).data("id");
            var countChilds =$(this).data("childslength");
            var name =$(this).data("name");
            var urlParameters =$(this).data("urlparameters");
            var idParent = $(this).data("idparent");

            var headerTemplate = self.getTemplate("folders-query-tree");
            var categoryTree = $("#categoryTree");
            var queriesListDisplay = $(".queriesListDisplay li");

            // Config inbox view
            if(countChilds == 0 && self.params.options.onlyFolderMode){
                return;
            }

            // If the node is base folder
            if (id == "-1"){
                // Is category
                // Append query header
                $.tmpl(headerTemplate, {
                    idParentQuery: -1,
                    queryDisplayName: name
                }).appendTo(categoryTree);

                // Set bind event for last element
                self.configureTreeNavigation(idParent);

                // Render sub-categories
                self.renderFolders(id);
            }else if(id=="newFolder"){
                // Create new folder
                self.makeFolder({
                    listElements:queriesListDisplay,
                    idParent:idParent
                });

            }else if( countChilds > 0 ){
                // Is category with link

                // Add element for tree navigation
                $.tmpl(headerTemplate, {
                    idParentQuery: id,
                    queryDisplayName: name
                }).appendTo(categoryTree);

                // Set bind event for last element
                self.configureTreeNavigation(idParent);

                // Apend this object to children
                self.renderFolders(id,
                    (self.params.options.onlyFolderMode)?[]:
                    [{
                        "name": name,
                        "id": id,
                        "idParent": '',
                        "childs": [],
                        "categoryWithLink": true,
                        "urlParameters":urlParameters
                    }]
                    );
            }else {
                // Is Process
                bizagi.workportal.desktop.popup.closePopupInstance();
                if(countChilds == 0 && urlParameters){
                    $.when(self.dataService.getCasesByFolder(urlParameters))
                    .done(function(data){
                        bizagi.lstIdCases = data.lstIdCases;
                        // Define radnumber for render actions bottons
                        bizagi.referrerParams = bizagi.referrerParams || {};
                        bizagi.referrerParams.radNumber = "";//params.radNumber;
                        bizagi.referrerParams.page = "";//params.page;
                        bizagi.referrerParams.referrer = "folders";
                        bizagi.referrerParams.urlParameters = urlParameters;
                        bizagi.referrerParams.name = name;
                        bizagi.referrerParams.id = id;

                        // Define widget customized for pagination purposes
                        data.customized = true; 
                        data.urlParameters = urlParameters;
                        
                        // Define title of widget
                        data.title = name;

                        // Set a flag here to tell the search widget that must show the ungroup case from folder (icon).
                        data.casesGroupedByFolder = true;
                        data.idFolder = id;

                        self.publish("changeWidget", {
                            widgetName : bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_SEARCH,
                            data: data,
                            referrerParams: {}
                        });
                    });
                }
            }
        });


        // Bind for action elements (Edit and delete buttons)
        $(".addButton", "#queries").click(function(e){
            e.stopPropagation();
            var queriesListDisplay = $(".queriesListDisplay li");
            var id = $(this).data("id");
            var idParent = $(this).data("idparent");
            self.makeFolder({
                listElements:queriesListDisplay,
                idParent:id,
                beforeElement:$(this).parent(),
                style:"newSubFolder",
                idParentDone:idParent
            });
        });

        $(".editButton", "#queries").click(function(e) {
            e.stopPropagation();
            self.editFolder($(this).parent());
        });


        $(".deleteButton", "#queries").click(function(e){
            e.stopPropagation();

            var content = $.tmpl(confirm);
            var idCustomFolder = $(this).data("id");
            var idParent = $(this).data("idparent");

            // Open dialog with confirm message
            $(content).dialog({
                resizable: true,
                modal: true,
                title: self.getResource("workportal-widget-queries-confirm-title"),
                buttons: [
                {
                    text: self.getResource("workportal-widget-queries-confirm-delete"),
                    click: function(){
                        self.dataService.deleteFolder({
                            idCustomFolder: idCustomFolder
                        });

                        $(this).dialog("close");
                        self.renderFolders(idParent);
                    //bizagi.workportal.desktop.popup.closePopupInstance();
                    }
                },
                {
                    text: self.getResource("workportal-widget-queries-confirm-cancel"),
                    click: function(){
                        $(this).dialog("close");
                    }
                }
                ]
            });
        });

        $(".addIco","#queries").click(function(e){
            e.stopPropagation();
            var ico = $(this);
            var parent = ico.parent();
            var idFolder = ico.data("id");

            ico.addClass("wait");
            // Associate case to folder
            $.when(self.dataService.associateCaseToFolder({
                idCustomFolder: idFolder,
                idCase: self.params.options.idCase
            })).done(function(data){
                if(data.message == ""){
                    bizagi.workportal.desktop.popup.closePopupInstance();                    
                }else{
                    // Show error message 
                    ico.removeClass("wait");
                    if($(".errorMessage",parent).text()== ""){
                        parent.append($("<div class='errorMessage'></div>").html(data.message));
                        setTimeout(function(){
                            $(".errorMessage",parent).hide('blind','slow',function(){
                                $(this).remove();    
                            });                        
                        }, 5000);
                    }
                }
            })
        });
    },

    /**
     *   Binds the back buttons so we can navigate back
     */
    configureBackButton: function(){
        var self = this;
        var content = self.getContent();
        var btnBack = $("#bt-back", content);
        var categoryTree = $("#categoryTree", content);

        // Bind click
        btnBack.click(function(){
            if($("li", categoryTree).length > 1){
                // Removes last child
                $("li:last-child", categoryTree).remove();
                var idParentQuery = $("li:last-child").children("#idParent").val();

                // Render Querie again
                self.renderFolders(idParentQuery);
            }
        });
    },

    /**
     * Configure Edit input field
     * @param options{listElements,idParent,beforeElement,style,idParentDone}
     */
    makeFolder:function(options){
        var self = this;
        var nodeTemplate = options.template || self.getTemplate("folders-input-new");
        options.beforeElement = (options.beforeElement != undefined && options.beforeElement.length >=1)?options.beforeElement:options.listElements;
        var newElement = $.tmpl(nodeTemplate,{
            name: "",
            idParent: options.idParent,
            style: options.style
        }).insertAfter((options.beforeElement.length ==1)?options.beforeElement:options.beforeElement.last().prev());

        // Set focus on input element
        $(".newInput",newElement).focus();
        
        // Bind event to checkin botton
        $(".checkico",newElement).click(function(){
            var folderName = $(".newInput",newElement).val();            
            var parent = $(this).parent();
            
            // Check if folderName already exists   
            $.when(self.checkRepeatFolderName({
                parent:parent,
                options:options,
                folderName: folderName
            })
            ).done(function(result){
                if(result){
                    // Create folder
                    $.when(self.dataService.makeFolder({
                        idParentFolder:options.idParent,
                        folderName: folderName
                    }))
                    .done(function(result){
                        // Update View
                        self.renderFolders(options.idParentDone || options.idParent);
                    });
                }else{
                    // Display notification - folder name already in use
                    parent.append($("<div class='errorMessage'></div>").html(self.getResource("workportal-widget-folders-name-repeated")));
                    setTimeout(function(){
                        $(".errorMessage",parent).hide('blind','slow',function(){
                            $(".errorMessage",parent).remove();
                        });                
                    },5000);
                }   
            });
        });
        
        $(".newInput",newElement).bind("keypress",function(e){
            if(e.keyCode==13){
                $(".checkico", newElement).click();
            }
        });
    },

    /**
     * Check if folder name already exist
     */
    checkRepeatFolderName: function(args){
        var def = new $.Deferred();
        var self = this;
        args = args || {};
        var folderNameAvailable = true;
        if(args.parent.hasClass("newSubFolder")){ // Check if new folder in subcategory
            $.when(self.dataService.getFolders(
                args.options.idParent
                )).done(function(data){
                if(data.folders != undefined){
                    $.each(data.folders, function(key,value){                    
                        if(value.name != undefined && args.folderName == value.name){
                            folderNameAvailable = false;    
                            def.resolve(folderNameAvailable);
                        }                    
                    });
                }
                def.resolve(folderNameAvailable);
            });            
        }else{
            // it is principal tree
            $('.queriesListDisplay li')
            .not(':last-child') // Do not include the last item
            .each(function(){
                // Compare each value
                if(args.folderName == $(this).data('name')){
                    // Sorry the name of the folder is already taken
                    folderNameAvailable = false;
                }
            });
            def.resolve(folderNameAvailable);
        }
        //def.resolve(folderNameAvailable);
        return def.promise();
    },
    /**
     * Edit folder
     */
    editFolder: function(element){
        var self = this;
        var idParent = $(element).data("idparent");
        var value = $(element).find("h3").html();
        var id = $(element).data("id");
        var nodeTemplate = self.getTemplate("folders-input-new");

        var newElement = $.tmpl(nodeTemplate,{
            name: value,
            idParent: idParent
        });

        element.replaceWith(newElement);

        // Set focus on input element
        $(".newInput",newElement).focus();

        // Bind event to checkin botton


        $(".checkico",newElement).click(function(){
            var folderName =$(".newInput",newElement).val();

            $.when(self.dataService.updateFolder({
                idFolder:id,
                folderName: folderName
            }))
            .done(function(result){
                // Update View
                self.renderFolders(idParent);
            });
        });

        $(".newInput",newElement).bind("keypress",function(e){
            if(e.keyCode==13){
                $(".checkico",newElement).click();
            }
        });
    },


    /**
     * Bind tree navigation
     */
    configureTreeNavigation:function(idParent){
        var self = this;
        var content = self.getContent();
        var categoryTree = $("#categoryTree", content);

        // Bind header events
        $("li:last-child", categoryTree).click(function(){
            idParent = idParent || $(this).children("#idParent").val();

            if(self.params.options.onlyFolderMode && idParent==""){
                self.renderFolders(-1);
            }
            // Remove all elements
            $(this).nextAll().remove();
            // Render query tree again
            self.renderFolders(idParent);
        });
    },

    scrollVertical:function(){
        var self = this;
        var content = self.getContent();

        $("#queries",content).bizagiScrollbar({
            "autohide":false
        });
    },

    /*
     *   Show new case popup to create a case
     */
    showQueryFormPopup: function(arg){
        var self = this;

        var idQuery = arg.idQuery || "";
        var idStoredQuery = arg.idStoredQuery || "";
        var queryFormAction = arg.queryFormAction || "";
        var title = arg.title || "";

        // If the same popup is opened close it
        if (self.currentPopup == "queryform"){
            bizagi.workportal.desktop.popup.closePopupInstance();
            return;
        }

        // Shows a popup widget
        self.currentPopup = "queryform";
        self.publish("showDialogWidget", {
            widgetName : bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_QUERYFORM,
            idQueryForm: idQuery,
            idStoredQuery: idStoredQuery,
            queryFormAction: queryFormAction,
            modalParameters: {
                title: title
            }
        });
    }
});
