% The without_last predicate is based on
% https://stackoverflow.com/questions/16174681/how-to-delete-the-last-element-from-a-list-in-prolog
without_last([_], []).
without_last([X|Xs], [X|WithoutLast]) :- 
    without_last(Xs, WithoutLast).

add(X,List,[X|List]).

final_add(X,List,[List|X]).

myreplace([_|Tail], New, Piece) :- append([], [Piece|Tail], New). 

adjacent(C, L1, C, L2) :- L1+1 =:= L2.
adjacent(C, L1, C, L2) :- L1-1 =:= L2.
adjacent(C1, L, C2, L) :- C1+1 =:= C2.
adjacent(C1, L, C2, L) :- C1-1 =:= C2.

replace(I, L, E, K) :-
  nth0(I, L, _, R),
  nth0(I, K, E, R).