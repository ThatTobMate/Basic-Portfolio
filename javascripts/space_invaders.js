$(function(){
var display, input, frames, spFrame, lvlFrame, lives;
var alSprite, taSprite, ciSprite;
var aliens, dir, tank, bullets, cities;

function main(){

  display = new Screen(504, 600);

  input = new InputHandeler()

  var img = new Image()
  img.addEventListener("load", function(){
    alSprite = [
    [new Sprite(this, 0, 0, 22, 16), new Sprite(this, 0, 16, 22, 16)],
    [new Sprite(this, 22, 0, 16, 16), new Sprite(this, 22, 16, 16, 16)],
    [new Sprite(this, 38, 0, 24, 16), new Sprite(this, 38, 16, 24, 16)]

    ]
    taSprite = new Sprite(this, 62, 0, 22, 16)
    ciSprite = new Sprite(this, 84, 8, 36, 24)

    init()
    run()
  })
  img.src = "res/invaders.png"
}

function init(){
  frames = 0;
  spFrame = 0;
  lvlFrame = 60;
  dir = 1;
  lives = 3

  tank = {
    sprite: taSprite,
    x:(display.width - taSprite.w)/2,
    y: display.height - (30 + taSprite.h)
  }

  bullets= [];

  cities = {
    canvas: null,
    y: tank.y - (30 + ciSprite.h),
    h: ciSprite.h,

    init: function(){
        // debugger
      // this.y = 0
      // this.h = 600  
      this.canvas = document.createElement("canvas");
      this.canvas.width = display.width;
      this.canvas.height = this.h;
      this.ctx = this.canvas.getContext("2d")
      console.log(this)

      for(var i = 0; i<4;i++){
        this.ctx.drawImage(ciSprite.img, ciSprite.x, ciSprite.y, ciSprite.w, ciSprite.h, 68 + 111*i, 0, ciSprite.w, ciSprite.h)
      }
    },
    generateDamage: function(x, y){
      x = Math.floor(x/2) * 2;
      y = Math.floor(y/2) * 2;

      this.ctx.clearRect(x-2, y-2, 4, 4)
      this.ctx.clearRect(x+2, y-4, 2, 4)
      this.ctx.clearRect(x+4, y, 2, 2)
      this.ctx.clearRect(x+2, y+2, 2, 2)
      this.ctx.clearRect(x-4, y+2, 2, 2)
      this.ctx.clearRect(x-6, y, 2, 2)
      this.ctx.clearRect(x-4, y-4, 2, 2)
      this.ctx.clearRect(x-2, y-6, 2, 2)
    },
    hits: function(x, y){
      y -= this.y;
      var data = this.ctx.getImageData(x, y, 1, 1);
      if(data.data[3] !== 0){
        this.generateDamage(x, y);
        return true
      }else{
        return false;
      }
    }
  };

  cities.init()

  aliens = [];
  var rows = [1, 0, 0, 2, 2];
  for (var i = 0, len = rows.length; i < len; i++){
    for(var j = 0; j < 10; j++){
      var a = rows[i];
      aliens.push({
        sprite: alSprite[a],
        x: 30 + j*30 + [0, 4, 0][a],
        y: 30 + i*30,
        w: alSprite[a][0].w,
        h: alSprite[a][0].h
      })
    }
  }
}

function run(){
  var loop = function(){
    update();
    render();

    window.requestAnimationFrame(loop, display.canvas)
  }
  window.requestAnimationFrame(loop, display.canvas)
}

function update(){


  if(input.isDown(37)){
    tank.x -= 4;

  }
  if(input.isDown(39)){
    tank.x += 4;

  }

  tank.x = Math.max(Math.min(tank.x, display.width - (30 + taSprite.w)), 30);

  if(input.isPressed(83)){
    bullets.push(new Bullet(tank.x +10, tank.y, -8, 2, 6, "#fff"))
  }

  for(var i = 0, len = bullets.length; i<len; i++){
    var b = bullets[i]
    b.update();

    if(b.y + b.height < 0 || b.y > display.height){
      bullets.splice(i, 1);
      i--;
      len--;
      continue;
    }

    var h2 = b.height * 0.5;
    if(cities.y < b.y + h2 && b.y+h2 < cities.y + cities.h){
      if (cities.hits(b.x, b.y+h2)){
        bullets.splice(i, 1);
        i--;
        len--;
        continue;
      }
    }

    if(AABBIntersect(b.x, b.y, b.width, b.height, tank.x, tank.y, tank.sprite.w, tank.sprite.h)){
      bullets.splice(i, 1);
      i--;
      len--;
      lives -=1
      $('#lives').text(lives);

      if(lives == 0){
        $('.gameover').text("Game Over");
        document.getElementById('play').style.pointerEvents = 'auto';
        throw new Error();
      }
    }
    for(var j = 0, len2 = aliens.length; j<len2; j++){
      var a = aliens[j]
      if(AABBIntersect(b.x, b.y, b.width, b.height, a.x, a.y, a.w, a.h)){
        aliens.splice(j, 1);
        j--;
        len2--;
        bullets.splice(i, 1);
        i--;
        len--;
        console.log(len2)
        if(len2 == 0){
          $('.gameover').text("You Win");
          document.getElementById('play').style.pointerEvents = 'auto';
          throw new Error();
        }

        switch(len2){
          case 30: {
            lvlFrame = 40;
            break;
          }
          case 10:{
            lvlFrame = 20;
            break;
          }
          case 5:{
            lvlFrame = 10;
            break;
          }
          case 1:{
            lvlFrame = 8;
            break;
          }
        }
      }
    }
  }

  if(Math.random() < 0.03 && aliens.length >0){
    var a = aliens[Math.round(Math.random()*(aliens.length-1))]
    for(var i = 0, len = aliens.length; i<len; i++){
      var b = aliens[i]

      if(AABBIntersect(a.x, a.y, a.w, 100, b.x, b.y, b.w, b.h )){
        a = b
      }
    }bullets.push(new Bullet(a.x + a.w*0.5, a.y + a.h, 4, 2, 4, "#fff"))
  }


  frames++
  if(frames % lvlFrame === 0){
    spFrame = (spFrame +1) %2

    var _max = 0, _min = display.width
    for(var i = 0, len = aliens.length; i<len; i++){
      var a = aliens[i];
      a.x += 30 * dir;

      _max = Math.max(_max, a.x + a.w);
      _min = Math.min(_min, a.x);
    }
    if(_max > display.width - 30 || _min < 0){
      dir *= -1
      for(var i = 0, len = aliens.length; i<len; i++){
        aliens[i].x += 30 * dir;
        aliens[i].y += 30;
      }
    }
  }
}

function render(){
  display.clear()
  for (var i = 0, len = aliens.length; i < len; i++){
    var a = aliens[i];
    display.drawSprite(a.sprite[spFrame], a.x, a.y)
  }

          // for(i = 0, len = lives; i<len; i++){
          //  console.log(i, lives)
          // }

          display.ctx.save()
          for(var i = 0, len=bullets.length; i < len; i++){
            display.drawBullet(bullets[i])
          }
          display.ctx.restore()

          display.ctx.drawImage(cities.canvas, 0, cities.y)

          display.drawSprite(tank.sprite, tank.x, tank.y)
        }

        // main();
        // window.onload = new Screen(504, 600);
        $('#play').on('click', function(){
          $('.gameover').text("");
          $('#placed').empty()
          main();
          $('.life_text').show()
          $('#lives').text("3");
          document.getElementById('play').style.pointerEvents = 'none';
        })
});