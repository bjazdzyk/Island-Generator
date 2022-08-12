
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

		this.sFactor = 10
		this.bigSFactor = 30
		this.size = 100
		


		this.build()

	}

	build(){

		this.map = {}

		for(let i=0; i<this.size; i++){
			for(let j=0; j<this.size; j++){

				const S = noise.simplex2(i/this.bigSFactor, j/this.bigSFactor)
				const s = noise.simplex2(i/this.sFactor, j/this.sFactor)
				const R = this.size/2
				const dx = Math.abs(R-i)
				const dy = Math.abs(R-j)
				const r = Math.sqrt(dx*dx + dy*dy)
				const h = ((R-r)/R)*3+(S*0.75+s*0.25)
				
				const v = (Math.floor(h))
				

				this.map[strCoords(i, j)] = Math.min(Math.max(v, 0), 4)
			}
		}

	}

	getMap(){
		return this.map
	}
}