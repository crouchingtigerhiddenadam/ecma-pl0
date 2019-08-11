# ECMA PL/0
JavaScript implementation of PL/0. Based on the PL/0 programming language from Algorithms + Data Structures = Programs by Niklaus Wirth.

## Example program
```
x := 1;  
if x = 1 then  
begin  
  i := 1 + 2 * 3 + 4;  
  echo i + 4  
end.  
```

| Token  | Description          |
| ------ | -------------------: |
| :=     | Assignment           |
| ;      | Seperate Expressions |
| .      | End Of Program       |

## EBNF-like Grammar
 
#### program (not implemented)
```
block "." .`
```
  
#### block (not implemented)
```
["const" ident "=" num {"," ident "=" num} ";"]  
["var" ident {"," ident} ";"]  
{"procedure" ident ";" block ";"} statement .  
```
  
#### statement (call and while/do to be implemented)
```
ident ":=" expression  
| "call" ident  
| "begin" statement {";" statement } "end"  
| "echo" expression
| "if" condition "then" statement  
| "while" condition "do" statement .  
```

#### condition (<= and >= to be implemented)
```
"odd" expression  
| expression ("="|"#"|"<"|"<="|">"|">=") expression .  
```

#### expression
```
term {("+"|"-") term} .  
```
  
#### term
```
factor {("*"|"/") factor} .  
```
  
#### factor
```
ident  
| number  
| "(" expression ")" .  
```
