// Creates a service instance
var service = new bizagi.workportal.services.service();

// 1. Get current user
$("#GetCurrentUser button").click(function(){
    
    
    $.when(service.getCurrentUser())
    .done(function(data){
        $("#GetCurrentUser textarea").text(JSON.encode(data));
    });        
});

// 2. Get inbox summary
$("#GetInboxSummary button").click(function(){
    
    
    $.when(service.getInboxSummary())
    .done(function(data){
        $("#GetInboxSummary textarea").text(JSON.encode(data));
    });        
});

// 3. Get all processes
$("#GetAllProcesses button").click(function(){
    
    var taskState = $("#GetAllProcesses #taskState").val();
    $.when(service.getAllProcesses({
        taskState : taskState
    }))
    .done(function(data){
        $("#GetAllProcesses textarea").text(JSON.encode(data));
    });        
});

// 4. Get cases by workflow
$("#GetCasesByWorkflow button").click(function(){
    
    var taskState = $("#GetCasesByWorkflow #taskState").val();
    var idWorkflow = $("#GetCasesByWorkflow #workflow").val();
    var pageSize = $("#GetCasesByWorkflow #pageSize").val();
    var page = $("#GetCasesByWorkflow #page").val();
    $.when(service.getCasesByWorkflow({
        taskState : taskState,
        idWorkflow: idWorkflow,
        pageSize: pageSize,
        page: page
    }))
    .done(function(data){
        $("#GetCasesByWorkflow textarea").text(JSON.encode(data));
    });        
});

   
// 5. Get cases summary
$("#GetCaseSummary button").click(function(){
    
    var idCase = $("#GetCaseSummary #idCase").val();
    $.when(service.getCaseSummary({
        idCase: idCase
    }))
    .done(function(data){
        $("#GetCaseSummary textarea").text(JSON.encode(data));
    });        
});

       
// 6. Get cases summary
$("#GetCaseAssignees button").click(function(){
    
    var idCase = $("#GetCaseAssignees #idCase").val();
    $.when(service.getCaseAssignees({
        idCase: idCase
    }))
    .done(function(data){
        $("#GetCaseAssignees textarea").text(JSON.encode(data));
    });        
});

       
// 7. Get customized columns data
$("#GetCustomizedColumnsData button").click(function(){
    
    var taskState = $("#GetCustomizedColumnsData #taskState").val() != "" ? $("#GetCustomizedColumnsData #taskState").val() : undefined;
    var idWorkflow = $("#GetCustomizedColumnsData #workflow").val();
    $.when(service.getCustomizedColumnsData({
        taskState : taskState,
        idWorkflow: idWorkflow
    }))
    .done(function(data){
        $("#GetCustomizedColumnsData textarea").text(JSON.encode(data));
    });        
});

// 8. Get case tasks
$("#GetCaseTasks button").click(function(){
    
    var idCase = $("#GetCaseTasks #idCase").val();
    $.when(service.getCaseTasks({
        idCase: idCase
    }))
    .done(function(data){
        $("#GetCaseTasks textarea").text(JSON.encode(data));
    });        
});

// 9. Get task assignees
$("#GetTaskAssignees button").click(function(){
    
    var idCase = $("#GetTaskAssignees  #idCase").val();
    var idTask = $("#GetTaskAssignees  #idTask").val();
    $.when(service.getTaskAssignees({
        idCase: idCase,
        idTask: idTask
    }))
    .done(function(data){
        $("#GetTaskAssignees textarea").text(JSON.encode(data));
    });        
});

// 10. Get case events
$("#GetCaseEvents button").click(function(){
    
    var idCase = $("#GetCaseEvents  #idCase").val();
    $.when(service.getCaseEvents({
        idCase: idCase
    }))
    .done(function(data){
        $("#GetCaseEvents textarea").text(JSON.encode(data));
    });        
});

// 11. Get case subprocesses
$("#GetCaseSubprocesses button").click(function(){
    
    var idCase = $("#GetCaseSubprocesses  #idCase").val();
    $.when(service.getCaseSubprocesses({
        idCase: idCase
    }))
    .done(function(data){
        $("#GetCaseSubprocesses textarea").text(JSON.encode(data));
    });        
});
    
// 12. Get workitems
$("#GetWorkitems button").click(function(){
    
    var idCase = $("#GetWorkitems  #idCase").val();
    $.when(service.getWorkitems({
        idCase: idCase
    }))
    .done(function(data){
        $("#GetWorkitems textarea").text(JSON.encode(data));
    });        
});