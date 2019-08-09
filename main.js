var index,
    label,
    register1,
    source,
    variables = []

document.getElementById( 'source' ).onkeyup = function( e ) {
    try {
        clear()
        index = 0
        source = document.getElementById( 'source' ).value
        statement();
        assert( register1 + ' was the final result' )
    }
    catch ( exception ) {
        assert( 'Error: ' + exception )
    }
}

// Display any messages along the way
function assert( message ) {
    document.getElementById( 'output' ).innerHTML += message + '<br>'
}

function clear() {
    document.getElementById( 'output' ).innerHTML = ''
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
    var start = index 
    trivia()
    assert( 'statement() called ' + source[ index ] )
    if ( source[   index ] === 'b' && source[ ++index ] === 'e' &&
         source[ ++index ] === 'g' && source[ ++index ] === 'i' &&
         source[ ++index ] === 'n' ) {
        ++index
        assert( 'begin has parsed ')
        if ( statement() ) {
            assert( 'statement has parsed ')
            while ( source[ index ] === ';' ) {
                ++index
                assert( 'seperator has been parsed ')
                if ( statement() ) {
                    //
                }
                else throw 'Statement expected [ BLOCK ]'
            }
        }
        trivia()
        if ( source[   index ] === 'e' && source[ ++index ] === 'n' && 
             source[ ++index ] === 'd' ) {
            trivia()
            return true
        }
        else throw 'End expected [ BEGIN ] ' + source.substr( index )
    }
    else if ( source[   index ] === 'c' && source[ ++index ] === 'a' &&
              source[ ++index ] === 'l' && source[ ++index ] === 'l' ) {
        //
    }
    else if ( source[ index ] === 'i' && source[ ++index ] === 'f' ) {
        ++index
        if ( condition() ) {
            if ( source[   index ] === 't' && source[ ++index ] === 'h' &&
                 source[ ++index ] === 'e' && source[ ++index ] === 'n' ) {
                ++index
                if ( statement() ) {
                    trivia()
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
    index = start
    if ( identifier() ) {
        // 
        if ( source[ index ] === ':' && source[ ++index ] === '=' ) {
            //
            ++index
            if ( expression() ) {
                //
                assert( label + ' will be assigned ' + register1 )
                variables[ label ] = register1
                return true
            }
            else throw 'Expression expected [ ASSIGN ]'
        }
    }
}

// Conditions (under development, current work)
function condition() {
    trivia()
    assert( 'condition() called ' + source[ index ] )
    if ( source[   index ] === 'o' && source[ ++index ] === 'd' &&
         source[ ++index ] === 'd' ) {
        register1 = register2 % 2 != 0
        trivia()
        return true
    }
    else if ( expression() ) {
        var register2 = register1
        if ( source[ index ] === '=' ) {
            ++index
            if ( expression() ) {
                assert( register2 + ' = ' + register1 + ' to be evaluated' )
                register1 = register2 === register1
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
            if ( source[ index ] === '=' ) {
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
                else throw 'Unexpected token [ PLUS ]'
            }
            else if ( source[ index ] === '-' ) {
                ++index
                if ( term() ) {
                    assert( register2 + ' + ' + register1 + ' to be evaluated' )
                    register1 = register2 - register1
                }
                else throw 'Unexpected token [ MINUS ]'
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
                else throw 'Unexpected token [ MULTIPLY ]'
            }
            else if ( source[ index ] === '/' ) {
                ++index
                if ( factor() ) {
                    assert( register2 + ' / ' + register1 + ' to be evaluated' )
                    register1 = register2 / register1
                }
                else throw 'Unexpected token [ DIVIDE ]'
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
    else if ( identifier() ) {
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
        assert( register1 + ' parsed as a number' )
        trivia()
        return true
    }
    else return false
}

// Parse an identifier (not used)
function identifier() {
    var start = index
    trivia()
    if ( source[ index ] >= 'A' && source[ index ] <= 'Z' ||
         source[ index ] >= 'a' && source[ index ] <= 'z' ) {
        start = index
        ++index
        while ( source[ index ] >= 'A' && source[ index ] <= 'Z' ||
                source[ index ] >= 'a' && source[ index ] <= 'z' ) {
            ++index
        }
        label = source.substring( start, index )
        register1 = variables[ label ]
        assert( label + ' was parsed as an identifier ' + start + ', ' + index  )
        trivia()
        return true
    }
    else {
        return false
    }
}

// Skip the trivia (spaces)
function trivia() {
    if ( source[ index ] === ' ' || source[ index ] === '\r' ||
         source[ index ] === '\n' ) {
        ++index
        while ( source[ index ] === ' ' || source[ index ] === '\r' ||
                source[ index ] === '\n' ) {
            ++index
        }
        // assert( 'trivia() called ' + source[ index ] )
        return true
    }
    else return false
}