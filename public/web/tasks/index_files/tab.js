$(function () {
    $('.revisit a').click(function(){
		var num = $(this).html();
		$('.lesson.content').hide();
		$('#idetails-'+num).show();
		$('.revisit a').removeClass("current");
		$(this).addClass("current");
	});
	
	$(".lesson.content li").click (function(){
		if ($(this).attr("class") != "active") {
			$(this).addClass("active");
			$(this).siblings().removeClass("active");
			
			var ref = $(this).find("a").attr("rel");
			var content = "description";
			if (ref =="2") {
				content = "step";
			}
			var $obj = $(this).closest("div").siblings();
			$obj.children().hide();
			$obj.find("."+content).show();
		} 
	});
})