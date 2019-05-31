/*
*   Name: BizAgi Desktop queryYesNo
*   Author: Ivan Ricardo Taimal Narvaez
*   Comments:queryYesNo
*   -
*/

bizagi.rendering.yesno.extend("bizagi.rendering.queryYesNo", {}, {
    /*
     *   Returns the internal value
     */
    getValue: function () {
        return  bizagi.util.parseBoolean(this.value);
    }
});

