exports.name = "Alibot";
var running = false;
var stay = 0;
var weird = false;
var weirdStay = 0;
var runningTo = {};
var lastPositions = [];

exports.step = function(dt, state, controller) 
{
  if (state.radar.length >= 1) {
    stay++;
    
    var closestBot = state.closest();
    // always shoot at the closest bot, even if running away.
    var shootAt = closestBot;
    
    if (state.radar.length >= 2) {
      if (stay >= 200) {
        if (running == false) {
          runningTo = state.radar[(Math.floor((Math.random()*state.radar.length)))];
          running = true;
          stay = 0;
        }
      }
    }
    if (running == true) {
      if (stay >= 200) {
        running = false;
        stay = 0;
      } else {
        closestBot = runningTo;
      }
    }
    
    var distance = Math.sqrt(Math.pow((shootAt['x'] - state['x']),2) + Math.pow((shootAt['y'] - state['y']),2))
    
    if (distance >= 150) {
      var moveToX = (closestBot['x'] - state['x'])
      var moveToY = (closestBot['y'] - state['y'])
      if (((stay % 200) == 0)||(weird==true)) {
        weird = true;
        moveToY = -moveToY;
        weirdStay++;
        if (weirdStay >= 150) {
          weird = false;
          weirdStay = 0;
        }
      }
      controller.exert(moveToX, moveToY)
    } else {
      controller.exert(-(closestBot['x'] - state['x']), -(closestBot['y'] - state['y']))
    }
    
    var aim_at = {},fire;
    
    if (distance <= 70) {
      aim_at['x'] = shootAt['x'];
      aim_at['y'] = shootAt['y'];
      fire = 3;
    } else {
      if (distance <= 100) {
        var spread = 5;
        aim_at['x'] = shootAt['x'] + Math.floor((Math.random()*spread) - (spread/2));
        aim_at['y'] = shootAt['y'] + Math.floor((Math.random()*spread) - (spread/2));
        fire = 2;
      } else {
        if (distance <= 150) {
          var spread = 10;
          aim_at['x'] = shootAt['x'] + Math.floor((Math.random()*spread) - (spread/2));
          aim_at['y'] = shootAt['y'] + Math.floor((Math.random()*spread) - (spread/2));
          fire = 1.5;
        } else {
          if (distance <= 200) {
            var spread = 20;
            aim_at['x'] = shootAt['x'] + Math.floor((Math.random()*spread) - (spread/2));
            aim_at['y'] = shootAt['y'] + Math.floor((Math.random()*spread) - (spread/2));
            fire = 1;
          } else {
            var spread = 40;
            aim_at['x'] = shootAt['x'] + Math.floor((Math.random()*spread) - (spread/2));
            aim_at['y'] = shootAt['y'] + Math.floor((Math.random()*spread) - (spread/2));
            fire = 0.1;
          }
        }
      }
    }
    
    if (state.radar.length == 1) {
      if (lastPositions.push(shootAt) > 15) {
        lastPositions = lastPositions.slice(-15);
      }
      var diffX = 0;
      var diffY = 0;
      for (var i=0; i<lastPositions.length; i++) {
        if (lastPositions[i] != undefined) {
          if (lastPositions[i+1] != undefined) {
            diffX = diffX + (lastPositions[i+1]['x'] - lastPositions[i]['x']);
            diffY = diffY + (lastPositions[i+1]['y'] - lastPositions[i]['y']);
          }
        }
      }
      var estimateX = ((diffX / lastPositions.length) * (distance / 6))
      var estimateY = ((diffY / lastPositions.length) * (distance / 6))
      aim_at['x'] = aim_at['x'] + estimateX;
      aim_at['y'] = aim_at['y'] + estimateY;
    }

    controller.aim_at(aim_at['x'],aim_at['y'])
    controller.fire(fire)
  }
}