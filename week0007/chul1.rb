count = 0
1.upto(ARGV[0].to_i) { |f|
  f.upto(ARGV[0].to_i) { |s|
    count = count + 1 unless f == s
 
    if count == ARGV[1].to_i
      puts "{#{f}, #{s}}" 
      exit(1)
    end
  }
}
