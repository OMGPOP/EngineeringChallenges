#include <stdlib.h>
#include <stdio.h>
#include <math.h>
#include <string.h>

void solver( int left, int right, int *value, int *data, int goal )
{
	if ( left >= right )
	{
		return;
	}
	
	int test = data[left] + data[right];
	
	if ( test == goal )
	{
		(*value)++;
		solver( left + 1, right - 1, value, data, goal );
	}
	else if ( test < goal )
	{
		solver( left + 1, right, value, data, goal );
	}
	else
	{
		solver( left + 1, right - 1, value, data, goal );
	}
	
}

int main()
{
	int accum = 0;
	
	FILE *pFile;
	
	pFile = fopen("input.txt", "r");
	
	char *input = NULL;
	
	if ( pFile )
	{
		fseek( pFile, 0, SEEK_END );
		int fileSize = ftell(pFile);
		rewind(pFile);
		input = (char *) calloc( fileSize + 1, sizeof(char) );
		fread( input, fileSize,1, pFile );
		fclose( pFile );
		
		char *focus = strtok( input, "\n" );
		int numberOfTests = atoi(focus);
		
		for ( int i = 0; i < numberOfTests; i++ )
		{
			int N = atoi( strtok( NULL, "\n") );
			int limit = int(sqrt(N));
			int *data = (int *) malloc( (limit + 1) * sizeof(int) );
			data[0] = 0;
			accum = 0;

			for ( int i = 0; i <= limit; i++ )
			{
				if ( i > 0 )
				{
					accum += ( i << 1 ) - 1;
					data[i] = accum;
				}
			}

			int value = 0;

			solver( 0, limit, &value, data, N );

			printf( "%d unique solutions for %d\n", value, N );
		}
	}
	
	return 0;
}

