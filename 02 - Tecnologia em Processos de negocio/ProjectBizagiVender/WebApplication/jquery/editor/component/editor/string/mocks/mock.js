$(document).ready(function() {
	var el = $('.editor-string-input > input');
	el.bind('blur',validate);
	el.bind('focus',responseFocus);
	$('.tooltip').tooltip();
});


function getRealHeight(el){
	var valueHeight = 0;
	var evProperties = ['padding-top','padding-bottom','margin-top','margin-bottom','border-top','border-bottom'];
	var elHeight = $(el).height();

	for(var i=0 ;i< evProperties.length ;i++){
		valueHeight += parseFloat($(el).css(evProperties[i]));
		console.log(evProperties[i]  + ' : ' +parseFloat($(el).css(evProperties[i])));
	}; 
	return valueHeight + elHeight;
}

function validate(el){
	$(event.target).parent().toggleClass('editor-string-focus');
	$(event.target).parent().parent().find('.editor-string-icon-localization').removeClass('editor_string_fadeIn');
}

function showMesgValidator(el){
	var element = $(el.target);
	var inputPosition = element.position();
	var inputHeight = (inputPosition.top + getRealHeight(element) + 2) + 'px';
	var msgPosition = $('.editor-validator-container').css({left:inputPosition.left,top:inputHeight});
	console.log(inputHeight);
	$('.editor-validator-container').fadeIn();
}

function removeMesgValidator(el){
	
	$('.editor-validator-container').fadeOut(
		function(){
			$(this).css({left:0,top:0});
		}
	);
}


function isInt(str) {
    return /^[-+]?[0-9]+$/.test(str);
}


function responseFocus(event){
	$(event.target).parent().toggleClass('editor-string-focus');
	$(event.target).parent().parent().find('.editor-string-icon-localization').addClass('editor_string_fadeIn');
}