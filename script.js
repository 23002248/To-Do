document.addEventListener('DOMContentLoaded', () => {

    // --- SELECTING DOM ELEMENTS ---
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const emptyMessage = document.getElementById('empty-message');
    const filterAllBtn = document.getElementById('filter-all');
    const filterActiveBtn = document.getElementById('filter-active');
    const filterCompletedBtn = document.getElementById('filter-completed');

    // --- STATE MANAGEMENT ---
    // The "single source of truth" for our tasks.
    // We load from localStorage, or initialize an empty array.
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all'; // can be 'all', 'active', or 'completed'

    // --- DATA PERSISTENCE FUNCTIONS ---
    // Saves the current 'tasks' array to localStorage.
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // --- CORE RENDERING FUNCTION ---
    // This function is responsible for drawing the tasks on the screen.
    const renderTasks = () => {
        // Clear the current list
        taskList.innerHTML = '';

        // Filter tasks based on the current filter
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'active') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true; // 'all'
        });

        // Show or hide the empty message
        if (filteredTasks.length === 0) {
            emptyMessage.classList.remove('hidden');
        } else {
            emptyMessage.classList.add('hidden');
        }
        
        // Create and append list items for each task
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.setAttribute('data-id', task.id);
            if (task.completed) {
                li.classList.add('completed');
            }

            const taskTextSpan = document.createElement('span');
            taskTextSpan.className = 'task-text';
            taskTextSpan.textContent = task.text;

            // Make task text editable on click
            taskTextSpan.addEventListener('click', () => {
                const newText = prompt('Edit your task:', task.text);
                if (newText !== null && newText.trim() !== '') {
                    editTask(task.id, newText.trim());
                }
            });

            const taskActions = document.createElement('div');
            taskActions.className = 'task-actions';

            const completeIcon = document.createElement('i');
            completeIcon.className = `fas fa-check-circle ${task.completed ? 'completed' : ''}`;
            completeIcon.addEventListener('click', () => toggleComplete(task.id));

            const editIcon = document.createElement('i');
            editIcon.className = 'fas fa-edit';
            editIcon.addEventListener('click', () => {
                taskTextSpan.click(); // Simulate click on text to edit
            });

            const deleteIcon = document.createElement('i');
            deleteIcon.className = 'fas fa-trash';
            deleteIcon.addEventListener('click', () => deleteTask(task.id));

            taskActions.appendChild(completeIcon);
            taskActions.appendChild(editIcon);
            taskActions.appendChild(deleteIcon);
            
            li.appendChild(taskTextSpan);
            li.appendChild(taskActions);
            taskList.appendChild(li);
        });
    };

    // --- TASK MANIPULATION FUNCTIONS ---
    const addTask = () => {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        const newTask = {
            id: Date.now(), // Unique ID using timestamp
            text: taskText,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskInput.value = '';
        taskInput.focus();
    };

    const deleteTask = (id) => {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    };
    
    const toggleComplete = (id) => {
        const task = tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        }
    };
    
    const editTask = (id, newText) => {
        const task = tasks.find(task => task.id === id);
        if (task) {
            task.text = newText;
            saveTasks();
            renderTasks();
        }
    };

    // --- FILTERING LOGIC ---
    const updateFilter = (filter) => {
        currentFilter = filter;
        // Update active class on buttons
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`filter-${filter}`).classList.add('active');
        renderTasks();
    };


    // --- EVENT LISTENERS ---
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    filterAllBtn.addEventListener('click', () => updateFilter('all'));
    filterActiveBtn.addEventListener('click', () => updateFilter('active'));
    filterCompletedBtn.addEventListener('click', () => updateFilter('completed'));

    // --- INITIAL RENDER ---
    // Render the tasks when the page first loads.
    renderTasks();
});