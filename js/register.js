import validate from './validate.js'; // Đảm bảo rằng đường dẫn này đúng

const emailInput = document.getElementById('email');
const fullNameInput = document.getElementById('fullName');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');

// Khởi tạo nếu chưa có
if (!localStorage.getItem('users')) {
    const existingUser = [
        {
            "id": 2,
            "fullName": "Admin Super",
            "email": "admin@gmail.com",
            "password": "12345678"
        },
        {
            "id": 3,
            "fullName": "Bách Nguyễn",
            "email": "bach@gmail.com",
            "password": "12345678"
        },
        {
            "id": 4,
            "fullName": "Cường Trần",
            "email": "cuong@gmail.com",
            "password": "12345678"
        },
        {
            "id": 5,
            "fullName": "Duy Phạm",
            "email": "duy@gmail.com",
            "password": "12345678"
        },
        {
            "id": 6,
            "fullName": "Hùng Lê",
            "email": "hung@gmail.com",
            "password": "12345678"
        },
        {
            "id": 7,
            "fullName": "Trang Mai",
            "email": "trang@gmail.com",
            "password": "12345678"
        },
        {
            "id": 8,
            "fullName": "admin9999",
            "email": "admin9999@gmail.com",
            "password": "12345678"
        },
        {
            "id": 9,
            "fullName": "admin8888",
            "email": "admin8888@gmail.com",
            "password": "12345678"
        }
    ];
    localStorage.setItem('users', JSON.stringify(existingUser));
}

// Hàm tạo phần tử thông báo lỗi động
function createErrorElement(message) {
    const errorElement = document.createElement('div');
    errorElement.classList.add('error-message');
    errorElement.textContent = message;
    return errorElement;
}

// Hàm kiểm tra các lỗi trong các input khi input thay đổi
function validateInput(inputElement, validationFn, errorMessage) {
    const errorElements = inputElement.parentElement.querySelectorAll('.error-message');
    errorElements.forEach(error => error.remove()); // Xóa các lỗi cũ

    if (!validationFn(inputElement.value)) {
        const errorElement = createErrorElement(errorMessage);
        inputElement.parentElement.appendChild(errorElement);
    }
}

// Sự kiện submit form
document.getElementById("form-register").addEventListener('submit', function (event) {
    event.preventDefault(); // Ngừng việc submit form mặc định

    // Xóa các lỗi cũ nếu có
    const existingErrors = document.querySelectorAll('.error-message');
    existingErrors.forEach(error => error.remove());

    let isValid = true;

    // Lấy danh sách user từ localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Kiểm tra Họ và tên
    if (validate.isEmpty(fullNameInput.value)) {
        const error = createErrorElement("Họ và tên không được để trống");
        fullNameInput.parentElement.appendChild(error);
        isValid = false;
    }

    // Kiểm tra Email
    if (validate.isEmpty(emailInput.value)) {
        const error = createErrorElement("Email không được để trống");
        emailInput.parentElement.appendChild(error);
        isValid = false;
    } else if (!validate.isEmail(emailInput.value)) {
        const error = createErrorElement("Email không đúng định dạng");
        emailInput.parentElement.appendChild(error);
        isValid = false;
    } else if (users.some(user => user.email === emailInput.value)) {
        const error = createErrorElement("Email này đã được sử dụng");
        emailInput.parentElement.appendChild(error);
        isValid = false;
    }

    // Kiểm tra Mật khẩu
    if (validate.isEmpty(passwordInput.value)) {
        const error = createErrorElement("Mật khẩu không được để trống");
        passwordInput.parentElement.appendChild(error);
        isValid = false;
    } else if (!validate.isMinLength(passwordInput.value, 8)) {
        const error = createErrorElement("Mật khẩu phải có ít nhất 8 ký tự");
        passwordInput.parentElement.appendChild(error);
        isValid = false;
    }

    // Kiểm tra Mật khẩu xác nhận
    if (passwordInput.value !== confirmPasswordInput.value) {
        const error = createErrorElement("Mật khẩu xác nhận không khớp");
        confirmPasswordInput.parentElement.appendChild(error);
        isValid = false;
    }

    // Nếu form hợp lệ
    if (isValid) {
        const maxId = users.reduce((max, user) => Math.max(max, user.id), 0);
        const newUser = {
            id: maxId + 1,
            fullName: fullNameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
        };

        // Thêm user vào mảng rồi lưu lại
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        Swal.fire({
            icon: 'success',
            title: 'Đăng ký thành công!',
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            window.location.href = '../pages/login.html';
        });
        // reset form (tùy chọn)
        document.getElementById("form-register").reset();


    }
});

// Thêm các sự kiện input cho các input
emailInput.addEventListener('input', () => {
    validateInput(emailInput, (value) => !validate.isEmpty(value) && validate.isEmail(value), "Email không hợp lệ");
});

fullNameInput.addEventListener('input', () => {
    validateInput(fullNameInput, (value) => !validate.isEmpty(value), "Họ và tên không được để trống");
});

passwordInput.addEventListener('input', () => {
    validateInput(passwordInput, (value) => validate.isMinLength(value, 8), "Mật khẩu phải có ít nhất 8 ký tự");
});

confirmPasswordInput.addEventListener('input', () => {
    validateInput(confirmPasswordInput, (value) => value === passwordInput.value, "Mật khẩu xác nhận không khớp");
});
