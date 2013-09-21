<div class="denglu-board hide">
	<style>
		div.denglu-board {
			z-index: 5;
			position: fixed;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.3);
			top: 0;
			left: 0;
		}
		div.denglu-box{
			width: 452px;
			margin: auto;
			display: block;
			background: white;
			margin-top: 60px;
			border-radius: 5px;
			padding: 15px;
			border: 5px solid gray;
		}
		div.denglu-box>iframe{
			width: 100%;
			height: 90px;
			border: none;
		}
	</style>
	<div class="denglu-box">
		<button type="button" class="close" data-dismiss="denglu-board" aria-hidden="true">×</button>
		<!--from denglu.cc-->
		<script id='denglu_login_js' type='text/javascript' charset='utf-8'></script>
		<!--end of dengluu.cc-->
	</div>
	<script>
	mc2.denglu = function () {
		//denglu.cc
		(function() {
			var _dl_time = new Date().getTime();
			var _dl_login = document.getElementById('denglu_login_js');
			_dl_login.id = _dl_login.id + '_' + _dl_time;
			_dl_login.src = 'http://open.denglu.cc/connect/logincode?appid=40219denP8fTsnqIOQ0uO1DtKB6pfA&v=1.0.2&widget=1&styletype=2&size=452_83&asyn=true&time=' + _dl_time;
		})();
		//~denglu.cc
		$(function () {
			$(".profile:has(i)").click( function (e) {
				$(".denglu-board").removeClass("hide");
				e.preventDefault();
			});
		});
	};
	</script>
</div>

