
//import '/libs/noise.js'


function strCoords(x, y){
	return `${x}:${y}`
}

noise.seed(Math.random())

export default class Island{
	constructor(){
		this.tileMap = {
			0:'blue',
			1:'yellow',
			2:'green',
			3:'darkgreen'
		}

		this.sFactor = 20
		this.bigSFactor = 20
		this.size = 100
		


		this.build()

	}

	build(){

		this.map = {}
		this.trees = {}

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

				if(ts*10000%10 > 9.5){
					if(v >= 2){
						if(!this.trees[strCoords(i-1, j)] && 
							!this.trees[strCoords(i, j-1)] &&
							!this.trees[strCoords(i-1, j-1)] &&
							!this.trees[strCoords(i-1, j+1)]){

							console.log(i+1, j-1)

							this.trees[strCoords(i, j)] = 1
						}
					}
				}


			}
		}

	}

	getMap(){
		return this.map
	}
}