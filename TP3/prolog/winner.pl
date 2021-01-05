/*
O código que se segue, entre os comentários START e END
foi reaproveitado do trabalho de um ano anterior, do trabalho
do Mário Gil e do André Rocha (https://github.com/andrefmrocha/Fuse-GI).

O predicado *value* original, e os restantes do qual depende, foram adaptados
para que em vez de retribuirem o valor do maior grupo de cada jogador, 
chamassem um novo predicado que guardará todos os tamanhos dos grupos num
ficheiro, por jogador, de forma a depois ser possível aplicar o critério
de desempate.
*/

/* START */

value(Visited, Disc, _):-
    value(Visited, Disc, 0, 0).

value(Visited, _, Y, X):-
    \+ get_element_matrix(Visited, Y, X, _),
    XRight is X + 1,
    \+ get_element_matrix(Visited, 0, XRight, _).

value(Visited, Disc, Y, X):-
    \+ get_element_matrix(Visited, Y, X, _),
    XRight is X + 1,
    get_element_matrix(Visited, 0, XRight, Elem),
    Elem \= nil,
    value(Visited, Disc, 0, XRight).

value(Visited, Disc, Y, X):-
    get_element_matrix(Visited, Y, X, visited),
    Y1 is Y + 1,
    value(Visited, Disc, Y1, X).

value(Visited, Disc, Y, X):-
    get_element_matrix(Visited, Y, X, Elem),
    Elem \= Disc,
    Y1 is Y + 1,
    replace_matrix(Y, X, visited, Visited, NewVisited),
    value(NewVisited, Disc, Y1, X).

value(Visited, Disc, Y, X):-
    get_element_matrix(Visited, Y, X, Elem),
    Elem \= visited,
    YDown is Y + 1,
    YUp is Y - 1,
    XRight is X + 1,
    XLeft is X - 1,
    replace_matrix(Y, X, visited, Visited, FirstVisited),
    board_flood(FirstVisited, SecondVisited, Disc, DownPoints, YDown, X),
    board_flood(SecondVisited, ThirdVisited, Disc, UpPoints, YUp, X),
    board_flood(ThirdVisited, FourthVisited, Disc, RightPoints, Y, XRight),
    board_flood(FourthVisited, FinalVisited, Disc, LeftPoints, Y, XLeft),
    NewPoints is DownPoints + UpPoints + LeftPoints + RightPoints + 1,
    writeToFile(NewPoints, Disc),
    value(FinalVisited, Disc, YDown, X).

board_flood(Visited, Visited, _, Points, Y, X):-
    \+ get_element_matrix(Visited, Y, X, _),
    Points is 0.

board_flood(Visited, Visited, _, Points, Y, X):-
    get_element_matrix(Visited, Y, X, visited),
    Points is 0.

board_flood(Visited, Visited, Disc, Points, Y, X):-
    get_element_matrix(Visited, Y, X, Elem),
    Elem \= Disc,
    Points is 0.

board_flood(Visited, NewVisited, Disc, Points, Y, X):-
    get_element_matrix(Visited, Y, X, Elem),
    Elem \= visited,
    YDown is Y + 1,
    YUp is Y - 1,
    XRight is X + 1,
    XLeft is X - 1,
    replace_matrix(Y, X, visited, Visited, FirstNewVisited),
    board_flood(FirstNewVisited, SecondNewVisited, Disc, DownPoints, YDown, X),
    board_flood(SecondNewVisited, ThirdNewVisited, Disc, UpPoints, YUp, X),
    board_flood(ThirdNewVisited, FourthNewVisited, Disc, RightPoints, Y, XRight),
    board_flood(FourthNewVisited, NewVisited, Disc, LeftPoints, Y, XLeft),
    Points is DownPoints + UpPoints + LeftPoints + RightPoints + 1.  

replace_column(0, Value, [_|T], [Value | T]) :- !.
replace_column(Column, Value, [H | T], [H | T2]) :-
	Column > 0,
	NextColumn is Column - 1,
	replace_column(NextColumn, Value, T, T2).

replace_matrix(0, Column, Value, [Line | T], [Line2 | T]) :- !, replace_column(Column, Value, Line, Line2).
replace_matrix(Row, Column, Value, [H | T], [H | T2]) :-
	Row > 0,
	NextRow is Row - 1,
	replace_matrix(NextRow, Column, Value, T, T2).

get_element_matrix(Matrix, Row, Column, Element) :-
	nth0(Row, Matrix, SearchedRow),
	nth0(Column, SearchedRow, Element).

/* END */

writeToFile(Content, 1) :-
    open('~/Documentos/LAIG/laig-t05-g02/TP3/prolog/player1.txt', append, Out),
    write(Out,Content),
    write(Out,'.\n'),
    close(Out).

writeToFile(Content, 2) :-
    open('~/Documentos/LAIG/laig-t05-g02/TP3/prolog/player2.txt', append, Out),
    write(Out,Content),
    write(Out,'.\n'),
    close(Out).  

writeToFile(Content, 3) :-
    open('~/Documentos/LAIG/laig-t05-g02/TP3/prolog/moves.txt', append, Out),
    write(Out,Content),
    write(Out,'.\n'),
    close(Out).      

resetFile(1) :- 
    open('~/Documentos/LAIG/laig-t05-g02/TP3/prolog/player1.txt', write, Out),
    write(Out,''),
    close(Out),
    open('~/Documentos/LAIG/laig-t05-g02/TP3/prolog/player2.txt', write, Out2),
    write(Out2,''),
    close(Out2).

resetFile(2) :- 
    open('~/Documentos/LAIG/laig-t05-g02/TP3/prolog/moves.txt', write, Out),
    write(Out,''),
    close(Out).

readFile(1, Lines) :-
    open('~/Documentos/LAIG/laig-t05-g02/TP3/prolog/player1.txt', read, In),
    read_file(In,Lines),
    close(In).

readFile(2, Lines) :-
    open('~/Documentos/LAIG/laig-t05-g02/TP3/prolog/player2.txt', read, In),
    read_file(In,Lines),
    close(In).

readFile(3, Lines) :-
    open('~/Documentos/LAIG/laig-t05-g02/TP3/prolog/moves.txt', read, In),
    read_file(In,Lines),
    close(In).

% The read_file predicate is based on
% https://stackoverflow.com/questions/4805601/read-a-file-line-by-line-in-prolog
read_file(Stream,[]) :-
    at_end_of_stream(Stream).

read_file(Stream,[X|L]) :-
    \+ at_end_of_stream(Stream),
    read(Stream,X),
    read_file(Stream,L).

getWinner([], _, 0, 2).
getWinner([], _, 1, 1).

getWinner(_, [], 1, 1).
getWinner(_, [], 0, 2).

getWinner([P1|Rest1], [P2|Rest2], LastPlayer, Winner) :-
	(P1 =:= P2
		-> getWinner(Rest1, Rest2, LastPlayer, Winner)
		; (P1 > P2
			-> Winner is 1
			; Winner is 2
		)
	).