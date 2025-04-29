let tasks = [
    {
        "id": 1745757456912,
        "taskName": "Soạn thảo đề cương dự án",
        "assigneeId": 8,
        "projectId": 1745757370438,
        "asignDate": "2025-04-27",
        "dueDate": "2025-04-28",
        "priority": "Trung bình",
        "progress": "Đang chờ",
        "status": "To do"
    },
    {
        "id": 1745759015593,
        "taskName": "Soạn thảo đề cương dự án",
        "assigneeId": 2,
        "projectId": 1,
        "asignDate": "2025-04-28",
        "dueDate": "2025-05-01",
        "priority": "Trung bình",
        "progress": "Đúng tiến độ",
        "status": "To do"
    },
    {
        "id": 1745759057708,
        "taskName": "Thiết kế",
        "assigneeId": 2,
        "projectId": 1,
        "asignDate": "2025-04-28",
        "dueDate": "2025-04-29",
        "priority": "Thấp",
        "progress": "Đúng tiến độ",
        "status": "In progress"
    },
    {
        "id": 1745760187226,
        "taskName": "Soạn thảo đề cương dự án",
        "assigneeId": 2,
        "projectId": 2,
        "asignDate": "2025-04-27",
        "dueDate": "2025-04-30",
        "priority": "Thấp",
        "progress": "Đúng tiến độ",
        "status": "Pending"
    },
    {
        "id": 1745760265317,
        "taskName": "Soạn thảo đề cương dự án 77",
        "assigneeId": 2,
        "projectId": 2,
        "asignDate": "2025-04-28",
        "dueDate": "2025-04-30",
        "priority": "Trung bình",
        "progress": "Trễ hạn",
        "status": "Pending"
    }
];



if (!localStorage.getItem('tasks')) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('id');

const userLogin = JSON.parse(localStorage.getItem('userLogin'));

if (!userLogin) {
    window.location.href = 'login.html';
}

function checkDueDate(dueDate) {
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
}

