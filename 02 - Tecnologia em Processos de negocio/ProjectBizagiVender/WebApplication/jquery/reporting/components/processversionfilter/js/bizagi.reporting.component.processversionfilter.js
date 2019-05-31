/*
 * @title : Process version filter component
 * @author : David Romero Estrada
 * @date   : 09/10/2013
 *
 */

bizagi.reporting.component.controller("bizagi.reporting.component.processversionfilter", {

    /*
     *   Constructor
     */
    init: function (canvas, services, params) {
        params = params || {};

        // Call super
        this._super(canvas);

        // Set up the variables
        this.processes = params.model.processes;

        //Set up services
        this.services = services;

        //Set up default process
        this.process = this.setDefaultProcess(params.process);

        //To simplify how to catch the version object, this var save the position of the current process in the array
        this.position = 0;

        //keep the version array position in a var
        this.version = 0;

        // Render component
        this.render();
    },

    /*
     * Load all needed templates
     */
    loadTemplates: function () {

        // Define mapping
        var templateMap = {
            "processversionfilter": (bizagi.getTemplate("bizagi.reporting.component.processversionfilter") + "#bz-rp-filters-process-version")
        };

        // Fetch templates
        return this._super(templateMap);
    },

    /*
     * Render Component
     */
    renderComponent: function () {
        var self = this;
        var template = self.getTemplate("processversionfilter");
        var content = $.tmpl(template);

        return content;
    },

    /*
     * Post Render
     */
    postRender: function (content) {
        var self = this;

        //wait until each combo is rendered to call parent
        $.when(self.renderProcessCombo(content), self.renderVersionCombo(content)).done(function () {
            self.resolvePostRender();
        });
    },

    /*
     * Set default process
     */
    setDefaultProcess: function (dftProcess) {

        var self = this,
            process = [];

        if (self.processes.length) {

            // Set the default process, this is the first id in the processes array
            process = (!$.isEmptyObject(dftProcess)) ? {
                process: dftProcess
            } : {
                process: {
                    id: self.processes[0].process[0].id,
                    name: self.processes[0].name
                }
            };
        }

        return process;
    },

    /*
     * Render process combo
     */
    renderProcessCombo: function (content) {

        var self = this,
            deferred = $.Deferred(),
            comboDataSource = self.getProcessDataForCombo();

        self.$processContainer = $("#process", content);

        //Render combo for process
        self.$processContainer.uicombo({
            data: comboDataSource,
            itemValue: function (obj) {
                return obj.process[0].id + "/" + obj.position + "/" + obj.process[0].guid;
            },
            itemText: function (obj) {
                return obj.name;
            },
            initValue: comboDataSource.combo[self.position],
            onComplete: function () {
                deferred.resolve();
            },
            onChange: function (obj) {

                data = obj.ui.data('value').split("/");

                self.process.process.id = parseInt(data[0]);
                self.position = parseInt(data[1]);
                self.version = 0;

                self.renderVersionCombo();
                
                // Publish an event
                self.publish("initProcessBreadcrumb");

                // Publish an event
                self.publish("filterbyprocessversion", self.process);
            }
        });

        return deferred;

    },


    /*
     * Render Version Combo
     */
    renderVersionCombo: function (content) {

        var self = this,
            deferred = $.Deferred(),
            comboVersionData = self.getVersionDataForCombo();

        self.$versionContainer = $("#version", content);

        self.$versionContainer.empty().uicombo({
            data: comboVersionData,
            itemValue: function (obj) {
                return obj.id;
            },
            itemText: function (obj) {
                return obj.version;
            },
            initValue: comboVersionData.combo[self.version],
            onComplete: function (obj) {
                deferred.resolve();
            },
            onChange: function (obj) {

                var id = obj.ui.data('value');
                self.process.process.id = parseInt(id);

                // Publish an event
                self.publish("filterbyprocessversion", self.process);
            }
        });

        return deferred;
    },

    /*
     * Get process data for combo
     */
    getProcessDataForCombo: function () {

        var self = this,
            dataSource = {
                combo: [],
                label: self.getResource("bz-rp-components-process-label")
            },
            processes = [].concat(self.processes);

        for (var i = 0, length = processes.length; i < length; i++) {

            processes[i].position = i;
            dataSource.combo.push(processes[i]);

            for (var x = 0, lengthx = processes[i].process.length; x < lengthx; x++) {
                if (processes[i].process[x].id === self.process.process.id) {
                    self.position = i;
                    self.version = x;
                }
            }
        }

        return dataSource;
    },

    /*
     * Get version data for combo
     */
    getVersionDataForCombo: function () {

        var self = this,
            version = (self.processes.length) ? [].concat(self.processes[self.position].process) : [];

        var dataSource = {
            combo: version,
            label: self.getResource("bz-rp-components-process-version-label")
        };

        return dataSource;
    }

});