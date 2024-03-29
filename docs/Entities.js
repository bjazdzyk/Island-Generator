import { strCoords } from "./Utils.js"

export class MobManager{
    constructor(game){

        this.game = game

        this.mobs = []

        this.mobSpawn = ['boar']

        this.mobSpawnRate = 5000
        this.mobSpawnTimeStamp = Date.now()

        for(let i=0; i<5; i++){
            this.spawnMob()
        }


    }
    spawnMob(){

        const isSize = this.game.island.size
        const px = this.game.player.x
        const py = this.game.player.y

        const r = isSize/2
        let rad, dep, x, y
        let dx=0, dy=0
        while(Math.sqrt(dx*dx + dy*dy) < 20){
            rad = Math.random()*Math.PI*2
            dep = Math.random()*r*0.7
            x = r + Math.sin(rad)*dep
            y = r + Math.cos(rad)*dep

            dx = Math.abs(px-x)
            dy = Math.abs(py-y)
        }

        this.summon(this.mobSpawn[0], x, y)
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


        this.imgs = {
            calm: this.entityManager.game.assets.boarEntity,
            angry: this.entityManager.game.assets.angryBoarEntity
        }
        this.maxHp = 15
        this.hp = this.maxHp

        this.damage = 2

        this.x = x
        this.y = y

        this.flip = 'LEFT'
        this.updateAttitude('calm')

        //to logics
        this.time = 0

        this.state = 'waiting'
        this.duration = Math.random()*5000
        this.timeStamp = 0
        this.dirX = 0
        this.dirY = 0
        this.accX = 0
        this.accX = 0

        this.maxVel = 0.001
        this.runningSpeed = 0.001

        this.punchTimeStamp = 0
        this.punchDelay = 1000

        this.H = this.entityManager.game.island.H

    }
    updateAttitude(att){
        this.attitude = att
        this.img = this.imgs[att]
    }
    
    update(delta){
        this.time += delta
        const cellSize = this.entityManager.game.renderer.cellSize


        const _px = this.entityManager.game.player.x
        const _py = this.entityManager.game.player.y

        const _bx = this.x
        const _by = this.y
        
        const _dx = _px-_bx
        const _dy = _py-_by

        const _d = Math.sqrt(_dx*_dx + _dy*_dy)


        if(this.state == 'running'){
            if(this.attitude == 'angry'){
                this.accX = (_dx/_d || 0) * this.maxVel * cellSize
                this.accY = (_dy/_d || 0) * this.maxVel * cellSize

                this.dirX = (this.dirX + this.accX)/2
                this.dirY = (this.dirY + this.accY)/2

                if(this.accX > 0){
                    this.flip = 'RIGHT'
                }else{
                    this.flip = 'LEFT'
                }

                if(_d < 1.5){
                    if(Date.now()-this.punchTimeStamp >= this.punchDelay){
                        this.entityManager.game.player.hit(this.damage)
                        this.punchTimeStamp = Date.now()

                        this.duration = Math.random()*2000
                        this.timeStamp = this.time

                        this.state = 'waiting'
                    }
                }

            }else if(Math.sqrt(this.dirX*this.dirX + this.dirY*this.dirY) < this.maxVel/2*cellSize){
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

            if(_d < 15){
                this.duration -= delta
            }
        }


        if(this.time - this.duration >= this.timeStamp){

            if(this.state == 'waiting'){

                if(_d < 10){

                    this.updateAttitude('angry')

                    this.duration = Math.random()*5000+1000
                    this.timeStamp = this.time

                    this.state = 'running'

                    

                }else{

                    this.updateAttitude('calm')


                    this.duration = Math.random()*5000-1000
                    this.timeStamp = this.time
                    this.accX = 0
                    this.accY = 0

                    let bestHVal = 1000
                    let bestTX = 0
                    let bestTY = 0

                    for(let i=0; i<4; i++){
                        const tX = Math.random()*10-5
                        const tY = Math.random()*10-5

                        const _x = Math.round(this.x + tX)
                        const _y = Math.round(this.y + tY)

                        const h = this.H[strCoords(_x, _y)]
                        if( Math.abs(h - 3.5)  < bestHVal){
                            bestHVal = Math.abs(h - 3.5)

                            bestTX = _x
                            bestTY = _y

                        }
                    }

                    const dX =  bestTX - this.x
                    const dY =  bestTY - this.y
                    const d = Math.sqrt(dX*dX + dY*dY)

                    

                    this.accX = (dX/d || 0) * this.runningSpeed * cellSize/50
                    this.accY = (dY/d || 0) * this.runningSpeed * cellSize/50

                    this.state = 'running'

                    if(this.accX > 0){
                        this.flip = 'RIGHT'
                    }else{
                        this.flip = 'LEFT'
                    }
                }

            }else if(this.state == 'running'){
                if(this.attitude == 'angry'){
                    this.duration = 1000
                }else{
                    this.duration = Math.random()*10000-1000
                }
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

        const _W = this.entityManager.game.renderer._W

        if(this.flip == 'LEFT'){
            ctx.drawImage(this.img, x + size/2 - bSize/2, y + size/2 - bSize/2, bSize, bSize)
        }else{
            ctx.save()
            ctx.translate(_W, 0);
            ctx.scale(-1, 1);

            ctx.drawImage(this.img, _W-(x+size/2-bSize/2)-bSize, y+size/2-bSize/2, bSize, bSize)
            //ctx.drawImage(this.img, _W/2, 0, bSize, bSize)

            ctx.restore()
        }

    }

}