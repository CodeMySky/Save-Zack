$(function () {
	/* vldt_funcs里放的应该是一个一个函数源代码的字符串。每个函数对应一个练习
	 * [函数要求]：返回true或false或错误信息
	 */
	var vldt_funcs = [];
	var response;
	var xmlHttp = new XMLHttpRequest();
	var i;
	xmlHttp.open("GET", "index_files\/task" + task_seq + "_vldt_func", true);
	xmlHttp.onreadystatechange = function () {
		if (xmlHttp.readyState === 4) {
			//得到字符串的数组，再把这些字符串变成函数
			if (xmlHttp.status === 200) {
				vldt_funcs = JSON.parse(xmlHttp.responseText);
			}
			for (i=0; i<vldt_funcs.length; ++i) {
				vldt_funcs[i] = eval(vldt_funcs[i]);
			}
		}
	};
	/*
	xmlHttp.open("POST", "task", true);
	xmlHttp.onreadystatechange = function () {
		if (xmlHttp.readyState === 4) {
			if (xmlHttp.status === 200) {
				response = JSON.parse(xmlHttp.responseText);
				console.log(response);
				for (i=0; i<response.stageArray.length; ++i) {
					vldt_funcs[i] = eval(response.stageArray[i].SCT);
				}
			}
		}
	};
	*/
	xmlHttp.send();
	$('.test').click(function(){
		var code = editor.getValue();
		var newpage = window.open("about:blank");
		newpage.document.title="测试页面";
		newpage.document.write(code);
	});
    $('.submit').click(function(){
		var seq = $('.revisit a.current').html();
		var validation_function = vldt_funcs[parseInt(seq, 10)-1];
		var code = editor.getValue();
		var vldt_result;
		stage_states[task_seq-1][seq-1].code = code;
	    if (typeof validation_function === "function") {
			vldt_result	= validation_function(code);
		}
		else vldt_result = true;
		if (vldt_result === true) {
			alert("ok done!");
			$(".revisit a:eq("+seq+")").trigger("click");
			stage_states[task_seq-1][seq-1].pass = true;
		}
		else if (typeof vldt_result === "string") {
			alert("还有点小问题哦，再检查一下吧：）\n" + vldt_result);
		}
		else {
			alert("还有点小问题哦，再检查一下吧：）");
		}
		$.cookie("stage_states", JSON.stringify(stage_states), {expires: 60});
	});
});
