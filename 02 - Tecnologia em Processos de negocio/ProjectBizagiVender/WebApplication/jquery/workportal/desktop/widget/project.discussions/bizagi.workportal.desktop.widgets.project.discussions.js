/*
 *   Name: Bizagi Workportal Desktop Project Discussions Controller
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.widgets.project.base.extend("bizagi.workportal.widgets.project.discussions", {}, {
    /*
     *   Constructor
     */
    init: function (workportalFacade, dataService, notifier, params) {

        var self = this;

        self.typeResource = "Discussion";
        self.plugins = {};
        self.dialogBoxDiscussion = {};
        self.attchComments = {};
        self.attchDiscussions = {
            remove: [],
            addition: []
        };
        self.listDataDiscussion = [];
        self.userPictures = [];
        self.commentsList = {};

        self.globalTags = [];

        self.tempTagsBeforeDelete = [];
        self.tempTagsToDelete = [];
        self.keySentenceAddTag = bizagi.localization.getResource("workportal-project-discussion-add-new-tag") + ": ";
        self.notifier = notifier;


        //Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "project-discussions": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.discussions").concat("#project-discussions-wrapper"),
            "project-discussions-popup": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.discussions").concat("#project-discussions-popup-wrapper"),
            "project-discussions-list": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.discussions").concat("#project-discussions-list-wrapper"),
            "project-discussions-comments": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.discussions").concat("#project-discussions-comments-list"),
            "project-discussions-attachments": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.discussions").concat("#project-discussions-attachments-list"),
            "project-attachments": bizagi.getTemplate("bizagi.workportal.desktop.widgets.project.attachments").concat("#project-attachments")
        });

    },

    /*
     * Renders the template defined in the widget
     */
    renderContent: function () {
        var self = this;
        var templateHomeDiscussions = self.getTemplate("project-discussions");

        self.content = templateHomeDiscussions.render({});
        return self.content;
    },

    /*
     * Post render and links events with handlers
     */
    postRender: function () {

        var self = this;
        var $contentWidget = self.getContent();

        self.plugins.popupDiscussion = self.initPluginPopupDiscussion();
        var popupDiscussion = self.plugins.popupDiscussion;

        //reference for html elements
        self.form = {
            buttonShowFormNewDiscussion: $(".ui-bizagi-wp-action-new", $contentWidget),
            title: $(".ui-bizagi-wp-project-popupform-h4", popupDiscussion),
            subject: $("#ui-bizagi-wp-project-discussions-popup-subject-input", popupDiscussion),
            description: $("#ui-bizagi-wp-project-discussions-popup-description-textarea", popupDiscussion),
            buttonShowPopupDiscussionToAdd: $("#ui-bizagi-wp-project-discussions-button-action-show-popup-to-add", $contentWidget),
            buttonAddDiscussion: $("#ui-bizagi-wp-project-discussions-popup-action-add-discussion", popupDiscussion),
            buttonCancel: $("#ui-bizagi-wp-project-popupform-action-cancel", popupDiscussion),
            formDiscussion: $(".ui-bizagi-wp-project-discussions-popup", popupDiscussion),
            attachments: $(".ui-bizagi-wp-project-discussions-attachments-cmnwrapper", popupDiscussion),
            edition: false
        };

        self.plugins.tagsFilter = self.initPluginTagsFilter();

        self.plugins.tagsMultiSelect = self.initPluginTagsMultiSelect(popupDiscussion);

        //Load discussions
        self.getDataDiscussions().done(function () {

            var idUsersCreatedDiscussions = $.map(self.listDataDiscussion, function (element) {
                return element.user;
            });

            var idUsersCreatedComments = $.map(self.commentsList, function (property) {
                return $.map(property.comments, function (property) {
                    return property.user;
                });
            });

            function removeDuplicateItemsFromArray(a) {
                var seen = {};
                var out = [];
                var len = a.length;
                var j = 0;
                for (var i = 0; i < len; i++) {
                    var item = a[i];
                    if (seen[item] !== 1) {
                        seen[item] = 1;
                        out[j++] = item;
                    }
                }
                return out;
            }

            var csvIdUsers = removeDuplicateItemsFromArray(idUsersCreatedDiscussions.concat(idUsersCreatedComments).concat(bizagi.currentUser.idUser)).join(",");

            self.getDataUsers(csvIdUsers).then(function () {
                self.renderUserProfilesAndImages();
            });

            self.setClassesTagsByDiscussion();

        });


        self.eventsHandler();
        self.restrictedEventsHandler();

    },

    /*
     * Notifies when an event is raised
     */
    onNotifyOpenPopup: function () {
        var self = this;

        self.form.edition = false;
        self.showFormAddDiscussion("workportal-project-discussion-adddiscussion");
        self.renderUserProfile();
    },

    /*
     * Init plugins
     */
    initPluginPopupDiscussion: function () {
        var self = this;
        var templatePopupDiscussion = self.getTemplate("project-discussions-popup");
        self.dialogBoxDiscussion.formContent = templatePopupDiscussion.render({attachments: []});
        return self.dialogBoxDiscussion.formContent;
    },


    initPluginTagsMultiSelect: function (popupDiscussion) {
        var self = this;
        var tags = [];
        var categoriesMultiSelect = popupDiscussion.find("#ui-bizagi-wp-project-discussions-options-multiselect-tags");
        var newitemtext;
        var isDelete = false;
        var createNewTag = false;
        return categoriesMultiSelect.kendoMultiSelect({
            change: function () {
                var valuesSelected = this.value().slice(0);

                var dataitems = this.dataSource.data();
                if (valuesSelected.length > 0) {
                    if (dataitems[0].tag.replace(self.keySentenceAddTag, "").indexOf(valuesSelected[valuesSelected.length - 1]) !== -1) {
                        //fix because the value dont complete by millisecond
                        valuesSelected[valuesSelected.length - 1] = dataitems[0].tag.replace(self.keySentenceAddTag, "");
                    }
                }


                valuesSelected = valuesSelected.filter(Boolean); //Remove empty items

                //remove duplicate items
                valuesSelected = valuesSelected.filter(function (value, pos, self) {
                    return self.indexOf(value) === pos;
                });

                var newtag = "";

                if (dataitems.length > 0) {
                    if (dataitems[0].tag.indexOf(self.keySentenceAddTag) !== -1) {
                        newtag = dataitems[0].tag.replace(self.keySentenceAddTag, "");

                        var dataItemAddNew = {};
                        if (valuesSelected.indexOf(newtag) !== -1) {
                            dataItemAddNew = this.dataSource.at(0);
                            isDelete = true;
                            this.dataSource.remove(dataItemAddNew);
                            isDelete = false;
                            this.refresh();
                            createNewTag = true;
                        }
                        else {
                            if (newtag) {
                                if ($("li:first", this.list).hasClass("k-state-focused")) {
                                    createNewTag = true;
                                    valuesSelected.push(newtag);
                                }
                                dataItemAddNew = this.dataSource.at(0);
                                isDelete = true;
                                this.dataSource.remove(dataItemAddNew);
                                isDelete = false;
                            }
                        }
                    }
                }
                if (newtag) {
                    if (createNewTag) {
                        var existInDatasource = this.dataSource.data().filter(function (itemData) {
                            return itemData.tag === newtag;
                        });
                        if (existInDatasource.length === 0) {
                            this.dataSource.add({guid: newtag, tag: newtag});
                        }
                        createNewTag = false;
                    }
                }
                this.dataSource.filter({});
                this.value(valuesSelected);

            },
            dataBound: function () {
                if ((newitemtext || this._prev) && newitemtext !== this._prev && !isDelete) {
                    newitemtext = this._prev;

                    var dataitems = this.dataSource.data();

                    var isfound = false;
                    if (dataitems.length > 0) {
                        if (dataitems[0].tag.indexOf(self.keySentenceAddTag) !== -1) {
                            dataitems[0].tag = self.keySentenceAddTag + newitemtext;
                            this.refresh();
                            isfound = true;
                            $("li", this.list).removeClass("k-state-focused");
                            $("li:first", this.list).addClass("k-state-focused");
                        }
                    }

                    if (!isfound) //Is found item with text "Add new tag:" ?
                    {
                        this.dataSource.insert(0, {tag: self.keySentenceAddTag + newitemtext, guid: newitemtext});
                    }

                    if (this.dataSource.total() == 0) {
                        this.search();
                        this.open();
                        this.refresh();
                        $("li", this.list).removeClass("k-state-focused");
                        $("li:first", this.list).addClass("k-state-focused");
                    }
                }
            },
            dataSource: tags,
            dataTextField: "tag",
            dataValueField: "guid",
            filter: "contains",
            animation: false
        }).data("kendoMultiSelect");
    },

    initPluginTagsFilter: function () {
        var self = this;
        var $contentWidget = self.getContent();
        return $("#ui-bizagi-wp-project-discussions-options-tags-filter", $contentWidget).kendoMultiSelect({
            change: function () {
                self.hideOrShowDiscussionsByFilter();
            },
            autoClose: false,
            tagMode: "single",
            dataTextField: "tag",
            dataValueField: "guid"
        }).data("kendoMultiSelect");
    },

    hideOrShowDiscussionsByFilter: function () {
        var self = this;
        var valuesSelected = self.plugins.tagsFilter.value();
        if (valuesSelected.length > 0) {
            $(".ui-bizagi-wp-project-discussions-item", self.getContent()).hide();
            valuesSelected.forEach(function (valueClass) {
                $(".ui-bizagi-wp-project-discussions-item." + valueClass, self.getContent()).show();
            });
        }
        else {
            $(".ui-bizagi-wp-project-discussions-item", self.getContent()).show();
        }
    },

    validateAddCommentForm: function($wrapperForm){
        var result = false;
        var $textAreaComment = $("textarea", $wrapperForm);
        if($textAreaComment.val().trim() === ""){
            var commentValidation = bizagi.localization.getResource("workportal-project-discussion-requiredcomment");
            $textAreaComment.parent().next().find('span').html(commentValidation);
        }
        else{
            $textAreaComment.parent().next().find('span').empty();
            result = true;
        }
        return result;
    },

    validateAddDiscussionForm: function($wrapperForm){
        var result = false;
        var $subjectDiscussion = $("#ui-bizagi-wp-project-discussions-popup-subject-input", $wrapperForm);
        var $descriptionDiscussion = $("#ui-bizagi-wp-project-discussions-popup-description-textarea", $wrapperForm);
        if($subjectDiscussion.val().trim() !== "" && $descriptionDiscussion.val().trim() !== ""){
            result = true;
        }
        if($subjectDiscussion.val().trim() === ""){
            var subjectValidation = bizagi.localization.getResource("workportal-project-discussion-subjectrequired");
            $subjectDiscussion.parent().find("span").html(subjectValidation);
        }
        else{
            $subjectDiscussion.parent().find("span").empty();
        }
        if($descriptionDiscussion.val().trim() === ""){
            var descriptionValidation = bizagi.localization.getResource("workportal-project-discussion-requireddescription");
            $descriptionDiscussion.parent().next().find("span").html(descriptionValidation);
        }
        else{
            $descriptionDiscussion.parent().next().find("span").empty();
        }

        return result;
    },

    applyFileAttachments: function (type) {

        var self = this;
        var content = (type === "DISCUSSIONS") ? self.plugins.popupDiscussion : self.getContent();

        return $(".ui-bizagi-wp-project-discussions-attachment-upload", content).kendoProjectAttachments({
            saveUrl: self.dataService.serviceLocator.getUrl("project-comments-uploadfiles"),
            template: self.getTemplate("project-attachments"),
            success: function (event) {
                self.onSuccessFile(event, type);
            },
            upload: $.proxy(self.addFileData, self),
            dropZone: false,
            extensions: self.supportFileExt,
            maxSize: self.uploadMaxFilesSize
        }).data("kendoProjectAttachments");
    },

    addFileData: function (event) {

        var uid = event.files[0].uid;

        event.files[0].guid = uid;
        event.data = {
            guid: uid
        };
    },


    /*
     *  Get data for discussions
     */
    getDataDiscussions: function () {

        var self = this,
            defer = $.Deferred();

        var paramsGetDiscussions = {
            globalParent: self.radNumber,
            typeResource: self.typeResource
        };

        if (self.params.flowContext === "FLOW-DECONTEXTUALIZED-PLANS") {
            paramsGetDiscussions.globalParent = self.params.plan.id;
        }

        self.dataService.getDiscussionsData(paramsGetDiscussions).pipe(function (response) {
            return self.callForListComments(response);
        }).done(function (response) {
            self.listDataDiscussion = self.sortDiscussions(response);
            self.updateTemplateListDiscussion();
            defer.resolve();
        });
        return defer.promise();
    },

    /*
     *  Get data for users
     */
    getDataUsers: function (csvIdUsers) {
        var self = this,
            defer = $.Deferred();

        var params = {
            userIds: csvIdUsers,
            width: 50,
            height: 50
        };

        if(params.userIds){
            self.dataService.getUsersData(params).always(function (response) {

                function arrayUnique(array) {
                    var a = array.concat();
                    for (var i = 0; i < a.length; ++i) {
                        for (var j = i + 1; j < a.length; ++j) {
                            if (a[i] === a[j]) {
                                a.splice(j--, 1);
                            }
                        }
                    }
                    return a;
                }

                self.userPictures = arrayUnique(self.userPictures.concat(response));
                defer.resolve();
            });
        }
        else{
            defer.resolve();
        }


        return defer.promise();
    },

    /*
     * Call list of comments by discussion
     */
    callForListComments: function (discussions) {

        var self = this,
            generalDefer = $.Deferred(),
            commentsDefer = [];

        for (var i = 0, length = discussions.length - 1; i <= length; i++) {

            self.addGlobalTags(discussions[i].tags, false);

            var params = {
                idParent: discussions[i].guid,
                dateTime: self.getDateServer(),
                count: 6
            };

            self.commentsList[params.idParent] = {
                comments: [],
                count: 0,
                total: 0
            };

            var defer = $.when(self.dataService.getCommentsData(params)).done(function (response) {
                if (response.length > 0) {
                    self.commentsList[response[0].parent] = {
                        comments: response,
                        count: response.length,
                        total: 0
                    };
                }
            });

            commentsDefer.push(defer);
        }

        $.when.apply($, commentsDefer).done(function () {
            generalDefer.resolve(discussions);
        });

        return generalDefer.promise();
    },

    sortDiscussions: function (discussions) {
        var sortedDiscussion = [];
        if (discussions.length) {
            sortedDiscussion = discussions.sort(function (a, b) {
                var dateA = a.date;
                var dateB = b.date;

                return (dateB - dateA);
            });

            if (sortedDiscussion.length > 0) {
                sortedDiscussion.unshift(sortedDiscussion.pop());
            }
        }
        return sortedDiscussion;
    },

    resetDiscussionAttachments: function () {

        var self = this;
        var popupDiscussion = self.plugins.popupDiscussion;
        $(".ui-bizagi-wp-project-attachments-list", popupDiscussion).empty();

        self.plugins.tagsMultiSelect.value([]);

        self.attchDiscussions.addition = [];
        self.attchDiscussions.remove = [];
    },

    sendDataUpdateDiscussion: function (guid) {

        var self = this;
        var filesObj = self.prepareFilesToSave();
        self.form.buttonAddDiscussion.prop("disabled", true);

        var tagsDiscussion = self.getTagsDiscussionBySave();
        var guidsTagsDiscussionToDelete = self.getGuidsTagsDiscussionToDelete();

        var params = {
            content: {
                name: self.form.subject.val(),
                description: self.form.description.val(),
                globalParent: self.radNumber.toString(),
                user: bizagi.currentUser.idUser,
                attachments: filesObj.attachments,
                guid: guid,
                tags: tagsDiscussion,
                typeResource: "Discussion",
                general: false,
                date: self.getDateServer()
            },
            attachmentsToCreate: filesObj.attachmentsToCreate,
            attachmentsToDelete: filesObj.attachmentsToDelete
        };

        self.plugins.attchDiscussions.close();

        self.dataService.editDiscussion(params).always(function (response) {
            if (response.status === 200 || response.status === 201 || response.status === undefined) {
                self.addGlobalTags(tagsDiscussion, true);

                var discussion = self.getDiscussionDataByGUID(guid);
                discussion.name = params.content.name;
                discussion.description = params.content.description;
                discussion.attachments = params.content.attachments;
                discussion.tags = params.content.tags;

                self.onClosePopupDiscussion();

                self.resetDiscussionAttachments();
                self.updateTemplateListDiscussion();

                self.removeGlobalTags(guidsTagsDiscussionToDelete);

                self.notifier.showSucessMessage(
                    printf(bizagi.localization.getResource("workportal-project-discussion-edited"), ""));
            } else {

                self.form.buttonAddDiscussion.prop("disabled", false);

                self.onClosePopupDiscussion();
                self.notifier.showErrorMessage(
                   printf(bizagi.localization.getResource("workportal-project-discussion-error-edition"), ""));
            }


            self.renderUserProfilesAndImages();

            self.setClassesTagsByDiscussion();
            self.hideOrShowDiscussionsByFilter();
        });

    },
    validateStringIsGuid: function (value) {
        var validGuid = /^({|()?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}(}|))?$/;
        var emptyGuid = /^({|()?0{8}-(0{4}-){3}0{12}(}|))?$/;
        return validGuid.test(value) && !emptyGuid.test(value);
    },

    sendDataInsertDiscussion: function (guid) {

        var self = this;
        var filesObj = self.prepareFilesToSave();

        self.form.buttonAddDiscussion.prop("disabled", true);

        var tagsDiscussion = self.getTagsDiscussionBySave();

        var params = {
            content: {
                name: self.form.subject.val(),
                description: self.form.description.val(),
                globalParent: self.radNumber.toString(),
                user: bizagi.currentUser.idUser,
                attachments: filesObj.attachments,
                guid: guid,
                tags: tagsDiscussion,
                typeResource: "Discussion",
                general: false,
                date: self.getDateServer()
            },
            attachmentsToCreate: filesObj.attachmentsToCreate,
            attachmentsToDelete: filesObj.attachmentsToDelete
        };

        self.plugins.attchDiscussions.close();

        self.dataService.postDiscussion(params).always(function (response) {
            if (response.status === 200 || response.status === 201 || response.status === undefined) {

                self.addGlobalTags(tagsDiscussion, true);

                self.form.buttonAddDiscussion.prop("disabled", false);

                var newDiscussion = {
                    "name": params.content.name,
                    "description": params.content.description,
                    "date": params.content.date,
                    "user": params.content.user,
                    "attachments": params.content.attachments,
                    "radNumber": params.content.globalParent,
                    "general": params.content.general,
                    "guid": params.content.guid,
                    "tags": params.content.tags,
                    "typeResource": params.content.typeResource
                };

                self.commentsList[params.content.guid] = {
                    comments: [],
                    count: 0,
                    total: 0
                };

                if (self.listDataDiscussion.length === 0) {//Add first discussion
                    self.listDataDiscussion.push(newDiscussion);
                }
                else {//Add discussion in position 1
                    self.listDataDiscussion.splice(1, 0, newDiscussion);
                }

                self.resetDiscussionAttachments();
                self.onClosePopupDiscussion();
                self.notifier.showSucessMessage(
                   printf(bizagi.localization.getResource("workportal-project-discussion-created"), ""));
                self.updateTemplateListDiscussion();


            }
            else {
                self.form.buttonAddDiscussion.prop("disabled", false);
                self.onClosePopupDiscussion();
                self.notifier.showErrorMessage(
                   printf(bizagi.localization.getResource("workportal-project-discussion-error-creation"), ""));
            }

            self.renderUserProfilesAndImages();

            self.setClassesTagsByDiscussion();
            self.hideOrShowDiscussionsByFilter();
        });
    },

    getTagsDiscussionBySave: function () {
        var self = this;
        var tagsTextSelected = self.plugins.tagsMultiSelect.value();
        var dataSourceTags = self.plugins.tagsMultiSelect.dataSource.data();

        var tagsDiscussion = [];
        tagsTextSelected.forEach(function (tagTextSelected) {
            var isGuidTextSelected = self.validateStringIsGuid(tagTextSelected);

            var tagFound;
            if (isGuidTextSelected) {
                tagFound = dataSourceTags.filter(function (tagSource) {
                    return tagSource.guid === tagTextSelected;
                });
            }
            else {
                tagFound = dataSourceTags.filter(function (tagSource) {
                    var isGuid = self.validateStringIsGuid(tagSource.guid);
                    return tagSource.tag === tagTextSelected && !isGuid;
                });
            }

            if (tagFound.length === 1) {
                tagsDiscussion.push({
                    guid: isGuidTextSelected ? tagFound[0].guid : tagFound[0].uid,
                    tag: tagFound[0].tag
                });
            }

        });

        return tagsDiscussion;
    },

    //b: minuendo, a: sustraendo
    differenceArrays: function (b, a) {
        return b.filter(function (i) {
            return a.indexOf(i) < 0;
        });
    },

    getGuidsTagsDiscussionToDelete: function () {
        var self = this;
        var guidsTagsCurrentDiscussion = self.plugins.tagsMultiSelect.value();
        return self.differenceArrays(self.tempTagsBeforeDelete, guidsTagsCurrentDiscussion);
    },

    /*
     *   UI Functions
     */
    setStateUIShowMoreComments: function ($commentsContainer, state) {
        var $containerButtonMoreComments = $commentsContainer.siblings(".ui-bizagi-wp-project-discussion-showmore-comments");
        var $buttonShowMoreComments = $containerButtonMoreComments.find(".ui-bizagi-wp-project-discussion-showmore-comments-button");
        var $messageNoMoreComments = $containerButtonMoreComments.find(".ui-bizagi-wp-project-discussion-showmore-no-more-comments");
        var $messageLoadingComments = $containerButtonMoreComments.find(".ui-bizagi-wp-project-discussion-showmore-loading-comments");

        if (state === "ALLOW_MORE_COMMENTS") {
            $buttonShowMoreComments.show();
            $messageNoMoreComments.hide();
            $messageLoadingComments.hide();
        }

        if (state === "LOADING_MORE_COMMENTS") {
            $buttonShowMoreComments.hide();
            $messageNoMoreComments.hide();
            $messageLoadingComments.show();
        }

        if (state === "NO_MORE_COMMENTS") {
            $buttonShowMoreComments.hide();
            $messageNoMoreComments.show();
            $messageLoadingComments.hide();
        }
    },

    getCurrentUserInfo: function () {
        return {
            name: bizagi.currentUser.userName,
            id: bizagi.currentUser.idUser,
            picture: ""
        };
    },

    /*Functions about tags*/

    addGlobalTags: function (tagsDiscussion, createTagsOnServer) {
        var self = this;

        for (var iTagAdd = 0; iTagAdd < tagsDiscussion.length; iTagAdd += 1) {
            var existTag = self.globalTags.filter(function (tagGlobal) {
                return tagGlobal.tag === tagsDiscussion[iTagAdd].tag;
            });
            if (existTag.length === 0) {
                tagsDiscussion[iTagAdd].globalParent = self.radNumber;
                self.globalTags.push(tagsDiscussion[iTagAdd]);
                if (createTagsOnServer) {
                    self.dataService.postTag(tagsDiscussion[iTagAdd]);
                }
            }
        }

        //Sync tags
        self.plugins.tagsFilter.dataSource.data(self.globalTags);
        self.plugins.tagsMultiSelect.dataSource.data(self.globalTags);
    },

    removeGlobalTags: function (guidTagsToDelete) {
        var self = this;
        var allGuidsTagsAllDiscussions = $.map(self.listDataDiscussion, function (discussion) {
            return $.map(discussion.tags, function (itemTag) {
                return itemTag.guid;
            });
        });

        var allGuidsMoreGuidsDelete = allGuidsTagsAllDiscussions.concat(guidTagsToDelete);

        var secureGuidsForDelete = [];
        guidTagsToDelete.forEach(function (guidDelete) {
            var existGuidOnlyTimeThenDelete = allGuidsMoreGuidsDelete.filter(function (guid) {
                return guid === guidDelete;
            });
            if (existGuidOnlyTimeThenDelete.length === 1) {
                secureGuidsForDelete.push(guidDelete);
            }
        });


        secureGuidsForDelete.forEach(function (guidSecureDelete) {
            //delete with service
            var params = {idTag: guidSecureDelete};
            self.dataService.deleteTag(params);

            //delete globalTags
            for (var iTagGlobal = self.globalTags.length - 1; iTagGlobal >= 0; iTagGlobal -= 1) {
                if (self.globalTags[iTagGlobal].guid === guidSecureDelete) {
                    self.globalTags.splice(iTagGlobal, 1);
                }
            }
        });

        //Sync tags
        self.plugins.tagsFilter.dataSource.data(self.globalTags);
        self.plugins.tagsMultiSelect.dataSource.data(self.globalTags);
    },

    setClassesTagsByDiscussion: function () {
        var self = this;
        for (var iDiscussion = 0; iDiscussion < self.listDataDiscussion.length; iDiscussion += 1) {
            var textTagsDiscussion = $.map(self.listDataDiscussion[iDiscussion].tags, function (itemTag) {
                return itemTag.guid;
            });
            var tagsBySpace = textTagsDiscussion.join(" ");

            $(".ui-bizagi-wp-project-discussions-item[data-guid='" + self.listDataDiscussion[iDiscussion].guid + "']", self.getContent()).addClass(tagsBySpace);
        }
    },

    updateTemplateListDiscussion: function () {

        var self = this;
        var $contentWidget = self.getContent();
        var templateListDiscussions = self.getTemplate("project-discussions-list");
        var user = self.getCurrentUserInfo();
        var contentRenderListDiscussions = templateListDiscussions.render({
            listDataDiscussions: self.listDataDiscussion,
            user: user,
            isOpen: !bizagi.util.parseBoolean(self.params.isClosedForAllUsers),
            returnServedCommentByParentId: function (parentId) {
                return self.returnServedCommentByParentId(parentId);
            }
        });

        $("#ui-bizagi-wp-project-discussions-list-wrapper", $contentWidget).empty().append(contentRenderListDiscussions);

        self.plugins.attchComments = self.applyFileAttachments("COMMENTS");
    },

    showFormAddDiscussion: function (resourceTitlePopup) {
        var self = this;

        if (self.plugins.attchComments) {
            self.plugins.attchComments.close();
        }
        self.dialogBoxDiscussion.formContent.dialog({
            resizable: false,
            draggable: false,
            height: "auto",
            width: "650px",
            modal: true,
            zIndex: 1,
            title: bizagi.localization.getResource(resourceTitlePopup),
            maximize: true,
            open:  $.proxy(self.onOpenPopupDiscussion, self),
            close: function () {
                self.resetDiscussionAttachments();
                self.onClosePopupDiscussion();
            }
        });
    },

    resetFormDiscussion: function () {
        var self = this;

        self.form.buttonAddDiscussion.prop("disabled", false);
        self.form.subject.val("");
        self.form.description.val("");

        var $subjectDiscussion = $("#ui-bizagi-wp-project-discussions-popup-subject-input", self.dialogBoxDiscussion.formContent);
        var $descriptionDiscussion = $("#ui-bizagi-wp-project-discussions-popup-description-textarea", self.dialogBoxDiscussion.formContent);
        $subjectDiscussion.parent().find("span").empty();
        $descriptionDiscussion.parent().next().find("span").empty();
    },

    renderUserProfile: function(){
        var self = this;

        var userPicture = $.grep(self.userPictures, function (userPicture) {
            return userPicture.id === bizagi.currentUser.idUser;
        })[0];

        var base64Prefix = "data:image/png;base64,";
        var $parent = $(".ui-bizagi-wp-project-popupform-user");
        var $img = $parent.find(".bz-wp-avatar-img");
        var $text = $parent.find(".bz-wp-avatar-label");

        if (userPicture) {
            if (userPicture.picture) {
                $img.attr("src", base64Prefix + userPicture.picture);
            } else {
                $img.hide();
                $text.html(userPicture.name.getInitials()).show();
            }
        }  
    },

    renderUserProfilesAndImages: function () {
        var self = this;

        var userPicture = $.grep(self.userPictures, function (userPicture) {
            return userPicture.id === bizagi.currentUser.idUser;
        })[0];

        var base64Prefix = "data:image/png;base64,";

        if (userPicture) {
            $(".ui-bizagi-wp-project-discussions-create-comment .bz-wp-discussion-username").html(userPicture.name);
            if (userPicture.picture) {
                $(".ui-bizagi-wp-project-discussions-item-user img").attr("src", base64Prefix + userPicture.picture);
                $(".ui-bizagi-wp-project-popupform-image-current-user").attr("src", base64Prefix + userPicture.picture);
            } else {
                $(".ui-bizagi-wp-project-discussions-item-user label.bz-wp-avatar-label").html(userPicture.name.getInitials()).show();
                $(".ui-bizagi-wp-project-discussions-item-user img").hide();
            }
        }

        for (var iUser = 0; iUser < self.userPictures.length; iUser++) {
            $("div[data-iduser='" + self.userPictures[iUser].id + "'] .bz-wp-discussion-username").html(self.userPictures[iUser].name);
            if (self.userPictures[iUser].picture) {
                $("div[data-iduser='" + self.userPictures[iUser].id + "'] .bz-wp-avatar-img").attr("src", base64Prefix + self.userPictures[iUser].picture);
            } else {
                $("div[data-iduser='" + self.userPictures[iUser].id + "'] .bz-wp-avatar-img").hide();
                $("div[data-iduser='" + self.userPictures[iUser].id + "'] label.bz-wp-avatar-label").html(self.userPictures[iUser].name.getInitials());
            }
        }
    },

    /*EVENTS*/
    switchCommentsEvents: function (event) {

        var self = this;
        var $target = $(event.target);
        var $parent = $target.parent();

        if ($target.is("textarea")) {
            self.onShowButtonsPanel($target);
        } else if ($target.hasClass("ui-bizagi-wp-project-discussions-comment-buttons-cancel")) {

            self.onCancelComment($target);
        } else if ($target.hasClass("ui-bizagi-wp-project-discussions-comment-buttons-share")) {

            var $container = $target.closest(".ui-bizagi-wp-project-discussions-add-comment");
            if (self.validateAddCommentForm($container)) {
                var guid = Math.guid();
                self.onCreateComment($target, guid);
            }
        } else if ($target.hasClass("ui-bizagi-wp-project-discussions-comment-view")) {
            self.onViewComment($target);
        } else if ($target.hasClass("ui-bizagi-wp-project-discussion-showmore-comments-button")) {
            self.onViewMoreComments($target);
        } else if ($target.hasClass("bz-bizagi-wp-project-discussions-attachment-delete")) {
            self.onRemoveFiles($target);
        } else if ($parent.hasClass("biz-wp-user-icon-admin") && $parent.hasClass("biz-wp-action-edit-discussion")) {
            self.onEditDiscussion($target);
        } else if ($parent.hasClass("ui-bizagi-wp-project-discussion-delete")) {

            $.when(bizagi.showConfirmationBox(bizagi.localization.getResource("workportal-project-discussion-querydelete"), "", "info")).done(function () {
                self.onDeleteComment($parent);
            });

        } else if ($parent.hasClass("bz-bizagi-wp-project-discussions-attachment-itemwrapper")) {
            self.onDownloadAttachment($target.closest("li"));
        }

        event.stopPropagation();
    },

    onEditDiscussion: function ($target) {

        var self = this;
        var $discussionCnt = $target.closest(".ui-bizagi-wp-project-discussions-item");
        var guid = $discussionCnt.data("guid");

        self.setDiscussionsDataByGUID(guid);
        self.showFormAddDiscussion("workportal-project-discussion-edit");
    },

    setDiscussionsDataByGUID: function (guid) {

        var self = this;

        var discussion = self.getDiscussionDataByGUID(guid);
        var $container = $(".ui-bizagi-wp-project-attachments-list", self.form.attachments);

        self.form.edition = {
            guid: guid
        };

        self.attchDiscussions = {
            addition: discussion.attachments,
            remove: []
        };

        self.form.title.text(bizagi.localization.getResource("workportal-project-discussion-edit"));
        self.form.subject.val(discussion.name);
        self.form.description.val(discussion.description);

        var guidTagsDiscussion = $.map(discussion.tags, function (itemTag) {
            return itemTag.guid;
        });
        self.plugins.tagsMultiSelect.value(guidTagsDiscussion);
        self.tempTagsBeforeDelete = [];
        self.tempTagsBeforeDelete = self.tempTagsBeforeDelete.concat(self.plugins.tagsMultiSelect.value());

        self.renderAttachments(discussion.attachments, "DISCUSSIONS", $container);

    },

    getDiscussionDataByGUID: function (guid) {

        var self = this;
        var discussion;

        for (var i = self.listDataDiscussion.length - 1; i >= 0; i--) {
            if (self.listDataDiscussion[i].guid === guid) {
                discussion = self.listDataDiscussion[i];
                i = 0;
            }
        }

        return discussion;
    },

    onViewComment: function ($target) {
        var $commentWrapper = $target.closest(".ui-bizagi-wp-project-discussions-comment-truncatewrapper");
        $commentWrapper.toggleClass("ui-bizagi-wp-project-discussions-comment-shortcomment");
        $commentWrapper.toggleClass("ui-bizagi-wp-project-discussions-comment-longcomment");
    },

    onViewMoreComments: function ($target) {
        var self = this;
        var $commentWrapper = $target.closest(".ui-bizagi-wp-project-discussion-showmore-comments");
        var $commentsContainer = $commentWrapper.siblings(".ui-bizagi-wp-project-discussion-comment-list");
        var idParent = $commentsContainer.closest(".ui-bizagi-wp-project-discussions-container-description-and-comments").data("guid");

        if (!self.commentsList[idParent].total) {
            //only one time call service if total is null
            self.dataService.getCommentsCountByParent(idParent).done(function (response) {
                self.commentsList[idParent].total = response.count;
                self.getMoreComments(idParent, $commentsContainer);
            });
        }
        else {
            self.getMoreComments(idParent, $commentsContainer);
        }
    },

    getMoreComments: function (idParent, $commentsContainer) {
        var self = this;

        //validate total comments vs count comments
        if (self.commentsList[idParent].total > self.commentsList[idParent].comments.length) {

            self.setStateUIShowMoreComments($commentsContainer, "LOADING_MORE_COMMENTS");

            var dateLastComment;
            if (self.commentsList[idParent].comments.length === 0) {
                dateLastComment = self.getDateServer();
            }
            else {
                dateLastComment = self.commentsList[idParent].comments[self.commentsList[idParent].comments.length - 1].date;
            }

            //substract one millisecond
            dateLastComment -= 1;

            self.dataService.getCommentsData(
                {
                    dateTime: dateLastComment,
                    idParent: idParent,
                    count: 6
                }
            ).done(function (responseMoreComments) {

                    if (responseMoreComments.length) {
                        Array.prototype.push.apply(self.commentsList[idParent].comments, responseMoreComments);
                        self.commentsList[idParent].count += responseMoreComments.length;

                        self.renderCommentByDiscussion($commentsContainer, idParent, responseMoreComments);
                        self.renderUserProfilesAndImages();

                        if (responseMoreComments.length > 5) {
                            self.setStateUIShowMoreComments($commentsContainer, "ALLOW_MORE_COMMENTS");
                        } else {
                            self.setStateUIShowMoreComments($commentsContainer, "NO_MORE_COMMENTS");
                        }

                        //Get profiles of idUsers not download in this moment
                        var idUsersLoaded = $.map(self.userPictures, function (element) {
                            return element.id;
                        });

                        var idUsersNewComments = $.map(self.commentsList, function (property) {
                            return $.map(property.comments, function (property) {
                                return property.user;
                            });
                        });

                        var arrayIdUsersMissingLoad = $(idUsersNewComments).not(idUsersLoaded).get();
                        var csvIdUsersMissingLoad = arrayIdUsersMissingLoad.join(",");

                        self.getDataUsers(csvIdUsersMissingLoad).then(function () {
                            self.renderUserProfilesAndImages();
                        });

                    }
                    else {
                        self.setStateUIShowMoreComments($commentsContainer, "NO_MORE_COMMENTS");
                    }
                }).fail(function () {
                    self.setStateUIShowMoreComments($commentsContainer, "ALLOW_MORE_COMMENTS");
                });
        }
        else {
            self.setStateUIShowMoreComments($commentsContainer, "NO_MORE_COMMENTS");
        }

    },

    renderCommentByDiscussion: function ($container, guidParent, moreComments) {

        var self = this,
            tmplComment = self.getTemplate("project-discussions-comments"),
            $commentsDOM,
            renderObject = {
                comments: [],
                user: self.getCurrentUserInfo(),
                isOpen: !bizagi.util.parseBoolean(self.params.isClosedForAllUsers)
            };

        if (!moreComments.length) {
            renderObject.comments = self.commentsList[guidParent].comments;
            $commentsDOM = tmplComment.render(renderObject);
            $container.html($commentsDOM);
        } else {
            renderObject.comments = moreComments;
            $commentsDOM = tmplComment.render(renderObject);
            $container.append($commentsDOM);
        }
    },

    getCommentByGuid: function (parentGuid, commentGuid) {

        var self = this;
        var commentsList = self.commentsList[parentGuid].comments;

        for (var i = 0, length = commentsList.length; i < length; i++) {

            if (commentsList[i].guid === commentGuid) {
                var attachments = [];

                for (var x = 0, lengthx = commentsList[i].attachments.length; x < lengthx; x++) {
                    attachments.push(commentsList[i].attachments[x].guid);
                }

                return {
                    attachments: attachments,
                    index: i
                };
            }
        }

        return {};
    },

    returnServedCommentByParentId: function (parentId) {
        var self = this;

        if (typeof self.commentsList[parentId] !== "undefined") {
            return self.commentsList[parentId];
        }
    },

    /*
     *   Events
     */
    onShowButtonsPanel: function ($target) {
        var $buttonsWrp = $target.closest(".ui-bizagi-wp-project-discussions-add-comment").find(".ui-bizagi-wp-project-discussions-comment-buttons-wrapper");
        $buttonsWrp.show();
    },

    onRemoveFiles: function ($target) {
        var self = this;
        var $container = $target.closest("li"),
            type = $container.closest(".ui-bizagi-wp-project-attachments-list").data("type"),
            fileGuid = $container.data("fileguid");
        var currentFiles, removeFiles, tmpSplice;

        if (type === "COMMENT") {
            var guid = $container.closest(".ui-bizagi-wp-project-discussions-add-comment").data("guid");
            currentFiles = self.attchComments[guid].addition;
            removeFiles = self.attchComments[guid].remove;

        } else {
            currentFiles = self.attchDiscussions.addition;
            removeFiles = self.attchDiscussions.remove;
        }

        for (var i = 0, length = currentFiles.length - 1; i <= length; i++) {

            if (currentFiles[i].guid === fileGuid) {
                tmpSplice = currentFiles.splice(i, 1);
                removeFiles.push(tmpSplice[0].guid);
                i = length;
            }
        }

        $container.remove();
    },

    onDeleteComment: function ($target) {
        var self = this;
        var $commentWrapper = $target.closest(".ui-bizagi-wp-project-discussions-item-comment");
        var commentGuid = $commentWrapper.data("cmmtguid");
        var parentGuid = $commentWrapper.closest(".ui-bizagi-wp-project-discussions-container-description-and-comments").data("guid");
        var comment = self.getCommentByGuid(parentGuid, commentGuid);

        var params = {
            content: {
                guid: commentGuid
            },
            attachmentsToDelete: comment.attachments
        };

        $.when(self.dataService.deleteComment(params)).always(function (response) {
            if (response.status === 200 || typeof (response.status) === "undefined") {
                self.commentsList[parentGuid].comments.splice(comment.index, 1);
                $commentWrapper.remove();
            } else {
                self.notifier.showErrorMessage(
                    printf(bizagi.localization.getResource("workportal-project-discussion-errordelete"), ""));
            }
        });
    },

    onSuccessFile: function (event, type) {
        var self = this;
        var files = event.files;
        var status = (event.XMLHttpRequest.response) ? JSON.parse(event.XMLHttpRequest.response) : {};

        if (!status.error) {
            var $wrapper = $(event.sender.element).closest(".ui-bizagi-wp-project-discussion-textwrapper");
            var $container = $wrapper.find(".ui-bizagi-wp-project-attachments-list");

            if (type === "DISCUSSIONS") {
                self.plugins.attchDiscussions.setStatus("SUCCESS", files[0].guid);
                Array.prototype.push.apply(self.attchDiscussions.addition, files);
            } else {
                self.plugins.attchComments.setStatus("SUCCESS", files[0].guid);
                var guid = $wrapper.data("guid");

                if (self.attchComments[guid]) {
                    Array.prototype.push.apply(self.attchComments[guid].addition, files);
                } else {
                    self.attchComments[guid] = {
                        addition: files,
                        remove: []
                    };
                }

                self.onShowButtonsPanel($container.parent());
            }

            self.renderAttachments(files, type, $container);
        } else {

            if (type === "DISCUSSIONS") {
                self.plugins.attchDiscussions.onErrorFile(event);
            } else {
                self.plugins.attchComments.onErrorFile(event);
            }
        }
    },

    onDownloadAttachment: function ($liTarget) {
        var self = this;
        var guidAttachment = $liTarget.data("fileguid");

        if (guidAttachment !== "") {
            var nameFile = $liTarget.find(".bz-bizagi-wp-project-discussions-attachment-filename").text();
            self.dataService.getDownloadAttachment(guidAttachment, nameFile);
        }
    },

    onCancelComment: function ($target) {
        var self = this;
        var $commentContainer = $target.closest(".ui-bizagi-wp-project-discussions-add-comment");
        var $buttonsWrp = $commentContainer.find(".ui-bizagi-wp-project-discussions-comment-buttons-wrapper");
        var $textarea = $commentContainer.find("textarea");
        var $uploadForm = $commentContainer.find(".ui-bizagi-wp-project-discussions-add-attachments form");
        var $vlTooltip = $commentContainer.find(".k-tooltip-validation");
        var $fileList = $commentContainer.find(".ui-bizagi-wp-project-attachments-list");
        var guid = $commentContainer.data("guid");

        self.attchComments[guid] = {
            addition: [],
            remove: []
        };

        self.plugins.attchComments.cancelFilesUpload();

        $uploadForm[0].reset();
        $fileList.empty();
        $textarea.val("");
        $vlTooltip.hide();
        $buttonsWrp.hide();
    },

    onCreateComment: function ($target, guid) {
        var self = this;
        var $rplWrp = $target.closest(".ui-bizagi-wp-project-discussions-item-comment");
        var $buttonsWrp = $target.closest(".ui-bizagi-wp-project-discussions-comment-buttons-wrapper");
        var $addCommentContainer = $target.closest(".ui-bizagi-wp-project-discussions-add-comment");
        var $textarea = $addCommentContainer.find("textarea");
        var $uploadList = $addCommentContainer.find(".ui-bizagi-wp-project-attachments-list");
        var idParent = $addCommentContainer.data("guid");
        var filesObj = self.prepareFilesToSave("COMMENTS", idParent);

        var params = {
            content: {
                guid: guid,
                attachments: filesObj.attachments,
                text: $textarea.val(),
                parent: idParent,
                date: self.getDateServer(),
                user: bizagi.currentUser.idUser
            },
            attachmentsToCreate: filesObj.attachmentsToCreate,
            attachmentsToDelete: filesObj.attachmentsToDelete
        };

        $.when(self.dataService.postComment(params)).always(function (response) {
            if (response.status === 200 || response.status === 201 || response.status === undefined) {
                var $commentContainer = $rplWrp.siblings(".ui-bizagi-wp-project-discussion-comment-list");
                var newComment = {
                    user: params.content.user,
                    attachments: params.content.attachments,
                    text: params.content.text,
                    guid: params.content.guid,
                    parent: params.content.parent,
                    date: params.content.date
                };

                //reset for a new comment
                self.attchComments[params.content.parent] = {
                    addition: [],
                    remove: []
                };

                $textarea.val("");
                $uploadList.empty();
                $buttonsWrp.hide();

                //Add new comment to the list
                self.commentsList[newComment.parent].comments.unshift(newComment);
                self.renderCommentByDiscussion($commentContainer, newComment.parent, []);

                self.plugins.attchComments.close();
                self.renderUserProfilesAndImages();
            }
        });
    },

    renderAttachments: function (files, type, $container) {
        var self = this;
        var attachTemplate = self.getTemplate("project-discussions-attachments");

        var $fileList = attachTemplate.render({attachments: files, type: type});
        $container.append($fileList);
    },

    prepareFilesToSave: function (type, guid) {

        var self = this;
        var files = [],
            fileList = (type === "COMMENTS") ? self.attchComments[guid] : self.attchDiscussions,
            attachmentsToCreate = [];

        fileList = fileList || {addition: [], remove: []};

        for (var i = 0, length = fileList.addition.length - 1; i <= length; i++) {
            files.push({
                guid: fileList.addition[i].guid,
                name: fileList.addition[i].name
            });

            attachmentsToCreate.push(fileList.addition[i].guid);
        }

        return {
            attachments: files,
            attachmentsToCreate: attachmentsToCreate,
            attachmentsToDelete: fileList.remove
        };
    },

    onClickCancel: function (event) {
        event.preventDefault();
        var self = this;

        self.resetDiscussionAttachments();
        self.onClosePopupDiscussion();

        self.plugins.attchDiscussions.cancelFilesUpload();
    },

    onClosePopupDiscussion: function () {
        var self = this;
        self.resetFormDiscussion();
        self.plugins.attchDiscussions.destroy();
        self.dialogBoxDiscussion.formContent.dialog("destroy");
        self.dialogBoxDiscussion.formContent.detach();
    },

    onOpenPopupDiscussion: function () {
        var self = this;

        self.plugins.attchDiscussions = self.applyFileAttachments("DISCUSSIONS");

        //popup
        self.dialogBoxDiscussion.formContent.parent().css("z-index",10001);
        //overlay
        self.dialogBoxDiscussion.formContent.parent().parent().find(".ui-widget-overlay").css("z-index",10001);

        setTimeout(function () {
            self.form.subject.focus();
        }, 50);
    },

    onSubmitFormDiscussion: function (event) {
        event.preventDefault();

        var self = this;
        var guid;
        if (self.validateAddDiscussionForm(self.dialogBoxDiscussion.formContent)) {
            if (self.form.edition.guid) {
                guid = self.form.edition.guid;
                $.proxy(self.sendDataUpdateDiscussion(guid), self);
            } else {
                guid = Math.guid();
                $.proxy(self.sendDataInsertDiscussion(guid), self);
            }
        }
    },

    restrictedEventsHandler: function () {
        var self = this;
        var $contentWidget = self.getContent();

        $("#ui-bizagi-wp-project-discussions-list-wrapper", $contentWidget).on("click",".bz-bizagi-wp-project-discussions-attachment-itemwrapper", $.proxy(self.switchCommentsEvents, self));
    },

    eventsHandler: function () {
        var self = this;
        var $contentWidget = self.getContent();

        //Add events
        self.form.buttonShowFormNewDiscussion.on("click", $.proxy(self.onNotifyOpenPopup, self));
        self.form.buttonCancel.on("click", $.proxy(self.onClickCancel, self));
        self.form.buttonAddDiscussion.on("click", $.proxy(self.onSubmitFormDiscussion, self));
        self.form.attachments.on("click", ".bz-bizagi-wp-project-discussions-attachment-delete, .bz-bizagi-wp-project-discussions-attachment-itemwrapper", function (event) {

            if ($(event.target).hasClass("bz-bizagi-wp-project-discussions-attachment-delete")) {
                self.onRemoveFiles($(event.target));
            } else {
                self.onDownloadAttachment($(event.target).closest("li"));
            }

            event.stopPropagation();
        });

        $("#ui-bizagi-wp-project-discussions-list-wrapper", $contentWidget).on("click", ".ui-bizagi-wp-project-discussions-add-comment textarea" +
            ", .ui-bizagi-wp-project-discussions-comment-buttons-cancel" +
            ", .ui-bizagi-wp-project-discussions-comment-buttons-share" +
            ", .ui-bizagi-wp-project-discussion-showmore-comments button" +
            ", .bz-bizagi-wp-project-discussions-attachment-delete" +
            ", .ui-bizagi-wp-project-discussion-delete" +
            ", .bz-bizagi-wp-project-discussions-attachment-itemwrapper" +
            ", .ui-bizagi-wp-project-discussions-comment-view" +
            ", .ui-bizagi-wp-project-discussions-items-edition" +
            ", .biz-wp-action-edit-discussion", $.proxy(self.switchCommentsEvents, self));

        self.sub("changeProjectWidget", function () {
            self.resetWidget();
        });
        self.sub("OPEN_POPUP_DISCUSSION", $.proxy(self.onNotifyOpenPopup, self));
    },

    resetWidget: function () {
        var self = this;
        self.userPictures = [];
        if (self.plugins.attchComments) {
            self.plugins.attchComments.close();
        }
    },

    clean: function () {

        var self = this;
        self.resetWidget();

        if(self.form && self.form.buttonShowFormNewDiscussion){
            self.form.buttonShowFormNewDiscussion.off("click", $.proxy(self.onNotifyOpenPopup, self));
        }


        for (var i in self.plugins) {
            if (self.plugins[i] && self.plugins[i].hasOwnProperty("destroy")) {
                if (self.plugins[i].destroy) {
                    self.plugins[i].destroy();
                }
            }
        }
    }
});

bizagi.injector.register("bizagi.workportal.widgets.project.discussions", ["workportalFacade", "dataService", "notifier", bizagi.workportal.widgets.project.discussions], true);