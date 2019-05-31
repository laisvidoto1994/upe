<%@ Import Namespace="System.Data" %>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@ Page language="c#" Codebehind="AsynchWorkitemLog.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Admin.AsynchWorkitemLog" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<html>
	<head>
		<title>Asynch Workitem Log</title> 
	    <link href="../../css/estilos.css" type="text/css" rel="stylesheet" />
	    <link href="../../css/WorkPortal/WPCustomStyles.css" type="text/css" rel="stylesheet" />
        <link href="../../css/Admin/Common.css" type="text/css" rel="stylesheet" />
        <link href="../../css/Admin/AsynchWorkitemLog.css" type="text/css" rel="stylesheet"/>
        <script language="javascript" type="text/javascript" src="../../js/Jquery/ui191/jquery-1.8.2.js"></script>		
	</head>
	<body>
		<form id="Default" method="post" runat="server">
			<span id="SpanHeader" runat="server"></span>
			<table id="Table1" cellSpacing="0" cellPadding="0" width="90%" border="0" align="center">
				<tr>
					<td>&nbsp;</td>
				</tr>
				<tr>
					<td>&nbsp;</td>
				</tr>
				<tr>
					<td colspan="3" class="header">
						<UI:CLabel runat="server" Text="AsynchWorkitemLog_Header" ID="lblHeader" NAME="lblHeader" />
					</td>
				</tr>
				<tr>
					<td>&nbsp;</td>
				</tr>
				<tr>
					<td>&nbsp;</td>
				</tr>
				<tr>
					<td width="30%">
						<UI:CLabel Font-Bold="true" runat="server" Text="AsynchWorkitemLog_RadicationNumber" ID="lblRadNumberName" NAME="lblRadNumberName" />
					</td>
					<td><asp:Label id="lblRadnumber" Runat="server"></asp:Label></td>
				</tr>
				<tr>
					<td>
						<UI:CLabel Font-Bold="true" runat="server" Text="AsynchWorkitemLog_Process" ID="lblProcessName" NAME="lblProcessName" />
					</td>
					<td><asp:Label id="lblProcess" Runat="server"></asp:Label></td>
				</tr>
				<tr>
					<td>
						<UI:CLabel Font-Bold="true" runat="server" Text="AsynchWorkitemLog_Task" ID="lblTaskName" NAME="lblTaskName" />
					</td>
					<td><asp:Label id="lblTask" Runat="server"></asp:Label></td>
				</tr>
				<tr>
					<td>&nbsp;</td>
				</tr>
				<tr>
					<td>&nbsp;</td>
				</tr>
				<tr>
					<td align="center" colspan="2">
						<asp:DataGrid id="dgAsynchWorkitemLog" runat="server" AllowPaging="True" BorderColor="White" BorderWidth="1px"
							BackColor="White" CellPadding="4" BorderStyle="None" AllowSorting="True" AutoGenerateColumns="False"
							Width="100%">
							<SelectedItemStyle Font-Bold="True" ForeColor="#663399" BackColor="#FFCC66"></SelectedItemStyle>
							<AlternatingItemStyle CssClass="gridline2"></AlternatingItemStyle>
							<ItemStyle CssClass="gridline1"></ItemStyle>
							<HeaderStyle CssClass="gridheader"></HeaderStyle>
							<Columns>
								<asp:BoundColumn DataField="awrRetryDate"></asp:BoundColumn>
								<asp:BoundColumn DataField="awrMessage" HeaderStyle-Width="300px" ItemStyle-HorizontalAlign="Left" HeaderStyle-HorizontalAlign=Left></asp:BoundColumn>
							</Columns>
							<PagerStyle HorizontalAlign="Center" PageButtonCount="20" CssClass="gridheader" Mode="NumericPages"></PagerStyle>
						</asp:DataGrid>
					</td>
				</tr>
				<tr>
					<td>&nbsp;</td>
				</tr>
				<tr>
					<td align="center" colspan="2">
						<input type="button" value="<%=CResourceManager.RM.GetString("AsynchWorkitemLog_Back")%>" onclick="window.location='AsynchDisabledWorkitems.aspx'" />
					</td>
				</tr>
			</table>
		</form>
	</body>
</html>
