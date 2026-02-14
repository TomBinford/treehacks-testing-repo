exception ImplementMe

(* Problem 2 *)  
  
(* Type t represents abstract syntax trees for the lambda calculus.  A
variable name is represented as an OCaml string.

Example: the term ((function x -> x x) (function x -> x)) would be represented as follows:

   FunCall(Function("x", FunCall(Var "x", Var "x")), Function("x", Var "x"))

*)

(* We also include the constant True, which is a value, to make testing easier. *)
type t = True | Var of string | Function of string * t | FunCall of t * t
	
(* 2a: Implement the subst function below, which substitutes a given
   value v for all free occurrences of the variable named x in term t,
   returning the resulting term. You may assume that v has no free
   variables. *)

let rec subst (x:string) (v:t) (t:t) = raise ImplementMe


  
(* 2b: Implement the step function, which takes a term of type t above
and produces a new term that results from taking one step of
computation on t, following the operational semantics rules for the 
lambda calculus.  If t is a normal form, the step function should
raise the NormalForm exception declared below. *)

exception NormalForm  

let rec step t = raise ImplementMe
