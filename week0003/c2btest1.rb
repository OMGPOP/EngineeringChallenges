require 'robot'

class MyBot2
  include Robot

  attr_accessor :location, :target, :movement_directive, :radar_directive, :targeting_directive
  
  attr_accessor :desired_heading, :desired_speed, :desired_radar_heading

  def initialize(*bf)
    super(*bf)
    self.location = Location.new(0,0)
    @tick_count = 0
  end


  def tick(events)
    @tick_count += 1
    
    
    #puts "s: #{self.movement_directive}"
    #puts "x: #{self.x}, y: #{self.y}" if rand(100) < 5
    #puts "heading: #{self.heading}" if rand(100) < 5
    
    set_my_location
    
    self.targeting_directive ||= FollowTarget.new(self)
    self.radar_directive ||= FindEnemyRadar.new(self)
    
    #puts "targeting.."
    process_targeting_directive if self.targeting_directive
    #puts "movement.."
    process_movement_directive if self.movement_directive
    #puts "radar.."
    process_radar_directive if self.radar_directive
    #puts "heading.."
    process_desired_heading
    #puts "speed.."
    process_desired_speed
    #puts "radar_heading.."
    process_desired_radar_heading
    
    #puts "#{self.target.location.x},#{self.target.location.y}" if self.target
  end
  
  # Actions
  def set_my_location
    self.location.x = self.x
    self.location.y = self.y
  end
  
  def process_desired_heading
    return nil unless self.desired_heading
    return true if ((self.desired_heading-1)..(self.desired_heading+1)).include?(self.heading)
    amount = (self.heading - self.desired_heading).abs
    if direction_to_turn(self.heading,self.desired_heading) == :right
      #turn right
      turn amount > 10 ? -10 : -amount
    else
      turn amount > 10 ? 10 : amount 
    end
    return true
  end
  
  def process_desired_speed
    return nil unless self.desired_speed
    if self.speed > self.desired_speed
      accelerate -1
    elsif self.speed < self.desired_speed
      accelerate 1
    end
  end  
  
  def process_movement_directive
    return self.movement_directive = self.movement_directive.on_complete  if self.movement_directive.completed?
    self.movement_directive.process!
  end
  
  def process_targeting_directive
    return self.targeting_directive = self.targeting_directive.on_complete  if self.targeting_directive.completed?
    self.targeting_directive.process!
  end
  
  def process_radar_directive
    return self.radar_directive = self.radar_directive.on_complete  if self.radar_directive.completed?
    self.radar_directive.process!
  end
  
  def process_desired_radar_heading
    #puts "beginning radar heading"
    #puts "r1"
    return nil unless self.desired_radar_heading
    #puts "r1.5"
    return true if ((self.desired_radar_heading-1)..(self.desired_radar_heading+1)).include?(self.radar_heading)
    #puts "r2"
    amount = (self.radar_heading - self.desired_radar_heading).abs
    #puts "r3"
    puts self.desired_radar_heading.inspect
    if direction_to_turn(self.radar_heading,self.desired_radar_heading) == :right
      #turn right
      #puts "r5"
      #turn_radar amount > 60 ? -60 : -amount
      turn_gun( amount > 30 ? 30 : amount )
    else
      #turn_radar amount > 60 ? 60 : amount 
      turn_gun( amount > 30 ? -30 : -amount )
      #puts "r6"
    end
    #puts "ending radar heading"
    return true
  end
  
  
  # Utilities  
  def go_to_location(location)
    self.movement_directive = CoordinateDirective.new(self,location)
  end
  
  
  def direction_to_turn(from,to)
    return nil if from == to
    left = 0
    right = 0
    froml = from.to_i
    fromr = from.to_i
    
    #puts "f #{from} t #{to}"
    while(froml != to.to_i && fromr != to.to_i )
      froml = froml + 1
      fromr = fromr - 1
      
      froml = 0 if froml >= 360
      fromr = 360 if fromr <= 0
      #puts "#{froml} #{fromr}"
      raise if froml > 1000
    end
    
    return :left if froml == to.to_i
    return :right if fromr == to.to_i
  end
  
  
  def stop_directive
    d = Directive.new(self) do |robot|
      puts "stopping"
      robot.desired_speed = 0
    end
    
    d.end_condition = Proc.new { |robot|
      robot.speed == 0  
    }
    
    d
  end
  
  
  class Target
    attr_accessor :locations
    
    def initialize(location)
      self.locations = [location]
    end
    
    def location
      return nil unless self.locations
      self.locations[self.locations.length-1]
    end
  end
  
  
  
  # Supporting Classes
  
  class Directive
    attr_accessor :start_tick, :end_tick, :meta, :robot, :on_complete
    attr_reader :end_condition, :action
    
    def initialize(robot, params = {}, &action)
      self.start_tick = params.delete(:start_tick)
      self.end_tick = params.delete(:end_tick)
      self.meta = params
      self.robot = robot
      @action = action
    end
    
    def action=(&action)
      @action = action
    end
    
    def end_condition=(condition)
      @end_condition = condition
    end
    
    def process!
      self.action.call(self.robot)
    end
    
    def completed?
      return false unless self.end_condition
      self.end_condition.call(self.robot)
    end
  end
  
  
  class StopDirective < Directive
    def initialize(robot)
      super(robot) do |robot|
        robot.desired_speed = 0
      end
      self.end_condition = Proc.new { |robot| robot.speed == 0 } 
    end
  end
  
  class CoordinateDirective < Directive
    def initialize(robot, to)
      super(robot) do |robot| 
        robot.desired_heading = Location.heading(robot.location,to)
        robot.desired_speed = 8 unless (to == robot.location)
      end

      self.end_condition = Proc.new { |robot| robot.location.near?(to) }
      self.on_complete = StopDirective.new(self.robot)
    end
  end
  
  class FollowTarget < Directive
    def initialize(robot)
      super(robot) do |robot|
        if robot.target
          robot.movement_directive = CoordinateDirective.new(robot, robot.target.location)
        end
      end
      #self.end_condition = Proc.new { |robot| robot.speed == 0 } 
    end
  end
  
  class FindEnemyRadar < Directive
    
    attr_accessor :radar_direction, :scanned
    
    def initialize(robot)
      self.radar_direction = 1
      self.scanned = false
      super(robot) do |robot|
        
        if robot.events['robot_scanned'].empty? 
          #puts "hi"
          #puts "hi: #{robot.desired_radar_heading}"
          robot.desired_radar_heading = (robot.desired_radar_heading||0) + 30*self.radar_direction
          robot.desired_radar_heading = robot.desired_radar_heading - 360 if robot.desired_radar_heading > 360
          robot.desired_radar_heading = robot.desired_radar_heading + 360 if robot.desired_radar_heading < 0
          self.scanned = false
        else
          robot.desired_radar_heading = (robot.desired_radar_heading||0) + 15*self.radar_direction
          robot.desired_radar_heading = robot.desired_radar_heading - 360 if robot.desired_radar_heading > 360
          robot.desired_radar_heading = robot.desired_radar_heading + 360 if robot.desired_radar_heading < 0
          self.radar_direction = self.radar_direction * -1 #unless self.scanned == false
          #self.scanned = true
          
          robot.fire 2.5
          distance = robot.events['robot_scanned'].first.first
          l = Location.get_other_location(robot.location,robot.radar_heading,distance)
          #puts "1: #{robot.location.x},#{robot.location.y} 2: #{robot.radar_heading} 3: #{distance} 4: #{l.x},#{l.y}"
          if robot.target
            robot.target.locations << l
          else
            robot.target = Target.new(l)
          end          
        end
        
      end
      
    end
  end
  
