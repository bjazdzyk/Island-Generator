export class Player{
    constructor(game){

        this.game = game

        this.x = this.game.island.spawnPoint.x+0.5
        this.y = this.game.island.spawnPoint.y+0.5

        this.speed = 0.005

        this.maxHp = 5
        this.hp = 3.5

        this.dGFactor = 0
        this.dGVelo = 0.01
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
    damageGradient(ctx, _W, _H){

        const r = Math.sqrt(_W*_W/4 + _H*_H/4)

        const grd = ctx.createRadialGradient(_W/2, _H/2, r*this.dGFactor, _W/2, _H/2, r*1.5)
        grd.addColorStop(1, "rgba(255, 20, 20, 1)");
        grd.addColorStop(0, "rgba(255, 20, 20, 0)");

        ctx.fillStyle = grd
        ctx.fillRect(0, 0, _W, _H)

    }
    update(delta){
        this.dGFactor = Math.min(this.dGFactor+(this.dGVelo*delta/300), 1)
        this.dGVelo+=0.1
    }
    hit(damage){
        this.hp = Math.max(0, this.hp-damage)
        this.dGFactor = 0
        this.dGVelo = 0.2


    }
}