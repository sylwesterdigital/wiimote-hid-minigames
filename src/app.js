import css from './style.css';
var contentData = "./assets/Content.json";

import * as PIXI from 'pixi.js'
//import { Application, Container, Graphics, Loader, Sprite, Texture, Text } from 'pixi.js'

/* P5 */
//import P5  from 'p5'

/* Greensock */
import { gsap} from "gsap";
gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

import { PixiPlugin } from "gsap/PixiPlugin";

/* Pixi Sound */
import { sound } from '@pixi/sound';


//import { BasisLoader } from '@pixi/basis';
import { Loader } from '@pixi/loaders';

//Loader.registerPlugin(BasisLoader);
// Use this if you to use the default
//BasisLoader.loadTranscoder('./assets/js/basis_transcoder.js', './assets/js/basis_transcoder.wasm');

//import { DataReportMode, IRDataType, IRSensitivity } from "./wiimote-webhid/src/const.js";
import WIIMote from './wiimote-webhid/src/wiimote.js'

// const controller = new Controller();
let performance = {}
performance.start = new Date().getTime();
performance.loaded = null;
performance.result = null;

let loadingEl = null;
let loadingElMsg = null;

let wapp = {};
wapp.W = $(window).width();
wapp.H = $(window).height();
let w = window;

const cols_blue1 = 0x132CAD;
const cols_grey = 0x5c5c5c;
const cols_white = 0xffffff;

const flipSpeed = 0.01;
let flipKey = 0;
let flipActions = {
    "UP": {
        state: false
    },
    "DOWN": {
        state: false
    },
    "LEFT": {
        state: false
    },
    "RIGHT": {
        state: false
    }
}
w.flipActions = flipActions;



const selectorSpeed = 0.01;
let selectorKey = 0;

let mC
let canvasItems = []
let paintingArea

let vBrush1, vBrush2, vBrush3, vBrush4, vBrush5;
let vBrushes = []

let sBrush1, sBrush2, sBrush3, sBrush4, sBrush5;
let sBrushes = []


let scale1 = 0.14

let selected;
let selectedGraphic = 0;

let selectedTool = 0;
let selectedToolGraphic = 0;

let editToolSelection;
let editToolSelectionData;

let paintTool;

var device = null; //bluetooth connection
var wiimote = null; //wiimote

let wiimotes = [];
window.wiimotes = wiimotes;

var buttonState = {
    A: false,
    B: false,
    MINUS: false,
    DPAD_LEFT: false,
    DPAD_RIGHT: false
}

var dtwTest = null;
var app = null;
let ledK = 0;

let textures = []


const soundsData = {
    hit1: './assets/audio/fx/Hit_Hurt4.wav',    
    fail1: './assets/audio/fx/ohh1.mp3',
    fail2: './assets/audio/fx/ohh2.mp3',
    fail3: './assets/audio/fx/ohh3.mp3',
    fail4: './assets/audio/fx/ohh4.mp3',
    joined: './assets/audio/fx/Pickup_Coin2.wav',
    boing: './assets/audio/fx/blip1.mp3',
    gameover: './assets/audio/fx/Win1.wav',
    start: './assets/audio/fx/Fine1.wav'    
};

// Add to the PIXI loader
for (let name in soundsData) {
    PIXI.Loader.shared.add(name, soundsData[name]);
}


w.sound = sound


/* P5 experiment */



class Ball {

  constructor(xin, yin, din, idin, oin, width, height, name) {
    this.x = xin;
    this.y = yin;
    this.vx = 0;
    this.vy = 0;
    this.diameter = din;
    this.id = idin;
    this.others = oin;
    this.width = width;
    this.height = height;
    this.name = name;
    this.hit = 0;
    this.owner = ''

  }

  collide() {


    // if(!(String(this.name)).includes("wound") && !(String(this.name)).includes("post")) {

        for (let i = this.id + 1; i < balls.length; i++) {


          // console.log(others[i]);
          let dx = this.others[i].x - this.x;
          let dy = this.others[i].y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          let minDist = this.others[i].diameter / 2 + this.diameter / 2;


            // if(String(this.name).includes("post") && distance < 150) {
            //     console.log("collision with post", this.name, this.id)
            // }


            //console.log(distance);
          //console.log(minDist);


          if (distance < minDist) {
            //console.log("2",this.name,this.others[i].name);

            let angle = Math.atan2(dy, dx);
            let targetX = this.x + Math.cos(angle) * minDist;
            let targetY = this.y + Math.sin(angle) * minDist;
            let ax = (targetX - this.others[i].x) * spring;
            let ay = (targetY - this.others[i].y) * spring;
            this.vx -= ax;
            this.vy -= ay;
            this.others[i].vx += ax;
            this.others[i].vy += ay;


            if(String(this.others[i].name).includes("wound")) {
                //console.log("KICK",this.name,'==>',this.others[i].name)
                this.owner = this.others[i].name;

            }


            if(String(this.name).includes("ball") && String(this.others[i].name).includes("post")) {

                //console.log("BOOM",this.name,this.owner,'==>',this.others[i].name)

                if(game.playing == true) {


                    if(this.others[i].name == "post1") {
                        addPoints(0,-10)

                    }
                    if(this.others[i].name == "post2") {
                        addPoints(1,-10)
                    }

                    if(this.others[i].name == "post3") {
                        addPoints(2,-10)
                    }

                    if(this.others[i].name == "post4") {
                        addPoints(3,-10)
                    }   

                    if(this.others[i].name == "post5") {
                        addPoints(4,-10)
                    }   

                    sound.play('hit1');

                    if(this.owner) {
                        addUserPoints(this.owner)
                    }

                    this.hit = 1;

                    //console.log("scored:",this.owner)
                    
                    //ptxt.text = ""+wiimotes[id].data.points+"";


                }

            }


          }
        }



    }




