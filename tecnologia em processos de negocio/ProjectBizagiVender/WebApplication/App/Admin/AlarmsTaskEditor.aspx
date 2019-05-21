<%@ Page Language="c#" CodeBehind="AlarmsTaskEditor.aspx.cs" AutoEventWireup="false"
    Inherits="BizAgiBPM.App.Admin.AlarmsTaskEditor" %>

<%@ Register TagPrefix="UI" Namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<html>
<head>
    <title>AlarmsTaskEditor</title>
    <meta name="GENERATOR" content="Microsoft Visual Studio 7.0" />
    <meta name="CODE_LANGUAGE" content="C#" />
    <meta name="vs_defaultClientScript" content="JavaScript" />
    <meta name="vs_targetSchema" content="http://schemas.microsoft.com/intellisense/ie5" />
    <link href="../../css/estilos.css" type="text/css" rel="stylesheet" />
    <link href="../../css/WorkPortal/WPCustomStyles.css" type="text/css" rel="stylesheet" />
    <link href="../../css/Admin/Common.css" rel="stylesheet" type="text/css" />
    <script language="javascript" type="text/javascript" src="../../Localization/LocalizationEN.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/scripts.js"></script>
</head>
<body ms_positioning="FlowLayout">
    <% Header(); %>
    <form id="AlarmsTaskEditor" method="post" runat="server">
    <table cellspacing="0" cellpadding="0" width="550" align="center">
        <tr>
            <td class="header">
                <UI:CLabel runat="server" Text="AlarmTask" /><!--Task-->: <span id="SpanTaskDisplayName"
                    runat="server"></span>
            </td>
        </tr>
        <tr>
            <td>
                &nbsp;
            </td>
        </tr>
        <tr>
            <td class="header">
                <UI:CLabel runat="server" Text="AlarmList" /><!--ALARM LIST-->
            </td>
        </tr>
        <tr>
            <td>
                <!-- Labels for TableAlarmsForTask -->
                <!--Alarm-->
                <!--LapseMode-->
                <!--AlarmTime-->
                <!--RecurMode-->
                <!--RecurTime-->
                <!--SchType-->
                <!--Enabled-->
                <!----------------------------------->
                <table id="TableAlarmsForTask" cellspacing="2" cellpadding="2" width="100%" align="center"
                    runat="server">
                    <tr>
                        <td class="ListHeaderLinks" style="background-image: none;">
                            <UI:CLabel runat="server" Text="AlarmLapse" />
                        </td>
                        <td class="ListHeaderLinks" style="background-image: none;">
                            <UI:CLabel runat="server" Text="AlarmTime" />
                        </td>
                        <td class="ListHeaderLinks" style="background-image: none;">
                            <UI:CLabel runat="server" Text="AlarmRecurr" />
                        </td>
                        <td class="ListHeaderLinks" style="background-image: none;">
                            <UI:CLabel runat="server" Text="AlarmTimeBetweenRecurr" />
                        </td>
                        <td class="ListHeaderLinks" style="background-image: none;">
                            <UI:CLabel runat="server" Text="AlarmInterval" />
                        </td>
                        <td class="ListHeaderLinks" style="background-image: none;">
                            <UI:CLabel runat="server" Text="AlarmActive" />
                        </td>
                        <td class="ListHeaderLinks" style="background-image: none;">
                            &nbsp;
                        </td>
                        <td class="ListHeaderLinks" style="background-image: none;">
                            &nbsp;
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td>
                <span id="SpanListMessages" runat="server"></span>
            </td>
        </tr>
        <tr>
            <td>
                &nbsp;
            </td>
        </tr>
        <tr>
            <td class="header">
                <UI:CLabel runat="server" Text="AlarmsEditorTitle" /><!--ALARMS EDITOR-->
            </td>
        </tr>
        <tr>
            <td>
                <table width="100%" align="center">
                    <tr valign="top">
                        <td>
                            <table cellspacing="1" cellpadding="2" width="100%" align="center">
                                <tr>
                                    <td class="ListHeaderLinks" style="background-image: none;">
                                        <UI:CLabel runat="server" Text="AlarmLapse" /><!--LapseMode-->
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <asp:RadioButtonList ID="RadioButtonListLapseMode" runat="server" CellPadding="2"
                                            AutoPostBack="True">
                                        </asp:RadioButtonList>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                            <table cellspacing="1" cellpadding="2" width="100%" align="center">
                                <tr>
                                    <td class="ListHeaderLinks" style="background-image: none;">
                                        <UI:CLabel runat="server" Text="AlarmRecurr" /><!--RecurMode-->
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <asp:RadioButtonList ID="RadioButtonListRecurMode" runat="server" CellPadding="2"
                                            AutoPostBack="True">
                                        </asp:RadioButtonList>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <table cellspacing="1" cellpadding="2" width="100%" align="center">
                                <tr>
                                    <td class="ListHeaderLinks" style="background-image: none;" colspan="2">
                                        <UI:CLabel runat="server" Text="AlarmTiming" /><!--Timing-->
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <UI:CLabel runat="server" Text="AlarmLapse" />
                                        <!--AlarmTime-->
                                        <asp:TextBox ID="TextBoxAlarmTime" runat="server" size="4" />
                                    </td>
                                    <td>
                                        <UI:CLabel runat="server" Text="AlarmRecurrTime" />
                                        <!--RecurrTime-->
                                        <asp:TextBox ID="TextBoxRecurTime" runat="server" size="4" />
                                        <asp:DropDownList ID="DropDownListRecurTime" runat="server" />
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <asp:CheckBox ID="CheckBoxToCurrentAssignee" runat="server" Text="Enviar al asignado actual "
                                TextAlign="Left"></asp:CheckBox><!--send to current assignee? -->
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td>
                &nbsp;
            </td>
        </tr>
        <tr>
            <td>
                <span id="SpanEditorMessages" runat="server"></span>
            </td>
        </tr>
        <tr>
            <td>
                &nbsp;
            </td>
        </tr>
        <tr>
            <td>
                <input id="HtmlInputHiddenIdAlarm" type="hidden" name="HtmlInputHiddenIdAlarm" runat="server">
                <input id="HtmlInputHiddenAction" type="hidden" value="add" name="HtmlInputHiddenAction"
                    runat="server">
                <table border="0">
                    <tr>
                        <td>
                            <UI:CWPHtmlInputButton runat="server" type="button" value="BtnAlarmBrowser" name="HtmlInputButtonBackToBrowser"
                                onclick="location.href='AlarmsAdmin.aspx'" ID="HtmlInputButtonBackToBrowser" />
                        </td>
                        <td>
                            &nbsp;&nbsp;
                        </td>
                        <td>
                            <UI:CButton ID="BtnEnableDisableAlarms" runat="server" Text="" />
                        </td>
                        <td>
                            &nbsp;&nbsp;
                        </td>
                        <td>
                            <UI:CButton ID="BtnEditAlarms" runat="server" Text="" />
                        </td>
                        <td>
                            &nbsp;&nbsp;
                        </td>
                        <td>
                            <UI:CWPHtmlInputButton runat="server" type="button" value="BtnCancelAlarm" name="HtmlInputButtonNewAlarm"
                                ID="HtmlInputButtonNewAlarm">
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td>
                &nbsp;
            </td>
        </tr>
        <tr>
            <td class="header">
                <UI:CLabel runat="server" Text="AlarmRecipientsTitle" /><!--ALARM RECIPIENTS-->
            </td>
        </tr>
        <tr>
            <td>
                <span id="SpanRecipientMessages" runat="server"></span>
            </td>
        </tr>
        <tr>
            <td>
                <table cellspacing="1" cellpadding="2" width="100%" align="center">
                    <tr>
                        <td class="ListHeaderLinks" colspan="2" style="background-image: none;">
                            <UI:CLabel runat="server" Text="AddAlarmRecipients" /><!--Add recipients-->
                        </td>
                    </tr>
                    <tr>
                        <td width="50%">
                            <asp:DropDownList ID="DropDownListRecipients" runat="server">
                            </asp:DropDownList>
                            &nbsp;
                            <UI:CButton ID="BtnAddRecipient" runat="server" Text="BtnAddRecipient" /><!--Add recipient-->&nbsp;
                            <UI:CButton ID="BtnDeleteRecipients" runat="server" Text="BtnDeleteRecipients" /><!--Delete selected recipients-->
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <!-- Labels for TableRecipients -->
                            <!--Rule ID-->
                            <!--Rule Name-->
                            <!-------------------------------->
                            <table id="TableRecipients" cellspacing="2" cellpadding="2" width="100%" align="center"
                                runat="server">
                                <tr>
                                    <td class="ListHeaderLinks" style="background-image: none;">
                                        <UI:CLabel runat="server" Text="RecipientEmail" />
                                    </td>
                                    <td class="ListHeaderLinks" style="background-image: none;">
                                        <UI:CLabel runat="server" Text="RecipientName" />
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    </form>
</body>
</html>
