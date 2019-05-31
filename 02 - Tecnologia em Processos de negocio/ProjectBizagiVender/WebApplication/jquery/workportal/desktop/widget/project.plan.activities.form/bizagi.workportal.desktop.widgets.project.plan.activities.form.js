/*
 *   Name: Bizagi Workportal Desktop Project Plan Activities Form
 *   Author: David Romero Estrada
 */

bizagi.workportal.widgets.project.base.extend("bizagi.workportal.desktop.widgets.project.plan.activities.form", {}, {

    /**
     *   Constructor
     */
    init: function (workportalFacade, dataService, notifier, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        self.dateFormat = bizagi.localization.getResource("dateFormat");
        self.timeFormat = bizagi.localization.getResource("timeFormat");
        self.estimatedFinishDateTime; //Save complete date and time, because datepicker dont save time

        self.plugins = {};
        self.form = {};
        self.notifier = notifier;
        // Load templates
        self.loadTemplates({
            "plan-activities-main": bizagi.getTemplate("bizagi.workportal.desktop.project.plan.activities.form").concat("#project-plan-activities-form"),
            "plan-activity-items": bizagi.getTemplate("bizagi.workportal.desktop.project.plan.activities.form").concat("#project-activity-items")
        });
    },

    /**
     * Render content
     * @returns {*}
     */
    renderContent: function () {
        var self = this;
        var tmpl = self.getTemplate("plan-activities-main");
        self.params.plan.contextualized = typeof(self.params.plan.contextualized) === "undefined" ? true : self.params.plan.contextualized;
        self.content = tmpl.render(self.params.plan);
        return self.content;
    },

    /**
     * Post render
     */
    postRender: function () {

        var self = this;
        var $content = self.getContent();

        self.sub("GETDATA_FORM_EDIT_ACTIVITIY", function(){
            return self.getDataActivityForm();
        });

        self.form = {
            name: $("#activity-form-itemname", self.content),
            description: $("#activity-form-description", self.content),
            assignee: $("#activity-form-assignee", self.content),
            date: $("#activity-form-date", self.content),
            duration: $("#activity-form-duration", self.content),
            allowEdition: $("#activity-form-allowedition", self.content),
            //save: $("#project-plan-activity-form-save", self.content),
            cancel: $("#project-plan-activity-form-cancel", self.content)
        };

        self.initializeAutoComplete(self.form.assignee);

        self.initializeDatePicker(self.form.date);
        self.initializeSpiner(self.form.duration);

        //self.initilizeActionMenu();

        //Activity Items
        $("#link-add-new-item", $content).on("click", $.proxy(self.addNewItem, self));

        self.eventsHandler();
    },

    /**
     * Initialize menu plugin
     */
    /*initilizeActionMenu: function () {
        var self = this;
        $(".ui-bizagi-wp-project-plan-activity-action-menu", self.content).menu({
            select: $.proxy(self.onSelectMenu, self)
        }).removeClass("ui-widget-content");
    },*/

    /**
     * Initialize items on activity
     * @param arrayItems
     */
    initializeItems: function (arrayItems) {
        var self = this;
        var $content = self.getContent();

        var templateItems = self.getTemplate("plan-activity-items");

        var argsTemplate = {};
        argsTemplate.items = arrayItems;

        var contentItem = templateItems.render(argsTemplate);

        var listItems = $(".list-items", $content);
        listItems.empty().append(contentItem);
        $(".inputtext", listItems).on("change", $.proxy(self.onSaveForm, self));

    },

    /**
     * Initialize autocomplete plugin for load users
     * @param element
     */
    initializeAutoComplete: function (element) {
        var self = this;
        var url = self.dataService.serviceLocator.getUrl("admin-getUsersList");
        element.autocomplete({
            minLength: 2,
            source: function (request, response) {
                $.ajax({
                    url: url,
                    data: {
                        domain: "",
                        userName: "",
                        fullName: request.term,
                        organization: "",
                        pag: 1,
                        pagSize: 100,
                        orderField: "fullName"
                    },
                    success: function (data) {
                        response($.map(data.users, function (item) {
                            return {
                                label: item.user,
                                value: item.idUser
                            };
                        }));
                    }
                });
            },
            select: function (event, ui) {
                var name = ui.item.label;
                element.val(name);
                self.form.IdAssignee = ui.item.value;
                self.onSaveForm(event);                
                self.pub("notify", {
                    type: "UPDATE_ACTIVITY_INFO",
                    args: {assignee : self.form.IdAssignee}
                });
                return false;
            },
            focus: function () {
                return false;
            },
            change: function (event, ui){
                if(ui.item === null){
                    self.form.IdAssignee = null;
                    self.form.assignee.val("");
                }
                return false;
            }

        });

    },

    /**
     * Initialize datepicker plugin
     * @param element
     */
    initializeDatePicker: function (element) {
        var self = this;
        element.datepicker({
            onSelect: function () {
                self.form.duration.val("");
                var oneDayInterval = (24 * 60 * 60 * 1000) - 50;
                self.estimatedFinishDateTime = self.form.date.datepicker("getDate") ? self.form.date.datepicker("getDate").getTime() + oneDayInterval : undefined;
                self.onSaveForm();
            },
            onClose: function(){
                if(element.val() === ""){
                    self.fieldDurationActive(true);
                }
            }
        });
        element.datepicker("option", "dateFormat", bizagi.util.dateFormatter.getDateFormatByDatePickerJqueryUI());
    },

    /**
     * Initialize spiner plugin
     * @param element
     */
    initializeSpiner: function (element) {
        var self = this;
        var spinTimer;                  //timer identifier
        var doneTypingInterval = 500;  //time in ms, 5 second for example

        //Save other reference of idActivitySelected, because this changes the first on other widget;
        //more information: QAF-3986
        var idActivitySelected = bizagi.clone(self.params.plan.idActivitySelected);

        function desactivateDateByDuration(event, newValue){
            var value = newValue || $(event.target).val();
            if (bizagi.util.isNumeric(value) && parseInt(value, 10) > 0) {
                self.form.date.val("");
                self.estimatedFinishDateTime = undefined;
            } else {
                $(event.target).val("");
            }
        }

        element.spinner({
            min: 1,
            max: 1000,
            placeHolder: bizagi.localization.getResource("workportal-hours"),
            change: function (event) {
                desactivateDateByDuration(event);

                //This event triggered when change select other activities
                //Because, the implementation spinner validates previusValue (when focus) VS value on input
                if(idActivitySelected === self.params.plan.idActivitySelected){
                    self.onSaveForm();
                }
            },
            spin: function( event, ui ) {
                desactivateDateByDuration(event, ui.value);

                clearTimeout(spinTimer);
                if ($('#myInput').val) {
                    spinTimer = setTimeout($.proxy(self.onSaveForm, self), doneTypingInterval);
                }
            }
        });

    },

    /**
     List items
     */
    onKeyPressInputItem: function (event) {
        var self = this;
        var $content = self.getContent();

        setTimeout(function () {
            $(event.target).siblings(".showtext").text($(event.target).val());
            $(event.target).prop("title", $(event.target).val());
        }, 51);

        var code = event.keyCode || event.which;
        $(".container-items").removeClass("editing-mouse");

        function setFocusItemEditing() {
            setTimeout(function () {
                $(".list-items .item.edit", $content).find(".inputtext").focus();

                //next code fix cursor to end value text field, when focus
                var auxValuePlaceCursorEndText = $(".list-items .item.edit", $content).find(".inputtext").val();
                $(".list-items .item.edit", $content).find(".inputtext").val(auxValuePlaceCursorEndText);
            }, 51);
        }

        function setFocusNextItem(event) {
            $(event.target).closest(".item").removeClass("edit");
            $(event.target).closest(".item").next().addClass("edit");
            setFocusItemEditing();
        }

        function setFocusPrevItem(event) {
            $(event.target).closest(".item").removeClass("edit");
            $(event.target).closest(".item").prev().addClass("edit");
            setFocusItemEditing();
        }

        switch (code.toString()) {
            case "13"://Enter
                if ($(event.target).val() !== "") {
                    $(event.target).closest(".item").removeClass("edit");
                    var indexItemEdited = $(event.target).closest(".item").index();
                    self.addNewItem("", indexItemEdited);
                }
                break;
            case "27"://escape
                if ($(event.target).closest(".item").prev().length !== 0) {
                    setFocusPrevItem(event);
                }
                else if ($(event.target).closest(".item").next().length !== 0) {
                    setFocusNextItem(event);
                }
                $(event.target).closest(".item").remove();
                self.onSaveForm(event);
                break;
            case "38"://up
                if ($(event.target).closest(".item").prev().length !== 0) {
                    setFocusPrevItem(event);
                }
                break;
            case "40"://down
                if ($(event.target).closest(".item").next().length !== 0) {
                    setFocusNextItem(event);
                }
                break;
        }

    },

    /**
     * Add css class to input focus
     * @param event
     */
    onFocusInputItem: function (event) {
        $(event.target).closest(".item").addClass("edit").siblings().removeClass("edit");
    },

    /**
     * Event trigger when focus out item
     * @param event
     */
    onFocusOutInputItem: function (event) {
        if ($.trim($(event.target).val()) === "") {
            var $item = $(event.target).closest(".item");
            $($item).css("display", "block").empty().css("background", "#E7BA99")
                .animate(
                    {
                        backgroundColor: "#FFF",
                        height: "0px"
                    }, 300,
                    "linear",
                    function() {
                        $(this).remove();
                    });
        } else {
            $(event.target).closest(".item").removeClass("edit");
        }
    },

    /**
     * Event mouse leave on item
     */
    onMouseLeaveItem: function () {
        var self = this;
        var $content = self.getContent();
        $(".container-items", $content).addClass("editing-mouse");
    },

    /**
     * Event trigger when delete item
     * @param event
     */
    onClickDeleteItem: function (event) {
        var self = this;

        $(event.target).closest(".item").off("keyup", ".inputtext", $.proxy(self.onKeyPressInputItem, self));
        $(event.target).closest(".item").off("click", ".item-button.delete", $.proxy(self.onClickDeleteItem, self));

        $(event.target).closest(".item").remove();

        self.onSaveForm(event);
    },

    /**
     * Add item on activity
     * @param nameItem
     * @param indexAppend
     */
    addNewItem: function (nameItem, indexAppend) {
        var self = this;
        var $content = self.getContent();

        if (indexAppend === undefined) {//If click link add Item
            indexAppend = $(".list-items .item", $content).length - 1;
            if (indexAppend === -1) {
                indexAppend = 0;
            }

        }

        var templateItems = self.getTemplate("plan-activity-items");

        var argsTemplate = {};
        argsTemplate.items = [{}];

        var contentItem = templateItems.render(argsTemplate);
        $(contentItem).addClass("edit");

        if ($(".list-items", $content).children().length === 0) {
            $(".list-items", $content).append(contentItem);
        }
        else {
            $(".list-items", $content).children().eq(indexAppend).after(contentItem);
        }

        $(".inputtext", contentItem).on("change", $.proxy(self.onSaveForm, self));        
        
        setTimeout(function () {
            $(".list-items .item.edit", $content).find(".inputtext").focus();
        }, 51);
    },

    /**
     * Event trigger when delete date
     * @param event
     */
    onDeleteDate: function (event) {
        var self = this;
        if (event.keyCode === 8) {
            $(event.target).val("");
            self.fieldDurationActive(true);
        }
    },

    /**
     * Event trigger when keyup duration
     * @param event
     */
    onTypeDuration: function (event) {
        var self = this;
        var $target = $(event.target);
        if ($target.val() !== "") {
            self.form.date.val("");
            self.estimatedFinishDateTime = undefined;
        }
    },

    /**
     * When cancel form
     */
    onCancelForm: function () {
        var self = this;
        self.pub("notify", {
            type: "PLANSIDEBAR",
            args: self.params
        });
    },

    /**
     * Save activity
     * @param event
     */
    onSaveForm: function (event) {
        if (event) event.preventDefault();
        var self = this;
        var dataFormActivity = self.getDataActivityForm();
        if (dataFormActivity) {
            $.when(self.dataService.editActivityPlan(dataFormActivity)).always(function (response, responseText, xhr) {
                if (xhr.status === 200 && responseText !== "success") {
                    self.notifier.showSucessMessage(
                            printf(bizagi.localization.getResource("workportal-project-plan-activity-update-message"), ""));
                }
            });
        }
    },

    /**
     * Get data current activity
     * @returns {*}
     */
    getDataActivityForm: function(){
        var self = this;

        /*var activityToShow = self.params.plan.activities.filter(function (activity) {
            return activity.id === self.params.plan.idActivitySelected;
        })[0];*/        

        function getArrayItems() {
            var arrayNamesItem = [];
            $(".list-items .inputtext").each(function () {
                if ($(this).val().trim() !== "") {
                    arrayNamesItem.push({
                        id: undefined,
                        resolved: $(this).closest(".item").find("input[type='checkbox']").is(":checked"),
                        /* idActivity: activityToShow.id,*/
                        name: $(this).val()
                    });
                }
            });
            return arrayNamesItem;
        }        

        if (self.validateParams(self.form.name.val())) {
            var idUserAssigned = self.form.IdAssignee || bizagi.currentUser.idUser;
            var allowEdition = self.form.allowEdition.is(":checked") || false;

            var currentActivity = {};

            $.each(self.params.plan.activities, function () {
                if (this.id === self.params.plan.idActivitySelected) {
                    this.duration = self.form.duration.val();
                    this.userAssigned = idUserAssigned;
                    this.allowEdition = allowEdition;
                    this.description = self.form.description.val();
                    this.name = self.form.name.val();
                    this.estimatedFinishDate = self.estimatedFinishDateTime;
                    this.items = getArrayItems();
                    this.numTotalItems = this.items.length;
                    currentActivity = this;
                }
            });

            return currentActivity;
        }
        else{
            return false;
        }
    },

    /**
     * Validate params before update activity
     * @returns {boolean}
     */
    validateParams: function (name) {
        var self = this;
        if(name === ""){
            var nameValidation = "* " + bizagi.localization.getResource("workportal-project-plan-popup-field-name-required");
            self.form.name.next().find("span").html(nameValidation);
            return false;
        }
        else{
            self.form.name.next().find("span").empty();
            return true;
        }
    },

    /**
     * Event executed when load activity on form
     * @param event
     * @param params
     */
    onChangeForm: function (event, params) {
        var self = this;
        self.estimatedFinishDateTime = undefined;

        var idActivityToShow = params.args.idActivityToShow || self.params.plan.idActivitySelected;
        var activityToShow = self.params.plan.activities.filter(function (activity) {
            return activity.id === idActivityToShow;
        })[0];

        self.setValuesFormFields(params.args.isEditableFormActivity, activityToShow);
        self.setEnabledFormFields(params.args.isEditableFormActivity, activityToShow);
    },

    onChangeActivityName: function (event) {
        var self = this;
        self.onSaveForm();
        self.pub("notify", {
            type: "UPDATE_ACTIVITY_INFO",
            args: { displayName: $(event.target).val() }
        });
    },

    /**
     * Enabled or disabled form fields
     * @param isEditableFormActivity
     * @param activityToShow
     */
    setEnabledFormFields: function(isEditableFormActivity, activityToShow){
        var self = this;
        $(self.form.date).blur();//remove focus
        if(isEditableFormActivity){
            $(".ui-bizagi-wp-project-plan-activity-action-menu", self.content).show();
            $("#activity-form-itemname", self.content).prop("disabled", false);
            $("#activity-form-itemname", self.content).removeClass("ui-state-disabled");
            $("#activity-form-description", self.content).prop("disabled", false);
            $("#activity-form-description", self.content).removeClass("ui-state-disabled");            

            self.form.assignee.removeClass("ui-state-disabled");
            self.activateElement(self.form.assignee);

            self.fieldDurationActive(true);
            self.activateElement(self.form.date);
            self.form.date.removeClass("ui-state-disabled");

            $("#activity-form-allowedition", self.content).prop("disabled", false);            
            $(".container-items", self.content).addClass("is-editing");
            $("#link-add-new-item", self.content).show();
        }
        else{
            $(".ui-bizagi-wp-project-plan-activity-action-menu", self.content).hide();
            $("#activity-form-itemname", self.content).prop("disabled", true);
            $("#activity-form-itemname", self.content).addClass("ui-state-disabled");
            $("#activity-form-description", self.content).prop("disabled", true);
            $("#activity-form-description", self.content).addClass("ui-state-disabled");
            self.form.assignee.addClass("ui-state-disabled");
            self.deactivateElement(self.form.assignee);
            self.deactivateElement(self.form.date);
            self.form.date.addClass("ui-state-disabled");            
            self.fieldDurationActive(false);
            $("#activity-form-allowedition", self.content).prop("disabled", true);
            $(".container-items", self.content).removeClass("is-editing");
            $("#link-add-new-item", self.content).hide();
        }
    },

    /**
     * Set values to form fields
     * @param isEditableFormActivity
     * @param activityToShow
     */
    setValuesFormFields: function(isEditableFormActivity, activityToShow){
        var self = this;
        $("#project-plan-activity-form", self.content)[0].reset();
        $(".list-items .item", self.content).remove();

        self.form.name.val(activityToShow.name);
        self.form.description.val(activityToShow.description);
        if (activityToShow.userAssigned) {
            self.setUserAssignedById(activityToShow.userAssigned);
        }

        self.form.date.datepicker("option", "minDate", new Date(self.getDateServer()));
        if (activityToShow.estimatedFinishDate && parseInt(activityToShow.estimatedFinishDate, 10) < self.getDateServer()) {
            self.form.date.datepicker("option", "minDate", new Date(parseInt(activityToShow.estimatedFinishDate, 10)));//set minimum because, if date is past
        }
        if(activityToShow.estimatedFinishDate){
            self.form.date.datepicker("setDate", new Date(parseInt(activityToShow.estimatedFinishDate, 10)));
            self.estimatedFinishDateTime = activityToShow.estimatedFinishDate;
        }

        if (activityToShow.duration) {
            self.form.duration.val(parseInt(activityToShow.duration, 10));
        }

        if (activityToShow.allowEdition === true) {
            self.form.allowEdition.prop("checked", true);
        }
        else {
            self.form.allowEdition.prop("checked", false);
        }

        if (activityToShow.numTotalItems > 0) {
            $(".container-items h4", self.content).show();
            $(".container-items span", self.content).hide();
            self.initializeItems(activityToShow.items);
        }
        else if (!isEditableFormActivity) {
            $(".container-items span", self.content).show();
            //$(".container-items h4", self.content).hide();
        } else {
            $(".container-items span", self.content).hide();
        }
    },

    /**
     * Active or deactive duration field
     * @param state
     */
    fieldDurationActive: function(state){
        var self = this;
        if(state){
            self.form.duration.prop("disabled", false);
            self.form.duration.spinner("option", "disabled", false);
        }
        else{
            self.form.duration.prop("disabled", true);
            self.form.duration.spinner("option", "disabled", true);
        }
    },

    /**
     * Deactive field
     * @param $el
     */
    deactivateElement: function ($el) {
        if($el.prop){
            $el.prop("disabled", true);
            $el.closest("tr").addClass("ui-bizagi-workportal-opacity");
        }
        else{
            $el.enable(false);
            $el.wrapper.closest("tr").addClass("ui-bizagi-workportal-opacity");
        }
    },

    /**
     * Active element
     * @param $el
     */
    activateElement: function ($el) {
        if($el.prop){
            $el.prop("disabled", false);
            $el.closest("tr").removeClass("ui-bizagi-workportal-opacity");
        }
        else{
            $el.enable(true);
            $el.wrapper.closest("tr").removeClass("ui-bizagi-workportal-opacity");
        }
    },

    /**
     * Set User Id to form
     * @param idUser
     */
    setUserAssignedById: function (idUser) {
        var self = this;
        //Show images users
        self.callGetDataUsers(idUser).then(function (responseUsers) {
            self.form.assignee.val(responseUsers[0].name);
        });
        self.form.IdAssignee = idUser;
    },


    /**
     * Set events to items and plugins
     */
    eventsHandler: function () {
        var self = this;

        self.form.date.on("keydown", $.proxy(self.onDeleteDate, self));
        self.form.duration.on("keyup", $.proxy(self.onTypeDuration, self));
        //self.form.save.on("click", $.proxy(self.onSaveForm, self));
        self.form.cancel.on("click", $.proxy(self.onCancelForm, self));

        //Autosave input, checkbox type fields

        self.form.name.on("change", $.proxy(self.onChangeActivityName, self));
        self.form.description.on("change", $.proxy(self.onSaveForm, self));        
        self.form.allowEdition.on("change", $.proxy(self.onSaveForm, self));

        self.form.name.donetyping(function(){
            self.onSaveForm();
        });

        self.form.description.donetyping(function(){
            self.onSaveForm();
        });

        self.form.duration.donetyping(function(){
            self.onSaveForm();
        });

        //Events List items
        $(".list-items", self.content).on("keyup", ".inputtext", $.proxy(self.onKeyPressInputItem, self));
        $(".list-items", self.content).on("focusout", ".inputtext", $.proxy(self.onFocusOutInputItem, self));
        $(".list-items", self.content).on("focus", ".inputtext", $.proxy(self.onFocusInputItem, self));
        $(".list-items", self.content).on("click", ".item-button.delete", $.proxy(self.onClickDeleteItem, self));
        $(".list-items", self.content).on("mouseleave", ".item", $.proxy(self.onMouseLeaveItem, self));

        self.sub("EDITACTIVITY", $.proxy(self.onChangeForm, self));
    },

    /***
     * call services
     */
    /*
     *  Get data for users
     */
    callGetDataUsers: function (csvIdUsers) {
        var self = this,
            defer = $.Deferred();
        var params = {
            userIds: csvIdUsers,
            width: 50,
            height: 50
        };

        self.dataService.getUsersData(params).always(function (response) {
            defer.resolve(response);
        });
        return defer.promise();
    },

    /**
     * Clean events
     */
    clean: function(){
        var self = this;
        self.unsub("EDITACTIVITY", $.proxy(self.onChangeForm, self));
    }


});

bizagi.injector.register("bizagi.workportal.desktop.widgets.project.plan.activities.form", ["workportalFacade", "dataService", "notifier", bizagi.workportal.desktop.widgets.project.plan.activities.form], true);