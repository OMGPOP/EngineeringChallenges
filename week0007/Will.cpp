#include <stdlib.h>
#include <stdio.h>
#include <math.h>
#include <string>

using namespace std;

void solve( unsigned long int n, long int k )
{
	long int totalSolutions = n * (n - 1) * 0.5;
	long int opp = totalSolutions - k + 1;
	
	double c = 2 * opp;
	double ac = sqrt(1 + 4 * c);
	
	long int solA = ceil( (-1 + ac) * 0.5 );
	
	long int numSolutions = solA * ( solA + 1 ) * 0.5;
	
	long int firstDigit = n - solA;
	long int secondDigit = (numSolutions - opp) + firstDigit + 1;
	
	printf("%ld %ld\n", firstDigit, secondDigit);
}

int main(int argc, char* argv[])
{	
	if ( argc == 2 )
	{
		char* filename = argv[1];
	
		FILE* file = fopen(filename, "r");
		
		if ( file )
		{			
			fseek( file, 0, SEEK_END );
			int size = ftell(file);
			fseek( file, 0, SEEK_SET );
			char* buffer = (char*)malloc(size);
			fread( buffer, 1, size, file );
			
			char* pch;
			pch = strtok(buffer, " ");
			
			while ( pch != NULL )
			{
				long int n = atol(pch);
				pch = strtok(NULL,"\n");
				long int k = atol(pch);
				pch = strtok(NULL," ");
				
				solve(n,k);
			}	
		}
	}
}

