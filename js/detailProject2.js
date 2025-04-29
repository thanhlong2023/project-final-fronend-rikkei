

// Kiểm tra xem người dùng đã đăng nhập hay chưa
const userLogin = JSON.parse(localStorage.getItem("userLogin"));
if (!userLogin) {
    window.location.href = "login.html"; // Nếu chưa đăng nhập, chuyển hướng đến trang login
}

const projectName = document.getElementById("projectName");
const projectDescription = document.getElementById("projectDescription");
const memberList = document.getElementById("memberList");

const allProjects = JSON.parse(localStorage.getItem("allProjects")) || [];
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get("id");
const project = allProjects.find((project) => project.id === Number(projectId));
const users = JSON.parse(localStorage.getItem("users")) || [];

function getProjectMembersWithRoles(projectId) {
    const project = allProjects.find(p => p.id === Number(projectId));
    if (!project) {
        console.log('Dự án không tồn tại');
        return [];
    }
    return project.members.map(member => {
        const user = users.find(u => u.id === member.userId);
        if (user) {
            return {
                userId: user.id,
                fullName: user.fullName,
                role: member.role,
                email: user.email,
            };
        }
    }).filter(member => member); // Lọc bỏ các giá trị undefined
}

function renderDetailProject() {
    if (project) {
        projectName.innerText = project.projectName;
        projectDescription.innerText = project.description;
        const projectMembers = getProjectMembersWithRoles(projectId);
        memberList.innerHTML = projectMembers
            .map(
                (member, index) => `
          <div class="d-flex align-items-center mb-3">
            <span class="bg-purple rounded-circle px-3 py-2 mx-2" style="background-color: ${getRandomColor()}">
              ${getInitials(member.fullName)}
            </span>
            <div>
              <p class="mb-0">${member.fullName}</p>
              <span class="text-muted">${member.role}</span>
            </div>
          </div>`
            )
            .join("");
    } else {
        console.error("Không tìm thấy project");
    }
}
renderDetailProject();

