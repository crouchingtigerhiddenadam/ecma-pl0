var heap = [],
    index,
    source,
    start

function run() {
    source = document.getElementById( 'source' ).value
    index = 0
    clear()
    try {
        program()
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

function clear() {
    document.getElementById( 'output' ).innerHTML = ''
}

function program() {
    trivia()
    statement( true )
    for ( ;; ) {
        trivia()
        if ( source[ index ] === ';' ) {
            ++index
            statement( true )
        }
        else break
    }
    if ( source[ index ] === '.' ) {
        ++index
        trivia()
        if ( source[ index ] === undefined ) return
    }
    throw 'end of program expected'
}

function procedure() {
    // assert( 'procedure()' )
    var start = index
    if ( source[   index ] === 'p' && source[ ++index ] === 'r' &&
         source[ ++index ] === 'o' && source[ ++index ] === 'c' &&
         source[ ++index ] === 'e' && source[ ++index ] === 'd' &&
         source[ ++index ] === 'u' && source[ ++index ] === 'r' &&
         source[ ++index ] === 'e' ) {
        ++index
        if ( trivia() ) {
            if ( identity() ) {
                heap[ source.substring( start, index ) ] = index
                return true
            }
        }
    }
    index = start
    return false
}

function statement( evaluate ) {
    // assert( 'statement( ' + evaluate + ' )' )
    trivia()
    if      ( assignment( evaluate ) )  return
    else if ( beginend( evaluate ) )    return
    else if ( echo( evaluate ) )        return
    else if ( ifthen( evaluate ) )      return
    throw 'Unexpected token'
}

function assignment( evaluate ) {
    // assert( 'assignment( ' + evaluate + ' )' )
    var label, reset = index, result
    if ( identifier( evaluate ) ) {
        label = source.substring( start, index )
        trivia()
        if ( source[ index ] === ':' && source[ ++index ] === '=' ) {
            ++index
            trivia()
            result = expression( evaluate )
            if ( evaluate ) heap[ label ] = result
            return true
        }
    }
    index = reset
    return false
}

function beginend( evaluate ) {
    // assert( 'beginend( ' + evaluate + ' )' )
    var reset = index
    if ( source[   index ] === 'b' && source[ ++index ] === 'e' &&
         source[ ++index ] === 'g' && source[ ++index ] === 'i' &&
         source[ ++index ] === 'n' ) {
        ++index
        if ( trivia() ) {
            statement( evaluate )
            for ( ;; ) {
                trivia()
                if ( source[ index ] === ';' ) {
                    ++index
                    statement( evaluate )
                }
                else break
            }
            if ( source[   index ] === 'e' && source[ ++index ] === 'n' && 
                 source[ ++index ] === 'd' ) {
                ++index
                return true
            }
        }
        throw 'end or ; expected'
    }
    index = reset
    return false
}

function echo( evaluate ) {
    // assert( 'echo( ' + evaluate + ' )' )
    var reset = index, result
    if ( source[   index ] === 'e' && source[ ++index ] === 'c' &&
         source[ ++index ] === 'h' && source[ ++index ] === 'o' ) {
        ++index
        if ( trivia() ) {
            result = expression( evaluate )
            if ( evaluate ) assert( result )
            return true
        }
        throw 'expression expected after echo'
    }
    index = reset
    return false
}

function ifthen( evaluate ) {
    // assert( 'ifthen( ' + evaluate + ' )' )
    var reset = index, result
    if ( source[ index ] === 'i' && source[ ++index ] === 'f' ) {
        ++index
        if ( trivia() ) {
            result = condition( evaluate )
            if ( source[   index ] === 't' && source[ ++index ] === 'h' &&
                 source[ ++index ] === 'e' && source[ ++index ] === 'n' ) {
                ++index
                if ( trivia() ) {
                    statement( result )
                    return true
                }
                throw 'statement expected after then'
            }
            throw 'then expected after condition'
        }
    }
    index = reset
    return false
}

function whiledo( evaluate ) {
    // assert( 'whiledo(' + evaluate + ')' )
    var reset = index
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
    index = reset
    return false
}

// TODO: missing conditions <=, >=
function condition( evaluate ) {
    // assert( 'condition( ' + evaluate + ' )' )
    var result, operand
    result = expression( evaluate )
    if ( source[ index ] === '=' ) {
        ++index
        operand = expression( evaluate )
        if ( evaluate ) return result === operand
    }
    else if ( source[ index ] === '#' ) {
        ++index
        operand = expression( evaluate )
        if ( evaluate ) return result === operand
    }
    else if ( source[ index ] === '<' ) {
        ++index
        operand = expression( evaluate )
        if ( evalulate ) return result < operand
    }
    else if ( source[ index ] === '>' ) {
        ++index
        operand = expression( evaluate )
        if ( evalulate ) return result > operand
    }
    throw 'unexpected token'
}

function expression( evaluate ) {
    // assert( 'expression( ' + evaluate + ' )' )
    var result, operand
    result = term( evaluate )
    for ( ;; ) {
        if ( source[ index ] === '+' ) {
            ++index
            operand = term( evaluate )
            if ( evaluate ) result += operand
            continue
        }
        else if ( source[ index ] === '-' ) {
            ++index
            operand = term( evaluate )
            if ( evaluate ) result -= operand
            continue
        }
        else break
    }
    return result
}

function term( evaluate ) {
    // assert( 'term( ' + evaluate + ' )' )
    var result, operand
    result = factor( evaluate )
    for ( ;; ) {
        trivia()
        if ( source[ index ] === '*' ) {
            ++index
            trivia()
            operand = factor( evaluate )
            if ( evaluate ) result *= operand
            continue
        }
        else if ( source[ index ] === '/' ) {
            ++index
            trivia()
            operand = factor( evaluate )
            if ( evaluate ) result /= operand
            continue
        }
        else break
    }
    return result
}

function factor( evaluate ) {
    // assert( 'factor(' + evaluate + ')' )
    var result
    trivia()
    if ( source[ index ] === '(' ) {
        ++index
        if ( result = expression( evaluate ) ) {
            trivia()
            if ( source[ index ] === ')' ) {
                ++index
                return result
            }
            throw ') expected'
        }
        throw 'unexpected token'
    }
    else if ( number() ) {
        return parseFloat( source.substring( start, index ) )
    }
    else if ( identifier() ) {
        return heap[ source.substring( start, index ) ] 
    }
    throw 'unexpected token'
}

function number() {
    // assert( 'number()' )
    start = index
    while ( source[ index ] >= '0' && source[ index ] <= '9' ) ++index
    if ( source[ index ] === '.' ) {
        ++index
        if ( source[ index ] >= '0' && source[ index ] <= '9' ) {
            ++index
            while ( source[ index ] >= '0' && source[ index ] <= '9' ) ++index
        }
        else throw 'digits expected after decimal point'
    }
    return start < index
}

function identifier() {
    // assert( 'identifier()' )
    start = index
    if ( source[ index ] >= 'A' && source[ index ] <= 'Z' ||
         source[ index ] >= 'a' && source[ index ] <= 'z' ) {
        start = index
        ++index
        while ( source[ index ] >= 'A' && source[ index ] <= 'Z' ||
                source[ index ] >= 'a' && source[ index ] <= 'z' ) ++index
        // assert( 'identifier: ' + source.substring( start, index ) )
        return true
    }
    index = start
    return false
}

function trivia() {
    // assert( 'trivia()' )
    if ( source[ index ] === ' '  || source === '\t' ||
         source[ index ] === '\r' || source[ index ] === '\n') {
        ++index
        while ( source[ index ] === ' '  || source[ index ] === '\t' ||
                source[ index ] === '\r' || source[ index ] === '\n') ++index
        return true
    }
    return false
}