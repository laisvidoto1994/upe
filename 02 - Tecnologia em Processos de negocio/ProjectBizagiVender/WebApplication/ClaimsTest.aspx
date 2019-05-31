<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ClaimsTest.aspx.cs" Inherits="BizAgiBPM.ClaimsTest" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
     <h1>
            Page Title</h1>
        <asp:GridView ID="dgrClaims" runat="server">
        </asp:GridView>
        <h1>
            User Name</h1><br />
        <asp:Label ID="lblUserName" runat="server" Text=""></asp:Label>
        <h1>
            Autheticate Status</h1><br />
        <asp:Label ID="lblStatus" runat="server" Text=""></asp:Label>
    </div>
    </form>
</body>
</html>
