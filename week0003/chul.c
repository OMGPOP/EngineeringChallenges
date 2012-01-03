/* Factorial program */

#include <stdio.h>

long int my_factorial(long int n)
{
  if (n <= 1)
    return(1);
  else
    n = n * my_factorial(n - 1);
  return(n);
}

int main (int argc, char *argv[])
{
  long int s,f;
  f = my_factorial(atoi(argv[1]));
  printf("factorial of %s is %ld\n",argv[1],f);
}

