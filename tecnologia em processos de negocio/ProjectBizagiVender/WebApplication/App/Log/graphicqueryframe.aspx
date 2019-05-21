<%@ Page language="c#" Codebehind="graphicqueryframe.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Log.graphicqueryframe" %>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<html>
	<head>
		<title>Bizagi Graphic Query</title>
<!--#include file="../../include/BizAgiMeta.inc"-->
		
		<link rel="stylesheet" href="../../css/estilos.css" type="text/css">

		<SCRIPT LANGUAGE="JavaScript">
			<!-- -->
			function zoomIn(){
				if (frames[0].document.forms[0].ready.value == "1") {
					getFlashMovieObject("BizAgiProcess").Zoom(70);
				}
			}

			function zoomOut(){
				if (frames[0].document.forms[0].ready.value == "1") {
					getFlashMovieObject("BizAgiProcess").Zoom(150);
				}
			}
			
			function showTrail() {
				if (frames[0].document.forms[0].ready.value == "1") {
					getFlashMovieObject("BizAgiProcess").GotoFrame(18);
				}
			}
			
			function showCurrState() {
				if (frames[0].document.forms[0].ready.value == "1") {
					getFlashMovieObject("BizAgiProcess").GotoFrame(22);
				}
			}

			function showBIMeasures() {
				if (frames[0].document.forms[0].ready.value == "1") {
					getFlashMovieObject("BizAgiProcess").GotoFrame(26);
				}
			}
			
			function getFlashMovieObject(movieName)
			{
				if (frames[0].document[movieName]) 
				{
					return frames[0].document[movieName];
				}
				if (navigator.appName.indexOf("Microsoft Internet")==-1)
				{
					if (frames[0].document.embeds && frames[0].document.embeds[movieName])
						return frames[0].document.embeds[movieName]; 
				}
				else // if (navigator.appName.indexOf("Microsoft Internet")!=-1)
				{
					return frames[0].document.getElementById(movieName);
				}
			}
			<!-- -->
		</SCRIPT>

	</head>
	<body MS_POSITIONING="FlowLayout" leftmargin="0" topmargin="0">
		<form id="graphicqueryframe" method="post" runat="server">
			<iframe id="frmcontainer" name="frmcontainer" width="100%" height="92%" src="graphicquery.aspx?iProcId=<%=Request.QueryString["iProcId"]%>&sMeasure=<%=Request.QueryString["sMeasure"]%>&iWfClassId=<%=Request.QueryString["iWfClassId"]%>&iWorkflowId=<%=Request.QueryString["iWorkflowID"]%>&dSem1=<%=Request.QueryString["dSem1"]%>&dSem2=<%=Request.QueryString["dSem2"]%>" scrolling="yes">
			</iframe>

			<table width="70%" align="center" border="0">
				<tr>
					<td align="center">
<!--						<input type="button" class="sbttn" name="zoomin" id="zoomin" value="Zoom In" onclick="zoomIn();">	-->
<!--						<input type="button" class="sbttn" name="zoomout" id="zoomout" value="Zoom Out" onclick="zoomOut();">	-->
						<table>
							<tr>
								<td>
									<UI:CWPHtmlInputButton runat="server" class="WPButtonI BAMnColor" type="button" value="LogGraphicQueryFrame_ZoomIn" name="zoomin" onclick="zoomIn();" ID="zoomin">
								</td>
								<td>
									<UI:CWPHtmlInputButton runat="server" class="WPButtonI BAMnColor" type="button" value="LogGraphicQueryFrame_ZoomOut" name="zoomout" onclick="zoomOut();" ID="zoomout">
								</td>
							</tr>
						</table>
					</td>

					<td align="center">
						<table>
							<tr>
							
							<%if (Request.QueryString["mode"] == "log") {%>
	<!--						<input type="button" class="sbttn" name="trail" id="trail" value="Show Trail" onclick="showTrail();">	-->
	<!--						<input type="button" class="sbttn" name="currentstate" id="currentstate" value="Show Current State" onclick="showCurrState();">	-->
							<td>
								<UI:CWPHtmlInputButton runat="server" class="WPButtonI BAMnColor" type="button" value="LogGraphicQueryFrame_ShowTrail" name="trail" onclick="showTrail();" ID="trail">
							</td>
							<td>
								<UI:CWPHtmlInputButton runat="server" class="WPButtonI BAMnColor" type="button" value="LogGraphicQueryFrame_ShowCurrentState" name="currentstate" onclick="showCurrState();" ID="currentstate">
							</td>
							<%}%>
							<%if (Request.QueryString["mode"] == "bi") {%>
	<!--						<input type="button" class="sbttn" name="bimeasures" id="bimeasures" value="Show Bottlenecks" onclick="showBIMeasures();">	-->
							<td>
								<UI:CWPHtmlInputButton runat="server" class="WPButtonI BAMnColor" type="button" value="LogGraphicQueryFrame_ShowBottlenecks" name="bimeasures" onclick="showBIMeasures();" ID="bimeasures">
							</td>
							<%}%>
							</tr>
						</table>
					</td>
				
					<td align="center">
<!--						<input type="button" class="sbttn" name="close" id="close" value="Cerrar" onclick="window.close();">	-->
						<UI:CWPHtmlInputButton runat="server" class="WPButtonI BAMnColor" type="button" value="LogGraphicQueryFrame_Close" name="close" onclick="window.close();" ID="close">
					</td>
				</tr>
			</table>
		</form>
	</body>
</html>
