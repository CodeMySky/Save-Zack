var editor = ace.edit("editarea");
jQuery.cookie = function(name, value, options) {
	    if (typeof value != 'undefined') { // name and value given, set cookie
			        options = options || {};
					        if (value === null) {
								            value = '';
											            options.expires = -1;
														        }
							        var expires = '';
									        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
												            var date;
															            if (typeof options.expires == 'number') {
																			                date = new Date();
																							                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
																											            } else {
																															                date = options.expires;
																																			            }
																		            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
																					        }
											        var path = options.path ? '; path=' + options.path : '';
													        var domain = options.domain ? '; domain=' + options.domain : '';
															        var secure = options.secure ? '; secure' : '';
																	        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
																			    } else { // only name given, get cookie
																					        var cookieValue = null;
																							        if (document.cookie && document.cookie != '') {
																										            var cookies = document.cookie.split(';');
																													            for (var i = 0; i < cookies.length; i++) {
																																	                var cookie = jQuery.trim(cookies[i]);
																																					                // Does this cookie string begin with the name we want?
																																					                if (cookie.substring(0, name.length + 1) == (name + '=')) {
																																										                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
																																															                    break;
																																																				                }
																																									            }
																																        }
																									        return cookieValue;
																											    }
};
function getcookie(name) {
	var cookie_start = document.cookie.indexOf(name);
	var cookie_end = document.cookie.indexOf(";", cookie_start);
	return cookie_start == -1 ? '' : unescape(document.cookie.substring(cookie_start + name.length + 1, (cookie_end > cookie_start ? cookie_end : document.cookie.length)));
}
function setcookie(cookieName, cookieValue, seconds, path, domain, secure) {
	    var expires = new Date();
		    expires.setTime(expires.getTime() + seconds);
			    document.cookie = escape(cookieName) + '=' + escape(cookieValue)
					                                            + (expires ? '; expires=' + expires.toGMTString() : '')
																                                            + (path ? '; path=' + path : '/')
																											                                            + (domain ? '; domain=' + domain : '')
																																						                                            + (secure ? '; secure' : '');
}
var stage_states = JSON.parse($.cookie("stage_states")); //用来存储用户代码和通过状况
if (!stage_states) {
	stage_states = [[{},{},{},{},{}]];
}
if (!stage_states[1]) {
	stage_states[1] = [{}, {}, {}, {}];
}
if (!stage_states[2]) {
	stage_states[2] = [{}, {}, {}];
}
// 做一个新任务时，把前面任务的保存的就删了吧（先把前面任务的保存下来）
if (task_seq === 2) {
	if (!stage_states[1][0].code) {
		stage_states[1][0].code = stage_states[0][4].code;
	}
	stage_states[0] = [{},{},{},{},{}];
	$.cookie("stage_states", JSON.stringify(stage_states), {expires: 60});
}
else if (task_seq === 3) {
	if (!stage_states[2][0].code) {
		stage_states[2][0].code = stage_states[1][3].code;
	}
	stage_states[1] = [{}, {}, {}, {}];
	$.cookie("stage_states", JSON.stringify(stage_states), {expires: 60});
}
//开始执行
$(function () {
	var i = 0;
	editor.setTheme("ace/theme/twilight");
	editor.getSession().setMode("ace/mode/html");
	editor.commands.addCommand({
	    name: 'run',
	    bindKey: {win: 'Ctrl-R',  mac: 'Command-R'},
		exec: function() {
			$(".test").trigger("click");
		},
		readOnly: true
	});
	editor.commands.addCommand({
	    name: 'submit',
	    bindKey: {win: 'Ctrl-U',  mac: 'Command-U'},
		exec: function() {
			$(".submit").trigger("click");
		},
		readOnly: true
	});
	//点击时，载入内容到编辑器
	$(".revisit a").click(function () {
		// 当前阶段的代码
		if (stage_states[task_seq-1][$(this).html()-1].code) {
			editor.setValue(stage_states[task_seq-1][$(this).html()-1].code, 1);
		}
		// 上一阶段的内容的代码
		else if ($(this).html()>1 && stage_states[task_seq-1][$(this).html()-2].code) {
			editor.setValue(stage_states[task_seq-1][$(this).html()-2].code, 1);
		}
		// 上一任务最后一阶段的代码
		else if (task_seq>1 && stage_states[task_seq-2][stage_states[task_seq-2].length-1].code) {
			editor.setValue(stage_states[task_seq-2][stage_states[task_seq-2].length-1].code, 1);
		}
	});

	//跳到相应阶段
	for (i = 0; i<stage_states[task_seq-1].length; ++i) {
		//console.log("task_seq:"+task_seq);
		if (!stage_states[task_seq-1][i].pass) {
			// 这个还没通过，从这个开始
			break;
		}
	}
	if (i === stage_states[task_seq-1].length) {
		$(".revisit a:eq("+(i-1)+")").trigger("click");
	}
	else {
		$(".revisit a:eq("+i+")").trigger("click");
	}
});