  move() {

    //("wund12").includes("wound")

    //
    // Normal Balls
    // --------------
    if(!(String(this.name)).includes("wound") && !(String(this.name)).includes("post")) {

        if(this.hit != 1) {

            this.vy += gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.width = $(window).width();
            this.height = $(window).height();


            if (this.x + this.diameter / 2 > this.width) {
              this.x = this.width - this.diameter / 2;
              this.vx *= friction;
            } else if (this.x - this.diameter / 2 < 0) {
              this.x = this.diameter / 2;
              this.vx *= friction;
            }
            if (this.y + this.diameter / 2 > this.height) {
              this.y = this.height - this.diameter / 2;
              this.vy *= friction;
            } else if (this.y - this.diameter / 2 < 0) {
              this.y = this.diameter / 2;
              this.vy *= friction;
            }

        } else {

            this.x = -100;
            this.y = -100;

            //console.log("OUT")

            //balls.splice(balls.findIndex( item => item.id === this.id ),1)

        }

        // if(this.y <= 100) {
        //     // splice
        //     balls.splice(balls.findIndex( item => item.id === this.id ),1)
        //     barticles.splice(barticles.findIndex( item => item.id === this.id ),1)

        //     app.stage.getChildByName("mC").getChildByName("ba_"+this.id).visible = false;

        //     // if(app.stage.getChildByName("mC").getChildByName("ba_"+this.id)) {
        //     //     app.stage.getChildByName("mC").getChildByName("ba_"+this.id).destroy()
        //     // }
        //     console.log(this.id)
        //     //mC.getChildByName(this.name).destroy();
        // }

    } else {
        //console.log(this.name)
        for(let g in wiimotes) {
            let id = wiimotes[g].id;
            //console.log(id)

            //
            // Players Wounds
            // ---------------
            if(this.name == "wound"+id && window.mouse) {
                //this.x = window.mouse.x
                //this.y = window.mouse.y
                this.x = vBrushes[id].x;
                this.y = vBrushes[id].y;
            }
        }
    }
  }

  display() {

    //ellipse(this.x, this.y, this.diameter, this.diameter);
    //console.log(this.name)

    if(barticles[this.id]) {

        barticles[this.id].x = this.x
        barticles[this.id].y = this.y
        barticles[this.id].angle += this.vx

    }


  }

}


let balls = [];
let barticles = [];

let numBalls = 100;
let spring = 0.2;
let gravity = 0.2;
let friction = -0.1;

let width = wapp.W; 
let height = wapp.H;

function addP(i) {

        //let i = balls.length;

        let tx = textures[Math.floor(Math.random() * textures.length)]
        //let tx = textures[Math.floor(Math.random()*3)]
        const p = new PIXI.Sprite(tx);
        
        let s1 =  Math.random()*0.1+ 0.03;
        
        p.scale.set(s1,s1);
        p.name = "ba_"+i;
        

        // p.angle = Math.random()*5;
        // p.angleSpeed = Math.random()*2 - Math.random()*2;

        p.anchor.set(0.5)
        // p.x = -p.width - Math.random()*300
        // p.y = Math.floor(Math.random() * (app.screen.height - 150)) + 50;
        // p.speedX = Math.random()*2 + 0.2;
        // p.speedY = Math.random()*0.5 - Math.random()*0.5;
        
        //p.zIndex = 1;
        
        

        //p.x = balls[i].x
        //p.y = balls[i].y


        //console.log(p.x,p.y)


        mC.addChild(p);

        barticles.push(p)

}

w.barticles = barticles;



/* 
        Goal Posts 
    ---------------------
                            */


var goalPosts = [];


function reposGoalPosts() {

    let fl = wapp.W;
    let arr = [fl*0.17,fl*0.34,fl*0.50,fl*0.64,fl*0.81]

    for (let a in balls) {
        let b = balls[a]
        if(String(b.name).includes("post")) {
            let id = parseInt(String(b.name).substr(4,1));
            b.x = arr[id-1]
            b.y = 150; 
        }
    }
}
w.reposGoalPosts = reposGoalPosts;


function addGoalPost(id) {

    console.log("addGoalPost", id)

    let pad = 15;
    let offset = 150;

    let color = globColors[id]

    // Circle + line style 1
    const c = new PIXI.Graphics();

    c.lineStyle(4, color, 0.95);
    c.beginFill(0x000000, 0.05);
    c.drawCircle(0, 0, 45);
    c.endFill();

    const tx = app.renderer.generateTexture(c);
    const spr = PIXI.Sprite.from(tx);

    spr.name = "goalPost"+goalPosts.length;
    spr.anchor.set(0.55)

    goalPosts.push(spr)


    console.log("goalPosts.length",goalPosts.length)
    
    balls[balls.length] = new Ball(
      spr.x,
      spr.y,
      spr.width,
      balls.length,
      balls,
      spr.width,
      spr.height,
      "post"+goalPosts.length
    );  

    mC.addChild(spr);
    barticles.push(spr) 


    reposGoalPosts()     



}

w.addGoalPost = addGoalPost;
w.goalPosts = goalPosts;


function resetBalls() {
    for(var e in balls) {
        let r = balls[e];
        if(String(r.name).includes("ball")) {
            r.x = wapp.W*0.33 + (Math.random()*wapp.W)*0.33;
            r.y = 0.65*(Math.random()*wapp.H) + wapp.H*0.35;
            r.hit = 0;
            r.owner = ''            
        }
    } 
}
w.resetBalls = resetBalls;


function addStaticBall() {

    let i = balls.length;
    let wi = String(wiimotes.length-1);
    
    console.log("addStaticBall",wi)

    balls[i] = new Ball(

      Math.random()*$(window).width(),
      Math.random()*$(window).height(),
      100,
      i,
      balls,
      width,
      height,
      "wound"+wi
    );

    //let tx = textures[Math.floor(Math.random() * textures.length)]
    const p = new PIXI.Sprite.from("./assets/Samsung_Internet_logo.png");
    
    let s1 = 0.18;//Math.random()*0.1+ 0.01;
    
    p.scale.set(s1,s1);
    
    p.name = "wound"+wiimotes.length-1;
    
    // p.angle = Math.random()*5;
    // p.angleSpeed = Math.random()*2 - Math.random()*2;

    p.anchor.set(0.5)
    // p.x = -p.width - Math.random()*300
    // p.y = Math.floor(Math.random() * (app.screen.height - 150)) + 50;
    // p.speedX = Math.random()*2 + 0.2;
    // p.speedY = Math.random()*0.5 - Math.random()*0.5;
    
    //p.zIndex = 1;
    
    //p.x = balls[i].x
    //p.y = balls[i].y

    //console.log(p.x,p.y)

    mC.addChild(p);

    barticles.push(p)


}

