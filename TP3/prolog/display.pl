/* DISPLAY */

/* Print board */
/* Size - tamanho da lista; Board - lista do tabuleiro */
printBoard(Size, Board) :-
	nl, 
	printLetters(Size, Size),
	printCells(Board, 0).

/* Letras do tabuleiro */
printLetters(Size, Size) :- 
	Size > 0,
	space(3),
	printLetter(Size, Size).

printLetter(1, Size) :-
	space(4),
	C is 65+Size-1,
	put_code(C),
	space(3), nl.

printLetter(Line, Size) :-
	space(4),
	C is 65+Size-Line,
	put_code(C),
	space(3),
	Nextline is Line-1,
	printLetter(Nextline,Size).

/* Tabuleiro */
printCells([],_).

printCells([Line|Board], Currentline) :-
	space(3),
	write(Currentline),
	printLine(Line, Currentline),
	nl,
	Nextline is Currentline+1,
	printCells(Board, Nextline).

/* Linhas */

printLine([], _).

printLine([Cell|Rest], Currentline) :-
	printPiece(Cell),
	Nextline is Currentline+1,
	printLine(Rest, Nextline).

/* Peças e divisões */
printPiece([1|Tail]) :-
	div,
	redPiece,
	write('-'),
	size(Tail, 0),
	space(3).

printPiece([2|Tail]) :-
	div,
	whitePiece,
	write(' -'),
	size(Tail, 0),
	space(3).


/* Tamanho de uma lista */

size([], M) :-
	J is M+1,
	write(J).

size([_|Tail], M) :-
    N is M+1,
	size(Tail, N).
    

/* Characteres */

/* | */
div :- put_code(9474). 

redPiece :- put_code(11093).
whitePiece :- put_code(11044).

/* Space */

space(0).
space(N) :- write(' '), N1 is N-1, space(N1).

/* Menu and Play Mode */

drawHeader :- 
	nl,
	write('*'), write('*************************************'), write('*'), nl,
	write('*'), space(37), write('*'), nl,
	write('*'), space(16), write('SWACK'), space(16), write('*'), nl,
	write('*'), space(37), write('*'), nl,
	write('*'), write('*************************************'), write('*'), nl.

drawMenu :-
	write('*'), space(37), write('*'), nl,
	write('*'), space(8), write('1. Player vs. Player'), space(9), write('*'), nl,
	write('*'), space(8), write('2. Player vs. Computer'), space(7), write('*'), nl,
	write('*'), space(8), write('3. Computer vs. Computer'), space(5), write('*'), nl,
	write('*'), space(37), write('*'), nl,
	write('*'), write('*************************************'), write('*'), nl.

playMode(1) :-
	nl, nl,
	write('Player 1: '), redPiece, write('   '),
	write('Player 2: '), whitePiece, nl.

playMode(2) :-
	nl, nl,
	write('Player 1: '), redPiece, write('   '),
	write('Computer 2: '), whitePiece, nl.

playMode(3) :-
	nl, nl,
	write('Computer 1: '), redPiece, write('   '),
	write('Computer 2: '), whitePiece, nl.