function cleanTasksForNonMembers(projectId) {
    const allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const allProjects = JSON.parse(localStorage.getItem('allProjects')) || [];
    const project = allProjects.find(p => p.id === Number(projectId));

    if (!project || !project.members || project.members.length === 0) {
        // Nếu dự án không tồn tại hoặc không có thành viên, xóa tất cả task của dự án
        const updatedTasks = allTasks.filter(task => task.projectId !== Number(projectId));
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        return;
    }

    // Lấy danh sách userId của các thành viên trong dự án
    const validMemberIds = project.members.map(member => member.userId);

    // Lọc bỏ các task có assigneeId không nằm trong danh sách thành viên
    const updatedTasks = allTasks.filter(task =>
        task.projectId !== Number(projectId) || validMemberIds.includes(task.assigneeId)
    );

    // Cập nhật localStorage
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

function getTasksByProjectId(projectId) {
    // Gọi hàm để xóa task của các thành viên không còn trong dự án
    cleanTasksForNonMembers(projectId);

    const allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    return allTasks.filter(task => task.projectId == projectId);
}

function searchTasksByName(keyword, tasks) {
    if (!keyword.trim()) return tasks;
    return tasks.filter(task => task.taskName.toLowerCase().includes(keyword.toLowerCase()));
}

function sortTasks(tasks, sortOption) {
    const priorityOrder = { 'Cao': 1, 'Trung bình': 2, 'Thấp': 3 };
    if (!sortOption) return tasks;

    return [...tasks].sort((a, b) => {
        if (sortOption === 'dueDate-asc') {
            return new Date(a.dueDate) - new Date(b.dueDate);
        } else if (sortOption === 'dueDate-desc') {
            return new Date(b.dueDate) - new Date(a.dueDate);
        } else if (sortOption === 'priority-desc') {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        } else if (sortOption === 'priority-asc') {
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return 0;
    });
}

function renderTaskList(searchKeyword = '', sortOption = '') {
    let tasks = getTasksByProjectId(projectId);
    tasks = searchTasksByName(searchKeyword, tasks);
    tasks = sortTasks(tasks, sortOption);

    const tasksTodo = tasks.filter(task => task.status === 'To do');
    const tasksInProgress = tasks.filter(task => task.status === 'In progress');
    const tasksPending = tasks.filter(task => task.status === 'Pending');
    const tasksDone = tasks.filter(task => task.status === 'Done');

    const todoTableBody = document.getElementById('groupTodo');
    const inProgressTableBody = document.getElementById('groupInProgress');
    const pendingTableBody = document.getElementById('groupPending');
    const doneTableBody = document.getElementById('groupDone');

    const progressColors = {
        'Đúng tiến độ': '#28a745',
        'Có rủi ro': '#ffc107',
        'Trễ hạn': '#dc3545',
        'Hoàn thành': '#28a745',
        'Đang chờ': '#17a2b8'
    };

    const priorityColors = {
        'Thấp': '#6c757d',
        'Trung bình': '#007bff',
        'Cao': '#dc3545'
    };

    function createRow(task) {
        const tr = document.createElement('tr');
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const nameAssignee = users.find(user => user.id === task.assigneeId)?.fullName || 'Không xác định';
        tr.innerHTML = `
            <td>${task.taskName}</td>
            <td>${nameAssignee}</td>
            <td><span style="color: ${priorityColors[task.priority]}; font-weight: bold">${task.priority}</span></td>
            <td style="color: #007bff">${task.asignDate}</td>
            <td style="color: #007bff">${task.dueDate}</td>
            <td><span style="color: ${progressColors[task.progress]}; font-weight: bold">${task.progress}</span></td>
            <td>
                <button class="btn btn-warning" onclick="editTask(${task.id})" data-bs-toggle="modal" data-bs-target="#exampleModal">Sửa</button>
                <button class="btn btn-danger" onclick="deleteTask(${task.id})">Xóa</button>
            </td>
        `;
        return tr;
    }

    todoTableBody.innerHTML = '';
    inProgressTableBody.innerHTML = '';
    pendingTableBody.innerHTML = '';
    doneTableBody.innerHTML = '';

    tasksTodo.forEach(task => todoTableBody.appendChild(createRow(task)));
    tasksInProgress.forEach(task => inProgressTableBody.appendChild(createRow(task)));
    tasksPending.forEach(task => pendingTableBody.appendChild(createRow(task)));
    tasksDone.forEach(task => doneTableBody.appendChild(createRow(task)));

    document.querySelectorAll('.collapse').forEach(group => {
        group.classList.add('show');
    });
    document.querySelectorAll('.group-toggle').forEach(toggle => {
        toggle.setAttribute('aria-expanded', 'true');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderTaskList();

    const searchInput = document.getElementById('searchTask');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const keyword = searchInput.value.trim();
            const sortOption = document.getElementById('sortTasks')?.value || '';
            renderTaskList(keyword, sortOption);
        });
    } else {
        console.error("Không tìm thấy phần tử với id 'searchTask'");
    }

    const sortSelect = document.getElementById('sortTasks');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            const sortOption = sortSelect.value;
            const keyword = document.getElementById('searchTask')?.value.trim() || '';
            renderTaskList(keyword, sortOption);
        });
    } else {
        console.error("Không tìm thấy phần tử với id 'sortTasks'");
    }
});

