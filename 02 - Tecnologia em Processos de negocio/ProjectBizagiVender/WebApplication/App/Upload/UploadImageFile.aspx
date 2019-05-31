<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="UploadImageFile.aspx.cs" Inherits="BizAgiBPM.App.Upload.UploadImageFile" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form2" runat="server">
    <div>
        <asp:FileUpload ID="fileUpload" runat="server" />
        <br/>
        <br/>
        <asp:Button ID="Button1" runat="server" Text="Upload" onclick="Button1_Click" />
        <p>
            <span id="spnContents" style="FONT: 8pt verdana" runat="server"></span>
        </p>
    </div>
    </form>
</body>
</html>
