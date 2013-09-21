/* Author: Jake Teton-Landis <just.1.jake@gmail.com>

*/

(function($){
    /**
     * selector for the whole tabs + content + backing shebang
     */
    var pane_selector = '.tabbed';

    /**
     * selector used to find tabs
     */
    var tab_selector = '.tabbed > nav a';

    /**
     * selector for all tab content sections
     */
    var content_selector = '.tabbed .content';

    /**
     * selector for all elements that should close the 
     * tabbed UI pane when they are clicked
     */
    var close_on_click = '.project-ui';

    /**
     * return a DOM node containing the content div
     * targeted by the given tab
     * @param {DOMNode} tab a tab link
     */
    var content_for_tab = function(tab) {
        var id = $(tab).attr('href');
        return $(id)[0];
    }
    /**
     * generate the active-class for a content
     * div
     * @param {DOMNode} content a content div
     * @return {String}
     */
    var class_for_content = function(content) {
        return 'open-to-' + $(content).attr('id');
    }

    // bind tab click event handler
    $(document).ready(function(){
        var tab_classes = [];
        var tab_classes;
        
        tab_classes = $(content_selector).map(function() {
            return class_for_content(this);
        }).get().join(' ');


        var openSidePane = function(e) { 
            e && e.preventDefault();

            $(pane_selector).stop().animate({left: '0%' }, 200 );
            $('#open-drawer').addClass('open').removeClass('closed');

            $('.open-panel-button span').text('»');
        }

        var closeSidePane =  function(e) { 
            e && e.preventDefault();
            
            $(pane_selector).stop().animate({left: '100%'}, 200);
            $('#open-drawer').addClass('closed').removeClass('open');
            
            $('.open-panel-button span').text('«');
        }

        // bind Open/close side pane button
        $('#open-drawer').click(function(e) {
        	e && e.preventDefault();
        	if ($(this).hasClass('closed')) {
        		openSidePane(e);
        	} else {
        		closeSidePane(e);
        	}
        });

        // close the pane if certain UI elements are clicked
        $(close_on_click).click(closeSidePane);


        // change tabs in the side pane
        $(tab_selector).click(function(e){
            e.preventDefault();

            // remove active class from peers
            $(tab_selector).parent().removeClass('active');
            // add it to this
            $(this).parent().addClass('active');

            // bring the correct content to the front
            $(content_selector).hide();
            $(content_for_tab(this)).show();

            // and put a class indicating the active on the pane
            $(pane_selector).removeClass(tab_classes)
                .addClass(class_for_content(content_for_tab(this)));
        });

        // open the side-pane to the hints zone when hint button clicked
        $('.get-hint').click(function(e) {
            e.preventDefault();
            $('a[href=#hints]').click();
            
            var hint_data = $('#hint-section ol').data().hint;
            if (hint_data.current < hint_data.total) {            	
	            var hint_object = document.getElementById('ilesson_frame').contentWindow.REPLIT.GetHint(hint_data.current);
	            
	            hint_data.current++
	            if (hint_object['text'] != '') {
	            	var hint_html = '<li><h2>Hint ' + hint_data.current + '</h2><div class="body"><p>' + hint_object['text'] + '</p></div></li>';
	            	$('#hint-section ol').prepend(hint_html);
	            	
	            	$('.hint-count').text(hint_data.total - hint_data.current);	
	            }
	            
	            $('#hint-section ol').data('hint', hint_data);
            }
            if (hint_data.current == hint_data.total-1) {
            	$('.hint-text').html("Give me Solution");
            }             
            if (hint_data.current >= hint_data.total) {
            	$('#hint-section .button').hide();
            }
            else{
            	$('#hint-section .button').show();
            } 
            
            openSidePane(e);
        });

        // CodeMirror the textarea
        $('.editor > textarea').each(function() {
            window.editor = CodeMirror.fromTextArea(this, {lineNumbers: true});
        });

        // change themes
        $('.editor .themes .dark').click(function() {
            window.editor.setOption('theme', 'ambiance');
            $('.editor').removeClass('light dark normal')
                .addClass('dark');
        });
        $('.editor .themes .normal').click(function() {
            window.editor.setOption('theme', 'default');
            $('.editor').removeClass('light dark normal')
                .addClass('normal');
        });
        $('.editor .themes .light').click(function() {
            window.editor.setOption('theme', 'eclipse');
            $('.editor').removeClass('light dark normal')
                .addClass('light');
        });

        // Open profile lightbox on click
        $('.coder').click(function(e) {
            e.preventDefault();
            $.fancybox.open(
                [ $('#example-coder-profile')[0] ]
                , {
                    padding: 0
                    , scrolling: false
                }
            );
        });

        // engage tooltips
        $.fn.qtip.defaults = $.extend(true, {}, $.fn.qtip.defaults, {
            position: {
                my: 'top center',
                viewport: $(window),
                adjust: {
                    y: 5
                }
            },
            style: {
                classes: 'ui-tooltip-dark shadow-tip',
                tip: {
                    width: 30,
                    height: 15,
                }
            }
        })
        $('#coders .coder').each(function() {
            $(this).qtip({
                content: $(this).children('.tooltip'),
                position: {
                    target: 'mouse',
                    adjust: { y: 25, x: 6 }
                },
                style: {
                    width: '20em'
                }

            });
        });

        // flag menus.
        $('#q-and-a .entry .flag').qtip({
            content: $('#q-and-a .flag-post-menu'),
            position: {adjust: {x: -4}},
            hide: {
                event: 'unfocus'
            }
        })

        // switch method stage so you can see all the 
        // prototyped stages
        var progress_stages = [
            $('.content.instructions'),
            $('.content.method-success'),
            $('.content.project-complete')
        ];
        $('.course .toolbar > .steps a').each(function(i, el) {
            $(this).click(function(e) {
                e.preventDefault();
                progress_stages[0].hide();
                progress_stages[1].hide();
                progress_stages[2].hide();

                var stage = progress_stages[i] || progress_stages[0];

                stage.show();
            });
        });

        // toggle sections in ToC
        $('#toc section > h1').click(function(e) {
            e.preventDefault();
            $(this).parent().toggleClass('closed');
            
            if ($(this).parent().hasClass('closed')) {
            	$(this).find('span.open-close').removeClass('open').addClass('closed');
            } else {
            	$(this).find('span.open-close').removeClass('closed').addClass('open');
            }
        });

       	//Close Drawer on Start
       	$('#start_course').click(function(e) {
       		e.preventDefault();
       		
       		$('#open-drawer').click();
       		$(this).remove();       		       		
       	});
       	
       	// Hide other tabs and Show Lesson Description
       	$('a[href=#lesson-description]').click(function(e) {
       		
       		var lesson_id = $(this).attr('rel');
       		$('#exercises-' + lesson_id).hide();
       		$('a[href=#lesson-exercises][rel=' + lesson_id + ']').parent().removeClass('active');
       		$('#video-' + lesson_id).hide();
       		$('a[href=#lesson-video][rel=' + lesson_id + ']').parent().removeClass('active');
       		
       		$('#description-' + lesson_id).show();
       		$(this).parent().addClass('active');
       		
       		e.preventDefault();
       	});
       	
       	// Hide other tabs and Show Lesson Exercises
       	$('a[href=#lesson-exercises]').click(function(e) {       		
       		
       		var lesson_id = $(this).attr('rel');
       		$('#description-' + lesson_id).hide();
       		$('a[href=#lesson-description][rel=' + lesson_id + ']').parent().removeClass('active');
       		$('#video-' + lesson_id).hide();
       		$('a[href=#lesson-video][rel=' + lesson_id + ']').parent().removeClass('active');
       		
       		$('#exercises-' + lesson_id).show();
       		$(this).parent().addClass('active');
       		
       		e.preventDefault();
       	});    
       	
       	// Hide other tabs and Show Lesson video
       	$('a[href=#lesson-video]').click(function(e) {       		
       		
       		var lesson_id = $(this).attr('rel');
       		
       		initializeLessonVideo(lesson_id);
       		
      		$('#description-' + lesson_id).hide();
       		$('a[href=#lesson-description][rel=' + lesson_id + ']').parent().removeClass('active');
       		$('#exercises-' + lesson_id).hide();
       		$('a[href=#lesson-exercises][rel=' + lesson_id + ']').parent().removeClass('active');
       		
       		$('#video-' + lesson_id).show();
       		$(this).parent().addClass('active');
       		
       		e.preventDefault();
        });  	
       	
		$('.exe-pbar-item').hover(function() {
			var exe_id = $(this).attr('id');
			var exe_details = exe_id.split('-');

			var exe_description = ilesson_details[exe_details[2]]['exe_descriptions'][parseInt(exe_details[3]) - 1];
			var exercise_number = parseInt(exe_details[3]);
			var prompt = ilesson_details[exe_details[2]]['prompt'][parseInt(exe_details[3]) - 1];

			$('#exercise-counter-' + exe_details[2]).text("Exercise " + exercise_number);
			$('#exercise-description-' + exe_details[2]).text(exe_description);
			$('#exercise-message-' + exe_details[2]+' p').html(prompt);
		}, function() {
			var exe_id = $(this).attr('id');
			var exe_details = exe_id.split('-');

			var exercise_details = $('#exercise-details-' + exe_details[2]).data();

			$('#exercise-counter-' + exe_details[2]).text("Exercise " + exercise_details.index);
			$('#exercise-description-' + exe_details[2]).text(exercise_details.description);
			$('#exercise-message-' + exe_details[2]+' p').html(exercise_details.instruction);
		}); 
		
       	$('a[href=#desc]').click();
       	// open the description on page load
	    //$('#open-drawer').click();
	    
		window.initializeLessonVideo = function(lesson_id) {

			var div_id = 'video-player-' + lesson_id;
			var vid_id = $('#' + div_id).attr('vid');

			if ($('iframe#' + div_id).length == 0) {
				window.player = new YT.Player(div_id, {
					height : '396',
					width : '475',
					videoId : vid_id,
					playerVars: {
						wmode: "transparent"
		        	},
					events : {
						'onReady' : onPlayerReady
					}
				});
			} else {
				window.player.playVideo();
			}
		}

		window.player = null;
		window.loadYoutubeIframeAPI = function() {
			var utube_tag = document.createElement('script');
			utube_tag.src = "//www.youtube.com/iframe_api";
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(utube_tag, firstScriptTag);
		}
		
      	window.onPlayerReady = function(evt) {
		    	window.player.playVideo();
		}
      	
      	window.loadYoutubeIframeAPI();
    });

	$(document).mouseup(function (e) {
		var container = $(".video .video-player");

		if (!container.is(e.target) && container.has(e.target).length === 0) {
			
			if (window.player != null && window.player.getPlayerState() == YT.PlayerState.PLAYING) {
				window.player.pauseVideo();
			}
		}
	});


})(jQuery);


