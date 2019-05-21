/*
*   Name: BizAgi Desktop queryCheck
*   Author: Ivan Ricardo Taimal Narvaez
*   Comments:queryCheck
*   -
*/

bizagi.rendering.check.extend("bizagi.rendering.queryCheck", {}, {
     /*
     *   Returns the internal value
     */
    getValue: function () {
        return  bizagi.util.parseBoolean(this.value);
    }
});

