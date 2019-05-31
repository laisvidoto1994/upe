/**
 * Initialize desktop.widgets.project.discussions widget and test it
 *
 * @author Elkin Fernando Siabato Cruz
 */


describe("Widget desktop.widgets.project.discussions", function () {
   checkWorkportalDependencies();
   var widget, notifier;
   var responseGetDiscussionsData = [{"name":"Prueba1","description":"prueba1","globalParent":"152","user":403,"files":[],"guid":"e519d869-1f65-472a-84f3-d282ce1a7d97","tags":[],"typeResource":"Discussion","general":false,"date":"20/02/2015 11:16:02:864"}];
   var responseCallForListComments = [{"guid":"e38c05ea-89d6-4ac3-9db1-401867cdaf3e","files":[{"guid":"e38c05ea-89d6-4ac3-9db1-401867cdaf3e","name":"loading.png"}],"text":"otro comentario","parent":"e519d869-1f65-472a-84f3-d282ce1a7d97","date":"20/02/2015 13:42:22:822","user":356},{"guid":"a44cd49d-495e-4291-a1e2-3f0956babc94","files":[{"guid":"a44cd49d-495e-4291-a1e2-3f0956babc94","name":"loading.png"}],"text":"algun comenario","parent":"e519d869-1f65-472a-84f3-d282ce1a7d97","date":"20/02/2015 13:42:07:555","user":356}];
   var containerDiscussion = $("<div class=\"target-discussion-test\"></div>").html("<div class=\"ui-bizagi-wp-project-discussions-item\" data-guid=\"5015a1b6-6d49-420d-a31c-5f781654eac0\"><div class=\"ui-bizagi-wp-project-discussions-item-summary\"><h4><img alt=\"workportal-project-discussion-privatediscussion\" src=\"http://www.jquery-buttons.com/jhb-icons/users.png\"><span>prueba5</span></h4><div class=\"ui-bizagi-wp-project-discussions-hr-gradient\"></div><div class=\"ui-bizagi-wp-project-discussions-container-description-and-comments\" data-guid=\"5015a1b6-6d49-420d-a31c-5f781654eac0\"><div class=\"ui-bizagi-wp-project-discussions-container-description\"><span class=\"ui-bizagi-wp-project-discussions-truncate\">prueba5</span></div><div class=\"ui-bizagi-wp-project-discussions-container-comments\"><div class=\"ui-bizagi-wp-project-discussions-item-comment\"><div class=\"ui-bizagi-wp-project-discussions-create-comment\"><div class=\"ui-bizagi-wp-project-discussions-item-user\"><label>...</label> <img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Q0ZGMzk2N0EwNUQ3MTFFMzg1NjU4M0EyMEMwMUFDRjAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Q0ZGMzk2N0IwNUQ3MTFFMzg1NjU4M0EyMEMwMUFDRjAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDRkYzOTY3ODA1RDcxMUUzODU2NTgzQTIwQzAxQUNGMCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDRkYzOTY3OTA1RDcxMUUzODU2NTgzQTIwQzAxQUNGMCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PsD0gY8AAAN+SURBVHja3FlNSFRRFH4zThFBsxFa5CbDiTKIhjSxTdMf/bgTsjIcMFrWLiOzJCaIsBa1jdBIDCuslSupTEGQyn4WjWSUm5Kkglok2M/0Hea7cXs5b8aZN3CvB745c9/v/d6559x7zg2kUilnIUhIfgKBQMEPWrOtvgIqBtQAlUA5sBwoAV4BVeMP7s4Ug4QYI1Rg58ugmoFGYK3XpUAYmCmqRfIgIF+7HTgELHKd/gK8ACaAaeAr8BTW+Fj0oTVPEtL5LheBZ0Av0C/DCJ1O5fmBrkI1AZeBc3jO92JaZI9G4jZwCS987NOH3QwsAU4C9SB2EM8ey+XGYB4vOwG0ARvxkv0+khBpAEb5fzUwAjLxXG4MiMf7EbX8EnQ8yI+V0Czfhg923itqGUdEI7QFqg8o5aFWkLlgHRGSkZA+AJTxUBxkuq0jopEZpmVmgVp3ABAOQcdwQaeTEsGAn8BiCfMgtzRr1MJFdUACWGYQmSGo02xGgDOeRDhj3+OFTYYZ56IWmuPZLNKuhbwRw4bYbxLoZ2ieex6BNVagPUkid3Bjgy1LeLezH9as0WFbPqITaVQLQFjjiZVEmBSpfKLXxgxRWWSrdqzfZiKbqD8zLbWWiBpWL/NNikwhsop6wuoqCqsdDnNsawRBKsa5b1JZpIT6m0Uk9kE9VMsWReQ99WuLDLJSH01qaFVL8mLZRBim/vWXCAhMQU1Z5t//+HXQsVci1G+tJQJHl9x8PZtJmy1SqVVXRm0mUqf9H7SZyAE1rBCo3lhJBP5RBRVl82bGKooF0kL9A+h0r7V0xsehdgNHYbZxw6yxwUkXukV60L8PXhaRAvJ24DoLyiZJTLNGIlPOrkSZq0YzoylyA7giVoE13ukn/qv9shz5nDOnlCl34KZHJjvNnLVfbndJeJulD/WxkGxFhugmI9XuI2zKDDpgOpmMzsx9iFNsyv7EMDdfjJSs+yPofCuU2vYSn5ECdwdrscb4SE4bPSAjlflrTnp/Qi3Umrl34fc8sRPowrM/FeTsHsOsVkuFJTR3+0igGrjlpPfrpe58Nt8qSi5kxvCyKIfWMeB+gfnEOmAvI2RUOy2T3ZDvPuLD197FJCjM9DTCdqnrUiHQIzO2e7LzzUcKIFGuUlEPSXIV26mvneZLJFTkgCK1ZMkXKljtmCaxJAPGoMonfAm/C0H+CDAAgPBA2nTQ0AMAAAAASUVORK5CYII=\"></div><div class=\"ui-bizagi-wp-project-discussions-add-comment\" data-guid=\"5015a1b6-6d49-420d-a31c-5f781654eac0\"><textarea data-role=\"validator\" required=\"required\"></textarea><div class=\"ui-bizagi-wp-project-discussions-add-attachments\"><form><div class=\"k-widget k-upload k-header\"><div class=\"k-button k-upload-button\"><input autocomplete=\"off\" class=\"ui-bizagi-wp-project-discussions-attachment-upload\" data-role=\"upload\" name=\"project-discussions-attachments[]\" style=\"display:none\" tabindex=\"-1\" type=\"file\"><input autocomplete=\"off\" class=\"ui-bizagi-wp-project-discussions-attachment-upload\" data-role=\"upload\" name=\"project-discussions-attachments[]\" type=\"file\"><span>Selectfiles...</span></div><ul class=\"k-upload-files k-reset\" style=\"display:none\"><li class=\"k-file\" data-uid=\"df366d79-ee0a-43b7-8c23-1e2d9b0aee82\"><span class=\"k-progress\"></span><span class=\"k-icon k-i-jpg\"></span><span class=\"k-filename\" title=\"puma.jpg\">puma.jpg</span><strong class=\"k-upload-status\"><button class=\"k-button k-button-bare k-upload-action\" type=\"button\"><strong class=\"k-upload-status\"><span class=\"k-icon k-i-close k-delete\" title=\"Remove\"></span></strong></button></strong></li></ul><button class=\"k-button k-upload-selected\" type=\"button\">Upload files</button></div></form></div><div id=\"ui-bizagi-wp-project-discussions-add-comment-attachments\"></div><div class=\"ui-bizagi-wp-project-discussions-comment-buttons-wrapper\"><button class=\"ui-bizagi-wp-project-discussions-comment-buttons-cancel\">Cancelar</button> <button class=\"ui-bizagi-wp-project-discussions-comment-buttons-share\">workportal-project-discussion-share</button></div>aaaaaaaaaaaaaaa<div class=\"ui-bizagi-wp-project-discussions-attachments-cmnwrapper\"><ul class=\"ui-bizagi-wp-project-attachments-list\"><li><span class=\"bz-bizagi-wp-project-discussions-attachment-icon bz-bizagi-wp-project-icon-16x16\"></span>lobo.jpg</li><li><span class=\"bz-bizagi-wp-project-discussions-attachment-icon bz-bizagi-wp-project-icon-16x16\"></span>puma.jpg</li></ul></div></div></div></div><div class=\"ui-bizagi-wp-project-discussion-comment-list\"><div class=\"ui-bizagi-wp-project-discussions-item-comment\"><div class=\"ui-bizagi-wp-project-discussions-item-comment-user\" data-iduser=\"356\"><label>...</label><img src=\"data:image/png;base64,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\"></div><div class=\"ui-bizagi-wp-project-discussions-item-comment-summary-wrapper\"><span class=\"ui-bizagi-wp-project-discussions-comment-complete\">un comentario mucho mas largoun comentariomucho mas largoun comentario mucho mas largouncomentario mucho mas largoun comentario muchomas largoun comentario mucho mas largouncomentario mucho mas largoun comentario muchomas largoun comentario mucho mas largouncomentario mucho mas largoun comentario muchomas largoun comentario mucho mas largouncomentario mucho mas largo</span></div><div class=\"ui-bizagi-wp-project-discussions-item-comment-date\"><span class=\"bz-dashboard-discussion-time\">workportal-relativetime-momentago</span></div><div class=\"ui-bizagi-wp-project-discussions-attachments-cmmtwrapper\"><ul class=\"ui-bizagi-wp-project-attachments-list\"></ul></div></div><div class=\"ui-bizagi-wp-project-discussions-item-comment\"><div class=\"ui-bizagi-wp-project-discussions-item-comment-user\" data-iduser=\"356\"><label>...</label><img src=\"data:image/png;base64,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\"></div><div class=\"ui-bizagi-wp-project-discussions-item-comment-summary-wrapper\"><span class=\"ui-bizagi-wp-project-discussions-comment-complete\">que raro</span></div><div class=\"ui-bizagi-wp-project-discussions-item-comment-date\"><span class=\"bz-dashboard-discussion-time\">workportal-relativetime-minutes</span></div><div class=\"ui-bizagi-wp-project-discussions-attachments-cmmtwrapper\"><ul class=\"ui-bizagi-wp-project-attachments-list\"></ul></div></div><div class=\"ui-bizagi-wp-project-discussions-item-comment\"><div class=\"ui-bizagi-wp-project-discussions-item-comment-user\" data-iduser=\"1\"><label>...</label><img src=\"data:image/png;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAyADIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDa20bKn2GobqeCyt2nuZViiXALt0GeBXq3R5yRAk0Uk0kKSK0keN6g5K56ZqXZXN+H/tl3qmu/8/VveFtrYDPGc7B9CqjH4V0Ud3BJIIvMVZiATGx+YZ9qwhiIyk4vdG06LikxdlGyrGyk2VvcyINlFT7KKXMFi3srH8S6PJrOiTWkTlZsh4z6kdq39lNYBRk4/Gsm7qxS0dzyHwxJBpWoz3s880c0brhQ2NzAnGfcEYrpLiONCL52PmSSHfITjkgsRxxxiuZ8aW32DxTOAhWOZhInuSOf1qqmpzalpUOnuURIpTM7mT53AOCFHUnB/Q151WNnqd9N3PVdOuVuoAC6tIvBwevvVzZ7V5rdeJYdM1V5I0VZFVcjBA3YAI/xru/D2u2viGwNxb5WRDtljPVDjP4j3row1dzhaW5z16PJK62L+z2oqfbRXVcwsWRgjIIwRmqF3dxqhAbnGeP1rg4/HRTy1lQ4c7Thskg5/wDrflV2PVEvZvNBdRvIOWHzL3J9sVy+1TN1TMH4gzC6NrLgYDEA/wCyOR/OovBrmeC4EcaZtdh+UcuTnBPc4wfXlh6VW8acXCqriRWO8OvQ7uRUfgedYb26AUbnQJuJPQ/wgdOTjk9AD61zVtTop6Gxe20Gs3ot7pESZD8shznAPQkckHmu/wDD9jptjp6w6dbpEvV9pJJPux5NcBrlxZRhZFmjJkBEZjXBdR/Fhuq5Df5NVbHxVqNlKkkRTaQACxJAA/hI/wA9KyoTdJ2exdaPtF5nr232orhj8QpAcGwGR/00I/TbRXb9YgcnsZHBRAedNx90ZHtxWpp5IVyDgrAhHscNRRXN9pG5R8S82sOefmb/ANCNVfDnFxLjjEUxH1CcfzP5miinIpEF/LI6MXkdjgDJbPHlp/ian00/uIv+BH+VFFZlsy5ZpRK4Ej/eP8RoooqQP//Z\"></div><div class=\"ui-bizagi-wp-project-discussions-item-comment-summary-wrapper\"><span class=\"ui-bizagi-wp-project-discussions-comment-complete\">ertrdt</span></div><div class=\"ui-bizagi-wp-project-discussions-item-comment-date\"><span class=\"bz-dashboard-discussion-time\">workportal-relativetime-day</span></div><div class=\"ui-bizagi-wp-project-discussions-attachments-cmmtwrapper\"><ul class=\"ui-bizagi-wp-project-attachments-list\"><li><span class=\"bz-bizagi-wp-project-discussions-attachment-icon bz-bizagi-wp-project-icon-16x16\"></span>lobo.jpg</li></ul></div></div><div class=\"ui-bizagi-wp-project-discussions-item-comment\"><div class=\"ui-bizagi-wp-project-discussions-item-comment-user\" data-iduser=\"356\"><label>...</label><img src=\"data:image/png;base64,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\"></div><div class=\"ui-bizagi-wp-project-discussions-item-comment-summary-wrapper\"><span class=\"ui-bizagi-wp-project-discussions-comment-complete\">prueba</span></div><div class=\"ui-bizagi-wp-project-discussions-item-comment-date\"><span class=\"bz-dashboard-discussion-time\">workportal-relativetime-days</span></div><div class=\"ui-bizagi-wp-project-discussions-attachments-cmmtwrapper\"><ul class=\"ui-bizagi-wp-project-attachments-list\"></ul></div></div></div><div class=\"ui-bizagi-wp-project-discussion-showmore-comments\" data-childnumber=\"\"><button class=\"ui-bizagi-wp-project-discussion-showmore-comments-button\">workportal-project-discussion-comment-showmore</button><div class=\"ui-bizagi-wp-project-discussion-showmore-no-more-comments\">workportal-project-discussion-comment-nomorecomments</div><div class=\"ui-bizagi-wp-project-discussion-showmore-loading-comments\">Cargando ...</div></div></div></div></div></div>");

   bizagi.currentUser = {
      "idUser": 1,
      "user": "domain\admon",
      "userName": "admon",
      "uploadMaxFileSize": 1048576
   };

   it("Environment has been defined", function (done) {
      notifier = bizagi.injector.get("notifier");
      var params = {
         hasWorkItems: true
      };

      widget = new bizagi.workportal.widgets.project.discussions(dependencies.workportalFacade, dependencies.dataService, notifier, params);
      $.when(widget.areTemplatedLoaded())
         .done(function () {

            widget.plugins["attchComments"] = {
               close: function(){}
            };

            $.when(widget.renderContent()).done(function (html) {
               dependencies.canvas.empty();
               dependencies.canvas.append(html);
               done();
            });
         });
   });

   describe("initialize plugins and set events handlers", function(){

      it("should initialize all plugins and call eventsHandler", function(){

         spyOn(widget, "getDataDiscussions").and.callFake(function(){
            var defer = $.Deferred();
            defer.resolve();
            return defer.promise();
         });

         spyOn(widget, "eventsHandler").and.callThrough();
         spyOn(widget, "restrictedEventsHandler").and.callThrough();

         widget.params.isClosedForAllUsers = true;
         widget.postRender();

         expect(widget.plugins["popupDiscussion"]).toBeDefined();

         expect(widget.restrictedEventsHandler).toHaveBeenCalled();
         widget.params.isOpen = true;
         widget.params.isClosedForAllUsers = false;
         widget.postRender();
         expect(widget.eventsHandler).toHaveBeenCalled();
      });

   });

   it("Environment has been rendered", function (done) {
      var contentWidget = widget.getContent();

      expect(contentWidget).not.toBe("");
      expect($("#home-project-discussions-wrapper", contentWidget).length).not.toBe(0);
      done();
   });

   describe("Delete comment", function(){

      it("should delete comment", function() {

         widget.commentsList["affae750-afb4-4c0c-9a60-a0d8b6d9b454"] = {
            comments: [{
               guid: "affae750-afb4-4c0c-9a60-a0d8b6d9b452",
               attachments: []
            }]
         };

         var $DOM = $('<div class="ui-bizagi-wp-project-discussions-container-description-and-comments" data-guid="affae750-afb4-4c0c-9a60-a0d8b6d9b454">' +
         '<div class="ui-bizagi-wp-project-discussions-item-comment" data-cmmtguid="affae750-afb4-4c0c-9a60-a0d8b6d9b452">' +
         '<ul class="ui-bizagi-wp-project-attachments-list" data-type="DISCUSSION">' +
         '</ul>' +
         '</div>' +
         '</div>');

         spyOn(widget.dataService, "deleteComment").and.callFake(function(){
            var defer = $.Deferred();
            defer.resolve({ status: 200});
            return defer.promise();
         });

         spyOn(widget, "getCommentByGuid").and.callFake(function(){
            return {
               attachments: [],
               index: 0
            };
         });

         widget.onDeleteComment($(".ui-bizagi-wp-project-attachments-list", $DOM));

         expect($DOM.find(".ui-bizagi-wp-project-discussions-item-comment").length).toBe(0);
         expect(widget.commentsList["affae750-afb4-4c0c-9a60-a0d8b6d9b454"].comments.length).toBe(0);
      });

      it("should get a comment by id", function(){


         widget.commentsList["affae750-afb4-4c0c-9a60-a0d8b6d9b454"] = {
            comments: [{
               guid: "affae750-afb4-4c0c-9a60-a0d8b6d9b452",
               attachments: [
                  {
                     guid: "a1"
                  }
               ]
            }]
         };

         var comment = widget.getCommentByGuid("affae750-afb4-4c0c-9a60-a0d8b6d9b454", "affae750-afb4-4c0c-9a60-a0d8b6d9b452");

         expect(comment).toEqual({
            attachments: ["a1"],
            index: 0
         });

      });

   });

   describe("Edit discussion", function(){

      it("should prepare discussion of edition", function(){

         var $item = $("<div class='ui-bizagi-wp-project-discussions-item' data-guid='213'><a></a></div>");

         spyOn(widget, "setDiscussionsDataByGUID");
         spyOn(widget, "showFormAddDiscussion");

         widget.onEditDiscussion($item.find("a"));

         expect(widget.setDiscussionsDataByGUID).toHaveBeenCalledWith(213);
         expect(widget.showFormAddDiscussion).toHaveBeenCalled();
      });

      it("should set discussion by guid", function(){

         widget.form = {
            edition: {},
            title: $("<h4></h4>"),
            subject: $("<input type='text' />"),
            description: $("<textarea></textarea>")
         };

         spyOn(widget, "renderAttachments");

         spyOn(widget, "getDiscussionDataByGUID").and.callFake(function(){

            return {
               "tags": [],
               "guid": "aec01e1c-4d4c-4558-941b-2759760f18a6",
               "description": "Edito descripcion",
               "name": "Subject",
               "attachments": [],
               "date": 1426645302215,
               "user": 1,
               "general": false,
               "globalParent": "501"
            };
         });

         widget.setDiscussionsDataByGUID("123");

         expect(widget.renderAttachments).toHaveBeenCalled();
         expect(widget.form.subject.val()).toBe("Subject");
         expect(widget.form.description.val()).toBe("Edito descripcion");
         expect(widget.form.edition).toEqual({
            guid: "123"
         });

      });

      it("should get discussion data by guid", function(){

         widget.listDataDiscussion = [{
            "tags": [],
            "guid": "aec01e1c-4d4c-4558-941b-2759760f18a6",
            "description": "Edito descripcion",
            "name": "Subject",
            "attachments": [],
            "date": 1426645302215,
            "user": 1,
            "general": false,
            "globalParent": "501"
         }];

         var guid = widget.getDiscussionDataByGUID("aec01e1c-4d4c-4558-941b-2759760f18a6");

         expect(guid).toEqual({
            "tags": [],
            "guid": "aec01e1c-4d4c-4558-941b-2759760f18a6",
            "description": "Edito descripcion",
            "name": "Subject",
            "attachments": [],
            "date": 1426645302215,
            "user": 1,
            "general": false,
            "globalParent": "501"
         });

      });

   });

   describe("Add discusion", function(){
      it("Should show and hide popup window", function () {
         widget.showFormAddDiscussion();
         expect($(".ui-dialog.ui-widget.ui-widget-content").css('display')).toBe("block");
      });

      it("Check widget have button add discussion", function () {
         expect($("#ui-bizagi-wp-project-discussions-popup-action-add-discussion").length).toBe(1);
      });

      it("should show message error if response.status is different to 200, 201 and undefined", function(){
         widget.form.subject.val("Subject discussion");
         widget.form.description.val("This is the description");
         widget.form.buttonAddDiscussion  = $("<input />");
         widget.radNumber = 123;
         bizagi.currentUser = {idUser: 1};

         spyOn(widget.dataService, 'postDiscussion').and.callFake(function () {
            var d = $.Deferred();
            d.reject({status: 500});
            return d.promise();
         });
         spyOn(widget.notifier, "showErrorMessage");

         widget.sendDataInsertDiscussion();

         expect(widget.notifier.showErrorMessage).toHaveBeenCalled();

      });
      it("should show message ok if response.status is equal to 200, 201 and undefined", function(){
         widget.form.subject.val("Subject discussion");
         widget.form.description.val("This is the description");
         widget.form.buttonAddDiscussion  = $("<input />");
         widget.listDataDiscussion = [];
         widget.radNumber = 123;

         bizagi.currentUser = {idUser: 1};

         widget.showFormAddDiscussion();

         spyOn(widget.dataService, "postDiscussion").and.callFake(function () {
            var d = $.Deferred();
            d.reject({status: 200});
            return d.promise();
         });
         spyOn(widget.notifier, "showSucessMessage");

         expect(widget.listDataDiscussion.length).toBe(0);

         widget.sendDataInsertDiscussion();

         expect(widget.listDataDiscussion.length).toBe(1);
         expect(widget.notifier.showSucessMessage).toHaveBeenCalled();

      });

      it("should not call the method sendDataInsertDiscussion when the validate form is fail", function () {
         spyOn(widget, "sendDataInsertDiscussion");
         spyOn(widget, "validateAddDiscussionForm").and.callFake(function(){return true;});
         var spyEvent = {
            preventDefault: function(){}
         };
         widget.onSubmitFormDiscussion(spyEvent);
         expect(widget.sendDataInsertDiscussion).not.toHaveBeenCalled();
      });

   });


   describe("List discussion", function(){
      it("should call comments for discussion", function(){
         spyOn(widget, "sortDiscussions");
         spyOn(widget, "callForListComments").and.callFake(function(){
            var d = $.Deferred();
            d.resolve(responseCallForListComments);
            return d.promise();
         });
         spyOn(widget.dataService, "getDiscussionsData").and.callFake(function(){
            var d = $.Deferred();
            d.resolve(responseGetDiscussionsData);
            return d.promise();
         });

         widget.getDataDiscussions();
         expect(widget.sortDiscussions).toHaveBeenCalled();

      });
      it("should sort discussion", function(){
         var responseGetDiscussionsData = [{"name":"Prueba 2 Discussion","description":"prueba2","globalParent":"152","user":403,"files":[],"guid":"e519d869-1f65-472a-84f3-d282ce1a7d97","tags":[],"typeResource":"Discussion","general":false,"date":"20/02/2015 11:16:02:864"}, {"name":"Prueba1","description":"prueba1","globalParent":"152","user":403,"files":[],"guid":"e519d869-1f65-472a-84f3-d282ce1a7d97","tags":[],"typeResource":"Discussion","general":false,"date":"20/02/2014 11:16:02:864"}];
         var newListDicussionsSort = widget.sortDiscussions(responseGetDiscussionsData);
         expect(newListDicussionsSort[0].name).toBe("Prueba1");
      });


   });

   describe("List comments", function(){
      it("Should call when call callForListComments", function(){

         spyOn(widget.dataService, "getCommentsData").and.callFake(function(){
            var d = $.Deferred();
            d.resolve(responseCallForListComments);
            return d.promise();
         });

         widget.callForListComments(responseGetDiscussionsData);

      });
      it("Should toogleClass when onViewComment is called", function(){
         var $target = $(".ui-bizagi-wp-project-discussions-comment-view",containerDiscussion);
         widget.onViewComment($target);
      });
      it("Should call getCommentsCountByParent when property total not is null", function(){

         spyOn(widget.dataService, "getCommentsCountByParent").and.callFake(function(){
            var d = $.Deferred();
            d.resolve({count: 6});
            return d.promise();
         });
         spyOn(widget, "getMoreComments");

         //call more commets if know count comments
         var $target = $(".ui-bizagi-wp-project-discussion-showmore-comments-button",containerDiscussion);
         widget.commentsList["5015a1b6-6d49-420d-a31c-5f781654eac0"] = {total: 6};
         widget.onViewMoreComments($target);

         expect(widget.getMoreComments).toHaveBeenCalled();

         //call more commets if not know count comments
         widget.commentsList["5015a1b6-6d49-420d-a31c-5f781654eac0"] = {total: null};
         widget.onViewMoreComments($target);
         expect(widget.commentsList["5015a1b6-6d49-420d-a31c-5f781654eac0"].total).toBe(6);

         expect(widget.getMoreComments).toHaveBeenCalled();
      });

      it("Should getMoreComments and different messages", function(){

         spyOn(widget, "setStateUIShowMoreComments");

         spyOn(widget.dataService, "getCommentsData").and.callFake(function(){
            var d = $.Deferred();
            d.resolve(responseCallForListComments);
            return d.promise();
         });

         //call more commets if know count comments
         var $target = $(".ui-bizagi-wp-project-discussion-showmore-comments-button",containerDiscussion);
         var $commentWrapper = $target.closest(".ui-bizagi-wp-project-discussion-showmore-comments");
         var $commentsContainer = $commentWrapper.siblings(".ui-bizagi-wp-project-discussion-comment-list");
         var idParent = $commentsContainer.closest(".ui-bizagi-wp-project-discussions-container-description-and-comments").data('guid');

         widget.commentsList["5015a1b6-6d49-420d-a31c-5f781654eac0"] = {
            total: 10,
            count:6,
            comments : [
               {date: "12/12/2014 06:06:00:000"},
               {date: "12/12/2014 06:06:00:000"},
               {date: "12/12/2014 06:06:00:000"},
               {date: "12/12/2014 06:06:00:000"},
               {date: "12/12/2014 06:06:00:000"},
               {date: "12/12/2014 06:06:00:000"},
               {date: "12/12/2014 06:06:00:000"}
            ]
         };
         widget.getMoreComments(idParent, $commentsContainer);
         expect(widget.setStateUIShowMoreComments).toHaveBeenCalledWith($commentsContainer, "ALLOW_MORE_COMMENTS");

      });


      describe("Show more comments funcionality", function(){

         it("Add events to elements", function(){
            var $contentWidget = widget.getContent();
            $("#ui-bizagi-wp-project-discussions-list-wrapper", $contentWidget).on("click", ".ui-bizagi-wp-project-discussions-add-comment > textarea" +
               ", .ui-bizagi-wp-project-discussions-comment-buttons-cancel" +
               ", .ui-bizagi-wp-project-discussions-comment-buttons-share" +
               ", .ui-bizagi-wp-project-discussion-showmore-comments button" +
               ", .ui-bizagi-wp-project-discussions-comment-view"
               , $.proxy(widget.switchCommentsEvents, self));

            $(".ui-bizagi-wp-project-discussions-add-comment > textarea", $contentWidget).click();
            $(".ui-bizagi-wp-project-discussions-comment-buttons-cancel", $contentWidget).click();
            $(".ui-bizagi-wp-project-discussions-comment-buttons-share", $contentWidget).click();
            $(".ui-bizagi-wp-project-discussion-showmore-comments button", $contentWidget).click();
            $(".ui-bizagi-wp-project-discussions-comment-view", $contentWidget).click();

         });

         it("Visible messages according state message", function(){
            var $target = $(".ui-bizagi-wp-project-discussion-showmore-comments-button",containerDiscussion);
            var $commentWrapper = $target.closest(".ui-bizagi-wp-project-discussion-showmore-comments");
            var $commentsContainer = $commentWrapper.siblings(".ui-bizagi-wp-project-discussion-comment-list");

            var $containerButtonMoreComments = $commentsContainer.siblings(".ui-bizagi-wp-project-discussion-showmore-comments");
            var $buttonShowMoreComments = $containerButtonMoreComments.find(".ui-bizagi-wp-project-discussion-showmore-comments-button");
            var $messageNoMoreComments = $containerButtonMoreComments.find(".ui-bizagi-wp-project-discussion-showmore-no-more-comments");
            var $messageLoadingComments = $containerButtonMoreComments.find(".ui-bizagi-wp-project-discussion-showmore-loading-comments");

            widget.setStateUIShowMoreComments($commentsContainer, "ALLOW_MORE_COMMENTS");
            expect($buttonShowMoreComments.css("display")).toBe("inline-block");
            expect($messageNoMoreComments.css("display")).toBe("none");
            expect($messageLoadingComments.css("display")).toBe("none");

            widget.setStateUIShowMoreComments($commentsContainer, "LOADING_MORE_COMMENTS");
            expect($buttonShowMoreComments.css("display")).toBe("none");
            expect($messageNoMoreComments.css("display")).toBe("none");
            expect($messageLoadingComments.css("display")).toBe("block");

            widget.setStateUIShowMoreComments($commentsContainer, "NO_MORE_COMMENTS");
            expect($buttonShowMoreComments.css("display")).toBe("none");
            expect($messageNoMoreComments.css("display")).toBe("block");
            expect($messageLoadingComments.css("display")).toBe("none");
         });

      });
   });

   describe("Utils", function(){
      it("Should call sowFormAdDiscussion when onNotifyOpenPopup is called", function(){
         spyOn(widget, "showFormAddDiscussion");
         var args = {args: {type: "comments"}};
         widget.onNotifyOpenPopup("ev", args);
         expect(widget.showFormAddDiscussion).toHaveBeenCalled();
      });

      it("Should getDataUsers fill widget.userPictures with data", function(){
         var responseGetUsersData = [
            {
               "id": 1,
               "name": "El zorro",
               "picture": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAwADADASIAAhEBAxEB/8QAGgAAAgMBAQAAAAAAAAAAAAAABAUBAwYAAv/EAC4QAAIBAwMDAgUDBQAAAAAAAAECAwAEEQUSIQYTMUFRFCJhcYEVkcEjgrHh8P/EABkBAAMBAQEAAAAAAAAAAAAAAAEFBgIAA//EABwRAAICAwEBAAAAAAAAAAAAAAECAAMREiEEMf/aAAwDAQACEQMRAD8AynZru1WtPSyyXDLbajayxBwNxfacGl2raUdHu5EmDvCnzBl4LqOTj61S7pjMnNGzEfaqRHzTVrKKaFLqxkNxayKGVgpyo9mFVC0YkAKcn0xXV2V2Lup5C9diNqw7AljosyyyQLCzZjXwKJksWh2gvGzHyqOGK/Q+xo/SdOs55z8fOYYlGfl8k0QyMu69EGrK2p4ZaituCuGkCjAdRgrXt7N5lO/cQBzuPOD96rtHaWTKSbzuI4J4pmqv2SZgpOMEN5Iqdo99tPD0RvZ5Us6OGLNLbTNFsha2lzd3V28nYzhtiFjnYvoP3oi4h/VLO90z4wQ6lb/1I0fw5xkA+4/kUtiNv03qfxlyWdGV3ggDYaR1GVTJ4xk5/FNodci1++sLqBUt55Ie7cwBtxj+bYo/u4IzyBSZvO2++Y9T0qatMQOy0dbS2SJcnHLMfLMfJNFCzx6Vo47KB7N5zdQIyNtaJ2w4P2/mqrSXSu9vuLyIxqeQN2D59cYq0X1UImFPBJA0Wu+WHTM9ZgxBsIMrkkY8/WizIO4zE7gwyBig7SO7O028TumPDL/g0zksr17clLeJH9GlYgZ/AJqWAJ+R0CYl1C3gvOtNJtY27nwltJdSu2SCxICgD2zQVxBFo3UCXcTKzXk0kVwucqowrJnHg5zxQmndN9SXfUskl5dS2vdHakuIsbdgOQq+4rdXHSel3VlHBdNLbhZO63ZAQu+MbmPrRZeYnqjYOZKaDP5SaNCRhlL7hz6D/dC3PS57BjiuQnJ+UJwR+9PnDSx7FKyYGBJu2FvqP+FUnesREwfKn3zn81kMZjQT/9kgICAgICAgICAgICAgICAgICAgICAgICA="
            },
            {
               "id": 356,
               "name": "El puma",
               "picture": "data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAFAAcAMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAACBQEDBgQAB//EADkQAAEEAQMCBAIIBQMFAAAAAAECAwQRAAUSITFBBhNRYSKBFDJxkaGxwdEVI0JS8DPh8QcWJHKC/8QAGgEAAgMBAQAAAAAAAAAAAAAAAwQBAgUABv/EACYRAAICAQIFBAMAAAAAAAAAAAECAAMRBCESEyIxQQVRYaEUUnH/2gAMAwEAAhEDEQA/AC/qV9ueFemSfrHPAZ6Qdp5kneSKwxV4NcYQGTJEngHCFYIF4aRkSwkpq8MZCU4YGVkyOMIgV0yKwq4yMS4MpfUlLZvjtd1+PbF+pylQ3tjCFLUEJ3he4JSogHuBX2fiRRxi42FpKVdDlTbKW72FXPqcE9bswIOIVbFVSCMxT/FxR/kX/wDY/LCa1Ft5xDZbUlS+nN19uMyMBQywrf8AaUNlf6/c8QNxz2FxeQcOIq0kdMNIHTIFVhCsmSJ4DnpYwxWZqXrrDGsORlJdW6zQor2gi76e3HPpmkYdQ835iL23XI9rzPq1yvcamGD4+Yy9BVQ0OwlJJ6Dr7c1+uESlKlAqSCnrz0xb4gmIhaRIccSVNqHlqCTRs/Vr3Ctpzk8PznZOnSNRb/8ALcZpTiEqAIHBPwnr69b/ACxXWa63T2kAZEc02krurznBmjSwVRVPgjaFbePlf5jArB0ua3PgqVHAICLvcBwCLFdTz91YfbD6DUtqELN3zB6qhaWCr7SsjBUB2w1cYBx8RQyk9awCnLTlaqywgzIrm88euWHBrJEgyEj0yt+WzGIDyqJBI9665dlE6FHmtbZCRwDSuhT88DfzDWeWcGXr4c9XaK/ECYvkR9SDbTtjYFFNlSTzx7/ucbaYomOKO9sp3BVd/T8MzUxqTBhGPEcRL05BCA22PMU2a6fr+2dUXUEaFpipepPUXEEtMk0pfoNvNH15zCdX/KVzt7zSCqaiBvE/j7WUuTmNNZJ2xlhx5Q/urgfIG/nlkp7yI7UkpcShLiVyVRxRWi+dwHUUTmQBclzFvyVbnHFFS1HuT1zd+AtEmavqzUmZKdTCiitqFEBw9k+/vi+suDsbWjlFXCAizd6O3piYU+Rp+mPw4awj6JvkhxKitJ3KSkE7QRXU+vAJOUnHGrKZahtRmUpTtX/SAOx613xOpSUi1EAe+aHpDq1Bf5ivqKkWhfiVqwTkl5o9FpxRO8R6bDJQ8+lLlGknvWaZvrXuYjy3PYRgs1ZJoDKVuoSkLUoBJ6HMmjxHK1CGp9KEthx4MtoBsfacTxdXkrkvtS5FhCvKabSOBz1+7E39TUZCDMYXRE7sZ9Mrk5G3F58QaZuUESUqCVEKX/SKuzfpx16YwieIdDagplMyVPKW2Vg7KWQD6duQR9+U1fqq0DCDiP1O0/p7W7ucD7ivxBqjmiNBbmnyl7xSVKRsRf8A7H9BmPY8TO6q+piXbJcsIUzwE8d7vNN4q1QeJm223HvJCQpTbQF3Y4v7vzzDQ9E1B1SHozFtBW4LcA5APUp5NfYDmY2ts1CYt2jaaepD0bxpFXq2keSiNLjNw0q5cU7W4XwFXzZ7BIJGaBvS0edH1B5lL0gobQhYKlgq20o0TXG09sLSNKlzJ7TUiDCkMlG9Mhtf8pN+m4dPY5qtP0xyQ5HliSEMJK0KtQoDev4RXAA/bE7byy4zHkp94p1fwtDdZbny1oLqEkFG3aFG7o+v/Ix3oXlMQAE7W0I6hBv5DKfHTbr8iFHh0pxSFJabVQsjuT92UaLo7zUdbb8hTjl2rbwn5D0HTFXI5XUYapCH6RtB8ba+1pXh8TYbXmLW8G0b+OaPX7sxOna9Ke08zdRS6+FKWQhhPNcCgPtzXf8AULRHZ/hX6PAaXIlJkIdShB5NAg168E58/gTHoOnsRBDk/TWlKO3yuKJ6EdfwxrSMfxwoPmD1Sjm5lELxfqsWYH9rAU18KW1t9Offn/es6FeJ3tVk3qsTT5K1Kob4qSa7AKKhX+c4uY0WZOnhEjdGL7l+ZIbUAonk9vfrmo0fwq/pk9xiV9HWpANOpYWsk1wPQCibo4dzWu/mBHEZdo0rS3JBhiBHLba96PJUTRPejR71wc7f+39CblOy0sqU4sKJC1kp69wRXXsbB9Di6V4WC9ZZdYeiR2isKXSFLUpXWwFJ45980DWkyf8AVSdxWkixtV1v+47u9V044Axdyo3VoQA+RGpjMPKCWgKFUnaNqQAa7e+KHdD1aKgnTtWaG4Gm34wCAD1CSgCq56Dnuc05YaYR9IbNV1T6jj9s51ufGF8BKx8QrpiS3MP5DlRMM34XmKjreXOjMSVqUFH4js542jiuvexyMYad4ekMopmetxwuBRKgKRxz70fYjNOypKn0rW8dqeaAusWt+JYDk9USP/KebJsyGi2VDtQNXh+dY/aD4EXcwddjz4Hh2UmZDak6eAEuLZfUFJRxyoKBNevxE4EKZtahx5khwl1K1BBJVawqyTXA+t86vHTLzK4qw+pToWk7t97QObodweR8sWytPYlMtJioUw0lO6O6KIQoE1QPPr6dchX2wZYr5EyJHiTSdXi6hqsJbqXN8dS2leYAkkdBZIHf3H2ZvI0sQtIW+42+86bTsbRalCwB8Pvz+uUrmSYstv6Syp6OE/6rRJogC7Td8+1jjEnifxFK0qHFkw9KUp6enelPxKCUi+w6GzR4F+vGXYc0gYlVbgzvH7eq+eiWhLg3x0UtLY3UT0FDqSO2L3NSWdRiNOfxCGkJSLUx8Cif7lkEDjtx0zB+MNTbhPxF6O6pLclH0l5VUXF7z9YfL/KzaRNaWWY6Hw40QG3EEOpV5427yB8geDzwPXOeoquQO8lXBPVLtR1KM/IlJbk0/Ei+Y8ytPDZ5460TQugemLIus/xRW/TpLjLQcH12UigPYdibrnL5Gq6RqMV6FqUdtqU4Kk7KIVwLIKSDXe8y2maTGiSYkuHqaVMrcc3uBW220GjY9z05uuaPbqqxw9QwZ1jb7dpsNkhTyW/5S1lJ2uFG0mj2Hp9px2w275IW6hJVzwRXy6nOVAjyYTU4voSC2Chah1Bo2PS6Htid3XH1TH4kVTvmI+N0Og/AN3AHAsEDrggrOZOQs//Z"
            },
            {
               "id": 403,
               "name": "El ave",
               "picture": "data:image/png;base64,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"
            }
         ];
         spyOn($, 'read').and.callFake(function () {
            var d = $.Deferred();
            d.resolve(responseGetUsersData);
            return d.promise();
         });
         widget.userPictures = [];
         widget.getDataUsers("1,2,3,4,5,6,7,8");
         expect(widget.userPictures.length).toBe(responseGetUsersData.length);

      });

      it("Should be create comment when onCreateComment is called", function(){
         //spyons
         spyOn(widget, "renderCommentByDiscussion");
         spyOn(widget, "renderUserProfilesAndImages");
         spyOn(widget.dataService, 'postComment').and.callFake(function () {
            var d = $.Deferred();
            d.resolve({status: 200});
            return d.promise();
         });

         widget.commentsList = {};
         widget.commentsList["5015a1b6-6d49-420d-a31c-5f781654eac0"] = {comments: []};
         widget.plugins["attchComments"] =  {
            close: function(){}
         };

         //parameters method
         var target = $(".ui-bizagi-wp-project-discussions-comment-buttons-share",containerDiscussion);
         var guidNewComment = Math.guid();

         widget.onCreateComment(target, guidNewComment);

         expect(widget.renderUserProfilesAndImages).toHaveBeenCalled();
         expect(widget.commentsList["5015a1b6-6d49-420d-a31c-5f781654eac0"].comments.length).toBe(1);
      });
      describe("validateAddCommentForm function", function () {
         beforeEach(function () {
            wrapperForm = $('<div class="ui-bizagi-wp-project-discussions-add-comment ui-bizagi-wp-project-discussion-textwrapper" data-guid="5387dd40-83fb-4325-b8b7-c3e6931a2061"> <p class="bz-wp-discussion-user"><strong class="bz-wp-discussion-username">Addison Jones</strong></p><div class="ui-bizagi-wp-project-container-validator-relative"> <textarea required="required" data-role="validator" aria-invalid="true" class="k-invalid"></textarea><span class="k-widget k-tooltip k-tooltip-validation k-invalid-msg" data-for="" role="alert"><span class="k-icon k-warning"> </span> El comentario es requerido</span> <div class="ui-bizagi-wp-project-discussions-add-attachments"> <form> <div class="k-widget k-upload k-header k-upload-empty"><div class="k-dropzone"><div class="k-button k-upload-button"><input type="file" name="file[]" class="ui-bizagi-wp-project-discussions-attachment-upload" multiple="multiple" accept=".jpg,.pdf,.txt,.png,.pptx,.docx,.gif,.rtfx,.xlsx,.zip,.rar" data-role="projectattachments" autocomplete="off"><span>Select files...</span></div><em>drop files here to upload</em></div></div></form> </div></div><div class="ui-bizagi-wp-project-discussions-comment-buttons-wrapper" style="display: block;"> <button class="ui-bizagi-wp-project-discussions-comment-buttons-cancel"> Cancelar </button> <button class="ui-bizagi-wp-project-discussions-comment-buttons-share"> Compartir </button> </div><div class="ui-bizagi-wp-project-discussions-attachments-cmnwrapper"> <ul class="ui-bizagi-wp-project-attachments-list" data-type="COMMENT"> </ul> </div></div>');
         });
         it("When textArea is empty should return false", function () {
            $("textarea", wrapperForm).val("");
            expect(widget.validateAddCommentForm(wrapperForm)).toBe(false);
         });
         it("When textarea is not empty should return true", function(){
            $("textarea", wrapperForm).val("Some value");
            expect(widget.validateAddCommentForm(wrapperForm)).toBe(true);
         });
      });

      describe("validateAddDiscussionForm", function () {
         beforeEach(function () {
            wrapperForm = $('<div id="project-popupform-wrapper-discussion" class="ui-dialog-content ui-widget-content" style="display: block; width: auto; min-height: 0px; max-height: none; height: auto;"> <div class="ui-bizagi-wp-project-popupform-scroll"> <form class="ui-bizagi-wp-project-popupform-form" data-role="validator" novalidate="novalidate"> <table border="0" cellpadding="0" cellspacing="0"> <tbody> <tr> <td class="first-column ui-bizagi-wp-project-popupform-user"> <div class="bz-wp-avatar bz-wp-avatar-48 ui-bizagi-wp-project-discussions-item-user"> <img class="bz-wp-avatar-img" style="display: none;"> <label class="bz-wp-avatar-label">AJ</label> </div></td><td> <div class="ui-bizagi-wp-project-container-validator-relative"> <input id="ui-bizagi-wp-project-discussions-popup-subject-input" class="ui-bizagi-wp-project-discussions-popupform-input k-valid" name="subject-discussion" value="" type="text" maxlength="50"> <span class="k-invalid-msg" data-for="subject-discussion" style="display: none;"></span> </div></td></tr><tr> <td class="first-column"> <span class="ui-bizagi-wp-project-popupform-field-name field-description">*Descripción:</span> </td><td class="ui-bizagi-wp-project-discussion-textwrapper"> <div class="ui-bizagi-wp-project-container-validator-relative"> <textarea id="ui-bizagi-wp-project-discussions-popup-description-textarea" class="ui-bizagi-wp-project-discussions-popupform-textarea k-valid" name="description-discussion"></textarea><span class="k-widget k-tooltip k-tooltip-validation k-invalid-msg" data-for="description-discussion" role="alert" style="display: none;"><span class="k-icon k-warning"> </span> La descripción es requerida</span> <div class="ui-bizagi-wp-project-discussions-add-attachments"> <div class="k-widget k-upload k-header k-upload-empty"><div class="k-dropzone"><div class="k-dropzone"><div class="k-button k-upload-button"><input type="file" name="file[]" class="ui-bizagi-wp-project-discussions-attachment-upload k-valid" multiple="multiple" accept=".jpg,.pdf,.txt,.png,.pptx,.docx,.gif,.rtfx,.xlsx,.zip,.rar" data-role="projectattachments" autocomplete="off"><span>Select files...</span></div><em>drop files here to upload</em></div><em>drop files here to upload</em><em>drop files here to upload</em></div></div></div></div><div class="ui-bizagi-wp-project-discussions-attachments-cmnwrapper"> <ul class="ui-bizagi-wp-project-attachments-list" type="DISCUSSION"></ul> </div></td></tr><tr> <td class="first-column"> <span class="ui-bizagi-wp-project-popupform-field-name field-description">*Etiquetas:</span> </td><td> <div> <div class="k-widget k-multiselect k-header ui-bizagi-wp-project-discussions-popupform-input" unselectable="on" title="" style=""><div class="k-multiselect-wrap k-floatwrap" unselectable="on"><ul role="listbox" unselectable="on" class="k-reset" id="ui-bizagi-wp-project-discussions-options-multiselect-tags_taglist"></ul><input class="k-input k-readonly k-valid" style="width: 148px;" accesskey="" autocomplete="off" role="listbox" aria-expanded="false" tabindex="0" aria-owns="ui-bizagi-wp-project-discussions-options-multiselect-tags_taglist ui-bizagi-wp-project-discussions-options-multiselect-tags_listbox" aria-disabled="false" aria-readonly="false" aria-busy="false"><span class="k-icon k-loading k-loading-hidden"></span></div><select id="ui-bizagi-wp-project-discussions-options-multiselect-tags" multiple="multiple" data-placeholder="Seleccionar etiqueta..." class="ui-bizagi-wp-project-discussions-popupform-input k-valid" data-role="multiselect" aria-disabled="false" aria-readonly="false" style="display: none;"></select><span style="position: absolute; visibility: hidden; top: -3333px; left: -3333px;">Seleccionar etiqueta...</span></div></div></td></tr></tbody> </table> </form></div><div class="ui-bizagi-wp-project-discussions-attachments"> </div><div class="ui-bizagi-wp-project-popupform-actions"> <button id="ui-bizagi-wp-project-popupform-action-cancel" class="ui-bizagi-wp-project-popupform-button ui-bizagi-wp-project-popupform-button-cancel">Cancelar</button> <button id="ui-bizagi-wp-project-discussions-popup-action-add-discussion" class="ui-bizagi-wp-project-popupform-button ui-bizagi-wp-project-popupform-button-action">Guardar</button> </div></div>')
         });
         it("When name and description is not empty should be return true", function () {
            $("#ui-bizagi-wp-project-discussions-popup-subject-input", wrapperForm).val("Some name discussion");
            $("#ui-bizagi-wp-project-discussions-popup-description-textarea", wrapperForm).val("Some description");
            expect(widget.validateAddDiscussionForm(wrapperForm)).toBe(true);
         });
         it("When name is empty || description is empty, should be return false", function () {
            $("#ui-bizagi-wp-project-discussions-popup-subject-input", wrapperForm).val(" ");
            expect(widget.validateAddDiscussionForm(wrapperForm)).toBe(false);
            $("#ui-bizagi-wp-project-discussions-popup-description-textarea", wrapperForm).val(" ");
            expect(widget.validateAddDiscussionForm(wrapperForm)).toBe(false);
            $("#ui-bizagi-wp-project-discussions-popup-subject-input", wrapperForm).val("some value");
            expect(widget.validateAddDiscussionForm(wrapperForm)).toBe(false);
         });
      });
   });

   describe("Attach files to a discussion or comment", function(){

      it("should show initialize file attachments", function(){

         var file;
         file = widget.applyFileAttachments("DISCUSSIONS");

         expect(file).not.toBeUndefined(file);
      });

      it("should prepare files to save", function(){

         var files;

         widget.attchComments["520a2140-0799-4e55-b0a3-ff8f09641ee2"] = {
            addition: [
               {
                  "name": "bizagiObjects_es (5).xlsx",
                  "extension": ".xlsx",
                  "size": 8192,
                  "rawFile": {
                     "webkitRelativePath": "",
                     "lastModified": 1416354841000,
                     "lastModifiedDate": "2014-11-18T23:54:01.000Z",
                     "name": "bizagiObjects_es (5).xlsx",
                     "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                     "size": 8192
                  },
                  "uid": "c43bac5a-0216-4e65-933c-8b1cbacff70b",
                  "guid": "c43bac5a-0216-4e65-933c-8b1cbacff70b"
               }
            ],
            remove: [
               "c43bac5a-0216-4e65-933c-8b1cbacff76b",
               "c43bac5a-0216-4e65-933c-8b1cbac4f70b"
            ]
         };

         files = widget.prepareFilesToSave("COMMENTS", "520a2140-0799-4e55-b0a3-ff8f09641ee2");

         expect(files.attachments).toEqual([{
            "guid": "c43bac5a-0216-4e65-933c-8b1cbacff70b",
            "name": "bizagiObjects_es (5).xlsx"
         }]);

         expect(files.attachmentsToDelete).toEqual([
            "c43bac5a-0216-4e65-933c-8b1cbacff76b",
            "c43bac5a-0216-4e65-933c-8b1cbac4f70b"
         ]);

         expect(files.attachmentsToCreate).toEqual([
            "c43bac5a-0216-4e65-933c-8b1cbacff70b"
         ]);
      });
   });

   describe("tagsMultiSelect", function () {
      describe("Event Change", function () {
         beforeEach(function () {

         });
         it("Should dont errors", function () {
            var multiSelect = widget.plugins.tagsMultiSelect;
            var multiSelectData = multiSelect.dataSource.data();
            multiSelectData.push({guid: "new guid", tag: "workportal-project-discussion-add-new-tag: newtag", value: "1234"});
            multiSelectData.push({guid: "new guid2", tag: "newtag2", value: "12343"});
            multiSelectData.push({guid: "new guid3", tag: "newtag3", value: "12343"});
            multiSelect._prev = true;
            multiSelect.value("1234");
            multiSelect.trigger("change");
            multiSelect.dataSource.fetch();
         });
      });
   });

   describe("sendDataUpdateDiscussion", function () {
      describe("When response edit success", function () {
         beforeEach(function () {
            widget.showFormAddDiscussion();
            spyOn(widget.dataService, "editDiscussion").and.callFake(function(){
               var defer = $.Deferred();
               defer.resolve({status: 201});
               return defer.promise();
            });
         });
         it("Should call editDiscussion", function () {

            widget.listDataDiscussion = [{"tags":[],"guid":"e8bf5857-813f-4b41-8174-e0abca22b380","description":"","name":"workportal-project-discussion-generaldiscussion","attachments":[],"date":1450124044259,"user":null,"general":true,"globalParent":"6901"},{"tags":[],"guid":"3a53370b-f5d5-46de-ae99-dc347510e1ea","description":"desc","name":"dis2","attachments":[],"date":1450124057946,"user":207,"general":false,"globalParent":"6901"}];
            widget.sendDataUpdateDiscussion("e8bf5857-813f-4b41-8174-e0abca22b380");
            expect(widget.dataService.editDiscussion).toHaveBeenCalled();
         });
      });
      describe("When response edit error", function () {
         beforeEach(function () {
            widget.showFormAddDiscussion();
            spyOn(widget.dataService, "editDiscussion").and.callFake(function(){
               var defer = $.Deferred();
               defer.resolve({status: 500});
               return defer.promise();
            });
            spyOn(widget.notifier, "showErrorMessage");
         });
         it("Should call editDiscussion", function () {
            widget.listDataDiscussion = [{"tags":[],"guid":"e8bf5857-813f-4b41-8174-e0abca22b380","description":"","name":"workportal-project-discussion-generaldiscussion","attachments":[],"date":1450124044259,"user":null,"general":true,"globalParent":"6901"},{"tags":[],"guid":"3a53370b-f5d5-46de-ae99-dc347510e1ea","description":"desc","name":"dis2","attachments":[],"date":1450124057946,"user":207,"general":false,"globalParent":"6901"}];
            widget.sendDataUpdateDiscussion("e8bf5857-813f-4b41-8174-e0abca22b380");
            expect(widget.dataService.editDiscussion).toHaveBeenCalled();
            expect(widget.notifier.showErrorMessage).toHaveBeenCalled();
         });
      });
   });
   describe("switchCommentsEvents", function () {
      beforeEach(function(){
         event = {
            stopPropagation: function(){}
         };
      });
      describe("when event is textarea", function () {
         beforeEach(function () {
            spyOn(widget, "onShowButtonsPanel");
            var wrapper = $("<div class='wrapper'><div class='parent'><textarea class='target'></textarea></div></div>");
            event.target = $('.target', wrapper);
         });
         it("Should call onShowButtonsPanel", function () {
            widget.switchCommentsEvents(event);
            expect(widget.onShowButtonsPanel).toHaveBeenCalled();
         });
      });
      describe("when event is trigger by class ui-bizagi-wp-project-discussions-comment-buttons-cancel", function () {
         beforeEach(function () {
            spyOn(widget, "onCancelComment");
            var wrapper = $("<div class='wrapper'><div class='parent'><div class='target ui-bizagi-wp-project-discussions-comment-buttons-cancel'></div></div></div>");
            event.target = $('.target', wrapper);
         });
         it("Should call onCancelComment", function () {
            widget.switchCommentsEvents(event);
            expect(widget.onCancelComment).toHaveBeenCalled();
         });
      });
      describe("when event is trigger by class ui-bizagi-wp-project-discussions-comment-buttons-share", function () {
         beforeEach(function () {
            spyOn(widget, "onCreateComment");
            spyOn(widget, "validateAddCommentForm").and.returnValue(true);

            var wrapper = $("<div class='wrapper'><div class='parent ui-bizagi-wp-project-discussions-add-comment'><textarea>contenido</textarea><div class='target ui-bizagi-wp-project-discussions-comment-buttons-share'></div></div></div>");
            event.target = $(".target", wrapper);
         });
         it("Should call onCreateComment", function () {
            widget.switchCommentsEvents(event);
            expect(widget.onCreateComment).toHaveBeenCalled();
            expect(widget.validateAddCommentForm).toHaveBeenCalled();
         });
      });
      describe("when event is trigger by class discussions-comment-view", function () {
         beforeEach(function () {
            spyOn(widget, "onViewComment");
            var wrapper = $("<div class='wrapper'><div class='parent'><div class='target ui-bizagi-wp-project-discussions-comment-view'></div></div></div>");
            event.target = $(".target", wrapper);
         });
         it("Should call onViewComment", function () {
            widget.switchCommentsEvents(event);
            expect(widget.onViewComment).toHaveBeenCalled();
         });
      });
      describe("when event is trigger by class showmore-comments-button", function () {
         beforeEach(function () {
            spyOn(widget, "onViewMoreComments");
            var wrapper = $("<div class='wrapper'><div class='parent'><div class='target ui-bizagi-wp-project-discussion-showmore-comments-button'></div></div></div>");
            event.target = $(".target", wrapper);
         });
         it("Should call onViewMoreComments", function () {
            widget.switchCommentsEvents(event);
            expect(widget.onViewMoreComments).toHaveBeenCalled();
         });
      });
      describe("when event is trigger by class discussions-attachment-delete", function () {
         beforeEach(function () {
            spyOn(widget, "onRemoveFiles");
            var wrapper = $("<div class='wrapper'><div class='parent'><div class='target bz-bizagi-wp-project-discussions-attachment-delete'></div></div></div>");
            event.target = $(".target", wrapper);
         });
         it("Should call onRemoveFiles", function () {
            widget.switchCommentsEvents(event);
            expect(widget.onRemoveFiles).toHaveBeenCalled();
         });
      });
      describe("when edit discussion", function () {
         beforeEach(function () {
            spyOn(widget, "onEditDiscussion");
            var wrapper = $("<div class='wrapper'><div class='parent biz-wp-user-icon-admin biz-wp-action-edit-discussion'><div class='target'></div></div></div>");
            event.target = $(".target", wrapper);
         });
         it("Should call onEditDiscussion", function () {
            widget.switchCommentsEvents(event);
            expect(widget.onEditDiscussion).toHaveBeenCalled();
         });
      });

      describe("when delete discussion", function () {
         beforeEach(function () {
            spyOn(bizagi, "showConfirmationBox").and.callFake(function(){
               var defer = $.Deferred();
               defer.resolve(true);
               return defer.promise();
            });
            spyOn(widget, "onDeleteComment");
            var wrapper = $("<div class='wrapper'><div class='parent ui-bizagi-wp-project-discussion-delete'><div class='target'></div></div></div>");
            event.target = $(".target", wrapper);
         });
         it("Should call onDeleteComment", function () {
            widget.switchCommentsEvents(event);
            expect(widget.onDeleteComment).toHaveBeenCalled();
         });
      });

      describe("when download attachment", function () {
         beforeEach(function () {
            spyOn(widget, "onDownloadAttachment");
            var wrapper = $("<div class='wrapper'><div class='parent bz-bizagi-wp-project-discussions-attachment-itemwrapper'><div class='target'></div></div></div>");
            event.target = $(".target", wrapper);
         });
         it("Should call onDownloadAttachment", function () {
            widget.switchCommentsEvents(event);
            expect(widget.onDownloadAttachment).toHaveBeenCalled();
         });
      });
   });
   describe("renderAttachments", function () {
      beforeEach(function () {
         spyOn(widget, "getTemplate").and.callFake(function(){
            return {
               render: function(){}
            }
         });
      });
      it("Should call getTemplate", function () {
         widget.renderAttachments([], "type", $("<div></div>"));
         expect(widget.getTemplate).toHaveBeenCalled();
      });
   });
   describe("onClickCancel", function () {
      beforeEach(function () {
         spyOn(widget, "onClosePopupDiscussion");
         event = {
            "preventDefault": function(){}
         };
      });
      it("Should call onClosePopupDiscussion", function () {
         widget.onClickCancel(event);
         expect(widget.onClosePopupDiscussion).toHaveBeenCalled();
      });
   });
   describe("clean", function(){
      beforeEach(function(){
         spyOn(widget, "resetWidget").and.callThrough();

         widget.plugins = null;
         widget.plugins = {
            "plugin1": {
               destroy: function(){}
            },
            "attchComments": {
               close: function(){}
            }
         };
      });
      it("Should call resetWidget", function(){
         widget.clean();
         expect(widget.resetWidget).toHaveBeenCalled();
      });
   });
});
