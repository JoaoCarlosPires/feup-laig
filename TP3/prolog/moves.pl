% End of verification
validMoves(_, _, 4, 0, ListOfMoves) :- readFile(3, ListOfMoves).

validMoves(GameState, Player, Line, Column, ListOfMoves) :-
	nth0(Line, GameState, BoardLine),
	nth0(Column, BoardLine, BoardCol),
	nth0(0, BoardCol, P),

	(P == Player 
        -> getPossibleMoves(GameState, BoardCol, Line, Column), 
        (Column < 3 -> NewCol is Column + 1, NewLine is Line ; NewCol is 0, NewLine is Line + 1),
        validMoves(GameState, Player, NewLine, NewCol, ListOfMoves)
        ; (Column < 3 -> NewCol is Column + 1, NewLine is Line ; NewCol is 0, NewLine is Line + 1),
        validMoves(GameState, Player, NewLine, NewCol, ListOfMoves)
    ).

validMoves(Board, Player, ListOfMoves) :- validMoves(Board, Player, 0, 0, ListOfMoves).
    
% Top-Left Cell
getPossibleMoves(GameState, BoardCol, 0, 0) :- 
    !,
    nth0(0, BoardCol, P),

    nth0(0, GameState, BoardLine1),
	nth0(1, BoardLine1, BoardCol1),
	nth0(0, BoardCol1, P1),

    nth0(1, GameState, BoardLine2),
	nth0(0, BoardLine2, BoardCol2),
	nth0(0, BoardCol2, P2),

    (same_length(BoardCol, BoardCol1) -> (P1 \== P -> writeToFile([0, 0, 0 , 1], 3) ; write('')) ; write('')),
    (same_length(BoardCol, BoardCol2) -> (P2 \== P -> writeToFile([0, 0, 1 , 0], 3) ; write('')) ; write('')).

% Bottom-Right Cell
getPossibleMoves(GameState, BoardCol, 3, 3) :-
    !,
    nth0(0, BoardCol, P),

    nth0(2, GameState, BoardLine1),
	nth0(3, BoardLine1, BoardCol1),
	nth0(0, BoardCol1, P1),

    nth0(3, GameState, BoardLine2),
	nth0(2, BoardLine2, BoardCol2),
	nth0(0, BoardCol2, P2),

    (same_length(BoardCol, BoardCol1) -> (P1 \== P -> writeToFile([3, 3, 2 , 3], 3) ; write('')) ; write('')),
    (same_length(BoardCol, BoardCol2) -> (P2 \== P -> writeToFile([3, 3, 3 , 2], 3) ; write('')) ; write('')).

% Top-Right Cell
getPossibleMoves(GameState, BoardCol, 0, 3) :-
    !,
    nth0(0, BoardCol, P),

    nth0(0, GameState, BoardLine1),
	nth0(2, BoardLine1, BoardCol1),
	nth0(0, BoardCol1, P1),

    nth0(1, GameState, BoardLine2),
	nth0(3, BoardLine2, BoardCol2),
	nth0(0, BoardCol2, P2),

    (same_length(BoardCol, BoardCol1) -> (P1 \== P -> writeToFile([0, 3, 0 , 2], 3) ; write('')) ; write('')),
    (same_length(BoardCol, BoardCol2) -> (P2 \== P -> writeToFile([0, 3, 1 , 3], 3) ; write('')) ; write('')).

% Bottom-Left Cell
getPossibleMoves(GameState, BoardCol, 3, 0) :-
    !,
    nth0(0, BoardCol, P),

    nth0(3, GameState, BoardLine1),
	nth0(1, BoardLine1, BoardCol1),
	nth0(0, BoardCol1, P1),

    nth0(2, GameState, BoardLine2),
	nth0(0, BoardLine2, BoardCol2),
	nth0(0, BoardCol2, P2),

    (same_length(BoardCol, BoardCol1) -> (P1 \== P -> writeToFile([3, 0, 3 , 1], 3) ; write('')) ; write('')),
    (same_length(BoardCol, BoardCol2) -> (P2 \== P -> writeToFile([3, 0, 2 , 0], 3) ; write('')) ; write('')).

% First Line
getPossibleMoves(GameState, BoardCol, 0, Column) :-
    !,
    nth0(0, BoardCol, P),
    
    nth0(1, GameState, BoardLine1),
	nth0(Column, BoardLine1, BoardCol1),
	nth0(0, BoardCol1, P1),

    Next is Column + 1,
    nth0(0, GameState, BoardLine2),
	nth0(Next, BoardLine2, BoardCol2),
	nth0(0, BoardCol2, P2),

    Previous is Column - 1,
    nth0(0, GameState, BoardLine3),
	nth0(Previous, BoardLine3, BoardCol3),
	nth0(0, BoardCol3, P3),

    (same_length(BoardCol, BoardCol1) -> (P1 \== P -> writeToFile([0, Column, 1 , Column], 3) ; write('')) ; write('')),
    (same_length(BoardCol, BoardCol2) -> (P2 \== P -> writeToFile([0, Column, 0 , Next], 3) ; write('')) ; write('')),
    (same_length(BoardCol, BoardCol3) -> (P3 \== P -> writeToFile([0, Column, 0 , Previous], 3) ; write('')) ; write('')).

