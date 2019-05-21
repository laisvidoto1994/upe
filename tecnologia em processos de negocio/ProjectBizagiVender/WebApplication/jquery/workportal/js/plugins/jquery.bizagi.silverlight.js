//jQuery Plugin for Silverlight 3 Embedding
//Ver 0.9 by Jeffrey Lee, http://blog.darkthread.net
(function ($) {

    if (!window.onSilverlightError) {
        window.onSilverlightError = function (sender, args) {

            var appSource =
                        (sender != null && sender != 0) ?
                        appSource = sender.getHost().Source : "";

            var errorType = args.ErrorType;
            var iErrorCode = args.ErrorCode;


            if (errorType == "ImageError" || errorType == "MediaError") {
                return;
            }

            var errMsg = [];

            errMsg.push("Unhandled Error in Silverlight Application " + appSource);
            errMsg.push("Code: " + iErrorCode + "    ");
            errMsg.push("Category: " + errorType + "       ");
            errMsg.push("Message: " + args.ErrorMessage + "     ");

            if (errorType == "ParserError") {
                errMsg.push("File: " + args.xamlFile + "     ");
                errMsg.push("Line: " + args.lineNumber + "     ");
                errMsg.push("Position: " + args.charPosition + "     ");
            }

            else if (errorType == "RuntimeError") {

                if (args.lineNumber != 0) {

                    errMsg.push("Line: " + args.lineNumber + "     ");
                    errMsg.push("Position: " + args.charPosition + "     ");
                }

                errMsg.push("MethodName: " + args.methodName + "     ");
            }

            throw new Error(errMsg.join("\n"));
        }
    }

    //seed for unique function name
    if (!window.dtsl_FuncUid)
        window.dtsl_FuncUid = 1000;

    $.fn.silverlightVideo = function (source, options) {

        var ratio = options.width / options.height;

        var defaults = {
            enableGPUAcceleration: true,
            initParams: "playerSettings = <Playlist>" +
								"<AutoLoad>true</AutoLoad>" +
								"<AutoPlay>true</AutoPlay>" +
								"<DisplayTimeCode>false</DisplayTimeCode>" +
								"<EnableCachedComposition>true</EnableCachedComposition>" +
								"<EnableOffline>true</EnableOffline>" +
								"<EnablePopOut>true</EnablePopOut>" +
                                "<StretchNonSquarePixels>StretchToFill</StretchNonSquarePixels>" +
								"<Items>" +
									"<PlaylistItem>" +
                                        "<Title>" + options.title + "</Title>" +
										"<Height>" + options.height + "</Height>" +
										"<IsAdaptiveStreaming>false</IsAdaptiveStreaming> " +
                                        "<MediaSource>http://compiledexperience.com/content/video/" + options.src + ".wmv</MediaSource>" +
										"<VideoCodec>VC1</VideoCodec>" +
										"<Width>" + options.width + "</Width>" +
                                        "<AspectRatioWidth>" + ratio + "</AspectRatioWidth>" +
                                        "<AspectRatioHeight>" + 1 + "</AspectRatioHeight>" +
									"</PlaylistItem>" +
								"</Items>" +
							"</Playlist>"
        };

        var settings = $.extend(defaults, options);

        $(this).silverlight(source, settings);
    };

    $.fn.silverlight = function (source, options) {

        var defaults = {
            id: "silverlightElement",
            onError: "onSilverlightError",
            background: "white",
            minRuntimeVersion: "3.0.40818.0",
            autoUpgrade: "true",
            enableHtmlAccess: "true",
            initParams: null,
            splashScreenSource: null,
            onSourceDownloadProgressChanged: null,
            onSourceDownloadComplete: null,
            onLoad: null,
            onResize: null,
            windowless: false,
            width: "100%",
            height: "100%"
        };

        var settings = $.extend(defaults, options);

        return this.each(function () {

            var a = [];

            a.push('<object id= "'+ settings.id +'"data="data:application/x-silverlight," type="application/x-silverlight-2" width="' + settings.width + '" height="' + settings.height + '">');
            a.push('<param name="source" value="' + source + '"/>');

            for (var p in settings) {

                if (p == "width" || p == "height") continue;

                var v = settings[p];

                if (v !== null) {

                    //event callback

                    if (p.indexOf("on") == 0 && $.isFunction(v)) {

                        var funcId = "ftsl_Func" + (window.dtsl_FuncUid++);

                        window[funcId] = v;

                        v = funcId;

                    }

                    a.push('<param name="' + p + '" value="' + v + '" />');
                }
            }

            a.push('<a href="http://go.microsoft.com/fwlink/?LinkID=149156&v=' + settings.minRuntimeVersion + '" style="text-decoration:none">');
            a.push('<img src="http://go.microsoft.com/fwlink/?LinkId=161376" alt="Get Microsoft Silverlight" style="border-style:none"/>');
            a.push('</a>');
            a.push('</object>');

            a.push('<iframe id="_sl_historyFrame" style="visibility:hidden;height:0px;width:0px;border:0px"></iframe>');

            $(this).prepend(a.join('\n'));

        });
    }

})(jQuery);