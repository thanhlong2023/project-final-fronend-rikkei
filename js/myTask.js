// Kiểm tra xem người dùng đã đăng nhập hay chưa
const userLogin = JSON.parse(localStorage.getItem("userLogin"));
if (!userLogin) {
  window.location.href = "login.html"; // Nếu chưa đăng nhập, chuyển hướng đến trang login
}

// Màu sắc ưu tiên và tiến độ
const priorityColors = {
  Thấp: "#6c757d", // Màu xám
  "Trung bình": "#007bff", // Màu xanh dương
  Cao: "#dc3545", // Màu đỏ
};

const progressColors = {
  "Đúng tiến độ": "#28a745", // Màu xanh lá
  "Có rủi ro": "#ffc107", // Màu vàng
  "Trễ hạn": "#dc3545", // Màu đỏ
  "Hoàn thành": "#28a745", // Màu xanh lá
  "Đang chờ": "#17a2b8", // Màu cyan
};

const statusColors = {
  "To Do": "#6c757d",       // xám
  "In Progress": "#0d6efd", // xanh dương
  "Pending": "#fd7e14",     // cam
  "Done": "#198754",        // xanh lá
};

const getStatusColor = (status) => {
  const statusLower = status.toLowerCase();
  if (statusLower === "to do" || statusLower === "todo") return "#6c757d";
  if (statusLower === "in progress") return "#0d6efd";
  if (statusLower === "pending") return "#fd7e14";
  if (statusLower === "done") return "#198754";
  return "#000000";
};

// Lấy danh sách các dự án mà người dùng là chủ sở hữu
const allProjects = JSON.parse(localStorage.getItem("allProjects")) || [];
const projects = allProjects.filter((project) =>
  project.members.some(
    (member) => member.userId === userLogin.id && member.role === "Project owner"
  )
);

// Lấy danh sách các nhiệm vụ được giao cho người dùng
let tasks = JSON.parse(localStorage.getItem("tasks"));

