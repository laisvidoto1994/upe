<%@ Page language="c#" Codebehind="SendAttachedDocs.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.ListaDetalle.Forms.SendAttachedDocs" %>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<HTML>
	<HEAD>
		<title>Send Attached Documents</title>
<!--#include file="../../include/BizAgiMeta.inc"-->
		<LINK href="../../css/estilos.css" type="text/css" rel="stylesheet">
		<%WriteHead();%>
		<script language="JavaScript" src="../../js/implementation.js"></script>
		<script language="JavaScript" type="text/javascript">
			function ValidateDocsListClient(source, arguments)
			{
				arguments.IsValid = false;
			
				// Loop through all checkboxes
				iChkCount = 0;
				while (true)
				{
					sCheckBoxName = "chkDocsList_" + iChkCount;
					if (document.getElementById(sCheckBoxName))
					{
						if (document.getElementById(sCheckBoxName).checked)
						{
							arguments.IsValid = true;
							break;
						}
						
						iChkCount++;
					}
					else
					{
						break;
					}
				}
			}

			function BAIsValidEmail(source, arguments){
				var strMail = document.getElementById("txtTo").value;
				var bIsValid = (/^(([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+)(([\s]*[;,]+[\s]*(([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+))*)$/.test(strMail))
				arguments.IsValid = bIsValid;
			}
		

		</script>
	</HEAD>
	<body>
		<form id="SaveAttachedDocs" method="post" runat="server">
			<TABLE cellSpacing="1" cellPadding="1" width="100%">
				<TR>
					<TD align="center">
						<b>
						<UI:CLabel id="lblSendAttachedDocsTitle" runat="server" text="SendAttachedDocs_Title" /></b><br>
						<span id="lblFieldName" runat="server"></span>
					</TD>
				</TR>
				<TR>
					<TD align="center">
						<asp:ValidationSummary ID="valSum" runat="server" DisplayMode="SingleParagraph"/>
					</TD>
				</TR>
			</TABLE>
			<span id="spnContents" runat="server">
				<TABLE cellSpacing="1" cellPadding="1" width="100%">
					<TR>
						<TD colSpan="2">&nbsp;</TD>
					</TR>
					<TR>
						<TD>
							<UI:CLabel id="lblTo" runat="server" text="SendMsg_To" />:</TD>
						<TD>
							<asp:TextBox id="txtTo" runat="server" Columns="40"></asp:TextBox>
							<asp:RequiredFieldValidator id="RequiredTo" runat="server" ControlToValidate="txtTo" Display="None" InitialValue="" />
							<asp:CustomValidator id="ToValidator" ClientValidationFunction="BAIsValidEmail" Display="None" runat="server"/>
						</TD>
					</TR>
					<TR>
						<TD>
							<UI:CLabel id="lblSubject" runat="server" text="SendMsg_Subject" />:</TD>
						<TD>
							<asp:TextBox id="txtSubject" runat="server" Columns="40"></asp:TextBox>
							<asp:RequiredFieldValidator id="RequiredSubject" runat="server" ControlToValidate="txtSubject" Display="None" InitialValue="" />
						</TD>
					</TR>
					<TR>
						<TD>
							<UI:CLabel id="lblMessage" runat="server" text="SendMsg_Body" />:</TD>
						<TD>
							<asp:TextBox id="txtMessage" runat="server" TextMode="MultiLine" Rows="5" Columns="40"></asp:TextBox>
							<asp:RequiredFieldValidator id="RequiredMessage" runat="server" ControlToValidate="txtMessage" Display="None" InitialValue="" />
						</TD>
					</TR>
					<TR>
						<TD>
							<UI:CLabel id="lblDocsList" runat="server" text="SendAttachedDocs_DocsList" />:
						</TD>
						<TD>
							<span id="lblDocsMessage" runat="server"></span>
							<asp:CheckBoxList id="chkDocsList" runat="server" />
							<asp:CustomValidator id="DocsListValidator" OnServerValidate="ValidateDocsListServer" ClientValidationFunction="ValidateDocsListClient" Display="None" runat="server"/>
						</TD>
					</TR>
					<TR>
						<TD colSpan="2">
							&nbsp;
							<INPUT type="hidden" id="hdnIdEntity"  name="hdnIdEntity"  runat="server">
							<INPUT type="hidden" id="hdnIdKey"     name="hdnIdKey"     runat="server">
							<INPUT type="hidden" id="hdnIdAttrib"  name="hdnIdAttrib"  runat="server">
							<INPUT type="hidden" id="hdnRadNumber" name="hdnRadNumber" runat="server">
						</TD>
					</TR>
					<TR>
						<TD colSpan="2" align="middle">
							<UI:CHtmlInputButton id="btnSend" name="btnSend" type="button" value="SendMsg_Send" runat="server" onserverclick="OnbtnSend" />
							<UI:CHtmlInputButton id="btnClose" name="btnClose" type="button" value="SendMsg_Close" runat="server" onclick="window.close();" />
						</TD>
					</TR>
				</TABLE>
			</span>
			<span id="spnConfirmation" runat="server">
				<TABLE cellSpacing="1" cellPadding="1" width="300">
					<TR>
						<TD>&nbsp;</TD>
					</TR>
					<TR>
						<TD>
							<span id="SpanErrMsg" runat="server"></span>
						</TD>
					</TR>
					<TR>
						<TD>&nbsp;</TD>
					</TR>
					<TR>
						<TD align="middle">
							<UI:CHtmlInputButton id="btnCloseConfirm" name="btnClose" type="button" value="SendMsg_Close" runat="server" onclick="window.close();" />
						</TD>
					</TR>
				</TABLE>
			</span>
		</form>
	</body>
</HTML>
