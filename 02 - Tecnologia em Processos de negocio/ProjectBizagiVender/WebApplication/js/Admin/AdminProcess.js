//------------------------------- Constants ----------------------------//
var _iAjaxActionCode = "1700";
var _ajaxGatewayUrl = "../Ajax/AJAXGateway.aspx";

var _adminProcess_ProcessIcon_Class = 'process-icon-class';

//------------------------------- Global variables ----------------------------//
var _arrTasks = new Array();
var _curSelectedProcess = null;
var _curSelectedTask = null;
var _pendingLoads = 2;  //document and silverlight object load independently, each of them decrement this counter on load



//--------------------- Document Startup function --------------//

$(function(){
    --_pendingLoads;    
    CheckAllLoaded();
});

//--------------------- Call initialize methods if all needed objects have been loaded --------------//

function CheckAllLoaded(){
    if(_pendingLoads != 0)
        return;
    
    AllLoaded();
}

//--------------------- Perform initializations once everything has been loaded --------------//

function AllLoaded(){
    if($(".ProcessCombo option").length == 0)
        return;
    
    //Apply select plugin to workflows combo
    $(".ProcessCombo").selectmenu({
        style: 'dropdown',
        icons: [ {find: "*", icon : _adminProcess_ProcessIcon_Class} ]
    });
    
    //Update screen with the current process in combo
    SelectedProcessChanged();

    //Bind events    
    $(".ProcessCombo").change(SelectedProcessChanged);
    BindButtonEvents();

    //Load diagram for first
    LoadSLDiagram();
}

//--------------------- Show/hide task or process panel --------------//

function ShowProcessPanel(bShow){
    $(".processValuesPanel").css("display", bShow ? "block" : "none");
}

function ShowTaskPanel(bShow){
    $(".taskValuesPanel").css("display", bShow ? "block" : "none");
}

//--------------------- Shows process properties for reading --------------//

function ShowProcessProperties(){
    ShowProcessPanel(true);

    $("#processPropertiesRead").css("display", "block");
    $("#processPropertiesEdit").css("display", "none");

    $("#txtProcessNameRead").html(_curSelectedProcess.name);
    $("#txtProcessDescriptionRead").html(_curSelectedProcess.description);
    $("#txtProcessDurationRead").html(GetDurationStringFromMinutes(_curSelectedProcess.duration));
}

//--------------------- Shows process properties for edit --------------//

function EditProcessProperties(){
    
    //Show values
    $("#txtProcessNameEdit").html(_curSelectedProcess.name);
    $("#txtProcessDescriptionEdit").html(_curSelectedProcess.description);

    var arrDuration = GetTimeArrayFromMinutes(_curSelectedProcess.duration);
    $("#txtProcessDurationEditDays").val(arrDuration[0]);
    $("#txtProcessDurationEditHours").val(arrDuration[1]);
    $("#txtProcessDurationEditMinutes").val(arrDuration[2]);

    //Show panel
    $("#processPropertiesRead").css("display", "none");
    $("#processPropertiesEdit").css("display", "block");    
}

//--------------------- Shows task properties for reading --------------//

function ShowTaskProperties(){
    ShowTaskPanel(true);

    $("#taskPropertiesRead").css("display", "block");
    $("#taskPropertiesEdit").css("display", "none");

    $("#txtTaskNameRead").html(_curSelectedTask.name);
    $("#txtTaskDescriptionRead").html(_curSelectedTask.description);
    $("#txtTaskDurationRead").html(GetDurationStringFromMinutes(_curSelectedTask.duration));
}

//--------------------- Shows task properties for edit --------------//

