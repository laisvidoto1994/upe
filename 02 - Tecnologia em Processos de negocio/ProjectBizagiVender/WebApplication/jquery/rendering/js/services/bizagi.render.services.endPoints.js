/*
*   Name: BizAgi Services Rendering End Points
*   Author: Diego Parra
*   Comments:
*   -   This script defines all the end-points used to retrieve ajax stuff
*   -   All urls must be relative to the base application
*/

// Create or define namespace
bizagi.render = (typeof (bizagi.render) !== "undefined") ? bizagi.render : {};
bizagi.render.services = (typeof (bizagi.render.services) !== "undefined") ? bizagi.render.services : {};
bizagi.render.services.endPoints = [];

// Creates a endpoint hash factory to resolve custom requirements
bizagi.render.services.getEndPoints = function (params) {

    var renderHandlerPathRest = "Rest/Handlers/Render";
    var renderUploadHandlerPathRest = "Rest/Handlers/Render/Upload";
    var renderFileHandlerPathRest = "Rest/Handlers/RenderFile";
    var letterHandlerPathRest = "Rest/Handlers/Letter";
    var multiActionHandlerPathRest = "Rest/Handlers/MultiAction";
    var metadataHandlerPathRest = "Rest/Handlers/Metadata";
    // Default workportal end-points
    if (params.context == "workflow") {
        return {
            "form-get-data": params.proxyPrefix + renderHandlerPathRest,
            "form-submit-data": params.proxyPrefix + renderHandlerPathRest,
            "form-submit-data-upload": params.proxyPrefix + renderUploadHandlerPathRest,
            "render-property-refresh": params.proxyPrefix + renderHandlerPathRest,
            "render-multiaction": params.proxyPrefix + multiActionHandlerPathRest,
            "render-upload-cancel-image": params.proxyPrefix + "jquery/rendering/css/desktop/plugins/other/images/upload-cancel.png",
            "render-upload-data-url": params.proxyPrefix + renderFileHandlerPathRest,
            "render-upload-add-url": params.proxyPrefix + renderUploadHandlerPathRest,
            "render-upload-delete-url": params.proxyPrefix + renderHandlerPathRest,
            "render-ecm-upload-url": params.proxyPrefix + metadataHandlerPathRest,
            "render-grid-edit-url": params.proxyPrefix + renderHandlerPathRest,
            "render-grid-save-url": params.proxyPrefix + renderHandlerPathRest,
            "render-grid-add-url": params.proxyPrefix + renderHandlerPathRest,
            "render-grid-rollback-url": params.proxyPrefix + renderHandlerPathRest,
            "render-grid-commit-url": params.proxyPrefix + renderHandlerPathRest,
            "render-grid-checkpoint-url": params.proxyPrefix + renderHandlerPathRest,
            "render-save-entity": params.proxyPrefix + renderHandlerPathRest,
            "render-stakeholder-associated": params.proxyPrefix + renderHandlerPathRest,
            "render-search-default-image": params.proxyPrefix + "jquery/rendering/css/desktop/images/bizagi_xpress.png",
            "render-search-form-get-data": params.proxyPrefix + renderHandlerPathRest + "?h_contexttype=metadata",
            "render-search-advanced-url": params.proxyPrefix + "Rest/Handlers/Query",
            "render-letter-notEditable-url": params.proxyPrefix + letterHandlerPathRest,
            "render-letter-content-url": params.proxyPrefix + letterHandlerPathRest,
            "render-letter-save-url": params.proxyPrefix + renderHandlerPathRest,
            "render-letter-content-icons": params.proxyPrefix + "jquery/rendering/css/desktop/plugins/other/images/nicEditorIcons.gif",
            "render-userfield-definition": params.proxyPrefix + "Rest/Userfields/{guidUserfield}/UserfieldDependency/{device}",
            "render-document-generate": params.proxyPrefix + "Rest/DocumentTemplates/CaseTemplates",
            "render-document-generateAllDocuments": params.proxyPrefix + "Rest/DocumentTemplates/TemplatesConcatFilesToPDF",
            "render-processes-startform": params.proxyPrefix + "Rest/Processes/HasStartForm",
            "render-processes-getstartform": params.proxyPrefix + "Rest/Processes/HasStartForm",
            "render-entity-layout-image64": params.proxyPrefix + "Api/Entities/{entity}/Picture/{surrogateKey}/Base64",
            "render-entity-layout-imageByteArray": params.proxyPrefix + "Api/Entities/{entity}/Picture/{surrogateKey}/Array?xpath={xpath}&width={width}&height={height}&h_={hash}",
            "render-entity-layout-upload-files": params.proxyPrefix + "Api/Entities/{entity}/Files/{surrogateKey}/Array?xpath={xpath}",
            "case-handler-getCaseSummary": params.proxyPrefix + "Rest/Cases/{idCase}/Summary",
            "case-handler-getCaseSummaryByGuid": params.proxyPrefix + "Rest/Cases/{guid}/SummaryByGuid",
            "case-handler-getCaseAssignees": params.proxyPrefix + "Rest/Cases/{idCase}/Assignees",
            "case-handler-getWorkItems": params.proxyPrefix + "Rest/Cases/{idCase}/WorkItems",
            "case-handler-getWorkItemsByGuid": params.proxyPrefix + "Rest/Cases/{guid}/WorkItemsByGuid",
            "admin-getUsersList": params.proxyPrefix + "Rest/Users/SearchUsers",
            "admin-getUsersForAssignation": params.proxyPrefix + "Rest/Users/UsersForAssignation",
            "admin-users-config": params.proxyPrefix + "Api/Authentication/BizagiConfig",
            //users administration
            "admin-usersform": params.proxyPrefix + "Rest/Handlers/Render",
            "admin-GenerateDataToSendByEmail": params.proxyPrefix + "Rest/Users/GenerateDataToSendByEmail",
            "admin-sendUserEmail": params.proxyPrefix + "Rest/Users/SendUserEmail"
        };
    }
    // Sharepoint end-points (must be customized for each project)
    if (params.context == "sharepoint" || params.context == "portal") {
        if (typeof (params.sharepointProxyPrefix) === "undefined") alert("sharepointProxyPrefix param is requiered to build endpoints when context is 'sharepoint'");
        return {
            "form-get-data": params.sharepointProxyPrefix + renderHandlerPathRest,
            "form-submit-data": params.sharepointProxyPrefix + renderHandlerPathRest,
            "form-submit-data-upload": params.sharepointProxyPrefix + renderUploadHandlerPathRest,
            "render-property-refresh": params.sharepointProxyPrefix + renderHandlerPathRest,
            "render-multiaction": params.sharepointProxyPrefix + multiActionHandlerPathRest,
            "render-upload-cancel-image": "jquery/rendering/css/desktop/plugins/other/images/upload-cancel.png",
            "render-upload-data-url": params.sharepointProxyPrefix + renderFileHandlerPathRest,
            "render-upload-add-url": params.sharepointProxyPrefix + renderUploadHandlerPathRest,
            "render-upload-delete-url": params.sharepointProxyPrefix + renderHandlerPathRest,
            "render-ecm-upload-url": params.sharepointProxyPrefix + metadataHandlerPathRest,
            "render-grid-edit-url": params.sharepointProxyPrefix + renderHandlerPathRest,
            "render-grid-save-url": params.sharepointProxyPrefix + renderHandlerPathRest,
            "render-grid-add-url": params.sharepointProxyPrefix + renderHandlerPathRest,
            "render-grid-rollback-url": params.sharepointProxyPrefix + renderHandlerPathRest,
            "render-grid-commit-url": params.sharepointProxyPrefix + renderHandlerPathRest,
            "render-grid-checkpoint-url": params.sharepointProxyPrefix + renderHandlerPathRest,
            "render-save-entity": params.sharepointProxyPrefix + renderHandlerPathRest,
            "render-stakeholder-associated": params.proxyPrefix + renderHandlerPathRest,
            "render-search-default-image": "jquery/css/bizagi/desktop/images/bizagi_xpress.png",
            "render-search-form-get-data": params.sharepointProxyPrefix + renderHandlerPathRest + "?h_contexttype=metadata",
            "render-search-advanced-url": params.sharepointProxyPrefix + "Rest/Handlers/Query",
            "render-letter-notEditable-url": params.sharepointProxyPrefix + letterHandlerPathRest,
            "render-letter-content-url": params.sharepointProxyPrefix + letterHandlerPathRest,
            "render-letter-save-url": params.sharepointProxyPrefix + renderHandlerPathRest,
            "render-letter-content-icons": "jquery/css/plugins/other/images/nicEditorIcons.gif",
            "render-userfield-definition": params.sharepointProxyPrefix + "Rest/Userfields/{guidUserfield}/UserfieldDependency/{device}",
            "render-document-generate": params.sharepointProxyPrefix + "Rest/DocumentTemplates/CaseTemplates",
            "render-document-generateAllDocuments": params.sharepointProxyPrefix + "Rest/DocumentTemplates/TemplatesConcatFilesToPDF",            
            "case-handler-getCaseSummary": params.sharepointProxyPrefix + "Rest/Cases/{idCase}/Summary",
            "case-handler-getCaseSummaryByGuid": params.sharepointProxyPrefix + "Rest/Cases/{guid}/SummaryByGuid",
            "case-handler-getWorkItems": params.sharepointProxyPrefix + "Rest/Cases/{idCase}/WorkItems",
            "case-handler-getWorkItemsByGuid": params.proxyPrefix + "Rest/Cases/{guid}/WorkItemsByGuid"
        };
    }

    if (params.context == "entitymanagement") {
        return {
            "form-get-data": params.proxyPrefix + renderHandlerPathRest + "?h_contexttype=entity",
            "form-submit-data": params.proxyPrefix + renderHandlerPathRest + "?h_contexttype=entity",
            "form-submit-data-upload": params.proxyPrefix + renderUploadHandlerPathRest + "?h_contexttype=entity",
            "render-property-refresh": params.proxyPrefix + renderHandlerPathRest + "?h_contexttype=entity",
            "render-upload-cancel-image": "jquery/rendering/css/desktop/plugins/other/images/upload-cancel.png",
            "render-upload-data-url": params.proxyPrefix + renderFileHandlerPathRest + "?h_contexttype=entity",
            "render-upload-add-url": params.proxyPrefix + renderUploadHandlerPathRest + "?h_contexttype=entity",
            "render-upload-delete-url": params.proxyPrefix + renderHandlerPathRest + "?h_contexttype=entity",
            "render-grid-edit-url": params.proxyPrefix + renderHandlerPathRest + "?h_contexttype=entity",
            "render-grid-save-url": params.proxyPrefix + renderHandlerPathRest + "?h_contexttype=entity",
            "render-grid-add-url": params.proxyPrefix + renderHandlerPathRest + "?h_contexttype=entity",
            "render-grid-rollback-url": params.proxyPrefix + renderHandlerPathRest + "?h_contexttype=entity",
            "render-grid-commit-url": params.proxyPrefix + renderHandlerPathRest + "?h_contexttype=entity",
            "render-grid-checkpoint-url": params.proxyPrefix + renderHandlerPathRest + "?h_contexttype=entity",
            "render-search-default-image": "jquery/rendering/css/desktop/images/bizagi_xpress.png",
            "render-search-form-get-data": params.proxyPrefix + renderHandlerPathRest + "?h_contexttype=metadata",
            "render-search-advanced-url": params.proxyPrefix + "Rest/Handlers/Query" + "?h_contexttype=entity",
            "render-letter-notEditable-url": params.proxyPrefix + letterHandlerPathRest + "?h_contexttype=entity",
            "render-letter-content-url": params.proxyPrefix + letterHandlerPathRest + "?h_contexttype=entity",
            "render-letter-save-url": params.proxyPrefix + renderHandlerPathRest + "?h_contexttype=entity",
            "render-letter-content-icons": "jquery/rendering/css/desktop/plugins/other/images/nicEditorIcons.gif"
        };
    }

    if (params.context == "search") {
        return {
            "form-get-data": params.proxyPrefix + renderHandlerPathRest + "?h_contexttype=metadata",
            "form-submit-data": params.proxyPrefix + renderHandlerPathRest + "?h_contexttype=metadata",
            "form-submit-data-upload": params.proxyPrefix + renderUploadHandlerPathRest + "?h_contexttype=metadata",
            "render-property-refresh": params.proxyPrefix + renderHandlerPathRest + "?h_contexttype=metadata",
            "render-upload-cancel-image": "jquery/rendering/css/desktop/plugins/other/images/upload-cancel.png",
            "render-upload-data-url": params.proxyPrefix + renderFileHandlerPathRest + "?h_contexttype=metadata",
            "render-upload-add-url": params.proxyPrefix + renderUploadHandlerPathRest + "?h_contexttype=metadata",
            "render-upload-delete-url": params.proxyPrefix + renderHandlerPathRest + "?h_contexttype=metadata",
            "render-grid-edit-url": params.proxyPrefix + renderHandlerPathRest + "?h_contexttype=metadata",
            "render-grid-save-url": params.proxyPrefix + renderHandlerPathRest + "?h_contexttype=metadata",
            "render-grid-add-url": params.proxyPrefix + renderHandlerPathRest + "?h_contexttype=metadata",
            "render-grid-rollback-url": params.proxyPrefix + renderHandlerPathRest + "?h_contexttype=metadata",
            "render-grid-commit-url": params.proxyPrefix + renderHandlerPathRest + "?h_contexttype=metadata",
            "render-grid-checkpoint-url": params.proxyPrefix + renderHandlerPathRest + "?h_contexttype=metadata",
            "render-search-default-image": "jquery/rendering/css/desktop/images/bizagi_xpress.png",
            "render-search-form-get-data": params.proxyPrefix + renderHandlerPathRest + "?h_contexttype=metadata",
            "render-search-advanced-url": params.proxyPrefix + "Rest/Handlers/Query" + "?h_contexttype=metadata",
            "render-letter-notEditable-url": params.proxyPrefix + letterHandlerPathRest + "?h_contexttype=metadata",
            "render-letter-content-url": params.proxyPrefix + letterHandlerPathRest + "?h_contexttype=metadata",
            "render-letter-save-url": params.proxyPrefix + renderHandlerPathRest + "?h_contexttype=metadata",
            "render-letter-content-icons": "jquery/rendering/css/desktop/plugins/other/images/nicEditorIcons.gif"
        };
    }

    return {};
};