function editTask(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskToEdit = tasks.find(task => task.id === taskId);
    if (!taskToEdit) {
        console.error("Không tìm thấy nhiệm vụ với id:", taskId);
        return;
    }

    const titleModal = document.getElementById('exampleModalLabel');
    titleModal.innerText = 'Sửa nhiệm vụ';
    const btnSave = document.getElementById('btnSave');
    btnSave.innerText = 'Lưu thay đổi';
    document.getElementById("modalHeader").innerHTML = `
   
    `;

    const modalBody = document.getElementById("modalContent");
    modalBody.innerHTML = `
        <div class="mb-3">
            <label for="taskName" class="form-label">Tên nhiệm vụ</label>
            <input type="text" class="form-control" id="taskName" value="${taskToEdit.taskName}"/>
            <div class="invalid-feedback" id="taskNameFeedback"></div>
        </div>
        <div class="mb-3">
            <label for="assignedTo" class="form-label">Người phụ trách</label>
            <select class="form-select" id="assignedTo">
                <option value="" disabled>Chọn người phụ trách</option>
            </select>
            <div class="invalid-feedback" id="assignedToFeedback"></div>
        </div>
        <div class="mb-3">
            <label for="status" class="form-label">Trạng thái</label>
            <select class="form-select" id="status">
                <option value="" disabled>Chọn trạng thái nhiệm vụ</option>
            </select>
            <div class="invalid-feedback" id="statusFeedback"></div>
        </div>
        <div class="mb-3">
            <label for="startDate" class="form-label">Ngày bắt đầu</label>
            <input type="date" class="form-control" id="startDate" value="${taskToEdit.asignDate}"/>
            <div class="invalid-feedback" id="startDateFeedback"></div>
        </div>
        <div class="mb-3">
            <label for="endDate" class="form-label">Hạn cuối</label>
            <input type="date" class="form-control" id="endDate" value="${taskToEdit.dueDate}"/>
            <div class="invalid-feedback" id="endDateFeedback"></div>
        </div>
        <div class="mb-3">
            <label for="priority" class="form-label">Độ ưu tiên</label>
            <select class="form-select" id="priority">
                <option value="" disabled>Chọn độ ưu tiên</option>
            </select>
            <div class="invalid-feedback" id="priorityFeedback"></div>
        </div>
        <div class="mb-4">
            <label for="progress" class="form-label">Tiến độ</label>
            <select class="form-select" id="progress">
                <option value="" disabled>Chọn tiến độ</option>
            </select>
            <div class="invalid-feedback" id="progressFeedback"></div>
        </div>
    `;

    const project = JSON.parse(localStorage.getItem('allProjects')).find(p => p.id == projectId);
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const assignedTo = document.getElementById("assignedTo");
    assignedTo.innerHTML += project.members.map(member => {
        const userName = users.find(user => user.id === member.userId)?.fullName || 'Không xác định';
        return `<option value="${member.userId}" ${member.userId === taskToEdit.assigneeId ? 'selected' : ''}>${userName}</option>`;
    }).join('');

    const statusOptions = ['To do', 'In progress', 'Pending', 'Done'];
    const statusSelect = document.getElementById('status');
    statusSelect.innerHTML += statusOptions.map(status =>
        `<option value="${status}" ${status === taskToEdit.status ? 'selected' : ''}>${status}</option>`
    ).join('');

    const priorityOptions = ['Thấp', 'Trung bình', 'Cao'];
    const prioritySelect = document.getElementById('priority');
    prioritySelect.innerHTML += priorityOptions.map(priority =>
        `<option value="${priority}" ${priority === taskToEdit.priority ? 'selected' : ''}>${priority}</option>`
    ).join('');

    const progressOptions = ['Đúng tiến độ', 'Có rủi ro', 'Trễ hạn', 'Hoàn thành', 'Đang chờ'];
    const progressSelect = document.getElementById('progress');
    progressSelect.innerHTML += progressOptions.map(progress =>
        `<option value="${progress}" ${progress === taskToEdit.progress ? 'selected' : ''}>${progress}</option>`
    ).join('');

    const newBtnSave = btnSave.cloneNode(true);
    btnSave.parentNode.replaceChild(newBtnSave, btnSave);

    newBtnSave.addEventListener('click', function () {
        const taskName = document.getElementById('taskName');
        const assignedTo = document.getElementById('assignedTo');
        const status = document.getElementById('status');
        const startDate = document.getElementById('startDate');
        const endDate = document.getElementById('endDate');
        const priority = document.getElementById('priority');
        const progress = document.getElementById('progress');

        [taskName, assignedTo, status, startDate, endDate, priority, progress].forEach(el => el.classList.remove('is-invalid'));

        let isValid = true;

        if (!taskName.value.trim()) {
            taskName.classList.add('is-invalid');
            document.getElementById('taskNameFeedback').innerText = 'Tên nhiệm vụ không được để trống';
            isValid = false;
        }



        if (!assignedTo.value) {
            assignedTo.classList.add('is-invalid');
            document.getElementById('assignedToFeedback').innerText = 'Chọn người phụ trách';
            isValid = false;
        }
        if (!status.value) {
            status.classList.add('is-invalid');
            document.getElementById('statusFeedback').innerText = 'Chọn trạng thái';
            isValid = false;
        }
        if (!startDate.value) {
            startDate.classList.add('is-invalid');
            document.getElementById('startDateFeedback').innerText = 'Chọn ngày bắt đầu';
            isValid = false;
        }
        if (startDate.value) {
            const inputDate = new Date(startDate.value);
            const today = new Date();

            // Reset giờ phút giây cả 2 về 00:00:00
            inputDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            if (inputDate < today) {
                startDate.classList.add('is-invalid');
                document.getElementById('startDateFeedback').innerText = 'Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại';
                isValid = false;
            }
        }
        if (!endDate.value) {
            endDate.classList.add('is-invalid');
            document.getElementById('endDateFeedback').innerText = 'Chọn hạn cuối';
            isValid = false;
        } else if (startDate.value && new Date(endDate.value) <= new Date(startDate.value)) {
            endDate.classList.add('is-invalid');
            document.getElementById('endDateFeedback').innerText = 'Ngày hết hạn phải sau ngày bắt đầu';
            isValid = false;
        }
        if (!priority.value) {
            priority.classList.add('is-invalid');
            document.getElementById('priorityFeedback').innerText = 'Chọn độ ưu tiên';
            isValid = false;
        }
        if (!progress.value) {
            progress.classList.add('is-invalid');
            document.getElementById('progressFeedback').innerText = 'Chọn tiến độ';
            isValid = false;
        }

        if (!isValid) return;

        const updatedTask = {
            id: taskId,
            taskName: taskName.value.trim(),
            assigneeId: parseInt(assignedTo.value),
            projectId: parseInt(projectId),
            asignDate: startDate.value,
            dueDate: endDate.value,
            priority: priority.value,
            progress: progress.value,
            status: status.value
        };

        const currentTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const taskIndex = currentTasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            currentTasks[taskIndex] = updatedTask;
            localStorage.setItem('tasks', JSON.stringify(currentTasks));
        }

        const keyword = document.getElementById('searchTask')?.value.trim() || '';
        const sortOption = document.getElementById('sortTasks')?.value || '';
        renderTaskList(keyword, sortOption);

        const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
        modal.hide();
    });
}

