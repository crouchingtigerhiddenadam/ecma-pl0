var index,
    register1,
    source,
    variables = []

function run() {
    // assert( 'run()' )
    source = document.getElementById( 'source' ).value
    index = 0
    statement()
}

document.getElementById( 'run' ).onclick = run
run()

function assert( message ) {
    document.getElementById( 'output' ).innerHTML += message + '<br>'
}

function assignment() {
    var start = index
    if ( identifier() ) {
        var label = register1
        if ( source[ index ] === ':' && source[ ++index ] === '=' ) {
            ++index
            if ( expression() ) {
                assert( label + ' <- ' + register1 )
                variables[ label ] = register1
                return true
            }
            throw 'expression expected after := ' + source.substr( index, 8 )
        }
    }
    index = start
    return false
}

function beginend() {
    var start = index
    if ( source[   index ] === 'b' && source[ ++index ] === 'e' &&
         source[ ++index ] === 'g' && source[ ++index ] === 'i' &&
         source[ ++index ] === 'n' ) {
        ++index
        if ( trivia() ) {
            if ( statement() ) {
                while ( source[ index ] === ';' ) {
                    ++index
                    if ( !statement() ) throw 'statement expected after ; ' + source.substr( index, 8 )
                }
                if ( trivia() ) {
                    if ( source[   index ] === 'e' && source[ ++index ] === 'n' && 
                         source[ ++index ] === 'd' ) {
                        ++index
                        return true
                    }
                }
            }
        }
        throw 'end expected ' + source.substr( index, 8 )
    }
    index = start
    return false
}

// TODO: missing conditions <=, >=
function condition() {
    // assert( 'condition()' )
    if ( expression() ) {
        var register2 = register1
        if ( source[ index ] === '=' ) {
            ++index
            if ( expression() ) {
                register1 = register2 === register1
                return true
            }
            throw 'unexpected token after = ' + source.substr( index, 8 )
        }
        else if ( source[ index ] === '#' ) {
            ++index
            if ( expression() ) {
                register1 = register2 !== register1
                return true
            }
            throw 'unexpected token after # ' + source.substr( index, 8 )
        }
        else if ( source[ index ] === '<' ) {
            ++index
            if ( expression() ) {
                register1 = register2 < register1
                return true
            }
            throw 'unexpected token after < ' + source.substr( index, 8 )
        }
        else if ( source[ index ] === '>' ) {
            ++index
            if ( expression() ) {
                register1 = register2 > register1
                return true
            }
            throw 'unexpected token after > ' + source.substr( index, 8 )
        }
    }
    throw 'unexpected token ' + source.substr( index, 8 )
}

function echo() {
    var start = index
    if ( source[   index ] === 'e' && source[ ++index] === 'c' &&
         source[ ++index ] === 'h' && source[ ++index] === 'o' ) {
        ++index
        if ( trivia() ) {
            if ( expression() ) {
                assert( register1 )
                return true
            }
        }
        throw 'expression expected after echo' + source.substr( index, 8 )
    }
    index = start
    return false
}

function expression() {
    // assert( 'expression()' )
    if ( term() ) {
        while ( source[ index ] === '+' || source[ index ] === '-' ) {
            var register2 = register1
            if ( source[ index ] === '+' ) {
                ++index
                if ( term() ) {
                    register1 = register2 + register1
                    return true
                }
                throw 'unexpected token after + ' + source.substr( index, 8 )
            }
            else if ( source[ index ] === '-' ) {
                ++index
                if ( term() ) {
                    register1 = register2 - register1
                    return true
                }
                throw 'unexpected token after -'
            }
        }
        return true
    }
    throw 'unexpected token ' + source.substr( index, 8 )
}

function factor() {
    // assert( 'factor()' )
    if ( source[ index ] === '(' ) {
        ++index
        if ( expression() ) {
            if ( source[ index ] === ')' ) {
                ++index
                return true
            }
            throw ') expected ' + source.substr( index, 8 )
        }
        throw 'unexpected token ' + source.substr( index, 8 )
    }
    else if ( identifier() ) {
        var label = register1
        register1 = variables[ register1 ] // TODO: add check to see if variable was evern declared
        assert( label + ' -> ' + register1 )
        return true
    }
    else if ( number() ) {
        return true
    }
    throw 'unexpected token ' + source.substr( index, 8 )
}