end

class Location
  attr_accessor :x, :y
  
  def initialize(x,y)
    self.x = x
    self.y = y
  end    
  
  def ==(other)
    self.x.to_i == other.x.to_i && self.y.to_i == other.y.to_i
  end
  
  def near?(other)
    other.near_x.include?(self.x.to_i) && other.near_y.include?(self.y.to_i)
  end
  
  def near_x
    (self.x.to_i-5)..(self.x.to_i+5)
  end
  
  def near_y
    (self.y.to_i-5)..(self.y.to_i+5)
  end

  def Location.heading(from,to)
    x_length = (from.x - to.x).abs
    y_length = (from.y - to.y).abs
 
    if from.y < to.y
      if from.x < to.x
        num = x_length.to_f/y_length.to_f
        #return 180 + angle
        return 270 + Location.to_degrees(Math.atan(num))
      elsif from.x > to.x
        num = y_length.to_f/x_length.to_f
        return 180 + Location.to_degrees(Math.atan(num))
      else
        return 270
      end
    elsif from.y > to.y
      if from.x < to.x
        num = y_length.to_f/x_length.to_f
        return Location.to_degrees(Math.atan(num))
      elsif from.x > to.x
        num = x_length.to_f/y_length.to_f
        return 90 + Location.to_degrees(Math.atan(num))
      else
        # x is equel
        return 90
      end
    else
      # y is equal
      if from.x < to.x
        return 0
      elsif from.x > to.x
        return 180
      else
        return nil
        # x is equel
      end
    end
  end
  
  def Location.to_degrees(radians)
    radians*(180/Math::PI)
  end
  
  def Location.distance(from,to)
    x_length = (from.x - to.x).abs
    y_length = (from.y - to.y).abs
    
    
    x_length*xlength + y_length*y_length
  end
  
  def Location.get_other_location(location,heading,distance)
    if heading >= 270 
      angle = 360 - heading
      x = location.x + (Math.cos(angle)*distance).abs
      y = location.y + (Math.sin(angle)*distance).abs
    elsif heading >= 180
      angle = 270 - heading
      y = location.y + (Math.cos(angle)*distance).abs
      x = location.x - (Math.sin(angle)*distance).abs
    elsif heading >= 90
      angle = 180 - heading
      x = location.x - (Math.cos(angle)*distance).abs
      y = location.y - (Math.sin(angle)*distance).abs
    else
      angle = heading
      x = location.x + (Math.cos(angle)*distance).abs
      y = location.y - (Math.sin(angle)*distance).abs
    end
    return Location.new(x,y)
  end
end