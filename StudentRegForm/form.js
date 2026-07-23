const continueBtn = document.getElementById('continue-btn');
const nextBtns = document.querySelectorAll('.next-btn');
const backBtns = document.querySelectorAll('.back');
const showPassword = document.querySelectorAll('.showpassword')

showPassword.forEach(btn => {
    btn.addEventListener('click', () => {
        const passwordInput = btn.previousElementSibling;
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
        } else {
            passwordInput.type = "password";
        }
    });
});
// STEP 1 → STEP 2
continueBtn.addEventListener('click', () => {
    const currentStep = document.querySelector('.account');
    const inputs = currentStep.querySelectorAll("input");

    if (validateStep(inputs)) {
        // password match check
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirm_password');

        if (password.value !== confirmPassword.value) {
            confirmPassword.setCustomValidity("Passwords do not match");
            confirmPassword.reportValidity();
            return;
        } else {
            confirmPassword.setCustomValidity("");
        }

        goToStep('account', 'personal');
        const pas = document.querySelector(".pas")
            const acc = document.querySelector(".acc")
            pas.classList.add("reglink-active")
            acc.classList.remove("reglink-active")

    }
});

// STEP 2 → STEP 3
nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const currentStep = btn.closest('fieldset');
        const inputs = currentStep.querySelectorAll("input, select");

        if (validateStep(inputs)) {
            goToStep('personal', 'academic');
             const pas = document.querySelector(".pas")
            const acc = document.querySelector(".acd")
            pas.classList.remove("reglink-active")
            acc.classList.add("reglink-active")

        }
    });
});

// BACK BUTTONS
backBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const current = btn.closest('fieldset');

        if (current.classList.contains('personal')) {
            goToStep('personal', 'account');
        } else if (current.classList.contains('academic')) {
            goToStep('academic', 'personal');
        }
    });
});

// VALIDATION FUNCTION (native)
function validateStep(inputs) {
    for (let input of inputs) {
        if (!input.checkValidity()) {
            input.reportValidity();
            return false;
        }
    }
    return true;
}

// STEP SWITCHER
function goToStep(from, to) {
    document.querySelector(`.${from}`).classList.remove('active');
    document.querySelector(`.${to}`).classList.add('active');
}

// GO TO REVIEW STEP (from academic)
const academicNext = document.querySelector('.academic .continue');

if (academicNext) {
    academicNext.addEventListener('click', () => {
        const inputs = document.querySelector('.academic').querySelectorAll("input, select, textarea");

        if (validateStep(inputs)) {
            fillReview();
            goToStep('academic', 'review');
            const acd = document.querySelector(".acd")
            const rev = document.querySelector(".rev")
            rev.classList.add("reglink-active")
            acd.classList.remove("reglink-active")

        }
    });
}

// FILL REVIEW DATA
function fillReview() {
    // Account
    document.getElementById('review-username').textContent = document.getElementById('username').value;
    document.getElementById('review-email').textContent = document.getElementById('email').value;

    // Personal
    document.getElementById('review-fullname').textContent = document.getElementById('fullname').value;
    document.getElementById('review-personalemail').textContent = document.getElementById('personalemail').value;
    document.getElementById('review-phone').textContent = document.getElementById('phone').value;
    document.getElementById('review-dob').textContent = document.getElementById('dob').value;

    // Gender
    const gender = document.querySelector('input[name="gender"]:checked');
    document.getElementById('review-gender').textContent = gender ? gender.value : '';

    // Academic
    const course = document.getElementById('course');
    document.getElementById('review-course').textContent = course.options[course.selectedIndex].text;

    document.getElementById('review-motivation').textContent = document.querySelector('textarea[name="motivation"]').value;
}