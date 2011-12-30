require 'robot'

class WhineyBaby
  include Robot

  def tick events
    @last_fire = 0 if time == 0
    @last_stuck = 0 if time == 0
    @last_hit  = 0 if time == 0
    @last_hit = time unless events['got_hit'].empty?
    
    # whine/debug
    if !events['got_hit'].empty? || @last_hit > (time - 5)
      say "Wah!"
      # defensive !
      # turn -10
      # accelerate(1)
    end
    # found it!
    if !events['robot_scanned'].empty?
      fire 3
      turn -10
      accelerate(-1)
      @last_fire = time
    # so lost!
    elsif @last_fire < (time - 500)
        turn 2
        accelerate(-1)
    # is it still around?
    elsif @last_fire > (time - 10)
        turn -1
        accelerate(-1)
    # keep searching (not stuck on a wall)
    elsif (x < battlefield_width - 120) && 
       (y < battlefield_height - 120) &&
       (x > 120) && (y > 120)
      turn_gun 1
      turn 3
      accelerate(1)
    # keep searching (stuck on which wall)
    else
      turn_gun -10
      turn -3
      accelerate(1)
    end
  end
end
