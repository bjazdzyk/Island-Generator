export class DayCycle{
    constructor(game){
        this.game = game

        this.dayDuration = 5 * (60*1000) // 5min
        this.morningStart = 4
        this.morningDuration = 3

        this.minimalBrightnessLevel = 0.2
            
        this.time = (this.morningStart + this.morningDuration)/24*this.dayDuration;
        this.dayTime = this.time;
        this.dayPart = this.dayTime/this.dayDuration

        this.nightShadow = document.createElement('wide')
        this.nightShadow.setAttribute('id', 'nightShadow')

        document.body.appendChild(this.nightShadow)

    }
    update(delta){
        this.time += delta 
        this.dayTime = this.time % this.dayDuration
        this.dayPart = this.dayTime/this.dayDuration

        const _h = this.dayPart*24
        const _bf = (Math.min(_h, 24-_h)-this.morningStart)/this.morningDuration
        
        this.brightnessFactor = 1-Math.min(1, Math.max(this.minimalBrightnessLevel, _bf))

        this.nightShadow.style.opacity = this.brightnessFactor
        
    }
}