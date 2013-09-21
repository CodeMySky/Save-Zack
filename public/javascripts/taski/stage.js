//跳到相应阶段
$(function () {
	var task_seq = mc2.taski.task_seq;
	var passed_stages_amount = mc2.taski.passed_stages_amount;
	/* var stage_states = mc2.taski.stage_states;
	for (i=0; i<stage_states[task_seq-1].length; ++i) {
		if (stage_states[task_seq-1][i].pass) {
			++passed_stages_amount;
		}
		else { break; }
	}*/
	for (i = 1; i<=passed_stages_amount; ++i) {
		$("li#il-set-"+i).removeClass("disabled");
		$("li#il-set-"+i).addClass("done");
		$("li#il-set-"+i+">a").attr("data-toggle", "tab");
	}
	if (passed_stages_amount >= mc2.taski.vldt_funcs.length) {
		//都通过了
		$("li#il-set-"+mc2.taski.vldt_funcs.length+">a").attr("data-toggle", "tab");
		$("li#il-set-"+mc2.taski.vldt_funcs.length+">a").trigger("click");
	}
	else {
		$("li#il-set-"+i).removeClass("disabled");
		$("li#il-set-"+i).addClass("ing");
		$("li#il-set-"+i+">a").attr("data-toggle", "tab");
		$("li#il-set-"+i+">a").trigger("click");
	}

	if (mc2.taski.hint === "plus_one") {
		$("#il-set-1 a").text("+1");
	}
});
