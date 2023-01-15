export class Player{
    constructor(game){

        this.game = game

        this.x = this.game.island.spawnPoint.x+0.5
        this.y = this.game.island.spawnPoint.y+0.5

        this.speed = 0.005

        this.maxHp = 5
        this.hp = 3.5
    }
    drawHearts(ctx){

        const _H = this.game.renderer._H

        const _hs = _H/15


        for(let i=1; i<=this.hp; i++){
            ctx.drawImage(this.game.assets.heartRed, (i-1)*_hs, 0, _hs, _hs)
        }
        if(this.hp%1 > 0){
            ctx.drawImage(this.game.assets.heartRed, 0, 0, 5, 10, Math.ceil(this.hp-1)*_hs, 0, _hs/2, _hs)
        }

        for(let i=1; i<=this.maxHp; i++){
            ctx.drawImage(this.game.assets.heartEmpty, (i-1)*_hs, 0, _hs, _hs)
        }
        
    }
}