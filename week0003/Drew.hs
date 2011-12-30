import System (getArgs)

main = do
  args <- getArgs
  print $ factorial' (read (head args) :: Integer)

factorial :: Integer -> Integer
factorial 2 = 2
factorial n = n * factorial (n - 1)

factorial' :: Integer -> Integer
factorial' n = if n > 2 then n * factorial' (n - 1) else 2

factorial'' :: Integer -> Integer
factorial'' n = product [2..n]

factorial''' :: Integer -> Integer
factorial''' n = foldr (*) 1 [2..n]
