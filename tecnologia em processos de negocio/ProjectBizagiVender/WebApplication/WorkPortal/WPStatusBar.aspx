<%@ Page language="c#" Codebehind="WPStatusBar.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.WorkPortal.WPStatusBar" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" > 

<html>
  <head>
    <title>WPStatusBar</title>
    <meta name="GENERATOR" Content="Microsoft Visual Studio .NET 7.1">
    <meta name="CODE_LANGUAGE" Content="C#">
    <meta name=vs_defaultClientScript content="JavaScript">
    <meta name=vs_targetSchema content="http://schemas.microsoft.com/intellisense/ie5">
    <LINK href="../css/WorkPortal/WPPanel.css" type="text/css" rel="STYLESHEET">
    
    <LINK href="../css/estilos.css" type="text/css" rel="STYLESHEET">
    <LINK rel="STYLESHEET" href="../css/WorkPortal/WPCustomStyles.css" type="text/css">
    <LINK href="../css/WorkPortal/WPStatusBar.css" type="text/css" rel="STYLESHEET">
    <script language="JavaScript" src="../js/WorkPortal/WPToolBarMenu.js"></script>	
    <%WriteHead();%>
    <script language=javascript>
    function UpdateTotalUrgentCases(iCases){
		var sTotalCasesTitle = "<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("TotalUrgentCases") %>";
		var oTotalUrgentCases = document.getElementById("BATotalUrgentCases");
		if (oTotalUrgentCases){
		    oTotalUrgentCases.innerHTML = "<b class='BAHlColor'>"+sTotalCasesTitle+":&nbsp;</b>" +iCases;
		}
    }	
    function BAUpdateDateTime(sDate,sTime){
		var oDate = document.getElementById("CurrentDate");
		if (oDate){
		    oDate.innerHTML = sDate;
		}
		/*var oTime = document.getElementById("CurrentTime");
		if (oTime){
		    oTime.innerHTML = sTime;
		}*/
    }	
    function LoadMainPage(sRef){
		parent.BAMainFrame.location.href = sRef;
	}
    function setTimeAndDate(){
		var d = new Date();
		var h = d.getHours();
		var ht = "AM";
		if (h > 12){
			h = h-12;
			ht = "PM"
		}
		var min = d.getMinutes();
		if (min < 10){
			min = "0"+min;
		}
		document.getElementById("CurrentTime").innerHTML = h+":"+min+" "+ht;
		
	    //Recalculate the date
		var format = "<%= CurrentUICulture.DateTimeFormat.LongDatePattern %>";
		document.getElementById("CurrentDate").innerHTML = d.format(format);
				    
	    setTimeout("setTimeAndDate()",60000);
    }
    
	</script>

  </head>
	<body topmargin="0" bottommargin="0" leftmargin="0" rightmargin="0" class="BAMainFontColor WPMainBGColor">
	<table width="100%" cellpadding="0" cellspacing="0" border = "0" class="StatusBarBg" >
		<tr >
			<td width="5">&nbsp;</td>
			<td width="16" >
			<div id="statusicon" style="">
			<img src="../img/WorkPortal/Menu/RedLittleArrow.gif" width="16" height="16" alt="" border="0" align="top">
			</div>		

			<td width="5">&nbsp;</td>
			<td nowrap><div><div id="BATotalUrgentCases" name="BATotalUrgentCases"  class="BAMainFontColor" lang=""></div></td>
			<td width="10">&nbsp;</td>
			<td width="2" valign="bottom">			
				<IMG src="../img/WorkPortal/StatusBar/dividerShort.jpg" width="3" height="10" border="0">
			</td>
			<td width="20">&nbsp;</td>
			<td width="70%" ><%= sDelegatesMessage %></td>
			<td width="13">								
			</td>

			<td width="10">&nbsp;</td>
			<td nowrap><%= sPositionDisplayName %></td>
			<td width="10">&nbsp;</td>
			<td width="2" valign="bottom">
				<IMG src="../img/WorkPortal/StatusBar/dividerShort.jpg" width="3" height="10" border="0">
			</td>

			<td width="10">&nbsp;</td>
			<td nowrap><%= HttpUtility.HtmlEncode(sSAMAccountName) %>&nbsp;(<%= TimeZoneName %>)</td>
			<td width="10">&nbsp;</td>
			<td width="2" valign="bottom">
				<IMG src="../img/WorkPortal/StatusBar/dividerShort.jpg" width="3" height="10" border="0">
			</td>

			<td width="10" nowrap>&nbsp;</td>
			<td nowrap>
			    <span id="CurrentDate"></span>
			</td>

			<td width="10" nowrap>&nbsp;</td>
			<td width="2" valign="bottom">
				<IMG src="../img/WorkPortal/StatusBar/dividerShort.jpg" width="3" height="10" border="0">
			</td>

			<td width="10" nowrap>&nbsp;</td>
			<td nowrap>
				<div id="CurrentTime"></div>
			</td>

			<td width="5">&nbsp;</td>
		</tr>
	</table>	
	<script languaje="javascript">
	var iCases = null;
	if (parent.BALeftPanel != null && typeof(parent.BALeftPanel.document.frames) != 'undefined' && parent.BALeftPanel.document.frames["ifrBACases"] != null){
		if (document.all){
			if (parent.BALeftPanel.document.frames["ifrBACases"].window.iUrgentCases){
				iCases = parent.BALeftPanel.document.frames["ifrBACases"].window.iUrgentCases;
			}
		}
		else if (parent.BALeftPanel.frames["ifrBACases"].iUrgentCases){
			iCases = parent.BALeftPanel.frames["ifrBACases"].iUrgentCases;
		}
	}
	if (iCases != null){
		BAUpdateToolbar(iCases);
	}
	setTimeAndDate();
	</script>
  </body>
</html>
