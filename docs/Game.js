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
        this.renderer = new Renderer(this.canvas, this)

        this.assets = {}
        this.assets.palma = new Image()
        this.assets.palma.src = "/imgs/palma.png"

        this.loop(Date.now())
    }
    loop(time){
        let delta = Date.now() - time

        this.renderer.focus(this.player.x, this.player.y)
        this.renderer.update()
        this.renderer.render()

        this.movementEvents(k, delta)

        requestAnimationFrame(()=>{this.loop(time+delta)})
    }

    movementEvents(keys, delta){
        if(keys['KeyW']){
            this.player.y -= 0.01*delta
        }
        if(keys['KeyS']){
            this.player.y += 0.01*delta
        }
        if(keys['KeyA']){
            this.player.x -= 0.01*delta
        }
        if(keys['KeyD']){
            this.player.x += 0.01*delta
        }
        
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

        this.update()

        this.width = 50
        this.height = 30

        this.cellOffsetX = 0
        this.cellOffsetY = 0

        this.cellSize = Math.max(this._H/this.height, this._W/this.width)

        this.UP = (this.height*this.cellSize - this._H)/2 - this.cellOffsetY*this.cellSize
        this.LEFT = (this.width*this.cellSize - this._W)/2 - this.cellOffsetX*this.cellSize
        

        this.lookAt = this.game.island.spawnPoint
        

    }
    update(){
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

        for(let i=0; i<=this.width; i++){
            for(let j=0; j<=this.height; j++){
                const x = this.lookAt.x - this.width/2 + i
                const y = this.lookAt.y - this.height/2 + j

                const cell = this.game.island.getCell(x, y)
                ctx.fillStyle = this.colors[cell]

                ctx.fillRect(this.LEFT + i*this.cellSize + this.cellOffsetX, this.UP + j*this.cellSize + this.cellOffsetY, this.cellSize+1, this.cellSize+1)
                

            }
        }

        for(let j=0; j<=this.height+2; j++){
            for(let i=-1; i<=this.width+1; i++){
                const x = this.lookAt.x - this.width/2 + i
                const y = this.lookAt.y - this.height/2 + j

                if(trees[strCoords(x, y)]){
                    ctx.imageSmoothingEnabled = false;
                    
                    ctx.drawImage(this.game.assets.palma, this.LEFT + (i-1)*this.cellSize + this.cellOffsetX, this.UP + (j-2)*this.cellSize + this.cellOffsetY, this.cellSize*3, this.cellSize*3)
                    
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

        console.log(this.game.island.spawnPoint)

        this.x = this.game.island.spawnPoint.x
        this.y = this.game.island.spawnPoint.y
    }
}