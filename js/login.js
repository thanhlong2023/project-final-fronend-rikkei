import validate from './validate.js';

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

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');


const users = JSON.parse(localStorage.getItem('users')) || [];

let userLogin = null;

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

    if (validationFn(inputElement.value)) {
        return; // Nếu hợp lệ thì không làm gì
    } else {
        const errorElement = createErrorElement(errorMessage);
        inputElement.parentElement.appendChild(errorElement);
    }
}

// Sự kiện submit form
document.getElementById("form-login").addEventListener('submit', function (event) {
    event.preventDefault(); // Ngừng việc submit form mặc định

    // Xóa các lỗi cũ nếu có
    const existingErrors = document.querySelectorAll('.error-message');
    existingErrors.forEach(error => error.remove());

    let isValid = true;

    // Kiểm tra Email
    if (validate.isEmpty(emailInput.value)) {
        const error = createErrorElement("Email không được để trống");
        emailInput.parentElement.appendChild(error);
        isValid = false;
    } else if (!validate.isEmail(emailInput.value)) {
        const error = createErrorElement("Email không đúng định dạng");
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

    // Nếu form hợp lệ, có thể thực hiện đăng nhập
    if (isValid) {
        const user = users.find(user => user.email === emailInput.value);
        if (user && user.password === passwordInput.value) {
            Swal.fire({
                icon: 'success',
                title: 'Đăng nhập thành công!',
                showConfirmButton: false,
                timer: 1000
            }).then(() => {
                userLogin = user; // Lưu thông tin người dùng đăng nhập
                localStorage.setItem('userLogin', JSON.stringify(userLogin));
                window.location.href = '../pages/projectManager.html';
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Email hoặc mật khẩu không đúng!',
            });
        }
    }

});

// Thêm các sự kiện input cho các input
emailInput.addEventListener('input', () => {
    validateInput(emailInput, (value) => !validate.isEmpty(value), "Email không được để trống");
})
emailInput.addEventListener('input', () => {
    validateInput(emailInput, (value) => validate.isEmail(value), "Email không hợp lệ");
});
passwordInput.addEventListener('input', () => {
    validateInput(passwordInput, (value) => !validate.isEmpty(value), "Mật khẩu không được để trống");
});

passwordInput.addEventListener('input', () => {
    validateInput(passwordInput, (value) => validate.isMinLength(value, 8), "Mật khẩu phải có ít nhất 8 ký tự");
});


