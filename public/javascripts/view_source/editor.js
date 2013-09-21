$(function () {
	mc2.taski = {};
	try {
		mc2.taski.files = JSON.parse(unescape($("#result-data").html())).code[0]
	} catch (e) {
	    mc2.taski.files	= {"index\\dothtml":"helloasdfasd|", "hello\\dothtml":"asdfasdf"}
	}

	mc2.taski.editor = ace.edit("editarea");

	//初始化editor
	var editor = mc2.taski.editor;
	editor.setTheme("ace/theme/chrome");
	editor.getSession().setMode("ace/mode/html");
	editor.setReadOnly(true);

	$(".work-tabs-wrap").delegate("li>a","click",function () {
		var that = this;
		$(".work-tabs-wrap>li.active").removeClass("active");
		$(this).parent().addClass("active");
		mc2.taski.editor.setValue(mc2.taski.files[($(that).text()).replace(".","\\dot")],1);
		mc2.taski.editor.focus();
	});
	var temp;
	for (temp in mc2.taski.files) {
		if (mc2.taski.files.hasOwnProperty(temp) && !/^%/.test(temp)) {
			var $new_li = $("<li>").
				append( ($("<a>")).
						attr("href","#").
						text((temp).replace("\\dot",".")) );
			$(".work-tabs-wrap>li").has("a>i.icon-plus").before($new_li);
		}
	}
	$(".work-tabs-wrap>li:eq(0)").addClass("active");
	mc2.taski.editor.setValue(mc2.taski.files[($(".work-tabs-wrap>li>a:eq(0)").text()).replace(".","\\dot")], 1);
});
