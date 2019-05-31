/**
 * Created by RicharU on 10/07/2015.
 */

exports.bizagiReport = {
    /* global CSSLint */
    CSSLintHTML: {
        //format information
        id: "csslint-html",
        name: "CSSLint HTML format",
        type: "lineal",
        //type: "grouped",
        /**
         * Return opening root XML tag.
         * @return {String} to prepend before all results
         */
        startFormat: function () {
            var self = this;
            var header = "";

            header += "<html encoding=\"utf-8\">";
            header += "<style>html,h1{font-size:30px;color:#bbb;margin-top:0px;}body{color:#000;fnt-size:14px;font-family:Segoe UI,Arial,sans-serif;margin:0;padding:0;}body{padding:10px 40px;}table{width:100%;margin-bottom:20px;}tr.header{background:#ddd;font-weight:bold;border-bottom:none;}td{font-size:14px;padding:7px;border-top:none;border-left:1px black solid;border-bottom:1px black solid;border-right:none;}tr.pass td{color:#003b07;background:#B5D592;}tr.skip td{color:#7d3a00;background:#ffd24a;}tr.fail td{color:#5e0e00;background:#ff9c8a;}tr:first-child td{border-top:1px black solid; text-align: center;}td:last-child{border-right:1px black solid;}tr.overview{font-weight:bold;color:#777;}tr.overview td{padding-bottom:0px;border-bottom:none;}tr.system-out td{color:#777;}hr{height:2px;margin:30px 0;background:#000;border:none;} td.wrapper{min-width: 300px; max-width: 300px;} td.wrapper-rules{max-width: 200px;} td.wrapper, td.wrapper-rules{overflow: hidden;overflow-wrap: break-word;word-wrap: break-word;-ms-word-break: break-all;}</style>";

            header += "<h1>CSS Quality Report</h1>";
            header += "<p>Last update :  " + new Date() + "</p>";
            header += "<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
            header += "<tr class=\"header\">";
            header += "<td style=\"display: none;\">Type</td>";
            header += "<td>" + (self.type === "grouped" ? "File" : "#") + "</td>";
            header += "<td>Line</td>";
            header += "<td>Description</td>";
            header += "<td>Code</td>";
            header += "<td>Rule</td>";
            header += "</tr>";

            return header;
        },

        /**
         * Return closing root XML tag.
         * @return {String} to append after all results
         */
        endFormat: function () {
            var footer = "</table></html>";
            return footer;
        },

        /**
         * Given CSS Lint results for a file, return output for this format.
         * @param results {Object} with error and warning messages
         * @param filename {String} relative file path
         * @param options {Object} (UNUSED for now) specifies special handling of output
         * @return {String} output for results
         */
        formatResults: function (results, filename, options) {
            var self = this;

            return self.formatterBasicHTML(results, filename, options);
        },

        /**
         * Given CSS Lint results for a file, return output for this format.
         * @param results {Object} with error and warning messages
         * @param filename {String} relative file path
         * @param options {Object} (UNUSED for now) specifies special handling of output
         * @returns {String}  output for results
         */
        formatterBasicHTML: function (results, filename, options) {
            var self = this;
            var messages = results.messages;
            var output = [];

            /**
             * Generate a source string for a rule.
             * Checkstyle source strings usually resemble Java class names e.g
             * net.csslint.SomeRuleName
             * @param {Object} rule
             * @return rule source as {String}
             */
            var generateSource = function (rule) {
                if (!rule || !("name" in rule)) {
                    return "";
                }

                return rule.name.replace(/\s/g, '');
            };

            /**
             * Replace special characters before write to output.
             *
             * Rules:
             *  - single quotes is the escape sequence for double-quotes
             *  - &lt; is the escape sequence for <
             *  - &gt; is the escape sequence for >
             *
             * @param {String} message to escape
             * @return string message as {String}
             */
            var escapeSpecialCharacters = function (str) {
                if (!str || str.constructor !== String) {
                    return "";
                }
                return str.replace(/\"/g, "'").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            };

            /**
             * Formatter lineal
             * @returns {}
             */
            var formatterLineal = function () {
                output.push("<tr><td colspan=\"5\">" + filename + "</td></tr>");

                messages.forEach(function (message, i) {
                    // Ignore rollups for now
                    if (!message.rollup) {
                        output.push("<tr class=\"skip\">");
                        output.push("<td>" + (i + 1) + "</td>");
                        output.push("<td>Line " + message.line + ", col " + message.col + "</td>");
                        output.push("<td class=\"wrapper\">" + escapeSpecialCharacters(message.message) + "</td>");
                        output.push("<td class=\"wrapper\">" + message.evidence + "</td>");
                        output.push("<td class=\"wrapper-rules\">" + generateSource(message.rule) + "</td>");
                        output.push("</tr>");
                    }
                });
            };

            /**
             * Formatter Grouped
             * @returns {}
             */
            var formatterGroup = function () {
                messages.forEach(function (message, i) {
                    // Ignore rollups for now
                    if (!message.rollup) {
                        output.push("<tr class=\"skip\">");
                        output.push("<td style=\"display: none;\">" + message.type + "</td>");
                        output.push("<td class=\"wrapper\">" + filename + "</td>");
                        output.push("<td>Line " + message.line + ", col " + message.col + "</td>");
                        output.push("<td class=\"wrapper\">" + escapeSpecialCharacters(message.message) + "</td>");
                        output.push("<td class=\"wrapper\">" + message.evidence + "</td>");
                        output.push("<td class=\"wrapper-rules\">" + generateSource(message.rule) + "</td>");
                        output.push("</tr>");
                    }
                });
            };

            if (messages.length > 0) {
                //console.log(JSON.stringify(message));
                self.type === "grouped" ? formatterGroup() : formatterLineal();
            }

            return output.join("");
        }
    }
};