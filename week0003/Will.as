
function f( n : int ) : int
{
    var value : int = n;
    var list : Vector.<int> = new Vector.<int>;
    
    for ( var i : int = 0; i <= value; i++ )
    {
        list.push( i );
    }
    
    getPrimes( list , value );
    
    var accum : int = 1;
    for ( i = 0; i < list.length; i++ )
    {
        var prime : int = list[i];
        
        if ( prime > 1 )
        {
            var mult : int = getMultiplicity( value, prime );
            accum *= Math.pow( prime, mult );
        }
    }
    
    return accum;
}

function fac( n : int ) : int
{
    if ( n <= 1 )
    {
        return 1;
    }
    
    return n * fac( n - 1 );
}

function getMultiplicity( value : int, prime : int ) : int
{
    var temp : int = value;
    var mult : int = 0;
    
    while ( temp > 0 )
    {
        temp = int( temp / prime );
        mult += temp;
    }
    
    return mult;
}

function getPrimes( list : Vector.<int>, n : int ) : void
{
    var length : int = list.length;
    var divtwo : int = length / 2;
    
    for ( var i : int = 2; i < divtwo; i++ )
    {
        var value : int = list[i];
        
        if ( value > 0 )
        {
            for ( var j : int = 2 * i; j <= n; j += i )
            {
                list[j] = 0;    
            }
        }
    }
}
