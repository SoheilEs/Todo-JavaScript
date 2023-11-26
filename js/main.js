const toDo = document.querySelector(".input-conrainer").children[0]
const date = document.querySelector(".input-conrainer").children[1]
const addBtn = document.querySelector(".input-conrainer").children[2]
const alretDiv = document.querySelector("#alert-message")
const tbody = document.querySelector("tbody")
const delAllBtn = document.getElementById("delete-btn")
const editBtn = document.getElementById("edit-btn")
const filterBtn = document.querySelectorAll("#filter-btn")
console.log(filterBtn)

let data = JSON.parse(localStorage.getItem("data")) || []
console.log(data)

const saveToStorage = () => {
    localStorage.setItem("data",JSON.stringify(data))
}

const idGenerator = ()=>{
    return id = Math.round(Math.random() * Math.random() * Math.pow(10,15).toString()) 
}

const deleteHandler = (id) => {
    const newToDo  = data.filter( item => item.id !== id)
    data=newToDo
    saveToStorage()
    displayToDo()
    showAlert("ToDo deleted successfully","success")
}

const toggelHandler =(id)=>{
    const item = data.find(item => item.id === id)
    item.completed= !item.completed
    saveToStorage()
    showAlert("Todo status changed","success")
    displayToDo()

}
const editHandler = (id) => {
    const item = data.find(item=>item.id === id)
    toDo.value = item.task
    date.value = item.date
    addBtn.style.display= "none"
    editBtn.style.display= "block"
    editBtn.dataset.id = item.id
}

const displayToDo = (value) => {
    const todoList = value || data
    tbody.innerHTML = ""
    if(! todoList.length) {
        tbody.innerHTML = "<tr><td colspan='4'>No task found</td></tr>"
        return; 
    }
    todoList.map(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.task}</td>
                <td>${item.date || "No date"}</td>
                <td>${item.completed ? "completed" : "pending"}</td>
                <td>
                
                    <button onclick="editHandler(${item.id})">Edit</button>
                    <button onclick="toggelHandler(${item.id})" >${item.completed ? "Undo":"Do"}</button>
                    <button onclick="deleteHandler(${item.id})" >Delete</button> 
                </td>
             </tr>
        `
    })
}

const showAlert = (message, type) => {
    alretDiv.innerHTML = ""
    const alert = document.createElement("p")
    alert.innerText = message
    alert.classList.add("alert")
    alert.classList.add(`alert-${type}`) 
    alretDiv.append(alert)
    setTimeout(()=> alert.style.display="none",2000)
}

const addHandler = e =>{
    const task = toDo.value
    const dateVal = date.value
    const toDoVal = {
        id: idGenerator(),
        task,
        date : dateVal,
        completed : false,
    }
    if(task){
        data.push(toDoVal)
        toDo.value = ""
        date.value = ""
        showAlert("ToDo successfully added","success")
        saveToStorage()
        
    }else{
         showAlert("Please Enter a ToDo !","error") 
    }

    displayToDo()
}

const deleteAll = () => {
    if(data.length) {
        data = []
        saveToStorage( )
        displayToDo()
        showAlert("ToDo successfully deleted","success")  
    }else{
        showAlert("No task found","error") 
    }
}
const applayEdit = (e) => {
    const id = parseInt(e.target.dataset.id)
    console.log(typeof id)
    const item = data.find(item => item.id === id)
    
    item.task = toDo.value
    item.date = date.value
    toDo.value = ""
    date.value = ""
    addBtn.style.display= "block"
    editBtn.style.display= "none"
    saveToStorage()
    displayToDo()
    showAlert("Edit successfully done","success")
}
const filterHandler = e => {
    let filterdData = null;
    switch(e.target.dataset.filterType){
        case "pending":
            filterdData = data.filter(item => item.completed === false)
        
            break;
        case "completed":
            filterdData = data.filter(item => item.completed === true)
            break;
        default:
            filterdData = data
            

    }
    displayToDo(filterdData)
}

window.addEventListener("load",()=>displayToDo() ) 

addBtn.addEventListener("click", addHandler )

delAllBtn.addEventListener("click", deleteAll)
editBtn.addEventListener("click", applayEdit)

filterBtn.forEach( btn => btn.addEventListener("click",filterHandler))