w.addStaticBall = addStaticBall;



function addBalls() {

    console.log("addBalls", numBalls)


    for (let i = 0; i < numBalls; i++) {

        balls[i] = new Ball(
          Math.random()*$(window).width(),
          Math.random()*$(window).height(),
          (Math.random() * 55) + 10,
          i,
          balls,
          width,
          height,
          "ball"+i
        );
      }

    window.balls = balls;

    for (let i = 0; i < numBalls; i++) {
        addP(i);
    }

    //addStaticBall();





}


window.addBalls = addBalls;


// lets add







// sound.play('my-sound');


function circleLed() {
    setInterval(function() {
        ledK++;
        if (ledK >= 4) {
            ledK = 0;
        }
        for (var i = 0; i < 4; i++) {
            if (i == ledK) {
                wiimotes[wiiN].toggleLed(ledK)
            }
        }
    }, 500)
}
let currentID


function enableControls() {

    console.log("enableControls", wiimotes.length)

    // //wiimotes[wiiN].toggleLed(2)
    // circleLed()

    let wiiN = wiimotes.length-1;
    let toggle = wiiN;

    wiimotes[wiiN].initiateIR()

    wiimotes[wiiN].toggleLed(wiiN)

    if(wiiN > 4) {
        wiimotes[wiiN].toggleLed(0)
        wiimotes[wiiN].toggleLed(1)
        wiimotes[wiiN].toggleLed(2)
        wiimotes[wiiN].toggleLed(3)
    }

    // wiimotes[wiiN].BtnListener = function(buttons) {

    //     /* buttons

    //         A: false
    //         B: false
    //         DPAD_DOWN: false
    //         DPAD_LEFT: false
    //         DPAD_RIGHT: false
    //         DPAD_UP: false
    //         HOME: false
    //         MINUS: false
    //         ONE: false
    //         PLUS: false
    //         TWO: false

    //     */


    wiimotes[wiiN].id = wiiN;

    //wiimotes[wiiN].data.points = 0;

    wiimotes[wiiN].BtnListener = (buttons,myID) => {


        //console.log()

        //console.log("wiiN:",wiiN)

        var buttonJSON = JSON.stringify(buttons, null, 2);




        //console.log(this.parent)


        // const { x, y } = vBrushes[0]

        // if (buttons.MINUS == true) {


        //     //console.log("MINUS", id)


        //     if (buttonState.MINUS == false) {
        //         buttonState.MINUS = true
        //     }
        // }

        // if (buttons.MINUS == false && buttonState.MINUS == true) {
        //     var a = app.renderer.plugins.interaction.hitTest({ x: x, y: y })

        //     if (a != undefined) {
        //         a.alpha = 0.5
        //         // a.destroy();
        //     }
        //     buttonState.MINUS = false
        // }


        // B is in the belly of the controller
        //
        if (buttons.B == true) {


            //var a = app.renderer.plugins.interaction.hitTest({ x: x, y: y, id: myID })


            if (buttonState.B == false) {


                console.log("B:", myID)

                currentID = myID

                //a.emit("pointertap");

                dropPaint(myID)

                //a.emit("mousedown")

                buttonState.B = true


            }

            //a.emit("mousemove")
        }

        if (buttons.B == false && buttonState.B == true) {

            //var a = app.renderer.plugins.interaction.hitTest({ x: x, y: y })

            buttonState.B = false
            //a.emit("mouseup")

        }


        if (buttons.HOME == true) {
            clearAllCanvas();
        }

        if (buttons.A == true) {
            leftRightSelector(1,myID)
        }


        if (buttons.ONE == true) {
            app.playing = true;
        }

        if (buttons.TWO == true) {
            app.playing = false;
        }




        if (buttons.MINUS == true) {
            textureScale(-1,myID);
        }

        if (buttons.PLUS == true) {
            textureScale(1,myID);
        }


        // flippin
        if (buttons.DPAD_UP == true) {
            flipScale("UP",myID);
        }
        if (buttons.DPAD_DOWN == true) {
            flipScale("DOWN",myID);
        }
        if (buttons.DPAD_LEFT == true) {
            flipScale("LEFT",myID);
        }
        if (buttons.DPAD_RIGHT == true) {
            flipScale("RIGHT",myID);
        }




        /*        if (buttons && buttons.DPAD_RIGHT == true) {
                    leftRightSelector(1)
                }*/



        /*        if(document.getElementById('buttons').innerHTML != buttonJSON){
                  document.getElementById('buttons').innerHTML = buttonJSON
                }*/



    }

    wiimotes[wiiN].AccListener = (x, y, z) => {

        if (vBrushes[wiiN]) {
            vBrushes[wiiN].angle = (x * -1 + 120) * -1;
            let angles = String(vBrushes[wiiN].angle).substr(0, 4)

            //document.getElementById('accA').innerHTML = angles
        }

        //document.getElementById('accX').innerHTML = x
        //document.getElementById('accY').innerHTML = y
        //document.getElementById('accZ').innerHTML = z

        //document.getElementById('accXYZ').innerHTML = x + " " + y + " " + z;


    }

    wiimotes[wiiN].IrListener = (pos) => {

        if (pos.length < 1) {
            return
        }

        let valX = 1000 - pos[0]["x"];
        if(valX < 0) {
            valX = 0;
        }

        let perc = valX/1000;
        let pX = wapp.W * perc;

        vBrushes[wiiN].x = pX; 
        vBrushes[wiiN].y = pos[0]["y"];

        sBrushes[wiiN].x = vBrushes[wiiN].x;
        sBrushes[wiiN].y = vBrushes[wiiN].y;
        
        sBrushes[wiiN].angle = vBrushes[wiiN].angle * 5; //90*(Math.PI/180)
        //document.getElementById("IRdebug").innerHTML = JSON.stringify(pos, null, true)
        //document.getElementById("IRdebug").innerHTML = pos[0]["x"] + " " + pos[0]["y"] + "_pX:" + pX + " _sW:" + _sW;
    }




}

