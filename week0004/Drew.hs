main = do
  file <- readFile "input.txt"
  mapM_ (putStrLn . show . numDblSquares . read) (tail $ lines file)

isqrt = floor . sqrt . fromIntegral
numDblSquares n = length [x | x <- [0..isqrt $ div n 2], (isqrt (n - x^2))^2 + x^2 == n]
