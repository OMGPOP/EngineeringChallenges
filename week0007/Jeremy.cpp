// EngineeringChallenge.cpp : Defines the entry point for the console application.
//

#include <stdio.h>
#include <math.h>

int main(int argc, char* argv[])
{

#ifdef _DEBUG
	{
		// test math
		int n = 4;
		float q = n * n - (float)((n*n + n) / 2.0);
		printf ("Total quantity in series is %f\n", q);

		for (int i = 1; i <= (int)q; i++)
		{
			float column = (float)n - (0.5f) - sqrtf(((float)n*n) - (float)n + (0.25f) - (2.0f * (float)i));
			float count = column * n - ((column * column + column) / 2);
			int col = (int) ceilf(column);
			printf("the %02dth element is in column is %02d.\n", i, col);
		}
	}
#endif

	if (!argv[1])
	{
		printf ("Yo, invoke this program with a filename as an argument.\n");
		return 1;
	}

	char* filename = argv[1];
	FILE* file = fopen(filename, "r");

	long n = 0;
	while (1 == fscanf(file, "%d", &n))
	{
		long k = 0;
		if (1 != fscanf(file, "%d", &k))
		{
			printf("yo mo fo, error reading k.\n");
			return 1;
		}

		double column = (double)n - (0.5f) - sqrtf(((double)n*n) - (double)n + (0.25f) - (2.0f * (double)k));
		int col = (long) ceil(column);

		long previousColumn = col - 1;
		long ElementCountAtColumn = previousColumn * n - ((previousColumn * previousColumn + previousColumn) / 2.0f);

		long row = col + (k - ElementCountAtColumn);
		printf("%d %d\n", col, row);
	}

	return 0;
}