function EditTaskProperties(){
    
    //Show values
    var arrDuration = GetTimeArrayFromMinutes(_curSelectedTask.duration);
    $("#txtTaskNameEdit").html(_curSelectedTask.name);
    $("#txtTaskDescriptionEdit").html(_curSelectedTask.description);

    $("#txtTaskDurationEditDays").val(arrDuration[0]);
    $("#txtTaskDurationEditHours").val(arrDuration[1]);
    $("#txtTaskDurationEditMinutes").val(arrDuration[2]);

    //Show panel
    $("#taskPropertiesRead").css("display", "none");
    $("#taskPropertiesEdit").css("display", "block");    
}


//--------------------- Gets a duration string (h/m/s) from a given number of minutes --------------//

function GetDurationStringFromMinutes(minutes){
    var arrDuration = GetTimeArrayFromMinutes(minutes);
    var sDuration = arrDuration[0] + "d  " + arrDuration[1] + "h:" + arrDuration[2] + "m";
    return sDuration;
}

//--------------------- Divide a given number of minutes in three values: days, hours and minutes --------------//

function GetTimeArrayFromMinutes(minutes){
    minutes = TryParseInt(minutes, 0);

    var hoursDay = TryParseInt($("#hidHoursDay").val(), 0);
    var minutesDay = TryParseInt($("#hidMinutesDay").val(), 0);

    var rDays = (minutes / minutesDay) | 0;
    var rHours = ((minutes % minutesDay) / 60) | 0;
    var rMins = minutes - ((rDays * minutesDay) + (rHours * 60));

    var arr = [rDays, rHours, rMins];
    return arr;
}

//--------------------- Calculate number of minutes based on an array containing days, hous and minutes --------------//

function GetMinutesFromTimeUnits(days, hours, minutes){
    var hoursDay = TryParseInt($("#hidHoursDay").val(), 0);
    var minutesDay = TryParseInt($("#hidMinutesDay").val(), 0);

    var rMinutes = TryParseInt(days, 0) * minutesDay
                  + TryParseInt(hours, 0) * 60
                  + TryParseInt(minutes, 0);
                    
    return rMinutes;
}


//--------------------- Called when selection has changed in process combo --------------//
//- Sets current workflow
//- load diagram and task array
//- clear current task value and panel.
function SelectedProcessChanged(){
    
    GetCurrentProcessFromCombo();
    
    LoadTaskArray();
    
    _curSelectedTask = null;
    
    LoadSLDiagram();
        
    ShowTaskPanel(false);
    
    ShowProcessProperties();
}


//-------------------  Ajax call: Load tasks -------------------//

function LoadTaskArray(){
    _arrTasks = [];
    
    var sUrl = _ajaxGatewayUrl + "?action=" + _iAjaxActionCode 
                            + "&op=getTasks"
                            + "&idWorkflow=" + _curSelectedProcess.id;
     
    callAjaxMethod(sUrl, LoadTaskArray_CallBack);
}

function LoadTaskArray_CallBack(result){
    var oResult = BAEval(" (" + result + ")");

    if(oResult.ERROR != null){
        window.alert("Error:\n" + oResult.ERROR);
        return;
    }
    
    _arrTasks= oResult.Tasks; 
}

//--------------------- Apply style and define call backs for buttons --------------//

function BindButtonEvents(){

    $("#btnTaskEdit").button();
    $("#btnTaskEdit").click(BtnTaskEditClick);
    
    $("#btnTaskCancel").button();
    $("#btnTaskCancel").click(BtnTaskCancelClick);    

    $("#btnTaskApply").button();
    $("#btnTaskApply").click(BtnTaskApplyClick);    

    $("#btnProcessEdit").button();
    $("#btnProcessEdit").click(BtnProcessEditClick);
    
    $("#btnProcessCancel").button();
    $("#btnProcessCancel").click(BtnProcessCancelClick);    

    $("#btnProcessApply").button();
    $("#btnProcessApply").click(BtnProcessApplyClick);    
    
    $(".daysInput").focusout(function(){ CorrectIntegerInInput($(this), 0, 1000, 0); });
    $(".hoursInput").focusout(function(){ CorrectIntegerInInput($(this), 0, 23, 0); });
    $(".minutesInput").focusout(function(){ CorrectIntegerInInput($(this), 0, 59, 0);});

}    


