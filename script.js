const tabs = document.querySelectorAll('.tab')
const maxLength = document.querySelector('.maxLength')
const lists = document.querySelectorAll('.list')

const newTaskInput = document.querySelector('.newTaskInput')
const newTaskBtn = document.querySelector('.newTaskBtn')

const clearDoneBtn = document.querySelector('.clearDoneBtn')

let currentList = null;

let tasks;
let storageList;




const EditTextCap = (e, SPAN_HTML)=>{
    let currentText = SPAN_HTML.textContent

    if( currentText.length > 254 && e.key !== 'Backspace') {
        e.preventDefault()
    }

}


const verifyTextChange = (SPAN_HTML, index)=>{
    
    let originalText = storageList['toDoList'][index]
    let currentText = SPAN_HTML.textContent

    if(originalText !== currentText){
        SPAN_HTML.parentNode.children[1].classList.add('saveBtn-active')
    }else{
        SPAN_HTML.parentNode.children[1].classList.remove('saveBtn-active')

    }

}


/* 255 txt
Lorem ipsum dolor sit amet consectetur adipisicing elit. 
Vitae numquam ex libero aperiam, fuga illum non nulla debitis, 
amet asperiores maiores veritatis praesentium? 
Vel ut facere labore sed asperiores ad? 
dasd a sdnao dh;la ioshd;lk oahsl uih l;au hdddd
*/

// *********************************************** AGREGAR TAREA A LA LISTA ***********************************************

const makeItem =  (text, index, listName)=>{

    const LI_HTML = document.createElement('LI')
    LI_HTML.classList.add('item')
    LI_HTML.id = index
    
    const SPAN_HTML = document.createElement('SPAN')
    SPAN_HTML.textContent = text

    
    LI_HTML.appendChild(SPAN_HTML)
    
    SPAN_HTML.addEventListener('keydown', (e)=>{ EditTextCap(e, SPAN_HTML) } )
    SPAN_HTML.addEventListener('input', ()=>{ verifyTextChange(SPAN_HTML, index) } )


    // si el elemento esta en la lista de "terminados", se renderiza sin los botones
    if(listName === 'toDoList'){

        // los elementos solo se pueden editar en la lista de tareas por hacer
        SPAN_HTML.setAttribute('contenteditable', 'true')
        

        const BTN_SAVE = document.createElement('BUTTON')
        BTN_SAVE.classList.add('itemBtn')
        BTN_SAVE.textContent = 'save'
        
        const BTN_DEL = document.createElement('BUTTON')
        BTN_DEL.classList.add('itemBtn', 'deleteBtn')
        BTN_DEL.textContent = 'delete'
        
        LI_HTML.appendChild(BTN_SAVE)
        LI_HTML.appendChild(BTN_DEL)
        
        BTN_SAVE.addEventListener('click', (e)=>saveTask(e))
        BTN_DEL.addEventListener('click', (e)=>deleteTask(e) )

    }
    
    
    return  LI_HTML
    
}

const addNewItem =  (text, index, listName)=>{

    const ITEM  =  makeItem(text, index, listName)

    let currentList = document.querySelector(`#${listName}`)
    currentList.appendChild(ITEM)

}


newTaskBtn.addEventListener('click', (e)=> {
    
    let texto = newTaskInput.value
    

    if (texto == '') return
    
    e.preventDefault()

    let index = storageList['toDoList'].length

    addNewItem(texto, index, 'toDoList') 
    
    
    let toDoTab = document.querySelector('.listSelector > .tab')
    
    changeList(toDoTab, 0)

    storageList['toDoList'].push({id: index, txt: texto}) 
    
    let listToSave = JSON.stringify(storageList)
    
    window.localStorage.setItem('noteBook', listToSave)
    
    
    newTaskInput.value = ''
    
})



// ============================== Text Input ============================== //

newTaskInput.addEventListener('input', (e)=>{
    
    // cambiar el valor del contador
    maxLength.textContent = `${newTaskInput.value.length }/255` 
    
    // cambiar el color del contador y escribir en el input  
    if(newTaskInput.value.length < 255){
        
        maxLength.classList.remove('maxLengthMaxed') // si caracteres  < 255 { color verde }

    }else{
        
        e.preventDefault() // { bloquear el input }

        maxLength.classList.add('maxLengthMaxed') // { cambiar a color rojo }

    }
        
})



