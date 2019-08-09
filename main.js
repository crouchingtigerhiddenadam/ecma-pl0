var index = 0,
    register1,
    start,
    source = '1 + ( 2 * 3 ) + 4'

try {
    expression();
    assert( register1 + ' was the final result' )
}
catch ( exception ) {
    assert( 'Error: ' + exception )
}

// Display any messages along the way
function assert( message ) {
    document.getElementById( 'output' ).innerText += message + '\r\n'
    console.log( message )
}


// Block (under development)
function block() {
    if ( source[   index ] === 'c' && source[ ++index ] === 'o' &&
         source[ ++index ] === 'n' && source[ ++index ] === 's' &&
         source[ ++index ] === 't' ) {
        // 
    }
    else if ( source[   index ] === 'p' && source[ ++index ] === 'r' &&
              source[ ++index ] === 'o' && source[ ++index ] === 'c' &&
              source[ ++index ] === 'e' && source[ ++index ] === 'd' &&
              source[ ++index ] === 'u' && source[ ++index ] === 'r' &&
              source[ ++index ] === 'e' ) {
        // 
    }
    else if ( source[   index ] === 'v' && source[ ++index ] === 'a' &&
              source[ ++index ] === 'r' ) {
        // 
    }
}

// Statements (under development, current work)
function statement() {
    if ( source[   index ] === 'b' && source[ ++index ] === 'e' &&
         source[ ++index ] === 'g' && source[ ++index ] === 'i' &&
         source[ ++index ] === 'n' ) {
        // 
    }
    else if ( source[   index ] === 'c' && source[ ++index ] === 'a' &&
              source[ ++index ] === 'l' && source[ ++index ] === 'l' ) {
        //
    }
    else if ( source[   index ] === 'i' && source[ ++index ] === 'f' ) {
        if ( condition() ) {
            if ( source[   index ] === 't' && source[ ++index ] === 'h' &&
                 source[ ++index ] === 'e' && source[ ++index ] === 'n' ) {
                if ( statement() ) {
                    return true
                }
                else throw 'Statement expected [ THEN ]'
            }
            else throw 'Then expected [ IF ]'
        }
        else throw 'Condition expected [ IF ]'
    }
    else if ( source[   index ] === 'w' && source[ ++index ] === 'h' &&
              source[ ++index ] === 'i' && source[ ++index ] === 'l' &&
              source[ ++index ] === 'e' ) {
        //
    }
}

// Conditions (under development, current work)
function condition() {
    var register2 = register1
    trivia()
    if ( source[   index ] === 'o' && source[ ++index ] === 'd' &&
         source[ ++index ] === 'd' ) {
        register1 = register2 % 2 != 0
        trivia()
        return true
    }
    else if ( expression() ) {
        if ( source[ index ] === '=' ) {
            ++index
            if ( expression() ) {
                assert( register2 + ' = ' + register1 + ' to be evaluated' )
                register1 = register2 == register1
            }
            else throw 'Unexpected token [ EQUAL ]'
        }
        else if ( source[ index ] === '#' ) {
            ++index
            if ( expression() ) {
                assert( register2 + ' # ' + register1 + ' to be evaluated' )
                register1 = register2 != register1
            }
            else throw 'Unexpected token [ NOT EQUAL ]'
        }
        else if ( source[ index ] === '<' ) {
            ++index
            if ( source[  index ] === '=' ) {
                ++index
                if ( expression() ) {
                    assert( register2 + ' <= ' + register1 + ' to be evaluated' )
                    register1 = register2 <= register1
                }
                else throw 'Unexpected token [ LESS THAN OR EQUAL ]'
            }
            else {
                if ( expression() ) {
                    assert( register2 + ' < ' + register1 + ' to be evaluated' )
                    register1 = register2 < register1
                }
                else throw 'Unexpected token [ LESS THAN ]'
            }
        }
        else if ( source[ index ] === '>' ) {
            ++index
            if ( source[  index ] === '=' ) {
                ++index
                if ( expression() ) {
                    assert( register2 + ' >= ' + register1 + ' to be evaluated' )
                    register1 = register2 >= register1
                }
                else throw 'Unexpected token [ GREATER THAN OR EQUAL ]'
            }
            else {
                if ( expression() ) {
                    assert( register2 + ' > ' + register1 + ' to be evaluated' )
                    register1 = register2 > register1
                }
                else throw 'Unexpected token [ GREATER THAN ]'
            }
        }
        trivia()
        return true
    }
    return false
}

// Add or subtract two terms
function expression() {
    var register2
    trivia()
    if ( term() ) {
        while ( source[ index ] === '+' || source[ index ] === '-' ) {
            register2 = register1
            if ( source[ index ] === '+' ) {
                ++index
                if ( term() ) {
                    assert( register2 + ' + ' + register1 + ' to be evaluated' )
                    register1 = register2 + register1
                }
                else throw 'Unexpected token [ EXPRESSION PLUS ]'
            }
            else if ( source[ index ] === '-' ) {
                ++index
                if ( term() ) {
                    assert( register2 + ' + ' + register1 + ' to be evaluated' )
                    register1 = register2 - register1
                }
                else throw 'Unexpected token [ EXPRESSION MINUS ]'
            }
        }
        trivia()
        return true
    }
    else return false
}

// Multiply or divide two factors
function term() {
    var register2
    trivia()
    if ( factor() ) {
        while ( source[ index ] === '*' || source[ index ] === '/' ) {
            register2 = register1
            if ( source[ index ] === '*' ) {
                ++index
                if ( factor() ) {
                    assert( register2 + ' * ' + register1 + ' to be evaluated' )
                    register1 = register2 * register1
                }
                else throw 'Unexpected token [ TERM MULTIPLY ]'
            }
            else if ( source[ index ] === '/' ) {
                ++index
                if ( factor() ) {
                    assert( register2 + ' / ' + register1 + ' to be evaluated' )
                    register1 = register2 / register1
                }
                else throw 'Unexpected token [ TERM DIVIDE ]'
            }
        }
        trivia()
        return true
    }
    else return false
}

// An expression in paranthesis or a number
function factor() {
    var register2
    trivia()
    if ( source[ index ] === '(' ) {
        ++index
        if ( expression() ) {
            if ( source[ index ] === ')' ) {
                ++index
                trivia()
                return true
            }
            else throw 'Close paranthesis expected'
        }
        else throw 'Unexpected token'
    }
    else if ( number() ) {
        trivia()
        return true
    }
}

// Parse an integer
function number() {
    trivia()
    if ( source[ index ] >= '0' && source[ index ] <= '9' ) {
        start = index
        ++index
        while ( source[ index ] >= '0' && source[ index ] <= '9' ) {
            ++index
        }
        register1 = parseInt( source.substr(start, index) )
        assert(register1 + ' parsed as number')
        trivia()
        return true
    }
    else return false
}

// Parse an identifier (not used)
function identifier() {
    trivia()
    if ( source[ index ] >= 'A' && source[ index ] <= 'Z' ||
         source[ index ] >= 'a' && source[ index ] <= 'z' ) {
        start = index
        ++index
        while ( source[ index ] >= 'A' && source[ index ] <= 'Z' ||
                source[ index ] >= 'a' && source[ index ] <= 'z' ) {
            ++index
        }
        return true
    }
    else {
        return false
    }
}

// Skip the trivia (spaces)
function trivia() {
    if ( source[ index ] === ' ' ) {
        ++index
        while ( source[ index ] === ' ' ) {
            ++index
        }
        return true
    }
    else return false
}