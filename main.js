var index,
    register1,
    source,
    variables = []

function run() {
    source = document.getElementById( 'source' ).value
    index = 0
    try {
        statement( true )
    }
    catch ( exception ) {
        assert( exception )
    }
}

document.getElementById( 'run' ).onclick = run
run()

function assert( message ) {
    document.getElementById( 'output' ).innerHTML += message + '<br>'
}

function assignment( evaluate ) {
    // assert( 'assignment( ' + evaluate + ' )' )
    var label, start = index
    trivia()
    if ( identifier( evaluate ) ) {
        label = register1
        trivia()
        if ( source[ index ] === ':' && source[ ++index ] === '=' ) {
            ++index
            trivia()
            if ( expression( evaluate ) ) {
                if ( evaluate ) variables[ label ] = register1
                return true
            }
            throw 'expression expected after :='
        }
    }
    index = start
    return false
}

function beginend( evaluate ) {
    // assert( 'beginend( ' + evaluate + ' )' )
    var start = index
    if ( source[   index ] === 'b' && source[ ++index ] === 'e' &&
         source[ ++index ] === 'g' && source[ ++index ] === 'i' &&
         source[ ++index ] === 'n' ) {
        ++index
        if ( trivia() ) {
            if ( statement( evaluate ) ) {
                for ( ;; ) {
                    trivia()
                    if ( source[ index ] === ';' ) {
                        ++index
                        trivia()
                        if ( !statement( evaluate ) ) throw 'statement expected after ;'
                    }
                    else break
                }
                if ( source[   index ] === 'e' && source[ ++index ] === 'n' && 
                     source[ ++index ] === 'd' ) {
                    ++index
                    return true
                }
            }
        }
        throw 'end or ; expected'
    }
    index = start
    return false
}

// TODO: missing conditions <=, >=
function condition( evaluate ) {
    // assert( 'condition( ' + evaluate + ' )' )
    var register2
    trivia()
    if ( expression( evaluate ) ) {
        trivia()
        register2 = register1
        if ( source[ index ] === '=' ) {
            ++index
            trivia()
            if ( expression( evaluate ) ) {
                if ( evaluate ) register1 = register2 === register1
                return true
            }
            throw 'unexpected token after ='
        }
        else if ( source[ index ] === '#' ) {
            ++index
            trivia()
            if ( expression( evaluate ) ) {
                if ( evalulate ) register1 = register2 !== register1
                return true
            }
            throw 'unexpected token after #'
        }
        else if ( source[ index ] === '<' ) {
            ++index
            trivia()
            if ( expression( evaluate ) ) {
                if ( evalulate ) register1 = register2 < register1
                return true
            }
            throw 'unexpected token after <'
        }
        else if ( source[ index ] === '>' ) {
            ++index
            trivia()
            if ( expression( evaluate ) ) {
                if ( evalulate ) register1 = register2 > register1
                return true
            }
            throw 'unexpected token after >'
        }
    }
    throw 'unexpected token'
}

function echo( evaluate ) {
    // assert( 'echo( ' + evaluate + ' )' )
    var start = index
    if ( source[   index ] === 'e' && source[ ++index] === 'c' &&
         source[ ++index ] === 'h' && source[ ++index] === 'o' ) {
        ++index
        if ( trivia() ) {
            if ( expression( evaluate ) ) {
                if ( evaluate ) assert( register1 )
                return true
            }
        }
        throw 'expression expected after echo'
    }
    index = start
    return false
}

function expression( evaluate ) {
    // assert( 'expression( ' + evaluate + ' )' )
    var register2
    trivia()
    if ( term( evaluate ) ) {
        for ( ;; ) {
            if ( source[ index ] === '+' ) {
                ++index
                register2 = register1
                trivia()
                if ( term( evaluate ) ) {
                    if ( evaluate ) register1 = register2 + register1
                    continue
                }
                throw 'unexpected token after +'
            }
            else if ( source[ index ] === '-' ) {
                ++index
                register2 = register1
                trivia()
                if ( term( evaluate ) ) {
                    if ( evaluate ) register1 = register2 - register1
                    continue
                }
                throw 'unexpected token after -'
            }
            else break
        }
        return true
    }
    throw 'unexpected token'
}

