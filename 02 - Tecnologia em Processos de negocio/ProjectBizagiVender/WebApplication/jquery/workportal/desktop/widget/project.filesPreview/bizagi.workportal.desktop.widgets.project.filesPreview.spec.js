/**
 * Created by DavidRE on 06/03/2015.
 */

describe("Widget desktop.widgets.project.filesPreview", function () {

   var widget;

   bizagi.currentUser = {
      "idUser": 1,
      "user": "domain\\admon",
      "userName": "admon",
      "uploadMaxFileSize": 1048576
   };

   it("Environment has been defined", function (done) {
      var notifier = bizagi.injector.get("notifier");
      widget = new bizagi.workportal.widgets.project.filesPreview(dependencies.workportalFacade, dependencies.dataService, notifier, {});
      widget.plugins = {};
      $.when(widget.areTemplatedLoaded())
         .done(function () {
            spyOn(widget.dataService, "getDateServer").and.callFake(function () {
               var d = $.Deferred();
               d.resolve({ date: 123131312 });
               return d.promise();
            });
            $.when(widget.renderContent()).done(function (html) {
               dependencies.canvas.empty();
               dependencies.canvas.append(html);
               done();

            });
         });
   });

   describe("render widget and initialize plugins", function(){

      it("should define widgets in the post render", function(){
         widget.postRender();

         expect(widget.plugins.fileEdition).toBeDefined();

         expect(widget.form).toEqual(jasmine.any(Object));
      });

      it("should render file preview", function(){

         var params = {
            "type": "FILEPREVIEW",
            "args": {
               "radNumber": "451",
               "fileData": {
                  "guid": "adcbdc44-1888-4d45-a204-3fff50996858",
                  "description": "hello",
                  "name": "David Romero.jpg",
                  "attachment": {
                     "guid": "cf336f9e-4449-48e8-b5bb-a80faf074300",
                     "data": null,
                     "storage": 0,
                     "name": "David Romero.jpg",
                     "dataAsBase64": null
                  },
                  "date": 1427227269848,
                  "user": 1,
                  "globalParent": "451"
               },
               "userData": {
                  "picture": "data:image/png;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAyADIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDwGprS1mvbqO3gjaSWRgqqo5JNQ11XgPZFrM10wy1tbtImTgZ3Kv8AJjVMDsNI+Ck91YGa/wBWht5gMmGFPOK8AjJBHPsM/WuS8WeAr/wwBOZEubJm2rOnBz6Feo6deR055r3Hw+oltVD3UrLIA2WwuW79qb40021XwXqDyP5gSCTPmFcBtvHQdjgj3ArmVf3rHS8PJRufMdKKG+8aBXWjmHUUlFakja7HwK9gWv7e8kjjZ4wymR9oYKTlfc8g49s9q46lBwa55xurGkJcrufQMdtZPYGe5uLoXEHyKgcgL2LZB7defxq34jttLj8JavcQXjSebbNIA8hKMCpYY5xgnAGPpXIWGv2ctpF/bDTxxyoHWeEkHkZx8vOe359M1P4v+x6n4OgttLuJT5kiyKszMXlRVbn5iSBu2jkjocdK4Ywk5WZ6MpwVO54233jQKdJG8blHUqw6gjBFMr0UeWOoooqrgNAJOBXQ6R4WurxUuJ0aKBvu5U5fjjHt/n3pPCljHdXsksiCQwqGRGGQT711U+r3lnG32u3llhY5Vg2GjI/mKmwmxuj6vGvh67eVlFzbq7SxSjIJZjjr2yQPbP0rM0zUZ5Q8c8hlZmyJOPlBySP8Pr7VTuZ1muJnhaUQzkCRFyAecgMPqAf1ojbYRt4xzxUxgotsc6jkkuxpzPDOzRzokkSZG11yBnqR6dOo5qnfeGLSeJpNPl8uUDJhc5B+h69j1zURcIMu3BILGrS3LR3TuDwpGB6jkfyqyLnIPA8cjIwwykgg9jRXobQwFiSikk9cCigdzn/CBK3IIOCVfp/wCu+T95uV/mX0bkUUU+gmcnqMEMd3erHEiKEBAVQADuWsxO9FFSAy6/49pP8AcNOQkmLJ67AaKKAN4E4FFFFMD//Z",
                  "id": 1,
                  "name": "admon"
               },
               "workItems": true,
               "img": "data:image/png;base64,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"
            },
            "context": "FILEPREVIEW"
         };

         spyOn(widget, "applyMenu");

         widget.showPreview({}, params);

         expect($("#ui-bizagi-wp-project-filespreview-wrapper", widget.content).html()).not.toBe("");
         expect(widget.applyMenu).toHaveBeenCalled();
      });

      it("should initialize menu", function(){
         spyOn($.fn, "menu").and.callThrough();

         widget.applyMenu();
         expect($.fn.menu).toHaveBeenCalled();
      });
   });

   describe("functions", function () {
      describe("validateAddFileDescriptionForm", function () {
         var $wrapperForm, descriptionElement;
         beforeEach(function () {
            $wrapperForm = $("<div><textarea></textarea></div>");
            descriptionElement = $("textarea", $wrapperForm);
         });

         it("Should return false if description is empty", function () {
            descriptionElement.val("");
            expect(widget.validateAddFileDescriptionForm(descriptionElement)).toBe(false);
            descriptionElement.val("   ");
            expect(widget.validateAddFileDescriptionForm(descriptionElement)).toBe(false);
         });

         it("Should return true if description is not empty", function () {
            descriptionElement.val("a");
            expect(widget.validateAddFileDescriptionForm(descriptionElement)).toBe(true);
            descriptionElement.val("abc");
            expect(widget.validateAddFileDescriptionForm(descriptionElement)).toBe(true);
            descriptionElement.val("abc def");
            expect(widget.validateAddFileDescriptionForm(descriptionElement)).toBe(true);
         });
      });
   });

   describe("handle events and data", function() {
      it("should set edit data", function () {
         widget.setEditionData();

         expect(widget.form.description.val()).toBe("hello");
         expect(widget.form.image.prop("src")).toEqual("data:image/png;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAyADIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDwGprS1mvbqO3gjaSWRgqqo5JNQ11XgPZFrM10wy1tbtImTgZ3Kv8AJjVMDsNI+Ck91YGa/wBWht5gMmGFPOK8AjJBHPsM/WuS8WeAr/wwBOZEubJm2rOnBz6Feo6deR055r3Hw+oltVD3UrLIA2WwuW79qb40021XwXqDyP5gSCTPmFcBtvHQdjgj3ArmVf3rHS8PJRufMdKKG+8aBXWjmHUUlFakja7HwK9gWv7e8kjjZ4wymR9oYKTlfc8g49s9q46lBwa55xurGkJcrufQMdtZPYGe5uLoXEHyKgcgL2LZB7defxq34jttLj8JavcQXjSebbNIA8hKMCpYY5xgnAGPpXIWGv2ctpF/bDTxxyoHWeEkHkZx8vOe359M1P4v+x6n4OgttLuJT5kiyKszMXlRVbn5iSBu2jkjocdK4Ywk5WZ6MpwVO54233jQKdJG8blHUqw6gjBFMr0UeWOoooqrgNAJOBXQ6R4WurxUuJ0aKBvu5U5fjjHt/n3pPCljHdXsksiCQwqGRGGQT711U+r3lnG32u3llhY5Vg2GjI/mKmwmxuj6vGvh67eVlFzbq7SxSjIJZjjr2yQPbP0rM0zUZ5Q8c8hlZmyJOPlBySP8Pr7VTuZ1muJnhaUQzkCRFyAecgMPqAf1ojbYRt4xzxUxgotsc6jkkuxpzPDOzRzokkSZG11yBnqR6dOo5qnfeGLSeJpNPl8uUDJhc5B+h69j1zURcIMu3BILGrS3LR3TuDwpGB6jkfyqyLnIPA8cjIwwykgg9jRXobQwFiSikk9cCigdzn/CBK3IIOCVfp/wCu+T95uV/mX0bkUUU+gmcnqMEMd3erHEiKEBAVQADuWsxO9FFSAy6/49pP8AcNOQkmLJ67AaKKAN4E4FFFFMD//Z");
      });

      it("should call edition in the menu", function(){
         spyOn(widget, "onOpenEdition");
         var event = {
            currentTarget: $("<div></div>")
         };
         var ui = {
            item: $("<div data-item=\"edit\"></div>")
         };

         widget.onSelectMenu(event, ui);

         expect(widget.onOpenEdition).toHaveBeenCalled();
      });

      it("should call download in the menu", function(){
         spyOn(widget, "onDownloadFile");
         var event = {
            currentTarget: $("<div></div>")
         };
         var ui = {
            item: $("<div data-item=\"download\"></div>")
         };

         widget.onSelectMenu(event, ui);

         expect(widget.onDownloadFile).toHaveBeenCalled();
      });

      it("should call delete in the menu", function(){
         spyOn(widget, "onDeleteFile");
         var event = {
            currentTarget: $("<div></div>")
         };
         var ui = {
            item: $("<div data-item=\"delete\"></div>")
         };

         widget.onSelectMenu(event, ui);

         expect(widget.onDeleteFile).toHaveBeenCalled();
      });

      it("should download file", function(){
         spyOn(widget.dataService, "getDownloadAttachment");
         widget.onDownloadFile();
         expect(widget.dataService.getDownloadAttachment).toHaveBeenCalledWith("cf336f9e-4449-48e8-b5bb-a80faf074300", "David Romero.jpg");
      });

      it("should open edition", function(){
         spyOn(widget, "setEditionData");

         widget.onOpenEdition();

         expect(widget.setEditionData);
      });

      it("should cancel the edition", function(){
         spyOn(widget.dialogBox.formContent, "dialog");

         widget.onResetFileForm();

         expect(widget.dialogBox.formContent.dialog).toHaveBeenCalledWith("destroy");
      });
   });

   describe("save edition", function(){

      it("should save successfully the edition", function(){
         spyOn(widget.dataService, "updateProjectFile").and.callFake(function(){
            var defer = $.Deferred();
            defer.resolve({status: 200});
            return defer.promise();
         });
         spyOn(widget, "onResetFileForm");
         spyOn(widget.notifier, "showSucessMessage");
         spyOn(widget, "pub");
         spyOn(widget, "validateAddFileDescriptionForm").and.returnValue(true);

         widget.onSaveEdition();

         expect(widget.dataService.updateProjectFile).toHaveBeenCalled();
         expect(widget.onResetFileForm).toHaveBeenCalled();
         expect(widget.pub).toHaveBeenCalled();
         expect(widget.notifier.showSucessMessage).toHaveBeenCalled();
      });

      it("should save the edition and cancel edition", function(){
         spyOn(widget.dataService, "updateProjectFile").and.callFake(function(){
            var defer = $.Deferred();
            defer.resolve({status: 500});
            return defer.promise();
         });
         spyOn(widget, "onResetFileForm");

         widget.onSaveEdition();

         expect(widget.onResetFileForm).toHaveBeenCalled();
      });
   });
});
