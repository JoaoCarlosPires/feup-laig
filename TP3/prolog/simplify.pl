getSimplified(ToSimplify, Simplified) :-
	
	% Linha 0
	nth0(0, ToSimplify, BoardLine0),
	
	% Célula 0
	nth0(0, BoardLine0, Cell1),
	nth0(0, Cell1, P1),
	
	% Célula 1
	nth0(1, BoardLine0, Cell2),
	nth0(0, Cell2, P2),
	
	% Célula 2
	nth0(2, BoardLine0, Cell3),
	nth0(0, Cell3, P3),

	% Célula 3
	nth0(3, BoardLine0, Cell4),
	nth0(0, Cell4, P4),

    add(P1, [], L0),
    add(P2, [], L1),
    add(P3, [], L2),
    add(P4, [], L3),
	append(L0, L1, F1),
	append(F1, L2, F2),
	append(F2, L3, F3),

	% Linha 1
	nth0(1, ToSimplify, BoardLine1),
	
	% Célula 0
	nth0(0, BoardLine1, Cell5),
	nth0(0, Cell5, P5),
	
	% Célula 1
	nth0(1, BoardLine1, Cell6),
	nth0(0, Cell6, P6),
	
	% Célula 2
	nth0(2, BoardLine1, Cell7),
	nth0(0, Cell7, P7),

	% Célula 3
	nth0(3, BoardLine1, Cell8),
	nth0(0, Cell8, P8),

    add(P5, [], L4),
    add(P6, [], L5),
    add(P7, [], L6),
    add(P8, [], L7),
	append(L4, L5, F4),
	append(F4, L6, F5),
	append(F5, L7, F6),

	% Linha 2
	nth0(2, ToSimplify, BoardLine2),
	
	% Célula 0
	nth0(0, BoardLine2, Cell9),
	nth0(0, Cell9, P9),
	
	% Célula 1
	nth0(1, BoardLine2, Cell10),
	nth0(0, Cell10, P10),
	
	% Célula 2
	nth0(2, BoardLine2, Cell11),
	nth0(0, Cell11, P11),

	% Célula 3
	nth0(3, BoardLine2, Cell12),
	nth0(0, Cell12, P12),

    add(P9, [], L8),
    add(P10, [], L9),
    add(P11, [], L10),
    add(P12, [], L11),
	append(L8, L9, F7),
	append(F7, L10, F8),
	append(F8, L11, F9),

	% Linha 3
	nth0(3, ToSimplify, BoardLine3),
	
	% Célula 0
	nth0(0, BoardLine3, Cell13),
	nth0(0, Cell13, P13),
	
	% Célula 1
	nth0(1, BoardLine3, Cell14),
	nth0(0, Cell14, P14),
	
	% Célula 2
	nth0(2, BoardLine3, Cell15),
	nth0(0, Cell15, P15),

	% Célula 3
	nth0(3, BoardLine3, Cell16),
	nth0(0, Cell16, P16),

    add(P13, [], L12),
    add(P14, [], L13),
    add(P15, [], L14),
    add(P16, [], L15),
	append(L12, L13, F10),
	append(F10, L14, F11),
	append(F11, L15, F12),

	% addicionar Linhas à Simplified
    % F3 F6 F9 F12
	
    add(F3, [], S0),
    add(F6, [], S1),
    add(F9, [], S2),
    add(F12, [], S3),
    append(S0, S1, Simplified1),
	append(Simplified1, S2, Simplified2),
	append(Simplified2, S3, Simplified).