if (!tasks) {
  tasks = [
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

  // Lưu lại danh sách nhiệm vụ vào localStorage
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

let myTasks = tasks.filter((task) => task.assigneeId === userLogin.id);

// Hàm hiển thị nhiệm vụ của người dùng, có thể tìm kiếm và sắp xếp theo các tùy chọn
function renderMyTask(searchKeyword = "", sortOption = "") {
  const taskListEl = document.getElementById("myTaskList");
  taskListEl.innerHTML = ""; // Xóa nội dung cũ

  // Lọc nhiệm vụ theo từ khóa tìm kiếm
  let filteredTasks = myTasks.filter((task) =>
    task.taskName.toLowerCase().includes(searchKeyword.toLowerCase())
  );


  // Sắp xếp nhiệm vụ theo các tùy chọn
  if (sortOption) {
    filteredTasks.sort((a, b) => {
      const priorities = { Cao: 3, "Trung bình": 2, Thấp: 1 };

      if (sortOption === "priority-desc") {
        return (priorities[b.priority] || 0) - (priorities[a.priority] || 0);
      } else if (sortOption === "priority-asc") {
        return (priorities[a.priority] || 0) - (priorities[b.priority] || 0);
      } else if (sortOption === "dueDate-asc") {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sortOption === "dueDate-desc") {
        return new Date(b.dueDate) - new Date(a.dueDate);
      }
      return 0;
    });
  }


  // Nhóm nhiệm vụ theo projectId
  const taskMap = {};
  filteredTasks.forEach((task) => {
    if (!taskMap[task.projectId]) {
      taskMap[task.projectId] = [];
    }
    taskMap[task.projectId].push(task);
  });
  // console.log(taskMap);

  // Nếu không có nhiệm vụ, hiển thị thông báo không có nhiệm vụ
  if (Object.keys(taskMap).length === 0) {
    taskListEl.innerHTML = `
      <tr>
        <td colspan="6" class="text-center">Không có nhiệm vụ nào.</td>
      </tr>
    `;
    return;
  }
  const allProjects = localStorage.getItem("allProjects") || [];
  // Hiển thị nhiệm vụ cho từng dự án
  for (const projectId in taskMap) {

    const projectIdHandler = taskMap[projectId][0].projectId

    // Tìm dự án trong mảng projects theo projectId
    // const project = projects.find((p) => p.id === Number(projectId));





    // const projectName = JSON.parse(allProjects).find((project) => project.id === projectIdHandler).projectName;


    const projectObj = JSON.parse(allProjects).find((project) => project.id === projectIdHandler);
    const projectName = projectObj ? projectObj.projectName : "Dự án đã bị xóa";


    const collapseId = `collapse-${projectId}`;

    // Tạo các hàng nhiệm vụ
    const taskRows = taskMap[projectId]
      .map((task) => {


        return `
        <tr>
          <td>${task.taskName || "Không có tên"}</td>
          <td>
            <span style="color: ${priorityColors[task.priority] || "#000"}; font-weight: bold">
              ${task.priority || "Không xác định"}
            </span>
          </td>
          <td 
              data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            data-task-id="${task.id}" 
            style="cursor: pointer;
             color: ${getStatusColor(task.status)};font-weight: bold"
            >${task.status || "Không xác định"}   <i class="fas fa-edit"></i>
          </td>
          <td style="color: #007bff">${task.asignDate || "Không có ngày"}</td>
          <td style="color: #007bff">${task.dueDate || "Không có hạn"}</td>
          <td>
            <span style="color: ${progressColors[task.progress] || "#000"}; font-weight: bold">
              ${task.progress || "Không xác định"}
            </span>
          </td>
        </tr>
      `;
      })
      .join("");

    // Tạo bảng con với các nhiệm vụ của dự án
    taskListEl.innerHTML += `
    <tr
      class="table-secondary"
      data-bs-toggle="collapse"
      data-bs-target="#${collapseId}"
      aria-expanded="true"
      aria-controls="${collapseId}"
      style="cursor: pointer;"
    >
      <td colspan="6"><strong>▼ ${projectName}</strong></td>
    </tr>
    <tr class="collapse show" id="${collapseId}">
      <td colspan="6" class="p-0">
        <table class="table table-bordered table-sm mb-0">
          <thead class="table-light">
            <tr>
              <th>Tên Nhiệm Vụ</th>
              <th>Độ Ưu Tiên</th>
              <th>Trạng Thái</th>
              <th>Ngày Bắt Đầu</th>
              <th>Hạn Chót</th>
              <th>Tiến Độ</th>
            </tr>
          </thead>
          <tbody>
            ${taskRows}
          </tbody>
        </table>
      </td>
    </tr>
  `;
  }
}

// Hiển thị danh sách nhiệm vụ ngay khi trang được tải
document.addEventListener("DOMContentLoaded", () => {
  renderMyTask();
});

// Lắng nghe sự kiện tìm kiếm và sắp xếp
document.getElementById("searchTasks").addEventListener("input", (e) => {
  const searchKeyword = e.target.value;
  renderMyTask(searchKeyword, document.getElementById("sortTasks").value);
});

document.getElementById("sortTasks").addEventListener("change", (e) => {
  const sortOption = e.target.value;
  renderMyTask(document.getElementById("searchTasks").value, sortOption);
});

//edit status
let selectedTaskId = null; // Biến toàn cục lưu id task đang chỉnh

// Khi mở modal
document.getElementById('exampleModal').addEventListener('show.bs.modal', function (event) {
  const button = event.relatedTarget;
  selectedTaskId = button.getAttribute('data-task-id');

  const task = tasks.find(t => t.id === Number(selectedTaskId));
  if (!task) return;

  const modalHeader = document.getElementById('modalHeader');
  const modalContent = document.getElementById('modalContent');

  const isEditable = (task.status === "Pending" || task.status === "In progress");

  //vô hiệu hóa nút lưu nếu không phải là trạng thái đang chờ hoặc đang thực hiện
  document.getElementById('btnSave').disabled = !isEditable;
  //nếu không phải là trạng thái đang chờ hoặc đang thực hiện thì 
  if (!isEditable) {
    modalHeader.innerHTML = `<h5>Không được sửa trạng thái nhiệm vụ: ${task.taskName}</h5>`;
  } else {
    modalHeader.innerHTML = `<h5>Chỉnh sửa trạng thái nhiệm vụ: ${task.taskName}</h5>`;
  }


  modalContent.innerHTML = `
        <select id="statusSelect" class="form-select" ${isEditable ? "" : "disabled"}>
          <option value="Pending" ${task.status === "Pending" ? "selected" : ""}>Pending</option>
          <option value="In progress" ${task.status === "In progress" ? "selected" : ""}>In progress</option>
        </select>
    `;
});


document.getElementById('btnSave').addEventListener('click', function () {
  if (!selectedTaskId) return;

  const newStatus = document.getElementById('statusSelect').value;

  // Tìm task cần cập nhật
  const taskIndex = tasks.findIndex(t => t.id === Number(selectedTaskId));
  if (taskIndex === -1) return;

  tasks[taskIndex].status = newStatus;

  // Lưu lại vào localStorage
  localStorage.setItem('tasks', JSON.stringify(tasks));

  // Cập nhật lại giao diện
  myTasks = tasks.filter((task) => task.assigneeId === userLogin.id);
  renderMyTask(
    document.getElementById("searchTasks").value,
    document.getElementById("sortTasks").value
  );

  // Ẩn modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
  modal.hide();
});
