import css from './style.css';
var contentData = "./assets/Content.json";

import * as PIXI from 'pixi.js'
//import { Application, Container, Graphics, Loader, Sprite, Texture, Text } from 'pixi.js'

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

let vBrush1, vBrush2, vBrush3, vBrush4;
let vBrushes = []

let sBrush1, sBrush2, sBrush3, sBrush4;
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
    fail1: './assets/audio/fx/ohh1.mp3',
    fail2: './assets/audio/fx/ohh2.mp3',
    fail3: './assets/audio/fx/ohh3.mp3',
    fail4: './assets/audio/fx/ohh4.mp3',
    joined: './assets/audio/fx/Pickup_Coin2.wav',
    boing: './assets/audio/fx/blip1.mp3'
};

// Add to the PIXI loader
for (let name in soundsData) {
    PIXI.Loader.shared.add(name, soundsData[name]);
}


w.sound = sound




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

    wiimotes[wiiN].initiateIR()

    wiimotes[wiiN].toggleLed(wiiN)

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
    wiimotes[wiiN].points = 0;

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

            document.getElementById('accA').innerHTML = angles
        }

        //document.getElementById('accX').innerHTML = x
        //document.getElementById('accY').innerHTML = y
        //document.getElementById('accZ').innerHTML = z

        document.getElementById('accXYZ').innerHTML = x + " " + y + " " + z;


    }

    wiimotes[wiiN].IrListener = (pos) => {

        if (pos.length < 1) {
            return
        }

        var _sW = 1366; //app.stage.width
        var pX = _sW - pos[0]["x"];

        if (pX >= 1365) {
            pX = 1365
        }

        vBrushes[wiiN].x = pX; //max 1016
        vBrushes[wiiN].y = pos[0]["y"] //max 760


        sBrushes[wiiN].x = vBrushes[wiiN].x;
        sBrushes[wiiN].y = vBrushes[wiiN].y;

        sBrushes[wiiN].angle = vBrushes[wiiN].angle * 5; //90*(Math.PI/180)



        //document.getElementById("IRdebug").innerHTML = JSON.stringify(pos, null, true)
        document.getElementById("IRdebug").innerHTML = pos[0]["x"] + " " + pos[0]["y"] + "_pX:" + pX + " _sW:" + _sW;
    }




}

window.enableControls = enableControls



