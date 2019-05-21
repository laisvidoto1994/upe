/*
*   Name: BizAgi Report for Sensors
*   Author: David Romero
*   Comments:
*   -   This script draws a specific report for Sensors
*/

bizagi.reporting.report.extend("bizagi.reporting.report.sensorsedt", {}, {
    /*
    * Initialize report
    */
    init: function (params) {

        this._super(params);

        this.allSensors = [];
        this.dspSensors = [];
        this.cacheId = -999;
        this.swStart = 0;
        this.swEnd = 0;
        this.cntGuid = 0;
    },

    /*
    * Get filters object
    */
    getFiltersObject: function () {
        return { process: {} };
    },

    /*
    *   Initialize all needed templates
    */
    initializeTemplates: function () {
        return {
            "main": (bizagi.getTemplate("bizagi.reporting.report.sensorsedt") + "#bz-rp-sensorsedt-main"),
            "list": (bizagi.getTemplate("bizagi.reporting.report.sensorsedt") + "#bz-rp-sensorsedt-list"),
            "newcounter": (bizagi.getTemplate("bizagi.reporting.report.sensorsedt") + "#bz-rp-sensorsedt-countertable-create"),
            "newstopwatch": (bizagi.getTemplate("bizagi.reporting.report.sensorsedt") + "#bz-rp-sensorsedt-stopwatchtable-create"),
            "stopwatchtooltip": (bizagi.getTemplate("bizagi.reporting.report.sensorsedt") + "#bz-rp-sensorsedt-stopwatchtooltip"),
            "errormsg": (bizagi.getTemplate("bizagi.reporting.report.sensorsedt") + "#bz-rp-sensorsedt-errormsg")
        };
    },

    /*
    *   Templated render component
    */
    renderContent: function () {
        var self = this;
        var main = self.getTemplate("main");

        // Render main template
        self.content = $.tmpl(main);

        // processviewer container
        self.$processViewer = $(".bz-rp-processviewer-canvas", self.content);

        return $.when(self.loadComponents(), self.services.getSensorsList()).pipe(function (filters, sensors) {

            self.allSensors = sensors[0].processes;
            self.drawReport();

            return self.content;
        });

    },

    /*
    * Post Render
    */
    postRender: function () {

        var self = this;

        self.tooltipEvents();
        self.eventsHandler();

        //set columns size
        self.setColumnsSize();
    },

    /*
    * Load components
    */
    loadComponents: function () {

        var self = this;

        return self.loadProcessesVersionComponent();
    },

    /*
    * Redraw Graphics
    */
    drawReport: function () {

        var self = this;

        //eanble create buttons
        self.enableCreation();
        self.drawProcessModel();
        self.renderSensorsList();
    },

    /*
    * Render sensors list
    */
    renderSensorsList: function (dftSensor) {

        var self = this;
        var dft = dftSensor || { name: "", type: "" };
        var tmpl = self.getTemplate("list");
        var process = self.model.process;
        var sensors = self.getSensorsByProcessId(process);
        this.dspSensors = (typeof (sensors) !== "undefined") ? sensors.sensors : [];

        //remove creation form if exists
        $("#bz-rp-reports-sensors-create ul", self.content).remove();

        //render list and append to container
        $("#bz-rp-reports-sensors-list", self.content).html($.tmpl(tmpl, sensors, dft));

    },

    /*
    * Implement the plugin process viewer
    */
    drawProcessModel: function () {

        var self = this;

        //reset sensor value
        self.$processViewer.data('sensor', 'none');

        self.renderProcessViewer(self.$processViewer);
    },

    /*
    * Set columns size
    */
    setColumnsSize: function () {

        var self = this;

        self.setColumnsWidth();

    },

    /*
    * Search sensors list by process id and retorn the array
    */
    getSensorsByProcessId: function (process) {

        var self = this;

        var sensors = self.allSensors.filter(function (arr, x) {
            return arr.id === process.id;
        });

        return sensors[0];
    },

    /*
    * Search sensors by sensor id
    */
    getSensorById: function (id) {

        var self = this;

        var sensor = self.dspSensors.filter(function (arr, x) {
            return arr.id === id;
        });

        return sensor[0];
    },

    /*
    * change between edition form and read form
    */
    toggleEdition: function ($li) {

        var $frmContainer = $li.find('.bz-rp-sensors-form');

        $frmContainer.toggleClass('bz-rp-form-edition').toggleClass('bz-rp-form-readonly');
    },

    /*
    * Apply edition for counters
    */
    applyEditionForCounters: function ($li) {

        var self = this;
        var $form = $li.find('.bz-rp-sensors-form');

        //get element in the form
        var $formelm = $form.find('input, textarea');

        //get data for sending
        var id = $li.data('id'),
            guid = (self.cntGuid) ? self.cntGuid : $li.data('guid'),
            name = $formelm[0].value,
            dspName = $formelm[1].value,
            descrip = $formelm[2].value;

        //Apply edition
        if (self.isValidForm($formelm)) {

            //filter for checking sensor name
            var fltCheck = "sensor=" + JSON.stringify({ id: id, name: name });

            //filter for updating sensor
            var newData = { id: id, name: name, displayName: dspName, description: descrip, guidTask: guid };
            var fltUpdate = "sensor=" + JSON.stringify(newData);

            $.when(self.services.updateCounter(fltUpdate)).done(function (response) {

                var $el = $($formelm[0]);
                var $errorMsg = $el.siblings(".bz-rp-errormsg");

                if (response.result !== true) {

                    var message = self.getResource("bz-rp-sensorsedt-formvalidation-rptcounter");
                    self.showErrorMessage($el, $errorMsg, message);

                } else {

                    //remove message
                    self.removeErrorMessage($el, $errorMsg);

                    //reset guid
                    self.cntGuid = 0;

                    //reset process viewer container
                    self.$processViewer.data('sensor', 'none');

                    //enable sensor creation
                    self.enableCreation();

                    self.resetSensorsList({ name: name, type: 'counter' });
                }
            });
        }
    },

    /*
    * Apply edition for stopwatches
    */
    applyEditionForStopwatches: function ($li) {

        var self = this;
        var $form = $li.find('.bz-rp-sensors-form');

        //get element in the form
        var $formelm = $form.find('input, textarea');

        //get values
        var name = $formelm[0].value,
            id = $li.data('id'),
            dspName = $formelm[1].value,
            guidFrom = (self.swStart) ? self.swStart : $li.data('guidfrom'),
            guidTo = (self.swEnd) ? self.swEnd : $li.data('guidto'),
            descript = $formelm[2].value,
            days = $formelm[3].value,
            hours = $formelm[4].value,
            minutes = $formelm[5].value;

        //validate counter form
        if (self.isValidForm($formelm)) {

            //filter for checking sensor name
            var fltCheck = "sensor=" + JSON.stringify({ id: id, name: name });

            //filter for create a new stopwatch
            var newData = { id: id, name: name, displayName: dspName, description: descript, guidTaskFrom: guidFrom, guidTaskTo: guidTo, slaDate: { days: days, hours: hours, minutes: minutes} };
            var fltCreate = "sensor=" + JSON.stringify(newData);

            $.when(self.services.updateStopwatch(fltCreate)).done(function (response) {

                var $el = $($formelm[0]);
                var $errorMsg = $el.siblings(".bz-rp-errormsg");

                if (response.result !== true) {

                    var message = self.getResource("bz-rp-sensorsedt-formvalidation-rptstopwatch");
                    self.showErrorMessage($el, $errorMsg, message);

                } else {

                    //remove message
                    self.removeErrorMessage($el, $errorMsg);

                    //reset process viewer data
                    self.swStart = 0, self.swEnd = 0;
                    self.$processViewer.data('sensor', 'none').processviewer('unSelectAllShapes');

                    //enable sensor creation
                    self.enableCreation();

                    self.resetSensorsList({ name: name, type: 'stopwatch' });

                }
            });

        }

    },

    /*
    * Reset changes 
    */
    resetForm: function ($li) {

        var self = this;
        var $form = $(".bz-rp-sensors-form", $li);

        //reset error messages
        $form.find(".bz-rp-errormsg").empty();

        //reset
        $form[0].reset();
    },

    /*
    * Append form to create sensors
    */
    appendForm: function (index) {

        var self = this;
        var tmpl = self.getTemplate(index);
        var $form = $("#bz-rp-reports-sensors-create > form", self.content);

        $form.html($.tmpl(tmpl));

        return $form;
    },

    /*
    * Reset sensors list
    */
    resetSensorsList: function (dftSensor) {

        var self = this;

        $.when(self.services.getSensorsList()).done(function (sensors) {

            self.allSensors = sensors.processes;
            self.renderSensorsList(dftSensor);
        });
    },

    /*
    * Create new Counter
    */
    createCounter: function (guid) {

        var self = this;
        var $form = $("#bz-rp-reports-sensors-create form", self.content);

        //get element in the form
        var $formelm = $form.find('input, textarea');

        //get values
        var name = $formelm[0].value,
            dspName = $formelm[1].value,
            descript = $formelm[2].value;

        //validate counter form
        if (self.isValidForm($formelm)) {

            //filter for checking sensor name
            var fltCheck = "sensor=" + JSON.stringify({ "name": name });

            //filter for creating sensor
            var newData = { "name": name, "displayName": dspName, "description": descript, "guidTask": guid };
            var fltCreate = "sensor=" + JSON.stringify(newData);

            $.when(self.services.addCounter(fltCreate)).done(function (response) {

                var $el = $($formelm[0]);
                var $errorMsg = $el.siblings(".bz-rp-errormsg");

                if (response.result !== true) {

                    var message = self.getResource("bz-rp-sensorsedt-formvalidation-rptcounter");
                    self.showErrorMessage($el, $errorMsg, message);

                } else {

                    //remove message
                    self.removeErrorMessage($el, $errorMsg);

                    //empty form
                    $form.empty();

                    //reset process viewer
                    self.$processViewer.data('sensor', 'none');

                    //reset cache id
                    self.cacheId = -999;

                    //reset the list of sensor
                    self.resetSensorsList({ name: name, type: 'counter' });
                }

            });

        }
    },

    /*
    * Create new Stopwatch
    */
    createStopwatch: function (guidFrom, guidTo) {

        var self = this;
        var $form = $("#bz-rp-reports-sensors-create form", self.content);

        //get element in the form
        var $formelm = $form.find('input, textarea');

        //get values
        var name = $formelm[0].value,
            dspName = $formelm[1].value,
            descript = $formelm[2].value,
            days = $formelm[3].value,
            hours = $formelm[4].value,
            minutes = $formelm[5].value;

        //validate counter form
        if (self.isValidForm($formelm)) {

            //filter for checking sensor name
            var fltCheck = "sensor=" + JSON.stringify({ name: name });

            //filter for create a new stopwatch
            var newData = { name: name, displayName: dspName, description: descript, guidTaskFrom: guidFrom, guidTaskTo: guidTo, slaDate: { days: days, hours: hours, minutes: minutes} };
            var fltCreate = "sensor=" + JSON.stringify(newData);

            $.when(self.services.addStopwatch(fltCreate)).done(function (response) {

                var $el = $($formelm[0]);
                var $errorMsg = $el.siblings(".bz-rp-errormsg");

                if (response.result !== true) {

                    var message = self.getResource("bz-rp-sensorsedt-formvalidation-rptstopwatch");
                    self.showErrorMessage($el, $errorMsg, message);

                } else {

                    //remove message
                    self.removeErrorMessage($el, $errorMsg);

                    //empty form
                    $form.empty();

                    //reset cache id
                    self.cacheId = -999;

                    //reset process viewer
                    self.$processViewer.data('sensor', 'none').processviewer('unSelectAllShapes');

                    //reset the list of sensor
                    self.resetSensorsList({ name: name, type: 'stopwatch' });

                }
            });
        }

    },

    /*
    * Cancel counters creation
    */
    cancelCntCreation: function () {

        var self = this;

        //reset guid values
        self.cntGuid = 0;

        //remove form
        $("#bz-rp-reports-sensors-create ul", self.content).remove();

        //reset process viewer
        self.$processViewer.data('sensor', 'none').processviewer('unSelectAllShapes');
    },

    /*
    * Cancel stopwatch creation
    */
    cancelSwCreation: function () {

        var self = this;

        //reset guids values
        self.swStart = self.swEnd = 0;

        //remove form
        $("#bz-rp-reports-sensors-create ul", self.content).remove();

        //reset process viewer
        self.$processViewer.data('sensor', 'none').processviewer('unSelectAllShapes').processviewer('clearRoute');

    },

    /*
    * Delete counters
    */
    deleteCounters: function ($li) {

        var self = this;
        var message = self.getResource("bz-rp-sensorsedt-deleteconfirmation");
        var id = $li.data('id');

        $.when(bizagi.showConfirmationBox(message, "Bizagi", "warning")).done(function () {

            var filter = "id=" + id;

            $.when(self.services.deleteCounter(filter)).done(function () {

                if (self.$processViewer.data('sensor') === "none") {
                    self.$processViewer.processviewer('unSelectAllShapes');
                }

                self.resetSensorsList();
            });

        });

    },

    /*
    * Delete stopwatches
    */
    deleteStopwatches: function ($li) {

        var self = this;
        var message = self.getResource("bz-rp-sensorsedt-deleteconfirmation");
        var id = $li.data('id');

        $.when(bizagi.showConfirmationBox(message, "Bizagi", "warning")).done(function () {

            var filter = "id=" + id;

            $.when(self.services.deleteStopwatch(filter)).done(function () {

                if (self.$processViewer.data('sensor') === "none") {
                    self.$processViewer.processviewer('clearRoute');
                }

                self.resetSensorsList();
            });

        });
    },

    /*
    * Validate form
    */
    isValidForm: function (elements) {

        var self = this;
        var isValid = true;

        for (var i = 0, length = elements.length; i < length; i++) {

            var $errormsg = $(elements[i]).siblings(".bz-rp-errormsg");
            var validFld = true;

            if ($(elements[i]).is('input[type=text]')) {
                if (self.validateRequired($(elements[i]), $errormsg)) {
                    if (!self.validatePattern($(elements[i]), $errormsg)) {
                        validFld = false;
                    }
                } else {
                    validFld = false;
                }
            } else if ($(elements[i]).is('input[type=number]')) {
                if (!self.validateNumber($(elements[i]), $errormsg)) {
                    validFld = false;
                }
            } else if ($(elements[i]).is('textarea')) {
                if (!self.validateRequired($(elements[i]), $errormsg)) {
                    validFld = false;
                }
            }

            if (validFld) {
                self.removeErrorMessage($errormsg);
            } else {
                isValid = false;
            }
        }

        return isValid;
    },

    /*
    * Validate is element is empty and show a message
    */
    validateRequired: function ($el, $errormsg) {

        var self = this;
        var isValid = true;

        if ($el.val() === "") {

            isValid = false;
            self.showErrorMessage($el, $errormsg, self.getResource("bz-rp-sensorsedt-formvalidation-required"));
        }

        return isValid;
    },

    /*
    * Validate Pattern
    */
    validatePattern: function ($el, $errormsg) {

        var self = this;
        var pattern = /[$\\@\\\#%\^\&\*\(\)\[\]\+\_\{\}\`\~\=\|]/;
        var isValid = true;

        if ($el.val().search(pattern) !== -1) {

            isValid = false;
            self.showErrorMessage($el, $errormsg, self.getResource("bz-rp-sensorsedt-formvalidation-invalidcharts"));
        }

        return isValid;
    },

    /*
    * validate Number
    */
    validateNumber: function ($el, $errormsg) {

        var self = this;
        var isValid = true;
        var value = parseInt($el.val());
        var min = parseInt($el.prop('min'));
        var max = parseInt($el.prop('max'));

        if (!isNaN(value)) {

            if (value < min || value > max) {

                isValid = false;
                self.showErrorMessage($el, $errormsg, self.getResource("bz-rp-sensorsedt-formvalidation-invalidnumber") + " " + min + " - " + max);
            }
        } else {

            isValid = false;
            self.showErrorMessage($el, $errormsg, self.getResource("bz-rp-sensorsedt-formvalidation-number"));
        }

        return isValid;
    },

    /*
    * Show error message
    */
    showErrorMessage: function ($el, $errormsg, message) {

        var self = this;

        if ($errormsg.length) {

            $errormsg.html(message);
        } else {

            var tmpl = self.getTemplate("errormsg");
            $el.after($.tmpl(tmpl, { message: message }));
            $el.parent().addClass("ui-bizagi-render-control-required");
        }

    },

    /*
    * Remove error message
    */
    removeErrorMessage: function ($errorcnt) {
        $errorcnt.parent().removeClass("ui-bizagi-render-control-required");
        $errorcnt.remove();
    },

    /*
    * Get the tooltip data
    */
    getTooltipContent: function (hotspot) {

        var self = this;

        if (self.$processViewer.data('sensor') === "stopwatch") {

            var guid = hotspot.id;
            var taskName = $(hotspot).find('.processviewer-hotspot-label').html();
            var tooltipTmpl = self.getTemplate("stopwatchtooltip");

            //return rendered tmpl
            return $.tmpl(tooltipTmpl, { guid: guid, taskName: taskName });
        } else {

            return "";
        }

    },

    /*
    * Enable apply button to create sensor
    */
    enableApplyButton: function () {

        var self = this;
        $("#bz-rp-reports-sensors-create .bz-rp-sensors-button-apply", self.content).removeAttr('disabled');
    },

    /*
    * Remove messsge from creation form
    */
    removeCrtMsg: function () {

        var self = this;
        $("#bz-rp-reports-sensors-create span.bz-rp-errormsg:first-of-type", self.content).remove();
    },

    /*
    * Show all posibles paths from task to task
    */
    showAllPaths: function (guidFrom, guidTo) {

        var self = this;
        var filter = "processId=" + self.model.process.id + "&taskFrom=" + guidFrom + "&taskTo=" + guidTo;

        //clear previous routes
        self.$processViewer.processviewer('clearRoute');

        $.when(self.services.getAllPaths(filter)).done(function (result) {

            var length = result.paths.length;

            if (length) {
                for (var x = 0; x < length; x++) {
                    self.$processViewer.processviewer('drawRoute', result.paths[x].codedPath);
                }
            } else {
                self.$processViewer.processviewer('drawRoute', [guidFrom, guidTo]);
            }

        });

    },

    /*
    * Disable sensors creation
    */
    disableCreation: function () {

        var self = this;
        $("#bz-rp-reports-sensors-buttons button").attr('disabled', 'disabled');
    },

    /*
    * Enabled sensors creation
    */
    enableCreation: function () {

        var self = this;
        $("#bz-rp-reports-sensors-buttons button").removeAttr('disabled');
    },

    /*
    * Collapse list
    */
    collpaseList: function () {

        var self = this;
        var $selectedSensor = $('#bz-rp-reports-sensors-list li.bz-rp-sensors-selected', self.content);

        $selectedSensor.removeClass('bz-rp-sensors-selected');

        //return deferred
        return $(".bz-rp-sensors-form-container", $selectedSensor).slideUp('fast');
    },

    /*
    * Tooltip events
    */
    tooltipEvents: function () {

        var self = this;

        //add disabled tooltip to process viewer container
        self.applyViewerTooltip(self.$processViewer, {});

        //events for buttons inside tooltip
        $(document).off('click.swtooltip').on('click.swtooltip', 'button.bz-rp-sensors-tooltip-stopwathstarts, button.bz-rp-sensors-tooltip-stopwathends', function (event) {

            var $element = $(this);
            var $tooltip = $element.closest('.ui-tooltip');
            var guid = $element.closest(".bz-rp-sensors-tooltip-container").data('guid');

            if (guid !== self.swStart && guid !== self.swEnd) {

                switch ($element.data('type')) {
                    case "swstarts":
                        if (self.swStart) self.$processViewer.processviewer('unSelectShape', self.swStart);

                        self.$processViewer.processviewer('selectShape', guid);
                        self.swStart = guid;
                        break;
                    case "swends":
                        if (self.swEnd) self.$processViewer.processviewer('unSelectShape', self.swEnd);

                        self.$processViewer.processviewer('selectShape', guid);
                        self.swEnd = guid;
                        break;
                }

                if (self.swEnd !== 0 && self.swStart !== 0) {
                    //enable apply button
                    self.enableApplyButton();
                    self.showAllPaths(self.swStart, self.swEnd);
                    self.removeCrtMsg();
                }
            }

            $tooltip.remove();

        });

    },

    /*
    * Events Handlers
    */
    eventsHandler: function () {

        var self = this;

        //events to append sensor forms
        $("#bz-rp-reports-sensors-buttons", self.content).on("click", "button", function (event) {

            var $element = $(this);

            //reset hotspot values
            self.cntGuid = 0, self.swStart = 0, self.swEnd = 0;

            //reset process viewer
            self.$processViewer.processviewer('unSelectAllShapes').processviewer('clearRoute');

            //collapse all list
            self.collpaseList();

            if ($element.hasClass("bz-rp-sensors-button-newstopwatch")) {
                self.$processViewer.data('sensor', 'stopwatch');
                self.appendForm('newstopwatch');
                self.requiredHandler(self);
            } else if ($element.hasClass("bz-rp-sensors-button-newcounter")) {
                self.$processViewer.data('sensor', 'counter');
                self.appendForm('newcounter');
                self.requiredHandler(self);
            }

        });

        //events to create a new counter
        $("#bz-rp-reports-sensors-create", self.content).on("click", ".bz-rp-sensors-form-createcounter button", function (event) {

            var $element = $(this);

            event.preventDefault();

            if ($element.hasClass("bz-rp-sensors-button-apply")) {
                self.createCounter(self.cntGuid);
            } else if ($element.hasClass("bz-rp-sensors-button-cancel")) {
                self.cancelCntCreation();
            }

        });

        //events to create a new stopwatch
        $("#bz-rp-reports-sensors-create", self.content).on("click", ".bz-rp-sensors-form-createstopwatch button", function (event) {

            var $element = $(this);

            event.preventDefault();

            if ($element.hasClass("bz-rp-sensors-button-apply")) {
                self.createStopwatch(self.swStart, self.swEnd);
            } else if ($element.hasClass("bz-rp-sensors-button-cancel")) {
                self.cancelSwCreation();
            }

        });

        //events to slide sensors list
        $("#bz-rp-reports-sensors-list", self.content).on("click", ".bz-rp-sensors-list-header", function (event) {

            if (!$(event.target).is("button") && self.$processViewer.data('sensor') === "none") {

                var $element = $(this);
                var $li = $element.closest("li");
                var id = $li.data('id');

                //disabled previous item in the list
                if (self.cacheId !== id) {

                    //collapse all list
                    $.when(self.collpaseList()).done(self.slideFormContainer($li));
                } else {

                    //slide form
                    self.slideFormContainer($li);
                }

                //save previous id
                self.cacheId = id;
            }
        });


        //events to edit, cancel or delete sensors
        $("#bz-rp-reports-sensors-list", self.content).on("click", "button", function (event) {

            event.preventDefault();

            var $element = $(this);
            var $li = $element.closest('li');
            var type = $li.data('type');

            if ($element.hasClass("bz-rp-sensors-button-edit")) {

                self.editionEvent($li, type);
            } else if ($element.hasClass("bz-rp-sensors-button-cancel")) {

                self.cancelEvent($li, type);
            } else if ($element.hasClass("bz-rp-sensors-button-apply")) {

                self.applyEvent($li, type);
            } else if ($element.hasClass("bz-rp-sensors-button-delete")) {

                self.deleteEvent($li, type);
            }
        });

        //events to highlight a hotspot
        self.$processViewer.on("click", ".processviewer-hotspot", function (event) {

            var $element = $(this);
            var sensor = self.$processViewer.data('sensor');
            var id = self.cntGuid = $element.prop('id');

            if (sensor === "counter") {
                self.$processViewer.processviewer('unSelectAllShapes').processviewer('selectShape', id);

                //enable apply button
                self.enableApplyButton();
                self.removeCrtMsg();
            }

        });

        
        //wait until process viewer is loaded
        self.$processViewer.on("pvComplete", function (obj) {
            self.setProcessViewerHeight();
        });

        //events for return button
        $(".bz-rp-reports-sensors-header button.bz-rp-sensors-button-back").on('click', function () {
            self.loadReport("sensors");
        });

    },

    /*
     * Required Handler
     */
    requiredHandler : function(self){

        $(".bz-rp-sensors-form .ui-required", self.content).on("focusout", "input", function (event) {

            event.preventDefault();

            var $element = $(this);

            var $errormsg = $element.siblings(".bz-rp-errormsg");
            var validFld = true;

            if ($element.is('input[type=text]')) {
                if (self.validateRequired($element, $errormsg)) {
                    if (!self.validatePattern($element, $errormsg)) {
                        validFld = false;
                    }
                } else {
                    validFld = false;
                }
            } else if ($element.is('input[type=number]')) {
                if (!self.validateNumber($element, $errormsg)) {
                    validFld = false;
                }
            }

            if (validFld) {
                self.removeErrorMessage($errormsg);
            }
        });

        $(".bz-rp-sensors-form .ui-required", self.content).on("focusout", "textarea", function (event) {

            event.preventDefault();

            var $element = $(this);

            var $errormsg = $element.siblings(".bz-rp-errormsg");
            var validFld = true;

            value =  $element.val();
            if (value == "") {
                validFld = false;
            } else {
                validFld = true;
            }

            if (validFld) {
                self.removeErrorMessage($errormsg);
            }
        });


    },


    /*
    * Slide form container
    */
    slideFormContainer: function ($li) {

        var self = this;
        var $formContainer = $(".bz-rp-sensors-form-container", $li);

        $formContainer.slideToggle("fast", function () {

            if ($(this).css('display') === "none") {
                $li.removeClass('bz-rp-sensors-selected');
            } else {
                $li.addClass('bz-rp-sensors-selected');
            }

            //reset process viewer
            self.$processViewer.processviewer('unSelectAllShapes').processviewer('clearRoute');

            //Select hotspot
            if ($li.hasClass('bz-rp-sensors-selected')) {
                if ($li.data('type') === "counter") {
                    self.$processViewer.processviewer('selectShape', $li.data('guid'));
                } else if ($li.data('type') === "stopwatch") {
                    self.showAllPaths($li.data('guidfrom'), $li.data('guidto'));
                }
            }
        });
    },

    /*
    * Excecute clicking edit button
    */
    editionEvent: function ($li, type) {

        var self = this;

        if (self.$processViewer.data('sensor') === "none") {

            if (type === "stopwatch") {
                self.swStart = $li.data('guidfrom');
                self.swEnd = $li.data('guidto');
            } else {
                self.cntGuid = $li.data('guid');
            }

            self.disableCreation();
            self.$processViewer.data('sensor', type);
            self.toggleEdition($li);
        }
    },

    /*
    * Excecute clicking cancel button
    */
    cancelEvent: function ($li, type) {

        var self = this;

        self.$processViewer.data('sensor', 'none').processviewer('unSelectAllShapes');

        if (type === "stopwatch") {
            self.swStart = 0, self.swEnd = 0;
            self.showAllPaths($li.data('guidfrom'), $li.data('guidto'));
        } else {
            //reset guid values
            self.cntGuid = 0;
            self.$processViewer.processviewer('selectShape', $li.data('guid'));
        }

        self.enableCreation();
        self.resetForm($li);
        self.toggleEdition($li);
    },

    /*
    * Excecute clicking apply button
    */
    applyEvent: function ($li, type) {

        var self = this;

        if (type === "counter") {
            self.applyEditionForCounters($li);
        } else {
            self.applyEditionForStopwatches($li);
        }
    },

    /*
    *   Refresh the report, handles a timer to avoid multiple refreshes in a short time span
    */
    refresh: function () {
        var self = this;

        // Cancel timeout if exists
        if (self.refreshTimeout) clearTimeout(self.refreshTimeout);

        // Create a new timeout
        self.refreshTimeout = setTimeout(function () {
            delete self.refreshTimeout;

            self.setColumnsSize();
            self.setProcessViewerHeight(self.$processViewer);

        }, 150);
    },

    /*
    * Set height for process viewer
    */
    setProcessViewerHeight: function () {

        var self = this;
        var docHeight = $(document).height();
        var pst = self.$processViewer.offset().top;

        self.$processViewer.processviewer('resize', docHeight - pst - 50);
    },

    /*
    * Excecute clicking delete button
    */
    deleteEvent: function ($li, type) {

        var self = this;

        if (type === "counter") {
            self.deleteCounters($li);
        } else {
            self.deleteStopwatches($li);
        }
    }
});
