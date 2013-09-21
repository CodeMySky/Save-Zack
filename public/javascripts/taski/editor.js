$(function () {
	var i = 0;
	var task_seq = mc2.taski.task_seq;
	//初始化editor
	var editor = mc2.taski.editor;
	editor.setTheme("ace/theme/chrome");
	editor.getSession().setMode("ace/mode/html");
	editor.commands.addCommand({
	    name: 'run',
	    bindKey: {win: 'Ctrl-R',  mac: 'Command-R'},
		exec: function() {
			$(".funbar-preview").trigger("click");
		},
		readOnly: true
	});
	editor.commands.addCommand({
	    name: 'submit',
	    bindKey: {win: 'Ctrl-U',  mac: 'Command-U'},
		exec: function() {
			$(".funbar-submit").trigger("click");
		},
		readOnly: true
	});
	editor.commands.addCommand({
	    name: 'save',
	    bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
		exec: function() {
			$(".funbar-save").trigger("click");
		},
		readOnly: true
	});
	editor.getSession().on('change', function(e) {
		var seq = parseInt($("[id^='il-set-'].active>a").html(), 10);
		var code = mc2.taski.editor.getValue();
		mc2.taski.files[($(".work-tabs-wrap>li.active>a").text()).replace(".","\\dot")] = code;
		mc2.taski.files["%time_stamp"] = (new Date()).getTime();
		localStorage.setItem("files_task"+task_seq, JSON.stringify(mc2.taski.files));
	});
});
