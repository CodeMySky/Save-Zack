$(function(){
	var t_thumbnail;
	// thumbnail mouseon show detail
	$(".thumbnail:not(.locked):not(.info)").mouseenter(function(){
		var that = this;
		t_thumbnail = setTimeout( function () {
						$(that).find(".thumbnail-content-wrap").animate({top:"-226px"},300)
					},
					350);
	}).mouseleave(function(){
		clearTimeout(t_thumbnail);
		$(this).find(".thumbnail-content-wrap").animate({
			top:"0px"
		},300);
	}).click(function(){
		var $m = $("#modal");
		$m.find("#myModalLabel").html($(this).find(".caption").text());
		$m.find(".modal-body iframe").attr("src",$(this).attr("data-url"));
		//$m.find(".modal-task-share a").attr("href","http://moshifang.com/result?name="+mc2.user.name+"&taskNo="+$(this).attr("data-no"));
		$m.find(".modal-task-share a").attr("href","http://moshifang.com/u/"+mc2.user.name+"/"+$(this).attr("data-no"));
		$m.find(".modal-task-btn").empty().html($(this).find(".thumbnail-detail-btn a").clone());
		$m.find(".modal-task-detail span:eq(0)").html($(this).find(".pane-award").html());
		$m.find(".modal-task-detail span:eq(1)").text(mc2.user?("@"+$(".profile .named").text()):"");
		$("#modal").modal('toggle');
	});

	$(".thumbnail.locked").mouseenter(function(){
		$(this).find(".thumbnail-pane .pane-award").css({
			"font-weight":"bold",
			"color":"black"
		});
	}).mouseleave(function(){
		$(this).find(".thumbnail-pane .pane-award").css({
			"font-weight":"normal",
			"color":"#909090"
		});
	});

	$("#modal").on({
		show:function(){
			$("body").css("overflow","hidden");
			$(".wrap").css("overflow","scroll");
		},
		hide:function(){
			$("body").css("overflow","auto");
			$(".wrap").css("overflow","hidden");
		}
	});

	// filter function
	$('.checkbox input:not(:first)').on('change',function(){
    	var o = $(this).val();
    	if ($(this).prop("checked")) {
    		$("li .thumbnail."+o).closest("li").fadeIn();//slideDown();
    	} else {
    		$("li .thumbnail."+o).closest("li").fadeOut();//slideUp();
    		$('.checkbox input:first').prop("checked",false);
    	}
	});
	$('.checkbox input:first').on('change',function(){
    	var o = $(this).val();
    	if ($(this).prop("checked")) {
    		$('.checkbox input:not(:first)').prop("checked",true).trigger("change");
    	} else {
    		$(this).prop("checked",true);
    	}
	});

	// new task jump
	$.fn.shake = function(intShakes /*Amount of shakes*/, intDistance /*Shake distance*/, intDuration /*Time duration*/) {
		this.each(function() {
			var jqNode = $(this);
			jqNode.css({position: 'relative'});
				for (var x=1; x<=intShakes; x++) {
					jqNode.animate({ top: (intDistance * -1 + (x-1) * 10) },(((intDuration / intShakes) / 2)))
					.animate({ top: 0 },(((intDuration / intShakes) / 2)));
				}
			});
		return this;
	}
	function repeat(){
		$('.thumbnail.new').closest("li").shake(3,30,1000);
		t=setTimeout(repeat,4000);
	}

	repeat();

	$(".alert").bind('close',function(){
		clearTimeout(t);
		$(".thumbnail.new").stop();
	});
	$(".thumbnail.new").hover(function(){
		clearTimeout(t);
		$(".thumbnail.new").stop();
	});
})	
