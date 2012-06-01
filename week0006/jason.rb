require 'rubygems'
require 'colorize'

#In the 2020 grid below, we take four numbers along a diagonal line starting at 8,6.
#
#08 02 22 97 38 15 00 40 00 75 04 05 07 78 52 12 50 77 91 08
#49 49 99 40 17 81 18 57 60 87 17 40 98 43 69 48 04 56 62 00
#81 49 31 73 55 79 14 29 93 71 40 67 53 88 30 03 49 13 36 65
#52 70 95 23 04 60 11 42 69 24 68 56 01 32 56 71 37 02 36 91
#22 31 16 71 51 67 63 89 41 92 36 54 22 40 40 28 66 33 13 80
#24 47 32 60 99 03 45 02 44 75 33 53 78 36 84 20 35 17 12 50
#32 98 81 28 64 23 67 10 26 38 40 67 59 54 70 66 18 38 64 70
#67 26 20 68 02 62 12 20 95 63 94 39 63 08 40 91 66 49 94 21
#24 55 58 05 66 73 99 26 97 17 78 78 96 83 14 88 34 89 63 72
#21 36 23 09 75 00 76 44 20 45 35 14 00 61 33 97 34 31 33 95
#78 17 53 28 22 75 31 67 15 94 03 80 04 62 16 14 09 53 56 92
#16 39 05 42 96 35 31 47 55 58 88 24 00 17 54 24 36 29 85 57
#86 56 00 48 35 71 89 07 05 44 44 37 44 60 21 58 51 54 17 58
#19 80 81 68 05 94 47 69 28 73 92 13 86 52 17 77 04 89 55 40
#04 52 08 83 97 35 99 16 07 97 57 32 16 26 26 79 33 27 98 66
#88 36 68 87 57 62 20 72 03 46 33 67 46 55 12 32 63 93 53 69
#04 42 16 73 38 25 39 11 24 94 72 18 08 46 29 32 40 62 76 36
#20 69 36 41 72 30 23 88 34 62 99 69 82 67 59 85 74 04 36 16
#20 73 35 29 78 31 90 01 74 31 49 71 48 86 81 16 23 57 05 54
#01 70 54 71 83 51 54 69 16 92 33 48 61 43 52 01 89 19 67 48
#
#The product of these numbers is 26  63  78  14 = 1788696.
#
#What is the greatest product of four adjacent numbers in any direction (up, down, left, right, or diagonally) in the 20x20 grid?#

grid =  ["08 02 22 97 38 15 00 40 00 75 04 05 07 78 52 12 50 77 91 08".split(" "),
        "49 49 99 40 17 81 18 57 60 87 17 40 98 43 69 48 04 56 62 00".split(" "),
        "81 49 31 73 55 79 14 29 93 71 40 67 53 88 30 03 49 13 36 65".split(" "),
        "52 70 95 23 04 60 11 42 69 24 68 56 01 32 56 71 37 02 36 91".split(" "),
        "22 31 16 71 51 67 63 89 41 92 36 54 22 40 40 28 66 33 13 80".split(" "),
        "24 47 32 60 99 03 45 02 44 75 33 53 78 36 84 20 35 17 12 50".split(" "),
        "32 98 81 28 64 23 67 10 26 38 40 67 59 54 70 66 18 38 64 70".split(" "),
        "67 26 20 68 02 62 12 20 95 63 94 39 63 08 40 91 66 49 94 21".split(" "),
        "24 55 58 05 66 73 99 26 97 17 78 78 96 83 14 88 34 89 63 72".split(" "),
        "21 36 23 09 75 00 76 44 20 45 35 14 00 61 33 97 34 31 33 95".split(" "),
        "78 17 53 28 22 75 31 67 15 94 03 80 04 62 16 14 09 53 56 92".split(" "),
        "16 39 05 42 96 35 31 47 55 58 88 24 00 17 54 24 36 29 85 57".split(" "),
        "86 56 00 48 35 71 89 07 05 44 44 37 44 60 21 58 51 54 17 58".split(" "),
        "19 80 81 68 05 94 47 69 28 73 92 13 86 52 17 77 04 89 55 40".split(" "),
        "04 52 08 83 97 35 99 16 07 97 57 32 16 26 26 79 33 27 98 66".split(" "),
        "88 36 68 87 57 62 20 72 03 46 33 67 46 55 12 32 63 93 53 69".split(" "),
        "04 42 16 73 38 25 39 11 24 94 72 18 08 46 29 32 40 62 76 36".split(" "),
        "20 69 36 41 72 30 23 88 34 62 99 69 82 67 59 85 74 04 36 16".split(" "),
        "20 73 35 29 78 31 90 01 74 31 49 71 48 86 81 16 23 57 05 54".split(" "),
        "01 70 54 71 83 51 54 69 16 92 33 48 61 43 52 01 89 19 67 48".split(" ")]

