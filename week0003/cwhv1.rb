require 'robot'

class Cwhv1
  include Robot

  def tick events
    fire 1
    accelerate 1 if speed < 8
    @turn ||= 1
    turn @turn
    @radar_turn ||= 20
    turn_radar @radar_turn
    @switching ||= false
    if heading < 5 && !@switching
      @turn = -@turn
      @switching = true
    end
    @switching = false if heading > 5 && @switching
    unless events['robot_scanned'].empty?
      @radar_turn = -@radar_turn
      diff = radar_heading-gun_heading
      diff = diff - 180 if diff >= 180
      diff = 360 + diff if diff <= -180
      turn_gun diff+@radar_turn+@turn
    end
  end
end