window.enableControls = enableControls




var emojis = ['???? See-No-Evil Monkey','???? Hear-No-Evil Monkey','???? Speak-No-Evil Monkey','???? Collision','???? Dizzy','???? Sweat Droplets','???? Dashing Away','???? Monkey Face','???? Monkey','???? Gorilla','???? Dog Face','???? Dog','???? Poodle','???? Wolf Face','???? Fox Face','???? Cat Face','???? Cat','???? Lion Face','???? Tiger Face','???? Tiger','???? Leopard','???? Horse Face','???? Horse','???? Unicorn Face','???? Zebra','???? Cow Face','???? Ox','???? Water Buffalo','???? Cow','???? Pig Face','???? Pig','???? Boar','???? Pig Nose','???? Ram','???? Ewe','???? Goat','???? Camel','???? Two-Hump Camel','???? Giraffe','???? Elephant','???? Rhinoceros','???? Mouse Face','???? Mouse','???? Rat','???? Hamster Face','???? Rabbit Face','???? Rabbit','???? Chipmunk','???? Hedgehog','???? Bat','???? Bear Face','???? Koala','???? Panda Face','???? Paw Prints','???? Turkey','???? Chicken','???? Rooster','???? Hatching Chick','???? Baby Chick','???? Front-Facing Baby Chick','???? Bird','???? Penguin','???? Dove','???? Eagle','???? Duck','???? Owl','???? Frog Face','???? Crocodile','???? Turtle','???? Lizard','???? Snake','???? Dragon Face','???? Dragon','???? Sauropod','???? T-Rex','???? Spouting Whale','???? Whale','???? Dolphin','???? Fish','???? Tropical Fish','???? Blowfish','???? Shark','???? Octopus','???? Spiral Shell','???? Snail','???? Butterfly','???? Bug','???? Ant','???? Honeybee','???? Lady Beetle','???? Cricket','???? Spider','???? Spider Web','???? Scorpion','???? Bouquet','???? Cherry Blossom','???? White Flower','???? Rosette','???? Rose','???? Wilted Flower','???? Hibiscus','???? Sunflower','???? Blossom','???? Tulip','???? Seedling','???? Evergreen Tree','???? Deciduous Tree','???? Palm Tree','???? Cactus','???? Sheaf of Rice','???? Herb','??? Shamrock','???? Four Leaf Clover','???? Maple Leaf','???? Fallen Leaf','???? Leaf Fluttering in Wind','???? Mushroom','???? Chestnut','???? Crab','???? Shrimp','???? Squid','???? Globe Showing Europe-Africa','???? Globe Showing Americas','???? Globe Showing Asia-Australia','???? New Moon','???? Waxing Crescent Moon','???? First Quarter Moon','???? Waxing Gibbous Moon','???? Full Moon','???? Waning Gibbous Moon','???? Last Quarter Moon','???? Waning Crescent Moon','???? Crescent Moon','???? New Moon Face','???? First Quarter Moon Face','???? Last Quarter Moon Face','??? Sun','???? Full Moon Face','???? Sun With Face','??? Star','???? Glowing Star','???? Shooting Star','??? Cloud','??? Sun Behind Cloud','??? Cloud With Lightning and Rain','???? Sun Behind Small Cloud','???? Sun Behind Large Cloud','???? Sun Behind Rain Cloud','???? Cloud With Rain','???? Cloud With Snow','???? Cloud With Lightning','???? Tornado','???? Fog','???? Wind Face','???? Rainbow','??? Umbrella','??? Umbrella With Rain Drops','??? High Voltage','??? Snowflake','??? Snowman','??? Snowman Without Snow','??? Comet','???? Fire','???? Droplet','???? Water Wave','???? Christmas Tree','??? Sparkles','???? Tanabata Tree','???? Pine Decoration'];

emojis.rand = {
    give: function() {
        let rs = Math.floor(Math.random()*emojis.length-1);
        let em = emojis[rs];
        let emoji = em.split(' ')[0];
        console.log(emoji, rs);
        let name = em.substr(2,em.length);
        return {emoji:emoji,name:name,pos:rs};
    },
    get: function(num) {
        let em = emojis[num];
        console.log(em, emojis[num]);
        let emoji = em.split(' ')[0];
        let name = em.substr(2,em.length);
        return {emoji:emoji,name:name,pos:num};     
    }
    
}


/* 
    Countdown 
    ---------------

                        */


let game = {}
game.playing = false;


var countdown = {

    start: function(time) {
        resetBalls();
        let r = app.stage.getChildByName("mC").getChildByName("Countdown");
        r.text = "GO GO GO!";

        let nx = wapp.W/2 - r.width/2;
        let ny  = wapp.H/2 - r.height/2;
        gsap.fromTo(r, 1.5, {x:nx, y:-r.height}, {x:nx, y: ny, duration: 3.5, ease: "elastic.out(1, 0.8)"}); 

        r.alpha = 1; 
        fadein(r)
        this.left = time;
        sound.play('start');
        this.id = setInterval(this.display, 1000)
        game.playing = true;
    },

    display: function() {
        let r =  countdown
        r.left -= 1;
        let str = new Date(r.left * 1000).toISOString().substr(11, 8)
        let g = app.stage.getChildByName("mC").getChildByName("Countdown")
        g.text = str;
        g.alpha = 0.05;
        let mx = wapp.W/2 - g.width/2;
        let my  = wapp.H/2 - g.height/2;
        g.x = mx;
        g.y = my;            

        if(r.left <= 0) {
            let f = app.stage.getChildByName("mC").getChildByName("Countdown");
            f.text = "GAME OVER";
            let nx = wapp.W/2 - f.width/2;
            let ny  = wapp.H/2 - f.height/2;
            gsap.fromTo(f, 1.5, {x:nx, y:-f.height}, {x:nx, y: ny, duration: 3.5, ease: "elastic.out(1, 0.8)"});
            f.alpha = 1;            
            sound.play('gameover');
            r.stop();

            //setTimeout(startAgain, 15000)
            setTimeout(showWinner, 3000);

        }
        //console.log('tick', r.left);
    },

    stop: function() {
        game.playing = false;
        console.log("countdown.stop")
        clearInterval(this.id);
        let r = app.stage.getChildByName("mC").getChildByName("Countdown");
        fadein(r);
        document.getElementById("buttons").style.display = "block";
        resetBalls()
    },

    create: function(t,c) {
        if(!app.stage.getChildByName("mC").getChildByName("Countdown")) {
            let fontSize = 140;
            const txt = new PIXI.Text(t, {fontSize: fontSize, fontFamily: "DIN Condensed", align: "center", fill:"white"});
            txt.name = "Countdown"
            txt.alpha = 0.2;
            c.addChild(txt);
            let nx = wapp.W/2 - txt.width/2;
            let ny  = wapp.H - txt.height - fontSize;
            gsap.fromTo(txt, 1.5, {x:nx, y:wapp.H+txt.height}, {x:nx, y: ny, duration: 3.5, ease: "elastic.out(1, 0.8)"})
        }
            this.init();
        //barticles.push(txt)
    },

    init: function() {
        console.log("countdown.init")
        this.id = "countdownID";
        this.limit = 30;
        this.key = 0;
        this.left = 0;        
    }
}
w.countdown = countdown;





