/*
 *   Name: BizAgi Render Layout Simple Upload Class
 *   Author: Elkin Fernando Siabato Cruz
 *   Comments:
 *   -   This script will define basic stuff for non editable upload renders inside templates
 */

bizagi.rendering.layoutRender.extend("bizagi.rendering.layoutUpload", {
   // Statics
   BA_ACTION_PARAMETER_PREFIX: bizagi.render.services.service.BA_ACTION_PARAMETER_PREFIX,
   BA_CONTEXT_PARAMETER_PREFIX: bizagi.render.services.service.BA_CONTEXT_PARAMETER_PREFIX,
   BA_PAGE_CACHE: bizagi.render.services.service.BA_PAGE_CACHE
}, {
   /**
    * Constructor
    */
   init: function (params) {
      // Call base
      this._super(params);
   },

   /**
    *   Update or init the element data
    */
   initializeData: function (data) {
      var self = this;
      // Call base
      this._super(data);

      var form = self.getFormContainer();

      // Fill default properties
      var properties = this.properties;

      properties.editable = true;
      properties.allowDelete = true;

      properties.contexttype = (form.params && form.params.data && form.params.data.contextType) ? form.params.data.contextType : "";
      properties.allowSendInMail = properties.allowSendInMail || false;
   },

   /**
    * Get value files by data
    */
   getValueFilesByData: function(properties){
      var self = this;
      var defer = $.Deferred();
      var dataFiles;
      if (properties.value.value) {//Normal entityTemplate in form QAF-2319
          dataFiles = properties.value.value;
      }
      else {//QAF-2210
          dataFiles = properties.value;
      }
      var valueAuxFiles;
      try{
         if(self.isContextContainerWidgetRender()){
            valueAuxFiles = JSON.parse("{ \"files\": " + dataFiles  + "}");
            defer.resolve(properties, valueAuxFiles);
         }
         else{//context: my stuff
            $.when(self.getDataFilesWithoutScope()).done(function(valueResult){
               valueAuxFiles = JSON.parse("{ \"files\": " + valueResult  + "}");
               defer.resolve(properties, valueAuxFiles);
            });
         }
      }
      catch(err){
         valueAuxFiles = JSON.parse("{ \"files\": []}");
         defer.resolve(properties, valueAuxFiles);
         console.warn("Exception converting data files. Error: ", err);
      }
      return defer.promise();
   },

   isContextContainerWidgetRender: function(){
      var self = this;

      var formContainer = self.getFormContainer();
      return formContainer.params.paramsRender && formContainer.params.paramsRender.idRender;
   },


   /**
    * Get data files when access from My stuff
    */
   getDataFilesWithoutScope: function(){
      var self = this;
      //Gets the real value of the image
      var params = {
         xpath: self.properties.xpath,
         entity: self.value.guid,
         surrogateKey: self.value.surrogateKey
      };

      return self.dataService.getFilesDataForLayoutUploadControl(params);
   },

   /**
    *   Returns the internal value
    */
   getValue: function () {
      return this.files;
   },

   /**
    *   Returns the xpath to be used
    */
   getUploadXpath: function () {
      return this.properties.xpath;
   }

});