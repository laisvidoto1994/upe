/**
 * This file contains all keys that can be change the default functionality
 * of Bizagi, please use it carefully.
 *
 * @author Edward J Morales
 */


// TODO: Please make a documentation for each override

/**
 * Active folders functionality that is used in workportal inbox to create
 * categories of process
 *
 * @type {boolean}
 */
bizagi.override.enableFolder = false;

/**
 * Enable the load of custom templates and code
 *
 * @type {boolean}
 */
bizagi.enableCustomizations = true;

/**
 * Smart Folders are case repositories that meet certain filters.
 * Each smart folder can be associated with a filter, for example,
 * all files that have been registered as of a determined date.
 *
 * @type {boolean}
 */
bizagi.override.enableSmartFolders = false;

/**
 * This functionality allow a new tap within modal window of new case,
 * that create a shortcut to most used process
 *
 * @type {boolean}
 */
bizagi.override.enableListOfRecentProcesses = false;


/**
 * Unused key. The Author must be define what can do
 *
 * @type {boolean}
 */
bizagi.override.enableCustomizeReports = false;

/**
 * This key enable within admin menu a new item that will
 * open "Multiple case reassigment" module
 *
 * SNAKE-1296
 * @type {boolean}
 */
bizagi.override.enableMultipleCasesReassigment = false;

/**
 * This key enable within admin menu a new item thah will
 * open "Async ECM Upload" module
 *
 * DRAGON-152 Adidas
 * @type {boolean}
 */
bizagi.override.enableAsyncECMUploadJobs = false;

/**
 * This key enable the capability to print an edit form of a grid
 * @type {boolean}
 */
bizagi.override.enablePrintFromEditForm = false;

/**
 * This key can be allow debug window in release environments
 * @type {boolean}
 */
bizagi.enableDebug = false;

/**
 * This key can be allow debug window in release environments
 * @type {boolean}
 */
bizagi.enableTrace = false;

/**
 * This key enable the analysis of invocations of multiaction service,
 * looking for a circular dependencies.
 *
 * @default By default the value depend of environment
 * @type {boolean}
 */
bizagi.override.detectCircularDependencies = false;

/**
 * This key disable old windows and enable new REST development
 * @type {boolean}
 */
//bizagi.override.disableFrankenstein = (typeof BIZAGI_SERVICE_ACTIVATION !== "undefined" && BIZAGI_SERVICE_ACTIVATION) ? true : false;


/**
* Disable old query forms and enable new tier using REST services
* @type {boolean}
*/
bizagi.override.disableFrankensteinQueryForms = false;

/**
 * Change default behavior of grid column sort
 * @type String
 * @example desc || asc
 */
//bizagi.override.gridDefaultSortBy= "desc";

/**
 * Expose interface to access to DOM elements
 * @type {boolean}
 */
bizagi.override.enableE2EInterface = false;

/**
 * Security option to enable visualization of current assignee
 * @type {boolean}
 */
bizagi.override.showAssignees = true;
/**
 * Time out to remove elements that not will be used anymore
 * @type {number} Milliseconds
 */
bizagi.override.disposeTime = 50;


/**
 * Enable REST batch request functionality
 * @type {boolean}
 */
bizagi.override.enableBatchRequest = true;

/**
 * force all request that consume a REST through Web API will be sending in a batch request
 * @type {boolean}
 */
bizagi.override.forceBatchRequest = false;

/**
 * Security option to enable visualization of current assignee
 * @type {boolean}
 */
bizagi.override.showAssignees = true;

/**
 *
 * @type {boolean}
 */
bizagi.override.enableMySearch = true;

/**
 *
 * @type {boolean}
 */
bizagi.override.enableSecurityCaseDashBoard = false;

/**
 *
 * @type {boolean}
 */
bizagi.override.enableMfb = false;

/**
 *
 * @type {boolean}
 */
bizagi.override.enableRateUS = false;

/**
 * Have to remove the "return;" in loader.override
 * @type {boolean}
 */
bizagi.override.webpartsChunk = false;
