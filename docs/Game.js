function mod(n, m) {
    return ((n % m) + m) % m;
}
function strCoords(x, y){
	return `${x}:${y}`
}

export default class Game{
    constructor(canvas, is){
        this.island = is
        this.renderer = new Renderer(canvas, this)

        this.x = this.island.spawnPoint.x
        this.y = this.island.spawnPoint.y

        this.loop(Date.now())
    }
    loop(time){
        let delta = Date.now() - time

        this.renderer.update()
        this.renderer.render()

        this.renderer.focus(this.x, this.y)
        this.y = 100+Math.sin(Date.now()/1000)*50
        this.x = 100+Math.cos(Date.now()/1000)*50

        requestAnimationFrame(()=>{this.loop(time+delta)})
    }
}


class Renderer{
    constructor(canvas, game){

        this.colors = {
            'sea': 'blue',
			'sand': 'yellow',
			'plain': 'green',
			'hill': 'darkgreen',
            undefined: 'purple'
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

        for(let i=0; i<=this.width; i++){
            for(let j=0; j<=this.width; j++){
                const x = this.lookAt.x - this.width/2 + i
                const y = this.lookAt.y - this.height/2 + j

                const cell = this.game.island.getCell(x, y)
                ctx.fillStyle = this.colors[cell]

                ctx.fillRect(this.LEFT + i*this.cellSize + this.cellOffsetX, this.UP + j*this.cellSize + this.cellOffsetY, this.cellSize+1, this.cellSize+1)

            }
        }
    }

    focus(x, y){
        this.lookAt.x = Math.floor(x)
        this.lookAt.y = Math.floor(y)

        this.cellOffsetX = x%1
        this.cellOffsetY = y%1
    }
}