/* 
    Personalization 
    --------------------

    */

function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

// var localStorage = window.localStorage;
// var dataKeys = {
//     data: function(val) {
//         return (typeof(val) === 'undefined' ? localStorage.userData : localStorage.userData = val);
//     }
// }


var players_data = []
w.players_data = players_data;

function setTmpUserData(id) {

        console.log("setTmpUserData - wiimotes.length - ", wiimotes.length)

        let tmp_user_data = {};        
        //dataKeys.data(JSON.stringify(tmp_user_data));

        tmp_user_data.id = 'Anon' + Math.random() * 1000;
        tmp_user_data.emoji = document.getElementById('profile-avatar').innerHTML;
        tmp_user_data.uid = create_UUID();
        tmp_user_data.nickname = document.getElementById('ta-nickname').value;
        tmp_user_data.bio = document.getElementById('ta-bio').value;
        tmp_user_data.attachment = '';
        tmp_user_data.points = 0;
        tmp_user_data.games = {};

        players_data.push(tmp_user_data)
        //console.log(" tmp_user_data >>>>>> 1",tmp_user_data);

        wiimotes[id].data = tmp_user_data;
        //console.log(" wiimotes[id].data >>>>>> 1",wiimotes[id].data);

}


function startAgain() {

        console.log("start game");

        if(app.stage.getChildByName("mC").getChildByName("winnerList")) {
            app.stage.getChildByName("mC").getChildByName("winnerList").visible = false;
        }

        max_wiimotes = wiimotes.length;

        countdown.create('00:00:00', app.stage.getChildByName("mC"))

        countdown.start(60)

        document.getElementById("buttons").style.display = "none";
}



let max_wiimotes = 5;

function userConfig() {

    console.log("userConfig");

    document.getElementById("game-start-b").innerHTML = "START";

    document.getElementById("game-start-b").onclick = function() {

        startAgain();

     }



    document.getElementById("profile-save-b").onclick = async function(e) {

        e.preventDefault();

        try {


            const devices = await navigator.hid.requestDevice({
                filters: [{ vendorId: 0x057e }],
            });

            device = devices[0];
            const wiimote = new WIIMote(device)
            wiimotes.push(wiimote);

            document.getElementById("request-hid-device").innerText = "+ "+(wiimotes.length+1);

            setTmpUserData(wiimotes.length-1)

            addHUD(wiimotes.length-1)
            
            addBrushes(wiimotes.length-1)

            addStaticBall()

            document.getElementById("profile-c").style.display = "none";

            if(wiimotes.length >= max_wiimotes) {
             document.getElementById("request-hid-device").style.display = "none";  
            }

            loadingEl.style.display = "none";

        } catch (error) {
            console.log("An error occurred.", error);

        }

        if (!device) {
            console.log("No device was selected.");

        } else {

            console.log(`HID: ${device.productName}`);

                setTimeout(() => {

                enableControls()
            }, 200);

        }

    }


    $('#profile-avatar').on('click', function (e) {

      e.preventDefault();

      var new_emoji = emojis.rand.give();
      var num = wiimotes.length+1;
      var nickname = 'Anon';
      
      document.getElementById('profile-avatar').innerHTML = new_emoji.emoji;
      document.getElementById('ta-bio').innerHTML = new_emoji.name;
      document.getElementById('ta-nickname').innerHTML = nickname+''+num;

      //tmp_user_data.nickname = $('#ta-nickname').val();
      //dataKeys.data(JSON.stringify(tmp_user_data));
      //document.getElementById('profile-b').innerHTML = tmp_user_data.emoji;  

    });


    initController();


}
w.userConfig = userConfig;

   
function mashAvatars() {
      let new_emoji = emojis.rand.give();
      let num = wiimotes.length+1;
      let nickname = 'Anon';
      document.getElementById('profile-avatar').innerHTML = new_emoji.emoji;
      document.getElementById('ta-bio').innerHTML = new_emoji.name;
      document.getElementById('ta-nickname').innerHTML = nickname+''+num;
}



function initController() {

    console.log("initController")

    var buttonsW = document.getElementById("buttonsW")
    var conBut = document.createElement("button");
    

    conBut.innerText = "+ "+(wiimotes.length+1);
    conBut.className = "bu";
    conBut.id = "request-hid-device";

    buttonsW.appendChild(conBut)

    conBut.onclick = function() {

         document.getElementById("profile-c").style.display = "block";

         mashAvatars()


         if(wiimotes.length > 0) {
            document.getElementById("game-start-b").style.display = "inline-block";
         }


    }

}

async function test(d) {
    d.addEventListener("rawdata", function(data) {
        dtwTest.push(data)
    });

    await d.rawdata.start();
}

/* ----- NEW STUFF --------- */

// ATTACHED TO 'HOME' BUTTON

