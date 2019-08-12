const MAX_ITERATIONS = 100

var _index,
    _source,
    _start,
    _variables = []

function run() {
    _source = document.getElementById( 'source' ).value
    _index = 0
    clear()
    try {
        program()
    }
    catch ( exp ) {
        assert( exp )
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
    block()
    if ( _source[ _index ] === '.' ) {
        ++_index
        trivia()
        if ( _source[ _index ] === undefined ) return
        throw 'contents after end of program'
    }
    throw 'end of expression ; or end of program . expected' + _source.substr( _index, 16 )
}

function block() {
    trivia()
    for ( ;; ) {
        trivia()
        if      ( procedure() )        { }
        else if ( statement( true ) )  { }
        trivia()
        if ( _source[ _index ] === ';' ) {
            ++_index
            continue
        }
        else break
    }
}

function procedure() {
    var reset = _index
    if ( _source[   _index ] === 'p' && _source[ ++_index ] === 'r' &&
         _source[ ++_index ] === 'o' && _source[ ++_index ] === 'c' &&
         _source[ ++_index ] === 'e' && _source[ ++_index ] === 'd' &&
         _source[ ++_index ] === 'u' && _source[ ++_index ] === 'r' &&
         _source[ ++_index ] === 'e' ) {
        ++_index
        if ( trivia() ) {
            if ( identifier() ) {
                _variables[ _source.substring( _start, _index ) ] = _index
                trivia()
                beginend( false )
                return true
            }
        }
    }
    _index = reset
    return false
}

function statement( evaluate ) {
    trivia()
    if      ( assignment ( evaluate ) ) return
    else if ( beginend   ( evaluate ) ) return
    else if ( echo       ( evaluate ) ) return
    else if ( ifthen     ( evaluate ) ) return
    else if ( proccall   ( evaluate ) ) return
    else if ( whiledo    ( evaluate ) ) return
    throw 'unexpected token [statement] ' + _source.substr( _index, 16 )
}

function assignment( evaluate ) {
    var name, result, reset = _index
    if ( identifier( evaluate ) ) {
        name = _source.substring( _start, _index )
        trivia()
        if ( _source[ _index ] === ':' && _source[ ++_index ] === '=' ) {
            ++_index
            trivia()
            result = expression( evaluate )
            if ( evaluate ) _variables[ name ] = result
            return true
        }
    }
    _index = reset
    return false
}

function beginend( evaluate ) {
    var reset = _index
    if ( _source[   _index ] === 'b' && _source[ ++_index ] === 'e' &&
         _source[ ++_index ] === 'g' && _source[ ++_index ] === 'i' &&
         _source[ ++_index ] === 'n' ) {
        ++_index
        if ( trivia() ) {
            statement( evaluate )
            for ( ;; ) {
                trivia()
                if ( _source[ _index ] === ';' ) {
                    ++_index
                    statement( evaluate )
                }
                else break
            }
            if ( _source[   _index ] === 'e' && _source[ ++_index ] === 'n' && 
                 _source[ ++_index ] === 'd' ) {
                ++_index
                return true
            }
        }
        throw 'end or ; expected'
    }
    _index = reset
    return false
}

function proccall( evaluate ) {
    var tail, reset = _index
    if ( _source[   _index ] === 'c' && _source[ ++_index ] === 'a' &&
         _source[ ++_index ] === 'l' && _source[ ++_index ] === 'l' ) {
        ++_index
        if ( trivia() ) {
            if ( identifier() ) {
                tail  = _index
                _index = _variables[ _source.substring( _start, _index ) ]
                statement( evaluate )
                _index = tail
                return true
            }
        }
    }
    _index = reset
    return false
}

function echo( evaluate ) {
    var result, reset = _index
    if ( _source[   _index ] === '!' || _source[   _index ] === 'e' &&
         _source[ ++_index ] === 'c' && _source[ ++_index ] === 'h' &&
         _source[ ++_index ] === 'o' ) {
        ++_index
        if ( trivia() ) {
            result = expression( evaluate )
            if ( evaluate ) assert( result )
            return true
        }
        throw 'expression expected after echo'
    }
    _index = reset
    return false
}

function ifthen( evaluate ) {
    var result, reset = _index
    if ( _source[ _index ] === 'i' && _source[ ++_index ] === 'f' ) {
        ++_index
        if ( trivia() ) {
            result = condition( evaluate )
            if ( _source[   _index ] === 't' && _source[ ++_index ] === 'h' &&
                 _source[ ++_index ] === 'e' && _source[ ++_index ] === 'n' ) {
                ++_index
                if ( trivia() ) {
                    statement( result )
                    return true
                }
                throw 'statement expected after then'
            }
            throw 'then expected after condition'
        }
    }
    _index = reset
    return false
}

function whiledo( evaluate ) {
    var head, result, iteration = 0, reset = _index
    if ( _source[   _index ] === 'w' && _source[ ++_index ] === 'h' &&
         _source[ ++_index ] === 'i' && _source[ ++_index ] === 'l' &&
         _source[ ++_index ] === 'e' ) {
        ++_index
        if ( trivia() ) {
            head   = _index
            for ( ;; ) {
                result = condition( evaluate )
                if ( _source[   _index ] === 'd' && _source[ ++_index ] === 'o' ) {
                    ++_index
                    if ( trivia() ) {
                        statement( result )
                        if ( result && iteration < MAX_ITERATIONS ) {
                            _index = head
                            ++iteration
                            continue
                        }
                        else return true
                    }
                    throw 'statement expected after do'
                }
                throw 'do expected after condition'
            }
        }
    }
    _index = reset
    return false
}

function condition( evaluate ) {
    var operand1, operand2, reset = _index
    trivia()
    if ( _source[   _index ] === 'o' && _source[ ++_index ] === 'd' &&
         _source[ ++_index ] === 'd' ) {
        ++_index
        if ( trivia() ) {
            operand1 = expression( evaluate )
            if ( evaluate ) return operand1 % 2 !== 0
            return false
        }
    }
    _index = reset
    operand1 = expression( evaluate )
    if ( _source[ _index ] === '=' ) {
        ++_index
        operand2 = expression( evaluate )
        if ( evaluate ) return operand1 === operand2
        return false
    }
    else if ( _source[ _index ] === '#' ) {
        ++_index
        operand2 = expression( evaluate )
        if ( evaluate ) return operand1 === operand2
        return false
    }
    else if ( _source[ _index ] === '<' ) {
        ++_index
        if ( _source[ _index ] === '=' ) {
            operand2 = expression( evaluate )
            if ( evaluate ) return operand1 <= operand2
            return false
        }
        else {
            operand2 = expression( evaluate )
            if ( evaluate ) return operand1 < operand2
            return false
        }
    }
    else if ( _source[ _index ] === '>' ) {
        ++_index
        if ( _source[ _index ] === '=' ) {
            operand2 = expression( evaluate )
            if ( evaluate ) return operand1 >= operand2
            return false
        }
        else {
            operand2 = expression( evaluate )
            if ( evaluate ) return operand1 > operand2
            return false
        }
    }
    throw 'unexpected token [condition]'
}

function expression( evaluate ) {
    var operand1, operand2
    operand1 = term( evaluate )
    for ( ;; ) {
        if ( _source[ _index ] === '+' ) {
            ++_index
            operand2 = term( evaluate )
            if ( evaluate ) operand1 += operand2
            continue
        }
        else if ( _source[ _index ] === '-' ) {
            ++_index
            operand2 = term( evaluate )
            if ( evaluate ) operand1 -= operand2
            continue
        }
        else break
    }
    return operand1
}

function term( evaluate ) {
    var operand1, operand2
    operand1 = factor( evaluate )
    for ( ;; ) {
        trivia()
        if ( _source[ _index ] === '*' ) {
            ++_index
            trivia()
            operand2 = factor( evaluate )
            if ( evaluate ) operand1 *= operand2
            continue
        }
        else if ( _source[ _index ] === '/' ) {
            ++_index
            trivia()
            operand2 = factor( evaluate )
            if ( evaluate ) operand1 /= operand2
            continue
        }
        else break
    }
    return operand1
}

function factor( evaluate ) {
    var result
    trivia()
    if ( _source[ _index ] === '(' ) {
        ++_index
        if ( result = expression( evaluate ) ) {
            trivia()
            if ( _source[ _index ] === ')' ) {
                ++_index
                return result
            }
            throw ') expected'
        }
        throw 'unexpected token [paranthesis]'
    }
    else if ( number() ) {
        return parseFloat( _source.substring( _start, _index ) )
    }
    else if ( identifier() ) {
        return _variables[ _source.substring( _start, _index ) ] 
    }
    throw 'unexpected token [factor]'
}

function number() {
    _start = _index
    while ( _source[ _index ] >= '0' && _source[ _index ] <= '9' ) ++_index
    if ( _source[ _index ] === '.' ) {
        ++_index
        if ( _source[ _index ] >= '0' && _source[ _index ] <= '9' ) {
            ++_index
            while ( _source[ _index ] >= '0' && _source[ _index ] <= '9' ) ++_index
        }
        else throw 'digits expected after decimal point'
    }
    return _start < _index
}

function identifier() {
    _start = _index
    if ( _source[ _index ] >= 'A' && _source[ _index ] <= 'Z' ||
         _source[ _index ] >= 'a' && _source[ _index ] <= 'z' ) {
        _start = _index
        ++_index
        while ( _source[ _index ] >= 'A' && _source[ _index ] <= 'Z' ||
                _source[ _index ] >= 'a' && _source[ _index ] <= 'z' ) ++_index
        return true
    }
    _index = _start
    return false
}

function trivia() {
    if ( _source[ _index ] === ' '  || _source === '\t' ||
         _source[ _index ] === '\r' || _source[ _index ] === '\n') {
        ++_index
        while ( _source[ _index ] === ' '  || _source[ _index ] === '\t' ||
                _source[ _index ] === '\r' || _source[ _index ] === '\n') ++_index
        return true
    }
    return false
}