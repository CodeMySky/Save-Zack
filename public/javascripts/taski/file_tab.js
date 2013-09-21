$(function () {
	mc2.taski.fileOp_enable = false;
	if (parseInt(mc2.taski.task_seq, 10) > 15) {
		mc2.taski.fileOp_enable = true;
	}
	$(".work-tabs-wrap").delegate("li>a","click",function () {
		var that = this;
		if ($(this).find("i.icon-plus").length !== 0) {
			//添加一个新文件
			var new_file_name = prompt("请输入要添加的文件名:");
			if (!new_file_name || mc2.taski.files.hasOwnProperty(new_file_name)) { return; }
			mc2.taski.files[(new_file_name).replace(".","\\dot")] = "";
			localStorage.setItem("files_task"+mc2.taski.task_seq, JSON.stringify(mc2.taski.files));
			var $new_li = $("<li>").
				append( ($("<a>")).
					attr("href","#").
					text(new_file_name).
					trigger("click") );
			if (mc2.taski.fileOp_enable) {
				$new_li.append("<i class='icon-minus'></i>");
			}
			$(this).parent().before($new_li);
			$new_li.find("a").trigger("click");
		} else {
			$(".work-tabs-wrap>li.active").removeClass("active");
			$(this).parent().addClass("active");
			mc2.taski.editor.setValue(mc2.taski.files[($(that).text()).replace(".","\\dot")],1);
			mc2.taski.editor.focus();
		}
	});
	var temp;
	for (temp in mc2.taski.files) {
		if (mc2.taski.files.hasOwnProperty(temp) && !/^%/.test(temp)) {
			var $new_li = $("<li>").
				append( ($("<a>")).
						attr("href","#").
						text((temp).replace("\\dot",".")) );
			if (mc2.taski.fileOp_enable) {
				$new_li.append("<i class='icon-minus'></i>");
			}
			$(".work-tabs-wrap>li").has("a>i.icon-plus").before($new_li);
		}
	}
	$(".work-tabs-wrap>li:eq(0)").addClass("active");
	mc2.taski.editor.setValue(mc2.taski.files[($(".work-tabs-wrap>li>a:eq(0)").text()).replace(".","\\dot")], 1);

	if (mc2.taski.fileOp_enable) {
		$(".work-tabs-wrap").addClass("fileOp_enable");
		$(".work-tabs-wrap li:has(i.icon-plus)").removeClass("hide");
		$(".work-tabs-wrap").on("click", "li i.icon-minus", function () {
			if (confirm("确认删除文件"+$(this).parent().find("a").text()+"吗?")) {
				//删除文件@change
				delete mc2.taski.files[$(this).parent().find("a").text().replace(".","\\dot")];
				mc2.taski.files["%time_stamp"] = (new Date()).getTime();
				localStorage.setItem("files_task"+mc2.taski.task_seq, JSON.stringify(mc2.taski.files));
				if ($(this).parent().hasClass("active")) {
					$(this).parent().parent().find("li a:eq(0)").trigger("click");
				}
				$(this).parent().remove();
			}
		});
		$(".work-tabs-wrap").on("dblclick", "li:not(:contains(index.html)) a", function () {
			var new_name = prompt("请输入新文件名：", $(this).text());
			if (new_name) {
				//改名@change
				mc2.taski.files[new_name.replace(".","\\dot")] = mc2.taski.files[$(this).parent().find("a").text().replace(".","\\dot")];
				delete mc2.taski.files[$(this).parent().find("a").text().replace(".","\\dot")];
				$(this).text(new_name);
				mc2.taski.files["%time_stamp"] = (new Date()).getTime();
				localStorage.setItem("files_task"+mc2.taski.task_seq, JSON.stringify(mc2.taski.files));
			}
		});
	}

	//index.html不能删不能重命名
	$(".work-tabs-wrap>li:has(:contains(index.html))>i").remove();
});