function clearAllCanvas() {

    canvasItems.forEach(item => {
        item.destroy()
    });
    canvasItems = []


}





/* --------- */

/*function gestureEvent(name) {

    const mouvements = {
        "up": 5,
        "down": 6,
        "swing": 8
    }

    const texture = Texture.from('./assets/GAM_WALL_EXP/GAM_svg/DE-MARIA_-0' + mouvements[name] + '.svg')
    const svg = new Sprite(texture);

    svg.anchor.set(0.5);
    //svg.scale.set(0.3,0.3)

    svg.x = Math.floor(Math.random() * (app.screen.width - 150)) + 50
    svg.y = Math.floor(Math.random() * (app.screen.height - 150)) + 50

    mC.addChild(svg);
}*/

// function _connected(d){
//     controller.rawDataListener(d.deviceID, test)
//     tempGUI.text = "Controller "+ d.device.name + " connected"

//     dtwTest = new dtw(gestureEvent)

//     test(d)

//     console.log("_connected: ", d)
//     setTimeout(() => {
//         mC.removeChild(tempGUI);
//         mC.removeChild(tempLOGO)
//     }, 2000);
// }

// function help() {
//     var a  = controller.currentDevices()
//     console.log(a)
// }



let particles = []
w.particles = particles;
let particlesK = 0


function addEmmiter(n) {

    console.log("addEmmiter",n)

    for(var i=0; i < n; i++) {
        
        let tx = textures[0]
        const p = new PIXI.Sprite(tx);
        
        let s1 = 2;//Math.random()*0.1+ 0.01;
        
        p.scale.set(s1,s1);
        p.name = "p_"+parseInt(i+particlesK);
        

        p.angle = Math.random()*5;
        p.angleSpeed = Math.random()*2 - Math.random()*2;

        p.anchor.set(0.5)
        p.x = -p.width - Math.random()*300
        p.y = Math.floor(Math.random() * (app.screen.height - 150)) + 50;
        p.speedX = Math.random()*2 + 0.2;
        p.speedY = Math.random()*0.5 - Math.random()*0.5;
        
        //p.zIndex = 1;
        particles.push(p)
        mC.addChild(p);

    }
    particlesK += n;    
    document.getElementById("game-msg").innerHTML = "Particles: "+n
}
w.addEmmiter = addEmmiter;




function addBrushes(id) {

    console.log("addBrushes",id)

    let n = id+1;

    let col = globColors[id]

    // add container + text
    let d = wiimotes[id].data;
    //let user = d.emoji +" "+d.nickname;
    let user = d.emoji;

    const textUsername = new PIXI.Text(""+user+"", {fontSize: 88, fontFamily: "DIN Condensed", align: "right", fill:col});
    textUsername.x = 0;
    textUsername.y = -10;
    textUsername.name = "user"+id;

    const textPoints = new PIXI.Text(""+d.points+"", {fontSize: 32, fontFamily: "DIN Condensed", align: "left", fill:col});
    textPoints.x = 90;
    textPoints.y = 60;
    textPoints.name = "points"+id;

    const r = new PIXI.Container();

    const im = new PIXI.Sprite.from("./assets/brushes/vBrush-"+n+".png"); //Sprite.from(textures[5])
    r.zIndex = 1000000+id;
    r.name = "vBrush"+id;
    im.alpha = 0;

    r.addChild(im);
    r.addChild(textUsername);
    r.addChild(textPoints);



    vBrushes.push(r)


    //let texture = textures[0]
    let sr = new PIXI.Sprite(textures[0]);

    sr.zIndex = 5000+id;
    sr.scale.set(scale1 * 0.6)
    sr.anchor.set(0.5)
    sr.minScale = 0.1;
    sr.maxScale = 2;

    sBrushes.push(sr)

    mC.addChild(sr)
    mC.addChild(r)


}

function bounce(r) {

    let tl3 = gsap.timeline({delay: 0,repeat: 0,repeatDelay: 0});   

    tl3
        .to(r.scale, 0.05, { ease: "power1", x: scale1*1.5, y: scale1*1.5, yoyo:true, repeat:3, repeatDelay: 0, 
            onComplete: function () {
                r.scale.set(scale1,scale1);
            }},"+=0")
        .from(r, 0.3, { ease: "power1", opacity: 0},"<")

}

function fadein(r) {

    let tl3 = gsap.timeline({delay: 0,repeat: 0,repeatDelay: 0});
    tl3
        .from(r, 0.03, { ease: "power1", alpha:0, yoyo:true, repeat:2, repeatDelay: 0},"+=0") 

}
w.fadein = fadein;


let globColors = [0xFF0000,0x00FF00,0x0000FF,0xFF00FF,0xFFFF00,0x00FFFF,0xF0F0F0]


function showWinner() {

    let f = app.stage.getChildByName("mC").getChildByName("Countdown");
    f.text = "";

    //winners container
    if(!app.stage.getChildByName("mC").getChildByName("winnerList")) {
        const rc = new PIXI.Container();
        rc.name = "winnerList";
        mC.addChild(rc);
    } else {
        app.stage.getChildByName("mC").getChildByName("winnerList").visible = true;
    }

    //winners list
    let fontSize = 68; 
    let fY = fontSize*0.2;
    let add = '';

    players_data.sort((a, b) => b.points - a.points)

    for(let i=0; i<wiimotes.length; i++) {
        console.log(i);
        let color = globColors[i]

        if(i == 0) {
            add = '????'
        }
        if(i == 1) {
            add = '????'
        }
        if(i == 2) {
            add = '????'
        }
        if(i == 3) {
            add = '????'
        }
        if(i == 4) {
            add = ''
        }


        let txt = add +' ' +players_data[i].emoji +" "+players_data[i].points +' '+add;

        if(!app.stage.getChildByName("mC").getChildByName("result"+i)) {
            let f = new PIXI.Text(""+txt+"", {fontSize: fontSize, fontFamily: "DIN Condensed", align: "right", fill:color});
            let nx = wapp.W/2 - f.width/2;
            let ny = 180+i*(fontSize+fY);
            f.x = nx;  
            f.y = ny;
            f.name = "result"+i;
            f.alpha = 1;
            app.stage.getChildByName("mC").getChildByName("winnerList").addChild(f)
        } else {
          let rf = app.stage.getChildByName("mC").getChildByName("result"+i)  
          rf.text = txt;
        }
    }

    setTimeout(startAgain, 15000)



}
w.showWinner = showWinner;




