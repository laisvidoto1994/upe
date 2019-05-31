<%@ Page language="c#" Codebehind="FormaUpload.aspx.cs" AutoEventWireup="False" Inherits="BizAgiBPM.App.Upload.FormaUpload" %>
<HTML>
	<HEAD>
		<title><% Response.Write(BizAgi.UI.WFBase.CResourceManager.RM.GetString("AppUploadFormaUpload_UploadFile")); %></title>
<!--#include file="../../include/BizAgiMeta.inc"-->
		<LINK href="../../css/estilos.css" type="text/css" rel="stylesheet">		
		<LINK href="../../css/WorkPortal/WPCustomStyles.css" type="text/css" rel="stylesheet">
		
		<script id="clientEventHandlersJS" language="javascript">
<!--


function btnUpload_onclick() {
	if(document.all("fileUpload").value != "")
	{
		if (!isValidExtension(document.all("fileUpload").value))
		{
			alert("<%=GetInvalidExtensionMessage()%>");
			return;
		}
	
		
		document.all("txtUpload").value = "1";
		try{
		    frmUpload.submit();
		    document.all("btnUpload").disabled = true;
		}
		catch(err){
		    alert ("<%Response.Write(BizAgi.UI.WFBase.CResourceManager.RM.GetString("AppFormaUpload_ErrorPath").Replace("\"", "\\\""));%>");
		}
	}
}

function isValidExtension(sFileName)
{
	var sValidExtensions = "<%=GetValidExtensions()%>";
	
	//No extension validation required
	if (sValidExtensions.length == 0) 
		return true;
	
	var arrExtensions = sValidExtensions.split(";");
	var sExtension = "";
	var i;
	
	var arrFileName = sFileName.split(".");
	if (arrFileName.length > 1)
		sExtension = arrFileName[arrFileName.length -1];
	
	for (i=0; i< arrExtensions.length ; i++)
	{
		if (sExtension.toUpperCase() == arrExtensions[i].toUpperCase())
			return true;
	}
	return false;
}

function window_onload() {
<%if (!IsPostBack)
	{%>
	document.all("btnUpload").value = "<%Response.Write(BizAgi.UI.WFBase.CResourceManager.RM.GetString("AppFormaUpload_Upload"));%>";
<%	}%>
}

//-->
		</script>
	</HEAD>
	<body onload="return window_onload()">
		<form id="frmUpload" encType="multipart/form-data" runat="server">
			<p><span id="spnContents" style="FONT: 8pt verdana" runat="server">
					<P><span id="SpanErrMsg" style="FONT: 8pt verdana" runat="server"></span></P>
					<P>
						<TABLE id="Table1" height="47" cellSpacing="1" cellPadding="1" width="363" border="0">
							<TR>
								<TD width="97">
									<span id="spnFileUploadLabel" style="FONT: 8pt verdana" runat="server"></span>
								</TD>
								<TD>
									<input id="fileUpload" type="file" size="40" name="File1" runat="server" >
								</TD>
							<TR>
								<TD align="middle" colSpan="2" height="10"></TD>
							</TR>
							<TR>
								<TD align="middle" colSpan="2">
									<INPUT type="button" value="" name="btnUpload" onclick="return btnUpload_onclick()">
								</TD>
							</TR>
						</TABLE>
					</P>
				</span>
			<BR><BR><BR><BR><BR><BR><BR><BR>
			<asp:TextBox id="txtUpload" runat="server" EnableViewState="true" ontextchanged="OnbtnUpload"></asp:TextBox>
		</form>
	</body>
</HTML>
