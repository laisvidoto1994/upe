/**
 * Created by RicharU on 10/08/2015.
 */

module.exports =
{
    reporter: function (results, data, opts) {
        "use strict";

        var files = {},
            out = [],
            pairs = {
                "&": "&amp;",
                '"': "&quot;",
                "'": "&apos;",
                "<": "&lt;",
                ">": "&gt;"
            },
            fileName, i, issue, errorMessage;

        opts = opts || {};

        function encode(s) {
            for (var r in pairs) {
                if (typeof(s) !== "undefined") {
                    s = s.replace(new RegExp(r, "g"), pairs[r]);
                }
            }
            return s || "";
        }

        results.forEach(function (result) {
            // Register the file
            result.file = result.file.replace(/^\.\//, '');
            if (!files[result.file]) {
                files[result.file] = [];
            }

            // Create the error message
            errorMessage = result.error.reason;
            if (opts.verbose) {
                errorMessage += ' (' + result.error.code + ')';
            }

            var typeNo = result.error.code;
            var severity = '';
            switch (typeNo[0]) {
                case 'I':
                    severity = 'info';
                    break;
                case 'W':
                    severity = 'warning';
                    break;
                case 'E':
                    severity = 'error';
                    break;
            }

            // Add the error
            files[result.file].push({
                severity: severity,
                line: result.error.line,
                column: result.error.character,
                message: errorMessage,
                source: 'jshint.' + result.error.code,
                evidence: result.error.evidence
            });
        });

        out.push("<html encoding=\"utf-8\">");
        out.push("<style>html,h1{font-size:30px;color:#bbb;margin-top:0px;}body{color:#000;fnt-size:14px;font-family:Segoe UI,Arial,sans-serif;margin:0;padding:0;}body{padding:10px 40px;}table{width:100%;margin-bottom:20px;}tr.header{background:#ddd;font-weight:bold;border-bottom:none;}td{font-size:14px;padding:7px;border-top:none;border-left:1px black solid;border-bottom:1px black solid;border-right:none;}tr.pass td{color:#003b07;background:#B5D592;}tr.skip td{color:#7d3a00;background:#ffd24a;}tr.fail td{color:#5e0e00;background:#ff9c8a;}tr:first-child td{border-top:1px black solid; text-align: center;}td:last-child{border-right:1px black solid;}tr.overview{font-weight:bold;color:#777;}tr.overview td{padding-bottom:0px;border-bottom:none;}tr.system-out td{color:#777;}hr{height:2px;margin:30px 0;background:#000;border:none;} td.wrapper{min-width: 300px; max-width: 300px;} td.wrapper-rules{max-width: 200px;} td.wrapper, td.wrapper-rules{overflow: hidden;overflow-wrap: break-word;word-wrap: break-word;-ms-word-break: break-all;}</style>");

        out.push("<h1>JS Quality Report</h1>");
        out.push("<p>Last update :  " + new Date() + "</p>");

        out.push("<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
        out.push("<tr class=\"header\">");
        out.push("<td style=\"display: none;\">Type</td>");
        out.push("<td>#</td>");
        out.push("<td>Line</td>");
        out.push("<td>Description</td>");
        out.push("<td>Code</td>");
        out.push("<td>Rule</td>");
        out.push("</tr>");

        for (fileName in files) {
            if (files.hasOwnProperty(fileName)) {
                out.push("\t<tr><td colspan=\"5\">" + fileName + "</td></tr>");
                for (i = 0; i < files[fileName].length; i++) {
                    issue = files[fileName][i];

                    out.push("<tr class=\"skip\">");
                    out.push("<td>" + (i + 1) + "</td>");
                    out.push("<td style=\"display: none;\">" + issue.severity + "</td>");
                    out.push("<td>Line " + issue.line + ", col " + issue.column + "</td>");
                    out.push("<td class=\"wrapper\">" + encode(issue.message) + "</td>");
                    out.push("<td class=\"wrapper\">" + encode(issue.evidence) + "</td>");
                    out.push("<td>" + encode(issue.source) + "</td>");
                    out.push("</tr>");
                }
            }
        }

        out.push("</table>");
        out.push("</html>");

        console.log(out.join("\n"));
    }
};
