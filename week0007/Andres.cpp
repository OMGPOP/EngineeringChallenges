#include <iostream>
#include <fstream>
#include <string>

using namespace std;

void findPair(string nk)
{
	int space = nk.find(' ');
	long n = atol(nk.substr(0, space).c_str());
	long k = atol(nk.substr(space+1).c_str());

	if(n == 0 && k == 0) return;

	long pairA = 1;
	long pairB = 0;

	long i = n-1;
	long j = 0;

	while(j + i < k)
	{
		j += i;
		i -= 1;
		pairA++;
	}

	pairB = pairA + (k - j);

	cout << pairA << " " << pairB << endl;
}

int main(int argc, char *argv[])
{
	if(argc < 2) return 0;

	string line;
	ifstream inFile(argv[1]);

	if(inFile.is_open())
	{
		while(inFile.good())
		{
			getline(inFile, line);
			findPair(line);
		}
		inFile.close();
	}

	return 0;
}