% First Col
getPossibleMoves(GameState, BoardCol, Line, 0) :- 
    !,
    nth0(0, BoardCol, P),

    nth0(Line, GameState, BoardLine1),
	nth0(1, BoardLine1, BoardCol1),
	nth0(0, BoardCol1, P1),

    Next is Line + 1,
    nth0(Next, GameState, BoardLine2),
	nth0(0, BoardLine2, BoardCol2),
	nth0(0, BoardCol2, P2),

    Previous is Line - 1,
    nth0(Previous, GameState, BoardLine3),
	nth0(0, BoardLine3, BoardCol3),
	nth0(0, BoardCol3, P3),

    (same_length(BoardCol, BoardCol1) -> (P1 \== P -> writeToFile([Line, 0, Line , 1], 3) ; write('')) ; write('')),
    (same_length(BoardCol, BoardCol2) -> (P2 \== P -> writeToFile([Line, 0, Next , 0], 3) ; write('')) ; write('')),
    (same_length(BoardCol, BoardCol3) -> (P3 \== P -> writeToFile([Line, 0, Previous , 0], 3) ; write('')) ; write('')).

% Last Line
getPossibleMoves(GameState, BoardCol, 3, Column) :-
    !,
    nth0(0, BoardCol, P),

    nth0(2, GameState, BoardLine1),
	nth0(Column, BoardLine1, BoardCol1),
	nth0(0, BoardCol1, P1),

    Next is Column + 1,
    nth0(3, GameState, BoardLine2),
	nth0(Next, BoardLine2, BoardCol2),
	nth0(0, BoardCol2, P2),

    Previous is Column - 1,
    nth0(3, GameState, BoardLine3),
	nth0(Previous, BoardLine3, BoardCol3),
	nth0(0, BoardCol3, P3),

    (same_length(BoardCol, BoardCol1) -> (P1 \== P -> writeToFile([3, Column, 2 , Column], 3) ; write('')) ; write('')),
    (same_length(BoardCol, BoardCol2) -> (P2 \== P -> writeToFile([3, Column, 3 , Next], 3) ; write('')) ; write('')),
    (same_length(BoardCol, BoardCol3) -> (P3 \== P -> writeToFile([3, Column, 3 , Previous], 3) ; write('')) ; write('')).

% Last Col
getPossibleMoves(GameState, BoardCol, Line, 3) :-
    !,
    nth0(0, BoardCol, P),

    nth0(Line, GameState, BoardLine1),
	nth0(2, BoardLine1, BoardCol1),
	nth0(0, BoardCol1, P1),

    Next is Line + 1,
    nth0(Next, GameState, BoardLine2),
	nth0(3, BoardLine2, BoardCol2),
	nth0(0, BoardCol2, P2),

    Previous is Line - 1,
    nth0(Previous, GameState, BoardLine3),
	nth0(3, BoardLine3, BoardCol3),
	nth0(0, BoardCol3, P3),

    (same_length(BoardCol, BoardCol1) -> (P1 \== P -> writeToFile([Line, 3, Line , 2], 3) ; write('')) ; write('')),
    (same_length(BoardCol, BoardCol2) -> (P2 \== P -> writeToFile([Line, 3, Next , 3], 3) ; write('')) ; write('')),
    (same_length(BoardCol, BoardCol3) -> (P3 \== P -> writeToFile([Line, 3, Previous , 3], 3) ; write('')) ; write('')).

% All other cases
getPossibleMoves(GameState, BoardCol, Line, Column) :-
    !,
    nth0(0, BoardCol, P),

    NextL is Line + 1,
    nth0(NextL, GameState, BoardLine1),
	nth0(Column, BoardLine1, BoardCol1),
	nth0(0, BoardCol1, P1),

    PreviousL is Line - 1,
    nth0(PreviousL, GameState, BoardLine2),
	nth0(Column, BoardLine2, BoardCol2),
	nth0(0, BoardCol2, P2),

    NextC is Column + 1,
    nth0(Line, GameState, BoardLine3),
	nth0(NextC, BoardLine3, BoardCol3),
	nth0(0, BoardCol3, P3),

    PreviousC is Column - 1,
    nth0(Line, GameState, BoardLine4),
	nth0(PreviousC, BoardLine4, BoardCol4),
	nth0(0, BoardCol4, P4),

    (same_length(BoardCol, BoardCol1) -> (P1 \== P -> writeToFile([Line, Column, NextL , Column], 3) ; write('')) ; write('')),
    (same_length(BoardCol, BoardCol2) -> (P2 \== P -> writeToFile([Line, Column, PreviousL , Column], 3) ; write('')) ; write('')),
    (same_length(BoardCol, BoardCol3) -> (P3 \== P -> writeToFile([Line, Column, Line , NextC], 3) ; write('')) ; write('')),
    (same_length(BoardCol, BoardCol4) -> (P4 \== P -> writeToFile([Line, Column, Line , PreviousC], 3) ; write('')) ; write('')).
