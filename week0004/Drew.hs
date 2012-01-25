import System (getArgs)

numDblSquares n = length [x^2 | x <- [0..isqrt $ div n 2], (isqrt (n - x^2))^2 + x^2 == n]
  where isqrt = floor . sqrt . fromIntegral

main = do
  args <- getArgs
  file <- readFile $ head args
  let (_:ls) = lines file 
  mapM_ putStrLn $ map (\n -> show $ numDblSquares (read n::Int)) ls

