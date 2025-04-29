document.getElementById("logoutBtn").addEventListener("click", function () {
    // Xóa thông tin người dùng khỏi localStorage
    localStorage.removeItem("userLogin");

    // Chuyển hướng về trang đăng nhập
    window.location.href = "login.html";
});