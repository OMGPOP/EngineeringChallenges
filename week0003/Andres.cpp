#include <iostream>

int cn;

int product(int n){
	int m = n / 2;
	if(m == 0) return (cn += 2);
	if(n == 2) return (cn += 2) * (cn += 2);
	return product(n - m) * product(m);
}

int floorLog2(int n) {
	if (n == 0) return -1;
 
	int pos = 0;
	if (n >= (1 <<16)) { n >>= 16; pos += 16; }
	if (n >= (1 << 8)) { n >>=  8; pos +=  8; }
	if (n >= (1 << 4)) { n >>=  4; pos +=  4; }
	if (n >= (1 << 2)) { n >>=  2; pos +=  2; }
	if (n >= (1 << 1)) {           pos +=  1; }
	return pos;
}

int factorial(int n){
	if(n < 0) return 0;
	if(n < 2) return 1;

	int p = 1;
	int r = 1;
	cn = 1;

	int h = 0, shift = 0, high = 1;
	int log2n = floorLog2(n);

	while(h != n){
		shift += h;
		h = n >> log2n--;
		int len = high;
		high = (h - 1) | 1;
		len = (high - len) / 2;

		if(len > 0){
			p *= product(len);
			r *= p;
		}
	}
	
	return r << shift;
}

int main(int argc, char* argv[]) {
	if(argc < 2) return 1;
	std::cout << factorial(atoi(argv[1])) << std::endl;
	return 0;
}