class Grid
  attr_accessor :grid, :display_grid
  attr_accessor :current_x, :current_y
  attr_accessor :current_highest_val, :current_highest_coords

  def initialize(grid = nil)
    self.grid = grid
    self.display_grid = self.grid
    self.current_x = 0
    self.current_y = 0
    #self.reset_colors
    self.current_highest_val = 0
  end

  def setup
    puts "SIZE YOUR SCREEN TO FIT THE GRID THEN PRESS ENTER... PRESS ENTER TO SEE THE GRID.."
    gets
    display
    gets
  end

  def display
    puts self.display_grid.collect { |g| g.join(" ") }.join("\n")
    reset_colors
    puts "Highest Val: #{self.current_highest_val.to_s.red}"
    sleep 0.02
    #gets
  end

  def reset
    self.display_grid = self.grid
  end

  def reset_colors
    self.display_grid = self.display_grid.collect {|r| r.collect { |c| c.colorize(:color => :white, :background => :black) } }
    self.colorize_values
  end

  def colorize_values
    self.colorize(self.current_x, self.current_y, :blue)
    if self.current_highest_coords
      self.current_highest_coords.each do |xy|
        self.colorize(xy[0],xy[1],:red)
      end
    end
  end

  def next
    self.current_x += 1
    if self.current_x > self.grid.first.length
      self.current_x = 0
      self.current_y += 1
      if self.current_y > self.grid.length
        return finish!
      end
    end
  end

  def colorize(x, y, color = :white, area = :color)
    self.display_grid[y][x] = self.display_grid[y][x].colorize(area => color)
  end

  def rows
    self.grid
  end

  def row_amount
    self.grid.length
  end

  def col_amount
    self.grid.first.length
  end

  def val(x,y)
    self.grid[y][x].to_i
  end

  # This could be REALLY cleaned up, but fuckit
  def find_largest
    rows.each_with_index do |row, r|
      row.each_with_index do |col, c|
        self.current_y = r
        self.current_x = c
        if self.current_x < col_amount - 3
          t = []
          v = []
          4.times do |i|
            t << val(c+i,r)
            v << [c+i,r]

            v.each { |xy| colorize(xy[0], xy[1], :green, :background) } 
            display
          end
          if t.inject(:*) > self.current_highest_val
            self.current_highest_val = t.inject(:*)
            self.current_highest_coords = v
          end
        end

        #down
        if self.current_y < row_amount - 3
          t = []
          v = []
          4.times do |i|
            t << val(c,r+i)
            v << [c,r+i]

            v.each { |xy| colorize(xy[0], xy[1], :green, :background) } 
            display
          end
          if t.inject(:*) > self.current_highest_val
            self.current_highest_val = t.inject(:*)
            self.current_highest_coords = v
          end
        end

        #down-right
        if self.current_y < row_amount - 3 && self.current_x < col_amount - 3
          t = []
          v = []
          4.times do |i|
            t << val(c+i,r+i)
            v << [c+i,r+i]

            v.each { |xy| colorize(xy[0], xy[1], :green, :background) } 
            display
          end
          if t.inject(:*) > self.current_highest_val
            self.current_highest_val = t.inject(:*)
            self.current_highest_coords = v
          end
        end

        #down-left
        if self.current_y < row_amount - 3 && self.current_x > 2
          t = []
          v = []
          4.times do |i|
            t << val(c-i,r+i)
            v << [c-i,r+i]

            v.each { |xy| colorize(xy[0], xy[1], :green, :background) } 
            display
          end
          if t.inject(:*) > self.current_highest_val
            self.current_highest_val = t.inject(:*)
            self.current_highest_coords = v
          end
        end


      end
    end

  end
end

g = Grid.new(grid)
g.setup
g.find_largest