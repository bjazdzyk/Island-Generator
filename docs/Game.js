import Island from './IslandGenerator.js'
import { Renderer } from './Renderer.js';
import { Inventory, Item } from './Inventory.js';
import { strCoords } from "./Utils.js"

function mod(n, m) {
    return ((n % m) + m) % m;
}


let k = {}
document.addEventListener('keydown', (e)=>{
    k[e.code] = true
})

document.addEventListener('keyup', (e)=>{
    delete k[e.code]
})



export default class Game{
    constructor(canvas){

        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')

        this.island = new Island()
        this.player = new Player(this)
        this.inventory = new Inventory()
        this.renderer = new Renderer(this.canvas, this)

        this.assets = {}
        this.assets.palmaTop = new Image()
        this.assets.palmaTop.src = "/imgs/palmaTop.png"
        this.assets.palmaDown = new Image()
        this.assets.palmaDown.src = "/imgs/palmaDown.png"
        this.assets.player = new Image()
        this.assets.player.src = "/imgs/player.png"
        this.assets.grass = new Image()
        this.assets.grass.src = "/imgs/grass.png"
        this.assets.dryBush = new Image()
        this.assets.dryBush.src = "/imgs/dryBush.png"
        this.assets.blueFlower = new Image()
        this.assets.blueFlower.src = "/imgs/blueFlower.png"
        this.assets.redFlower = new Image()
        this.assets.redFlower.src = "/imgs/redFlower.png"
        this.assets.whiteFlower = new Image()
        this.assets.whiteFlower.src = "/imgs/whiteFlower.png"
        this.assets.stone = new Image()
        this.assets.stone.src = "/imgs/stone.png"
        this.assets.dungeonEntrance = new Image()
        this.assets.dungeonEntrance.src = "/imgs/dungeonEntrance.png"
        this.assets.stickItem = new Image()
        this.assets.stickItem.src = "/imgs/stick.png"


        this.items = [0]
        this.items.push(new Item('stick', this.assets.stickItem))


        this.loop(Date.now())
        this.interactionEvents()

    }
    loop(time){
        let delta = Date.now() - time

        this.renderer.update()
        this.renderer.render()

        this.movementEvents(k, delta)

        requestAnimationFrame(()=>{this.loop(time+delta)})
    }

    movementEvents(keys, delta){
        
        if(!this.inventory.guiOpen){

            if(keys['KeyW']){
                this.player.y -= this.player.speed*delta
            }
            if(keys['KeyS']){
                this.player.y += this.player.speed*delta
            }
            if(keys['KeyA']){
                this.player.x -= this.player.speed*delta
            }
            if(keys['KeyD']){
                this.player.x += this.player.speed*delta
            }
        }
    }
    interactionEvents(){
        document.addEventListener('click', (e)=>{
            if(!this.inventory.guiOpen){
                const pageX = e.pageX
                const pageY = e.pageY

                const _dcx = Math.floor((e.pageX-this.renderer._W/2)/this.renderer.cellSize+this.renderer.cellOffsetX)
                const _dcy = Math.floor((e.pageY-this.renderer._H/2)/this.renderer.cellSize+this.renderer.cellOffsetY)

                const _lx = this.renderer.lookAt.x
                const _ly = this.renderer.lookAt.y

                const x = _lx+_dcx
                const y = _ly+_dcy

                const _px = this.player.x
                const _py = this.player.y

                const _dx = Math.abs(_px-x-0.5)
                const _dy = Math.abs(_py-y-0.5)

                const _d = Math.sqrt(_dx*_dx + _dy*_dy)

                
                const tree = this.island.trees[strCoords(x, y)]

                if(_d < 7){
                    if(tree == 2){//dryBush
                        this.island.trees[strCoords(x, y)] = 0
                        this.inventory.addItem(this.items[1])
                    }
                    
                }

            }
        })
    }
}

class Player{
    constructor(game){

        this.game = game

        this.x = this.game.island.spawnPoint.x+0.5
        this.y = this.game.island.spawnPoint.y+0.5

        this.speed = 0.0075
    }
}
