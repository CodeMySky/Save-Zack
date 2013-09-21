if (!mc2.taski) {
	mc2.taski = {};
}
$(function () {
	var vldt_funcs = [];
	var response;
	var i;
	response = JSON.parse(unescape($("#tasks-data").html()));
	mc2.get_user();
	if (!mc2.user) {
		mc2.denglu();
	}
	$(".breadcrumb>li.active").html(response.info.title);
	$(".course-progress a.preview").each(function() {this.href = response.info.target;}); //目标页面
	for (i=0; i<response.stageArray.length; ++i) {
		response.stageArray[i].SCT = response.stageArray[i].SCT.replace(/^\s*\(/, "(false ||");
		response.stageArray[i].SCT = response.stageArray[i].SCT.replace(/\[\^\]/g, "[^$]");
		try {
			vldt_funcs[i] = eval(response.stageArray[i].SCT);
		} catch (e) {
			vldt_funcs[i] = null;
		}
		//progress部分的按钮
		$(".course-progress .steps>ul").append("\
			<li id='il-set-"+(i+1)+"' class='disabled'>\
				<a title='"+response.stageArray[i].title+"' href='#lesson-"+(i+1)+"'>"+(i+1)+"</a>\
			</li>");
		//内容
		$(".course-content").append(
			"<div class='lesson' id='lesson-"+(i+1)+"'>"+
				"<h1>"+response.stageArray[i].title+"</h1><hr/>"+
				"<h3>攻略</h3>"+
				response.stageArray[i].description+
				"<h3>步骤</h3>"+
				response.stageArray[i].step+
			"</div>");
	}
	mc2.taski.vldt_funcs = vldt_funcs;
	mc2.taski.task_seq = response.no;
	mc2.taski.gain = response.info.gain;
	mc2.taski.editor = ace.edit("editarea");
	if (response.status) {
		mc2.taski.status = response.status;
	} else if (localStorage.getItem("status_task"+mc2.taski.task_seq)) {
		mc2.taski.status = JSON.parse(localStorage.getItem("status_task"+mc2.taski.task_seq));
	} else {
		mc2.taski.status = "accepted";
	}
	var local_code = JSON.parse(localStorage.getItem("files_task"+mc2.taski.task_seq)); //存储用户代码文件,files是一个对象，文件名为键，文件代码为值
	if (response.code && response.code[0] && ( !response.code[0]["%time_stamp"] || !local_code || !local_code["%time_stamp"] //考虑以前没有时间戳的用户
			  || response.code[0]["%time_stamp"] > local_code["%time_stamp"]
			  )) {
		mc2.taski.files = response.code[0];
	} else {
		mc2.taski.files = local_code;
		//去掉以前留下的index.html属性，因为在section里传入后台时有.会报错
		//以后过一断时间把这个删了就行@change
		if (mc2.taski.files && mc2.taski.files.hasOwnProperty("index.html")) {
			mc2.taski.files = null;
		}
	}
	if (response.passedStage !== null && response.passedStage !== undefined) {
		mc2.taski.passed_stages_amount = response.passedStage;
	} else {
		mc2.taski.passed_stages_amount = JSON.parse(localStorage.getItem("passed_stages_amount_task"+mc2.taski.task_seq), 10);
	}
	if (!mc2.taski.files) {
		//如果本任务没有任何文件，把前一个任务的拿来
		if ( !(mc2.taski.files = JSON.parse(localStorage.getItem("files_task"+(mc2.taski.task_seq-1))))) {
			//如果前一个任务也没有
			mc2.taski.files = {
				"index\\dothtml": ""
			};
		}
	}
	if (mc2.taski.passed_stages_amount === null) {
		mc2.taski.passed_stages_amount = 0;
	}
	localStorage.setItem("passed_stages_amount_task"+mc2.taski.task_seq, mc2.taski.passed_stages_amount);
	localStorage.setItem("files_task"+mc2.taski.task_seq, JSON.stringify(mc2.taski.files));
	localStorage.setItem("status_task"+mc2.taski.task_seq, JSON.stringify(mc2.taski.status));
});
