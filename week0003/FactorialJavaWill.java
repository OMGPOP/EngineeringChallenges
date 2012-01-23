import java.math.BigInteger;
import java.util.ArrayList;

public class FactorialJavaWill {
	public static void main(String[] args) {
		System.out.println(f(Integer.parseInt(args[0])));
	}

	private static BigInteger f(int n) {
		int value = n;
		ArrayList<Integer> list = new ArrayList<Integer>(value + 1);

		int i;
		for (i = 0; i <= value; i++) {
			list.add(i);
		}

		getPrimes(list, value);

		BigInteger accum = BigInteger.ONE;
		int length = list.size();
		for (i = 0; i < length; i++) {
			int prime = list.get(i);

			if (prime > 1) {
				int mult = getMultiplicity(value, prime);
				accum = accum.multiply(BigInteger.valueOf(prime).pow(mult));
			}
		}

		return accum;
	}

	private static int getMultiplicity(int value, int prime) {
		int temp = value;
		int mult = 0;

		while (temp > 0) {
			temp = temp / prime;
			mult += temp;
		}

		return mult;
	}

	private static void getPrimes(ArrayList<Integer> list, int n) {
		int length = list.size();
		int divtwo = length / 2;

		for (int i = 2; i < divtwo; i++) {
			int value = list.get(i);

			if (value > 0) {
				for (int j = 2 * i; j <= n; j += i) {
					list.set(j, 0);
				}
			}
		}
	}
}
