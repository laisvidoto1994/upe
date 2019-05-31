$(document).ready(function() {
	var el = $('.editor_component_editor_int_input')
	el.bind('blur',validate);
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
	var element = $(el.target);
	var elValue = element.val();
		if(!isInt(elValue) && elValue.length){
			
			if(!element.hasClass('error')){
				element.addClass('error');
				showMesgValidator(el);
			}
			element.select();
		}
		else{
			element.removeClass('error');
			removeMesgValidator(el);
		}
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