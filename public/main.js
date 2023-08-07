// select everything
// select todo-form
const todoForm = document.querySelector('.todo-form');
// select the input box

const todoInput = document.querySelector('.todoInput');
//select the <ul> with class="todo-items"

const todoItemsList = document.querySelector('.todo-items');

//array which stores every todos
let todos=[];
getFromServer();

//function to render given todos to screen
function renderToDo(todos){
    todoItemsList.innerHTML = '';

    //running through each item inside todos array
    todos.forEach((item) => {
        //checking if the item is completed
        const checked = item.completed? 'checked' : null;

        const li = document.createElement('li');

        //<li class="item">
        li.setAttribute('class','item');

        //<li class="item" date-key="Date.now()">
        li.setAttribute('data-key',item._id);

        //if item is completed then adding a class to li called checked
        if(item.completed == true){
            li.classList.add('checked');
        }
        li.innerHTML= `<img src="${item.fileName}" height="25px" width="25px"><span class="li-text">&nbsp;${item.name}</span><input type="checkbox" class="checkbox" ${checked}><button class="delete-button">X</button>`;

        todoItemsList.append(li);
    });
}

function getFromServer(){
    fetch('/todo')
        .then((res)=>{
            if(res.status === 200){
                return res.json();
            }
            else{
                alert("Something weird happened!!!");
            }
        }).then((data)=>{
            todos=data;
            renderToDo(todos);
            // debugger;
        })
}

function toggle(id){
    let data={}
    todos.forEach((item)=>{
        if(item._id==id){
            //toggle the value
            item.completed = !item.completed;
            data = {
                _id: item.id,
                name: item.name,
                completed: item.completed,
                fileName: item.fileName
            }
        }
    })

    fetch('/todo/'+id,{
        method: "PUT",
        headers: {
            "Content-Type":"application/json",
        },
        body: JSON.stringify(data)
    }).then((res)=>{
        if(res.status === 201){
            renderToDo(todos);
        }
        else{
            alert("Something went Wrong!!!");
        }
    })

}


function deleteToDo(id){
    todos = todos.filter((item)=>{
        return item._id != id;
    });
    fetch('/todo/'+id , {
        method: "DELETE",
    }).then((res)=>{
            if(res.status === 202){
                renderToDo(todos);
            }
            else{
                alert("Something weird happened!!!");
            }
        });
}

todoItemsList.addEventListener('click',(event)=>{
    //click if the event is on checkbox
    if(event.target.type === 'checkbox'){
        //toggling the state
        toggle(event.target.parentElement.getAttribute('data-key'));
    }

    //check if event is on delete
    if(event.target.classList.contains('delete-button')){
        deleteToDo(event.target.parentElement.getAttribute('data-key'));
    }
});