/** TIMER PARAM
 *
 *  Format of date: MOUNTH DAY, YEAR HOURS:MINUTES:SECONDS
 *
 */

// Don't forget to change the Dates
var start = "October 28, 2013 00:00:00";
var end = 'November 15, 2013 00:00:00';

var n_backs = 4;
var rand = Math.ceil(Math.random()*n_backs);

/** Hide Toolbar on iPhone **/
var ua = navigator.userAgent.toLowerCase();
if (ua.indexOf('iphone') != -1) {
	window.addEventListener('load', function(){
		setTimeout(scrollTo, 0, 0, 1);
	}, false);
}

$(function(){

	/** Random background **/
	$('body').addClass('bg'+rand);

	/** Timer **/
	$("#ct").countdown({
		until: new Date(end),
		compact: true,
		onTick: updateTime
	});

	update_progressbar();

	/** Open or Close #feedback block **/
	$('#feedback > .close').on('click', function() { $('#open-feedback').trigger('click') });
	$('#open-feedback').on('click', function() {
		if(!$(this).hasClass('opened')) {
			$(this).addClass('opened').css({opacity:1});

			var oTop = feedback_align();

			$('#feedback').css({top: oTop+20}).animate({top: oTop, opacity: 1});
			$('span.email-no:not(.d), #feedback .feedback-arr').animate({opacity: 1}); /* IE8 FIX */
			$('#feedback input').focus();

		} else {
			$(this).removeClass('opened').removeAttr('style');

			var oTop = feedback_align();

			$('#feedback').css({top: oTop}).animate({top: oTop+20, opacity: 0});
			$('span.email-no, #feedback .feedback-arr').animate({opacity: 0}); /* IE8 FIX */
		}
		return false;
	});

	$(window).resize(function(){ feedback_align() });

	/** Fix placeholder **/
	$('input[placeholder]').placeholder();

	/** Check up email **/
	$('input[name=email]').bind('keyup keydown change', function(){
		var reg = /^([a-z0-9_\-]+\.)*[a-z0-9_\-]+@([a-z0-9][a-z0-9\-]*[a-z0-9]\.)+[a-z]{2,4}$/i;
		var email = $('input[name=email]').val();
		(!reg.test(email)) ? $('span.email-no').stop(true).animate({opacity:1}, 200) : $('span.email-no').stop(true).animate({opacity:0}, 200);
	});

	/** Send form **/
	$('#feedback-form').submit(function(){
		send_form();
		return false;
	});
});

function updateTime(time) {
	time.splice(0, 3);

	var ar = [];
	$.each(time, function(k, v) { ar.push(v.toString()) });

	var nums = [];
	$.each(ar, function(k, v){
		switch(k) {
			case 0:
				switch (v.length) {
					case 0: v = '000'; break;
					case 1: v = '00'+v; break;
					case 2: v = '0'+v; break;
				}
			break;
			default:
				switch (v.length) {
					case 0: v = '00'; break;
					case 1: v = '0'+v; break;
				}
			break;
		}

		$.each(v, function(key, val){ nums.push(val) });
	});


	$('#countdown > div > div > div').each(function(k) {
		var obj = $(this).find('span');

		if(obj.eq(0).text() == nums[k]) return true;

		/** Animate numbers **/
		obj.eq(1)
			.text(nums[k])
			.animate({opacity:1});
		obj.eq(0).animate({'margin-top': -135, opacity:0}, 960, function(){
			var parent = $(this).parent();
			$(this).remove();
			$('<span/>').css({opacity:0}).appendTo(parent);
		});
	});

	update_progressbar();
}

function update_progressbar() {
	var first = new Date(start);
	var last  = new Date(end);
	var today = new Date();

	var p = Math.floor(((today-first)/(last-first))*100);
		p = (p>100) ? 100 : p;

	p = (p - 100) * -1;

	var $progressbar = $('#progress-bar');

	$progressbar.animate({opacity: 1})
		.find('.bar').animate({width: p+'%'}, 1000, 'swing')
	.end()
		.find('.ind').animate({left: p+'%'}, 1000, 'swing')
			.find('span').text(p+'%');
}

function feedback_align() {
	var oTop = _oTop =Math.floor($('#open-feedback').offset().top);
	var oLeft = Math.floor($('#open-feedback').offset().left);

	var $feedback = $('#feedback');
	$feedback.show();

	var fWidth = $feedback.outerWidth();
	var fHeight = $feedback.height();

	oTop -= fHeight+80;

	if($(window).width()>480)
		oLeft -= fWidth/2-60;
	else oLeft = 0;

	$('#feedback').css({top: oTop, left: oLeft});

	return oTop;
}

function send_form() {
	var emailNo = $('span.email-no');
	if(emailNo.css('opacity') != '0' || $('input[name=email]').val().length == 0) return false;

	var $form = $('#feedback-form');
	$('#feedback-form button').prop("disabled", true); // Disable the button;


	$.ajax({
		type: 'POST',
		url: $form.attr('action'),
		data: $form.serialize(),
		success: function(response) {
			if(response) {
				mt = ($(window).width() > 480) ? 35 : 50;
				$('#feedback-form').animate({marginTop: -mt, opacity: 0});
				$('span.email-no').addClass('d');
			}
		}
	});
}