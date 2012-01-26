#include <stdio.h>
#include <math.h>

inline double GetComplement(int c, int n) { return (double) sqrt( (n - (c * c)) ); }

int CalcDoubleSquare(int n) 
{
	int nSqrt = (int) sqrt(n), sums = 0;
	double complement;
	
	while( (complement = GetComplement( nSqrt, n )) <= nSqrt-- )
	{
		if( floor(complement) == complement ) {
			sums++;
		}
	}
	
	return sums;
}

int main(int argc, char *argv[]) 
{
	
	static const char filename[] = "input.txt";
   	FILE *file = fopen ( filename, "r" );
   	if ( file != NULL )
   	{
		char line [ 128 ];
		while ( fgets ( line, sizeof line, file ) != NULL )
		{
			printf("%d\n", CalcDoubleSquare( atoi(line) ));
		}
      	fclose ( file );
   	}
	
	
	return 0;
}