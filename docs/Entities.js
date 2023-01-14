import { strCoords } from "./Utils.js"

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

        this.x = this.entityManager.game.island.spawnPoint.x
        this.y = this.entityManager.game.island.spawnPoint.y

        //to logics
        this.time = 0

        this.state = 'waiting'
        this.duration = Math.random()*5000
        this.timeStamp = 0
        this.dirX = 0
        this.dirY = 0
        this.accX = 0
        this.accX = 0

        this.maxVel = 0.05
        this.runningSpeed = 0.001

        this.H = this.entityManager.game.island.H


    }
    update(delta){
        //console.log(this.dirX, this.dirY)
        this.time += delta

        if(this.state == 'running'){
            if(Math.sqrt(this.dirX*this.dirX + this.dirY*this.dirY) < this.maxVel){
                this.dirX += this.accX
                this.dirY += this.accY
            }

            this.x += this.dirX
            this.y += this.dirY
        }else if(this.state == 'waiting'){
            this.dirX *= delta/20
            this.dirY *= delta/20
            
            this.x += this.dirX
            this.y += this.dirY
        }


        if(this.time - this.duration >= this.timeStamp){

            if(this.state == 'waiting'){

                this.duration = Math.random()*5000-1000
                this.timeStamp = this.time
                this.accX = 0
                this.accY = 0

                const myH = this.H[strCoords(Math.round(this.x), Math.round(this.y))]

                let bestHVal = -10
                let bestTX = 0
                let bestTY = 0

                for(let i=0; i<4; i++){
                    const tX = Math.random()*10-5
                    const tY = Math.random()*10-5

                    const _x = Math.round(this.x + tX)
                    const _y = Math.round(this.y + tY)

                    const h = this.H[strCoords(_x, _y)]
                    if( h  > bestHVal){
                        bestHVal = Math.abs( h )

                        bestTX = _x
                        bestTY = _y

                    }
                }

                const dX =  bestTX - this.x
                const dY =  bestTY - this.y
                console.log(dX, dY)
                const d = Math.sqrt(dX*dX + dY*dY)

                

                this.accX = (dX/d || 0) * this.runningSpeed
                this.accY = (dY/d || 0) * this.runningSpeed

                this.state = 'running'

            }else if(this.state == 'running'){

                this.duration = Math.random()*10000-1000
                this.timeStamp = this.time
                this.accX = 0
                this.accY = 0

                this.state = 'waiting'
            }
        }
        
    }
    draw(ctx, x, y, size){

        const scale = 3
        const bSize = size*scale

        ctx.drawImage(this.imgSrc, x + size/2 - bSize/2, y + size/2 - bSize/2, bSize, bSize)

    }

}