

$.views.tags({
    loading: function () {
        return 'data-loading="true"';
    },

    adjustable: function () {
        return 'data-adjustable="true"';
    },

    layout: function (value) {
        var css = this.tagCtx.props.css || '';
        return 'class = "ui-bizagi-layout ' + css + '" layout = ' + value;
    },

    fileClass: function (fileName) {

        var baseClass = "ui-bizagi-files-";
        var filesExt = [".jpg", ".pdf", ".txt", ".png", ".pptx", ".docx", ".gif", ".rtfx", ".xlsx", ".zip", ".rar"];

        if ($.inArray(fileName, filesExt)) {
            return baseClass + fileName.slice(fileName.lastIndexOf(".") + 1).toLowerCase();
        } else {
            return baseClass + "regular";
        }
    },

    relativeTime: function (time) {

        var relativeTime = bizagi.util.dateFormatter.getRelativeTime(new Date(time), null, false);

        return "<span>" + relativeTime + "</span>";
    },

    randomGuid: function () {
        return Math.guid();
    }
});
