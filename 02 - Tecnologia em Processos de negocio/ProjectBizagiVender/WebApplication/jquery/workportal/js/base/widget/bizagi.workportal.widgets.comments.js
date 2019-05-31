/**
 * @name: Bizagi workportal comments
 * @description: This file define functionality of comments into the render
 * @author: Edward J Morales
 */


bizagi.workportal.comments = {
    /**
     * Make functionality to comments tab in case summary
     */
    renderComments: function(data) {
        var self = this;
        var cache = {};
        var htmlContent = "";
        var def = new $.Deferred();
        var _Comments = {};
        var _getRenderCommentList = -1;
        var _currentUser = bizagi.currentUser.idUser;
        var commentsCanvas = data.canvas;
        var readOnly = data.readOnly || false;

        self.setStorage('bufferLocalNewComments_' + data.caseNumber, 0);
        self.setStorage('idCase', data.caseNumber);

        // Templates definition
        self.comments = self.workportalFacade.getTemplate("comments");
        self.commentsList = self.workportalFacade.getTemplate("comments-list");
        self.commentsReplies = self.workportalFacade.getTemplate("comments-replies");
        self.commentsDropdown = self.workportalFacade.getTemplate("comments-dropdown");
        self.commentsConfirm = self.workportalFacade.getTemplate("comments-confirm");

        data.showComments = true;

        var getCommentSync = function(commentsToSync) {
            _Comments = commentsToSync.comments;
            self.setStorage('maxIdComment_' + data.caseNumber, commentsToSync.maxIdComment);
            self.setStorage('bufferLocalNewComments_' + data.caseNumber, 0);
        }


        $.when(
                self.getComments({
            idCase: data.caseNumber
        }, getCommentSync))
                .done(function(comments) {
            var users = comments.users || [];
            var getCategoryColor = function(category) {
                var color = "";
                switch (category) {
                    case 0:
                        color = "orange";
                        break;
                    case 1:
                        color = "red";
                        break;
                    case 2:
                        color = "yellow";
                        break;
                    case 3:
                        color = "blue";
                        break;
                    case 4:
                        color = "purple";
                        break;
                    case 5:
                        color = "green";
                        break;
                    default:
                        color = "disable";
                        break;
                }
                return color;
            };

            var showReplies = function(ul) {
                $(ul).children('li:not(:last)').slideDown('fast');
            };

            // This function hide all replies except the last
            var hideReplies = function(ul) {
                $(ul).children('li:not(:last)').slideUp('fast');
                $("span.reply-toggler > span", ul.parent()).removeClass("expanded");
            };

            // Show or hide toggle button
            var replyToggle = function(li) {
                var replies = $(".reply-list li", li) || [];
                var button = $(".reply-toggler", li);
                if (replies.length > 1) {
                    button.removeClass('hidden');
                } else {
                    button.addClass('hidden');
                }
            };

            // Calculate time ago
            var timeAgo = function(commentTime) {
                return $.timeago(new Date(commentTime));
            };

            // Get base64 user image
            var getUserPicture = function(idUser) {
                var image = "";
                $.each(users, function(key, value) {
                    if (users[key]['Id'] == idUser) {
                        image = value.Picture;
                    }
                });
                return image;
            };

            var getUserName = function(idUser) {
                var name = "";
                $.each(users, function(key, value) {
                    if (users[key]['Id'] == idUser) {
                        name = value.DisplayName;
                    }
                });
                return name;
            };

            // Reset replies flags
            var resetRepliesFlags = function() {
                $(".comments-text-box").removeClass('comments-reply-box');
                $(".comments-text-box li:first-child").data('reply-mode', '');
                $(".comments-text-box li:first-child").data('id', '');
            };

            var countReplies = function(comments) {
                var countReplies = 0;
                $.each(comments.comments, function(key, value) {
                    countReplies += value.Replies.length;
                });
            };

            var renderCommentsPanel = function(comments, usr) {
                _Comments.totalRecords = comments.totalRecords;
                users = usr;

                return $.tmpl(self.comments, {
                    comments: comments.comments,
                    readOnly: readOnly,
                    User: users,
                    idCase: data.caseNumber,

                    CurrentUser: _currentUser,
                    RelatedElementId: null,
                    getCategoryColor: getCategoryColor,
                    replaceTextToSmiles: self.replaceTextToSmiles,
                    timeAgo: timeAgo,
                    getUserPicture: getUserPicture,
                    getUserName: getUserName,
                    getCategoryName: function(name) {
                        return self.resources.getResource("workportal-widget-comments-" + name);
                    }
                });
            };

            var getRenderCommentList = function(data, usr) {
                _Comments.totalRecords = comments.totalRecords;
                users = usr;

                // Render Pagination
                setPagination({
                    totalPages: data.totalPages,
                    actualPage: data.actualPage
                });

                return $.tmpl(self.commentsList, {
                    comments: data.comments,
                    User: users,
                    CurrentUser: _currentUser,
                    RelatedElementId: null,
                    getCategoryColor: getCategoryColor,
                    replaceTextToSmiles: self.replaceTextToSmiles,
                    timeAgo: timeAgo,
                    getUserPicture: getUserPicture,
                    getUserName: getUserName,
                    readOnly: readOnly
                });
            };

            var renderCommentsReplies = function(data, usr) {
                _Comments.totalRecords = comments.totalRecords;
                users = usr;

                return $.tmpl(self.commentsReplies, {
                    Replies: data.Replies,
                    User: users,
                    CurrentUser: _currentUser,
                    RelatedElementId: null,
                    getCategoryColor: getCategoryColor,
                    replaceTextToSmiles: self.replaceTextToSmiles,
                    timeAgo: timeAgo,
                    getUserPicture: getUserPicture,
                    getUserName: getUserName,
                    readOnly: readOnly
                });
            };

            var renderDropDownMenu = function(options) {
                return $.tmpl(self.commentsDropdown, {
                    categories: options.categories,
                    css: options.css,
                    idComment: options.idComment,
                    getCategoryColor: getCategoryColor,
                    readOnly: readOnly
                });
            };

            var setPagination = function(params, selector) {
                var totalPages = params.totalPages || 1;
                var hasPagination = (totalPages > 1) ? true : false;
                var nElemToShow = 5;
                var page = params.actualPage || 1;
                var pageSelector = $('.comments-pagination') || selector;
                var paginationData = {};
                paginationData.pagination = hasPagination;
                paginationData.totalPages = totalPages;
                paginationData.pages = [];
                paginationData.page = page;

                // Empty container of pagination
                pageSelector.empty();

                if (hasPagination) {
                    pageSelector.show();
                } else {
                    pageSelector.hide();
                }

                var pageToshow = (nElemToShow > totalPages) ? totalPages : nElemToShow;
                for (var i = 1; i <= pageToshow; i++) {
                    paginationData.pages.push({
                        "pageNumber": i
                    });
                }

                var paginationHtml = $.tmpl(self.paginationTemplate, paginationData).html();
                $(pageSelector).append(paginationHtml);

                // Crate pagination control 
                $("ul").bizagiPagination({
                    totalPages: paginationData.totalPages,
                    actualPage: paginationData.page,
                    listElement: $("ul", pageSelector),
                    clickCallBack: function(options) {
                        $.when(self.getComments({
                            idCase: data.caseNumber,
                            idColorCategory: _getRenderCommentList,
                            pag: options.page
                        }))
                                .done(function(comments) {
                            renderCommentList(comments, comments.users, true);
                        });
                    }
                });
            };

            var renderCommentList = function(comments, users) {
                _Comments.totalRecords = comments.totalRecords;
                // Empty list
                $("#comment-list").empty();

                htmlContent = getRenderCommentList(comments, users);

                htmlContent.appendTo($("#comment-list"));
                cache["subprocess"] = $("#comment-list");
                hideAllReplies();

                return htmlContent;
            };

            // Check new comments
            if (!readOnly) {
                bizagi.util.setInterval({
                    name: 'comments',
                    params: {
                        idCase: bizagi.context.idCase
                    },
                    singleton: true,
                    timeout: 30000,
                    killWhenExitContext: false,
                    context: '(bizagi.context.widget=="' + self.getWidgetName() + '" && bizagi.context.idCase == "' + data.caseNumber + '" && bizagi.context.commentsFocus)',
                    call: function(options) {
                        options = options || {};
                        var maxIdComment = self.getStorage('maxIdComment_' + options.idCase);

                        $.when(self.dataService.getNewComments({
                            idCase: options.idCase,
                            idLastComment: maxIdComment
                        }))
                                .done(function(numberOfNewComments) {
                            if (numberOfNewComments.newComments > 0 || numberOfNewComments.newReplies > 0) {
                                var totalNewComments = (numberOfNewComments.newComments + numberOfNewComments.newReplies);
                                var bufferLocalNewComments = self.getStorage('bufferLocalNewComments_' + options.idCase) || totalNewComments;
                                var newMessage = $(".comments-update").data('message').replace(/{totalNewComments}/, totalNewComments - bufferLocalNewComments);

                                // Check if total of new comments its equal to local added comments
                                if (totalNewComments > bufferLocalNewComments) {
                                    $(".comments-update").text(newMessage);
                                    $(".comments-update").show().click(function(e) {
                                        if (e.isPropagationStopped())
                                            return;
                                        e.stopPropagation();
                                        $('#filterClear').click();
                                    });
                                }
                            }
                        });
                    }
                });
            }

            htmlContent = renderCommentsPanel(comments, users);

            // Tooltip for category button
            $(".comment-frame .button-category", htmlContent).tooltip();

            // Remove all 'live' events
            $(htmlContent).find("*").off('click');

            // Refresh all comments 
            $('.button-refresh', htmlContent).click(function() {
                $('.comments-update').hide();
                // Get json and render again 
                $.when(
                        self.getComments({
                    idCase: data.caseNumber,

                    idColorCategory: _getRenderCommentList
                }, getCommentSync))
                        .done(function(comments) {
                    var users = comments.users || [];

                    // Empty list
                    $("#comment-list").empty();

                    htmlContent = renderCommentList(comments, users);

                    htmlContent.appendTo($("#comment-list"));
                    cache["subprocess"] = $("#comment-list");
                    hideAllReplies();
                });
            });

            // Show textarea to create a new comment
            $(".make-new-comments", htmlContent).click(function() {
                resetRepliesFlags();
                $(".comments-text-box li:first-child").slideDown('fast');
                $(".comment-box", htmlContent).focus().fadeIn()
                $(this).hide();
                $(".action-buttons").show().slideDown('fast');
                $(".text-to-reply").hide();
            });

            // Cancel new message
            $(".comment-box", htmlContent).blur(function() {
                var message = $(".comments-text-box textarea").val();

                if (message.length == 0) {
                    $(".comments-text-box textarea").val('');
                    $(".comments-text-box li:first-child").slideUp('fast');
                    $(".make-new-comments").fadeIn();
                    $(".action-buttons").hide();

                    resetRepliesFlags();
                }
            });

            // Send a new message
            $(".send-new-comments", htmlContent).click(function() {
                var message = $(".comments-text-box textarea").val();

                if (message.length == 0) {
                    return;
                }

                // Create new reply
                if ($(".comments-text-box li:first-child").data('reply-mode') == "true") {
                    var listId = $(".comments-text-box li:first-child").data('id');
                    var list = $("li[data-id='" + listId + "']");
                    $.when(self.dataService.makeNewReply({
                        idCase: data.caseNumber,

                        idComment: listId,
                        comment: message
                    })).done(function(dataNewComment) {
                        // Increment global control of local new messages
                        self.incrementStorage('bufferLocalNewComments_' + data.caseNumber, 1);

                        var newReply = renderCommentsReplies(dataNewComment, dataNewComment.users);

                        $(".reply-list", list).append(newReply);
                        $(".reply-list li:last", list).show('highlight', 'slow');

                        hideReplies($(".reply-list", list));
                        replyToggle($(list));
                    });
                } else {
                    // create new comment
                    $.when(self.dataService.makeNewComment({
                        idCase: data.caseNumber,

                        comment: message
                    })).done(function(dataNewComment) {
                        // Increment global control of local new messages
                        self.incrementStorage('bufferLocalNewComments_' + data.caseNumber, 1);

                        var newComment = getRenderCommentList(dataNewComment, dataNewComment.users);

                        $(".reply-toggler", newComment).addClass('hidden');
                        $("#comment-list").prepend(newComment);
                        $("#comment-list li:first").show('highlight', 'fast');

                    });
                }

                $(".comments-text-box li:first-child").slideUp('fast');
                $(".make-new-comments").show();
                $(".action-buttons").hide();
                $(".comments-text-box textarea").val('');
                $(".time-ago").timeago();

                resetRepliesFlags();
            });

            // Edit controls for categories
            var categoryEdit = function() {
                var self = $(this),
                        selfParent = self.parent(),
                        oldVal = selfParent.text().replace(/^\s+|\s+$/g, ''), // Trim, remove blank spaces
                        oldIcon = self.siblings('a').children('span').attr('class').split(' ')[1],
                        oldText = selfParent.html(),
                        editControls = '<input type="text" class="editBox" value="' + oldVal + '" /> <span class="filter-icon-ctrl btnSave"></span> <span class="filter-icon-ctrl btnDiscard"></span>';

                selfParent.attr('data-old-icon', oldIcon);
                selfParent.html(editControls).attr('data-old-text', oldText).addClass('no-pad');
                $('.editBox').select();
            };

            $(htmlContent).delegate('.editBox', 'keypress', function(e) {
                if (e.keyCode == 13) {
                    $(this).parent().find('.btnSave').click();
                }
            });

            // Save text of category changes
            $(htmlContent).delegate('.btnSave', 'click', function() {
                var selfParent = $(this).parent(),
                        oldIcon = selfParent.attr('data-old-icon'),
                        oldText = selfParent.attr('data-old-text'),
                        newText = $(this).siblings('.editBox').val(),
                        iconCategory = selfParent.html(oldText).find('a span.filter-icon'),
                        filterTextColor = $('#filterText').attr('class'),
                        filterTextDisable = $('#filterText').hasClass('disable');

                if (!(filterTextDisable) && oldIcon === filterTextColor) {
                    $('#filterText', htmlContent).text(newText);
                    $('.filter-dropdown').removeClass('is-visible').addClass('is-hidden');
                }

                selfParent.removeAttr('data-old-text').html(oldText).find('a').empty().append(iconCategory, newText).removeClass('no-pad');

                self.dataService.renameCommentCategory({
                    idColorCategory: selfParent.data("category-id"),
                    colorName: newText
                });
            });

            // Discard text of category changes
            $(htmlContent).delegate('.btnDiscard', 'click', function() {
                var selfParent = $(this).parent(),
                        selfParentLength = selfParent.length,
                        i = 0,
                        selfParentItem,
                        oldText;
                for (; i < selfParentLength; i++) {
                    selfParentItem = selfParent[i];
                    oldText = $(selfParentItem).attr('data-old-text');
                    $(selfParentItem).removeAttr('data-old-text').html(oldText).removeClass('no-pad');
                }
            });

            // Close the category dropdown
            function categoryClose() {
                $(".categories-dropdownmenu").empty();
                $(".categories-dropdownmenu").data('visible', false);
            }

            /**
             *  Show sub menu with colors categories 
             *  @param options {referer,position}
             */
            var showDropDownMenu = function(options) {
                var menu = $('.categories-dropdownmenu');
                var referer = options.referer || $();
                var css = options.css || '';
                var idComment = options.idComment || '';
                var position = options.position || {
                    "my": "right top",
                    "at": "right top",
                    "collision": "fit",
                    "of": referer.selector || referer
                };

                if (menu.data('name') != options.name) {
                    categoryClose();
                    menu.data('name', options.name || '');
                    showDropDownMenu(options);
                } else if (menu.data('visible')) {
                    categoryClose();
                } else {
                    $.when(self.dataService.getCommentsCategories())
                            .done(function(categories) {
                        menu.empty();
                        // Set position
                        menu.position(position);

                        renderDropDownMenu({
                            categories: categories.categories,
                            css: css,
                            idComment: idComment,
                            referer: referer
                        }).appendTo(menu);
                        // Set visibility
                        menu.data('visible', true);
                        menu.data('name', options.name || '');
                    });
                }
            };

            // Set events to button filter categories
            $("#buttonFilter", htmlContent).bind("click", function() {
                var self = this;
                var options = {
                    referer: $("#buttonFilter", htmlContent),
                    name: 'editCategories',
                    css: 'editCategories'
                }

                if (readOnly) {
                    options.position = {
                        "my": "left bottom",
                        "at": "left bottom",
                        "collision": "fit",
                        "of": self
                    };
                }
                showDropDownMenu(options);
            });


            var getIdCase = function() {
                return $('.comment-controls').data('idcase');
            };

            var setEventFilterCategory = function(e) {
                if (e.isPropagationStopped()) {
                    return;
                }
                var categoryId = $(this).parent().data('category-id');
                var name = $('.categories-dropdownmenu').data('name');
                var filterText = bizagi.util.trim($(this).text());

                if (name == 'setCategories') {
                    var idComment = $(this).data('idcomment');

                    $.when(self.dataService.setCommentCategory({
                        idCase: getIdCase,
                        idColorCategory: categoryId,
                        idComment: idComment
                    }))
                            .done(function() {
                        $("#" + idComment).removeClass();
                        $("#" + idComment).addClass("button-category");
                        $("#" + idComment).addClass(getCategoryColor(categoryId));
                        categoryClose();
                    });
                } else {
                    // Filter by category
                    $.when(self.dataService.getComments({
                        idCase: getIdCase,
                        idColorCategory: categoryId
                    }))
                            .done(function(data) {
                        var target = $(".comment-filter > #buttonFilter");
                        if (categoryId >= 0) {
                            // Set filter name
                            _getRenderCommentList = categoryId;
                            $('.button-refresh').data('category-id', categoryId);
                            $('#filterName').removeClass('is-hidden');
                            $("#filterText").text(filterText);
                        } else {
                            $('#filterName').addClass('is-hidden');
                            $("#filterText").text("");
                            _getRenderCommentList = -1;
                        }

                        $('#comment-list').empty();
                        $('#comment-list').append(getRenderCommentList(data, data.users));

                        // Set Color 
                        target.removeClass();
                        target.addClass('button-category ' + getCategoryColor(categoryId));
                        categoryClose();
                        // Set category to refresh bottom
                        $('.button-refresh').data('category-id', categoryId);
                        hideAllReplies();
                        $('.button-refresh').click();

                    });
                }
                e.stopPropagation();
            };

            var setEventFilterClear = function() {
                $('#filterClear').bind('click', function(e) {
                    if (e.isPropagationStopped()) {
                        return;
                    }
                    e.stopPropagation();
                    _getRenderCommentList = -1;
                    $(".comment-filter > #buttonFilter").removeClass();
                    $(".comment-filter > #buttonFilter").addClass('button-category ' + getCategoryColor());

                    // Set category to refresh bottom
                    $('.button-refresh').data('category-id', '');
                    $('#filterName').addClass('is-hidden');
                    $('#filterText').text('');
                    $('.button-refresh').click();
                });
            };


            $(htmlContent).delegate('.close', 'click', categoryClose);
            $(htmlContent).delegate('.btnEdit', 'click', categoryEdit);
            $(htmlContent).delegate('.filter-category', 'click', setEventFilterCategory);
            $(htmlContent).delegate('#filterClear', 'click', setEventFilterClear);

            // Define events to edit mode
            if (!readOnly) {
                $(htmlContent).on("click", ".button-category[data-own='true']", function(e) {
                    if (readOnly) {
                        return;
                    }
                    if (e.isPropagationStopped()) {
                        return;
                    }
                    e.stopPropagation();
                    var self = this;
                    showDropDownMenu({
                        referer: self,
                        name: 'setCategories',
                        css: 'setCategories',
                        idComment: $(self).data('id'),
                        position: {
                            "my": "right top",
                            "at": "left bottom",
                            "collision": "fit",
                            "of": self
                        }
                    });
                });

                $(htmlContent).on('click', ".button-reply", function(e) {
                    if (e.isPropagationStopped())
                        return;

                    var id = $(this).data("id");
                    var textForReply = $("li[data-id='" + id + "'] .comment-text").first().text();

                    // Set data to active reply functionality
                    $(".comments-text-box li:first-child").data('reply-mode', 'true');
                    $(".comments-text-box li:first-child").data('id', id);

                    // Set text to reply
                    $(".text-to-reply").text(textForReply);
                    $(".text-to-reply").show();

                    $(".comments-text-box textarea").focus();
                    $(".comments-text-box").addClass('comments-reply-box');
                    $(".comments-text-box li:first-child").show().slideDown('fast');
                    $(".make-new-comments").hide();
                    $(".action-buttons").show().slideDown('fast');
                    e.stopPropagation();
                });

                $(htmlContent).on("click", ".button-delete", function(e) {
                    //if (e.isPropagationStopped()) return;
                    //e.stopPropagation();
                    var li = $(this).parents('li:first');
                    var liId = $(this).data('id');
                    var parent = li.parent();

                    $.tmpl(self.commentsConfirm).dialog({
                        resizable: true,
                        modal: true,
                        title: self.getResource("workportal-widget-comments-title"),
                        buttons: [
                            {
                                text: self.getResource("workportal-widget-comments-delete"),
                                click: function() {
                                    // Call service
                                    // Check if its reply or comment
                                    if (parent.hasClass('reply-list')) {
                                        var idComment = li.parents('li:first').data('id');
                                        $.when(self.dataService.removeReply({
                                            idCase: getIdCase,
                                            idComment: idComment,
                                            idReply: liId
                                        }).done(function(state) {
                                            evalState(state);
                                        }));
                                    } else {
                                        $.when(self.dataService.removeComment({
                                            idCase: getIdCase,
                                            idComment: liId
                                        }).done(function(state) {
                                            evalState(state);
                                        }));
                                    }

                                    var evalState = function(state) {
                                        if (state.action) {
                                            $.when(li.hide('highlight', 'fast'))
                                                    .done(function() {
                                                li.remove();
                                                if (parent.hasClass('reply-list')) {
                                                    parent.find('li').hide();
                                                    parent.find('li:last').show();
                                                    replyToggle(parent.parents('li:first'));
                                                }
                                            });
                                        } else {
                                            alert(state.message);
                                        }
                                    };

                                    // Close dialog and menu
                                    $(this).dialog("close");
                                    bizagi.workportal.desktop.popup.closePopupInstance();
                                }
                            },
                            {
                                text: self.getResource("workportal-widget-comments-cancel"),
                                click: function() {
                                    $(this).dialog("close");
                                }
                            }
                        ]
                    });
                });
            }

            // Hide replies if it has more than one
            var hideAllReplies = function() {
                $.each($(".reply-list", htmlContent), function() {
                    var replyToggleBotton = $(".reply-toggler", $(this).parents("li:first"));
                    if ($("li", this).length > 1) {
                        $(this).children('li:not(:last)').hide();
                        replyToggleBotton.removeClass('hidden');
                    } else {
                        replyToggleBotton.addClass('hidden');
                    }
                });
            };

            // Show replies if it does been hidden
            $(htmlContent).on('click', ".reply-toggler", function(e) {
                if (e.isPropagationStopped())
                    return;
                e.stopPropagation();
                //Define show and hide actions
                if ($(this).data('toggle-action') != "hide") {
                    // Show list
                    showReplies($(this).parent().find("ul"));
                    $("span", this).addClass("expanded");
                    $(this).data('toggle-action', 'hide');
                } else {
                    // Show replies
                    hideReplies($(this).parent().find("ul"));
                    $("span", this).removeClass("expanded");
                    $(this).data('toggle-action', 'show');
                }
            });

            hideAllReplies();
            htmlContent.appendTo(commentsCanvas);

            setPagination({
                totalPages: comments.totalPages,
                actualPage: comments.actualPage
            }, $('.comments-pagination'));

            def.resolve(commentsCanvas);
        });

        return def.promise();
    },
    getComments: function(options, callBack) {
        var self = this;
        var def = new $.Deferred();
        options = options || {};
        callBack = callBack || function() {
        };
        $.when(self.dataService.getComments(options))
                .done(function(comments) {
            callBack(comments);
            def.resolve(comments);
        });
        return def.promise();
    },
    replaceTextToSmiles: function(message) {
        var parseMessage = message;
        var preParseMessage = "";
        var securityPatterns = {
            "<br>": "\n",
            "[<]": "&lt;",
            "[>]": "&gt;"
        };
        var patterns = {
            ":)": "smiley",
            ":!": "sarcastic",
            ":$": "embarrassed",
            ":(": "sad",
            ":'(": "cry",
            ";)": "wink",
            ":|": "disappointed",
            ":D": "happy",
            ":o": "surprise",
            ":p": "tongue",
            ":s": "confused",
            " Y ": "yes",
            " N ": "no"
        };

        // Check XSS injection
        while (preParseMessage != parseMessage) {
            $.each(securityPatterns, function(key, value) {
                var pattern = new RegExp(key, "gm");
                preParseMessage = parseMessage;
                parseMessage = parseMessage.replace(pattern, value, "gm");
            });
        }

        $.each(patterns, function(key, value) {
            var scapeKey = key.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
            var pattern = new RegExp(scapeKey);
            var label = "<div class='smiles " + value + "'></div>";
            parseMessage = parseMessage.replace(pattern, label, "g");
        });

        return parseMessage;
    },
    setStorage: function(key, value) {
        var result = "";
        key = key || "";

        if (sessionStorage) {
            result = sessionStorage.setItem(key, value);
        }
        return result;
    },
    incrementStorage: function(key, increment) {
        var result = true;
        var self = this;
        if (sessionStorage) {
            var newValue = parseInt(self.getStorage(key)) + parseInt(increment);
            self.setStorage(key, newValue);
        } else {
            result = false;
        }
        return result;
    },
    getStorage: function(key) {
        var result = undefined;
        key = key || "";

        if (sessionStorage) {
            result = sessionStorage.getItem(key);
        }
        return result;
    }
};