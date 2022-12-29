
import {drawIs} from './DebugIsland.js'
import Game from './Game.js'




const canvas = document.getElementById('can')
document.addEventListener('contextmenu', event => event.preventDefault());


const game = new Game(canvas)

console.log(game)
//drawIs(ctx, is, 5)



