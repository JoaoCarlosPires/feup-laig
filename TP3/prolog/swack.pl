/* SWACK */

% Predicado Principal

play :-
	drawHeader,
	menu.

/* MENU */

menu :-
	drawMenu,
	get_code(Option), 
	skip_line,
	NOption is Option-48,
	playCycle(NOption).

display_game(NextPlayer, Board) :-
	nl,	write('Current Game Board'), nl,
	printBoard(4, Board), nl,
	Next is NextPlayer + 1,
	write('Current player: '), write(Next), nl.

% Player vs Computer

playCycle(2) :- 
	displayDifficulty,
	get_code(Option), 
	skip_line,
	Difficulty is Option-48,
	playMode(2),
	initial(A),
	board(A),
	repeatCycle(0, 0, A, 2, Difficulty).

% Computer vs Computer

playCycle(3) :- 
	displayDifficulty,
	get_code(Option), 
	skip_line,
	Difficulty is Option-48,
	playMode(3),
	initial(A),
	board(A),
	repeatCycle(0, 0, A, 3, Difficulty).

% Player vs Player

playCycle(1) :-
	playMode(1),
	initial(A),
	board(A),
	repeatCycle(0, 0, A, 1, 0).

% Player vs Player
repeatCycle(NextPlayer, Pass, Board, 1, Difficulty) :-
	write('Move or Pass? (move/pass)'),nl,
	read(Ans),nl,
	Next is NextPlayer + 1,
	Player is mod(Next, 2),
	(Ans == pass ->
		(Pass == 1 -> 
			game_over(Board, Player)
		;
			display_game(Player, Board),
			repeatCycle(Player, 1, Board, 1, Difficulty) 
		)
	; 	move(Board, NextPlayer, 1, Difficulty)
	).

% Player vs Computer - Player turn
repeatCycle(0, Pass, Board, 2, Difficulty) :- 
	write('Move or Pass? (move/pass)'),nl,
	read(Ans),nl,
	(Ans == pass ->
		(Pass == 1 -> 
			game_over(Board, 1)
		;
			display_game(1, Board),
			repeatCycle(1, 1, Board, 2, Difficulty)
		)
	; 	move(Board, 0, 2, Difficulty)
	).

% Player vs Computer - Computer turn
repeatCycle(1, Pass, Board, 2, Difficulty) :-
	random(1, 3, PP),
	(PP == 1 -> 
		write('Computer Passed'), nl,
		(Pass == 1 -> 
			game_over(Board, 2)
		;
			display_game(0, Board),
			repeatCycle(0, 1, Board, 2, Difficulty)
		)
	; resetFile(2),
	validMoves(Board, 2, ListOfMoves),
	without_last(ListOfMoves, NewList),
	length(NewList, L),
	(Difficulty == 1
		-> Bound is L + 1,
		random(1, Bound, Index),
		getPlay(Board, NewList, Index, Difficulty, 2, 1) 
		; choose_move(Board, 1, NewList, 2)
	)
	).

% Computer vs Computer
repeatCycle(NextPlayer, Pass, Board, 3, Difficulty) :-
	Next is NextPlayer + 1,
	Player is mod(Next, 2),
	random(1, 3, PP),
	(PP == 1 -> 
		write('Computer '), write(Next), write(' Passed'), nl,
		(Pass == 1 -> 
			game_over(Board, Next)
		;
			display_game(Player, Board),
			repeatCycle(Player, 1, Board, 3, Difficulty)
		)
	; resetFile(2),
	validMoves(Board, Next, ListOfMoves),
	without_last(ListOfMoves, NewList),
	length(NewList, L),
	(Difficulty == 1
		-> Bound is L + 1,
		random(1, Bound, Index),
		getPlay(Board, NewList, Index, Difficulty, 3, NextPlayer) 
		; choose_move(Board, NextPlayer, NewList, 3)
	)
	).
	
