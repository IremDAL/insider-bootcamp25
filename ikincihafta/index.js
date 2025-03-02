let tasks = [];

let showCompletedOnly = false;

const taskForm = document.getElementById("taskForm");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const errorMessage = document.getElementById("errorMessage");
const taskList = document.getElementById("taskList");

const filterCompletedBtn = document.getElementById("filterCompletedBtn");
const sortPriorityBtn = document.getElementById("sortPriorityBtn");

taskForm.addEventListener("submit", function(event) {
  event.preventDefault(); 
  
  const titleValue = titleInput.value.trim();
  if (!titleValue) {
    errorMessage.textContent = "Görev başlığı boş bırakılamaz!";
    return;
  }

  const priorityValue = document.querySelector('input[name="priority"]:checked');
  if (!priorityValue) {
    errorMessage.textContent = "Lütfen bir öncelik seçiniz!";
    return;
  }

  errorMessage.textContent = "";

  const newTask = {
    id: Date.now(), 
    title: titleValue,
    description: descriptionInput.value.trim(),
    priority: priorityValue.value, 
    completed: false
  };

  tasks.push(newTask);
  updateTaskList();
  taskForm.reset();
});

filterCompletedBtn.addEventListener("click", function() {
  showCompletedOnly = !showCompletedOnly;
  filterCompletedBtn.textContent = showCompletedOnly
    ? "Tüm Görevleri Göster"
    : "Sadece Tamamlananları Göster";
  
  updateTaskList();
});

sortPriorityBtn.addEventListener("click", function() {
  const priorityMap = {
    "Düşük": 0,
    "Orta": 1,
    "Yüksek": 2
  };

  tasks.sort((a, b) => priorityMap[a.priority] - priorityMap[b.priority]);
  updateTaskList();
});


function updateTaskList() {
  taskList.innerHTML = "";
  let filteredTasks = tasks;
  if (showCompletedOnly) {
    filteredTasks = tasks.filter(task => task.completed);
  }

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.classList.add("task-item");
    
    if (task.completed) {
      li.classList.add("task-completed");
    }

    const contentDiv = document.createElement("div");
    contentDiv.classList.add("task-content");

    const tasktitle = document.createElement("h3");
    tasktitle.textContent = task.title;
    contentDiv.appendChild(tasktitle);

    if (task.description) {
      const taskdescription = document.createElement("p");
      taskdescription.textContent = task.description;
      contentDiv.appendChild(taskdescription);
    }

    const taskpriorty = document.createElement("span");
    taskpriorty.textContent = "Öncelik: " + task.priority;
    taskpriorty.classList.add("priority", "priority-" + task.priority.toLowerCase());
    contentDiv.appendChild(taskpriorty);

    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("task-actions");

    const completeBtn = document.createElement("button");
    completeBtn.classList.add("complete-btn");
    completeBtn.textContent = task.completed ? "Tamamlandı" : "Tamamla";
    completeBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      task.completed = !task.completed;
      updateTaskList();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "Sil";
    deleteBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      tasks = tasks.filter(t => t.id !== task.id);
      updateTaskList();
    });

    actionsDiv.appendChild(completeBtn);
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(contentDiv);
    li.appendChild(actionsDiv);

    taskList.appendChild(li);
  });
}
