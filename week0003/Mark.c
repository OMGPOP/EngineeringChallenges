#include <stdio.h>

unsigned long long recursiveFactorial( long long n )
{
	unsigned long long factorial;
	factorial = ( n>=1 ? n * recursiveFactorial( n - 1 ) : 1 );
	return factorial;
}

int main( int argc, const char *argv[] )
{
	printf( "%lld\n", recursiveFactorial( ( long long ) atoi( argv[ 1 ] ) ) );

	return 0;
}
