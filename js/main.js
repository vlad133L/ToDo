// Находим элементы на странице (form,input,ul)
const form = document.querySelector('#form')
const taskInput = document.querySelector('#taskInput')
const tasksList = document.querySelector('#tasksList')
const emptyList = document.querySelector('#emptyList')


let tasks = []

if(localStorage.getItem('tasks')){
	tasks = JSON.parse(localStorage.getItem('tasks'))
	tasks.forEach((task)=>renderTask(task))
}



checkEmptyList()


// Функции

function addTask(event){
		//Отменяем отправку формы (странинца не перезагружается)
		event.preventDefault()
	
		// Достаем текст задачи из поля ввода (input) 
		const taskText=taskInput.value
	

		// Описываем задачу в виде объекта 
		const newTask = {
			id: Date.now(),
			text: taskText,
			done: false,
		}

		// Добавляем объект в массив с задачами (tasks)
		tasks.push(newTask);

		// Сохраняем список задач в хранилище браузера localStorage
		saveToLocalStorage()


		// Рендерим задачу на страницу
		renderTask(newTask);
	
	// Очищаем поле ввода и также оставляем фокус на нём 
	taskInput.value = ''
	taskInput.focus()
	checkEmptyList()
}

function deleteTask(event){
		//Проверка если клик был НЕ по кнопке удалить задачу
		if(event.target.dataset.action !== 'delete') return


		//Проверка если клик был по кнопке удалить задачу
			const parentNode = event.target.closest('li')

			// Определяем ID задачи
			const id = +parentNode.id

			// Находим индекс задачи в массиве
			const index = tasks.findIndex((task)=>task.id === id)

			// Удаляем задачу из массива с задачами
			tasks.splice(index,1)

		// Сохраняем список задач в хранилище браузера localStorage
		saveToLocalStorage()

			//Удаляем задачу из разметки
			parentNode.remove()
			checkEmptyList()
}

function doneTask(event){
	//Проверка если клик был НЕ по кнопке "задача выполнена"
	if(event.target.dataset.action !== 'done') return

	// Проверяем, что клик был по конпке "задача выполнена"
		const parentNode = event.target.closest('li')

		// Определяем ID задачи
		const id = parentNode.id

		// Находим задачу в массиве задачами
		const task = tasks.find((task)=>task.id === +id)
		task.done=!task.done

		const taskTitle = parentNode.querySelector('.task-title')
		taskTitle.classList.toggle('task-title--done')

		// Сохраняем список задач в хранилище браузера localStorage
		saveToLocalStorage()

}

function checkEmptyList(){
	if(tasks.length===0){
		const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
		<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
		<div class="empty-list__title">Список дел пуст</div>
	</li>`
	tasksList.insertAdjacentHTML("afterbegin",emptyListHTML)
	}
	if(tasks.length>0){
		const emptyListEl = document.querySelector('#emptyList')
		emptyListEl ? emptyListEl.remove() : null 
	}
}

function saveToLocalStorage(){
	localStorage.setItem('tasks',JSON.stringify(tasks))
}

function renderTask(task){
	// Формируем CSS класс
	const cssClass = task.done ? "task-title task-title--done" : "task-title"


	//Формируем разметку для новой задачи (т.е при нажатии добавляется к списку задач новая задача)
	const taskHTML = `<li id = "${task.id}" class="list-group-item d-flex justify-content-between task-item">
	<span class="${cssClass}">${task.text}</span>
	<div class="task-item__buttons">
		<button type="button" data-action="done" class="btn-action">
			<img src="./img/tick.svg" alt="Done" width="18" height="18">
		</button>
		<button type="button" data-action="delete" class="btn-action">
			<img src="./img/cross.svg" alt="Done" width="18" height="18">
		</button>
	</div>
</li>`

 // Добавляем задачу на страницу 
tasksList.insertAdjacentHTML('beforeend',taskHTML)
}



// Добавление задачи
form.addEventListener('submit',addTask)


// Удаление задачи
tasksList.addEventListener('click',deleteTask)

// Отмечаем задачу завершенной
tasksList.addEventListener('click',doneTask)


