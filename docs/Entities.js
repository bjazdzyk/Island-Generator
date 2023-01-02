export class MobManager{
    constructor(game){

        this.game = game

        this.mobs = []

        this.summon('boar', 10, 10)

    }
    summon(mob, x, y){
        if(mob == 'boar'){
            this.mobs.push(new Boar(this, x, y))
        }

    }
    update(delta){
        for(let mob of this.mobs){
            mob.update(delta)
        }
    }

}

class Boar{
    constructor(em, x, y){
        this.entityManager = em

        this.imgSrc = this.entityManager.game.assets.boarEntity
        this.maxHp = 15
        
        
        this.hp = this.maxHp

        this.x = x
        this.y = y

        this.time = 0

    }
    update(delta){
        this.time += delta
        this.x = 10 + Math.sin(this.time/1000)*2
        this.y = 10 + Math.cos(this.time/1000)*2
        //movement logics
    }
    draw(ctx, x, y, size){

        const scale = 3
        size = size*scale

        ctx.drawImage(this.imgSrc, x-size/2, y-size/2, size, size)

    }

}