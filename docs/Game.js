import Island from './IslandGenerator.js'
import { Renderer } from './Renderer.js';
import { Inventory, Item } from './Inventory.js';
import { strCoords } from "./Utils.js"
import { DayCycle } from './DayCycle.js';
import assetMap from './assets.json' assert { type: 'json' };
import { MobManager } from './Entities.js';
import { Player } from './Player.js';


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

        //load assets
        this.assets = {}
        for(let assetName in assetMap){
            this.assets[assetName] = new Image()
            this.assets[assetName].src = assetMap[assetName].url
        }

        this.island = new Island()
        this.player = new Player(this)
        this.inventory = new Inventory(this)
        this.dayCycle = new DayCycle(this)
        this.mobManager = new MobManager(this)
        this.renderer = new Renderer(this.canvas, this)
    

        this.items = [0]
        this.items.push(new Item(1, 'stick', this.assets.stickItem))
        this.items.push(new Item(2, 'string', this.assets.stringItem))
        this.items.push(new Item(3, 'dryGrass', this.assets.dryGrassItem))
        this.items.push(new Item(4, 'rope', this.assets.ropeItem))
        this.items.push(new Item(5, 'bat', this.assets.batItem))
        this.items.push(new Item(6, 'kindling', this.assets.kindlingItem))
        this.items.push(new Item(7, 'torch', this.assets.torchItem))
        this.items.push(new Item(8, 'campfire', this.assets.campfireItem))
        this.items.push(new Item(9, 'berries', this.assets.berriesItem))



        this.loop(Date.now())
        this.interactionEvents()

    }
    loop(time){
        let delta = Date.now() - time

        this.player.update(delta)
        this.dayCycle.update(delta)
        this.mobManager.update(delta)
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
        document.addEventListener('mousedown', (e)=>{
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
                
                const _b = Math.floor((e.button+2)/2)

                if(_b, this.inventory.eq[_b].id == 9){//eat berries
                    if(this.player.hp != this.player.maxHp){
                        this.player.hp = Math.min(this.player.hp+1, this.player.maxHp)
                        this.inventory.setItemAt(_b, 0)
                        return
                    }

                }
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
                    else if(tree == 9){//berryBush
                        this.island.trees[strCoords(x, y)] = 8
                        this.inventory.addItem(this.items[9])

                    }
                    
                }
            }

            
        })
    }
}


