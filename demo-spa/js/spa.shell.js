spa.shell = (function  () {

	var configMap = {
		main_html : ['	<div class="spa-shell-head">',
'		<div class="spa-shell-head-logo"></div>',
'		<div class="spa-shell-head-acct"></div>',
'		<div class="spa-shell-head-search"></div>',
'		</div>',
'	<div class="spa-shell-main">',
'		<div class="spa-shell-main-nav"></div>',
'		<div class="spa-shell-main-content"></div>',
'	</div>',
'	<div class="spa-shell-foot"></div>',
'	<div class="spa-shell-chat"></div>',
'	<div class="spa-shell-modal"></div>'].join(""),
		chat_extend_time: 250,
		chat_extract_time: 300,
		chat_extend_height: 450,
		chat_extract_height: 15 ,
		chat_extend_title: 'click to extract',
		chat_extract_title: 'click to extend',
		anchor_schema_map: {
			chat: {open: true, closed: true}
		}
	},
	stateMap = {$container: null,
		is_chat_retracted: true,
		anchor_map: {}
	},
	jqueryMap ={},
	setJqueryMap,toggleChat, onClickChat, initModule,
	copyAnchorMap, changeAnchorPart, onHashChange;

	copyAnchorMap = function (argument) {
		return $.extend(true, {}, stateMap.anchor_map);
	};

	changeAnchorPart = function(arg_map){
		var
		anchor_map_revise = copyAnchorMap(),
		bool_return = true,
		key_name,key_name_dep;

		KEYVAL:
		for(key_name in arg_map){
			if(arg_map.hasOwnProperty(key_name)){
				if(key_name.indexOf('_')===0){continue KEYVAL;}

				anchor_map_revise[key_name] = arg_map[key_name];

				key_name_dep = '_' +key_name;
				if(arg_map[key_name_dep]){
					anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
				}
				else{
					delete anchor_map_revise[key_name_dep];
					delete anchor_map_revise['_s' + key_name_dep];
				}
			}

			try{
				$.uriAnchor.setAnchor(anchor_map_revise);
			}catch(error){
				$.uriAnchor.setAnchor(stateMap.anchor_map, null, true);
				bool_return = false;
			}

			return bool_return;
		};
	};

	onHashChange =function (event) {
		var
		anchor_map_previous = copyAnchorMap(),
		anchor_map_proposed,
		_s_chat_previous, _s_chat_proposed,
		s_chat_proposed;
		try{
			anchor_map_proposed = $.uriAnchor.makeAnchorMap();
		}catch(error){
			$.uriAnchor.setAnchor(anchor_map_previous,null,true);
			return false;
		}

		stateMap.anchor_map = anchor_map_proposed;

		_s_chat_previous = anchor_map_previous._s_chat;
		_s_chat_proposed = anchor_map_proposed._s_chat;

		if( !anchor_map_previous || _s_chat_previous!==  _s_chat_proposed){
			s_chat_proposed = anchor_map_proposed.chat;

			switch(s_chat_proposed){
				case 'open':
					toggleChat(true);
					break;
				case 'closed':
					toggleChat(false);
				break;
				default:
				toggleChat(false);
				delete anchor_map_proposed.chat;
				$.uriAnchor.setAnchor(anchor_map_proposed,null,true);
			}
		}
		return false;
			
	};


	setJqueryMap = function(){
		var $container = stateMap.$container;
		jqueryMap = {
			$container: $container,
			$chat : $container.find('.spa-shell-chat')
		};
	};

	onClickChat = function  (event) {
		// body...
		/*if( toggleChat(stateMap.is_chat_retracted)){
			$.uriAnchor.setAnchor({
				chat: (stateMap.is_chat_retracted? 'open': 'closed')
			});
		}*/

		changeAnchorPart({chat:(stateMap.is_chat_retracted? 'open': 'closed')});

		return false;
	}

	toggleChat =function(do_extend, callback){

		var px_chat_ht = jqueryMap.$chat.height();
		is_open = px_chat_ht === configMap.chat_extend_height,
		is_closed = px_chat_ht === configMap.chat_extract_height,
		is_sliding = !is_open && !is_closed;

		if(is_sliding) return false;

		if(do_extend){
			jqueryMap.$chat.animate(
				{height: configMap.chat_extend_height},
				configMap.chat_extend_time,
				function(){
					jqueryMap.$chat.attr(
						'title',configMap.chat_extend_title);
					stateMap.is_chat_retracted =false;
					if(callback) callback(jqueryMap.$chat);
				})
			return true;
		}

		jqueryMap.$chat.animate(
				{height: configMap.chat_extract_height},
				configMap.chat_extract_time,
				function(){
					jqueryMap.$chat.attr(
						'title',configMap.chat_extract_title);
					stateMap.is_chat_retracted =true;
					if(callback) callback(jqueryMap.$chat);
				});
		return true;
	};


	initModule = function($container){
		stateMap.$container = $container;
		$container.html(configMap.main_html);
		setJqueryMap();
		stateMap.is_chat_retracted = true;
		jqueryMap.$chat.attr('title', configMap.chat_extract_title)
						.click(onClickChat);
		//setTimeout(function(){toggleChat(true);}, 3000);

		$.uriAnchor.configModule({
			schema_map: configMap.anchor_schema_map
		});

		$(window).bind('hashchange', onHashChange)
				 .trigger('hashchange');
	};

	//setTimeout(function(){toggleChat(false);}, 8000);
	return {initModule: initModule};
}());
