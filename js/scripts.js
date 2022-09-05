/* 
Roma Perceptron, 2022
telegram: @roma_perceptron
*/

document.lastBlock = 0;
document.data = false;
document.answer = [];
document.total = 0;
document.hits = 0;
document.direction = 0;
document.l0 = 0
document.l1 = 1;
document.directionLabels = [];
		
$(document).ready(function() {
	$("html").mousemove(function (pos) {turn_gun(pos)});
	$("input").click(function (event){event.stopPropagation();});
	$(".word").click(function (event){fire('shoot'); check_answer(this); event.stopPropagation();});
	$("body").click(function (){fire('misfire')});
});

function where_cursor(pos){
	var result = 0;
	var w = $(document).width();
	if (pos.pageX <= w * 0.25) result = 1;
	else if (pos.pageX <= w * 0.5) result = 2;
	else if (pos.pageX <= w * 0.75) result = 3;
	else result = 4;
	//
	return result;
}

function turn_gun(pos){
	var new_block = where_cursor(pos);
	if (new_block != document.lastBlock)
		{
			document.lastBlock = new_block;
			switch (new_block)
			{
				case 1:
					$('#gun').css('transform', 'scale3d(1.25, 1, 1)');
					break;
				case 2:
					$('#gun').css('transform', 'scale3d(1, 1, 1)');
					break;
				case 3:
					$('#gun').css('transform', 'scale3d(-1, 1, 1)');
					break;
				case 4:
					$('#gun').css('transform', 'scale3d(-1.25, 1, 1)');
					break;
			}
		}
}

function fire(audio_id){
	document.getElementById(audio_id).pause();
	document.getElementById(audio_id).currentTime = 0;
	document.getElementById(audio_id).play();
}

function start_game(){
	make_directionLabels();
	fire('recharge');
	$('#load_data_frame').css('display', 'none');
	set_new_words();
}

function make_directionLabels(){
	document.directionLabels = [
		document.data[0][0] + ' → ' + document.data[0][1],
		document.data[0][0] + ' ← ' + document.data[0][1],
		document.data[0][0] + ' ⇄ ' + document.data[0][1],
	]
	$('#direction').html(document.directionLabels[document.direction]);
}

function load_demo_data(){
	demo_data = "русский,английский\nлодка,boat\nяблоко,apple\nсобака,dog\nкошка,cat\nапельсин,orange\nутка,duck\nчашка,cup\nкрасный,red\nсиний,blue\nзеленый,green";
	document.data = $.csv.toArrays(demo_data);
	start_game();
}

function load_file(e){
	var reader = new FileReader();
	reader.readAsText($(e)[0].files[0]);
	setTimeout(function(){
		document.data = $.csv.toArrays(reader.result);
		start_game();
	}, 100);
}

function get_next_indexes(){
	var len = document.data.length - 1;
	var target_len = 4;
	len > 4 ? target_len = 4 : target_len = len
	var indexes = new Set();
	while (indexes.size < target_len)
	{
		next_index = Math.ceil(Math.random() * len);
		indexes.add(next_index);
	}
	return Array.from(indexes);
}

function set_question(quest_word){
	$('#question').html('');
	$('#question').html(quest_word);
}

function set_new_words(){
	var new_words = get_next_indexes();
	
	switch (document.direction)
	{
		case 0:
			document.l0 = 0;
			document.l1 = 1;
			break;
		case 1:
			document.l0 = 1;
			document.l1 = 0;
			break;
		case 2:
			if (Math.random() < 0.5) {document.l0 = 0; document.l1 = 1;}
			else {document.l0 = 1; document.l1 = 0;}
			break;
	}
	
	var words_labels = $('.word');
	
	for(var i=0; i<new_words.length; i++)
	{
		words_labels[i].innerHTML = document.data[new_words[i]][document.l1];
	}
	
	random_index = Math.round(Math.random() * (new_words.length-1));
	document.answer = document.data[new_words[random_index]]
	set_question(document.answer[document.l0]);
}

function check_answer(e){
	if (e.innerHTML == document.answer[document.l1])
	{
		$('#answer_frame').css('box-shadow', 'inset 0px 0px 20px 25px #00a68a');
		var index_of_answer = document.data.indexOf(document.answer);
		document.data.splice(index_of_answer, 1);
		document.hits += 1;
	}
	else 
	{
		$('#answer_frame').css('box-shadow', 'inset 0px 0px 20px 25px #e76741');
	}
	
	var words = $('.word');
	for (var i=0; i<words.length; i++)
	{
		if (words[i].innerHTML != document.answer[1]) $(words[i]).css('opacity', 0);
	}
	
	document.total += 1;
	$('#answer_frame').css('display', 'grid');
	$('#hits').html(document.hits);
	$('#total').html(document.total);
	
	if (document.data.length == 1)
	{
		$('.word').html('');
		$('#congrats').html('ПОЗДРАВЛЯЮ!');
		$('#question').html('');
	}
	else setTimeout(function(){$('#answer_frame').css('display', 'none'); set_new_words(); $('.word').css('opacity', 1);}, 1500);
}

function toggle_direction(){
	document.direction == 2 ? document.direction = 0 : document.direction += 1;
	$('#direction').html(document.directionLabels[document.direction]);
	set_new_words();
}