function addHUD(id) {

        console.log("addHUD",id)
      
        let color = globColors[id];

        // EXTRA LIFES
        //----------------
        let fontSize = 68; 
        let fY = fontSize*0.2;
        let n = parseInt(id)+1;

        let d = wiimotes[id].data;
        let user = d.emoji +" "+d.nickname;

        let r = new PIXI.Text(""+user+"", {fontSize: fontSize, fontFamily: "DIN Condensed", align: "right", fill:color});
        let nx = wapp.W/2 - r.width/2;
        let ny = 150+id*(fontSize+fY)
        r.position.x = nx;
        //r.position.y = 150+id*(fontSize+fY);

        r.name = "R"+id

        mC.addChild(r);    


        gsap.fromTo(r, 0.75, {y:wapp.H+r.height}, {y: ny, duration: 3.5, ease: "elastic.out(1, 0.8)", onComplete:function() {
            r.alpha = 0.25;
        }});


        sound.play('joined');

        addGoalPost(id)


    // body...
}

w.addHUD = addHUD;




function initPixi() {

    console.log("initPixi");

    //let view = document.getElementById("screen")

    app = new PIXI.Application({
        backgroundColor: cols_blue1,
        resizeTo: window
    });

    app.playing = false;

    window.app = app

    document.body.appendChild(app.view);

    app.stage.addChild(mC);

    function dropPaint(id) {

        console.log("dropPaint",id)

        let x = sBrushes[id].x;
        let y = sBrushes[id].y;


        let textureId = sBrushes[id].tid;

        pop(textureId, x, y, id) 


    }

    w.dropPaint = dropPaint;



    function pop(textureId, x, y, id) {

        var texture, svg;

        texture = textures[textureId]

        svg = new PIXI.Sprite(texture);
        svg.scale.set(scale1, scale1);

        svg.x = x
        svg.y = y

        svg.speedX = Math.random() * 3 - Math.random() * 3
        svg.speedY = Math.random() * 3 - Math.random() * 3

        svg.angle = vBrushes[id].angle * 5;

        svg.scale.set(sBrushes[id].scale.x, sBrushes[id].scale.y);


        svg.anchor.set(0.5);
        svg.zIndex = 1;

        mC.addChild(svg);

        canvasItems.push(svg)

        return svg
    }


    function leftRightSelector(dir,id) {

        if (dir < 1) {
            selectorKey -= selectorSpeed;
        } else {
            selectorKey += selectorSpeed;
        }
        let v = Math.floor(selectorKey);


        if (v >= textures.length) {
            v = 1;
            selectorKey = v;
        }

        if (v < 1) {
            v = textures.length;
            selectorKey = v;
        }


        selectedGraphic = v;

        sBrushes[id].texture = textures[v]
        sBrushes[id].tid = v; 

        console.log(v)

    }

    w.leftRightSelector = leftRightSelector;


    function freeState(obj,arg) {
        for(let a in obj) {
             if(obj[arg].state == "pressed" && a != arg) {
                  obj[a].state = false;
             }
        }
    }
    w.freeState = freeState;



    function flipScale(d,id) {
        // console.log(d)
        if(flipActions[d].state == false) {
            flipActions[d].state = "pressed";
            if(d == "UP" || d == "DOWN") {
                sBrushes[id].scale.y = - sBrushes[id].scale.y;
            }
            if(d == "LEFT" || d == "RIGHT") {
                sBrushes[id].scale.x = - sBrushes[id].scale.x; 
            }
            freeState(flipActions,d);
        }
    }

    w.flipScale = flipScale;



    function textureScale(dir,id) {

        console.log("textureScale, dir", dir)

        sBrushes[id].scale.x += dir * 0.001;

        sBrushes[id].scale.y = sBrushes[id].scale.x;

    }

    w.textureScale = textureScale;

    selectedTool = "paint"

    window.pop = pop



    app.ticker.add((delta) => {

        if (app.playing) {

            canvasItems.forEach(item => {
                if (item.x > wapp.W) {
                    item.x = -item.width;
                }
                if (item.x < -item.width) {
                    item.x = wapp.W;
                }
                if (item.y > wapp.H) {
                    item.y = -item.height;
                }
                if (item.y < -wapp.H) {
                    item.y = wapp.H + item.height;
                }
                item.x += item.speedX;
                item.y += item.speedY;
                item.angle += 0.1
                //console.log(wapp.W, item.x)
            });
        }


        if (particles.length > 0) {

            particles.forEach(p => {

                if (p.x > wapp.W + p.width) {
                    p.x = -p.width - Math.random()*300
                    p.y = Math.floor(Math.random() * (app.screen.height - 150)) + 50;
                    p.speedX = Math.random()*4 + 0.3;
                    p.speedY = Math.random()*1 - Math.random()*1;
                }

                if (p.y > wapp.H + p.height) {
                    p.y = -p.height;
                }

                if (p.y < -wapp.H - p.height) {
                    p.y = wapp.H + p.height;
                }

                p.x += p.speedX;
                p.y += p.speedY;

                p.angle += p.angleSpeed;

                //console.log(wapp.W, item.x)
                /* check collision */
                for(let g in sBrushes) {

                    let b = sBrushes[g];
                    let c = p.position;
                    let r = b.position;

                    //console.log(Math.abs(r.y-c.y))
                  //if(Math.abs(r.y-c.y)<=(p.height*.7 ) && Math.abs(r.x-c.x)<=r.width*.7) {

                  if(Math.abs(r.y-c.y)<=b.height*b.scale.x+p.height*p.scale.x && Math.abs(r.x-c.x) <= b.width*b.scale.x+p.width*p.scale.x) {  

                    //console.log('collision with ',p.name);

                    //mC.removeChild(p);

                    gsap.to(p, {duration: 0.25, width: 0, height:100, onComplete:function() {
                        //console.log("next");
                        mC.removeChild(p);
                        //pointsContainer.removeChild(r);
                    }});

                    particles.splice(particles.findIndex( item => item.name === p.name ),1)

                    let points = Math.floor(Math.abs(p.speedX*p.speedY*10));

                    
                    //addPoints(g,points)
                    
                    document.getElementById("game-msg").innerHTML = "particles: "+particles.length;

                    //speedY = - (speedY+2);
                    //addPointsCloud(10, stick.position.x,  stick.position.y)
                    //playBoing(1);
                    // change tint... 
                    //stick.tint = tints[Math.floor(Math.random()*tints.length)];

                    }
                }
            });


        } else {

            //addEmmiter(Math.ceil(5+Math.random()*50));

        }

        /* Balls
            -----------------------------
                                        */
        if (balls.length > 0) {
            balls.forEach(ball => {
                 ball.collide();
                 ball.move();
                 ball.display();
            });
        } else {
            addBalls();
            //addStaticBall();
        }

    })



    //initController();




}
w.initController = initController;


