import { strCoords } from "./Utils.js"

export function drawIs(ctx, island, tileSize){

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