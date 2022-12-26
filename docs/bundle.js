import Island from '/IslandGenerator.js'
import {drawIs} from '/DebugIsland.js'
import Game from '/Game.js'


//git test windows


const canvas = document.getElementById('can')

function strCoords(x, y){
	return `${x}:${y}`
}

const is = new Island()
console.log(is)

const game = new Game(canvas, is)

//drawIs(ctx, is, 5)



