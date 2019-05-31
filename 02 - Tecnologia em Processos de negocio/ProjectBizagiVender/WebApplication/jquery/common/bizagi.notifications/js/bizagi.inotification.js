/*
* This object will define a contract in order to use a component of notifications
* */

bizagi = bizagi || { };
bizagi.INotifications = (function(options) {
    function init() {
        toastr.options = getDefaultOptions();

        return {
            showSucessMessage: sucessMessage,
            showWarningMessage: warningMessage,
            showErrorMessage: errorMessage
        };
    }

    return init;

    function getDefaultOptions() {
        return {
            "closeButton": false,
            "debug": false,
            "newestOnTop": false,
            "progressBar": true,
            "positionClass": "toast-bottom-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "7000",
            "extendedTimeOut": "5000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };
    };

    function sucessMessage(message, title, options) {
        toastr.success(message, title, options);
    };

    function warningMessage(message, title, options) {

    };

    function errorMessage(message, title ,options) {
        toastr.error(message, title, options);
    };

}());

bizagi.injector.register('notifier', [bizagi.INotifications]);