<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="mobile.aspx.cs" Inherits="BizAgiBPM.defaultNew" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Configure your smartphone</title>
       <!--<link href="http://twitter.github.com/bootstrap/assets/css/bootstrap.css" rel="stylesheet">-->

    <script src="jquery/common/base/js/lib/smartphone/jquery.js" type="text/javascript"></script>
    <script src="jquery/common/jquery.ui/js/smartphone/jquery.ui.js" type="text/javascript"></script>
    <link href="jquery/common/jquery.ui/css/smartphone/jquery.ui.css" rel="stylesheet"
        type="text/css" />
    <style type="text/css">
        *   {
        vertical-align:top;
        }
        
        body {
        padding:20px;
        font-family:sans-serif;
        overflow-y:scroll;
        }
        
        .btn {
            display: inline-block;
            padding: 4px 12px;
            margin-bottom: 0;
            font-size: 14px;
            line-height: 20px;
            color: #333333;
            text-align: center;
            text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75);
            vertical-align: middle;
            cursor: pointer;
            background-color: #f5f5f5;
            background-image: -moz-linear-gradient(top, #ffffff, #e6e6e6);
            background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#ffffff), to(#e6e6e6));
            background-image: -webkit-linear-gradient(top, #ffffff, #e6e6e6);
            background-image: -o-linear-gradient(top, #ffffff, #e6e6e6);
            background-image: linear-gradient(to bottom, #ffffff, #e6e6e6);
            background-repeat: repeat-x;
            border: 1px solid #cccccc;
            border-color: #e6e6e6 #e6e6e6 #bfbfbf;
            border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);
            border-bottom-color: #b3b3b3;
            -webkit-border-radius: 4px;

            border-radius: 4px;

            -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);

        }
        
        .form
        {
         display: inline-block;
        margin-bottom: 0;
        vertical-align: middle;
         }
         .hrpepito
         {
            margin: 20px 0;
            border: 0;
            border-top: 1px solid #eeeeee;
            border-bottom: 1px solid #ffffff;
         }
         #frames {
        overflow-x: scroll;
        width: 100%;
        margin-bottom: 10px;
        padding-bottom: 20px;
    }
    .frame {
        margin-right:20px;
        float:left;
    }
    .frame input {
        width: 100%;
    }
    .frame:last-child {
        margin-right:0;
    }
    iframe {
        border:solid 1px #000;
    }
    </style>
    


   <script type="text/javascript">

       var base = document.URL.replace("mobile.aspx?#", "").replace("mobile.aspx","");

       window.onload = function () {
           $("#loaddevice").click(function () {
               addDevice();
           });
       };

       function addDevice() {
           var selectedItem = $("#selectso option:selected");
           var overridesDimension = $("#overrides").is(':checked');
              var width = selectedItem.data("w");
              var height = selectedItem.data("h");
              var url = base + "?device=" + selectedItem.data("device");
              var div = document.createElement('div');
              div.className = 'frame';
              div.style.width = (parseInt(width, 10) + 10) + 'px';
              div.innerHTML = '<h3>' + selectedItem.data("device") + '</h3>';
              console.info("start mobile1");
              var iframe = document.createElement('iframe');
              iframe.setAttribute('src', url);
              iframe.setAttribute('width', width);
              iframe.setAttribute('height', height);
              iframe.setAttribute('sandbox', 'allow-same-origin allow-forms allow-scripts');
              iframe.setAttribute('seamless', 'seamless');
              div.appendChild(iframe);
              console.info("start mobile 3");
              $("#frames").append(div);
          }
      </script>


</head>
<body >

  <select id="selectso" class="form">
  <optgroup label="iOS">
    <option value="iphone" data-device="smartphone_ios" data-w="320" data-h="480" >IPHONE</option>
    <option value="ipad" data-device="tablet"  data-w="1024" data-h="768">IPAD</option>
  </optgroup>
  <optgroup label="ANDROID">
    <option value="s3" data-device="smartphone_android" data-w="360" data-h="640">Galazy S III</option>
    <option value="s3mini" data-device="smartphone_android" data-w="360" data-h="640">Galazy S III mini</option>
    <option value="tabletandroid" data-device="tablet_android" data-w="1280" data-h="750">Tablet</option>
  </optgroup>
</select>

<label for="overrides" class="form">Overrides dimension?:</label>
<input id="overrides" type="checkbox" class="form"/>
<label for="portrait" class="form">Portrait?:</label>
<input id="portrait" type="checkbox" class="form"/>
<button class="btn" id="loaddevice" class="form">Add Device</button>  

<hr class="hrpepito"/>


    <div id="frames">
    </div>






</body>
</html>
