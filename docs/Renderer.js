import { strCoords } from "./Utils.js"

export class Renderer{
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

        this.width = 30
        this.height = 16
        // this.width = 50
        // this.height = 50

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

        ctx.imageSmoothingEnabled = false;

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
                }else if(trees[strCoords(x, y)]==8){
                    ctx.drawImage(this.game.assets.bush, this.LEFT + (i-0.5)*this.cellSize, this.UP + (j-1)*this.cellSize, this.cellSize*2, this.cellSize*2)
                }else if(trees[strCoords(x, y)]==9){
                    ctx.drawImage(this.game.assets.berryBush, this.LEFT + (i-0.5)*this.cellSize, this.UP + (j-1)*this.cellSize, this.cellSize*2, this.cellSize*2)
                }
            }
        }

        const dunPos = this.game.island.dungeonPos
        const LX = this.lookAt.x - this.width/2
        const RX = this.lookAt.x + this.width/2 
        const UY = this.lookAt.y - this.height/2
        const DY = this.lookAt.y + this.height/2

        
        
        if(dunPos.x > LX-3 && dunPos.x < RX+3){
            if(dunPos.y > UY-3 && dunPos.y < DY+3){

                ctx.drawImage(this.game.assets.dungeonEntrance, this.LEFT + (dunPos.x-LX-1)*this.cellSize, this.UP + (dunPos.y-UY-1)*this.cellSize, this.cellSize*3, this.cellSize*3)

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


        //mobs
        for(let mob of this.game.mobManager.mobs){
            //console.log(mob)
            const _cx = this.lookAt.x+this.cellOffsetX
            const _cy = this.lookAt.y+this.cellOffsetY
            const _px = mob.x
            const _py = mob.y

            const _dx = this._W/2+(_px-_cx)*this.cellSize
            const _dy = this._H/2+(_py-_cy)*this.cellSize

            mob.draw(ctx, _dx, _dy, this.cellSize)
        }


        //trees top
        for(let j=0; j<=this.height+3; j++){
            for(let i=-1; i<=this.width+2; i++){
                const x = this.lookAt.x - this.width/2 + i
                const y = this.lookAt.y - this.height/2 + j

                if(trees[strCoords(x, y)]==1){
                    
                    ctx.drawImage(this.game.assets.palmaTop, this.LEFT + (i-1)*this.cellSize, this.UP + (j-2)*this.cellSize, this.cellSize*3, this.cellSize*3)
                    
                }
            }
        }

        //hearts
        this.game.player.drawHearts(ctx)



    }

    focus(x, y){
        this.lookAt.x = Math.floor(x)
        this.lookAt.y = Math.floor(y)

        this.cellOffsetX = x%1
        this.cellOffsetY = y%1
    }
}