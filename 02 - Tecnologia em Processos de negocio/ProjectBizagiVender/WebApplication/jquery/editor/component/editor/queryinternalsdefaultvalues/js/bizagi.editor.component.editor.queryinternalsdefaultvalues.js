/*
@title: QueryInternals defaultvalue
 @author: Paola Herrera
 */
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.queryinternalsdefaultvalues", {
        cache: {
            application: [],
            processVersion: [],
            task: [],
            position: [],
            processClass: []
        }
    },
    {
        /*
        * Constructor
        */
        init: function (canvas, model, controller) {
            this._super(canvas, model, controller);
            this.focus = null;
        },

        /*
        * Process the information about of editor and render it
        */
        renderEditor: function (container, data) {
            var self = this;

            if (!data.value || !data.value.fixedvalue) {
                data.value = self.getIntialValue();
            }

            data.loadingMessage = bizagi.localization.getResource("webpart-render-loading");


            var elEditor = $.tmpl(self.getTemplate("frame"), data);
            elEditor.appendTo(container);
            self.inputValue = data.value;

            self.loadData(data, container);
        },

        remove: function () {
            this.element.hide();
            this.element.empty();
        },

        loadTemplates: function () {
            var deferred = new $.Deferred();
            $.when(
                this.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.queryinternalsdefaultvalues").concat("#queryinternals-defaultvalue-frame"))
            ).done(function () {
                deferred.resolve();
            });
            return deferred.promise();
        },

        /*
        * Returns the initial value of property
        */
        getIntialValue: function () {

            var value = {
                fixedvalue : -1,
                name : ""
            };

            return value;
        },

        /*
        * Load data to tree canvas
        */
        loadData: function (data, container) {
            var self = this;

            $(".ui-control-input", container).click(function () {
                // Show or hide tree
                container.find(".queryinternals-defaultvalue-value").toggleClass("active");
                container.find(".queryinternals-defaultvalue-action-btn").toggleClass("active");
                
                if (data.value.name === "") {
                    $("i[name=expanded].queryinternals-biz-wp-tree-icon").removeClass("bz-tree-less_16x16_standard").addClass("bz-tree-show-more_16x16_standard");
                }

                setTimeout(function () {
                    // If doesn't have cache load data canvas
                    var type = data["editor-parameters"].type;
                    var $loadingDiv = $(".queryinternals-defaultvalue-value-loading");

                     if (self.Class.cache[type].length == 0) {
                        var options = {
                            typeEvent: bizagi.editor.component.properties.events.PROPERTIES_LOAD_METADATA,
                            id: self.element.closest(".bizagi_editor_component_properties").data("id")
                        };

                        $loadingDiv.startLoading({ delay: 0, overlay: true });

                        $.when(self.controller.publish("propertyEditorChanged", options)).done(function (dataCanvas) {
                            if (dataCanvas) {
                                self.renderEditorCanvas(dataCanvas, container);
                                self.renderEditorListHandlers(container, data);
                                self.expandTree(data, container);
                                self.Class.cache[type] = dataCanvas;
                            }
                            else {
                                container.find(".queryinternals-defaultvalue-value").toggleClass("active");
                                container.find(".queryinternals-defaultvalue-action-btn").toggleClass("active");
                            }
                        }).fail(function (error) {
                            bizagi.log(error);
                        }).done(function () {
                            $loadingDiv.endLoading();
                        });
                    }
                    else {
                        var ulMainContentSize = $('.queryinternals-defaultvalue-value').has("ul").length;
                        if (ulMainContentSize == 0) {
                            self.renderEditorCanvas(self.Class.cache[type], container);
                            self.renderEditorListHandlers(container, data);
                            self.expandTree(data, container);
                        }
                    }
                }, 70);
            });

            $("#queryinternals-defaultvalue-action-btn", container).click(function () {
                // Clean span of the main frame
                var spanMainFrame = $("#data-queryinternals-defaultvalue-frame span", container);
                spanMainFrame.text("");
                self.updateValue(spanMainFrame, data, container, true);

                // Hide tree
                container.find(".queryinternals-defaultvalue-value").removeClass("active");
                container.find(".queryinternals-defaultvalue-action-btn").removeClass("active");
                self.expandTree(data, container);   
            });
        },

        /*
        * Renders the editor canvas to paint tree
        */
        renderEditorCanvas: function (dataCanvas, container) {
            var self = this;
            var divTmp = $('<div>');
            var iconExpand, iconBase, dataChildren;

            // Icons tree
            iconExpand = "<i name='expanded' class='queryinternals-biz-wp-tree-icon biz-ico queryinternals-biz-wp-tree-expand-icon bz-studio bz-tree-show-more_16x16_standard'></i>";
            iconBase = "<i class='queryinternals-biz-wp-tree-icon queryinternals-biz-wp-tree-image-";

            dataChildren = self.renderEditorCanvasChildrens(dataCanvas, iconExpand, iconBase);
            dataChildren.attr('id', 'queryinternals-defaultvalue-mainList');

            //Add tree canvas to element
            dataChildren.appendTo(divTmp);
            var treeTmp = $.tmpl(divTmp, {});
            $(".queryinternals-defaultvalue-value", container).html(treeTmp);
        },

        renderEditorCanvasChildrens: function (children, iconExpand, iconBase) {
            var self = this;
            var liStandard, type, displayName, newIconBase, iconStandard, dataChildren, idElement, guidElement, ulStandard = $('<ul>');

            var assignNewIconByType = {
                "application": { style: "bz-studio bz-application_16x16_standard" },
                "process": { style: "bz-studio bz-processes_16x16_standard" },
                "processClass": { style: "bz-studio bz-processes_16x16_standard" },
                "task": { style: "bz-studio bz-m-task_16x16_standard" },
                "position": { style: "bz-studio bz-object-position_16x16_standard" },
                "processVersion": { style: "bz-studio bz-new-version_16x16_standard" },
                "organization": { style: "bz-studio bz-organization_16x16_standard" },
                "loading": { style: "bz-studio bz-m-custom-artifact_16x16_standard" }
            }

            $.each(children, function (key2, value) {
                type = self.convertTypeString(value.Type);
                idElement = value.IdObject;
                displayName = value.DisplayName;
                guidElement = value.Id;
                newIconBase = (type) ? assignNewIconByType[type].style : "";
                iconStandard = iconBase + type + " "+ newIconBase +"'></i>";

                if (value.Children != null && value.Children.length > 0) {
                    liStandard = $('<li  data-id=' + type + ' data-guid=' + guidElement + ' id = ' + guidElement + '>' + iconExpand + iconStandard + bizagi.util.encodeHtml(displayName) + '</li>').appendTo(ulStandard);

                    dataChildren = self.renderEditorCanvasChildrens(value.Children, iconExpand, iconBase);
                    dataChildren.appendTo(liStandard);
                }
                else {
                    liStandard = $('<li  data-id= ' + type + ' data-guid=' + guidElement + ' id = ' + guidElement + '>' + iconStandard + bizagi.util.encodeHtml(displayName) + '</li>').appendTo(ulStandard);
                }
            });

            return ulStandard;
        },

        /*
        * Renders the editor handlers
        */
        renderEditorListHandlers: function (container, data) {
            var self = this, options;

            $("#queryinternals-defaultvalue-mainList li", container).click(function () {
                var nodesUL = this.getElementsByTagName("ul");
                if (nodesUL.length > 0) //Show childrens
                {
                    //Change expanded icon
                    var icon = this.getElementsByClassName("queryinternals-biz-wp-tree-expand-icon")[0];
                    $(icon).toggleClass("queryinternals-biz-wp-tree-collapse-icon");
                    $(icon).toggleClass("bz-tree-show-more_16x16_standard bz-tree-less_16x16_standard");

                    // Expand list
                    $(this).children('ul').toggle('medium');
                    return false;
                }
                else { // Select item
                    var type = data["editor-parameters"].type;

                    if (this.getAttribute("data-id") == type) {
                        self.updateValue(this, data, container);

                        // Hide tree
                        container.find(".queryinternals-defaultvalue-value").toggleClass("active");
                        container.find(".queryinternals-defaultvalue-action-btn").toggleClass("active");
                        self.expandTree(data, container);

                        // Add selected item to span of the main frame
                        $("#data-queryinternals-defaultvalue-frame span", container).text($(this).text());

                        return false;
                    }
                    else {
                        var title = bizagi.localization.getResource("formmodeler-component-editor-validation-xpath-title");
                        var message = bizagi.localization.getResource("formmodeler-component-editor-queryinternalsdefaultvalues-message-" + type);
                        bizagi.showMessageBox(message, title, "warning", false);
                    }
                }
            });
        },

        /*
         * Update default Value
         */
        updateValue: function (value, data, container,cleanValue) {
            var self = this, idTemp;

            // Update underlined selected item
            $('#queryinternals-defaultvalue-mainList li', container).removeClass('queryinternals-defaultvalue-mainItem');
            typeof $(value).attr("id") === "undefined"  ? idTemp = -1 : idTemp = $(value).attr("id");
            self.inputValue = data.value = { fixedvalue: idTemp, name: $(value).text() };

            var options = {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                newValue: cleanValue ? undefined : self.buildValue(value),
                data: cleanValue ? undefined : self.buildValue(value),
                type: data.name,
                id: self.element.closest(".bizagi_editor_component_properties").data("id")
            };

            self.controller.publish("propertyEditorChanged", options);
        },

        /*
        * Show or hide tree
        */
        expandTree: function (data, container) {
            // Highlight selected item
            if (data.value && data.value.fixedvalue) {
                var type = data["editor-parameters"].type;
                var selectedByType ='#queryinternals-defaultvalue-mainList li[data-id=\"' + type + '\"]';
                var liSelected = $(selectedByType).filter(function (index) { return $(this).attr("id") === data.value.fixedvalue; });
                $(liSelected, container).addClass('queryinternals-defaultvalue-mainItem');
            }

            // Only show expanded selected item
            $("#queryinternals-defaultvalue-mainList ul").hide();
            $(".queryinternals-biz-wp-tree-expand-icon").removeClass("queryinternals-biz-wp-tree-collapse-icon");
            var selectedItem = $('.queryinternals-defaultvalue-mainItem').parentsUntil('#queryinternals-defaultvalue-mainList').find("ul:has(.queryinternals-defaultvalue-mainItem)");
            selectedItem.show();
            selectedItem.siblings().show();
            selectedItem.siblings().toggleClass("queryinternals-biz-wp-tree-collapse-icon");

            if ($("i[name=expanded].queryinternals-biz-wp-tree-collapse-icon").hasClass("bz-tree-show-more_16x16_standard")) {
                $("i[name=expanded].queryinternals-biz-wp-tree-collapse-icon")
                    .removeClass("bz-tree-show-more_16x16_standard")
                    .addClass("bz-tree-less_16x16_standard");
            }

        },

        /*
        * Return type string from id
        */
        convertTypeString: function (numberType) {
            var typeString;

            if (numberType == 1) {
                typeString = "application";
            } else if (numberType == 20) {
                typeString = "processClass";
            } else if (numberType == 100) {
                typeString = "task";
            } else if (numberType == 11) {
                typeString = "position";
            } else if (numberType == 16) {
                typeString = "processVersion";
            } else if (numberType == 10) {
                typeString = "organization";
            }           

            return typeString;
        },

        /*
        * Builds the value to store in the model
        */
        buildValue: function (context) {
            return {
                fixedvalue: $(context).attr("id"),
                name: $(context).text()
            };
        }
    }
);