function getInitials(name) {
    return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase();
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function renderListMember() {
    const projectMembers = getProjectMembersWithRoles(projectId);
    const titleModal = document.getElementById("exampleModalLabel");
    titleModal.innerText = "Thành viên";

    const modalBody = document.getElementById("modalContent");
    modalBody.innerHTML = projectMembers.map(
        (member, index) => {
            const isProjectOwner = project.members.some(m => m.userId === member.userId && m.role.toLowerCase() === "project owner");
            return `
        <div class="row d-flex align-items-center justify-content-between mb-3">
          <div class="col-6">
            <div class="d-flex align-items-center mb-3">
              <span class="bg-purple rounded-circle px-3 py-2 mx-2" style="background-color: ${getRandomColor()}">
                ${getInitials(member.fullName)}
              </span>
              <div>
                <p class="mb-0">${member.fullName}</p>
                <span class="text-muted">${member.email}</span>
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="d-flex align-items-center justify-content-end position-relative">
              <input type="text" class="form-control role-input" data-user-id="${member.userId}" id="role-${index}" value="${member.role}">
              <div class="invalid-feedback" id="roleFeedback-${index}"></div>
              <button class="mx-3 text-danger btn deleteMemberBtn ${isProjectOwner ? 'disabled' : ''}" data-user-id="${member.userId}">
                <i class="fa fa-trash-alt"></i>
              </button>
            </div>
          </div>
        </div>`;
        }
    ).join("");

    document.getElementById("btnSave").innerText = "Lưu";

    // Thêm sự kiện input để cập nhật vai trò
    document.querySelectorAll('.role-input').forEach(input => {
        input.addEventListener('input', function () {
            const userId = Number(input.getAttribute('data-user-id'));
            const newRole = input.value.trim();
            const feedbackElement = document.getElementById(`roleFeedback-${input.id.split('-')[1]}`);

            input.classList.remove('is-invalid');
            feedbackElement.innerText = '';

            if (!newRole) {
                input.classList.add('is-invalid');
                feedbackElement.innerText = 'Vai trò không được để trống';
                return;
            }

            const project = allProjects.find(p => p.id === Number(projectId));
            const member = project.members.find(m => m.userId === userId);
            if (member) {
                member.role = newRole;
                localStorage.setItem("allProjects", JSON.stringify(allProjects));
                renderDetailProject(); // Cập nhật giao diện chi tiết dự án

                document.getElementById('btnSave').addEventListener('click', function () {
                    renderListMember();
                })
            }
        });
    });
}

document.getElementById("menuMember").addEventListener("click", function () {
    document.getElementById("modalHeader").innerHTML = `
    <div class="col-6">Thành viên</div>
    <div class="col-6">Role</div>
  `;
    renderListMember();
});

document.addEventListener("click", function (event) {
    const deleteBtn = event.target.closest(".deleteMemberBtn");
    if (deleteBtn) {
        const userId = deleteBtn.getAttribute("data-user-id");
        const project = allProjects.find((project) => project.id === Number(projectId));
        if (project) {
            const memberIndex = project.members.findIndex((member) => member.userId === Number(userId));
            if (memberIndex !== -1) {
                Swal.fire({
                    title: "Bạn chắc chắn?",
                    text: "Bạn có muốn xóa thành viên này không?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Xóa",
                    cancelButtonText: "Huỷ",
                }).then((result) => {
                    if (result.isConfirmed) {
                        project.members.splice(memberIndex, 1);
                        localStorage.setItem("allProjects", JSON.stringify(allProjects));
                        renderDetailProject();
                        renderListMember();
                        Swal.fire("Đã xóa!", "Thành viên đã được xóa.", "success");
                        setTimeout(() => {
                            //reload the page
                            location.reload();
                        }, 1000);

                    }
                });
            }
        }
    }
});

document.getElementById("addMember").addEventListener("click", function () {
    const titleModal = document.getElementById("exampleModalLabel");
    titleModal.innerText = "Thêm thành viên";

    const modalBody = document.getElementById("modalContent");
    document.getElementById("modalHeader").innerHTML = '';
    modalBody.innerHTML = `
    <div>
      <label for="email">Email</label>
      <input list="userList" id="email" class="form-control">
      <datalist id="userList"></datalist>
    </div>
    <div>
      <label for="role">Vai trò</label>
      <input type="text" id="role" class="form-control">
    </div>
  `;

    const datalist = document.getElementById("userList");
    datalist.innerHTML = users
        .map(user => `<option value="${user.email}">`)
        .join("");

    const btnAdd = document.getElementById("btnSave");
    btnAdd.innerText = "Thêm thành viên";
    const newBtnAdd = btnAdd.cloneNode(true);
    btnAdd.parentNode.replaceChild(newBtnAdd, btnAdd);

    newBtnAdd.addEventListener("click", function () {
        const emailInput = document.getElementById("email").value;
        const roleInput = document.getElementById("role").value;
        const emailInputElement = document.getElementById("email");
        const roleInputElement = document.getElementById("role");

        emailInputElement.parentElement.querySelectorAll('.error-message').forEach(el => el.remove());
        roleInputElement.parentElement.querySelectorAll('.error-message').forEach(el => el.remove());

        let isValid = true;

        if (!emailInput) {
            emailInputElement.parentElement.appendChild(createErrorElement("Email không được để trống"));
            isValid = false;
        }
        if (!roleInput) {
            roleInputElement.parentElement.appendChild(createErrorElement("Vai trò không được để trống"));
            isValid = false;
        }


        if (!isValid) return;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput)) {
            emailInputElement.parentElement.appendChild(createErrorElement("Email không hợp lệ"));
            return;
        }

        const user = users.find(user => user.email === emailInput);
        if (!user) {
            emailInputElement.parentElement.appendChild(createErrorElement("Email không tồn tại trong danh sách người dùng"));
            return;
        }

        const isMember = project.members.some(member => member.userId === user.id);
        if (isMember) {
            emailInputElement.parentElement.appendChild(createErrorElement("Người dùng đã là thành viên của dự án"));
            return;
        }


        const newMember = {
            userId: user.id,
            role: roleInput,
        };
        allProjects.forEach((project) => {
            if (project.id === Number(projectId)) {
                project.members.push(newMember);
            }
        });
        localStorage.setItem("allProjects", JSON.stringify(allProjects));
        renderDetailProject();
        Swal.fire("Thành công!", "Thêm thành viên thành công!", "success");

        const modal = bootstrap.Modal.getInstance(document.getElementById("exampleModal"));
        modal.hide();
    });
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