function identifier() {
    // assert( 'identifier()' )
    var start = index
    if ( source[ index ] >= 'A' && source[ index ] <= 'Z' ||
         source[ index ] >= 'a' && source[ index ] <= 'z' ) {
        start = index
        ++index
        while ( source[ index ] >= 'A' && source[ index ] <= 'Z' ||
                source[ index ] >= 'a' && source[ index ] <= 'z' ) {
            ++index
        }
        register1 = source.substring( start, index )
        return true
    }
    index = start
    return false
}

function ifthen() {
    // assert( 'ifthen()' )
    var start = index
    if ( source[ index ] === 'i' && source[ ++index ] === 'f' ) {
        ++index
        if ( trivia() ) {
            if ( condition() ) {
                if ( trivia() ) {
                    if ( source[   index ] === 't' && source[ ++index ] === 'h' &&
                         source[ ++index ] === 'e' && source[ ++index ] === 'n' ) {
                        ++index
                        if ( trivia() ) {
                            if ( statement() ) {
                                return true
                            }
                        }
                        throw 'statement expected after then' + source.substr( index, 8 )
                    }
                }
                throw 'then expected after condition ' + source.substr( index, 8 )
            }
            throw 'condition expected after if ' + source.substr( index, 8 )
        }
    }
    index = start
    return false
}

function number() {
    // assert( 'number()' )
    var start = index
    if ( source[ index ] >= '0' && source[ index ] <= '9' ) {
        ++index
        while ( source[ index ] >= '0' && source[ index ] <= '9' ) ++index
        register1 = parseInt( source.substring(start, index) )
        return true
    }
    index = start
    return false
}

function statement() {
    // assert( 'statement()' )
    if ( assignment() ) {
        return true
    }
    else if ( beginend() ) {
        return true
    }
    else if ( echo() ) {
        return true
    }
    else if ( ifthen() ) {
        return true
    }
    else {
        return expression()
    }
}

function term() {
    // assert( 'term()' )
    if ( factor() ) {
        while ( source[ index ] === '*' || source[ index ] === '/' ) {
            var register2 = register1
            if ( source[ index ] === '*' ) {
                ++index
                if ( factor() ) {
                    register1 = register2 * register1
                    return true
                }
                throw 'unexpected token after * ' + source.substr( index, 8 )
            }
            else if ( source[ index ] === '/' ) {
                ++index
                if ( factor() ) {
                    register1 = register2 / register1
                    return true
                }
                throw 'unexpected token after / ' + source.substr( index, 8 )
            }
        }
        return true
    }
    throw 'unexpected token ' + source.substr( index, 8 )
}

function trivia() {
    // assert( 'trivia()' )
    if ( source[ index ] === ' '  || source === '\t' ||
         source[ index ] === '\r' || source[ index ] === '\n') {
        ++index
        while ( source[ index ] === ' '  || source === '\t' ||
                source[ index ] === '\r' || source[ index ] === '\n') ++index
        return true
    }
    return false
}

function whiledo() {
    // assert( 'whiledo()' )
    var start = index
    if ( source[   index ] === 'w' && source[ ++index ] === 'h' &&
         source[ ++index ] === 'i' && source[ ++index ] === 'l' &&
         source[ ++index ] === 'e' ) {
        ++index
        if ( trivia() ) {
            start = index // <-- reset pointer
            if ( condition() ) {
                if ( trivia() ) {
                    if ( source[ index ] === 'd' && source[ ++index ] === 'o' ) {
                        ++index
                        if ( trivia() ) {
                            return true
                        }
                    }
                }
                throw 'do expected ' + source.substr( index, 8 )
            }
            throw 'condition expected ' + source.substr( index, 8 )
        }
    }
    index = start
    return false
}