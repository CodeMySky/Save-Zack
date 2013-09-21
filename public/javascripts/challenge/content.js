$(function () {
	var add_new_task = function (task_status, task_no, target_url, required_e, gain_e, title, description, grade, achievement_work_url, img_src) {
		var thumbnail_lock_img_src = "/images/005_12.png";
		var task_status_describe;
		var icon_class;
		var look_task_text;
		var start_task_text;
		var btn_style;
		var btn_i_style;
		if (task_status === "new") {
			task_status_describe = "新任务";
			icon_class = "icon-bell";
			look_task_text = "查看任务";
			start_task_text = "马上启动";
			btn_style = "btn-warning";
			btn_i_style = "dotted-plus";
		} else if (task_status === "accepted") {
			task_status_describe = "进行中";
			icon_class = "icon-time";
			look_task_text = "查看任务";
			start_task_text = "继续任务";
			btn_style = "btn-primary";
			btn_i_style = "dotted-edit";
		} else if (task_status === "done") {
			task_status_describe = "已完成";
			icon_class = "dotted-completed";
			look_task_text = "我的成果";
			start_task_text = "回顾任务";
			btn_style = "btn-success";
			btn_i_style = "dotted-plus";
		} else if (task_status === "locked") {
			task_status_describe = "锁定";
			icon_class = "dotted-locked";
		}
		if (task_status === "locked") {
			$(".thumbnails").append('\
				<li class="span3" title="该任务还未解锁，你需要先完成其他任务获得足够能量值，才能解锁该任务">\
					<div class="thumbnail '+task_status+'">\
						<div class="thumbnail-pane">\
							<div class="pane-award">达到'+required_e+'<sup>e</sup></div>\
							<div class="pane-status">'+task_status_describe+'</div>\
						</div>\
						<div class="thumbnail-content">\
							<div class="thumbnail-content-wrap">\
								<div class="thumbnail-poster">\
									<img style="" src="'+img_src+'">\
									<div class="caption">\
										<h5>'+title+'</h5>\
									</div>\
								</div>\
								<div class="thumbnail-lock">\
									<img src="'+thumbnail_lock_img_src+'" alt="" class="thumbnail-lock-img">\
								</div>\
								<div class="backdrop"></div>\
							</div>\
						</div>\
					</div>\
				</li>');
		}
		else {
			$(".thumbnails").append('\
				<li class="span3">\
					<div class="thumbnail '+task_status+'" data-url="'+target_url+'" data-no="'+task_no+'" >\
						<div class="thumbnail-pane">\
							<div class="pane-award">'+(task_status==="done"?("已收获："+grade):("可收获："+gain_e))+'<sup>e</sup></div>\
							<div class="pane-status '+task_status+'">'+task_status_describe+'</div>\
						</div>\
						<div class="thumbnail-content">\
							<div class="thumbnail-content-wrap">\
								<div class="thumbnail-poster">\
									<img style="" src="'+img_src+'">\
									<div class="caption">\
										<h5>'+title+'</h5>\
									</div>\
								</div>\
								<div class="thumbnail-detail">\
									<div class="thumbnail-detail-content">\
										<h4>'+title+'</h4>'+
										description+'\
									</div>\
									<div class="thumbnail-detail-btn">\
										<a href="/task?taskNo='+task_no+'" class="btn ' + btn_style + '"><i class="'+btn_i_style+'"></i>'+start_task_text+'</a>'+
									'</div>\
								</div>\
							</div>\
						</div>\
					</div>\
				</li>');
			$(".modal-task-btn>.btn-gotask").attr("href", "/task?taskNo="+task_no);
		}
	};
	var content;    
	try{    
		content = JSON.parse($("#tasks-data").html()); 
	} catch(e) {
		content = JSON.parse(unescape($("#tasks-data").html()));
	}
	mc2.get_user();
	if (!mc2.user) {
		mc2.denglu();
	}
	var taskArray = content.taskArray;
	taskArray.sort(function(a, b) {
	     return a.no-b.no;
	});
	if (!mc2.user && localStorage.getItem("status_task1")) {
		taskArray[0].status = JSON.parse(localStorage.getItem("status_task1"));
		taskArray[0].energy = taskArray[0].info.gain;
		if (taskArray[0].status === "done") {
			$(".denglu-board").removeClass("hide").find(".denglu-box>button").after($("<h4>很不错! 登陆来记录你所做过的任务吧！</h4>"));
		}
	}
	if (mc2.user && content.no==="0" && taskArray[0].status==="unaccepted" && localStorage.getItem("files_task1")) {
		//做完了第一个任务，第一次登陆时，把之前做的数据post给服务器
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("POST", "/submission", true);
		var data = {
			taskNo: "1",
			status: JSON.parse(localStorage.getItem("status_task1")),
			passedStage: JSON.parse(localStorage.getItem("passed_stages_amount_task1")),
			code: [JSON.parse(localStorage.getItem("files_task1"))],
			energy: (JSON.parse(localStorage.getItem("status_task1"))==="done")?
				taskArray[0].info.gain:0
		};
		xmlHttp.setRequestHeader("Content-Type", "application/json");
		//alert(JSON.stringify(data));
		xmlHttp.send(JSON.stringify(data)); 
		xmlHttp.onreadystatechange = function () {
			if (xmlHttp.readyState === 4) {
				location.reload();
			}
		};
	}
	var i;
	var temp_obj;
	var all_done = true;
	for (i=0; i<taskArray.length; ++i) {
		temp_obj = taskArray[i];
		if (temp_obj.status === "unaccepted") {
			temp_obj.status = "new";
		}
		if (temp_obj.status !== "done") {
			all_done = false;
		}
		add_new_task(temp_obj.status, temp_obj.no, temp_obj.info.target, temp_obj.info.requiredEnergy, temp_obj.info.gain,
			temp_obj.info.title, temp_obj.info.description, temp_obj.energy, temp_obj.achievement?temp_obj.achievement.work:null, temp_obj.info.taskImg);
	}
	if (all_done) {
		$(".thumbnails").append('\
			<li class="span3" >\
				<div class="thumbnail locked">\
					<div class="thumbnail-pane">\
						<div class="pane-status locked">未开放</div>\
					</div>\
					<div class="thumbnail-content">\
						<div class="thumbnail-content-wrap">\
							<div class="thumbnail-detail">\
								<div class="thumbnail-detail-content">\
									<p>真厉害！你已经完成了目前所有任务</p>\
									<p>由于目前还是测试阶段，新任务会逐步开放</p>\
									请您留下常用邮箱，我们会在每个周一通知您！</p>\
									<input type="text" id="mail-inputor" style="float:left">\
									<button type="submit" class="btn small-btn" style="float:left">确认</button>\
								</div>\
							</div>\
						</div>\
					</div>\
				</div>\
			</li>');
		if (mc2.user.email) {
			$(".thumbnails .thumbnail-detail-content:last").html("我们已记录下您的邮箱，新任务一经开放，我们会立即邮件通知您！");
		}
		else {
			$(".thumbnails .thumbnail-detail-content button:last").click(function () {
					var email = $("#mail-inputor").attr("value");
					var email_reg = /@/;
					if (email_reg.test(email)) {
						$(".thumbnails .thumbnail-detail-content:last").html("请稍候...");
						$.ajax({
							url: "/inputEmail",
							type: "POST",
							data: {email: email},
							dataType: "text",
							success: function (response) {
								if (response === 'OK') {
									$(".thumbnails .thumbnail-detail-content:last").html("我们已记录下您的邮箱，新任务一经开放，我们就会邮件通知您！");
								}
							}
						});
					}
					else {
						alert("请输入合法邮箱");
					}
				});
		}
	}
});
