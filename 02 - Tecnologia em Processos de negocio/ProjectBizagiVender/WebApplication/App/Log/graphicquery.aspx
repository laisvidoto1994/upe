<%@ Page language="c#" Codebehind="graphicquery.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Log.graphicquery" %>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<HTML>
	<HEAD>
		<title>Consulta Grafica</title>
<!--#include file="../../include/BizAgiMeta.inc"-->
		
		<link rel="stylesheet" href="../../css/estilos.css" type="text/css">
		<script language="javascript">
			function setInitialZoom() {
				getFlashMovieObject("BizAgiProcess").Zoom(50);
				getFlashMovieObject("BizAgiProcess").Pan(-500, -500, 1);
			}
			
			function BizAgiProcess_DoFSCommand(command, args) {
				if (command == "setInitialZoom") {
					setInitialZoom();
					document.forms[0].ready.value = "1";
				}
			}
			
			function getFlashMovieObject(movieName)
			{
				if (window.document[movieName]) 
				{
					return window.document[movieName];
				}
				if (navigator.appName.indexOf("Microsoft Internet")==-1)
				{
					if (document.embeds && document.embeds[movieName])
					return document.embeds[movieName]; 
				}
				else // if (navigator.appName.indexOf("Microsoft Internet")!=-1)
				{
					return document.getElementById(movieName);
				}
			}
			
		</script>
		<script language="VBScript">
			'Hook for IE
			Sub BizAgiProcess_FSCommand(ByVal command, ByVal args)
				Call BizAgiProcess_DoFSCommand(command, args)
			End Sub
		</script>
	</HEAD>
	<body leftmargin="0" topmargin="0">
		<form id="graphicquery" method="post" runat="server">
			<input type="hidden" name="ready" id="ready" value="0">
			<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0" width="100%" height="100%" id="BizAgiProcess" border="0" align="left" VIEWASTEXT>
				<param name="movie" value="BizAgiProcess.swf?sServiceURL=<%=sServiceURL%>&iProcId=<%=iProcId%>&iWfClassId=<%=iWfClassId%>&iWorkflowId=<%=iWorkflowId%>&sMeasure=<%=sMeasure%>&dSem1=<%=dSem1.ToString()%>&dSem2=<%=dSem2.ToString()%>" />
				<param name="loop" value="false" />
				<param name="menu" value="false" />
				<param name="quality" value="high" />
				<param name="bgcolor" value="#FFFFFF" />
				<embed src="BizAgiProcess.swf?sServiceURL=<%=sServiceURL%>&iProcId=<%=iProcId%>&iWfClassId=<%=iWfClassId%>&iWorkflowId=<%=iWorkflowId%>&sMeasure=<%=sMeasure%>&dSem1=<%=dSem1.ToString()%>&dSem2=<%=dSem2.ToString()%>" loop="false" menu="false" quality="high" bgcolor="#FFFFFF" width="100%" height="100%" name="BizAgiProcess" align="left" swLiveConnect="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />
			</object>
		</form>
	</body>
</HTML>