// *********************************************** MENU PARA CAMBIAR DE LISTA ***********************************************

const changeList = (currentTab, index)=>{

    // seleccionar la ultima PESTA:A activa y remover la clase '.active'
    let formerTab = document.querySelector('.listSelector > .active')
    formerTab.classList.remove('active')
    
    // seleccionar la LISTA activa y remover la clase '.active'
    let listActive = document.querySelector('.noteBook > .active')
    listActive.classList.remove('active')
    

    // nueva PESTA:A seleccionada a;adir clase '.active'
    currentTab.classList.add('active')
    
    // nueva LISTA seleccionada a;adir clase '.active'
    lists[index].classList.add('active')

}

//  al precionar las PESTA:AS de la lista 
tabs.forEach( (tab, index) => {
    tab.addEventListener('click', ()=>  changeList(tab, index)  )
});



// *********************************************** GUARDAR TAREA EDITADA ***********************************************
const saveTask = (e)=>{

    if(!e.target.classList.value.includes('saveBtn-active')) return
    
    let id = e.target.parentNode.id
    let newText = e.target.parentNode.children[0].textContent

    storageList['toDoList'][id] = {id, txt: newText}

    let listToSave = JSON.stringify(storageList)
        
    window.localStorage.setItem('noteBook', listToSave)


    
    e.target.classList.remove('saveBtn-active')
    

}



// *********************************************** ELIMINAR TAREAS ***********************************************
const deleteTask = (e)=>{

    let id = parseInt(e.target.parentNode.id)


    // seleccionar el 'contenedor' UL
    let parent = e.target.parentNode.parentNode 
    
    // seleccionar el elemento LI
    let currentNode = e.target.parentNode 
    
    // seleccionar el TEXTO del elemento LI
    let text = currentNode.children[0].textContent

    // a;adir la clase de la animacion de borrado
    currentNode.classList.add('deleteItem')

    // Delay al borral el elemento, para ver la animacion
    setTimeout(()=>{ parent.removeChild(currentNode) }, 600)


    // eliminar el elemento del ARRAY de tareas por hacer

    
    for( let index in storageList['toDoList']){

        if( id === storageList['toDoList'][index].id ) {
                storageList['toDoList'].splice(index, 1)
            break;
        }
    }

    
    // a;adir elemento al ARRAY de tareas terminadas
    storageList['doneList'].push({id: storageList['doneList'].length, txt:text})



    // guardar el ARRAY modificado
    let listToSave = JSON.stringify(storageList)
    window.localStorage.setItem('noteBook', listToSave)


    addNewItem(text, storageList['doneList'].length, 'doneList')

}



// *********************************************** actualizar la lista principal ***********************************************

const updateList = (storageList)=>{

    if( storageList == undefined ) return 


    for( let listName in storageList){
        
        storageList[listName].forEach( (obj) => {            

            addNewItem(obj.txt, obj.id, listName)
            
        } )

    }

}


//  CREAR DONE LIST



clearDoneBtn.addEventListener('click', ()=>{


    
    lists[1].childNodes.forEach((item)=>{
        
        item.classList.add('itemCleared')

    })
    
    setTimeout(()=>{
        
        lists[1].innerHTML = null

    }, 300)


    
    storageList['doneList'].splice(0, storageList['doneList'].length)
    
    let listToSave = JSON.stringify(storageList)
    
    window.localStorage.setItem('noteBook', listToSave)
    
    
    
})


window.addEventListener('DOMContentLoaded', ()=>{

    // window.localStorage.removeItem('noteBook')

    // si la lista no existe, se crea
    if(window.localStorage.getItem('noteBook') === null){
        
        let listaDePrueba = {
            'toDoList': [{id: 0, txt: 'Tarea de prueba'}],
            'doneList': [{id: 0, txt: 'Tarea de prueba'}]
        } 
        
        listaDePrueba = JSON.stringify(listaDePrueba)
        window.localStorage.setItem('noteBook', listaDePrueba)
    }
    
    // Y se obtiene la lista
    storageList = window.localStorage.getItem('noteBook')

    storageList = JSON.parse(storageList)
    
    updateList(storageList)
    
})