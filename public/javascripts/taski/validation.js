/**
 * 文件功能：
 * 监听运行、提交按钮的点击事件，进行正确性验证
 *
 * vldt_funcs:
 * 里放的应该是一个一个函数源代码的字符串。每个函数对应一个练习(stage)
 * 函数序列应该与stage序列严格对应,但函数序列从0号开始，而stage从1开始
 * [函数要求]：
 * 会接受到一个用户所写的源代码的字符串参数
 * 需返回true或false或错误信息(字符串)
 */
$(function () {
	var vldt_funcs = mc2.taski.vldt_funcs;
	var task_seq = mc2.taski.task_seq;
	var origin_title = document.title;

	$(window).on("resize", function () {
		var h_parent = parseInt($("#modal-result").css("height"));
		if ($("#modal-result>.modal-header.hide").length <1) { //若header没有hide
			var h_title_bar = parseInt($("#modal-result .modal-header").css("height")) + parseInt($("#modal-result .modal-header").css("padding-top")) + parseInt($("#modal-result .modal-header").css("padding-bottom")) || 0;
			$("#modal-result iframe").css("height", (h_parent-h_title_bar)+"px");
		}
		else {
			$("#modal-result iframe").css("height", h_parent+"px");
		}
	});

	$('#modal-result').on("shown", function(){
		var reg_css = /<link\s+(?:[^>]*\s+)?href\s*=\s*(['"])(?:\.\/)*([^\/>]+)\.css\1[^>]*\/>/g;
		var reg_js = /<script\s+(?:[^>]*\s+)?src\s*=\s*(['"])(?:\.\/)*([^\/>]+)\.js\1[^>]*>[^<]*<\/script>/g;
		var $modal_result = $("#modal-result");
			$modal_result.append("<iframe>");
		var iframe = $modal_result.find("iframe")[0];

		function load_local_html (code) {
			code = code.replace(reg_css, function () {
					var css_name = arguments[2];
					var style_tag;
				   	if (mc2.taski.files[css_name+'\\dotcss']) {
						style_tag = '<style type="text/css">'+mc2.taski.files[css_name+'\\dotcss']+'</style>';
					} else {
						style_tag = '';
					}
					return style_tag;
				});

			code = code.replace(reg_js, function () {
					var js_name = arguments[2];
					var js_tag;
					if (mc2.taski.files[js_name+'\\dotjs']) {
						js_tag = '<script type="text/javascript">\n'+mc2.taski.files[js_name+'\\dotjs']+'\n</script>';
					}
					else {
						js_tag = '';
					}
					return js_tag;
				});

			var iframe_docu = iframe.contentDocument;
			var iframe_wnd = iframe.contentWindow;
			iframe_docu.write(code);
			iframe_docu.close();
			document.title = iframe_docu.title;

			$(iframe).ready(function () {
				$(iframe_docu.body).focus();
				$(iframe_docu.body).on("keydown", function () {
					var e = event || iframe_wnd.event;
					var key = e.which || e.keyCode || e.charCode;
					if (key === 27 || key === 8) {
						$modal_result.modal("hide");
						return false;
					}
				});
				$(iframe_docu.body).on("click", "a:not([href^=http\\:\\/\\/])", function (e) {
					//到这里的都是没有以http://开头的
					var reg_href = /^[^\/>]+\.html$/g; //不允许再有路径层次
					var file_name = reg_href.exec($(this).attr("href"));
					if (file_name && file_name.length>0 && !e.isDefaultPrevented()) {
						file_name = file_name[0];
						code = mc2.taski.files[file_name.replace(".","\\dot")];
						load_local_html(code);
						return false;
					}
				});
			});
		}

		var code = mc2.taski.files['index\\dothtml'];
		load_local_html(code);

		/*$("body").on("keydown.prevent_back", function (e) {
			if (e.which === 8) {
				$modal_result.modal("hide");
				e.preventDefault();
			}
		});*/
		$(function () {
			$(window).trigger("resize");
		});
	});

	$("#modal-result").on("hidden", function () {
		$("#modal-result iframe").css("height", mc2.taski.result_iframe_h_old);
		$("#modal-result").find("iframe").remove();//先把以前的iframe清掉，要不如果跳转了，下次就访问不到这个iframe.contentDocument,就无法用write向里写内容了
		document.title = origin_title;
		//在提交成功后，header会隐掉
		$(this).find(".modal-header").removeClass("hide");
		//$("body").off("keydown.prevent_back");
		mc2.taski.editor.focus();
	});

	$('.funbar-preview').click(function () {
		$("#modal-result").find(".modal-header").addClass("hide");
	});

    $('.funbar-submit').click(function(event){
		var seq = parseInt($("[id^='il-set-'].active>a").html(), 10);
		var validation_function = vldt_funcs[seq-1];
		var code = mc2.taski.files["index\\dothtml"];
		var vldt_result;
		$(".work>.alert").remove();
		var $result_bar = $('\
			<div class="alert">\
				<span class="description"></span>\
				<span class="detail"></span>\
				<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>\
			</div>\
			');
		$(".work-funbar").before($result_bar);
		var $modal_result = $("#modal-result");

		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("POST", "/submission", true);
		xmlHttp.setRequestHeader("Content-Type", "application/json");

		//mc2.taski.files[($(".work-tabs-wrap>li.active>a").text()).replace(".","\\dot")] = code;
		//mc2.taski.files["%time_stamp"] = (new Date()).getTime();
	    if (typeof validation_function === "function") {
			vldt_result	= validation_function(code);
		} else {
			vldt_result = true;
		}
		if (vldt_result === true) {
			if (parseInt($("[id^='il-set-'].active>a").html(),10) > mc2.taski.passed_stages_amount) {
				++mc2.taski.passed_stages_amount;
			}
			//改变标签状态
			$("#il-set-"+seq).removeClass("ing");
			$("#il-set-"+seq).addClass("done");
			if ( $("#il-set-"+(seq+1)).hasClass("disabled") ) {
				$("#il-set-"+(seq+1)).removeClass("disabled");
				$("#il-set-"+(seq+1)).addClass("ing");
				$("#il-set-"+(seq+1)+">a").attr("data-toggle", "tab");
			}
			if (seq === vldt_funcs.length) {
				//若所有stage都完成
				//$modal_header.children("div").addClass("hide");
				//$modal_header.children(".misson-done").removeClass("hide");
				if (mc2.taski.status !== "done") {
					//$modal_header.children(".misson-done").find("h1").html("获得奖励："+mc2.taski.gain+"<sup>e</sup>");
					$modal_result.find(".modal-header .energy").html("+"+mc2.taski.gain+"<sup>e</sup>");
					if (mc2.taski.hint === "plus_one") {
						$modal_result.find(".modal-header .energy").html("提交成功");
					}
				}
				else {
					//$modal_header.children(".misson-done").find("h1").html(" ");
					$modal_result.find(".modal-header .energy").html(" ");
				}
				//$modal_footer.children(".btn").addClass("hide");
				//$modal_footer.children(".back2list").removeClass("hide");
				$result_bar.remove();

				//$("#modal-clear").modal('toggle');
				$modal_result.find(".modal-header").removeClass("hide");
				$modal_result.modal('toggle');
				mc2.taski.status = "done";
			} else {
				$("#il-set-"+(seq+1)+">a").trigger("click");
				$result_bar.find("span.description").html("OK通过");
				$result_bar.removeClass("alert-error").addClass("alert-success").
					css("bottom", "0").animate({bottom:"27px"}, "fast", function () {
							$result_bar.fadeOut(3000, function () {
								$(this).remove();
								});
						});
			}
		} else {
		   	if (typeof vldt_result === "string") {
				//$modal_header.find(".misson-error>h4").text("提示："+vldt_result);
				$result_bar.find("span.detail").html("提示："+vldt_result);
			}
			else {
				//$modal_header.find(".misson-error>h4").text("");
				$result_bar.find("span.detail").html("");
			}
			$result_bar.find("span.description").text("还有些小问题哦");
			$result_bar.removeClass("alert-success").addClass("alert-error").
				css("bottom", "0").animate({bottom:"27px"}, "fast");
		}
		localStorage.setItem("passed_stages_amount_task"+task_seq, mc2.taski.passed_stages_amount);
		localStorage.setItem("files_task"+task_seq, JSON.stringify(mc2.taski.files));
		localStorage.setItem("status_task"+task_seq, JSON.stringify(mc2.taski.status));
		//post
		var data = {
			taskNo: mc2.taski.task_seq,
			status: mc2.taski.status,
			passedStage: mc2.taski.passed_stages_amount,
			code: [mc2.taski.files],
			energy: (seq===vldt_funcs.length)?mc2.taski.gain:0
		};
		if (mc2.taski.hint === "plus_one") {
			data.energy = 0;
		}
		xmlHttp.send(JSON.stringify(data));
	});

    $('.funbar-save').click(function(event){
		var seq = parseInt($("[id^='il-set-'].active>a").html(), 10);
		var code = mc2.taski.editor.getValue();
		//mc2.taski.files[($(".work-tabs-wrap>li.active>a").text()).replace(".","\\dot")] = code;
		mc2.taski.files["%time_stamp"] = (new Date()).getTime();
		localStorage.setItem("files_task"+task_seq, JSON.stringify(mc2.taski.files));
		//post
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("POST", "/submission", true);
		var data = {
			taskNo: mc2.taski.task_seq,
			status: mc2.taski.status,
			passedStage: mc2.taski.passed_stages_amount,
			code: [mc2.taski.files],
			energy: (seq===vldt_funcs.length)?mc2.taski.gain:0
		};
		xmlHttp.setRequestHeader("Content-Type", "application/json");
		xmlHttp.send(JSON.stringify(data));
		alert("保存成功");
	});

	$("[id^=il-set-]>a").click(function () {
			$(".work>.alert.alert-error").remove();
		});

	//焦点回到编辑器
	$("[id^=il-set-]>a").add("a.preview").
		add(".funbar-submit").add(".funbar-save").
		click(function () {
			mc2.taski.editor.focus();
		});
	$("[id^=modal]").on("close", function () {
		mc2.taski.editor.focus();
	});
});

$(function () {
	if (mc2.taski.hint === "plus_one") {
		$(".modal-header-share>p").text("提交成功，分享给朋友看看：");
	}
});
