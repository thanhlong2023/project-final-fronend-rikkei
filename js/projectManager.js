import validate from "./validate.js";

// Kiểm tra xem người dùng đã đăng nhập hay chưa
const userLogin = JSON.parse(localStorage.getItem("userLogin"));
if (!userLogin) {
    window.location.href = "login.html"; // Nếu chưa đăng nhập, chuyển hướng đến trang login
}

// Dữ liệu mẫu ban đầu (allProjects không thay đổi)
let allProjects = JSON.parse(localStorage.getItem("allProjects"));

if (!allProjects) {
    allProjects = [
        {
            "id": 1,
            "projectName": "Website bán hàng",
            "members": [
                {
                    "userId": 2,
                    "role": "Project Owner"
                },
                {
                    "userId": 3,
                    "role": "Frontend Developer"
                }
            ],
            "description": "Phát triển website bán hàng online."
        },
        {
            "id": 2,
            "projectName": "Ứng dụng học tiếng Anh",
            "members": [
                {
                    "userId": 2,
                    "role": "Project Owner"
                },
                {
                    "userId": 5,
                    "role": "Backend Developer"
                }
            ],
            "description": "Xây dựng app học tiếng Anh tương tác."
        },
        {
            "id": 3,
            "projectName": "Hệ thống quản lý kho",
            "members": [
                {
                    "userId": 2,
                    "role": "Project Owner"
                },
                {
                    "userId": 7,
                    "role": "Tester"
                }
            ],
            "description": "Quản lý tồn kho và xuất nhập hàng hóa."
        },
        {
            "id": 1745757370438,
            "projectName": "dự án 99991",
            "members": [
                {
                    "userId": 8,
                    "role": "Project owner"
                },
                {
                    "userId": 7,
                    "role": "UI"
                }
            ],
            "description": "dự án 9999dự án 9999dự án 9999dự án 9999dự án 9999dự án 9999dự án 9999"
        },
        {
            "id": 1745757392609,
            "projectName": "dự án 21111111111111",
            "members": [
                {
                    "userId": 8,
                    "role": "Project owner"
                }
            ],
            "description": "dự án 21111111111111dự án 21111111111111dự án 21111111111111dự án 21111111111111dự án 21111111111111dự án 21111111111111"
        },
        {
            "id": 1745758088742,
            "projectName": "Quản lý nhà xe",
            "members": [
                {
                    "userId": 2,
                    "role": "Project owner"
                }
            ],
            "description": "dự án 2 dự án 2 dự án 2 dự án 2 dự án 2 dự án 2 dự án 2 dự án 2 "
        },
        {
            "id": 1745758155658,
            "projectName": "dự án 3",
            "members": [
                {
                    "userId": 2,
                    "role": "Project owner"
                }
            ],
            "description": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
        },
        {
            "id": 1745758217369,
            "projectName": "dự án 2231312",
            "members": [
                {
                    "userId": 2,
                    "role": "Project owner"
                }
            ],
            "description": "dự án 2231312dự án 2231312dự án 2231312dự án 2231312dự án 2231312dự án 2231312"
        }
    ];
    localStorage.setItem("allProjects", JSON.stringify(allProjects));
}




// Lấy thông tin người dùng đang đăng nhập
const productOwner = JSON.parse(localStorage.getItem("userLogin"));
let projects = [];

if (!productOwner) {
    window.location.href = "login.html";
} else {
    projects = allProjects.filter(project =>
        project.members.some(member =>
            member.userId === productOwner.id && member.role.toLowerCase() === "project owner"
        )
    );

}

// Hàm render danh sách
function renderProjectList(projectsToRender) {
    const projectTableBody = document.getElementById("projectTableBody");
    projectTableBody.innerHTML = "";
    projectsToRender.forEach((project) => {
        const projectRow = document.createElement("tr");
        projectRow.innerHTML = `
            <td class="text-center">${project.id}</td>
            <td>${project.projectName}</td>
            <td class="text-center">
                <button class="btn-edit btn btn-warning btn-sm" data-id="${project.id}" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal">Sửa</button>
                <button class="btn-delete btn btn-danger btn-sm" data-id="${project.id}" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal">Xóa</button>
                <button class="btn-detail btn btn-primary btn-sm" data-id="${project.id}" type="button" >Chi tiết</button>
            </td>
        `;
        projectTableBody.appendChild(projectRow);
    });
}

//pagination
let currentPage = 1;
const itemsPerPage = 5;

function getCurrentProjects() {
    return projects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
}

