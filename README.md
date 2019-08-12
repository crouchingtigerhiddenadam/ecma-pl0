# ECMA PL/0
JavaScript implementation of PL/0. Based on the PL/0 programming language from Algorithms + Data Structures = Programs by Niklaus Wirth.

## Notes
The `const` and `var` statements are currently not implemented or required.
The `echo` statement replaces the original `!` statement, though `!` can still be used.

## Example program
```
x := 1;
procedure pr
begin
    echo 42 + 21 + x
end;
if odd x then
begin
    i := 1 + 2 * 3 + 4;
    echo i+4;
    call pr
end
. 
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
