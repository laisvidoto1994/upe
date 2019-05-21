/**
 *
 * Created by RicardoPD on 4/19/2016.
 */

bizagi = typeof bizagi !== "undefined" ? bizagi : {};
bizagi.util = typeof bizagi.util !== "undefined" ? bizagi.util : {};
bizagi.util.smartphone = (typeof (bizagi.util.smartphone) !== "undefined") ? bizagi.util.smartphone : {};
bizagi.util.tablet = (typeof (bizagi.util.tablet) !== "undefined") ? bizagi.util.tablet : {};
bizagi.util.mobility = (typeof (bizagi.util.mobility) !== "undefined") ? bizagi.util.mobility : {};

// ------------------------------------------------------------------------
// UTILS FOR BIZAGI CASES
// ------------------------------------------------------------------------

bizagi.util.cases = typeof bizagi.util.cases !== "undefined" ? bizagi.util.cases : {};

/**
 * Returns an object with the status
 *  - Overdue
 *  - Today
 *  - Tomorrow
 *  - Upcoming
 * @param date
 * @returns Object with parameters
 */
bizagi.util.cases.getStatusTimeLabel = function(date) {
    var groupedData = {};

    var actualDate = new Date();
    var actualYear = actualDate.getFullYear();
    var actualMonth = actualDate.getMonth();
    var actualDay = actualDate.getDate();

    date = bizagi.util.isDate(date) ? date : actualDate;

    var tmpDate = new Date(date);
    var tmpMonth = tmpDate.getMonth();
    var tmpYear = tmpDate.getFullYear();
    var tmpDay = tmpDate.getDate();

    var dateDiff = ((new Date(tmpYear, tmpMonth, tmpDay, 0, 0, 0) - new Date(actualYear, actualMonth, actualDay, 0, 0, 0)));

    if (dateDiff < 0) {
        groupedData.date = bizagi.util.dateFormatter.formatDate(new Date(tmpDate), "dd MMM");
        groupedData.type = bizagi.localization.getResource("workportal-taskfeed-overdue");
        groupedData.status = "red";
    } else {
        if (actualDay == tmpDay) {
            groupedData.date = bizagi.util.dateFormatter.formatDate(new Date(tmpDate), "hh:mm");
            groupedData.type = bizagi.localization.getResource("workportal-taskfeed-today");
            groupedData.status = "yellow";
        } else if ((actualDay + 1) == tmpDay) {
            groupedData.date = bizagi.util.dateFormatter.formatDate(new Date(tmpDate), "hh:mm");
            groupedData.type = bizagi.localization.getResource("workportal-taskfeed-tomorrow");
            groupedData.status = "yellow";
        } else {
            groupedData.date = bizagi.util.dateFormatter.formatDate(new Date(tmpDate), 'dd MMM');
            groupedData.type = bizagi.localization.getResource("workportal-taskfeed-upcomming");
            groupedData.status = "green";
        }
    }

    return groupedData;
};

// ------------------------------------------------------------------------
// UTILS FOR DEVICE
// ------------------------------------------------------------------------

/**
 * Detect a device based on the width
 * @returns {} 
 */
bizagi.util.detectDevice = function () {
    // Call the method located in bizagi.loader
    return bizagi.detectDevice();
};

/**
 * Check is mobile device
 * @returns {}
 */
bizagi.util.isMobileDevice = function() {
    var device = bizagi.detectDevice();

    return ([
        "smartphone_ios",
        "smartphone_ios_native",
        "smartphone_android",
        "tablet",
        "tablet_ios",
        "tablet_ios_native",
        "tablet_android"
    ].indexOf(device) > -1);
};

/**
 * Verify mobile device type
 * @returns {}
 */
bizagi.util.isTabletDevice = function() {
    var device = bizagi.util.detectDevice();

    return ([
        "tablet",
        "tablet_ios",
        "tablet_ios_native",
        "tablet_android"
    ].indexOf(device) > -1);
};

/**
 * Tablet android
 * @returns {} 
 */
bizagi.util.isAndroidTabletDevice = function () {
    var device = bizagi.util.detectDevice();

    return bizagi.util.isTabletDevice() && (device.indexOf("android") !== -1);
};

/**
 * Tablet iOS
 * @returns {} 
 */
bizagi.util.isiOSTabletDevice = function () {
    var device = bizagi.util.detectDevice();

    return bizagi.util.isTabletDevice() && (device.indexOf("android") === -1);
};

/**
 * Verify mobile device type
 * @returns {}
 */
bizagi.util.isSmartphoneDevice = function() {
    var device = bizagi.util.detectDevice();

    return ([
        "smartphone_ios",
        "smartphone_ios_native",
        "smartphone_android"
    ].indexOf(device) > -1);
};

/**
 * Smartphone android
 * @returns {} 
 */
bizagi.util.isAndroidSmartphoneDevice = function () {
    var device = bizagi.util.detectDevice();

    return bizagi.util.isSmartphoneDevice() && (device.indexOf("android") !== -1);
};

/**
 * Smartphone iOS
 * @returns {} 
 */
bizagi.util.isiOSSmartphoneDevice = function() {
    var device = bizagi.util.detectDevice();

    return bizagi.util.isSmartphoneDevice() && (device.indexOf("ios") !== -1);
};

// ------------------------------------------------------------------------
//  GENERAL UTILS
// ------------------------------------------------------------------------

/**
 * Formats ECM Download URL according where bizagi is running (App or Mobile Browser)
 * @returns {}
 */
bizagi.util.formatECMDownloadURL = function(url) {
    if (!bizagi.util.isMobileBrowser())
        return url;

    var resultURL = bizagi.loader.getPathUrl(url);
    var projectBase = bizagi.loader.getPathUrl("");

    //Checks the URL comes with the projectBase path in the url
    if (resultURL.indexOf(projectBase) !== -1) {
        return url;
    } else {
        var toFind = bizagi.loader.getPathUrl("/");
        return resultURL.replace(toFind, projectBase);
    }
};

/**
 * Get Android version
 * @param {} ua
 * @returns {}
 */
bizagi.util.getAndroidVersion = function() {
    var userAgent = navigator.userAgent.toLowerCase();
    var match = userAgent.match(/android\s([0-9\.]*)/);

    return match ? parseFloat(match[1]) : false;
};

/**
 * Method to detect if is in a Mobile Browser (tablet and smartphone)
 * @returns {}
 */
