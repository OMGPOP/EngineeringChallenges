def getButtonX(n)
  return n=="*" ? 2 : n==0 ? 1 : (n-1)%3
end

def getButtonY(n)
  return n=="*" ? 3 : n==0 ? 3 : (n-1)/3
end

def getDistance(i, j)
  return Math.sqrt((getButtonX(i)-getButtonX(j))**2+(getButtonY(i)-getButtonY(j))**2)
end

def getTotalDistance(buttons)
  totalDistance = 0.0
  buttons.each_with_index do |v,k|
    if k+1 < buttons.length
      totalDistance += getDistance(v, buttons[k+1])
    end
  end
  return totalDistance
end

def stringToDistance(string)
  return getTotalDistance(string.split("").map(&:to_i) + ["*"])
end

def convertToMinutes(s)
  return (s/60).to_i.to_s + (s%60).to_i.to_s
end

def microwave(s)
  path1 = s.to_s
  path2 = convertToMinutes(s)
  return stringToDistance(path1) < stringToDistance(path2) ? path1 : path2
end