% Escolha do melhor movimento de entre os possíveis
choose_move(Board, Player, ListOfMoves, NOption) :- choose_move(Board, Player, ListOfMoves, Move, 0, NOption).

choose_move(Board, Player, [], BestMove, _, NOption) :- !, computerMove(Board, Player, NOption, BestMove, 2).
choose_move(GameState, Player, [CurrMove|Others], Move, CurrHigh, NOption) :-
	resetFile(1),

	CurrPlayer is Player + 1,

	simulateMove(GameState, Player, AfterBoard, CurrMove),

	getSimplified(AfterBoard, Simplified),
	
	value(Simplified, CurrPlayer, 0),
	
	readFile(CurrPlayer, Points),
	
	without_last(Points, P),
	sort(P, S),
	reverse(S, Sorted),
	
	nth0(0, Sorted, High),

	(High >= CurrHigh 
		-> choose_move(GameState, Player, Others, CurrMove, High, NOption) 
		; choose_move(GameState, Player, Others, Move, CurrHigh, NOption)
	).

% Obtenção da jogada na posição Idx da lista de jogadas
getPlay(Board, [Head|_], 1, Difficulty, NOption, Player) :- !, computerMove(Board, Player, NOption, Head, Difficulty).
getPlay(Board, [_|Tail], Idx, Difficulty, NOption, Player) :- NewI is Idx - 1, getPlay(Board, Tail, NewI, Difficulty, NOption, Player).

% Simulação do tabuleiro após um movimento
simulateMove(Board, Next, FinalBoard, [Lin, Col, FLin, FCol]) :-
	nth0(Lin, Board, BoardLine),
	nth0(Col, BoardLine, BoardCol),

	nth0(FLin, Board, FBoardLine),
	nth0(FCol, FBoardLine, FBoardCol),

	NextPlayer is Next + 1,
	
	(NextPlayer == 1 
		-> 	myreplace(BoardCol, New, 2),
			replace(Col, BoardLine, New, NewLine),
			replace(Lin, Board, NewLine, NewBoard),

			add(1, FBoardCol, NewCell),
			replace(FCol, NewLine, NewCell, NewFLine),
			replace(FLin, NewBoard, NewFLine, FinalBoard)			
		;	myreplace(BoardCol, New, 1),
			replace(Col, BoardLine, New, NewLine),
			replace(Lin, Board, NewLine, NewBoard),

			add(2, FBoardCol, NewCell),
			replace(FCol, NewLine, NewCell, NewFLine),
			replace(FLin, NewBoard, NewFLine, FinalBoard)
	).

% Movimento do computador após obtenção da jogada a efetuar
computerMove(Board, Next, NOption, [Lin, Col, FLin, FCol], Difficulty) :-
	write('Computer moving from '), 
	getCol(Col), 
	write('-'), 
	write(Lin), 
	write(' to '), 
	getCol(FCol),
	write('-'), 
	write(FLin), nl,

	nth0(Lin, Board, BoardLine),
	nth0(Col, BoardLine, BoardCol),

	nth0(FLin, Board, FBoardLine),
	nth0(FCol, FBoardLine, FBoardCol),

	NextPlayer is Next + 1,
	
	(NextPlayer == 1 
		-> 	myreplace(BoardCol, New, 2),
			replace(Col, BoardLine, New, NewLine),
			replace(Lin, Board, NewLine, NewBoard),

			add(1, FBoardCol, NewCell),
			(FLin == Lin -> replace(FCol, NewLine, NewCell, NewFLine) ; replace(FCol, FBoardLine, NewCell, NewFLine)),
			replace(FLin, NewBoard, NewFLine, FinalBoard),

			Player is mod(NextPlayer, 2),
			display_game(Player, FinalBoard), 
			repeatCycle(Player, 0, FinalBoard, NOption, Difficulty)
		;	myreplace(BoardCol, New, 1),
			replace(Col, BoardLine, New, NewLine),
			replace(Lin, Board, NewLine, NewBoard),

			add(2, FBoardCol, NewCell),
			(FLin == Lin -> replace(FCol, NewLine, NewCell, NewFLine) ; replace(FCol, FBoardLine, NewCell, NewFLine)),
			replace(FLin, NewBoard, NewFLine, FinalBoard),

			Player is mod(NextPlayer, 2),
			display_game(Player, FinalBoard), 
			repeatCycle(Player, 0, FinalBoard, NOption, Difficulty)
	).

