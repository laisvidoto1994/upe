/*
 * @title : Process filter componet
 * @author : Diego Parra
 * @date   : 18/09/2013
 * Comments:
 *     Defines a base class for all report components
 *
 */

bizagi.reporting.component.controller("bizagi.reporting.component.processfilter", {

    /*
    *   Constructor
    */
    init: function (canvas, params) {
        params = params || {};

        // Call super
        this._super(canvas);

        // Set up the processes array
        this.processes = params.model.processes;

        // Set the default process, this is the first id in the processes array
        this.process = this.setDefaultProcess(params.process);

        // Render component
        this.render();
    },

    /*
    *   Load all needed templates
    */
    loadTemplates: function () {

        // Define mapping
        var templateMap = {
            "processfilter": (bizagi.getTemplate("bizagi.reporting.component.processfilter") + "#bz-rp-filters-process")
        };

        // Fetch templates
        return this._super(templateMap);
    },

    /*
    *   Templated render component
    */
    renderComponent: function () {
        var self = this;
        var template = self.getTemplate("processfilter");
        var content = $.tmpl(template, self.model);
        return content;
    },

    /*
    * After Render is loaded execute some actions
    */
    postRender: function (content) {
        var self = this;

        //wait until combo is rendered to call parent
        $.when(self.renderCombo(content)).done(function () {
            self.resolvePostRender();
        });

    },
    /*
    * Set default process
    */
    setDefaultProcess: function (dftProcess) {

        var self = this;
        var process = [];

        if (self.processes.length) {
            process = (!$.isEmptyObject(dftProcess)) ? { process: dftProcess } : { process: { id: self.processes[0].id, guid: self.processes[0].guid } };
        }

        return process;
    },

    /*
    * Render combo
    */
    renderCombo: function (content) {

        var self = this;

        //Get the combo data
        var comboDataSource = self.getDataSourceForCombos();
        var $content = $(content);
        var deferred = $.Deferred();

        //Render combo
        $content.uicombo({
            data: comboDataSource,
            onChange: function (obj) {
                var data = obj.ui.data('value');

                self.setProcess(data);

                // Publish an event
                self.publish("filterbyprocess", self.process);
            },
            onComplete: function () {
                deferred.resolve();
            },
            itemValue: function (obj) {
                return obj.id;
            },
            itemText: function (obj) {
                return obj.name;
            },
            initValue: comboDataSource.dft
        });

        return deferred;
    },

    /*
    * Get Process ID
    */
    getProcessId: function () {
        var self = this;

        return self.process.process.id;
    },

    /*
    * Set Process Value
    */
    setProcess: function (value) {
        var self = this;

        self.process.process = { id: parseInt(value) };
    },

    /*
    * Get data for combo
    */
    getDataSourceForCombos: function () {

        var self = this;
        var dataSource = { combo: [], label: self.getResource("bz-rp-components-process-label"), dft: 0 };

        for (var i = 0, length = self.processes.length; i < length; i++) {

            dataSource.combo.push(self.processes[i]);

            if (self.processes[i].id === self.process.process.id) {
                dataSource.dft = self.processes[i];
            }

        }

        return dataSource;
    }

});

