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

// Add or subtract two terms
function expression() {
    var register2
    trivia()
    if ( term() ) {
        while ( source[index] === '+' || source[index] === '-' ) {
            register2 = register1
            if ( source[index] === '+' ) {
                ++index
                if ( term() ) {
                    assert( register2 + ' + ' + register1 + ' to be evaluated' )
                    register1 = register2 + register1
                }
                else throw 'Unexpected token [EXPRESSION PLUS]'
            }
            else if ( source[index] === '-' ) {
                ++index
                if ( term() ) {
                    assert( register2 + ' + ' + register1 + ' to be evaluated' )
                    register1 = register2 - register1
                }
                else throw 'Unexpected token [EXPRESSION MINUS]'
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
        while ( source[index] === '*' || source[index] === '/' ) {
            register2 = register1
            if ( source[index] === '*' ) {
                ++index
                if ( factor() ) {
                    assert( register2 + ' * ' + register1 + ' to be evaluated' )
                    register1 = register2 * register1
                }
                else throw 'Unexpected token [TERM MULTIPLY]'
            }
            else if ( source[index] === '/' ) {
                ++index
                if ( factor() ) {
                    assert( register2 + ' / ' + register1 + ' to be evaluated' )
                    register1 = register2 / register1
                }
                else throw 'Unexpected token [TERM DIVIDE]'
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
    if ( source[index] === '(' ) {
        ++index
        if ( expression() ) {
            if ( source[index] === ')' ) {
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
    if ( source[index] >= '0' && source[index] <= '9' ) {
        start = index
        ++index
        while ( source[index] >= '0' && source[index] <= '9' ) {
            ++index
        }
        register1 = parseInt( source.substr(start, index) )
        assert(register1 + ' parsed as number')
        trivia()
        return true
    }
    else return false
}

// Skip the trivia (spaces)
function trivia() {
    if ( source[index] === ' ' ) {
        ++index
        while ( source[index] === ' ' ) {
            ++index
        }
        return true
    }
    else return false
}