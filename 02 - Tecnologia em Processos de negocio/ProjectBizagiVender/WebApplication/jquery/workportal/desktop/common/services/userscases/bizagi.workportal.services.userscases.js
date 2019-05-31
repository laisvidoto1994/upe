bizagi.workportal.services.userscases = (function (dataService, loadTemplatesService) {
    var self = this;
    self.imgPrefix = 'data:image/png;base64,';
    self.defaultImg = self.imgPrefix + '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';

    /**
     * Load templetes for this service
     */
    loadTemplatesService.loadTemplates({
        'assignees': bizagi.getTemplate('bizagi.workportal.services.userscases').concat('#usersrelated-wrapper'),
        'assigneesTooltip': bizagi.getTemplate('bizagi.workportal.services.userscases').concat('#usersrelated-tooltip')
    });

    /**
     * Return the promise when data is resolve 
     * @return 
     */
    self.dataReady = function() {
        return self.promiseData;
    };

    /**
     *
     * @param idCases
     * @returns {*}
     */
    self.render = function (idCases) {
        self.cases = [];
        var promises = $.map(idCases, function (idCase) {
            return dataService.getUsersCases({ caseId: idCase}).done(function(data){
                var caseObj = {
                    idCase: idCase,
                    assignees: data.assignees,
                    createdBy: data.createdBy,
                    users: self.getUniqueUsers($.merge([data.createdBy], data.assignees)) //Obtiene instancias unicas del usuario para el caso
                };
                self.cases.push(caseObj);
            });
        });

        self.promiseData = $.when.apply($, promises).then(function () {
            return self.getAllUsers(self.cases);
        });

        return self.promiseData;
    };

    /**
     * Organize all data to processes for users info, images
     * @param cases
     * @return {Array}
     */
    self.getAllUsers = function (cases) {
        self.users = [];
        var ids = [];

        for (var i= 0, l = cases.length; i < l; i++) {
            var caseInfo = cases[i];
            for (var j = 0, k = caseInfo.users.length; j < k; j++) {
                var userInfo = caseInfo.users[j];
                
                var user = self.users.find(function (el) {
                    return el.idUser == userInfo.idUser;
                });

                //si no existe el usuario en el array se agrega
                if (!user) {
                    self.users.push(userInfo);
                    ids.push(userInfo.idUser);
                }
            }
        }

        //Carga informacion adicional del usuario --- incluida la imagen
        self.extendedUserInfo(ids);

        //Retornar todos los usuarios
        return self.users;
    };

    /**
     * Returns initials letters of name and last name of a User assigned
     * @param {string} name
     */
    self.getInitials = function(name){
        var names = name.split(' ');
        var firstInitial = (typeof(names[0]) !== 'undefined') ? names[0].charAt(0) : "";
        var secondInitial = (typeof(names[1]) !== 'undefined') ? names[1].charAt(0) : "";

        return (firstInitial + secondInitial).toUpperCase();
    };

    /**
     * Returns unique users of case
     * @param {object} usersObjet
     * @return {object} assignees
     */
    self.getUniqueUsers = function (usersObjet) {
        var assignees = [],
            usersId = [];

        $.each(usersObjet, function(index, value) {
            if ($.inArray(value.idUser, usersId) == -1) {
                assignees.push({
                    idUser: value.idUser,
                    name: value.name,
                    initials: self.getInitials(value.name),
                    owner: index <= 0,
                    isAssignee: index != 0
                });
                usersId.push(value.idUser);
            }
            else {
                assignees[0].isAssignee = (assignees[0].idUser == value.idUser);
            }
        });
        return assignees;
    };


    /**
     * Get images for users related
     * @param userIds
     */
    self.extendedUserInfo = function (userIds) {
        var data = {
            userIds: userIds.join(','),
            width: 30,
            height: 30,
            square: true
        };
        if(data.userIds !== ""){
            self.userInfoPromise = dataService.getUsersData(data).then(function (extendedUsers) {
                for (var i = 0, l = extendedUsers.length; i < l; i++) {
                    var user = self.users.find(function (e) {
                        return extendedUsers[i].id == e.idUser;
                    });

                    if (user) {
                        user.extendedInfo = extendedUsers[i];
                    }
                }
            });
        }

    };

    /**
    * Retun all images to users
    * @param {object} userId
    */
    self.getUser = function (userId) {
        return $.when(self.userInfoPromise).then(function () {
            return self.users.find(function (el) {
                return el.idUser == userId;
            });
        });
    };


    /**
     * Load the users assigned, show in the dialog box with image, name and roll
     * @return {*} promise
     * @param idCase
     */
    self.getAssignees = function (idCase) {
        var defer = new $.Deferred();

        $.when(self.dataReady()).done(function () {
            var caseInfo = self.cases.find(function (el) {
                return el.idCase == idCase;
            });
            var totalAssignees = caseInfo.users.length;
            var assignees = totalAssignees > 2 ? caseInfo.users.slice(0, 1) : caseInfo.users;
            var renderData = {
                defaultImg: self.defaultImg,
                assignees: assignees,
                idCase: idCase,
                totalAssignees: totalAssignees
            };
            var $assigneesTemplate = loadTemplatesService.getTemplate("assignees").render(renderData);

            self.displayUsersImages(assignees, $assigneesTemplate);
            $assigneesTemplate.on('mouseenter', '.usersrelated-container li', function (ev) {
                var $target = $(ev.target);
                var $caseContainer = $target.closest('.template-usersrelated-section');

                if ($(".usersrelated", $caseContainer).length) {
                    $(".usersrelated", $caseContainer).remove();
                }

                var tooltip = self.showTooltipUsersAssignees(ev);
                tooltip.position({
                    my: 'right top',
                    at: 'left bottom',
                    of: $target,
                    collision: 'flip'
                });
            });

            defer.resolve($assigneesTemplate);
        });
       
        return defer.promise();
    };


    /**
     * Returns the HTML tooltip with the users details
     * @param {event} ev
     * @return {object} $usersrelatedContainer
     */
    self.showTooltipUsersAssignees = function (ev) {
        var $target = $(ev.target);
        var $usersrelatedContainer = $target.closest('.template-usersrelated-section');
        var idCase = $target.closest('.usersrelated-container').data('idcase');
        var $owner = $target.closest('li').data('owner') || false;
        var assignees = self.cases.find(function (el) {
            return el.idCase == idCase;
        }).users;
        assignees = $owner ? assignees.slice(0, 1) : assignees.slice(1, assignees.length);
        var renderData = {
            defaultImg: self.defaultImg,
            assignees: assignees
        };
        var $TooltipUsersAssignee = loadTemplatesService.getTemplate("assigneesTooltip").render(renderData);

        $usersrelatedContainer.append($TooltipUsersAssignee);
        self.displayUsersImages(assignees, $TooltipUsersAssignee);

        setTimeout(function () {
            $TooltipUsersAssignee.click(function (e) {
                e.stopPropagation();
            });
            $(document).one('mouseout', function () {
               $TooltipUsersAssignee.remove();
            });
        }, 100);

        return $usersrelatedContainer.find('.usersrelated');
    };


    /**
     * Find and replace the default image in all cases list
     * @param {object} assignees
     * @return {object} template
     * @param template
     */
    self.displayUsersImages = function (assignees, template) {
        var userIds = [];
        for (var i = 0, l = assignees.length; i < l; i++) {
            userIds.push(assignees[i].idUser);
        }

        setTimeout(function () {
            for (var i = 0, l = userIds.length; i < l; i++) {
                $.when(self.getUser(userIds[i]), userIds[i]).done(function (user, userId) {
                    if (user.extendedInfo.picture) {
                        template
                            .find('.userId-' + userId)
                            .attr('src', self.imgPrefix + user.extendedInfo.picture)
                            .show('fast')
                            .parent()
                            .find('span.initials').hide();
                    }
                });
            }
        }, 0);
    };

    return {
        dataReady: self.dataReady,
        getAssignees: self.getAssignees,
        render: self.render
    }

});

bizagi.injector.register('usersCasesService', ['dataService', 'loadTemplatesService', bizagi.workportal.services.userscases]);