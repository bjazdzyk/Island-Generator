import { strCoords } from "./Utils.js"

noise.seed(Math.random())

export default class Island{
	constructor(){
		this.tileMap = {
			0:'sea',
			1:'sand',
			2:'plain',
			3:'hill'
		}

		// this.sFactor = Math.random()*100
		// this.bigSFactor = Math.random()*100

		this.sFactor = 15
		this.bigSFactor = 25
		
		this.size = 20

		this.spawnH = 1.5
		this.spawnPoint = {x:this.size/2, y:this.size/2};
		this.dungeonPos = {x:0, y:0}
		


		this.build()

	}

	build(){

		this.map = {}
		this.trees = {}

		let closestStart = 1000000
		let closestDungeon = 100000

		for(let i=0; i<this.size; i++){
			for(let j=0; j<this.size; j++){

				const S = noise.simplex2(i/this.bigSFactor, j/this.bigSFactor)
				const s = noise.simplex2(i/this.sFactor, j/this.sFactor)
				const R = this.size/2
				const dx = Math.abs(R-i)
				const dy = Math.abs(R-j)
				const r = Math.sqrt(dx*dx + dy*dy)
				const h = ((R-r)/R)*5+(S*0.75+s*0.25)
				const v = Math.min(Math.max(Math.floor(h), 0), 3)

				this.map[strCoords(i, j)] = v

				const sOff = this.size*10
				const tOff = 30
				const ts = noise.simplex2((i+sOff)/tOff, j/tOff)+0.5
				if(!this.trees[strCoords(i-1, j)] && 
					!this.trees[strCoords(i, j-1)] &&
					!this.trees[strCoords(i-1, j-1)] &&
					!this.trees[strCoords(i-1, j+1)]){
					if(v >= 2){
						if((ts*100)%10 > 9.75){
							if((ts*10000)%10 > 3){
								this.trees[strCoords(i, j)] = 1 //tree
							}else{
								this.trees[strCoords(i, j)] = 7 //stone
							}

						}else if(v==2){
							if((ts*100)%10 > 8.5){
								if((ts*1000)%10 > 9){
									this.trees[strCoords(i, j)] = 4 //blueFlower
								}else if((ts*1000)%10 > 8){
									this.trees[strCoords(i, j)] = 5 //redFlower
								}else if((ts*1000)%10 > 7){
									this.trees[strCoords(i, j)] = 6 //whiteFlower
								}else{
									this.trees[strCoords(i, j)] = 3 //grass
								}
							}
						}
					}
					if(v == 1){
						if((ts*10000)%10 > 9.9){
							if(!this.trees[strCoords(i-1, j)] && 
								!this.trees[strCoords(i, j-1)] &&
								!this.trees[strCoords(i-1, j-1)] &&
								!this.trees[strCoords(i-1, j+1)]){

								this.trees[strCoords(i, j)] = 2 // dryBush
							}
						}
					}
				}

				if(ts+r/R < closestDungeon){
					closestDungeon = ts+r/R
					this.dungeonPos = {x:i, y:j}

				}

				if(Math.abs(i-this.size/2) == Math.abs(j-this.size/2) || i==Math.floor(this.size/2) || j==Math.floor(this.size/2)){
					if(Math.abs(this.spawnH-h) < closestStart){
						closestStart = Math.abs(1.5-h)

						this.spawnPoint = {x:i, y:j}
					}
				}


			}
		}

	}

	getMap(){
		return this.map
	}

	getCell(x, y){
		return this.tileMap[this.map[strCoords(x, y)]]

	}
}