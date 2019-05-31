angular.module('bizagi.services.module').factory('bizagi.services', [
    'bizagi.services.action',
    'bizagi.services.case',
    'bizagi.services.collection',
    'bizagi.services.user',
    'bizagi.services.plan',
    'bizagi.services.search',
    'bizagi.services.suggestion',
    'bizagi.services.process',
    function (action, cases, collection, user, plan, search, suggestion, process) {
         return {
             action: action,
             cases: cases,
             collection: collection,
             user: user,
             plan: plan,
             search: search,
             process: process,
             suggestion: suggestion
         };
    }
]);