//--------------------- ButtonEvent: Edit task --------------//
    
function BtnTaskEditClick(){    
    EditTaskProperties();
}

//--------------------- ButtonEvent: Cancel task edit --------------//

function BtnTaskCancelClick(){
    ShowTaskProperties();
}

//--------------------- ButtonEvent: Apply task changes--------------//

function BtnTaskApplyClick(){
    SaveTask();    
}

//--------------------- ButtonEvent: Edit process --------------//

function BtnProcessEditClick(){    
    EditProcessProperties();
}

//--------------------- ButtonEvent: Cancel process edit --------------//

function BtnProcessCancelClick(){
    ShowProcessProperties();
}

//--------------------- ButtonEvent: Apply process changes--------------//

function BtnProcessApplyClick(){
    SaveProcess();    
}

//--------------------- Save process values methods--------------//

function SaveProcess(){

    var iNewDuration = GetMinutesFromTimeUnits( $("#txtProcessDurationEditDays").val(),
                        $("#txtProcessDurationEditHours").val(),
                        $("#txtProcessDurationEditMinutes").val());


    var sUrl = _ajaxGatewayUrl + "?action=" + _iAjaxActionCode 
                            + "&op=updateWorkflow"
                            + "&idWorkflow=" + _curSelectedProcess.id
                            + "&duration=" + iNewDuration;
     
    callAjaxMethod(sUrl, SaveProcess_CallBack);
}

function SaveProcess_CallBack(result){

     var oResult = BAEval(" (" + result + ")");

    //Check for server errors
    if(oResult.ERROR != null){
        window.alert("Error:\n" + oResult.ERROR);
        return;
    }


    //Apply changes in local model: selected workflow
    _curSelectedProcess.duration = oResult.Workflow.duration;
    

    //Apply changes in local model: selected combo value
    $(".ProcessCombo option").each(function(){
        
        var oComboWorkflow = BAEval( "(" + $(this).attr('value') + ")" );
        
        if(oComboWorkflow.id == _curSelectedProcess.id){
            $(this).attr('value', JSON.encode(_curSelectedProcess));
        }
    });
    
    //Show readonly controls
    ShowProcessProperties();
}

//--------------------- Save task values methods--------------//

function SaveTask(){
    var iNewDuration = GetMinutesFromTimeUnits( $("#txtTaskDurationEditDays").val(),
                                                $("#txtTaskDurationEditHours").val(),
                                                $("#txtTaskDurationEditMinutes").val());

    var sUrl = _ajaxGatewayUrl + "?action=" + _iAjaxActionCode 
                            + "&op=updateTask"
                            + "&idTask=" + _curSelectedTask.id
                            + "&duration=" + iNewDuration;
     
    callAjaxMethod(sUrl, SaveTask_CallBack);

//    SaveTask_CallBack("{'Task':{'duration': " + iNewDuration + ", 'id': " + _curSelectedTask.id + ", 'name': '" + _curSelectedTask.name + "'}}");
}

function SaveTask_CallBack(result){

    var oResult = BAEval(" (" + result + ")");

    //Check for server errors
    if(oResult.ERROR != null){
        window.alert("Error:\n" + oResult.ERROR);
        return;
    }

    //Apply changes in local model
    _curSelectedTask.duration = oResult.Task.duration;
    
    //Show readonly controls
    ShowTaskProperties();
}

//--------------------- Gets the current process object from the selected item string in combo --------------//

function GetCurrentProcessFromCombo(){
    var sCurProc = $(".ProcessCombo").val();
    _curSelectedProcess = BAEval(" (" + sCurProc + ")");
}

//--------------------- Have Silverlight object load a new workflow --------------//

