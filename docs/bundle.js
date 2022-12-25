import Island from '/IslandGenerator.js'


//git test windows


const canvas = document.getElementById('can')
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

function strCoords(x, y){
	return `${x}:${y}`
}

function drawIs(island, tileSize){

	const map = island.getMap()

	for(let i=0; i<island.size; i++){
		for(let j=0; j<island.size; j++){
			const color = island.tileMap[map[strCoords(i, j)]]
			if(color){
				ctx.fillStyle = island.tileMap[map[strCoords(i, j)]]
			}else{
				ctx.fillStyle = 'black'
			}

			if(island.trees[strCoords(i, j)]){
				ctx.fillStyle = 'brown'
				///console.log(island.trees[strCoords(i, j)])
				
			}
			if(island.spawnPoint.x == i && island.spawnPoint.y == j){
				ctx.fillStyle = 'purple'
			}
			if(island.dungeonPos.x == i && island.dungeonPos.y == j){
				ctx.fillStyle = 'black'
			}

			ctx.fillRect(i*tileSize, j*tileSize, tileSize, tileSize)

		}
	}

}



const is = new Island()

console.log(is)

drawIs(is, 5)



