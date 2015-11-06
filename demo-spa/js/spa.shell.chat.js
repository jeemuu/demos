var spa = (function($){

	//define constants and vars in module
	var configMap = {
		extended_height :434,
		extended_title: 'click to retract',
		retract_height: 16,
		retract_title: 'click to extend',
		template_html : '<div class="spa-slider"><\/div>'
	},
	$chatSlider, toggleSlider, onClickSlider, initModule;

	toggleSlider =function(){
		if (!$chatSlider){
			console.log("$chatSlider isn't initialized");
			return false;
		}
		var slider_height = $chatSlider.height();

		if(slider_height === configMap.retract_height){
			$chatSlider.animate({height: configMap.extended_height})
			.attr('title', configMap.extended_title);
			return true;
		}else if(slider_height === configMap.extended_height){
			$chatSlider.animate({height: configMap.retract_height})
			.attr('title', configMap.retract_title);
			return true;
		}
		return false;
	}

	onClickSlider = function(event){
		toggleSlider();
		return false;
	}

	initModule = function($container){
		//generate slider
		$container.html(configMap.template_html);
		//init slider , bind event function
		$chatSlider = $container.find('.spa-slider');
		$chatSlider.attr('title', configMap.retract_title)
		.click(onClickSlider);

		return true;
	}

	return {initModule: initModule};

	}(jQuery));