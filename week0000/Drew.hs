import System.IO
import Data.Char (isSpace)
import System (getArgs)
import System.CPUTime
import Text.Printf


-- runhaskell MaxTriangleSum.hs triangle.txt
main = do
  args <- getArgs
  raw <- readFile (head args)
  let tri = map ints (lines raw)
  print $ head (foldr1 tri colTri)
  where
    colTri [] [ x ] = x
    colTri (x:xs) (y:ys:yss) = x + max y ys : colTri xs (ys:yss)


collapse :: [Integer] -> [Integer] -> [Integer]
collapse [ x ]  (y:ys) = [x + max y (head ys)]
collapse (x:xs) (y:ys) = (x + max y (head ys)):collapse xs ys 

triMaxSum :: [[Integer]] -> Integer
triMaxSum (x0:x1:xs) = triMaxSum ((collapse x1 x0):xs)
triMaxSum [ x ] = head x

ints :: String -> [Integer]
ints s = case dropWhile isSpace s of
		"" -> []
		s' -> (read i) : ints s''
			where (i, s'') = break isSpace s'

