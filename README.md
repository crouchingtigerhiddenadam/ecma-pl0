# ECMA PL/0
JavaScript implementation of PL/0. Based on the PL/0 programming language from Algorithms + Data Structures = Programs by Niklaus Wirth.

## Roadmap
Functionally complete. New documentation and testing underway.  

## Example program
```
const z = 1;
var x, y;
x := z + 2;
procedure sub1
begin
    ! z + x
end;
if odd x then
begin
    ! 1 + 2 * 3 + 4;
    call sub1
end;
y := -10;
while y # 10 do
begin
    y := y + 2;
    ! y
end.
```

| Token  | Description          |
| :----: | -------------------: |
| :=     | Assignment           |
| !      | Echo                 |
| =      | Equals               |
| #      | Not Equal            |
| ;      | Seperate Expressions |
| .      | End Of Program       |
| +      | Plus                 |
| -      | Minus                |
| *      | Multiply             |
| /      | Divide               |

## EBNF-like Grammar
 
#### program 
```
block "." .`
```
  
#### block (const and var to be implemented)
```
["const" identifier "=" number {"," ident "=" number} ";"]  
["var" identifier {"," identifier} ";"]  
{"procedure" identifier ";" block ";"} statement .  
```
  
#### statement
```
identifier ":=" expression  
| "call" identifier  
| "begin" statement {";" statement } "end"  
| "echo" expression
| "if" condition "then" statement  
| "while" condition "do" statement .  
```

#### condition
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
identifier  
| number  
| "(" expression ")" .  
```
