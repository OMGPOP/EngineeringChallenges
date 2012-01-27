main = do
  file <- readFile "input.txt"
  mapM_ (putStrLn . show . numDblSquares'' . read) (tail $ lines file)

isqrt = floor . sqrt . fromIntegral
numDblSquares   n = length [x | x <- [0..isqrt $ div n 2], (isqrt (n - x^2))^2 + x^2 == n]
numDblSquares'  n = foldr (\x xs -> if (isqrt (n - x*x))^2 + x * x == n then xs + 1 else xs) 0 [0..isqrt $ div n 2]
numDblSquares'' n = nds n (isqrt n)

nds n r = if comp > r then 0 else if comp^2 + r^2 == n then 1 + (nds n (r-1)) else nds n (r-1)
  where comp = isqrt $ n - r^2