function factor( evaluate ) {
    // assert( 'factor(' + evaluate + ')' )
    var label
    if ( source[ index ] === '(' ) {
        ++index
        if ( expression( evaluate ) ) {
            if ( source[ index ] === ')' ) {
                ++index
                return true
            }
            throw ') expected'
        }
        throw 'unexpected token'
    }
    else if ( identifier( evaluate ) ) {
        if ( evaluate ) register1 = variables[ register1 ] // TODO: add check to see if variable was evern declared
        return true
    }
    else if ( number( evaluate ) ) return true
    throw 'unexpected token'
}

function identifier( evaluate ) {
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
        if ( evaluate ) register1 = source.substring( start, index )
        return true
    }
    index = start
    return false
}

function ifthen( evaluate ) {
    // assert( 'ifthen( ' + evaluate + ' )' )
    var start = index
    if ( source[ index ] === 'i' && source[ ++index ] === 'f' ) {
        ++index
        if ( trivia() ) {
            if ( condition( evaluate ) ) {
                if ( source[   index ] === 't' && source[ ++index ] === 'h' &&
                     source[ ++index ] === 'e' && source[ ++index ] === 'n' ) {
                    ++index
                    if ( trivia() ) {
                        if ( statement( register1 ) ) {
                            return true
                        }
                    }
                    throw 'statement expected after then'
                }
                throw 'then expected after condition'
            }
            throw 'condition expected after if'
        }
    }
    index = start
    return false
}

function number( evaluate ) {
    // assert( 'number()' )
    var start = index
    while ( source[ index ] >= '0' && source[ index ] <= '9' ) ++index
    if ( source[ index ] === '.' ) {
        ++index
        if ( source[ index ] >= '0' && source[ index ] <= '9' ) {
            ++index
            while ( source[ index ] >= '0' && source[ index ] <= '9' ) ++index
        }
        else throw 'digits expected after decimal point'
    }
    if ( start < index ) {
        if ( evaluate ) register1 = parseFloat( source.substring( start, index ) )
        return true
    }
    return false
}

function procedure() {
    var start = index
    if ( source[   index ] === 'p' && source[ ++index ] === 'r' &&
         source[ ++index ] === 'o' && source[ ++index ] === 'c' &&
         source[ ++index ] === 'e' && source[ ++index ] === 'd' &&
         source[ ++index ] === 'u' && source[ ++index ] === 'r' &&
         source[ ++index ] === 'e' ) {
        //
    }
}

function statement( evaluate ) {
    // assert( 'statement( ' + evaluate + ' )' )
    if      ( assignment( evaluate ) )   return true
    else if ( beginend( evaluate ) )     return true
    else if ( echo( evaluate ) )         return true
    else if ( ifthen( evaluate ) )       return true
    else if ( expression( evaluate ) )   return true
    throw 'unexpected token'
}

function term( evaluate ) {
    // assert( 'term( ' + evaluate + ' )' )
    var register2
    trivia()
    if ( factor( evaluate ) ) {
        for ( ;; ) {
            trivia()
            if ( source[ index ] === '*' ) {
                ++index
                register2 = register1
                trivia()
                if ( factor( evaluate ) ) {
                    if ( evaluate ) register1 = register2 * register1
                    continue
                }
                throw 'unexpected token after *'
            }
            else if ( source[ index ] === '/' ) {
                ++index
                register2 = register1
                trivia()
                if ( factor( evaluate ) ) {
                    if ( evaluate ) register1 = register2 / register1
                    continue
                }
                throw 'unexpected token after /'
            }
            else break
        }
        return true
    }
    throw 'unexpected token'
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

function whiledo( evaluate ) {
    // assert( 'whiledo(' + evaluate ')' )
    var start = index
    if ( source[   index ] === 'w' && source[ ++index ] === 'h' &&
         source[ ++index ] === 'i' && source[ ++index ] === 'l' &&
         source[ ++index ] === 'e' ) {
        ++index
        if ( trivia() ) {
            start = index // <-- reset pointer
            if ( condition( evaluate ) ) {
                if ( trivia() ) {
                    if ( source[ index ] === 'd' && source[ ++index ] === 'o' ) {
                        ++index
                        if ( trivia() ) {
                            return true
                        }
                    }
                }
                throw 'do expected'
            }
            throw 'condition expected'
        }
    }
    index = start
    return false
}