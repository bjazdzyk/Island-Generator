import Island from '/IslandGenerator.js'

function mod(n, m) {
    return ((n % m) + m) % m;
}
function strCoords(x, y){
	return `${x}:${y}`
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


class Renderer{
    constructor(canvas, game){

        this.colors = {
            'sea': 'blue',
			'sand': 'yellow',
			'plain': 'green',
			'hill': 'darkgreen',
            undefined: 'blue'
        }

        this.game = game
        this.canvas = canvas

        this.width = 20
        this.height = 16

        this.cellOffsetX = 0.5
        this.cellOffsetY = 0.5

        this.cellSize = Math.max(this._H/this.height, this._W/this.width)

        this.UP = (this.height*this.cellSize - this._H)/2 - this.cellOffsetY*this.cellSize
        this.LEFT = (this.width*this.cellSize - this._W)/2 - this.cellOffsetX*this.cellSize
        

        this.lookAt = this.game.island.spawnPoint

        this.update()
        

    }
    update(){
        const _lx = this.lookAt.x + this.cellOffsetX
        const _ly = this.lookAt.y + this.cellOffsetY

        const _px = this.game.player.x
        const _py = this.game.player.y

        const _dx = _px - _lx
        const _dy = _py - _ly

        this.focus(_lx + _dx/7, _ly + _dy/7)

        

        this._W = window.innerWidth
        this._H = window.innerHeight

        this.canvas.width = this._W
        this.canvas.height = this._H

        this.cellSize = Math.max(this._H/this.height, this._W/this.width)

        this.UP = (this._H - this.height*this.cellSize)/2 - this.cellOffsetY*this.cellSize
        this.LEFT = (this._W - this.width*this.cellSize)/2 - this.cellOffsetX*this.cellSize
    }

    render(){

        const ctx = this.canvas.getContext('2d')
        const trees = this.game.island.trees

        //biomes
        for(let i=0; i<=this.width+1; i++){
            for(let j=0; j<=this.height+1; j++){
                const x = this.lookAt.x - this.width/2 + i
                const y = this.lookAt.y - this.height/2 + j

                const cell = this.game.island.getCell(x, y)
                ctx.fillStyle = this.colors[cell]

                ctx.fillRect(this.LEFT + i*this.cellSize, this.UP + j*this.cellSize, this.cellSize+1, this.cellSize+1)
                

            }
        }

        //trees down & bush & grass
        for(let j=0; j<=this.height+3; j++){
            for(let i=-1; i<=this.width+2; i++){
                const x = this.lookAt.x - this.width/2 + i
                const y = this.lookAt.y - this.height/2 + j

                ctx.imageSmoothingEnabled = false;
                if(trees[strCoords(x, y)] == 1){
                    ctx.drawImage(this.game.assets.palmaDown, this.LEFT + (i-1)*this.cellSize, this.UP + (j-2)*this.cellSize, this.cellSize*3, this.cellSize*3)
                }else if(trees[strCoords(x, y)]==2){
                    ctx.drawImage(this.game.assets.dryBush, this.LEFT + i*this.cellSize, this.UP + j*this.cellSize, this.cellSize, this.cellSize)
                }else if(trees[strCoords(x, y)]==3){
                    ctx.drawImage(this.game.assets.grass, this.LEFT + i*this.cellSize, this.UP + j*this.cellSize, this.cellSize, this.cellSize)
                }else if(trees[strCoords(x, y)]==4){
                    ctx.drawImage(this.game.assets.blueFlower, this.LEFT + i*this.cellSize, this.UP + j*this.cellSize, this.cellSize, this.cellSize)
                }else if(trees[strCoords(x, y)]==5){
                    ctx.drawImage(this.game.assets.redFlower, this.LEFT + i*this.cellSize, this.UP + j*this.cellSize, this.cellSize, this.cellSize)
                }else if(trees[strCoords(x, y)]==6){
                    ctx.drawImage(this.game.assets.whiteFlower, this.LEFT + i*this.cellSize, this.UP + j*this.cellSize, this.cellSize, this.cellSize)
                }else if(trees[strCoords(x, y)]==7){
                    ctx.drawImage(this.game.assets.stone, this.LEFT + (i-1)*this.cellSize, this.UP + (j-1)*this.cellSize, this.cellSize*3, this.cellSize*3)
                }
            }
        }

        //player

        const _cx = this.lookAt.x+this.cellOffsetX
        const _cy = this.lookAt.y+this.cellOffsetY
        const _px = this.game.player.x
        const _py = this.game.player.y

        const _dx = this._W/2+(_px-_cx)*this.cellSize
        const _dy = this._H/2+(_py-_cy)*this.cellSize

        ctx.drawImage(this.game.assets.player, _dx-this.cellSize/2, _dy-this.cellSize/2, this.cellSize, this.cellSize)



        //trees top
        for(let j=0; j<=this.height+3; j++){
            for(let i=-1; i<=this.width+2; i++){
                const x = this.lookAt.x - this.width/2 + i
                const y = this.lookAt.y - this.height/2 + j

                ctx.imageSmoothingEnabled = false;
                if(trees[strCoords(x, y)]==1){
                    
                    ctx.drawImage(this.game.assets.palmaTop, this.LEFT + (i-1)*this.cellSize, this.UP + (j-2)*this.cellSize, this.cellSize*3, this.cellSize*3)
                    
                }
            }
        }


    }

    focus(x, y){
        this.lookAt.x = Math.floor(x)
        this.lookAt.y = Math.floor(y)

        this.cellOffsetX = mod(x, 1)
        this.cellOffsetY = mod(y, 1)
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

class Inventory{
    constructor(){
        this.guiOpen = false

        this.leftHand = 0
        this.rightHand = 0

        this.rows = 2
        this.cols = 5

        this.eq = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

        this.domElement = document.createElement('inventory')
        this.domElement.setAttribute('id', 'inv')
        document.body.appendChild(this.domElement)


        this.domLH = document.createElement('box')
        this.domLH.setAttribute('class', 'invCell lInvHand')
        this.domLH.addEventListener('click', (e)=>{this.invCellClicked(11)})
        
        this.domRH = document.createElement('box')
        this.domRH.setAttribute('class', 'invCell rInvHand')
        this.domRH.addEventListener('click', (e)=>{this.invCellClicked(12)})

        this.domElement.appendChild(this.domRH)
        this.domElement.appendChild(this.domLH)


        this.invBottom = document.createElement('box')
        this.invBottom.setAttribute('id', 'invBottom')
        this.domElement.appendChild(this.invBottom)

        this.domItemCells = {}

        for(let i=1; i<=this.cols; i++){
            for(let j=1; j<=this.rows; j++){
                const ele = document.createElement('box')
                ele.setAttribute('class', 'invCell itemCell')
                ele.style.left = `${(i*4-2)/22*100}%`
                ele.style.top = `${(j*3-2)/7*100}%`
                ele.style.width = `${2/22*100}%`

                const id = (j-1)*5+i
                ele.addEventListener('click', (e)=>{
                    this.invCellClicked(id)
                })


                this.domItemCells[id] = ele
                this.invBottom.appendChild(this.domItemCells[id])
            }
        }



        this.ePressed = false

        this.inventoryEvents()

    }
    inventoryEvents(){
        document.addEventListener('keydown', (e)=>{
            if(e.code == 'KeyE' && !this.ePressed){
                if(this.guiOpen == true){
                   this.ePressed = true
                   this.guiOpen = false
                   this.domElement.style.display = 'none' 
                   
                }else{
                    this.ePressed = true
                    this.guiOpen = true
                    this.domElement.style.display = 'block'
                    
                }
            }
            
        })
        document.addEventListener('keyup', (e)=>{
            if(e.code == 'KeyE'){
                this.ePressed = false
            }
        })
    }
    findEmptySlot(){
        for(let i=1; i<=12; i++){
            if(this.eq[i] == 0){
                return i
            }
        }

        return false
    }
    addItem(item){
        const es = this.findEmptySlot()
        if(es){
            this.eq[es] = item
            this.domItemCells[es].style['background-image'] = `url(${item.img.src}`
        }
    }
    invCellClicked(id){
        console.log(this.eq[id])
        
    }

    
}

class Item{
    constructor(name, img){
        this.name = name
        this.img = img
    }
}
