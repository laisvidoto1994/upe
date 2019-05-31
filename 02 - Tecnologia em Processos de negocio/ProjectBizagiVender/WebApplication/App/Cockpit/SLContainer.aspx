<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="SLContainer.aspx.cs" Inherits="BizAgiBPM.App.Cockpit.SLContainer" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <script language="javascript" type="text/javascript">
        
        //Configure Methods. 
        //You must call one of these from the parent window in order to show a diagram in Silverlight
        
        function ConfigureForShow(idWorkflow){
            var sUri = SLReturnHostName();
            var sl  = document.getElementById('Xaml1');    
            try{
                if(sl.Content)
                    sl.Content.Bridge.ConfigureForShow(sUri, idWorkflow);
            }
            catch(ex){
                window.alert("ERROR configuring Silverlight:\n " + ex.message ? ex.message : ex);
                return null;
            }
        }
        
        function ConfigureForBAM(workflowId, sUserFilters){
            var sUri = SLReturnHostName();
            var sl  = document.getElementById('Xaml1');   
            try{
                if(sl.Content)
                    sl.Content.Bridge.ConfigureForBAM(sUri, workflowId, sUserFilters);
            }
            catch(ex){
                window.alert("ERROR configuring Silverlight:\n " + ex.message ? ex.message : ex);
                return null;
            }
        }

        function ConfigureForAnalytics(sParamWorkflowId, dtmFrom, dtmTo, sParamUserFilters){
            var sUri = SLReturnHostName();
            var sl  = document.getElementById('Xaml1');    
            try{
                if(sl.Content)
                    sl.Content.Bridge.ConfigureForAnalytics(sUri, sParamWorkflowId, dtmFrom, dtmTo, sParamUserFilters);
            }
            catch(ex){
                window.alert("ERROR configuring Silverlight:\n " + ex.message ? ex.message : ex);
                return null;
            }
        }

        function ConfigureForPathAnalytics(sParamWorkflowId, dtmFrom, dtmTo, sParamUserFilters){
            var sUri = SLReturnHostName();
            var sl  = document.getElementById('Xaml1');    
            try{
                if(sl.Content)
                    sl.Content.Bridge.ConfigureForPathAnalytics(sUri, sParamWorkflowId, dtmFrom, dtmTo, sParamUserFilters);
            }
            catch(ex){
                window.alert("ERROR configuring Silverlight:\n " + ex.message ? ex.message : ex);
                return null;
            }
        }

        function ConfigureForTrail(workflowId, caseId){
            var sUri = SLReturnHostName();
            var sl  = document.getElementById('Xaml1');    
            try{
                if(sl.Content)
                    sl.Content.Bridge.ConfigureForTrail(sUri, workflowId, caseId);
            }
            catch(ex){
                window.alert("ERROR configuring Silverlight:\n " + ex.message ? ex.message : ex);
                return null;
            }
        }
        
        function ConfigureForTaskSelect(idWorkflow, idTask){
            var sUri = SLReturnHostName();
            var sl  = document.getElementById('Xaml1');    
            try{
                if(sl.Content)
                    sl.Content.Bridge.ConfigureForTaskSelect(sUri, idWorkflow, idTask);
            }
            catch(ex){
                window.alert("ERROR configuring Silverlight:\n " + ex.message ? ex.message : ex);
                return null;
            }
        }

        function ConfigureForTaskShow(idWorkflow, idTask){
            var sUri = SLReturnHostName();
            var sl  = document.getElementById('Xaml1'); 
            try{   
                if(sl.Content)
                    sl.Content.Bridge.ConfigureForTaskShow(sUri, idWorkflow, idTask);
            }
            catch(ex){
                window.alert("ERROR configuring Silverlight:\n " + ex.message ? ex.message : ex);
                return null;
            }
        }

        function ConfigureForPathShow(idWorkflow, idTaskFrom, idTaskTo){
            var sUri = SLReturnHostName();
            var sl  = document.getElementById('Xaml1');    
            try{
                if(sl.Content)
                    sl.Content.Bridge.ConfigureForPathShow(sUri, idWorkflow, idTaskFrom, idTaskTo);
            }
            catch(ex){
                window.alert("ERROR configuring Silverlight:\n " + ex.message ? ex.message : ex);
                return null;
            }
        }
        
        function ConfigureForStopwatchEdit(idWorkflow, idTaskFrom, idTaskTo){
            var sUri = SLReturnHostName();
            var sl  = document.getElementById('Xaml1');    
            try{
                if(sl.Content)
                    sl.Content.Bridge.ConfigureForStopwatchEdit(sUri, idWorkflow, idTaskFrom, idTaskTo);
            }
            catch(ex){
                window.alert("ERROR configuring Silverlight:\n " + ex.message ? ex.message : ex);
                return null;
            }
        }

        function ConfigureForStopwatchShow(idWorkflow, idTaskFrom, idTaskTo){
            var sUri = SLReturnHostName();
            var sl  = document.getElementById('Xaml1');    
            try{
                if(sl.Content)
                    sl.Content.Bridge.ConfigureForStopwatchShow(sUri, idWorkflow, idTaskFrom, idTaskTo);
            }
            catch(ex){
                window.alert("ERROR configuring Silverlight:\n " + ex.message ? ex.message : ex);
                return null;
            }
        }

        //END - Configure Methods


        //SL Callback methods. 
        //These are called by the silverlight ProcessViewer object
        function SLDiagramNotifyLoaded(){
            try{
                if(typeof parent.SLDiagramNotifyLoaded == 'function')
                    parent.SLDiagramNotifyLoaded();
                else
                    window.alert("Error showing diagram:\nFor the selected ProcessViewer configuration a SLDiagramNotifyLoaded() javascript function must de defined in the parent window.");
            }
            catch(ex){
                window.alert("Error calling SLDiagramNotifyLoaded:\n" + ex.message);
            }
        }
        
        function SLDiagramDetailList(params) {
            try{
                if(typeof parent.SLDiagramDetailList == 'function')
                    parent.SLDiagramDetailList(params);
                else
                    window.alert("Error showing diagram:\nFor the selected ProcessViewer configuration a SLDiagramDetailList(params) javascript function must de defined in the parent window.");
            }
            catch(ex){
                window.alert("Error calling SLDiagramDetailList:\n" + ex.message);
            }
        }

        function SLDiagramNotifyChange(params) {
            try{
                if(typeof parent.SLDiagramNotifyChange == 'function')
                    parent.SLDiagramNotifyChange(params);
                else
                    window.alert("Error showing diagram:\nFor the selected ProcessViewer configuration a SLDiagramNotifyChange(params) javascript function must de defined in the parent window.");
            }
            catch(ex){
                window.alert("Error calling SLDiagramNotifyChange:\n" + ex.message);
            }
        }
        
        function SLCloseWindow(){
            try{
                if(typeof parent.SLCloseWindow == 'function')
                    parent.SLCloseWindow();
                else
                    window.alert("Error showing diagram:\nFor the selected ProcessViewer configuration a SLCloseWindow() javascript function must de defined in the parent window.");
            }
            catch(ex){
                window.alert("Error calling SLCloseWindow:\n" + ex.message);
            }        
        }
        
        function SLDiagramNotifyTaskSelect(params){
            try{
                if(typeof parent.SLDiagramNotifyTaskSelect == 'function')
                    parent.SLDiagramNotifyTaskSelect(params);
                else
                    window.alert("Error showing diagram:\nFor the selected ProcessViewer configuration a SLDiagramNotifyTaskSelect() javascript function must de defined in the parent window.");
            }
            catch(ex){
                window.alert("Error calling SLDiagramNotifyTaskSelect:\n" + ex.message);
            }        
        }

        //END - SL Callback methods.
        
        //Fill 'errorLocation' with the given message
        function onSilverlightError(sender, args) {
            if (args.errorType == "InitializeError")  {
                var errorDiv = document.getElementById("errorLocation");
                if (errorDiv != null)
                    errorDiv.innerHTML = args.errorType + "- " + args.errorMessage;
            }
        }
        
        //Util
        function SLReturnHostName(){
            var sLocation = window.location.href;
            var sIni = sLocation.substring(0, sLocation.lastIndexOf("/App"));            
            var sURI = sIni + "/webservices/WFEQuery.asmx";

            return sURI;
        }

    </script>
    <style>
        html, body, form, .silverlight{width:100%; height:100%;}
    </style>
</head>
<body >
    <form id="form1" runat="server">
    <div class="silverlight">
	    <object id="Xaml1" width="100%" height="100%" data="data:application/x-silverlight," type="application/x-silverlight-2" style="z-index:-1;" >
		    <param name="source" value="./ProcessViewer.xap"/>
		    <param name="onerror" value="onSilverlightError" />
		    <param name="background" value="white"/>
            <param name="uiculture" value="<%=this.CurrentUICulture.Name%>" />
		    <param name="initParams" value="appContainerType=IIS"/>
            <param name="Windowless" value="true" />
			
		    <a href="http://go.microsoft.com/fwlink/?LinkID=124807" style="text-decoration: none;">
			    <img src="http://go.microsoft.com/fwlink/?LinkId=108181" alt="Get Microsoft Silverlight" style="border-style: none"/>
		    </a>
	    </object>
	    <div id='errorLocation' style="font-size: small;color: Gray;"></div>
    </div>
    </form>
    <input runat="server" type="hidden" id="txtServiceURI" />
</body>
</html>