bizagi.util.isMobileBrowser = function() {
    var check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

/**
 * Define title to view
 * @param {} view context
 * @param {} title title
 * @returns {}
 */
bizagi.util.setKendoViewTitle = function(view, title) {
    if (typeof (view) !== "undefined") {
        var navigationBar = $(".km-navbar", view.header).data("kendoMobileNavBar");
        if (navigationBar) {
            navigationBar.title(title);
            view.options.title = view.title = title;
        }
    }
};

/**
 * Get response message of services
 * @param {} data
 * @returns {}
 */
bizagi.util.processFailMessage = function(data) {
    var message = data || {};

    try {
        message = typeof (message) == "string" ? JSON.parse(message) : message;
        message = message.responseText || (message.message || message);
    } catch (e) {
        message = data;
    }

    return message;
};

/**
 * Validate resource
 * @param {} resource resource name
 * @returns {}
 */
bizagi.util.isValidResource = function(resource) {
    if (!bizagi.localization) return false;
    return (bizagi.localization.getResource(resource) !== resource);
};

/**
 * Media utils Module to media renders.
 * Methods:
 * ** getImagePath
 * ** checkMaxSizeFile
 * ** checkFileTypes
 * ** uploadFile
 * ** checkMaxSize
 * ** checkMaxSizeVideo
 **/
bizagi.util.media = {
    uploadFile: function(params) {
        var defer = new $.Deferred();

        var vFD = new FormData();

        //Copy all the atributes to the FormData object
        $.each(params.data, function (key, item) {
            vFD.append(key, item);
        });

        window.resolveLocalFileSystemURL(params.dataFile, function(fileEntry) {
            fileEntry.file( function(file) {

                var reader = new FileReader();
                reader.onloadend = function(e) {
                   var blob = new Blob([this.result], { type: file.type });
                   vFD.append(params.data["h_xpath"], blob, file.name);

                   $.ajax({
                       url: params.properties.addUrl,
                       type: "POST",
                       contentType: false,
                       processData: false,
                       data: vFD
                   }).done(function(resp){
                       defer.resolve({"response": resp});
                   }).fail(function(error){
                       defer.reject(error);
                   });
                }

                reader.readAsArrayBuffer(file);
            }, errorHandler);
        }, errorHandler);

        var errorHandler = function(err) {
            console.log('error uploading files', err);
        }

        return defer.promise();
    },

    checkFileTypes: function(file, properties, extensions) {
        //validates all client file types allowed
        var expression = new RegExp("^.*\\.(" + extensions.join('|') + ")$", 'i');
        if (!expression.test(file.name)) {
            bizagi.showMessageBox(bizagi.localization.getResource("render-upload-error-extensions"));
            return false;
        }

        //validates all server file types allowed
        if (properties.validExtensions && properties.validExtensions.length > 0) {
            var validExtensions = properties.validExtensions.replaceAll("*.", "").split(";");
            if (!this.stringEndsWithValidExtension(file.name, validExtensions, true)) {
                var message = bizagi.localization.getResource("render-upload-allowed-extensions");
                bizagi.showMessageBox(message + " " + properties.validExtensions);
                return false;
            }
        }
        return true;
    },

    checkMaxSizeFile: function(file, properties) {
        if (typeof (properties.maxSize) === "undefined" || properties.maxSize == null || properties.maxSize === "") {
            return true;
        }

        if (typeof (file) !== "undefined") {
            if (file.size === 0) {
                bizagi.showMessageBox(bizagi.localization.getResource("render-upload-error-file-empty")
                    .replace("%s", file.name));
                return false;
            }

            if (file.size >= properties.maxSize) {
                bizagi.showMessageBox(bizagi.localization.getResource("render-upload-alert-maxsize")
                    .replace("{0}", properties.maxSize));
                return false;
            }

            return true;

        } else {
            bizagi.showMessageBox(bizagi.localization.getResource("render-required-upload")
                .replace("#label#", properties.displayName));
            return false;
        }
    },

    stringEndsWithValidExtension: function(stringToCheck, acceptableExtensionsArray, required) {
        if (required === false && stringToCheck.length === 0) {
            return true;
        }

        for (var i = 0, length = acceptableExtensionsArray.length; i < length; i++) {
            if (acceptableExtensionsArray[i] === "*" || stringToCheck.toLowerCase()
                .endsWith(acceptableExtensionsArray[i].toLowerCase()))
                return true;
        }

        return false;
    },

    getImagePath: function(image) {
        var dataImage = image;
        var version = bizagi.util.getAndroidVersion();

        if (!version)
            return dataImage;

        if (dataImage.substring(0, 21) === "content://com.android" && version <= 4.4) {
            var photoSplit = dataImage.split("%3A");
            if (photoSplit.length > 1) {
                dataImage = "content://media/external/images/media/" + photoSplit[1];
            } else {
                photoSplit = dataImage.split("/");
                dataImage = "content://media/external/images/media/" + photoSplit[photoSplit.length - 1];
            }
        }

        return dataImage;
    },

    checkMaxSize: function(objectUri, properties) {
        var defer = new $.Deferred();

        if (typeof (properties.maxSize) === "undefined" || properties.maxSize === null || properties.maxSize === "") {
            defer.resolve();
        }

        window.resolveLocalFileSystemURL(objectUri, function(fileEntry) {
            fileEntry.file(function(fileObj) {
                if (fileObj.size >= properties.maxSize) {
                    bizagi.showMessageBox(bizagi.localization.getResource("render-upload-alert-maxsize")
                        .replace("{0}", properties.maxSize), "Error");
                    defer.reject();
                } else {
                    defer.resolve(fileObj);
                }
            });
        });

        return defer.promise();
    },

    checkMaxSizeVideo: function(objectVideo, properties) {
        var defer = new $.Deferred();
        var size = objectVideo[0].size;

        if (typeof (properties.maxSize) === "undefined" || properties.maxSize == null || properties.maxSize === "") {
            defer.resolve();
        }

        if (size >= properties.maxSize) {
            bizagi.showMessageBox(bizagi.localization.getResource("render-upload-alert-maxsize")
                .replace("{0}", properties.maxSize), "Error");
            defer.reject();
        } else {
            defer.resolve();
        }

        return defer.promise();
    },

    /**
     * Check has file extension
     * @param {} dataFile
     * @returns {}
     */
    hasExtension: function(dataFile) {
        if (!dataFile) return false;

        var hasExtension = bizagi.util.media.getFileExtension(dataFile);
        return !bizagi.util.isEmpty(hasExtension);
    },

    /**
     * Get File name
     * @param {} dataFile
     * @returns {}
     */
    getFileName: function(dataFile) {
        if (!dataFile) return "";

        var fileName = dataFile.substr(dataFile.lastIndexOf("/") + 1);
        return (fileName ? fileName : "");
    },

    /**
     * Get File extension
     * @param {} dataFile
     * @returns {}
     */
    getFileExtension: function(dataFile) {
        if (!dataFile) return "";

        var fileName = bizagi.util.media.getFileName(dataFile);
        var hasExtension = (/[.]/.exec(fileName)) ? /[^.]+$/.exec(fileName) : null;

        return (hasExtension ? "." + hasExtension.shift() : "");
    },

    /**
     * Get native path
     * @param {} dataFile
     * @returns {}
     */
    getNativePath: function(fileUrl) {
        var defer = new $.Deferred();
        var device = bizagi.util.detectDevice();

        if (device.indexOf("android") && !bizagi.util.media.hasExtension(fileUrl) && bizagi.util.isCordovaSupported()) {
            window.FilePath.resolveNativePath(fileUrl, function(url) {
                defer.resolve(url);
            }, function(error) {
                defer.reject(fileUrl);
            });
        } else {
            defer.resolve(fileUrl);
        }

        return defer.promise();
    },

    /**
     * Get data file
     * @param {} dataFile
     * @returns {}
     */
    getFileDataInfo: function(dataFile) {
        return $.when(bizagi.util.media.getNativePath(dataFile))
            .then(function(url) {
                var file = {
                    url: url,
                    name: bizagi.util.media.getFileName(url),
                    extension: bizagi.util.media.getFileExtension(url)
                };

                return file;
            });
    },

    /**
     * Get image resolution by type
     * @param {} option
     * @returns {}
     */
    getImageResolution: function(option) {
        var resolution = {
            width: 0,
            height: 0
        };

        switch (option) {
        case 1:
            resolution.width = 320;
            resolution.height = 240;
            break;
        case 2:
            resolution.width = 640;
            resolution.height = 480;
            break;
        case 3:
            resolution.width = 1280;
            resolution.height = 960;
            break;
        }

        return resolution;
    },

    /**
     * Validate file-api support
     * Detect file input support, based on
     * http://viljamis.com/blog/2012/file-upload-support-on-mobile/
     * @returns {boolean} Whether or not file-upload is supported
     */
    fileAPISupported: function() {
        // This will create a boolean attribute so subsecuent calls will take no time
        if (this.fileAPISupportedResult === undefined) {
            // Handle devices which give false positives for the feature detection:
            if (navigator.userAgent
                .match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/)) {
                this.fileAPISupportedResult = false;
                return this.fileAPISupportedResult;
            }

            // Special case for cordova
            // User agent is android and version >= 5 it will be supported
            // Seems that it is covered by the previous condition but (legacy) just in case ...
            var androidVersion = bizagi.util.getAndroidVersion();
            if (androidVersion && androidVersion < 5) {
                this.fileAPISupportedResult = false;
                return this.fileAPISupportedResult;
            }

            // Feature detection for all other devices:
            var fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.style.display = "none";
            document.getElementsByTagName("body")[0].appendChild(fileInput);
            this.fileAPISupportedResult = !fileInput.disabled;
            fileInput.parentNode.removeChild(fileInput);

        }

        return this.fileAPISupportedResult;
    },


    /**
     * Downloads the file and try to open it
     *
     * @param url String URI
     * @param fileName String Name to be used for the file
     * @param options Object Some resources will use different parameters or methods
     */
    downloadFile: function(url, fileName) {

        // When in iOS
        if (bizagi.util.isNativePluginSupported()) {
            // ios native behaviour, should open files through a webview
            bizagiapp.openFileWebView({ "itemUrl": url });
        }
        // When in Android
        else if (bizagi.util.isCordovaSupported() && cordova.plugins.fileOpener2) {
            // New plugin

            var showFile = function showFile(file) {
                cordova.plugins.fileOpener2.open(
                    file.localURL,
                    file.type,
                    {
                        error: function(err) {
                            var message = err.message; //set unhandled error message
                            if (err.status === 9) { //
                                var resource = bizagi.localization.getResource("render-upload-error-no-file-opener")
                                    .replace("%s", file.name);
                                message = bizagi.util.isValidResource("render-upload-error-no-file-opener") ? resource
                                    : "There is no application set to open the document \"" +
                                    file.name + "\".";

                                bizagi.showConfirmationBox(message, bizagi.localization.getResource('workportal-widget-admin-language-widget-download'), "", [{
                                    "label": bizagi.localization.getResource('workportal-widget-admin-language-widget-download'),
                                    "action": "resolve"
                                }, {label: bizagi.localization.getResource('confirmation-savebox-cancel'), "action": "reject"}]).done(function() {
                                    window.open(url, '_system', 'location=yes');
                                });

                                return;
                            }
                            bizagi.showMessageBox(message, "Error");
                        },
                        success: function() {
                            bizagi.log("Success showed file " + file.name);
                        }
                    }
                );
            };

            var readFile = function readFile(fileEntry) {
                fileEntry.file(function(file) {
                    showFile(file);
                }, function(e) {
                    console.error("Error in FileEntry.file", e);
                });
            }

            var writeFile = function writeFile(fileEntry, dataObj) {
                // Create a FileWriter object for our FileEntry (log.txt).
                fileEntry.createWriter(function(fileWriter) {

                    fileWriter.onwriteend = function() {
                        console.log("Successful file write...");
                        readFile(fileEntry);
                    };

                    fileWriter.onerror = function(e) {
                        console.log("Failed file write: " + e.toString());
                    };

                    // If data object is not passed in,
                    // create a new Blob instead.
                    if (!dataObj) {
                        dataObj = new Blob(["some file data"], { type: "text/plain" });
                    }

                    fileWriter.write(dataObj);
                });
            }

            var download = function download(dirEntry, fileName, uri) {
                $.ajax({
                    url: uri,
                    type: "GET",
                    dataType: "binary",
                    processData: false, //Allways false for binary dataType
                    success: function(result) {
                        dirEntry.getFile(fileName, { create: true, exclusive: false }, function(fileEntry) {
                            writeFile(fileEntry, result);
                        }, function(e) {
                            console.log("Error getFile", e);
                        });
                    }
                });
            };

            var localURL = cordova.file.externalDataDirectory || cordova.file.dataDirectory ||
                cordova.file.cacheDirectory;
            window.resolveLocalFileSystemURL(encodeURI(localURL), function(dirEntry) {
                if (!fileName) {
                    // Just looking for a name
                    fileName = url.split("/").pop().replace(/([\?#&]+)/g, "/").split("/").shift() || "downloaded-file";
                }
                //Call download to file transfer method
                download(dirEntry, fileName, url);
            }, function(err) {
                bizagi.log("Error loading dir entry...", err);
            });

        } else {
            window.open(url, "_system");
        }
    }
};

bizagi.util.benchmack = function(name, action) {
    var reps = Math.pow(10, 3);
    window["console"].time(name);
    for (var c = 0; c < reps; c ++) {
        action();
    }
    window["console"].timeEnd(name);
};

// ------------------------------------------------------------------------
// DATE UTILITIES
// ------------------------------------------------------------------------

/**
 * Mobiscroll languages
 */
bizagi.util.languages = {
    "es": "es", "es-ES": "es", "es-AR": "es", "es-BO": "es", "es-Cl": "es", "es-CO": "es", "es-CR": "es", "es-DO": "es", "es-EC": "es", "es-SV": "es", "es-GT": "es", "es-HN": "es", "es-MX": "es", "es-NI": "es", "es-PA": "es", "es-PY": "es", "es-PR": "es", "es-PE": "es", "es-US": "es", "es-UY": "es", "es-VE": "es",
    "en": "en-US", "en-AU": "en-US", "en-BZ": "en-US", "en-CA": "en-US", "en-029": "en-US", "en-IN": "en-US", "en-IE": "en-US", "en-JM": "en-US", "en-MY": "en-US", "en-NZ": "en-US", "en-PH": "en-US", "en-SG": "en-US", "en-ZA": "en-US", "en-TT": "en-US", "en-GB": "en-US", "en-US": "en-US", "en-ZW": "en-US",
    "de": "de", "de-AT": "de", "de-DE": "de", "de-LI": "de", "de-LU": "de", "de-CH": "de",
    "fr": "fr", "fr-BE": "fr", "fr-CA": "fr", "fr-LU": "fr", "fr-MC": "fr", "fr-CH": "fr", "fr-FR": "fr",
    "it": "it", "it-IT": "it", "it-CH": "it",
    "ja": "ja", "ja-JA": "ja", "ja-JP": "ja",
    "nl": "nl", "nl-NL": "nl", "nl-BE": "nl",
    "pt": "pt-PT", "pt-BR": "pt-PT", "pt-PT": "pt-PT",
    "ru": "ru", "ru-RU": "ru",
    "cs": "cs", "cs-CZ": "cs",
    "ar": "ar", "ar-DZ": "ar", "ar-BH": "ar", "ar-EG": "ar", "ar-IQ": "ar", "ar-JO": "ar", "ar-KW": "ar", "ar-LB": "ar", "ar-LY": "ar", "ar-MA": "ar", "ar-OM": "ar", "ar-QA": "ar", "ar-SA": "ar", "ar-SY": "ar", "ar-TN": "ar", "ar-AE": "ar", "ar-YE": "ar",
    "zh": "zh", "zh-HK": "zh", "zh-MO": "zh", "zh-CN": "zh", "zh-Hans": "zh", "zh-SG": "zh", "zh-TW": "zh", "zh-Hant": "zh"
};

/**
 * Uses mobiscroll locale to format a valid date in the required language
 * @param {} date
 * @param {} fixedDateFormat
 * @param {} language
 * @returns {}
 */
bizagi.util.localeDate = function(date, fixedDateFormat, language) {

    if (typeof ($.mobiscroll.i18n[language]) !== "undefined") {
        if (fixedDateFormat.indexOf("tt") !== -1) {
            fixedDateFormat = fixedDateFormat.replace("tt", "a");
        }

        // Checks if the format includes MM
        if (fixedDateFormat.indexOf("MM") !== -1) {
            // Checks if the full month is included in the format
            if (fixedDateFormat.indexOf("MMMM") !== -1) {
                fixedDateFormat = fixedDateFormat.replace("MMMM", "MM");
            } else {
                //Checks the month is in number format
                if (fixedDateFormat.indexOf("MM") !== -1) {
                    fixedDateFormat = fixedDateFormat.replace("MM", "mm");
                }
            }
        }

        //Fix long day (Monday, Tuestday...)
        if (fixedDateFormat.indexOf("dddd") !== -1) {
            fixedDateFormat = fixedDateFormat.replace("dddd", "DD");
        }

        var format = $.mobiscroll.formatDate(fixedDateFormat, date, $.mobiscroll.i18n[language]);

        return bizagi.util.convertHexNCR2Char(format);
    }

    return date;
}

/**
 * Converts a string containing &#x...; escapes to a string of characters
 * @params: str: string, the input
 */
bizagi.util.convertHexNCR2Char = function(str) {
    // str: string, the input

    // convert up to 6 digit escapes to characters
    str = str.replace(/&#x([A-Fa-f0-9]{1,6});/g,
        function(matchstr, parens) {
            return bizagi.util.hex2char(parens);
        });

    return str;
};

/**
 * Converts a single hex number to a character
 * @params: hex: string, the hex codepoint to be converted
 */
bizagi.util.hex2char = function(hex) {
    // note that no checking is performed to ensure that this is just a hex number, eg. no spaces etc
    var result = "";
    var n = parseInt(hex, 16);

    if (n <= 0xFFFF) {
        result += String.fromCharCode(n);
    } else if (n <= 0x10FFFF) {
        n -= 0x10000;
        result += String.fromCharCode(0xD800 | (n >> 10)) + String.fromCharCode(0xDC00 | (n & 0x3FF));
    } else {
        //result += 'hex2Char error: Code point out of range: ' + dec2hex(n);
        result += "hex2Char error: Code point out of range";
    }

    return result;
};

/**
 * Check if it is a valid date
 * @param {} params
 * @returns {}
 */
function isValidDate(params) {
    if (typeof (params) != "undefined") {
        var parseDate = new Date(params);
        return !isNaN(parseDate.valueOf());
    } else return false;
};

/** 
 * Parses a value to return the correct boolean value
 * @param {} value 
 * @returns {} 
 */
bizagi.util.parseBoolean = function (value) {
    if (value === undefined) {
        return null;
    }

    if (value === null) {
        return null;
    }

    if (value === "") {
        return null;
    }

    // Parse true values
    if (value === true || value === 1 || value.toString() === "true") {
        return true;
    }
    if (value.toString().toLowerCase() === "true") {
        return true;
    }

    // Parse false values
    if ((value !== null && value === false) || value === 0 || value.toString() === "false") {
        return false;
    }
    if (value.toString().toLowerCase() === "false") {
        return false;
    }

    return null;
};

/**
 * Defines a date time formatter that will be available globally
 */
bizagi.util.monthNames = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
bizagi.util.dayNames = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');

bizagi.util.dateFormatter = new function() {
    this.LZ = function(x) {
        return (x < 0 || x > 9 ? "" : "0") + x;
    };
    /*
     *   isDate ( date_string, format_string )
     *   Returns true if date string matches format of format string and
     *   is a valid date. Else returns false.
     *   It is recommended that you trim whitespace around the value before
     *   passing it to this function, as whitespace is NOT ignored!
     */
    this.isDate = function(val, format) {
        var date = this.getDateFromFormat(val, format);
        if (date == 0) {
            return false;
        }
        return true;
    };

    this.getRelativeTime = function(date, dateFormat, onlyUnitsTime) {
        var self = this;
        var now = new Date();
        var time = (date instanceof Date) ? date : kendo.parseDate(date, dateFormat);
        var diff = now.getTime() - time.getTime();
        var timeDiff = getTimeDiffDescription(diff, 'year', 31536000000, onlyUnitsTime);

        if (!timeDiff) {
            timeDiff = getTimeDiffDescription(diff, 'month', 2628000000, onlyUnitsTime);
            if (!timeDiff) {
                timeDiff = getTimeDiffDescription(diff, 'week', 604800000, onlyUnitsTime);
                if (!timeDiff) {
                    timeDiff = getTimeDiffDescription(diff, 'day', 86400000, onlyUnitsTime);
                    if (!timeDiff) {
                        timeDiff = getTimeDiffDescription(diff, 'hour', 3600000, onlyUnitsTime);
                        if (!timeDiff) {
                            timeDiff = getTimeDiffDescription(diff, 'minute', 60000, onlyUnitsTime);
                            if (!timeDiff) {
                                if (onlyUnitsTime) {
                                    if (diff === 0) {
                                        timeDiff = getTimeDiffDescription(diff + 1, 'minute', 1, onlyUnitsTime);
                                    } else {
                                        timeDiff = getTimeDiffDescription(diff, 'minute', 1, onlyUnitsTime);
                                    }
                                } else {
                                    timeDiff = getTimeDiffDescription(diff, 'second', 2000, onlyUnitsTime);
                                    if (!timeDiff) {
                                        timeDiff = bizagi.localization.getResource("workportal-relativetime-momentago");
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return timeDiff;

        /*
         * Get Time Difference
         */
        function getTimeDiffDescription(diff, unit, timeDivisor, onlyUnitsTime) {
            var unitAmount = (diff / timeDivisor).toFixed(0);

            if (unitAmount > 0) {
                if (onlyUnitsTime) {
                    return (unitAmount == 1 ? bizagi.localization.getResource("workportal-relativetime-" + unit)
                        .replace("%s", unitAmount) : bizagi.localization.getResource("workportal-relativetime-" + unit +
                            "s").replace("%s", unitAmount));
                } else {
                    var resourceAgo = bizagi.localization.getResource("workportal-relativetime-ago");
                    return (unitAmount == 1 ? resourceAgo.replace("%s", bizagi.localization
                            .getResource("workportal-relativetime-" + unit).replace("%s", unitAmount)) : resourceAgo
                        .replace("%s", bizagi.localization.getResource("workportal-relativetime-" + unit + "s")
                            .replace("%s", unitAmount)));
                }
            } else {
                return null;
            }
        }
    };

    /*
     *   compareDates(date1,date1format,date2,date2format)
     *   Compare two date strings to see which is greater.
     *   Returns:
     *   1 if date1 is greater than date2
     *   0 if date2 is greater than date1 of if they are the same
     *  -1 if either of the dates is in an invalid format
     */
    this.compareDates = function(date1, dateformat1, date2, dateformat2) {
        var d1 = getDateFromFormat(date1, dateformat1);
        var d2 = getDateFromFormat(date2, dateformat2);
        if (d1 == 0 || d2 == 0) {
            return -1;
        } else if (d1 > d2) {
            return 1;
        }
        return 0;
    };
    /*
     *   getDifferenceBetweenDates(date1,date2, unit)
     *   Compare two date objects to see difference between them. The number result by unit specified.
     *
     *   Returns:
     *   Difference value between two dates.
     *   Message string if either of the dates is in an invalid format
     */
    this.getDifferenceBetweenDates = function(date1, date2, unit) {
        if (date1 instanceof Date && date1 instanceof Date) {
            switch (unit) {
            case "seconds":
                return (date2.getTime() - date1.getTime()) / 1000;
            case "milliseconds":
                return (date2.getTime() - date1.getTime());
            default:
                return "unit is not Defined";
            }
        } else {
            return "one param not is Date";
        }

    };
    /*
     *   formatDate (date_object, format)
     *   Returns a date in the output format specified.
     *   The format string uses the same abbreviations as in getDateFromFormat()
     */
    this.formatDate = function(date, format, i18n) {
        // Check if date is valid
        if (!isValidDate(date) || date == 0) {
            return "";
        }

        var monthNames = bizagi.util.monthNames;
        var dayNames = bizagi.util.dayNames;
        format = format + "";
        var result = "";
        var i_format = 0;
        var c;
        var token;
        var y = date.getFullYear() + "";
        var M = date.getMonth() + 1;
        var d = date.getDate();
        var E = date.getDay();
        var H = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();
        var f = date.getMilliseconds();
        // Convert real date parts into formatted versions
        var value = new Object();

        if (bizagi.util.isValidResource("datePickerRegional")) {
            i18n = bizagi.localization.getResource("datePickerRegional");
        }

        if (i18n) {
            var months = i18n.monthNames.concat(i18n.monthNamesShort);
            var days = i18n.dayNames.concat(i18n.dayNamesShort);
            monthNames = monthNames.toString() === months.toString() ? monthNames : months;
            dayNames = dayNames.toString() === days.toString() ? dayNames : days;
        }

        if (y.length < 4 || (y.charAt(0) === "-" && y.length < 5)) {
            y = "" + (y - 0 + 1900);
        }
        value["y"] = "" + y;
        value["yyyy"] = y;
        value["yy"] = y.substring(2, 4);
        value["M"] = M;
        value["MM"] = this.LZ(M);
        value["MMM"] = monthNames[M + 11];
        value["MMMM"] = monthNames[M - 1];
        value["NNN"] = monthNames[M + 11];
        value["d"] = d;
        value["dd"] = this.LZ(d);
        value["ddd"] = dayNames[E + 7];
        value["dddd"] = dayNames[E];
        value["E"] = dayNames[E + 7];
        value["EE"] = dayNames[E];
        value["H"] = H;
        value["HH"] = this.LZ(H);
        value["tt"] = H < 12 ? "am" : "pm";
        value["TT"] = H < 12 ? "AM" : "PM";


        if (H == 0) {
            value["h"] = 12;
        } else if (H > 12) {
            value["h"] = H - 12;
        } else {
            value["h"] = H;
        }
        value["hh"] = this.LZ(value["h"]);
        if (H > 11) {
            value["K"] = H - 12;
        } else {
            value["K"] = H;
        }
        value["k"] = H + 1;
        value["KK"] = this.LZ(value["K"]);
        value["kk"] = this.LZ(value["k"]);
        if (H > 11) {
            value["a"] = "PM";
        } else {
            value["a"] = "AM";
        }
        value["m"] = m;
        value["mm"] = this.LZ(m);
        value["s"] = s;
        value["ss"] = this.LZ(s);
        value["FFF"] = f;

        while (i_format < format.length) {
            c = format.charAt(i_format);
            token = "";
            while ((format.charAt(i_format) == c) && (i_format < format.length)) {
                token += format.charAt(i_format++);
            }
            if (value[token] != null) {
                result = result + value[token];
            } else {
                result = result + token;
            }
        }
        return result;
    };
    /*
     *   getDateFromFormat( date_string , format_string )
     *
     *   This function takes a date string and a format string. It matches
     *   If the date string matches the format string, it returns the
     *   getTime() of the date. If it does not match, it returns 0.
     */
    this.getDateFromFormat = function(val, format, i18n) {
        var monthNames = bizagi.util.monthNames;
        var dayNames = bizagi.util.dayNames;
        val = val + "";
        format = format + "";
        var i_val = 0;
        var i_format = 0;
        var c;
        var token;
        var x = 0, y = 0;
        var now = new Date();
        var year = now.getYear();
        var month = now.getMonth() + 1;
        var date = 1;
        var hh = now.getHours();
        var mm = now.getMinutes();
        var ss = now.getSeconds();
        var FFF = now.getMilliseconds();
        var ampm = "";

        if (bizagi.util.isValidResource("datePickerRegional")) {
            i18n = bizagi.localization.getResource("datePickerRegional");
        }

        if (i18n) {
            var months = i18n.monthNames.concat(i18n.monthNamesShort);
            var days = i18n.dayNames.concat(i18n.dayNamesShort);
            monthNames = monthNames.toString() === months.toString() ? monthNames : months;
            dayNames = dayNames.toString() === days.toString() ? dayNames : days;
        }

        while (i_format < format.length) {
            // Get next token from format string
            c = format.charAt(i_format);
            token = "";
            while ((format.charAt(i_format) == c) && (i_format < format.length)) {
                token += format.charAt(i_format++);
            }
            // Extract contents of value based on format token
            if (token == "yyyy" || token == "yy" || token == "y") {
                if (token == "yyyy") {
                    x = 4;
                    y = 4;
                }
                if (token == "yy") {
                    x = 2;
                    y = 2;
                }
                if (token == "y") {
                    x = 2;
                    y = 4;
                }
                year = _getInt(val, i_val, x, y);
                if (year == null) {
                    return 0;
                }
                i_val += year.length;
                if (year.length == 2) {
                    if (year > 70) {
                        year = 1900 + (year - 0);
                    } else {
                        year = 2000 + (year - 0);
                    }
                }
            } else if (token == "MMMM" || token == "MMM" || token == "NNN") {
                month = 0;
                for (var i = 0; i < monthNames.length; i++) {
                    var month_name = monthNames[i];
                    if (val.substring(i_val, i_val + month_name.length).toLowerCase() == month_name.toLowerCase()) {
                        if (token == "MMMM" || token == "MMM" || (token == "NNN" && i > 11)) {
                            month = i + 1;
                            if (month > 12) {
                                month -= 12;
                            }
                            i_val += month_name.length;
                            break;
                        }
                    }
                }
                if ((month < 1) || (month > 12)) {
                    return 0;
                }
            } else if (token == "dddd" || token == "EE" || token == "E") {
                for (var j = 0; j < dayNames.length; j++) {
                    var day_name = dayNames[j];
                    if (val.substring(i_val, i_val + day_name.length).toLowerCase() == day_name.toLowerCase()) {
                        i_val += day_name.length;
                        break;
                    }
                }
            } else if (token == "MM" || token == "M") {
                month = _getInt(val, i_val, 1, 2);
                if (month == null || (month < 1) || (month > 12)) {
                    return 0;
                }
                i_val += month.length;
            } else if (token == "dd" || token == "d") {
                date = _getInt(val, i_val, 1, 2);
                if (date == null || (date < 1) || (date > 31)) {
                    return 0;
                }
                i_val += date.length;
            } else if (token == "hh" || token == "h") {
                hh = _getInt(val, i_val, token.length, 2);
                if (hh == null || (hh < 1) || (hh > 12)) {
                    return 0;
                }
                i_val += hh.length;
            } else if (token == "HH" || token == "H") {
                hh = _getInt(val, i_val, token.length, 2);
                if (hh == null || (hh < 0) || (hh > 23)) {
                    return 0;
                }
                i_val += hh.length;
            } else if (token == "KK" || token == "K") {
                hh = _getInt(val, i_val, token.length, 2);
                if (hh == null || (hh < 0) || (hh > 11)) {
                    return 0;
                }
                i_val += hh.length;
            } else if (token == "kk" || token == "k") {
                hh = _getInt(val, i_val, token.length, 2);
                if (hh == null || (hh < 1) || (hh > 24)) {
                    return 0;
                }
                i_val += hh.length;
                hh--;
            } else if (token == "mm" || token == "m") {
                mm = _getInt(val, i_val, token.length, 2);
                if (mm == null || (mm < 0) || (mm > 59)) {
                    return 0;
                }
                i_val += mm.length;
            } else if (token == "ss" || token == "s") {
                ss = _getInt(val, i_val, token.length, 2);
                if (ss == null || (ss < 0) || (ss > 59)) {
                    return 0;
                }
                i_val += ss.length;
            } else if (token == "FFF") {
                ff = _getInt(val, i_val, token.length, 3);
                if (ff == null || (ff < 0) || (ff > 999)) {
                    return 0;
                }
                i_val += ff.length;
            } else if (token == "a") {
                if (val.substring(i_val, i_val + 2).toLowerCase() == "am") {
                    ampm = "AM";
                } else if (val.substring(i_val, i_val + 2).toLowerCase() == "pm") {
                    ampm = "PM";
                } else {
                    return 0;
                }
                i_val += 2;
            } else {
                if (val.substring(i_val, i_val + token.length) != token) {
                    return 0;
                } else {
                    i_val += token.length;
                }
            }
        }

        // Is date valid for month?
        if (month == 2) {
            // Check for leap year
            if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) { // leap year
                if (date > 29) {
                    return 0;
                }
            } else {
                if (date > 28) {
                    return 0;
                }
            }
        }
        if ((month == 4) || (month == 6) || (month == 9) || (month == 11)) {
            if (date > 30) {
                return 0;
            }
        }
        // Correct hours value
        if (hh < 12 && ampm == "PM") {
            hh = hh - 0 + 12;
        } else if (hh > 11 && ampm == "AM") {
            hh -= 12;
        }
        var newdate = new Date(year, month - 1, date, hh, mm, ss);
        return newdate;

        /*
         *   Utility method for parsing in getDateFromFormat()
         */
        function _isInteger(_val) {
            var digits = "1234567890";
            for (var k = 0; k < _val.length; k++) {
                if (digits.indexOf(_val.charAt(k)) == -1) {
                    return false;
                }
            }
            return true;
        };

        /*
         *   Utility method for parsing in getDateFromFormat()
         */
        function _getInt(str, l, minlength, maxlength) {
            for (var m = maxlength; m >= minlength; m--) {
                var _token = str.substring(l, l + m);
                if (_token.length < minlength) {
                    return null;
                }
                if (_isInteger(_token)) {
                    return _token;
                }
            }
            return null;
        };
    };
    /*
     * parseDate( date_string [, prefer_euro_format] )
     *
     * This function takes a date string and tries to match it to a
     * number of possible date formats to get the value. It will try to
     * match against the following international formats, in this order:
     * y-M-d   MMM d, y   MMM d,y   y-MMM-d   d-MMM-y  MMM d
     * M/d/y   M-d-y      M.d.y     MMM-d     M/d      M-d
     * d/M/y   d-M-y      d.M.y     d-MMM     d/M      d-M
     * A second argument may be passed to instruct the method to search
     * for formats like d/M/y (european format) before M/d/y (American).
     * Returns a Date object or null if no patterns match.
     */
    this.parseDate = function(val) {
        var preferEuro = (arguments.length == 2) ? arguments[1] : false;
        var generalFormats = new Array('y-M-d', 'MMM d, y', 'MMM d,y', 'y-MMM-d', 'd-MMM-y', 'MMM d');
        var monthFirst = new Array('M/d/y', 'M-d-y', 'M.d.y', 'MMM-d', 'M/d', 'M-d');
        var dateFirst = new Array('d/M/y', 'd-M-y', 'd.M.y', 'd-MMM', 'd/M', 'd-M');
        var checkList = new Array(generalFormats, preferEuro ? dateFirst : monthFirst, preferEuro ? monthFirst : dateFirst);
        var d;
        for (var i = 0; i < checkList.length; i++) {
            var l = window[checkList[i]];
            for (var j = 0; j < l.length; j++) {
                d = getDateFromFormat(val, l[j]);
                if (d != 0) {
                    return new Date(d);
                }
            }
        }
        return null;
    };
    /*
     *   Method to analyze a time format and checks separator, and hour format, and seconds
     */
    this.analyzeTimeFormat = function(timeFormat) {
        var i = 0;
        var c;
        // Define return object
        var returnObj = {
            show24Hours: false,
            showSeconds: false,
            separator: ":"
        };
        // Analize format
        var token, lastToken = "";
        while (i < timeFormat.length) {
            // Get next token from format string
            c = timeFormat.charAt(i);
            token = "";
            while ((timeFormat.charAt(i) == c) && (i < timeFormat.length)) {
                token += timeFormat.charAt(i++);
            }

            // Extract contents of value based on format token
            if (token == "hh" || token == "h") {
                lastToken = token;
                returnObj.show24Hours = false;
            } else if (token == "HH" || token == "H") {
                lastToken = token;
                returnObj.show24Hours = true;
            } else if (token == "mm" || token == "m") {
                lastToken = token;
            } else if (token == "ss" || token == "s") {
                lastToken = token;
                returnObj.showSeconds = true;
            } else if (token == "a") {
                lastToken = token;
            } else {
                if (lastToken.toUpperCase() == "H" || lastToken.toUpperCase() == "HH") {
                    returnObj.separator = token;
                }
            }
        }

        return returnObj;
    };
    this.getDateFromInvariant = function(value, showTime) {
        value = (value == null) ? "" : value;
        value = (typeof value != "string") ? value.toString() : value;
        var INVARIANT_FORMAT = "MM/dd/yyyy" + (showTime ? " H:mm:ss" : "");
        if (showTime) {
            if (value && (value.toLowerCase().indexOf("am") > 0 || value.toLowerCase().indexOf("pm") > 0)) {
                INVARIANT_FORMAT = "MM/dd/yyyy h:mm:ss a";
            }
        }
        var date = bizagi.util.dateFormatter.getDateFromFormat(value, INVARIANT_FORMAT);
        // Also try to read the date with full format if the last instruction didn't success
        if (date == 0 && !showTime) {
            INVARIANT_FORMAT = "MM/dd/yyyy H:mm:ss";
            date = bizagi.util.dateFormatter.getDateFromFormat(value, INVARIANT_FORMAT);
        } else if (date == 0 && showTime && value != null && value != "") {
            INVARIANT_FORMAT = "MM/dd/yyyy";
            date = bizagi.util.dateFormatter.getDateFromFormat(value, INVARIANT_FORMAT);
            date.setHours(0, 0, 0, 0);
        }

        return date;
    };
    this.formatInvariant = function(date, showTime) {
        var INVARIANT_FORMAT = "MM/dd/yyyy" + (showTime ? " HH:mm:ss" : "");
        var formattedDate = bizagi.util.dateFormatter.formatDate(date, INVARIANT_FORMAT);
        return formattedDate;
    };
    this.getDateFromISO = function(value, showTime) {
        var ISO_FORMAT = "yyyy-MM-dd" + (showTime ? " HH:mm" : "");
        var date = bizagi.util.dateFormatter.getDateFromFormat(value, ISO_FORMAT);
        // If the date could not be parsed, try it out with seconds
        if (date == 0 && showTime) {
            ISO_FORMAT = "yyyy-MM-dd" + (showTime ? " HH:mm:ss" : "");
            date = bizagi.util.dateFormatter.getDateFromFormat(value, ISO_FORMAT);
        }

        // Also try to read the date with full format if the last instruction didn't success
        if (date == 0 && !showTime) {
            ISO_FORMAT = "yyyy-MM-dd HH:mm";
            date = bizagi.util.dateFormatter.getDateFromFormat(value, ISO_FORMAT);
            // If the date could not be parsed, try it out with seconds
            if (date == 0) {
                ISO_FORMAT = "yyyy-MM-dd HH:mm:ss";
                date = bizagi.util.dateFormatter.getDateFromFormat(value, ISO_FORMAT);
            }
        }

        return date;
    };
    this.formatISO = function(date, showTime) {
        var ISO_FORMAT = "yyyy-MM-dd" + (showTime ? " HH:mm" : "");
        var formattedDate = bizagi.util.dateFormatter.formatDate(date, ISO_FORMAT);
        return formattedDate;
    };
    this.sleep = function(delay) {
        // Delay in miliseconds
        var start = new Date().getTime();
        while (new Date().getTime() < start + delay) {
            // wait
        }
    };
    this.getDateFormatByDatePickerJqueryUI = function() {
        return bizagi.localization.getResource("dateFormat").replace("yyyy", "yy");
    }
};

/**
 * Generate unique number/name
 * @returns {} ID
 */
bizagi.util.uniqueID = function() {
        return Math.floor(Math.random() * (+new Date)).toString();
    },

// ------------------------------------------------------------------------
// OFFLINE UTILITIES
// ------------------------------------------------------------------------

/**
* Create notification of short duration, mainly used for offline processes
* @param {} params
* @returns {}
*/
bizagi.util.showNotification = function(params) {
    params = params || {};

    var doc = window.document;
    var type = params.type || "default";
    var template =
        "<div id='#=data.id#' class='sync-notification-offline-container bz-mo-icon #=data.icon#'>" +
            "    <span class='sync-notification-offline-title #=data.type#'>#=data.title#</span>" +
            "</div>";

    var synchronizationTmpl = kendo.template(template, { useWithBlock: false });
    var synchronization = $(synchronizationTmpl({
        id: (Math.floor(Date.now() / 1000)),
        icon: getIcon(type),
        type: type,
        title: params.text || ""
    }));

    synchronization.appendTo($("body", doc));

    if (typeof (bizagi.kendoMobileApplication) !== "undefined") {
        bizagiLoader().stop();
    }

    synchronization.fadeIn(1500, function() {
        synchronization.stop();
    });

    synchronization.fadeOut(2000, function() {
        synchronization.remove();
    });

    // Returns the icon associated to the messageType
    function getIcon(_icon) {
        switch (_icon) {
        case "info":
            return _icon + " bz-information-icon";
        case "warning":
            return _icon + " bz-ontime-normal";
        case "error":
            return _icon + " bz-overdue-normal";
        case "success":
            return _icon + " bz-upcoming-normal";
        default:
            return _icon + " bz-workonit";
        }
    }
};

/**
 * Check is offline form
 * @param {} container
 * @returns {}
 */
bizagi.util.isOfflineForm = function(params) {
    if (!bizagi.util.isTabletDevice() || typeof (params) === "undefined")
        return false;

    var context = params.context || null;
    var container = params.container || null;

    var formContainer = container !== null
        ? container : (context !== null ? context.getFormContainer() : null);

    if (formContainer === null) {
        return false;
    }

    var formParams = formContainer.getParams() || {};
    var isOfflineForm = typeof (formParams.isOfflineForm) !== "undefined"
        && bizagi.util.parseBoolean(formParams.isOfflineForm);

    return isOfflineForm;
};
/**
 * Active new menu Offline on Tablet
 * @param {} online
 * @returns {}
 */
bizagi.util.inputTray = function(isOnline) {
    var inputTray = "inbox";

    // Active new menu Offline on Tablet
    if (bizagi.util.isTabletDevice() && bizagi.util.hasOfflineFormsEnabled()) {
        inputTray = bizagi.util.getItemLocalStorage("inputtray");
        if (inputTray == null) {
            return isOnline ? "inbox" : "true";
        } else {
            return !isOnline && inputTray === "inbox" ? "true" : inputTray;
        }
    }

    return inputTray;
};

/**
 * Method to detect Android visitors
 * @returns {} 
 */
bizagi.util.isAndroid = function () {
    return (navigator.userAgent.toLowerCase().indexOf("android") > -1);
};

// ------------------------------------------------------------------------
// POLIFILL
// ------------------------------------------------------------------------

if (!Date.prototype.toISOStringHM) {
    /**
     * convert to ISO whit plus hours an minutes, without Z
     */
    (function() {

        function pad(number) {
            if (number < 10) {
                return "0" + number;
            }
            return number;
        }

        Date.prototype.toISOStringHM = function() {
            var _timeZoneOffset = this.getTimezoneOffset();
            var _positiveTimeZone = (_timeZoneOffset >= 0);
            _timeZoneOffset = _positiveTimeZone ? _timeZoneOffset : (_timeZoneOffset * (-1));

            return this.getFullYear() +
                "-" + pad(this.getMonth() + 1) +
                "-" + pad(this.getDate()) +
                "T" + pad(this.getHours()) +
                ":" + pad(this.getMinutes()) +
                ":" + pad(this.getSeconds()) +
                (_positiveTimeZone ? "-" : "+") + pad((_timeZoneOffset / 60).toFixed(0)) +
                ":" + pad(_timeZoneOffset % 60);
        };

    }());
}

if (!String.prototype.startsWith) {
    /**
     * The startsWith method determines whether a string begins with the characters of another string
     * @param {} stringBuscada
     * @param {} posicion
     * @returns {} returning true or false as appropriate.
     */
    String.prototype.startsWith = function(stringBuscada, posicion) {
        posicion = posicion || 0;
        return this.indexOf(stringBuscada, posicion) === posicion;
    };
}

if (!String.prototype.endsWith) {
    /**
     * The endsWith method determines whether a string ends with the characters of another string
     * @param {} searchString
     * @param {} position
     * @returns {} returning true or false as appropriate.
     */
    String.prototype.endsWith = function(searchString, position) {
        var subjectString = this.toString();
        if (typeof position !== 'number' || !isFinite(position)
            || Math.floor(position) !== position || position > subjectString.length) {
            position = subjectString.length;
        }

        position -= searchString.length;
        var lastIndex = subjectString.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
}

if (![].find) {
    Array.prototype.find = function (predicate) {
        if (this == null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}


// ------------------------------------------------------------------------
// BIZAGI VERSION
// ------------------------------------------------------------------------

/**
 * Version validation module
 * @module bizagi.version
 * @memberof bizagi/util/mobile
 */
bizagi.version = {
    /**
     * Compares two string version values.
     *
     * Example:
     * version.compare('1.1', '1.2') => -1
     * version.compare('1.1', '1.1') =>  0
     * version.compare('1.2', '1.1') =>  1
     * version.compare('2.23.3', '2.22.3') => 1
     *
     * Returns:
     * -1 = left is LOWER
     *  0 = when EQUAL
     *  1 = left is GREATER
     *
     * @function
     * @param {String} left  Version #1
     * @param {String} right Version #2
     * @return {Integer}
     * @author Nelson Daza
     * @since 2016-11-03
     */
    compare: function(left, right) {
        var a = (left + "").split('.'),
            b = (right + "").split('.'),
            i = 0,
            len = Math.max(a.length, b.length);

        for (; i < len; i++) {
            if ((a[i] && !b[i] && parseInt(a[i]) > 0) || (parseInt(a[i]) > parseInt(b[i]))) {
                return 1;
            } else if ((b[i] && !a[i] && parseInt(b[i]) > 0) || (parseInt(a[i]) < parseInt(b[i]))) {
                return -1;
            }
        }

        return 0;
    },
    /**
     * Scope definition for version validation module
     * @module bizagi.version.scope
     * @memberof bizagi/util/mobile
     */
    scope: {
        /**
         * Returns the actual version of the scope.
         * @function
         * @return {String}
         */
        actual: function() {
            return '1.0.0'
        },
        /**
         * Returns the result of vlaidate one or two conditions
         * @function
         * @return {Boolean}
         */
        validate: function(validVersion, channel){
            if(channel && bizagi.loader.channel){
                return  validVersion && channel === bizagi.loader.channel;
            }

            return validVersion;
        },
        /**
         * Returns whether or not the actual version is EQUAL to testVersion.
         * @function
         * @param {String} testVersion Version to test
         * @return {Boolean}
         */
        equalsTo: function(testVersion, channel) {
            var validVersion = bizagi.version.compare(this.actual(), testVersion) == 0;

            return this.validate(validVersion, channel);
        },
        notEqualsTo: function(testVersion, channel) {
            var validVersion = bizagi.version.compare(this.actual(), testVersion) != 0;

            if(channel){
                console.warn("The parameter \"channel\" will be ignored. Please be carefull.");
            }

            return this.validate(validVersion);
        },
        /**
         * Returns whether or not the actual version is HIGER than testVersion.
         * @function
         * @param {String} testVersion Version to test
         * @return {Boolean}
         */
        greaterThan: function(testVersion, channel) {
            var validVersion = bizagi.version.compare(this.actual(), testVersion) > 0;

            return this.validate(validVersion, channel);
        },
        lessThan: function(testVersion, channel) {
            var validVersion = bizagi.version.compare(this.actual(), testVersion) < 0;

            return this.validate(validVersion, channel);
        },
        /**
         * Returns whether or not the actual version is HIGER or EQUAL to testVersion.
         * @function
         * @param {String} testVersion Version to test
         * @return {Boolean}
         */
        greaterThanOrEqualsTo: function(testVersion, channel) {
            var validVersion = bizagi.version.compare(this.actual(), testVersion) >= 0;

            return this.validate(validVersion, channel);
        },
        lessThanOrEqualsTo: function(testVersion, channel) {
            var validVersion = bizagi.version.compare(this.actual(), testVersion) <= 0;

            return this.validate(validVersion, channel);
        },
        /**
         * Returns whether or not the actual version is BETWEEN two testVersions.
         * @function
         * @param {String} testVersion1 Lower version to test
         * @param {String} testVersion2 Higher version to test
         * @return {Boolean}
         */
        between: function(testVersion1, testVersion2, channel) {
            if (bizagi.version.compare(testVersion1, testVersion2) == 1) {
                var testVersion = testVersion1;
                testVersion1 = testVersion2;
                testVersion2 = testVersion;
            }
            var validVersion = (bizagi.version.compare(this.actual(), testVersion1) > 0 &&
                bizagi.version.compare(this.actual(), testVersion2) < 0);

            return this.validate(validVersion, channel);
        },
        notBetween: function(testVersion1, testVersion2, channel) {
            if(channel){
                console.warn("The parameter \"channel\" will be ignored. Please be carefull.");
            }

            // This is cause ! + && are less expensive than || the 50% of times
            return !this.between(testVersion1, testVersion2);
        },
        /**
         * Returns whether or not the actual version is BETWEEN two testVersions or EQUAL to one.
         * @function
         * @param {String} testVersion1 Lower version to test
         * @param {String} testVersion2 Higher version to test
         * @return {Boolean}
         */
        betweenOrEqualsTo: function(testVersion1, testVersion2, channel) {
            if (bizagi.version.compare(testVersion1, testVersion2) == 1) {
                var testVersion = testVersion1;
                testVersion1 = testVersion2;
                testVersion2 = testVersion;
            }
            var validVersion = (bizagi.version.compare(this.actual(), testVersion1) >= 0 &&
                bizagi.version.compare(this.actual(), testVersion2) <= 0);

            return this.validate(validVersion, channel);
        },
        notBetweenOrEqualsTo: function(testVersion1, testVersion2, channel) {
            if(channel){
                console.warn("The parameter \"channel\" will be ignored. Please be carefull.");
            }

            // This is cause ! + && are less expensive than || the 50% of times
            return !this.betweenOrEqualsTo(testVersion1, testVersion2);
        }
    }
};

/**
 * Server definition for version validation module
 * @module bizagi.version.server
 * @memberof bizagi/util/mobile
 * @borrows {bizagi.version.scope}
 */
bizagi.version.server = $.extend({}, bizagi.version.scope, {
    actual: function() {
        if (typeof (BIZAGI_SERVER_VERSION) !== "undefined" && !bizagi.util.isEmpty(BIZAGI_SERVER_VERSION)) {
            return BIZAGI_SERVER_VERSION;
        }
        return bizagi.loader.version;
    }
});

/**
 * Client definition for version validation module
 * @module bizagi.version.server
 * @memberof bizagi/util/mobile
 * @borrows {bizagi.version.client}
 */
bizagi.version.client = $.extend({}, bizagi.version.scope, {
    actual: function() {
        return bizagi.loader.version;
    }
});

// ------------------------------------------------------------------------
// TOGGLE-FEATURE
// ------------------------------------------------------------------------

/**
 * Verify the offline forms is enabled
 * @returns {} 
 */
bizagi.util.hasOfflineFormsEnabled = function() {
    return typeof (BIZAGI_ENABLE_OFFLINE_FORMS) !== "undefined"
        && bizagi.util.parseBoolean(BIZAGI_ENABLE_OFFLINE_FORMS) === true;
};

/**
 * Verify the flat design is enabled
 * @returns {} 
 */
bizagi.util.isFlatDesignEnabled = function() {
    // return bizagi.isFlatDesignEnabled();
    return typeof (BIZAGI_ENABLE_FLAT) !== "undefined" && bizagi.util.parseBoolean(BIZAGI_ENABLE_FLAT) === true;
};

/**
 * Validate the mobile grid is enabled
 * @returns {}
 */
bizagi.util.isMobileGridEnabled = function () {
    return typeof (BIZAGI_ENABLE_MOBILE_GRID) !== "undefined"
        && bizagi.util.parseBoolean(BIZAGI_ENABLE_MOBILE_GRID) === true;
};

/**
 * Validate the mobile grid is enabled
 * @returns {}
 */
bizagi.util.isNativeHeaderEnabled = function() {
    return typeof (NATIVE_HEADER_ENABLE) !== "undefined" &&
        bizagi.util.parseBoolean(NATIVE_HEADER_ENABLE) === true;
};

/**
 * Validate the Quick search is enabled
 * @returns {}
 */
bizagi.util.isQuickSearchEnabled = function() {
    return typeof (BIZAGI_ENABLE_QUICK_SEARCH) !== "undefined" &&
        bizagi.util.parseBoolean(BIZAGI_ENABLE_QUICK_SEARCH) === true;
};

/** 
 * Verify the OAuth2 is enabled
 * @returns {} 
 */
bizagi.util.isOAuth2Enabled = function() {
    // return bizagi.isOAuth2Enabled();
    return typeof (BIZAGI_AUTH_TYPE) !== "undefined" && BIZAGI_AUTH_TYPE === "OAuth";
};

/**
 * Get native component
 * @returns {}
 */
bizagi.util.getNativeComponent = function () {
    // return bizagi.getNativeComponent();
    return typeof (BIZAGI_NATIVE_COMPONENT) !== "undefined" ? BIZAGI_NATIVE_COMPONENT : "";    
};

/**
 * Check server version
 * @returns {}
 */
bizagi.util.isVersionSupported = function() {
    var supported = true;

    if (typeof (BIZAGI_SERVER_VERSION) !== "undefined" && !bizagi.util.isEmpty(BIZAGI_SERVER_VERSION)) {
        var version = BIZAGI_SERVER_VERSION.match(/\d+\.\d+/);
        supported = version ? (parseFloat(version.shift()) >= 11.0) : true;
    }

    return supported;
};

/**
 * Get server channel
 * @returns {}
 */
bizagi.util.getChannelType = function() {
    if (typeof (BIZAGI_SERVER_CHANNEL) !== "undefined" && !bizagi.util.isEmpty(BIZAGI_SERVER_CHANNEL)) {
        return BIZAGI_SERVER_CHANNEL;
    }
    return bizagi.loader.channel || "";
};

// ------------------------------------------------------------------------
// NATIVE-HYBRID ENVIRONMENT
// ------------------------------------------------------------------------

/**
 * Cordova component is supported
 * @returns {} 
 */
bizagi.util.isCordovaSupported = function() {
    return typeof (cordova) !== "undefined";
};

/**
 * Native plugin of Cordova is supported 
 * @returns {} 
 */
bizagi.util.isNativePluginSupported = function() {
    return typeof (bizagiapp) !== "undefined";
};

/**
 * Tablet native
 * @returns {} 
 */
bizagi.util.isTabletNativeSupported = function () {
    return typeof (bizagiapp) !== "undefined" && bizagi.util.isTabletDevice();
};

/**
 * Smartphone native
 * @returns {} 
 */
bizagi.util.isSmartphoneNativeSupported = function () {
    return typeof (bizagiapp) !== "undefined" && bizagi.util.isSmartphoneDevice();
};

// ------------------------------------------------------------------------
// BACKWARD COMPATIBILITY
// ------------------------------------------------------------------------

/**
 * Method to detect IE visitors
 * @returns {} 
 */
bizagi.util.isIE = function() {
    return (navigator.appName.indexOf("Internet Explorer") > 0 || !!navigator.userAgent.match(/Trident/));
};

/*
* Method to detect IE8 visitors
*/
bizagi.util.isIE8 = function () {
    return bizagi.util.isIE() && document.documentMode == 8;
};
/*
* Method to detect IE9 visitors
*/
bizagi.util.isIE9 = function () {
    return bizagi.util.isIE() && document.documentMode == 9;
};

/** 
 * Method to detect IE10 visitors
 * @returns {} 
 */
bizagi.util.isIE10 = function () {
    return bizagi.util.isIE() && document.documentMode == 10;
};

/** 
 * Method to detect IE11 visitors
 * @returns {} 
 */
bizagi.util.isIE11 = function () {
    return !!navigator.userAgent.match(/Trident\/7.0/) && !navigator.userAgent.match(/MSIE/i);
};

/**
 * Method to detect iOS version Higher than 5
 * @returns {} 
 */
bizagi.util.isIphoneHigherIOS5 = function () {

    if (this.value != undefined)
        return this.value;
    return this.value = RegExp("OS\\s*(5|6|7|8)_*\\d").test(navigator.userAgent) && RegExp(" AppleWebKit/").test(navigator.userAgent);
};

/**
 * Method to detect iOS version 5
 * @returns {} 
 */
bizagi.util.isLessThanIOS5 = function () {
    if (navigator.userAgent.match(new RegExp(/CPU OS (1|2|3|4)/i))) {
        return true;
    } else {
        return false;
    }
};

bizagi.util.isIphoneAndLessIOS6 = function () {
    if (this.value != undefined)
        return this.value;
    return this.value = RegExp("OS\\s*(4|5|6)_*\\d").test(navigator.userAgent) && RegExp(" AppleWebKit/").test(navigator.userAgent);
};

/**
 * Method to detect IE version
 * @returns {} 
 */
bizagi.util.getInternetExplorerVersion = function () {
    if (!bizagi.util.isIE())
        return -1;
    return Number(document.documentMode);
};

/**
 * Decode data from encodeURI charset
 * @param {} value 
 * @returns {} 
 */
bizagi.util.decodeURI = function (value) {
    value = value || "";
    var finishDecoded = false;
    var decodedValue = value;
    var infinityControl;

    // Try to decode data value
    while (!finishDecoded) {
        try {
            infinityControl = decodeURI(decodedValue);
            if (infinityControl == decodedValue) {
                finishDecoded = true;
            } else {
                decodedValue = infinityControl;
            }
        } catch (e) {
            finishDecoded = true;
        }
    }

    return decodedValue;
};

/**
 * Determines if a control as a scrollbar 
 * @param {} element 
 * @param {} direction 
 * @returns {} 
 */
bizagi.util.hasScroll = function (el, direction) {
    if (el.length)
        el = el[0];
    direction = (direction === 'vertical') ? 'scrollTop' : 'scrollLeft';
    var result = !!el[direction];
    if (!result) {
        el[direction] = 1;
        result = !!el[direction];
        el[direction] = 0;
    }
    return result;
};

/**
 * Enables accesory bar
 */
if (bizagi.util.isNativePluginSupported() && window.cordova && window.cordova.plugins.Keyboard) {
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
}