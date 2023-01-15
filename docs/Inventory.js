import recipes from './recipes.json' assert { type: 'json' };

export class Inventory{
    constructor(game){
        this.game = game

        this.guiOpen = false

        this.rows = 2
        this.cols = 5

        this.eq = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        this.cursorSlot = 0


        //gui
        this.domElement = document.createElement('inventory')
        this.domElement.setAttribute('id', 'inv')
        document.body.appendChild(this.domElement)

        this.domCursor = document.createElement('box')
        this.domCursor.setAttribute('id', 'cursorSlot')

        document.body.appendChild(this.domCursor)

        document.addEventListener('mousemove', (e)=>{
            this.domCursor.style.left = `calc(${e.clientX}px - 5vh)`
            this.domCursor.style.top = `calc(${e.clientY}px - 5vh)`
        })
        //this.domCursor.addEventListener('mousedown', (e)=>{this.domCursor.style['z-index'] = 0})
        // this.domCursor.addEventListener('mouseup', (e)=>{this.domCursor.style['z-index'] = 2})


        this.domLH = document.createElement('box')
        this.domLH.setAttribute('class', 'invCell lInvHand')
        this.domLH.setAttribute('id', `invCell${1}`)
        this.domLH.addEventListener('mouseup', (e)=>{this.invCellClicked(1)})
        
        this.domRH = document.createElement('box')
        this.domRH.setAttribute('class', 'invCell rInvHand')
        this.domRH.setAttribute('id', `invCell${2}`)
        this.domRH.addEventListener('mouseup', (e)=>{this.invCellClicked(2)})

        this.domElement.appendChild(this.domRH)
        this.domElement.appendChild(this.domLH)


        this.invBottom = document.createElement('box')
        this.invBottom.setAttribute('id', 'invBottom')
        this.domElement.appendChild(this.invBottom)

        this.domItemCells = {}

        for(let i=1; i<=this.cols; i++){
            for(let j=1; j<=this.rows; j++){

                const id = (j-1)*5+i+2

                const ele = document.createElement('box')
                ele.setAttribute('id', `invCell${id}`)
                ele.setAttribute('class', 'invCell itemCell')
                ele.style.left = `${(i*4-2)/22*100}%`
                ele.style.top = `${(j*3-2)/7*100}%`
                ele.style.width = `${2/22*100}%`

                ele.addEventListener('mouseup', (e)=>{
                    this.invCellClicked(id)
                })


                this.domItemCells[id] = ele
                this.invBottom.appendChild(this.domItemCells[id])
            }
        }

        this.invCellHoverStyle = document.createElement('style')
        document.getElementsByTagName('head')[0].appendChild(this.invCellHoverStyle)



        //ig hands
        this.lIGHand = document.createElement('box')
        this.lIGHand.setAttribute('class', 'igCell lIGHand')

        this.rIGHand = document.createElement('box')
        this.rIGHand.setAttribute('class', 'igCell rIGHand')

        document.body.appendChild(this.lIGHand)
        document.body.appendChild(this.rIGHand)



        this.ePressed = false

        this.inventoryEvents()

    }
    updateHover(){

        let css = ""

        for(let i=1; i<=12; i++){
            const _cur = (this.cursorSlot.id || 0)
            const _cel = (this.eq[i].id || 0)

            const i1 = Math.min(_cur, _cel)
            const i2 = Math.max(_cur, _cel)

            let addCss = ""

            if((recipes[i1] || [])[i2]){
                addCss = `#invCell${i}:hover{background-color:lightgreen;}`
            }else{
                addCss = `#invCell${i}:hover{background-color:darksalmon;}`
            }

            css += addCss

        }
        if(this.invCellHoverStyle.styleSheet) {
            this.invCellHoverStyle.styleSheet.cssText = css;
        } else {
            this.invCellHoverStyle.appendChild(document.createTextNode(css));
        }
    }
    inventoryEvents(){
        document.addEventListener('keydown', (e)=>{
            if(e.code == 'KeyE' && !this.ePressed){
                if(this.guiOpen == true){//close inv
                    this.ePressed = true
                    this.guiOpen = false
                    this.domElement.style.display = 'none' 

                    this.lIGHand.style.display = 'block'
                    this.rIGHand.style.display = 'block'

                    if(this.cursorSlot){
                        this.addItem(this.cursorSlot)
                        this.cursorSlot = 0
                        this.domCursor.style['background-image'] = 'none'
                    }

                   
                }else{//open inv
                    this.ePressed = true
                    this.guiOpen = true
                    this.domElement.style.display = 'block'

                    this.lIGHand.style.display = 'none'
                    this.rIGHand.style.display = 'none'
                    this.updateHover()
                    
                }
            }
            
        })
        document.addEventListener('keyup', (e)=>{
            if(e.code == 'KeyE'){
                this.ePressed = false
            }
        })
    }
    findEmptySlot(){
        for(let i=1; i<=12; i++){
            if(this.eq[i] == 0){
                return i
            }
        }

        return false
    }
    addItem(item){
        const es = this.findEmptySlot()
        
        this.eq[es] = item

        if(es){
            this.setItemAt(es, item)
        }else{
            //drop item
        }
    }
    invCellClicked(id){

        if(!this.cursorSlot){
            if(this.eq[id]){
                this.cursorSlot = this.eq[id]
                this.domCursor.style['background-image'] = `url(${this.eq[id].img.src})`
                this.setItemAt(id, 0)
            }

        }else{
            if(!this.eq[id]){

                this.setItemAt(id, this.cursorSlot)
                this.cursorSlot = 0
                this.domCursor.style['background-image'] = 'none'

            }else{
                const i1 = Math.min(this.cursorSlot.id, this.eq[id].id)
                const i2 = Math.max(this.cursorSlot.id, this.eq[id].id)

                if(recipes[i1]){if(recipes[i1][i2]){
                    const result = recipes[i1][i2]
                    
                    this.setItemAt(id, this.game.items[result])
                    this.cursorSlot = 0
                    this.domCursor.style['background-image'] = 'none'

                    this.updateHover()

                    return

                }}
                const _it = this.eq[id]

                this.setItemAt(id, this.cursorSlot)
                this.cursorSlot = _it
                this.domCursor.style['background-image'] = `url(${_it.img.src})`


            }
        }
        this.updateHover()
    }
    setItemAt(id, item){
        this.eq[id] = item
        let url = "none"
        if(item){
            url = `url(${item.img.src}`
        }


        if(id == 1){
            this.domLH.style['background-image'] = url
            this.lIGHand.style['background-image'] = url
        }else if(id == 2){
            this.domRH.style['background-image'] = url
            this.rIGHand.style['background-image'] = url
        }else if(id == 13){
            this.cursorSlot.style['background-image'] = url
        }else if(id){
            this.domItemCells[id].style['background-image'] = url
        }
    }

    
}

export class Item{
    constructor(id, name, img){
        this.id = id
        this.name = name
        this.img = img
    }
}