% Movimento do jogador
move(Board, Next, NOption, Difficulty) :-
	getInputPlay(Col, Lin),
	getFInputPlay(FCol, FLin),

	nth0(Lin, Board, BoardLine),
	nth0(Col, BoardLine, BoardCol),
	nth0(0, BoardCol, P),

	nth0(FLin, Board, FBoardLine),
	nth0(FCol, FBoardLine, FBoardCol),
	nth0(0, FBoardCol, FP),

	% check if both stacks have the same size
	(same_length(FBoardCol, BoardCol) ->
		(adjacent(Col, Lin, FCol, FLin) ->
			NextPlayer is Next + 1,
			(P \= NextPlayer
				-> write('Cannot move an adversary piece!'), nl,
				move(Board, Next, NOption, Difficulty)
				;
				(NextPlayer == 1 
					-> (FP == 2
						-> myreplace(BoardCol, New, 2),
						replace(Col, BoardLine, New, NewLine),
						replace(Lin, Board, NewLine, NewBoard),

						add(1, FBoardCol, NewCell),
						(FLin == Lin -> replace(FCol, NewLine, NewCell, NewFLine) ; replace(FCol, FBoardLine, NewCell, NewFLine)),
						replace(FLin, NewBoard, NewFLine, FinalBoard),

						Player is mod(NextPlayer, 2),
						display_game(Player, FinalBoard), 
						repeatCycle(Player, 0, FinalBoard, NOption, Difficulty)
						; write('invalid'), nl, move(Board, Next, NOption, Difficulty)
					)
					; (FP == 1
						-> myreplace(BoardCol, New, 1),
						replace(Col, BoardLine, New, NewLine),
						replace(Lin, Board, NewLine, NewBoard),

						add(2, FBoardCol, NewCell),
						(FLin == Lin -> replace(FCol, NewLine, NewCell, NewFLine) ; replace(FCol, FBoardLine, NewCell, NewFLine)),
						replace(FLin, NewBoard, NewFLine, FinalBoard),

						Player is mod(NextPlayer, 2),
						display_game(Player, FinalBoard), 
						repeatCycle(Player, 0, FinalBoard, NOption, Difficulty)
						; write('invalid'), nl, move(Board, Next, NOption, Difficulty)
					)
				) 	
			)
		; write('Cells arent adjacent'), nl,
		move(Board, Next, NOption, Difficulty)
		)
	; write('Stacks dont have the same size'), nl,
	move(Board, Next, NOption, Difficulty)
	).

% Predicado que determina o vencedor com base no estado final do tabuleiro (FinalB) 
% e no último jogador a efetuar uma jogada (LastPlayer)
game_over(FinalB, LastPlayer) :- 

	getSimplified(FinalB, Simplified),
	
	resetFile(1),

	value(Simplified, 1, 0),
	value(Simplified, 2, 0),
	
	readFile(1, P1Points),
	readFile(2, P2Points),
	
	without_last(P1Points, P1),
	sort(P1, S1),
	reverse(S1, Sorted1),
	
	without_last(P2Points, P2),
	sort(P2, S2),
	reverse(S2, Sorted2),

	getWinner(Sorted1, Sorted2, LastPlayer, Winner).

% Predicado que invoca o display do tabuleiro no seu estado inicial
initial(A) :-
	board(A),
	display_game(0, A).




    
