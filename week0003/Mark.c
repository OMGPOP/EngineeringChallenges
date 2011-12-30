unsigned int recursiveFactorial( int n )
{
	unsigned int factorial;
	factorial = ( n>=1 ? n * recursiveFactorial( n - 1 ) : 1 );
	return factorial;
}

int main (int argc, char *argv[])
{
	printf( "%i\n", recursiveFactorial( atoi(argv[1]) ) );

	return 0;
}