function renderPagination() {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    const totalItems = projects.length;

    //page numbers
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        const pageItem = document.createElement("li");
        pageItem.classList.add("page-item");
        pageItem.innerHTML = `
            <a class="page-link" href="#">${i}</a>
        `;
        if (i === currentPage) {
            pageItem.classList.add("active");
        }
        pageItem.addEventListener("click", () => {
            currentPage = i;
            renderProjectList(getCurrentProjects());
            renderPagination();
        });
        pagination.appendChild(pageItem);
    }

    //prev button
    const prevItem = document.createElement("li");
    prevItem.classList.add("page-item", "disabled");
    prevItem.innerHTML = `
        <a class="page-link" href="#">Prev</a>
    `;
    if (currentPage > 1) {
        prevItem.classList.remove("disabled");
        prevItem.addEventListener("click", () => {
            currentPage--;
            renderProjectList(getCurrentProjects());
            renderPagination();
        });
    }
    pagination.prepend(prevItem);

    //next button
    const nextItem = document.createElement("li");
    nextItem.classList.add("page-item");
    nextItem.innerHTML = `
        <a class="page-link" href="#">Next</a>
    `;
    if (currentPage < Math.ceil(totalItems / itemsPerPage)) {
        nextItem.classList.remove("disabled");
        nextItem.addEventListener("click", () => {
            currentPage++;
            renderProjectList(getCurrentProjects());
            renderPagination();
        });
    }
    pagination.appendChild(nextItem);
}


renderProjectList(getCurrentProjects());
renderPagination();

document.getElementById("addProjectBtn").addEventListener("click", function () {
    document.getElementById("exampleModalLabel").innerText = "Thêm dự án mới";
    document.getElementById("modalForm").innerHTML = `
        <div class="mb-3">
            <label for="projectName" class="form-label">Tên dự án</label>
            <input type="text" class="form-control" id="projectName" required>
        </div>
        <div class="mb-3">
            <label for="projectDescription" class="form-label">Mô tả</label>
            <textarea class="form-control" id="projectDescription" rows="3"></textarea>
        </div>
    `;
    const saveBtn = document.getElementById("modalSaveBtn");
    saveBtn.innerText = "Lưu";
    saveBtn.className = "btn btn-primary";

    const projectNameInput = document.getElementById("projectName");
    const projectDescriptionInput = document.getElementById("projectDescription");

    //validate input
    projectNameInput.addEventListener("input", () => {
        validateInput(projectNameInput, (v) => !validate.isEmpty(v), "Tên dự án không được để trống");
    });

    projectDescriptionInput.addEventListener("input", () => {
        validateInput(projectDescriptionInput, (v) => !validate.isEmpty(v), "Mô tả không được để trống");
    });






    saveBtn.onclick = function (e) {
        e.preventDefault();
        document.querySelectorAll('.error-message').forEach(e => e.remove());

        let isValid = true;


        if (projects.some(project => project.projectName === projectNameInput.value.trim())) {
            projectNameInput.parentElement.appendChild(createErrorElement("Tên dự án đã tồn tại"));
            isValid = false;
        }
        if (validate.isEmpty(projectNameInput.value)) {
            projectNameInput.parentElement.appendChild(createErrorElement("Tên dự án không được để trống"));
            isValid = false;
        } else {
            if (projectNameInput.value.length < 5 || projectNameInput.value.length > 50) {
                projectNameInput.parentElement.appendChild(createErrorElement("Tên dự án phải từ 5 - 50 ký tự"));
                isValid = false;
            }
        }

        if (validate.isEmpty(projectDescriptionInput.value)) {
            projectDescriptionInput.parentElement.appendChild(createErrorElement("Mô tả không được để trống"));
            isValid = false;
        } else {
            if (projectDescriptionInput.value.length < 20 || projectDescriptionInput.value.length > 400) {
                projectDescriptionInput.parentElement.appendChild(createErrorElement("Mô tả phải từ 20 - 400 ký tự"));
                isValid = false;
            }
        }




        const userLogin = JSON.parse(localStorage.getItem("userLogin"));

        if (isValid) {
            const newProject = {
                id: Date.now(),
                projectName: projectNameInput.value,
                members: [
                    { userId: userLogin.id, role: "Project owner" }
                ],
                description: projectDescriptionInput.value
            };

            allProjects.push(newProject);
            localStorage.setItem("allProjects", JSON.stringify(allProjects));

            projects = allProjects.filter(project =>
                project.members.some(member =>
                    member.userId === productOwner.id && member.role.toLowerCase() === "project owner"
                )
            );

            renderProjectList(getCurrentProjects());
            renderPagination();

            //điều hướng đến page chứa dự án mới
            const totalItems = projects.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            currentPage = totalPages;
            renderProjectList(getCurrentProjects());
            renderPagination();

            const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
            modal.hide();
        }
    };
});


