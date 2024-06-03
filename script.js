const maxLength = document.querySelector('.maxLength')

const tabs = document.querySelectorAll('.tab')
const lists = document.querySelectorAll('.list')
const toDoList = document.querySelector('.toDoList')


const newTaskInput = document.querySelector('.newTaskInput')
const newTaskBtn = document.querySelector('.newTaskBtn')

let tasks;


const myLocalStorage = window.localStorage


let lista = {
    'toDo': ['tarea-1','tarea-2','tarea-3','tarea-4','tarea-5'],
    'done': ['Terminado-1','Terminado-2','Terminado-3','Terminado-4','Terminado-5']
} 


let myList = myLocalStorage.getItem('notebook')
myList = JSON.parse(myList)

console.log( myList['toDo'][0])





// *********************************************** AGREGAR TAREA A LA LISTA ***********************************************

const addNewTask = (txt)=>{

    console.log(txt)

    let taskHtml = document.createElement('DIV')
    taskHtml.classList.add('line')

    taskHtml.innerHTML = `<li class="item">${txt}</li>`

    return taskHtml
}

addNewTask(myList['toDo'][0])

newTaskBtn.addEventListener('click', (e)=>{

    e.preventDefault()
    
    // Si el campo esta vacio, hacer nada
    if(newTaskInput.value == '') return
    
    // Crear el elemento HTML
    let newTask = addNewTask(newTaskInput.value)

    // Cambiar a la lista principal
    changeList(tabs[0], 0)

    // Limpiar el texto del input
    newTaskInput.value = ''
    // Limpiar el contador de caracteres
    maxLength.textContent = `0/255`
    
    // poner la nueva tarea de primera en la lista
    toDoList.children.length > 0 
        ?
        toDoList.insertBefore( newTask, toDoList.children[0] )
        :
        toDoList.appendChild( newTask )
    

    newTask.classList.add('newLine')
    setTimeout(()=> newTask.classList.remove('newLine'), 900)

    

    deleteTask(tasks)
    
 
})


newTaskInput.addEventListener('input', (e)=>{

    if(newTaskInput.value.length === 255){
        e.preventDefault()
        maxLength.classList.add('maxLengthMaxed')
    }else{
        maxLength.classList.remove('maxLengthMaxed')
    }
    
    maxLength.textContent = `${newTaskInput.value.length }/255`
    
})

// *********************************************** MENU PARA CAMBIAR DE LISTA ***********************************************

const changeList = (tab, index)=>{

    let tabActive = document.querySelector('.listSelector > .active')
    tabActive.classList.remove('active')
    
    tab.classList.add('active')
    
    
    let listActive = document.querySelector('.noteBook > .active')
    listActive.classList.remove('active')

    lists[index].classList.add('active')

}

//  al precionar los botones del menu
tabs.forEach( (tab, index) => {
    
    tab.addEventListener('click', ()=>  changeList(tab, index)  )

});





// *********************************************** ELIMINAR TAREAS ***********************************************
const deleteTask = (tasks)=>{
    
    // actializar lista de tareas
    tasks = document.querySelectorAll('.line');
    
    tasks.forEach( (task, index) =>{ 

        task.addEventListener('click',  ()=> {
        
            task.classList.add('deletingItem')
        
            // setTimeout( ()=> toDoList.removeChild(tasks[index]), 800)


        } ) 

    })    

}


// *********************************************** actualizar la lista principal ***********************************************

const updateList = ()=>{

    console.log('hola?')

    myList['toDo'].forEach( (task) => {
        addNewTask(task)
    })
}

updateList()