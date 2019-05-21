/**
 * Admin module to Asynchronous ECM Upload Jobs
 * 
 * @author David Andrés Niño
 */


bizagi.workportal.widgets.asyncecm.upload.extend("bizagi.workportal.widgets.asyncecm.upload", {}, {

    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "async.ecm.upload": bizagi.getTemplate("bizagi.workportal.desktop.widgets.asyncecm.upload").concat("#ui-bizagi-workportal-widget-async-ecm-upload"),
            "async.ecm.pending.jobs": bizagi.getTemplate("bizagi.workportal.desktop.widgets.asyncecm.upload").concat("#ui-bizagi-workportal-widget-async-ecm-upload-table-pending-jobs"),
            useNewEngine: false
        });
    },

    postRender: function () {
        var self = this;

        self.enableUI = true;

        self.renderAsyncECMUpload();

        self.asyncECMUploadTypes = {
            NOT_RUNNED : 1,
            RUNNING : 2,
            RUN_FINNISHED_OK : 3,
            RUN_FINNISHED_WITH_ERROR : 4
        };
    },

    updateEcmAllScheduledJobs: function () {
        var self = this,
            content = self.getContent();

        
        $("#async-emc-list-content", content).empty();
        $("#async-emc-list-content", content).loadingMessage();


        $.when(self.dataService.getEcmAllScheduledJobs()).done(function (result) {
            self.renderAllScheduledJobs(result);
        }).fail(function (error) {
            //console.log("getEcmPendingScheduledJobs error", error);
        });
        /**/
    },

    renderAsyncECMUpload:function () {
        console.log("renderAsyncECMUpload ready");

        var self = this,
            content = self.getContent();

        self.updateEcmAllScheduledJobs();
    },

    renderAllScheduledJobs:function (result) {

        var self = this,
                content = self.getContent();

        //Template Vars
        var ecmAsyncTemplate = self.getTemplate("async.ecm.pending.jobs");

        //Clean the content
        $("#async-emc-list-content", content).empty();

        //Enable UI
        self.enableUI = true;

        // Render Form
        $.tmpl(ecmAsyncTemplate, {
            jobs: result
            }).appendTo($("#async-emc-list-content", content));

        // Add class to each even row
        $('#async-emc-list-content tbody tr', content).each(function () {
            if ($(this).index() % 2 < 1)
                $(this).addClass('biz-ui-even');
        });

        //Add the hover events to the failure message content
        $("#table-content .async-emc-item p", content).hover(self.failureMessageHoverIn);

        $(".async-ecm-refresh", content).click(function(){
            if(self.enableUI) {
                self.enableUI = false;
                self.updateEcmAllScheduledJobs();
            }
                
        });

        

        //Bind the click event for those elements wich his jobs status is "Not Runned" or "Run finished with error"
        $("#table-content .async-emc-item .async-ecm-retry",content).click(
            function(event){
                event.preventDefault();
                self.retryECMPendingScheduledJob($(this).parent().attr("data-idjob"));
            }
        );
    },

    retryECMPendingScheduledJob: function(idJob) {
        var self = this,
            content = self.getContent();

        //Clear the content and sets a loading message
        $("#async-emc-list-content", content).empty();
        $("#async-emc-list-content", content).loadingMessage({"customMessage":"Please wait"});
        
        /**/
        $.when(self.dataService.retryECMPendingScheduledJob(idJob)).done(function () {
            
            //console.log("renderAllScheduledJobs");
            self.updateEcmAllScheduledJobs();

        }).fail(function (error) {
            console.log("retryECMPendingScheduledJob error");
        });
        /**/
    },

    failureMessageHoverIn: function(evt) {
        if($(evt.currentTarget).text().length > 0)
        {
            $(evt.currentTarget).attr("title", $(evt.currentTarget).text());
        }
    }
});