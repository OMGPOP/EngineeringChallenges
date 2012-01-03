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

main()
{
  char s[10];
  long int f;
  printf("Enter a number to factorial\n");
  fgets(s, 10, stdin);
  f = my_factorial(atoi(&s));
  printf("factorial of %s is %ld\n",s,f);
}

