
var api_url = "https://api.instagram.com/v1/media/popular?client_id=";
var client_id = "52344c42b068429895865a3fe84ad602";
var req_url = api_url + client_id;
var is_open = false;
var pics = null;
var current_index = 0;
var MAX_COMMENTS = 10;

function onAfter(curr,next,opts) {
	current_index = opts.currSlide;
}

function onEnd() {
	console.log("End...");
}

function setPostInfo(post) {
	console.log(post);
	var user = post.user;
	var userHtml = '<div><img src="' + user.profile_picture + '" width="75" height="75" /></div>';
	//userHtml += '<p class="user-fullname">' + user.full_name + '</p>';
	userHtml += '<p class="user-username">' + user.username + '</p>';
	$('.sidebar .inner .user').html(userHtml);
	
	// Add comments if there are any.
	var comments = post.comments.data;
	var nrComments = comments.length;
	if (nrComments > 0) {
		var htmlComments = "<p class='comments-header'>Comments (" + nrComments + ")</p>";
		for (var i = 0; i < nrComments && i < MAX_COMMENTS; i++) {
			var comment = comments[i];
			htmlComments += "<div class='comment'><b>" + comment.from.username + 
				":</b>&nbsp;" + comment.text + "</div>";
		}
		if (nrComments > MAX_COMMENTS) {
			htmlComments += "<div class='comment'>...</div>";
		}
		$('.sidebar .inner .comments').html(htmlComments);
	}
}

// jQuery init, starting point.
$(document).ready(function() {
	
	
	window.onorientationchange = function() {
  		$('html').attr('class', 'orientation'+window.orientation);
	}
	window.onorientationchange();

	$.getJSON("/fetch?url=" + req_url, function(data) {
		pics = data.data;
		for (var i = 0; i < pics.length; i++) {
			var pic = pics[i].images.standard_resolution;
			console.log(pic);
			$(".slideshow").append("<img src='" + pic.url + "' width='748' height='748' />");
		}
		
		// Start the slideshow.
		$('.slideshow').cycle({
			fx: 'uncover', 
			speed:1500, 
			timeout:10000, 
			after: onAfter,
			end: onEnd
		});
		
		$('.slideshow').click(function() {
			$('.slideshow').cycle(is_open ? 'resume' : 'pause');
			var open = is_open;
			$('.slideshow').animate(
				{'margin-left': is_open ? '137px' : '0px'}, 
				500,
				function() {
					console.log("Show post info at index: " + current_index);
					setPostInfo(pics[current_index]);
					if (open) $('.sidebar').css('display', 'none');
					else $('.sidebar').show();
				}
			);
			is_open = !is_open;
		});
	});
});