<%@ Page language="c#" Codebehind="ErrorMessage.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.ErrorMessage" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<HTML>
	<HEAD>
		<title>Error Message</title>
		<link rel="stylesheet" href="css/estilos.css" type="text/css">
		<link rel="stylesheet" href="css/WorkPortal/WPCustomStyles.css" type="text/css">
		<meta name="GENERATOR" Content="Microsoft Visual Studio .NET 7.1">
		<meta name="CODE_LANGUAGE" Content="C#">
		<meta name="vs_defaultClientScript" content="JavaScript">
		<meta name="vs_targetSchema" content="http://schemas.microsoft.com/intellisense/ie5">
	</HEAD>
	<body MS_POSITIONING="FlowLayout">
		<form id="Form1" method="post" runat="server">
			<TABLE id="Table1" cellSpacing="2" cellPadding="2" width="50%" border="0">
				<TR>
					<TD width="10%">&nbsp;</TD>
					<TD>&nbsp;</TD>
					<TD>&nbsp;</TD>
				</TR>
				<TR>
					<TD>&nbsp;</TD>
					<TD colSpan="2"><h1><asp:Label id="lblTitle" runat="server" Font-Size="Smaller"></asp:Label></h1>
					</TD>
				</TR>
				<TR>
					<TD>&nbsp;</TD>
					<TD>
						<P>
							<asp:Literal id="litError" runat="server"></asp:Literal></P>
					</TD>
					<TD><IMG src="img/wizard/merlin6.gif"></TD>
				</TR>
				<TR>
					<TD>&nbsp;</TD>
					<TD colSpan="2">&nbsp;
						<asp:Label id="lblError" runat="server" Font-Size="Smaller"></asp:Label>&nbsp;</TD>
				</TR>
			</TABLE>
		</form>
	</body>
</HTML>
