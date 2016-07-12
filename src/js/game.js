	var DIRECTION_LEFT = 37;
	var DIRECTION_RIGHT = 39;
	var DIRECTION_UP = 38;
	var DIRECTION_DOWN = 40;
	var GAME_SPEED = 200;
	var MAP_SIZE = 20;
	var score;
	var actualDirection;
	var gameInterval; // loop / repaint interval
	var snake; // snake matrix
	
	var game = {

		init : function() {

			snake = new Array();
			snake.push("0_3", "0_2", "0_1", "0_0");
			
			score = 0;
			$('.score').text("Score: " + score);

			game.createMap();
			
			clearInterval(gameInterval);
			
			game.doWatch();
			game.doPaintSnake();
			game.doPaintScore();
			actualDirection = DIRECTION_RIGHT;
			game.doWalk();
		},
		
		createMap : function() {
			var map = new Array(MAP_SIZE);
			for (var i = 0; i < MAP_SIZE; i++) {
				map[i] = new Array(MAP_SIZE);
			}

			var html = "";
			for (var x = 0; x < MAP_SIZE; x++) {
				html += '<div  class="linha" id="linha'+x+'">'
				for (var y = 0; y < MAP_SIZE; y++) {
					html += '<div class="coluna clean" id="coluna'+x+'_'+y+'"></div>';
				}
				html += '</div>';
			}

			$('#principal').html(html);
		},
		
		doPause : function(){
			clearInterval(gameInterval);
		},
		
		
		doWalk : function() {
			
			game.doPause(); // clear the interval
 			gameInterval = setInterval(function(){
				var atualX = parseInt(snake[0].split("_")[0]);
				var atualY = parseInt(snake[0].split("_")[1]);
				
				if (actualDirection === DIRECTION_LEFT) {
					atualY--;
				} else if (actualDirection === DIRECTION_RIGHT) {
					atualY++;
				} else if (actualDirection === DIRECTION_UP) {
					atualX--;
				} else if (actualDirection === DIRECTION_DOWN) {
					atualX++;
				}
				
				// Valida se saiu do mapa ou não
				if (atualY < 0 || atualY === MAP_SIZE || atualX < 0 || atualX === MAP_SIZE ){
					// $('#principal').appendTo('body').html('<div><p>You
					// Lose!<p></div>');
					game.init();
					return;
				}
				
				for (var i = snake.length-1; i >= 0; i--){
					if (i == 0) {
						snake[i] = atualX+"_"+atualY;
						continue;
					}
					
					snake[i] = snake[i-1]; 								
				}
				
				if ($('#coluna' + snake[0]).hasClass("snake-body")){
					// $('#principal').appendTo('body').html('<div><p>You
					// Lose!<p></div>');
					game.init();
					return;
				}
				
				if ($('#coluna' + snake[0]).hasClass("score-in"))
					game.doEat();
				
				game.doPaintSnake();
			}, GAME_SPEED);
		},
		
		doPaintSnake : function(){
			
			// clean all
			$('.snake-body').removeClass('snake-body').addClass('clean');
			$('.snake-head').removeClass('snake-head').addClass('clean');
			$('.snake-tail').removeClass('snake-tail').addClass('clean');
			
			for (var i = 0; i < snake.length; i++) {
				if (i === 0) {
					$('#coluna' + snake[i]).removeClass('clean').addClass('snake-head');
					continue;
				} else if (i === snake.length-1) {
					$('#coluna' + snake[i]).removeClass('clean').addClass('snake-tail');
					continue;
				}
				
				$('#coluna' + snake[i]).removeClass('clean').addClass('snake-body');
			}
		},
		
		doPaintScore : function(){
			var x = parseInt(Math.random() * (MAP_SIZE));
			var y = parseInt(Math.random() * (MAP_SIZE));
			
			while ($('#coluna' + x+"_"+y).hasClass("snake_head") || $('#coluna' + x+"_"+y).hasClass("snake_body") || $('#coluna' + x+"_"+y).hasClass("snake_tail")) {
				x = parseInt(Math.random() * (MAP_SIZE));
				y = parseInt(Math.random() * (MAP_SIZE));
			}
			
			$('#coluna' + x+"_"+y).removeClass('clean').addClass('score-in');
			
		},
		
		doEat : function() {
			snake.push(snake[snake.length]);
			$('#coluna' + snake[0]).removeClass('score-in').addClass('clean');
			
			score += 100;
			$('.score').text("Score: " + score);
			
			if ( score === 1000)
				$('.score').addClass('s1000');
			else if (score === 2000)
				$('.score').addClass('s2000');
			game.doPaintScore();
		},

		doWatch : function() {
			
			$(document).on('keyup', function (e) {
				if (e.which === DIRECTION_LEFT) {
					game.goLeft();
				} else if (e.which === DIRECTION_RIGHT) { 
					game.goRight();
				} else if (e.which === DIRECTION_UP) {
					game.goUp();
				} else if (e.which === DIRECTION_DOWN) {
					game.goDown();
				}
			});
			
		},
		
		goUp : function() {
			if (actualDirection !== DIRECTION_DOWN)
				actualDirection = DIRECTION_UP;
		},
		
		goDown : function() {
			if (actualDirection !== DIRECTION_UP)
				actualDirection = DIRECTION_DOWN;
		},
		
		goLeft : function() {
			if(actualDirection !== DIRECTION_RIGHT)
				actualDirection = DIRECTION_LEFT;
		},
		
		goRight : function() {
			if(actualDirection !== DIRECTION_LEFT)
				actualDirection = DIRECTION_RIGHT;
		}
		
	}