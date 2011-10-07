require 'robot'

class SharpShooter
   include Robot
   
  attr_accessor :base_speed
  attr_accessor :gun_multi, :tank_multi, :accel_multi
  attr_accessor :dir, :flip_count
   
  def initialize
     init_vars
  end
  
  def tick events
    accelerate @base_speed*@accel_multi
    turn @base_speed*@tank_multi
    turn_gun @base_speed*@gun_multi*@dir
    if !events['robot_scanned'].empty?
      alter_gun events['robot_scanned'].first.first
      @tank_multi = @tank_multi*@dir
      @dir = -@dir
      @accel_multi = -2*@accel_multi*0.9*@dir
      @flip_count = 0;
    else
      @gun_multi = 4
      @tank_multi = 0.8
      @accel_multi = 1.3
      @flip_count = @flip_count+1;
      if(@flip_count == 5)
        @dir = -@dir
      end
    end
    fire 0.3
    
  end
  
  def init_vars
    @base_speed = 0.9
    @gun_multi = 4
    @tank_multi = 1.6
    @accel_multi = 1.6
    @dir = 1;
    @flip_count = 99;
  end
  
  def alter_gun len
    @gun_multi = (0.5-(len/1500))*@gun_multi*@dir
  end
  
  def check_flip
    if @flip_count > 5 then
      @dir *= -1;
      @flip_count = 0
    end
    @flip_count += 1
  end
  
end