function initController() {

    console.log("initController - buttonsW")

    var buttonsW = document.getElementById("buttonsW")

    var conBut = document.createElement("button");

    conBut.innerText = "+ "+(wiimotes.length+1);

    conBut.className = "bu";
    conBut.id = "request-hid-device"

    conBut.onclick = async function() { // Note this is a function
        // controller.newDevice(pop, _connected)

        try {

            const devices = await navigator.hid.requestDevice({
                filters: [{ vendorId: 0x057e }],
            });

            device = devices[0];
            
            const wiimote = new WIIMote(device)

            wiimotes.push(wiimote);

            conBut.innerText = "+ "+(wiimotes.length+1);

            addHUD(wiimotes.length-1)

            addBrushes(wiimotes.length-1)


            //playBoing(1);
            //sound.play('boing')


            if(wiimotes.length >= 4) {
             document.getElementById("request-hid-device").style.display = "none";  
            }

            //window.wiimote = wiimotes[0];

            //console.log("devices array:", devices)
            //console.log("device", device)
            
            //document.getElementById("buttons").style.display = "none";
            loadingEl.style.display = "none";

        } catch (error) {
            console.log("An error occurred.", error);

        }

        if (!device) {
            console.log("No device was selected.");

        } else {

            console.log(`HID: ${device.productName}`);

            setTimeout(() => {

                // mC.removeChild(tempGUI)
                // mC.removeChild(tempLOGO)

                enableControls()
            }, 200);

        }
    }

    buttonsW.appendChild(conBut)


    /*    window.navigator.hid.addEventListener('connect', ({device}) => {
          console.log(`HID connected: ${device.productName}`);
        });   


        window.navigator.hid.addEventListener('disconnect', ({device}) => {
          console.log(`HID disconnected: ${device.productName}`);
        });     


        device.addEventListener("inputreport", event => {
          const { data, device, reportId } = event;

          // Handle only the Joy-Con Right device and a specific report ID.
          if (device.productId !== 0x2007 && reportId !== 0x3f) return;

          const value = data.getUint8(0);
          if (value === 0) return;

          const someButtons = { 1: "A", 2: "X", 4: "B", 8: "Y" };
          console.log(`User pressed button ${someButtons[value]}.`);
        });*/


    // let virtControl = document.createElement("button");

    //     virtControl.className = "bu";
    //     virtControl.innerText = "+ V";

    //     virtControl.onclick = function() { // Note this is a function
    //         console.log("Virtual controller connected")

    //         setTimeout(() => {
    //             mC.removeChild(tempGUI);
    //             mC.removeChild(tempLOGO)
    //         }, 2000);
    //     }

    // buttonsW.appendChild(virtControl)


    // var clearBtn = document.createElement("button");

    //     clearBtn.innerText = "CLEAR PAINTING";
    //     clearBtn.className = "bu";

    //     clearBtn.onclick = function() { // Note this is a function
    //         canvasItems.forEach(item => {
    //             item.destroy()
    //         });
    //         canvasItems = []
    //         // mC.destroy()
    //         // app.stage.destroy(true)
    //         // document.getElementsByTagName("canvas")[0].remove()
    //         // // mC = new Container();
    //         // initPixi()
    //         // app.stage.addChild(mC);
    //     };

    // buttonsW.appendChild(clearBtn)

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


function startGame(argument) {
    // body...
}



let particles = []
w.particles = particles;
let particlesK = 0

function addEmmiter(n) {

    console.log("addEmmiter",n)


    // add particles on the left an
    // d move them to the right them back them to the left

    for(var i=0; i < n; i++) {

        let tx = textures[Math.floor(Math.random() * textures.length)]

        const p = new PIXI.Sprite(tx);



        let s1 = Math.random()*0.1+ 0.01;

        p.scale.set(s1,s1);

        p.name = "p_"+parseInt(i+particlesK);

        p.angle = Math.random()*5;
        p.angleSet = Math.random()*2 - Math.random()*2;

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


    document.getElementById("game-msg").innerHTML = "addEmmiter: "+n

}
w.addEmmiter = addEmmiter


function addBrushes(id) {

    console.log("addBrushes",id)

    let n = id+1;

    // brush with a number
    const r = new PIXI.Sprite.from("./assets/brushes/vBrush-"+n+".png"); //Sprite.from(textures[5])
    r.zIndex = 1000000+id;
    r.name = "vBrush"+id;

    vBrushes.push(r)


    //let texture = textures[0]
    let sr = new PIXI.Sprite(textures[0]);

    sr.zIndex = 5000+id;
    sr.scale.set(scale1 * 0.9)
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


function addHUD(id) {

        console.log("addHUD",id)

        let colors = ["yellow","red","green","blue"]
        let color = colors[id];

        // EXTRA LIFES
        //---------------- 
        let n = parseInt(id)+1;
        let r = new PIXI.Text("Player "+n+": 0 PTS", {fontSize: 24, fontFamily: "Avenir, Roboto, sans-serif", align: "right", fill:color});
        r.position.x = 16;
        r.position.y = 50+id*36;
        r.name = "R"+id

        mC.addChild(r);    


        sound.play('joined');


    // body...
}

w.addHUD = addHUD;




function initPixi() {

    console.log("initPixi");

    let view = document.getElementById("screen")

    app = new PIXI.Application({
        /*        width: wapp.W, 
                height: wapp.H, */
        backgroundColor: cols_blue1,
        resolution: window.devicePixelRatio || 1,
        resizeTo: window
    });

    app.playing = false;


    // app.renderer.plugins.interaction.cursorStyles.default = "url('./src/assets/cursor/1/cursor_96.png'), auto";
    // app.renderer.plugins.interaction.cursorStyles.hover = "url('./src/assets/cursor/1/cursor_96.png'), auto";
    // app.renderer.plugins.interaction.cursorStyles.pointer = "url('./src/assets/cursor/1/cursor_96.png'), auto";



    window.app = app

    view.appendChild(app.view);

    app.stage.addChild(mC);

    // mC.addChild(vBrush1)
    // mC.addChild(vBrush2)
    // mC.addChild(vBrush3)
    // mC.addChild(vBrush4)

    // mC.addChild(sBrush1)
    // mC.addChild(sBrush2)
    // mC.addChild(sBrush3)
    // mC.addChild(sBrush4)


    function dropPaint(id) {
        // body...
        console.log("dropPaint",id)

        let x = sBrushes[id].x;
        let y = sBrushes[id].y;

        //let tid = sBrushes[id].id;

        let textureId = sBrushes[id].tid;

        pop(textureId, x, y, id) 





    }

    w.dropPaint = dropPaint;



    function pop(textureId, x, y, id) {

        var texture, svg;

        // if (textureId == "random") {

        //     texture = textures[Math.floor(Math.random() * textures.length)]
        //     svg = new PIXI.Sprite(texture);
        //     svg.x = Math.floor(Math.random() * (app.screen.width - 150)) + 50
        //     svg.y = Math.floor(Math.random() * (app.screen.height - 150)) + 50

        // } else {


            texture = textures[textureId]

            svg = new PIXI.Sprite(texture);
            svg.scale.set(scale1, scale1);

            svg.x = x
            svg.y = y

            svg.speedX = Math.random() * 3 - Math.random() * 3
            svg.speedY = Math.random() * 3 - Math.random() * 3

            svg.angle = vBrushes[id].angle * 5;

            svg.scale.set(sBrushes[id].scale.x, sBrushes[id].scale.y);



        // }

        svg.anchor.set(0.5);
        svg.zIndex = 1;

        // svg.buttonMode = true;

        mC.addChild(svg);

        //console.log("pop(textureId, x, y)", textureId, x, y, "textures.length", textures.length)

        //console.log("pop");


        canvasItems.push(svg)

        return svg
    }


    function leftRightSelector(dir,id) {

        // leftRightSelector

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

        //console.log("leftRightSelector(dir), selectedGraphic", dir, selectedGraphic)
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


        // if(sBrushes[0].scale.x < sBrushes[0].maxScale){
        //     sBrushes[0].scale.x += 0.01
        // } else {
        //     sBrushes[0].scale.x = sBrushes[0].maxScale            
        // }

        // if(sBrushes[0].scale.x < sBrushes[0].minScale) {
        //     sBrushes[0].scale.x = sBrushes[0].minScale;

        // }


        sBrushes[id].scale.y = sBrushes[id].scale.x;


        //sBrushes[0].scale.set(nscale)

    }


    w.textureScale = textureScale;




    // function _selected(textureId, x, y) {

    //     console.log("_selected: textureId, x, y", textureId, x, y)

    //     if (selected != null) {
    //         mC.removeChild(selected)
    //     }

    //     selected = new Graphics();
    //     selected.beginFill(0xFFC0CB, 0.4);
    //     selected.drawRect(x - 35, wapp.H - 80, 80, 80);
    //     selected.endFill();
    //     selected.zIndex = 10
    //     selectedGraphic = textureId

    //     mC.addChild(selected)
    // }


    function changeTool(tool) {
        console.log("changeTool(tool)", tool)
        selectedTool = tool
    }

    w.changeTool = changeTool;


    function _toolSelect(tool, x, y) {

        console.log("_toolSelect(tool, x, y)", tool, x, y)

        if (selectedTool != null) {
            mC.removeChild(selectedToolGraphic)
        }

        selectedToolGraphic = new PIXI.Graphics();
        selectedToolGraphic.beginFill(0xffffff, 0.4);
        selectedToolGraphic.drawRect(x, y, 80, 80);
        selectedToolGraphic.endFill();
        selectedToolGraphic.zIndex = 10
        selectedTool = tool;

        mC.addChild(selectedToolGraphic)
    }

    function resetEditTool() {

        console.log("resetEditTool")

        editToolSelection = null
        canvasItems.map((x) => {
            x.alpha = 1
            x.interactive = false
            x.removeAllListeners();
        })
    }

    function loadTools() {

        console.log("loadTools")

        // const graphics = new Graphics();
        // graphics.beginFill(cols_grey);
        // graphics.drawRect(0, 0, 80, wapp.H);
        // graphics.endFill();

        // graphics.zIndex = 10

        // //mC.addChild(graphics)


        // paintTool = new Text("Paint", { fontFamily: 'Arial', fontSize: 24, fill: 0xffffff, align: 'center' })
        // paintTool.x = 12
        // paintTool.y = 25
        // paintTool.interactive = true
        // paintTool.zIndex = 11


        // paintTool.on("pointertap", () => {

        //     _toolSelect("paint", 0, 0)
        //     resetEditTool()
        // })

        //mC.addChild(paintTool)


        // const editTool = new Text("Edit", { fontFamily: 'Arial', fontSize: 24, fill: 0xffffff, align: 'center' })
        // editTool.x = 18
        // editTool.y = 25 * 4
        // editTool.interactive = true
        // editTool.zIndex = 11


        // editTool.on("pointertap", () => {

        //     _toolSelect("edit", 0, 75)

        //     console.log("editTool.on pointertap");


        //     canvasItems.forEach(item => {

        //         item.interactive = true
        //         item.alpha = 0.2

        //         item.on("pointertap", () => {

        //             canvasItems.map(x => x.alpha = 0.2)

        //             // if(editToolSelection != null){
        //             //     editToolSelection.removeAllListeners();
        //             // }

        //             editToolSelection = item;
        //             item.alpha = 1

        //             item
        //                 .on('mousedown', (event) => {
        //                     if (editToolSelection == item) {
        //                         editToolSelectionData = vBrushes[0]
        //                     }
        //                 })

        //                 .on('touchstart', (event) => {

        //                 })

        //                 .on('mouseup', onDragEnd)
        //                 .on('mouseupoutside', onDragEnd)
        //                 .on('touchend', onDragEnd)
        //                 .on('touchendoutside', onDragEnd)

        //                 .on('mousemove', onDragMove)

        //                 .on('touchmove', onDragMove);


        //         })
        //     });
        // })

        //mC.addChild(editTool)


    }


    function onDragEnd() {
        editToolSelectionData = null
    }

    function onDragMove() {
        if (editToolSelectionData != null) {
            editToolSelection.x = editToolSelectionData.x
            editToolSelection.y = editToolSelectionData.y
        }
    }

    function loadTextures() {

        const bottomBackgroundTool = new PIXI.Graphics();
        bottomBackgroundTool.beginFill(cols_grey);
        bottomBackgroundTool.drawRect(0, wapp.H - 80, wapp.W, 100);
        bottomBackgroundTool.endFill();
        bottomBackgroundTool.zIndex = 10
        //mC.addChild(bottomBackgroundTool)

        const list = [0, 1, 3, 5, 7, 8, 11, 14, 15]

        // list.forEach((item, index) => {


        //     const x = 50+(index * 110)
        //     const y = 560

        //     const svgItem = pop(item, x, y)

        //     svgItem.scale.set(0.6, 0.6)
        //     svgItem.interactive = true
        //     svgItem.zIndex = 11


        //     // svgItem.on('pointertap', () => {
        //     //     // alert(textureId, x, y)
        //     //     _selected(item, x, y)
        //     // });


        // });
    }


    loadTools()

    loadTextures()

    window.pop = pop


    changeTool("paint");


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

                p.angle += p.angleSet;

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
                    addPoints(g,points)
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

            addEmmiter(Math.ceil(5+Math.random()*50));

        }



    })



    initController();




}


