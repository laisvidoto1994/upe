/**
*   Name: BizAgi Tablet Render list Extension
*   Author: Cristian O
*   Date: 2015 - Oct - 10
*   Comments:
*   -   This script will redefine the list render class to adjust to tablet devices
*/

// Extends from base list 
bizagi.rendering.list.extend("bizagi.rendering.list", {}, {
    postRender: function () {
        // Call combo postRender
        var self = this;
        var control = self.getControl();

        // Call base 
        this._super();

        // Set control container to behave as a block
        control.addClass("ui-bizagi-render-display-block");

        // Apply plugin
        self.list = $(".ui-bizagi-render-list", control);

        if (!self.properties.editable) {
            //Add styles class
            container.addClass("bz-command-not-edit");
            self.list.attr('readonly', "readonly");

            var value = self.properties.value ? self.properties.value.value : "- - ";

            self.control.html("<span class=\"bz-command-not-edit bz-rn-align-class bz-rn-text\">" + value + "</span>");
        }

        //Show clear icon
        $.when(self.ready()).done(function(){
            if(!self.hasValue()){
                self.getControl().find(".bz-rn-input-selected").html("-------------");
                self.getControl().find(".bz-wp-list-clear-icon-list").hide(500);
            }else{
                self.getControl().find(".bz-wp-list-clear-icon-list").show(500);
            }
        });

        self.configureListHandlers();
    },

    /**
     * Setting the control events
     * */
    configureListHandlers: function () {
        var self = this;
        var control = self.getControl();

        self.list.find(".see-more-icon").bind("click", function () {
            //Creating modal view
            var modalViewTemplate = kendo.template(self.renderFactory.getTemplate("listModalView"), { useWithBlock: false });
            var modalView = $(bizagi.util.trim(modalViewTemplate({
                'items': self.properties.data,
                'displayName': self.properties.displayName || ""
            }))).clone();

            modalView.kendoMobileModalView({
                close: function () {
                    this.destroy();
                    this.element.remove();
                },
                useNativeScrolling: true,
                modal: false
            });

            self.configureModalViewHandlers(modalView);
            modalView.kendoMobileModalView("open");
            modalView.closest(".k-animation-container").addClass("bz-rn-new-modalview-position");
        });

        //Setting the initial selected display value
        self.list.on("click", ".bz-rn-regular-element", function () {
            var val = $(this).data("value");
            var label = $(this).text();

            var newValue = { "id": val, "value": label };
            self.selectedValue = newValue.value;
            self.setValue(newValue);
            self.setDisplayValue(newValue);
        });

        //Set clear event
        control.find(".bz-rn-first-element-container").on("click", ".bz-wp-list-clear-icon-list", function () {
            var val = "";
            var label = "-------------";

            var newValue = { "id": val, "value": label };
            self.setValue(newValue);
            self.selectedValue = newValue.value;
            self.setDisplayValue(newValue);
        });
    },

    /**
     * Configure the modalView Handlers for the new combo control.
     * */
    configureModalViewHandlers: function (inputContainer) {
        var self = this;

        var closeModalViewPromise = new $.Deferred();

        //getting combo list elements
        var container = inputContainer.find(".ui-bizagi-render-list-elements li");

        //Hide the clear text icon
        inputContainer.find(".bz-wp-modalview-header-cancel-search").hide(500);

        //Closing modalview
        inputContainer.delegate("#ui-bizagi-cancel-button", "click", function () {
            closeModalViewPromise.reject();
            inputContainer.data("kendoMobileModalView").close();
        });

        //Filtering list
        inputContainer.find(".bz-wp-modalview-header-input-search").bind('change keypress keyup change', function () {
            self.filterList(this.value, container, inputContainer);
        });

        //Cleaning list
        inputContainer.find(".bz-wp-modalview-header-cancel-search").bind('click', function () {
            self.filterList("", container, inputContainer);
            inputContainer.find(".bz-wp-modalview-header-input-search").val("");
            $(this).hide(500);
        });

        //Configuring list as a selectable element
        self.modalViewList = $(".ui-bizagi-render-list-elements", inputContainer);
        self.setModalViewDisplayValue();

        //Setting the initial selected display value
        self.modalViewList.on("click", "li", function () {
            self.modalViewList.find("li").filter(function () {
                if ($(this).hasClass("ui-state-active")) {
                    return $(this);
                }
            }).removeClass("ui-state-focus ui-selected ui-state-active");

            $(this).addClass("ui-state-focus ui-selected ui-state-active");
            $(".bz-wp-modalview-header-input-search", inputContainer).blur();
        });

        inputContainer.delegate(".ui-bizagi-apply-button", "click", function () {
            closeModalViewPromise.resolve();
            inputContainer.data("kendoMobileModalView").close();
        });

        inputContainer.find(".bz-wp-modalview-close").bind("click", function () {
            closeModalViewPromise.reject();
            inputContainer.data("kendoMobileModalView").close();
        });

        $.when(closeModalViewPromise).done(function () {
            var selected = $("li.ui-selected", self.modalViewList);
            var _value = $(selected).data("value");
            var label = $(selected).text();

            //Update internal value
            if (typeof _value !== "undefined") {
                var newValue = { "id": _value, "value": label };
                self.setValue(newValue);
                self.selectedValue = newValue.value;
                self.setDisplayValue(newValue);
            }
        }).fail(function () {
        });
    },

    /**
     * Filtering list of elements
     * */
    filterList: function (search, $li, inputContainer) {
        if (search !== "") {
            inputContainer.find(".bz-wp-modalview-header-cancel-search").show(500);
        } else {
            inputContainer.find(".bz-wp-modalview-header-cancel-search").hide(500);
        }

        $li.filter(function () {
            var stringContainer = $(this).text().toUpperCase();
            var stringToSearch = search.toUpperCase();

            if (stringContainer.indexOf(stringToSearch) >= 0) {
                return $(this);
            } else {
                $(this).hide();
            }
        }).show();
    },

    /* SETS THE VALUE IN THE RENDERED CONTROL
    =====================================================*/
    /**
    *   Sets the value in the rendered control
    */
    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;
        var control = self.getControl();

        if (properties.editable) {
            if (typeof (value) !== "undefined") {
                control.find(".bz-rn-input-selected").html(value.value);

                if(value.value === "-------------" || value.value === "") {
                    control.find(".bz-wp-list-clear-icon-list").hide();
                }else{
                    control.find(".bz-wp-list-clear-icon-list").show();
                }
            }
        }
    },

    cleanData: function(){
        var self = this;
        var value = {id:"", value:""};
        var control = self.getControl();

        self.setValue(value);
        self.setDisplayValue(value);
    },

    /**
     * Setting the selected element.
     * */
    setModalViewDisplayValue: function() {
        var self = this;
        var properties = self.properties;

        if (self.list && properties.editable &&
            self.properties.value && typeof (self.properties.value) !== "undefined" &&
            self.properties.value.id !== "") {
            $("#ui-bizagi-list-" + self.properties.value.id, self.modalViewList)
	    	.addClass("ui-state-focus ui-selected ui-state-active");
        }
    },

    /**
    *   Template method to implement in each device to customize the render's behaviour to add handlers
    */
    configureHandlers: function () {
        var self = this;

        // Call base
        self._super();
        // Nothing todo, all events apply in selectable plugin
    },

    /**
    *   Returns the selected value in the template
    */
    getSelectedValue: function () {
        var self = this;
        return self.selectedValue;
    }
});