function LoadSLDiagram(){    
    try{
        var slFrame    = document.getElementById("iframeSilverlight");
        var idWorkflow = _curSelectedProcess.id;
        
	    slFrame.contentWindow.ConfigureForTaskSelect(idWorkflow, -1);
	    return 1;
    }catch(e){
        window.alert("Silverlight error:\n" + e.message);
    }
    
    return 0;
}

//--------------------- Silverlight callback: Called when SL object has been loaded --------------//

function SLDiagramNotifyLoaded(){
    --_pendingLoads;

    CheckAllLoaded();
}

//--------------------- Silverlight callback: Called when SL object has changed the workflow to show--------------//

function SLDiagramNotifyChange(params) {    
    var jSONParamms =  BAEval(" (" + params + ")");
    var iNewValue = parseInt(jSONParamms.WorkflowId);
    
    if( iNewValue == _curSelectedProcess.id)
        return;
    
    //Update combo selection
    $(".ProcessCombo option").each(function(){ 
        var oProc = BAEval("(" + $(this).val() + ")");
        if(oProc.id == iNewValue){
           $(this).attr('selected', 'selected');
           //SelectedProcessChanged();
        }
    });
}

//--------------------- Silverlight callback: Called when a task has been clicked on the SL object --------------//

function SLDiagramNotifyTaskSelect(params){
    var jSONParamms =  BAEval(" (" + params + ")");


    //Do nothing when clicking on the current task twice
    if(_curSelectedTask != null && _curSelectedTask.id == jSONParamms.TaskId)
        return;

    //Hide task panel until a task is identified in the model
    ShowTaskPanel(false);

    //check for no-selection
    if(jSONParamms.id == ""){
        _curSelectedTask = null;
        return;
    }
    
        
    //Look for task in model
    for(var iTask = 0; iTask<_arrTasks.length; ++iTask){
        
        var oTask = _arrTasks[iTask];
        
        if(oTask.id == jSONParamms.TaskId){
            
            //Task found. Show its properties if task type allows it
            _curSelectedTask = oTask;
            
            if(ShouldShowTaskProperties(oTask)) 
                ShowTaskProperties();
                
            break;
        }
    }
}

function ShouldShowTaskProperties(oTask){
    return oTask.idTaskType && (
        oTask.idTaskType == 2 //ManualState
        || oTask.idTaskType == 7 //SubProcess
        || oTask.idTaskType == 14 //SubProcessMultiInstance
        || oTask.idTaskType == 21 //Singleton
        || oTask.idTaskType == 38 //ReceiveTask
        || oTask.idTaskType == 39 //ManualTask
        || oTask.idTaskType == 41 //DataObject
    );
}

//--------------------- Silverlight callback: Called when a task has been clicked in the SL object --------------//

function BAEval(oValue){
    try{
        return eval(oValue);
    }
    catch(ex){
        window.alert("ERROR evaluating JSON string:\n " + oValue);
        return null;
    }
}

//--------------------- Cal Ajax ---------------------//

function callAjaxMethod(url, successFunction) {
    $.ajax({
      url: url,
      success: successFunction,
      error : function(errData){ window.alert("Ajax failure: " +  errData); }
    });
}

//--------------------- Fix input value if outside the specified range ------------------//

function CorrectIntegerInInput(objInput, minValue, maxValue, defaultValue){

    var iNewValue = TryParseInt(objInput.val(), defaultValue);

    if(iNewValue < minValue)
        objInput.val(minValue);
    else if(iNewValue > maxValue)
        objInput.val(maxValue);
    else
        objInput.val(iNewValue);
}

//--------------------- TryParseInt javascript version ------------------//

function TryParseInt(str, defaultValue){
    var retValue = defaultValue;
    if(str != null){
        if(jQuery.trim(new String(str)).length > 0){
            if (!isNaN(str)){
                retValue = parseInt(str);
            }
        }
    }     
    return retValue; 
}
