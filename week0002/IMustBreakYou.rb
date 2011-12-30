require 'robot'

class Numeric
  def to_rad
    self * 0.0174532925199433
  end
  
  def to_deg
    self * 57.2957795130823
  end
  
  def round_f(degrees=3)
    return (self * (10 ** degrees)).round / (10 ** degrees).to_f
  end
end

class IMustBreakYou
   include Robot
 
   def initialize()
     @RADAR_MODE = {:EXPLORE => 0x1, :PINPOIN => 0x2}
     @last_timer = 0
     @MAX_TURN = 10
     @RADAR_MAX_TURN = 30
     @radar_turn_rate = @RADAR_MAX_TURN
     @TURN_R = 2
     @turn_accel = @TURN_R
     @radar_mode = @RADAR_MODE[:EXPLORE]
     @pinpoint_timer = 0
   end

  def tick events
    if @pinpoint_timer > 10
      @radar_turn_rate = @RADAR_MAX_TURN
      @pinpoint_timer = 0
    end
    turn_gun(@radar_turn_rate)
    if !events['robot_scanned'].empty?
      @pinpoint_timer = 0
      if @radar_mode != @RADAR_MODE[:PINPOIN]
        @radar_turn_rate = 1
        @radar_mode = @RADAR_MODE[:PINPOIN]
      else
        @radar_turn_rate = 1
      end
      
      #lock_on_target( events['robot_scanned'].first.first )
      #puts "#{events.inspect}"
    else
      if @radar_mode == @RADAR_MODE[:PINPOIN]
        @dir = 1
        @dir = -1 if @radar_turn_rate > 0
        @radar_turn_rate = @dir * (@radar_turn_rate + @dir * @turn_accel)
        #puts("===>#{@radar_turn_rate}")
        @pinpoint_timer += 1
      end
      
    end
    
    fire( 0.1 )
  end
  
  def set_radar_turn_rate( len )
    @turn_accel = 10 if len > bf_half_width
    @turn_accel = @TURN_R if len < bf_half_width
  end
  
  def get_distance_from_wall
    
  end
  
  def lock_on_target( len )
    get_target_location( len )
    
  end
  
  def get_target_location( len )
    @target_last_location = Vector.new(x, y)
    
    @target_last_location.length( len )
  end
  
  
  
  
  
  
  
  
  
  
  
  
  
  def move_to(point)
    return if point.nil?
    distance = current_location.distance(point)
    
    return if distance == 0
    
    set_angle(point)
    
    if distance > speed
      accelerate( 1 )
    else
      stop
    end
    
    
  end
  
  def set_angle(point)
    
  end
  
  def set_next_destination
    q = quadriant
    puts"=>#{q}"
    set_destination(top_left) if q == 1
    set_destination(top_right) if q == 2
    set_destination(bottom_right) if q == 3
    set_destination(bottom_left) if q == 4
  end
  
  def quadriant
    q = 1
    if x < bf_half_width
      q = 1 if y <= bf_half_height
      q = 4 if y > bf_half_height
    else
      q = 2 if y <= bf_half_height
      q = 3 if y > bf_half_height
    end
    q
  end
  
  def bf_half_width
     @bf_half_width ||= (battlefield_width / 2)
  end
  
  def bf_half_height
     @bf_half_height ||= (battlefield_height / 2)
  end
  
  def current_location
    Point.new( { :x => x, :y => y} )
  end
  
  
  def set_destination(dest)
    @destination = dest
  end
  
  def top_left
    Point.new( { :x => 0, :y => 0 } )
  end
  
  def top_right
     Point.new( { :x => 0, :y => battlefield_height } )
  end
  
  def bottom_right
     Point.new( { :x => battlefield_width, :y => battlefield_height } )
  end
  
  def bottom_left
     Point.new( { :x => battlefield_width, :y => 0 } )
  end


  class Point
    attr_accessor :x
    attr_accessor :y
    def initialize(c)
      self.x, self.y = 0, 0
      set(c)
    end
    
    def set(c)
      self.x = c[:x] || x
      self.y = c[:y] || y
    end
    
    def distance(p)
      return Math.hypot( (p.x - self.x), (p.y - self.y) )
    end
    
    def angle(p)
      
    end
  end
  
  class Vector
    def initialize(x, y)
      self.x(x || 0)
      self.y(y || 0)
    end
    
    def x(n)
      @x = n if n
      @x
    end
    
    def y(n)
      @y = n if n
      @y
    end
    
    def length(n)
      new_length if n
      get_length
    end
    
    def normalize
      Vector.new({ :x => self.x / self.length, :y => self.x / self.length })
    end
private
    def new_length(n)
      v = self.normalize
      self.x = v.x * n;
      self.y = v.y * n;
      
    end
    
    def get_length
      @length = Math.hypot( (self.x * self.x), (self.y * self.y) )
    end
    
  end
end