document.addEventListener("click", function (e) {
    const id = +e.target.dataset.id;
    const index = projects.findIndex(project => project.id === id);
    const modalForm = document.getElementById("modalForm");
    const modalLabel = document.getElementById("exampleModalLabel");
    const saveBtn = document.getElementById("modalSaveBtn");

    if (e.target.classList.contains("btn-edit")) {
        modalLabel.innerText = "Sửa dự án";
        modalForm.innerHTML = `
            <div class="mb-3">
                <label for="projectName" class="form-label">Tên dự án</label>
                <input type="text" class="form-control" id="projectName" value="${projects[index].projectName}" required>
            </div>
            <div class="mb-3">
                <label for="projectDescription" class="form-label">Mô tả</label>
                <textarea class="form-control" id="projectDescription" rows="3">${projects[index].description}</textarea>
            </div>
        `;
        saveBtn.innerText = "Lưu";
        saveBtn.className = "btn btn-warning";

        saveBtn.onclick = function (e) {
            e.preventDefault();
            const name = document.getElementById("projectName").value;
            const desc = document.getElementById("projectDescription").value;

            //validate input
            document.querySelectorAll('.error-message').forEach(e => e.remove());
            let isValid = true;


            //kiểm tra tên dự án đã tồn tại

            if (projects.some(project => project.projectName === name.trim())) {
                document.getElementById("projectName").parentElement.appendChild(createErrorElement("Tên dự án đã tồn tại"));
                isValid = false;
            }

            if (name.length < 5 || name.length > 50) {
                document.getElementById("projectName").parentElement.appendChild(createErrorElement("Tên dự án phải từ 5 - 50 ký tự"));
                isValid = false;
            }

            if (desc.length < 20 || desc.length > 400) {
                document.getElementById("projectDescription").parentElement.appendChild(createErrorElement("Mô tả phải từ 20 - 400 ký tự"));
                isValid = false;
            }
            if (isValid) {
                projects[index].projectName = name;
                projects[index].description = desc;

                const globalIndex = allProjects.findIndex(p => p.id === projects[index].id);
                allProjects[globalIndex] = { ...projects[index] };
                localStorage.setItem("allProjects", JSON.stringify(allProjects));

                renderProjectList(getCurrentProjects());
                renderPagination();
                bootstrap.Modal.getInstance(document.getElementById('exampleModal')).hide();
            }
        };
    }

    if (e.target.classList.contains("btn-delete")) {
        modalLabel.innerText = "Xác nhận xóa";
        modalForm.innerHTML = `<p>Bạn chắc chắn muốn xóa dự án này?</p>`;
        saveBtn.innerText = "Xóa";
        saveBtn.className = "btn btn-danger";

        saveBtn.onclick = function (e) {
            e.preventDefault();

            const projectId = projects[index].id;
            projects.splice(index, 1);
            allProjects = allProjects.filter(p => p.id !== projectId);
            localStorage.setItem("allProjects", JSON.stringify(allProjects));

            // XÓA TASK LIÊN QUAN ĐẾN PROJECT
            let allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
            allTasks = allTasks.filter(task => task.projectId !== projectId);
            localStorage.setItem('tasks', JSON.stringify(allTasks));


            // điều hướng đến page phía trước nếu xóa hết ở page hiện tại
            const totalItems = projects.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            currentPage = Math.min(currentPage, totalPages);
            if (currentPage === 0) currentPage--; // Nếu không còn dự án nào, quay về trang phía trước


            renderProjectList(getCurrentProjects());
            renderPagination();
            bootstrap.Modal.getInstance(document.getElementById('exampleModal')).hide();
        };
    }

    if (e.target.classList.contains("btn-detail")) {
        //điều hướng đến trang detail.html
        window.location.href = "../pages/detailProject.html?id=" + id;
    }

});

function createErrorElement(message) {
    const div = document.createElement("div");
    div.classList.add("error-message", "text-danger", "mt-1");
    div.textContent = message;
    return div;
}

function validateInput(inputElement, validationFn, errorMessage) {
    inputElement.parentElement.querySelectorAll('.error-message').forEach(el => el.remove());
    if (!validationFn(inputElement.value)) {
        inputElement.parentElement.appendChild(createErrorElement(errorMessage));
    }
}
//chức năng tìm kiếm theo tên
document.getElementById("findProject").addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();
    const filteredProjects = projects.filter(project =>
        project.projectName.toLowerCase().includes(searchValue)
    );
    renderProjectList(filteredProjects);
    if (this.value === "") {
        renderProjectList(getCurrentProjects());
    }
    renderPagination();
    currentPage = 1; // Reset về trang đầu tiên khi tìm kiếm
})
