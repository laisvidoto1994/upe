/*
 *   Name: BizAgi Case Users
 *   Author: Andres Arenas V
 *   Comments:
 *   -   
 */
$.Class.extend("bizagi.caseUsers", {}, {
    /**
     * Init constructor
     * @param dataService The dataService for making request
     * @param parent
     *  - "Entities": When it comes from RenderTemplates
     *  - "Cases": When it comes from CasesTemplates
     * @param params Additional data
     */
    init: function (dataService, parent, params) {
        var self = this;
        self.initialParams = params || {};
        self.parent = parent || "Entities";
        self.dataService = dataService;
        self.userDataPromise = {};
    },
    /**
     * Get the users of an specific entity
     * @param entities A list with all the entities
     * @return The promise with the users of the entity
     */
    getUsers: function (entities) {
        var self = this;
        var users = [];

        var promises = $.map(entities, function (entity) {
            return self.dataService.getUsers({ caseId: entity.idCase}).done(function(data){
                entity["assignees"] = $.map(data.assignees, function(el){return $.extend(el, {initials: self._getInitials(el.name)})});
                entity["createdBy"] = $.extend(data.createdBy, {initials: self._getInitials(data.createdBy.name)});
                //Obtiene instancias unicas del usuario para el caso
                entity["users"] = self._getUniqueUsers($.merge([entity.createdBy], entity.assignees));
                entity["workOnIt"] = self._canWorkOnIt(data.assignees);

                //Se crea un array con los usuarios unicos para retornarlos
                var i= -1, user;
                while(user = entity.users[++i]){
                    var exist = users.find(function(el){
                        return user.idUser == el.idUser;
                    });
                    if (!exist){
                        users.push(user);
                    }
                }
            });
        });

        return $.when.apply($, promises).then(function (data) {
            return users;
        });
    },
    /**
     * Extract initials from specified name
     * @param name The name of the user
     * @return The first letter of the name and the first letter of the last name
     */
    _getInitials: function(name){
        var names = name.split(' ');
        var firstInitial = (typeof(names[0]) !== 'undefined') ? names[0].charAt(0) : "";
        var secondInitial = (typeof(names[1]) !== 'undefined') ? names[1].charAt(0) : "";

        return firstInitial + secondInitial;
    },
    /**
     * Remove the duplicated users from a list
     * @param users A list with all the users of an entity
     * @return A list with unique users
     */
    _getUniqueUsers: function(users){
        var i= -1, user, uniqueUsers = [];

        while(user = users[++i]){
            var exist = uniqueUsers.find(function(el){
                return user.idUser == el.idUser;
            });
            if (!exist){
                uniqueUsers.push({
                    idUser: user.idUser,
                    name: user.name,
                    initials: user.initials
                });
            }
        }

        if(uniqueUsers.length > 0){
            uniqueUsers[0].isAssignee = true;
        }

        return uniqueUsers;
    },
    /**
     * Determines if the current user can work on it case
     * @param assignees
     * @return {boolean}
     */
    _canWorkOnIt: function(assigneesUsers){
        var user, i = -1, canWorkOnIt = false;

        while(user = assigneesUsers[++i]){
            if(user.idUser === bizagi.currentUser.idUser){
                canWorkOnIt = true;
                break;
            }
        }
        return canWorkOnIt;
    }
});
