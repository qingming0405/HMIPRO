if (typeof jQuery !== "undefined" && typeof saveAs !== "undefined") {
  (function($) {
    $.fn.wordExport = function(fileName) {
      fileName = typeof fileName !== 'undefined' ? fileName : "jQuery-Word-Export";
      var static = {
        mhtml: {
          top: "Mime-Version: 1.0\nContent-Base: " + location.href + "\nContent-Type: Multipart/related; boundary=\"NEXT.ITEM-BOUNDARY\";type=\"text/html\"\n\n--NEXT.ITEM-BOUNDARY\nContent-Type: text/html; charset=\"utf-8\"\nContent-Location: " + location.href + "\n\n<!DOCTYPE html>\n<html>\n_html_</html>",
          head: "<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n<style>\n_styles_\n</style>\n</head>\n",
          body: "<body>_body_</body>"
        }
      };
      var options = {
        maxWidth: 550
      };
      // Clone selected element before manipulating it
      var markup = $(this).clone();

      // Remove hidden elements from the output
      markup.each(function() {
        var self = $(this);
        if (self.is(':hidden'))
          self.remove();
      });

      // Embed all images using Data URLs
      var images = Array();
      var img = markup.find('img');
      for (var i = 0; i < img.length; i++) {
        // Calculaste dimensions of output image
        var w = Math.min(img[i].width, options.maxWidth);
        var h = img[i].height * (w / img[i].width);
        var uri;
        img.attr("crossOrigin", 'Anonymous');
        // Create canvas for converting image to data URL
        if (img[i].src.slice(0, 4) !== 'data') {
          var canvas = document.createElement("CANVAS");
          canvas.width = w;
          canvas.height = h;
          // Draw image to canvas
          var context = canvas.getContext('2d');
          // console.log(img);
          // img.attr("crossOrigin", 'Anonymous')
          // img.onload = function (){
          context.drawImage(img[i], 0, 0, w, h);
          // Get data URL encoding of image

          // var img_id = '#'+img[i].id;
          // $('<canvas>').attr("id", "test_word_img_" + i).width(w).height(h).insertAfter(img_id);

          uri = canvas.toDataURL("image/png");
          // console.log(i,uri);

          // console.log(i,uri);
          $(img[i]).attr("src", img[i].src);
          img[i].width = w;
          img[i].height = h;
          // Save encoded image to array
        } else {
          uri = img[i].src;
        }
        images[i] = {
          type: uri.substring(uri.indexOf(":") + 1, uri.indexOf(";")),
          encoding: uri.substring(uri.indexOf(";") + 1, uri.indexOf(",")),
          location: $(img[i]).attr("src"),
          data: uri.substring(uri.indexOf(",") + 1)
        };
        // }
      }

      // Prepare bottom of mhtml file with image data
      var mhtmlBottom = "\n";
      for (var i = 0; i < images.length; i++) {
        mhtmlBottom += "--NEXT.ITEM-BOUNDARY\n";
        mhtmlBottom += "Content-Location: " + images[i].location + "\n";
        mhtmlBottom += "Content-Type: " + images[i].type + "\n";
        mhtmlBottom += "Content-Transfer-Encoding: " + images[i].encoding + "\n\n";
        mhtmlBottom += images[i].data + "\n\n";
      }
      mhtmlBottom += "--NEXT.ITEM-BOUNDARY--";
      var headFoot = markup.html();
      headFoot += '\n<table id="googoose-hdrftrtbl" width="550"><tbody><tr><td class="h">\n';
      headFoot += '<div style="mso-element:header" id="googoose-header1">&nbsp;</div>';
      headFoot += '<div style="mso-element:footer" id="googoose-footer1">&nbsp;</div>';
      // headFoot += '<div style="mso-element:header" id="googoose-header2">\n';
      // headFoot += '<p class="MsoHeader">\n';
      // headFoot += '</p><div class="googoose header"><table style="width:100%;border-bottom:1px solid #000;"><tr><td style="width:50%;"><img width="60" height="60" src="img/wordText/image008.jpg" alt=""></td><td style="width:50%;" align="right"><tr style="font-size:10.5pt;"><td colspan="2">杭州经济技术开发区<span style="font-family:Times New Roman;">6号路260号中自科技园1幢5楼</span></td></tr><tr style="font-size:10.5pt;"><td>传真：<span style="font-family:Times New Roman;">0571-28995841</span></td><td>网址：<a href="www.windit.com.cn" style="font-family:Times New Roman;">www.windit.com.cn</a></td></tr></td></tr></table></div><p>\n';
      // headFoot += '</p>\n</div>\n';
      // headFoot += '<div style="mso-element:footer" id="googoose-footer2">&nbsp;</div>';
      headFoot += '<div style="mso-element:header" id="googoose-header3">\n';
      headFoot += '<p class="MsoHeader">\n';
      headFoot += '</p><div class="googoose header"><table style="width:100%;border-bottom:1px solid #000;"><tr><td style="width:50%;"><img width="60" height="60" src="img/wordText/image008.jpg" alt=""></td><td style="width:50%;" align="right"><i style="color:#0070C0;font-family:黑体;font-size:12pt;"><div><span>咨询电话：</span><span style="font-family:Times New Roman;">4000093668-7</span></div><div><span>网站：</span><span style="font-family:Times New Roman;">www.windit.com.cn</span></div></i></td></tr></table></div><p>\n';
      headFoot += '</p>\n</div>\n';
      headFoot += '</td><td class="f"><div style="mso-element:footer" id="googoose-footer3"><div class="googoose footer"><span class="googoose currentpage">';
      headFoot += '<table style="border-top:1px solid #000;"><tr><td style="font-size:9pt;width:530px;">';
      headFoot += '<div style="margin-bottom:10px;width:520px;">◆版权所有<span style="font-family:Times New Roman;"> © 2018-2020 </span>浙江中自庆安新能源技术有限公司</div>';
      headFoot += '<div>◆我们保留本文档和信息的全部所有权利。未经明示授权，严禁复制、使用或披露给第三方。</div>';
      headFoot += '</td><td align="right" style="width:180px;"><img align="right" style="margin:0;" src="img/wordText/image009.png" width="170" height="33"></td></tr><tr><td colspan="2" style="font-size:14pt;font-family:Times New Roman;font-weight:bold;padding-right:20px;" align="right">';
      headFoot += "<!--[if supportFields]><span class=MsoPageNumber><span style='mso-element:field-begin'>";
      headFoot += "</span><span style='mso-spacerun:yes'>";
      headFoot += "</span>PAGE <span style='mso-element:field-separator'></span></span><![endif]-->";
      headFoot += '<span class="MsoPageNumber"><span style="mso-no-proof:yes">-1</span></span>';
      headFoot += "<!--[if supportFields]><span class=MsoPageNumber><span style='mso-element:field-end'></span></span><![endif]--> / ";
      headFoot += "<!--[if supportFields]><span class=MsoPageNumber><span style='mso-element:field-begin'></span> NUMPAGES <span style='mso-element:field-separator'></span></span><![endif]-->";
      headFoot += '<span class="MsoPageNumber"><span style="mso-no-proof:yes">-1</span></span>';
      headFoot += "<!--[if supportFields]><span class=MsoPageNumber><span style='mso-element:field-end'></span></span><![endif]-->\n";
      headFoot += '</td></tr></table></span></div></div></td></tr></tbody></table>';

      //TODO: load css from included stylesheet
      var styles = "<!--\n" +
        "@page {\n" +
        "\tsize:8.5in 11.0in;\n" +
        "\tmargin:1.0in 0.7in;\n" +
        "}\n" +
        "@page WordSection1 {\n" +
        "\tmso-header-margin:.3in;\n" +
        "\tmso-footer-margin:.3in;\n" +
        "\tmso-title-page:yes;\n" +
        "\tmso-header:googoose-header1;\n" +
        "\tmso-footer:googoose-footer1;\n" +
        "}\n" +
        "div.WordSection1 { page:WordSection1; }\n" +
        "@page WordSection2 {\n" +
        "\tmso-header-margin:.3in;\n" +
        "\tmso-footer-margin:.3in;\n" +
        "\tmso-page-numbers:1;\n" +
        "\tmso-header:googoose-header2;\n" +
        "\tmso-footer:googoose-footer2;\n" +
        "}\n" +
        "div.WordSection2 { page:WordSection2; }\n" +
        "@page WordSection3 {\n" +
        "\tmso-header-margin:.3in;\n" +
        "\tmso-footer-margin:.3in;\n" +
        "\tmso-header:googoose-header3;\n" +
        "\tmso-footer:googoose-footer3;\n" +
        "}\n" +
        "div.WordSection3 { page:WordSection3; }\n" +
        "table#googoose-hdrftrtbl {\n" +
        "\tmargin:0in 0in 0in 9in;\n" +
        "}\n" +
        "-->";

      // Aggregate parts of the file together
      var fileContent = static.mhtml.top.replace("_html_", static.mhtml.head.replace("_styles_", styles) + static.mhtml.body.replace("_body_", headFoot)) + mhtmlBottom;

      // console.log(fileContent);
      // Create a Blob with the file contents
      var blob = new Blob([fileContent], {
        type: "application/ms-word;charset=utf-8"
      });
      $('#googoose-hdrftrtbl').remove();
      saveAs(blob, fileName + ".doc");
    };
  })(jQuery);
} else {
  if (typeof jQuery === "undefined") {
    console.error("jQuery Word Export: missing dependency (jQuery)");
  }
  if (typeof saveAs === "undefined") {
    console.error("jQuery Word Export: missing dependency (FileSaver.js)");
  }
}