function resizeGame() {
    //console.log("resizeGame: >", $(window).width())

    reposGoalPosts()

    wapp.W = $(window).width();
    wapp.H = $(window).height();
    document.getElementById("IRdebug").innerHTML = wapp.W + " x " + wapp.H;
    app.resize(wapp.W, wapp.H);
}

window.textures = textures;




function addSprites(resources) {
    console.log("addSprites")
    Object.keys(resources).forEach(key => {
        //console.log(resources[key]);
        //console.log('addSprites:', key)
        if(resources[key].texture) {
            textures.push(resources[key].texture)
        }
    });
    setupStage()
}




function loadAssets() {

    console.log("loadAssets", wapp.data.shapes[0].n);


    const loader = PIXI.Loader.shared;


    for (let i = 0; i <= wapp.data.shapes.length - 1; i++) {

        let path = wapp.data.shapes[i].p;
        let name = wapp.data.shapes[i].n;
        //console.log(i, name, path)
        loader.add(name, path)
    }

    loader.load((loader, resources) => {})


    //loader.use(parsingMiddleware)

    loader.onProgress.add((res) => {
        //console.log("loading...", res.progress)
        loadingElMsg.innerHTML = ""+Math.round(res.progress)+"%";
    }); // called once per loaded/errored file

    loader.onError.add((err) => {
        console.log("Error loading...")
        loadingElMsg.innerHTML = "Error"+err+"";
    }); // called once per errored file

    loader.onLoad.add(() => {
        console.log("- loaded")
    }); // called once per loaded file    

    loader.onComplete.add(() => {
        console.log("onComplete");
        performance.loaded = new Date().getTime();
        performance.result = (performance.loaded - performance.start) / 1000 + " sec"
        console.log("onComplete: in", performance.result);
        loadingElMsg.innerHTML = "Loader complete in "+performance.result;
        const resources = loader.resources;

        addSprites(resources);

    });


}




function addUserPoints(owner) {


    //console.log("owner", owner)

    var id = parseFloat(String(owner).substr(5,3));
    
    let d = wiimotes[id].data;

    //console.log('id',id) 


    let user = d.emoji +" "+d.nickname;
    let points = parseInt(d.points);

    app.stage.getChildByName("mC").getChildByName("vBrush"+id).children[2].text = points;    

}



function addPoints(id,p) {

    let n = parseInt(id)+1;
    wiimotes[id].data.points +=p;

    // goalPost text
    let ptxt = app.stage.getChildByName("mC").getChildByName("R"+id);
    //ptxt.text = ""+n+": "+wiimotes[id].points+"";
    ptxt.text = ""+wiimotes[id].data.points+"";
    ptxt.alpha = 1;

    fadein(ptxt)

    sound.play('boing');

    // position of goalPost text the same goalPost;
    ptxt.x = app.stage.getChildByName("mC").getChildByName("goalPost"+id).x - ptxt.width/2;
    ptxt.y = app.stage.getChildByName("mC").getChildByName("goalPost"+id).y - ptxt.height/2;
    
    //var val = parseFloat(String(owner).substr(5,3));
    // wiimotes[id].data.score += 10;
    
    // let d = wiimotes[id].data;
    // let user = d.emoji +" "+d.nickname;
    // let score = parseInt(d.score);
    
    // console.log('d',d)

    // app.stage.getChildByName("mC").getChildByName("vBrush"+id).children[1].text = ""+user+": +"+score;

}




function setupStage() {

    console.log("setupStage");

    mC = new PIXI.Container();
    mC.name = "mC";
    mC.interactive = true
    mC.buttonMode = true
    mC.sortableChildren = true

    initPixi();

    userConfig();
}




/*

    Init and Config
    ----------------------

                        */

let mouse;
//window.mouse = mouse

function captureMouse(event) {
  let mouse = {x: 0, y: 0, event: null},
      body_scrollLeft = document.body.scrollLeft,
      element_scrollLeft = document.documentElement.scrollLeft,
      body_scrollTop = document.body.scrollTop,
      element_scrollTop = document.documentElement.scrollTop
      // offsetLeft = element.offsetLeft,
      // offsetTop = element.offsetTop;
    let x, y;
    if (event.pageX || event.pageY) {
      x = event.pageX;
      y = event.pageY;
    } else {
      x = event.clientX + body_scrollLeft + element_scrollLeft;
      y = event.clientY + body_scrollTop + element_scrollTop;
    }
    // x -= offsetLeft;
    // y -= offsetTop;
    mouse.x = x;
    mouse.y = y;
    mouse.event = event;
    window.mouse = mouse;
    //console.log(window.mouse)
    //return mouse;
}



function loadConfig(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', contentData, true);
    xobj.onreadystatechange = function() {
        //console.log('xobj.readyState',xobj.readyState)
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}



function initConfig() {
    loadingEl = document.getElementById('loading')
    loadingElMsg = document.getElementById('loading-msg')
    loadConfig(function(response) {
        // Parse JSON string into object
        wapp.data = JSON.parse(response);
        loadAssets();
    });
}

initConfig();

window.addEventListener('resize', resizeGame, false);
window.addEventListener('mousemove', captureMouse, false);