#!/usr/bin/env escript
-module(fac).
-export([main/1]).

main([X]) ->
  I = list_to_integer(X),
  N = fac(I),
  io:format("~w",[N]).
fac(1) -> 
  1;
fac(I) ->
  I * fac(I-1).
