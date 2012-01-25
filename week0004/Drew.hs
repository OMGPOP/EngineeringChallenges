import System (getArgs)

main = do
  args <- getArgs
  file <- readFile $ head args
  let (_:ls) = lines file 
  let isqrt = floor . sqrt . fromIntegral
  mapM_ putStrLn $ map (\n -> numDblSquares (read n))

numDblSquares :: Int -> Int
numDblSquares n = length [x^2 | x <- [0..isqrt $ div n 2], (isqrt (n - x^2))^2 + x^2 == n]
  where isqrt = floor . sqrt . fromIntegral

