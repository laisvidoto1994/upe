<%@ Page Language="C#" AutoEventWireup="false" CodeBehind="default.aspx.cs" Inherits="BizAgiBPM.App.MobileUpdates.Default" %>

<%@ Register TagPrefix="UI" Namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head runat="server">
    <title>Bizagi Mobile Updates</title>
    <link rel="stylesheet" href="../../css/default.css" type="text/css" />
    <link rel="stylesheet" href="../../css/estilos.css" type="text/css" />
    <link rel="stylesheet" href="../../css/WorkPortal/WPCustomStyles.css" type="text/css" />
    <link rel="stylesheet" href="../../css/WorkPortal/BAWindow.css" type="text/css" />
    <link href="../../css/Admin/Common.css" rel="stylesheet" type="text/css" />
    <script language="javascript" type="text/javascript" src="../../Localization/LocalizationEN.js"></script>
    <script language="javaScript" type="text/javascript" src="../../js/scripts.js"></script>
    <style type="text/css">
        .errorMessage
        {
            width: 230px;
        }
        .errorMessage div ul li
        {
            color: whitesmoke;
        }
        .errorMessage div ul
        {
            padding: 5px 10px 5px 30px;
            background-color: #420C0E;
            display: block;
            margin: 10px 0;
            border-radius: 6px;
        }                           
    </style>
</head>
<body>
    <form id="frmUploadUpdates" runat="server">
    <div id="updateBox">
        <div class="content mobileupdatesadmin">
            <div>
                <div>
                    <asp:Label ID="lblMobileUpdates" runat="server" Text="Mobile Updates"></asp:Label>
                </div>
                <div>
                    <asp:Label ID="lblSystem" runat="server" Text="Operative System"></asp:Label>
                    <br />
                    <asp:DropDownList ID="ddlDevice" runat="server">
                        <asp:ListItem Value="ios">iOS</asp:ListItem>
                        <asp:ListItem Value="android">Android</asp:ListItem>
                        <asp:ListItem Value="windows8">Windows 8</asp:ListItem>
                    </asp:DropDownList>
                </div>
                <div>
                    <asp:Label ID="lblVersion" runat="server" Text="Version number"></asp:Label><br />
                    <asp:TextBox ID="txtVersion" runat="server">0</asp:TextBox><br />
                    <asp:RegularExpressionValidator ID="valValidVersion" runat="server" ControlToValidate="txtVersion"
                        ErrorMessage="Invalid format version" SetFocusOnError="True" ToolTip="Invalid format version"
                        ValidationExpression="^\d{2}.\d{1}.\d{1}.\d{4}$" ValidationGroup="grpUploadFile">*</asp:RegularExpressionValidator>
                    <asp:RequiredFieldValidator ID="valFieldRequired" runat="server" ErrorMessage="Version number is a field required"
                        ControlToValidate="txtVersion" SetFocusOnError="True" ValidationGroup="grpUploadFile"
                        ToolTip="Version number is a field required">*</asp:RequiredFieldValidator>
                </div>
                <div>
                    <asp:Label ID="lblFile" runat="server" Text="Zip File"></asp:Label><br />
                    <asp:FileUpload ID="fileUpdates" runat="server" /><br />
                    <asp:RegularExpressionValidator ID="valUploadFile" runat="server" ControlToValidate="fileUpdates"
                        ErrorMessage="Only .zip formats is allowed." SetFocusOnError="True" ToolTip="Only .zip formats is allowed."
                        ValidationExpression="^.*\.(zip|ZIP|Zip)$" ValidationGroup="grpUploadFile">*</asp:RegularExpressionValidator>
                    <asp:RequiredFieldValidator ID="valFileRequired" runat="server" ErrorMessage="File is a field required"
                        ControlToValidate="fileUpdates" SetFocusOnError="True" ToolTip="File is a field required"
                        ValidationGroup="grpUploadFile">*</asp:RequiredFieldValidator>
                </div>
                <div>
                    <asp:Button ID="btnUpload" runat="server" Text="Save" OnClick="btnUpload_Click" ValidationGroup="grpUploadFile" />
                </div>
            </div>
            <div class="errorMessage">
                <asp:Label ID="lblStatus" runat="server" ForeColor="WhiteSmoke" Text="Upload status: "
                    Visible="False"></asp:Label>
                <asp:ValidationSummary ID="sumUpload" runat="server" ValidationGroup="grpUploadFile" />
            </div>
        </div>
    </div>
    </form>
</body>
</html>
