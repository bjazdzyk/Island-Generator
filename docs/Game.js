import Island from './IslandGenerator.js'
import { Renderer } from './Renderer.js';
import { Inventory, Item } from './Inventory.js';
import { strCoords } from "./Utils.js"
import assetMap from './assets.json' assert { type: 'json' };


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
        this.inventory = new Inventory(this)
        this.renderer = new Renderer(this.canvas, this)

        //load assets
        this.assets = {}
        for(let assetName in assetMap){
            this.assets[assetName] = new Image()
            this.assets[assetName].src = assetMap[assetName].url
        }

        this.items = [0]
        this.items.push(new Item(1, 'stick', this.assets.stickItem))
        this.items.push(new Item(2, 'string', this.assets.stringItem))
        this.items.push(new Item(3, 'dryGrass', this.assets.dryGrassItem))
        this.items.push(new Item(4, 'rope', this.assets.ropeItem))



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
                const pageY = e.pageY//to particles

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
                        this.inventory.addItem(this.items[1])//stick
                    }
                    else if(tree == 3){//grass
                        this.island.trees[strCoords(x, y)] = 0
                        const _r = Math.random()

                        if(_r > 0.5){
                            this.inventory.addItem(this.items[2])//string
                        }else{
                            this.inventory.addItem(this.items[3])//dryGrass
                        }
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
