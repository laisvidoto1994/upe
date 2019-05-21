<%@ Page language="c#" Codebehind="SearchInTree.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Admin.SearchInTree" %>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<HTML>
	<HEAD>
		<title>Search</title>
<!--#include file="../../include/BizAgiMeta.inc"-->
		
		<LINK href="../../css/estilos.css" type="text/css" rel="stylesheet">
	</HEAD>
	<body MS_POSITIONING="FlowLayout">
		<form id="Search" method="post" runat="server">
			<P><span id="SpanHeader" runat="server"></span></P>
			<TABLE id="Table1" cellSpacing="1" cellPadding="1" width="90%" border="0">
				<TR>
					<TD align="middle">
						<TABLE id="Table2" cellSpacing="1" cellPadding="1" width="300" border="0">
							<TR>
								<TD colspan="2" class="gridheader">
									<B>
										<UI:CLabel runat="server" Text="Search" /></B>
									<P></P>
								</TD>
							</TR>
						</TABLE>
					</TD>
				</TR>
				<TR>
					<TD align="middle">
						<asp:DataGrid id="PropertyTreeSearch" runat="server" AllowPaging="True" BorderColor="White" BorderWidth="1px" BackColor="White" CellPadding="4" BorderStyle="None" PageSize="20" AllowSorting="True">
							<SelectedItemStyle Font-Bold="True" ForeColor="#663399" BackColor="#FFCC66"></SelectedItemStyle>
							<AlternatingItemStyle CssClass="gridline2"></AlternatingItemStyle>
							<ItemStyle CssClass="gridline1"></ItemStyle>
							<HeaderStyle CssClass="gridheader"></HeaderStyle>
							<Columns>
								<asp:ButtonColumn Text="Click" CommandName="Select" runat="server" />
							</Columns>
							<PagerStyle HorizontalAlign="Center" PageButtonCount="20" CssClass="gridheader" Mode="NumericPages"></PagerStyle>
						</asp:DataGrid>
					</TD>
				</TR>
				<TR>
					<TD align="middle">
						<asp:Label id="PropertyTreeSearchSort" runat="server" Visible="False"></asp:Label></TD>
				</TR>
			</TABLE>
		</form>
	</body>
</HTML>