function resizeGame() {

    console.log("resizeGame:", $(window).width())

    wapp.W = $(window).width();
    wapp.H = $(window).height();

    document.getElementById("IRdebug").innerHTML = wapp.W + " x " + wapp.H;


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


function parsingMiddleware() {

    console.log("parsingMiddleware");

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


/*function loadAssets() {

    console.log("loadAssets"); 


    const loader = Loader.shared; 

    for (let index = 1; index <= 17; index++) {
        const strI = (index < 10) ? "0" + index : index + '';
        let strName = 'shape'+strI
        console.log("strName:", strName)

        //loader.add(strName, './assets/shapes/basis/'+strI+'.basis')
        loader.add(strName, './assets/shapes/png-tiny/'+strI+'.png')
    }

    loader.load((loader, resources) => {})


    //loader.use(parsingMiddleware)

    loader.onProgress.add(() => {
        console.log("loading...")
    }); // called once per loaded/errored file

    loader.onError.add(() => {
        console.log("Error loading...")
    }); // called once per errored file

    loader.onLoad.add(() => {
        console.log("- loaded")        
    }); // called once per loaded file    

    loader.onComplete.add(() => {
        console.log("onComplete");
        const resources             = loader.resources;
        addSprites(resources);
    });


}*/


/*function addVBrush(n) {
    const vBrush1 = new PIXI.Sprite.from("./assets/brushes/vBrush-"+n+".png"); //Sprite.from(textures[5])
    vBrush1.zIndex = 1000000+n;
    vBrush1.name = "vBrush"+n

    vBrushes.push()
}
*/

function addPoints(id,p) {

    let n = parseInt(id)+1;
    wiimotes[id].points +=p;
    app.stage.getChildByName("mC").getChildByName("R"+id).text = "Player "+n+": "+wiimotes[id].points+" PTS";

    bounce(sBrushes[id])

    sound.play('boing');

}


function setupStage() {

    console.log("setupStage");

    mC = new PIXI.Container();
    mC.name = "mC";
    mC.interactive = true
    mC.buttonMode = true
    mC.sortableChildren = true

    paintingArea = new PIXI.Graphics();

    paintingArea.beginFill(cols_blue1);
    paintingArea.drawRect(0, 0, wapp.W, wapp.H);
    paintingArea.endFill();
    paintingArea.zIndex = 1
    paintingArea.interactive = true



    paintingArea.on('pointertap', (pointer) => {


        console.log('pointertap', pointer.data.global)

        const { x, y, id } = vBrushes[currentID] //pointer.data.global



        if (selectedTool == "paint") { //  && x > 80+50
            let svgItem = pop(selectedGraphic, x, y, id)
            canvasItems.push(svgItem)
        }

        //console.log("paintingArea.on('pointertap', (pointer), selectedTool", pointer, selectedTool, currentID)


    });

    //mC.addChild(paintingArea)



    initPixi();


}





/*

    Init and Config
    ----------------------

                        */


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


//read setup
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