export class Inventory{
    constructor(){
        this.guiOpen = false

        this.leftHand = 0
        this.rightHand = 0

        this.rows = 2
        this.cols = 5

        this.eq = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

        this.domElement = document.createElement('inventory')
        this.domElement.setAttribute('id', 'inv')
        document.body.appendChild(this.domElement)


        this.domLH = document.createElement('box')
        this.domLH.setAttribute('class', 'invCell lInvHand')
        this.domLH.addEventListener('click', (e)=>{this.invCellClicked(11)})
        
        this.domRH = document.createElement('box')
        this.domRH.setAttribute('class', 'invCell rInvHand')
        this.domRH.addEventListener('click', (e)=>{this.invCellClicked(12)})

        this.domElement.appendChild(this.domRH)
        this.domElement.appendChild(this.domLH)


        this.invBottom = document.createElement('box')
        this.invBottom.setAttribute('id', 'invBottom')
        this.domElement.appendChild(this.invBottom)

        this.domItemCells = {}

        for(let i=1; i<=this.cols; i++){
            for(let j=1; j<=this.rows; j++){
                const ele = document.createElement('box')
                ele.setAttribute('class', 'invCell itemCell')
                ele.style.left = `${(i*4-2)/22*100}%`
                ele.style.top = `${(j*3-2)/7*100}%`
                ele.style.width = `${2/22*100}%`

                const id = (j-1)*5+i
                ele.addEventListener('click', (e)=>{
                    this.invCellClicked(id)
                })


                this.domItemCells[id] = ele
                this.invBottom.appendChild(this.domItemCells[id])
            }
        }



        this.ePressed = false

        this.inventoryEvents()

    }
    inventoryEvents(){
        document.addEventListener('keydown', (e)=>{
            if(e.code == 'KeyE' && !this.ePressed){
                if(this.guiOpen == true){
                   this.ePressed = true
                   this.guiOpen = false
                   this.domElement.style.display = 'none' 
                   
                }else{
                    this.ePressed = true
                    this.guiOpen = true
                    this.domElement.style.display = 'block'
                    
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
        if(es){
            this.eq[es] = item
            this.domItemCells[es].style['background-image'] = `url(${item.img.src}`
        }
    }
    invCellClicked(id){
        console.log(this.eq[id])
        
    }

    
}

export class Item{
    constructor(name, img){
        this.name = name
        this.img = img
    }
}