function deleteTask(taskId) {
    Swal.fire({
        title: "Bạn chắc chắn?",
        text: "Bạn có muốn xóa Task này không?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Huỷ",
    }).then((result) => {
        if (result.isConfirmed) {
            let allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
            const updatedTasks = allTasks.filter(task => task.id !== taskId);
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
            const keyword = document.getElementById('searchTask')?.value.trim() || '';
            const sortOption = document.getElementById('sortTasks')?.value || '';
            renderTaskList(keyword, sortOption);
            Swal.fire("Đã xóa!", "Task đã được xóa.", "success");
        }
    });
}

document.getElementById('addTask').addEventListener('click', function () {
    const titleModal = document.getElementById('exampleModalLabel');
    titleModal.innerText = 'Thêm nhiệm vụ mới';
    const btnSave = document.getElementById('btnSave');
    btnSave.innerText = 'Thêm nhiệm vụ';
    document.getElementById("modalHeader").innerHTML = `
   
  `;

    const modalBody = document.getElementById("modalContent");
    modalBody.innerHTML = `
        <div class="mb-3">
            <label for="taskName" class="form-label">Tên nhiệm vụ</label>
            <input type="text" class="form-control" id="taskName" value=""/>
            <div class="invalid-feedback" id="taskNameFeedback"></div>
        </div>
        <div class="mb-3">
            <label for="assignedTo" class="form-label">Người phụ trách</label>
            <select class="form-select" id="assignedTo">
                <option value="" disabled selected>Chọn người phụ trách</option>
            </select>
            <div class="invalid-feedback" id="assignedToFeedback"></div>
        </div>
        <div class="mb-3">
            <label for="status" class="form-label">Trạng thái</label>
            <select class="form-select" id="status">
                <option value="" disabled selected>Chọn trạng thái nhiệm vụ</option>
            </select>
            <div class="invalid-feedback" id="statusFeedback"></div>
        </div>
        <div class="mb-3">
            <label for="startDate" class="form-label">Ngày bắt đầu</label>
            <input type="date" class="form-control" id="startDate" />
            <div class="invalid-feedback" id="startDateFeedback"></div>
        </div>
        <div class="mb-3">
            <label for="endDate" class="form-label">Hạn cuối</label>
            <input type="date" class="form-control" id="endDate" />
            <div class="invalid-feedback" id="endDateFeedback"></div>
        </div>
        <div class="mb-3">
            <label for="priority" class="form-label">Độ ưu tiên</label>
            <select class="form-select" id="priority">
                <option value="" disabled selected>Chọn độ ưu tiên</option>
            </select>
            <div class="invalid-feedback" id="priorityFeedback"></div>
        </div>
        <div class="mb-4">
            <label for="progress" class="form-label">Tiến độ</label>
            <select class="form-select" id="progress">
                <option value="" disabled selected>Chọn tiến độ</option>
            </select>
            <div class="invalid-feedback" id="progressFeedback"></div>
        </div>
    `;

    const project = JSON.parse(localStorage.getItem('allProjects')).find(p => p.id == projectId);
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const assignedTo = document.getElementById("assignedTo");
    assignedTo.innerHTML += project.members.map(member => {
        const userName = users.find(user => user.id === member.userId)?.fullName || 'Không xác định';
        return `<option value="${member.userId}">${userName}</option>`;
    }).join('');

    const statusOptions = ['To do', 'In progress', 'Pending', 'Done'];
    const statusSelect = document.getElementById('status');
    statusSelect.innerHTML += statusOptions.map(status => `<option value="${status}">${status}</option>`).join('');

    const priorityOptions = ['Thấp', 'Trung bình', 'Cao'];
    const prioritySelect = document.getElementById('priority');
    prioritySelect.innerHTML += priorityOptions.map(priority => `<option value="${priority}">${priority}</option>`).join('');

    const progressOptions = ['Đúng tiến độ', 'Có rủi ro', 'Trễ hạn', 'Hoàn thành', 'Đang chờ'];
    const progressSelect = document.getElementById('progress');
    progressSelect.innerHTML += progressOptions.map(progress => `<option value="${progress}">${progress}</option>`).join('');

    const newBtnSave = btnSave.cloneNode(true);
    btnSave.parentNode.replaceChild(newBtnSave, btnSave);

    newBtnSave.addEventListener('click', function () {
        const taskName = document.getElementById('taskName');
        const assignedTo = document.getElementById('assignedTo');
        const status = document.getElementById('status');
        const startDate = document.getElementById('startDate');
        const endDate = document.getElementById('endDate');
        const priority = document.getElementById('priority');
        const progress = document.getElementById('progress');

        [taskName, assignedTo, status, startDate, endDate, priority, progress].forEach(el => el.classList.remove('is-invalid'));

        let isValid = true;

        if (!taskName.value.trim()) {
            taskName.classList.add('is-invalid');
            document.getElementById('taskNameFeedback').innerText = 'Tên nhiệm vụ không được để trống';
            isValid = false;
        }
        //tên nhiệm vụ không trùng với nhau
        const allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const isDuplicate = allTasks.some(task => task.taskName.toLowerCase() === taskName.value.trim().toLowerCase());

        if (isDuplicate) {
            //kiểm tra xem có cùng 1 dự án hay không
            const isSameProject = allTasks.some(task => task.taskName.toLowerCase() === taskName.value.trim().toLowerCase() && task.projectId == projectId);
            if (isSameProject) {
                taskName.classList.add('is-invalid');
                document.getElementById('taskNameFeedback').innerText = 'Tên nhiệm vụ đã tồn tại trong dự án này';
                isValid = false;
            }
        }
        //tên nhiệm vụ dài hơn 5 ký tự
        if (taskName.value.trim().length < 5) {
            taskName.classList.add('is-invalid');
            document.getElementById('taskNameFeedback').innerText = 'Tên nhiệm vụ phải dài hơn 5 ký tự';
            isValid = false;
        }

        if (!assignedTo.value) {
            assignedTo.classList.add('is-invalid');
            document.getElementById('assignedToFeedback').innerText = 'Chọn người phụ trách';
            isValid = false;
        }
        if (!status.value) {
            status.classList.add('is-invalid');
            document.getElementById('statusFeedback').innerText = 'Chọn trạng thái';
            isValid = false;
        }
        if (!startDate.value) {
            startDate.classList.add('is-invalid');
            document.getElementById('startDateFeedback').innerText = 'Chọn ngày bắt đầu';
            isValid = false;
        }

        if (startDate.value) {
            const inputDate = new Date(startDate.value);
            const today = new Date();

            // Reset giờ phút giây cả 2 về 00:00:00
            inputDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            if (inputDate < today) {
                startDate.classList.add('is-invalid');
                document.getElementById('startDateFeedback').innerText = 'Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại';
                isValid = false;
            }
        }

        if (!endDate.value) {
            endDate.classList.add('is-invalid');
            document.getElementById('endDateFeedback').innerText = 'Chọn hạn cuối';
            isValid = false;
        } else if (startDate.value && new Date(endDate.value) <= new Date(startDate.value)) {
            endDate.classList.add('is-invalid');
            document.getElementById('endDateFeedback').innerText = 'Ngày hết hạn phải sau ngày bắt đầu';
            isValid = false;
        }
        if (!priority.value) {
            priority.classList.add('is-invalid');
            document.getElementById('priorityFeedback').innerText = 'Chọn độ ưu tiên';
            isValid = false;
        }
        if (!progress.value) {
            progress.classList.add('is-invalid');
            document.getElementById('progressFeedback').innerText = 'Chọn tiến độ';
            isValid = false;
        }

        if (!isValid) return;

        const newTask = {
            id: Date.now(),
            taskName: taskName.value.trim(),
            assigneeId: parseInt(assignedTo.value),
            projectId: parseInt(projectId),
            asignDate: startDate.value,
            dueDate: endDate.value,
            priority: priority.value,
            progress: progress.value,
            status: status.value
        };

        const currentTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        currentTasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(currentTasks));

        const keyword = document.getElementById('searchTask')?.value.trim() || '';
        const sortOption = document.getElementById('sortTasks')?.value || '';
        renderTaskList(keyword, sortOption);

        const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
        modal.hide();
    });
});