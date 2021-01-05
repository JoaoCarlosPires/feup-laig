/* START CELL */
getInputPlay(Col, Lin) :-
	write('Getting start cell\n'),
	skip_line,
	getColumn(Col),
	getLine(Lin).

/* END CELL */
getFInputPlay(FCol, FLin) :-
	write('Getting end cell\n'),
	getColumn(FCol),
	getLine(FLin).

getLine(Lin) :-
	write('Please specify line '),
	get_code(Li),
	skip_line,
	validateLine(Li, Lin).

getColumn(Col) :- 
	write('Please specify column '), 
	get_code(Co),
	skip_line,
	validateColumn(Co, Col).

validateColumn(65, Col) :- Col is 0.
validateColumn(66, Col) :- Col is 1.
validateColumn(67, Col) :- Col is 2.
validateColumn(68, Col) :- Col is 3.
validateColumn(_, Col) :- write('Invalid column letter\n\n'), getColumn(Col).

validateLine(48, Lin) :- Lin is 0.
validateLine(49, Lin) :- Lin is 1.
validateLine(50, Lin) :- Lin is 2.
validateLine(51, Lin) :- Lin is 3.
validateLine(_, Lin) :- write('Invalid line number\n\n'), getLine(Lin).

