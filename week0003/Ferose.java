import java.math.BigInteger;

public class Ferose {
	public static void main(String[] args) {
		System.out.println(factorial(new BigInteger(args[0])));
	}
	
	private static BigInteger factorial(BigInteger n) {
		return n.equals(BigInteger.ZERO) ? BigInteger.ONE : multRange(BigInteger.ONE, n.add(BigInteger.ONE));
	}
	
	private static BigInteger multRange(BigInteger i, BigInteger j) {
		if (i.add(BigInteger.ONE).equals(j)) {
			return i;
		}
		BigInteger mid = i.add(j).shiftRight(1);
		return multRange(i, mid).multiply(multRange(mid, j));
	}
}
