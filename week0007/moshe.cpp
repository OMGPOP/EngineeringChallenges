//
//  main.cpp
//  DrewChallenge
//
//  Created by Moshe Ezderman on 6/14/12.
//  Copyright (c) 2012 __MyCompanyName__. All rights reserved.
//

#include <iostream>
#include <fstream>
#include <string>
#include <vector>

using namespace std;


bool solveFor(int n, int k)
{
    vector<int> list;
    
    for (int i = 0; i<= n ; i++ )
    {
        list.push_back(i+1);
    }
    
    int counter = 0;
    
    for (int i = 0; i< n ; i++ ) {
        for (int j = i+1; j< n; j++ ) {
            
            int a = list[i];
            int b = list[j];
            
            counter++;
            if( counter == k)
            {
                cout << a << "," << b;
                return true;
            }
        }
    }
    return false;
}

int main(int argc, const char * argv[])
{

    
    if (argc < 2 ) return 0;
    
    
    ifstream inputFile(argv[1]);
    
    if(inputFile.is_open())
    {
        while( inputFile.good() )
        {
            
            string line;
            
            getline( inputFile,line );
            int spaceIndex = line.find(" ");
            int n = atol(line.substr(0, spaceIndex).c_str());
            int k = atol(line.substr(spaceIndex + 1).c_str());
            solveFor(n, k);
        }

    }
       
    return 0;
}

