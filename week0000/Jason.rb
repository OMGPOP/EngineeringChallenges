def wat(arr, n=nil)
  n ||= arr.length - 1 # setup  

  (arr[n].length - 1).times { |i| arr[n-1][i] = arr[n-1][i] + ((arr[n][i+1] > arr[n][i]) ? arr[n][i+1] : arr[n][i])  }
  return (n<=1) ? arr.max : wat(arr[0..(n-1)])
end