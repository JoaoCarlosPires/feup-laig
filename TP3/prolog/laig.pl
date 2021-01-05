/*
This file contains some adapted predicates from PLOG original work.
*/

checkMove(Board, Next, Col, Lin, FCol, FLin, Res) :- 
    nth0(Lin, Board, BoardLine),
	nth0(Col, BoardLine, BoardCol),
	nth0(0, BoardCol, P),

	nth0(FLin, Board, FBoardLine),
	nth0(FCol, FBoardLine, FBoardCol),
	nth0(0, FBoardCol, FP),

	same_length(FBoardCol, BoardCol) ->
		(adjacent(Col, Lin, FCol, FLin) ->
			NextPlayer is Next + 1,
			(NextPlayer == 1 -> (FP == 2 -> equal(P, NextPlayer), Res is 0 ; Res is 2)
			; (FP == 1 -> equal(P, NextPlayer), Res is 0 ; Res is 2)) ; Res is 3)
	; Res is 4.

equal(N, N).

get_Winner(FinalB, LastPlayer, Winner) :-
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

getMove(NextPlayer, Board, 1, Res) :-
	Next is NextPlayer + 1,
	resetFile(2),
	validMoves(Board, Next, ListOfMoves),
	without_last(ListOfMoves, Moves),
	length(Moves, Len),
	random(0, Len, Index),
    nth0(Index, Moves, Res).
	
getMove(NextPlayer, Board, 2, Res) :-
	Next is NextPlayer + 1,
	resetFile(2),
	validMoves(Board, Next, ListOfMoves),
	without_last(ListOfMoves, NewList),
	choose_move(Board, NextPlayer, NewList, Move, 0, Res).

choose_move(Board, Player, [], BestMove, _, BestMove).
choose_move(GameState, Player, [CurrMove|Others], Move, CurrHigh, Res) :-
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
		-> choose_move(GameState, Player, Others, CurrMove, High, Res) 
		; choose_move(GameState, Player, Others, Move, CurrHigh, Res)
	).

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

