import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// --- Firebase Configuration ---
const firebaseConfig = {
    apiKey: "AIzaSyAAvxaW7bL7S_oD_xrElO4-XvuxnhfJKxc",
    authDomain: "noorul-islam-91eae.firebaseapp.com",
    projectId: "noorul-islam-91eae",
    storageBucket: "noorul-islam-91eae.firebasestorage.app",
    messagingSenderId: "1034149016792",
    appId: "1:1034149016792:web:befc9bf1eadcf2bd8653ad",
    measurementId: "G-ZFSQDL9MTB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Secondary App for Admin to create users without triggering auto-login
const secondaryApp = initializeApp(firebaseConfig, "Secondary");
const secondaryAuth = getAuth(secondaryApp);

// --- i18n Dictionary (Translations) ---
const i18n = {
    en: {
        appTitle: "Library Register", navHome: "Home", navLogin: "Login", navReader: "My Books", navProfile: "Profile", navLogout: "Logout",
        adminPanelTitle: "Admin Controls", navAddBook: "Add New Book", navRegistry: "Books Registry", navBulk: "Bulk Import", navIssue: "Issue / Return", navUsers: "Users",
        searchTitle: "Search Books", searchSubtitle: "Find available books and their shelf numbers here", searchPlaceholder: "Book name, author or category...",
        thBook: "Book & Author", thCategory: "Category", thShelf: "Shelf No", thStatus: "Availability",
        statusAvailable: "Available", statusIssued: "Issued", loading: "Loading data...", noBooksFound: "No books found.",
        loginTitle: "Sign In", usernameLbl: "Username", passwordLbl: "Password", loginBtn: "Login", roleLbl: "Role",
        addBookTitle: "Add New Book", bookIdLbl: "Accession No (Book ID)", bookTitleLbl: "Book Title", bookAuthorLbl: "Author / Translator", priceLbl: "Price (₹)", saveBtn: "Save Book Record", editUserTitle: "Edit Reader Name",
        tabBasic: "Basic Info", tabMedia: "Media", tabFinancial: "Financials", tabAudit: "Stock/Audit",
        registryTitle: "Books Registry", actionLbl: "Action",
        bulkTitle: "Bulk Import Books (CSV)", bulkDesc: "Upload an Excel (.csv) file to add multiple books at once. Make sure your file matches the template structure exactly. Existing Book IDs will be skipped to prevent duplicates.", btnTemplate: "Download CSV Template", dragDropMsg: "Click or Drag to Select a CSV file", btnBrowse: "Browse File", previewTitle: "Data Preview", btnUploadBooks: "Upload Data", noPreviewMsg: "No file selected for preview.",
        issueBookTitle: "Issue Book", phoneFirstLbl: "Phone Number (Type first)", readerNameLbl: "Reader Name", selectBookLbl: "Select Book (Search)", recordIssueBtn: "Record Issue",
        activeIssuesTitle: "Active Issues", noIssuesFound: "No active issued books.", btnReturn: "Return Book",
        addReaderTitle: "Add New Reader", phonePassLbl: "Phone Number (Used as Password)", fullNameLbl: "Full Name", createAccBtn: "Create Account", regReadersTitle: "Registered Readers", nameLbl: "Name", contactLbl: "Phone & Username", joinedLbl: "Joined Date",
        greeting: "Hello, ", readerSubtitle: "Your reading history is below.", totalReadLbl: "Total Read", myHistoryTitle: "My Books (History)", noHistoryFound: "You haven't borrowed any books yet.",
        msgLoginFail: "Login failed. Check credentials.", msgWelcome: "Welcome", msgLogout: "Logged out successfully.", msgBookAdded: "Book saved successfully.", msgBookExists: "Accession ID already exists!", msgBookDeleted: "Book deleted.", msgUserAdded: "Reader added successfully.", msgUserExists: "Username/Phone combination already exists.", msgSelectBook: "Please select a book.", msgIssued: "Book issued successfully.", msgReturned: "Book returned successfully.", msgError: "An error occurred.", msgBulkSuccess: "Books uploaded successfully!", msgBulkEmpty: "No valid new books found to upload.", msgUserDeleted: "Reader deactivated successfully.", msgUserUpdated: "Reader info updated."
    },
    ml: {
        appTitle: "ലൈബ്രറി രജിസ്റ്റർ", navHome: "ഹോം (സെർച്ച്)", navLogin: "ലോഗിൻ", navReader: "എന്റെ പുസ്തകങ്ങൾ", navProfile: "പ്രൊഫൈൽ", navLogout: "ലോഗൗട്ട്",
        adminPanelTitle: "അഡ്മിൻ പാനൽ", navAddBook: "പുതിയ പുസ്തകം ചേർക്കുക", navRegistry: "രജിസ്റ്ററിലെ പുസ്തകങ്ങൾ", navBulk: "ബൾക്ക് ഇമ്പോർട്ട് (CSV)", navIssue: "ഇഷ്യൂ / റിട്ടേൺ", navUsers: "വായനക്കാർ (Users)",
        searchTitle: "പുസ്തകങ്ങൾ തിരയുക", searchSubtitle: "ലഭ്യമായ പുസ്തകങ്ങളും അവയുടെ ഷെൽഫ് നമ്പറും ഇവിടെ കണ്ടെത്താം", searchPlaceholder: "പുസ്തകത്തിന്റെ പേര്, ഗ്രന്ഥകർത്താവ് അല്ലെങ്കിൽ കാറ്റഗറി...",
        thBook: "പുസ്തകം & ഗ്രന്ഥകർത്താവ്", thCategory: "കാറ്റഗറി", thShelf: "ഷെൽഫ് നമ്പർ", thStatus: "ലഭ്യത",
        statusAvailable: "ലഭ്യമാണ്", statusIssued: "നൽകിയിരിക്കുന്നു", loading: "ഡാറ്റ ലോഡ് ചെയ്യുന്നു...", noBooksFound: "പുസ്തകങ്ങൾ ഒന്നും കണ്ടെത്തിയില്ല.",
        loginTitle: "ലോഗിൻ ചെയ്യുക", usernameLbl: "യൂസർ നെയിം", passwordLbl: "പാസ്‌വേർഡ്", loginBtn: "ലോഗിൻ", roleLbl: "റോൾ",
        addBookTitle: "പുതിയ പുസ്തകം ചേർക്കുക", bookIdLbl: "അക്സഷൻ നമ്പർ (Book ID)", bookTitleLbl: "പുസ്തകത്തിന്റെ പേര്", bookAuthorLbl: "ഗ്രന്ഥകർത്താവ് / വിവർത്തകൻ", priceLbl: "വില (₹)", saveBtn: "സേവ് ചെയ്യുക", editUserTitle: "വായനക്കാരന്റെ പേര് തിരുത്തുക",
        tabBasic: "വിവരങ്ങൾ", tabMedia: "ഫോട്ടോകൾ", tabFinancial: "സാമ്പത്തികം", tabAudit: "സ്റ്റോക്ക് & ഓഡിറ്റ്",
        registryTitle: "രജിസ്റ്ററിലെ പുസ്തകങ്ങൾ", actionLbl: "Action",
        bulkTitle: "ഒന്നിച്ച് പുസ്തകങ്ങൾ ചേർക്കുക (CSV)", bulkDesc: "നിരവധി പുസ്തകങ്ങൾ ഒന്നിച്ച് അപ്‌ലോഡ് ചെയ്യാൻ CSV ഫയൽ ഉപയോഗിക്കുക. ടെംപ്ലേറ്റ് ഡൗൺലോഡ് ചെയ്ത് അതേ ഫോർമാറ്റിൽ ഡാറ്റ നൽകുക. നിലവിലുള്ള ബുക്ക് ഐഡികൾ ഒഴിവാക്കപ്പെടും.", btnTemplate: "CSV ടെംപ്ലേറ്റ് ഡൗൺലോഡ്", dragDropMsg: "അപ്‌ലോഡ് ചെയ്യാൻ ഒരു CSV ഫയൽ തിരഞ്ഞെടുക്കുക", btnBrowse: "ഫയൽ എടുക്കുക", previewTitle: "ഡാറ്റ പ്രിവ്യൂ", btnUploadBooks: "അപ്‌ലോഡ് ചെയ്യുക", noPreviewMsg: "പ്രിവ്യൂ കാണാൻ ഫയൽ തിരഞ്ഞെടുക്കുക.",
        issueBookTitle: "പുസ്തകം നൽകുക (Issue)", phoneFirstLbl: "ഫോൺ നമ്പർ (ആദ്യം നൽകുക)", readerNameLbl: "വായനക്കാരന്റെ പേര്", selectBookLbl: "പുസ്തകം തിരഞ്ഞെടുക്കുക", recordIssueBtn: "ഇഷ്യൂ റെക്കോർഡ് ചെയ്യുക",
        activeIssuesTitle: "നൽകിയിട്ടുള്ള പുസ്തകങ്ങൾ", noIssuesFound: "നിലവിൽ നൽകിയ പുസ്തകങ്ങൾ ഒന്നുമില്ല.", btnReturn: "മടക്കി നൽകുക",
        addReaderTitle: "പുതിയ വായനക്കാരനെ ചേർക്കുക", phonePassLbl: "ഫോൺ നമ്പർ (പാസ്‌വേർഡും ഇതാണ്)", fullNameLbl: "മുഴുവൻ പേര്", createAccBtn: "അക്കൗണ്ട് നിർമ്മിക്കുക", regReadersTitle: "രജിസ്റ്റർ ചെയ്ത വായനക്കാർ", nameLbl: "പേര്", contactLbl: "ഫോൺ & യൂസർനെയിം", joinedLbl: "ചേർന്ന തിയ്യതി",
        greeting: "നമസ്കാരം, ", readerSubtitle: "നിങ്ങളുടെ വായനാ വിവരങ്ങൾ താഴെ കാണാം.", totalReadLbl: "ആകെ വായിച്ചവ", myHistoryTitle: "എന്റെ പുസ്തകങ്ങൾ (History)", noHistoryFound: "നിങ്ങൾ ഇതുവരെ പുസ്തകങ്ങൾ ഒന്നും എടുത്തിട്ടില്ല.",
        msgLoginFail: "ലോഗിൻ പരാജയപ്പെട്ടു. വിവരങ്ങൾ പരിശോധിക്കുക.", msgWelcome: "സ്വാഗതം", msgLogout: "ലോഗൗട്ട് ചെയ്തു", msgBookAdded: "പുസ്തകം വിജയകരമായി സേവ് ചെയ്തു", msgBookExists: "ഈ അക്സഷൻ നമ്പർ നിലവിലുണ്ട്!", msgBookDeleted: "പുസ്തകം നീക്കം ചെയ്തു", msgUserAdded: "പുതിയ വായനക്കാരനെ വിജയകരമായി ചേർത്തു", msgUserExists: "ഈ യൂസർനെയിം/ഫോൺ നിലവിലുണ്ട്", msgSelectBook: "ദയവായി ഒരു പുസ്തകം തിരഞ്ഞെടുക്കുക", msgIssued: "പുസ്തകം വിജയകരമായി ഇഷ്യൂ ചെയ്തു", msgReturned: "പുസ്തകം മടക്കി നൽകൽ പൂർത്തിയായി", msgError: "ഒരു പിശക് സംഭവിച്ചു", msgBulkSuccess: "പുസ്തകങ്ങൾ വിജയകരമായി അപ്‌ലോഡ് ചെയ്തു!", msgBulkEmpty: "അപ്‌ലോഡ് ചെയ്യാൻ പുതിയ പുസ്തകങ്ങൾ കണ്ടെത്തിയില്ല.", msgUserDeleted: "വായനക്കാരനെ ഡീ-ആക്ടിവേറ്റ് ചെയ്തു", msgUserUpdated: "വിവരങ്ങൾ അപ്ഡേറ്റ് ചെയ്തു."
    },
    ar: {
        appTitle: "سجل المكتبة", navHome: "الرئيسية", navLogin: "دخول", navReader: "كتبي", navProfile: "الملف الشخصي", navLogout: "خروج",
        adminPanelTitle: "لوحة الإدارة", navAddBook: "إضافة كتاب جديد", navRegistry: "سجل الكتب", navBulk: "استيراد جماعي", navIssue: "إعارة / إرجاع", navUsers: "المستخدمون",
        searchTitle: "البحث عن الكتب", searchSubtitle: "ابحث عن الكتب المتوفرة وأرقام رفوفها هنا", searchPlaceholder: "اسم الكتاب، المؤلف أو الفئة...",
        thBook: "الكتاب والمؤلف", thCategory: "الفئة", thShelf: "رقم الرف", thStatus: "التوفر",
        statusAvailable: "متاح", statusIssued: "مُعار", loading: "جاري التحميل...", noBooksFound: "لم يتم العثور على كتب.",
        loginTitle: "تسجيل الدخول", usernameLbl: "اسم المستخدم", passwordLbl: "كلمة المرور", loginBtn: "تسجيل الدخول", roleLbl: "وظيفة",
        addBookTitle: "إضافة كتاب جديد", bookIdLbl: "رقم الكتاب (ID)", bookTitleLbl: "عنوان الكتاب", bookAuthorLbl: "المؤلف / المترجم", priceLbl: "السعر (₹)", saveBtn: "حفظ السجل", editUserTitle: "تعديل اسم القارئ",
        tabBasic: "المعلومات", tabMedia: "الوسائط", tabFinancial: "المالية", tabAudit: "المراجعة",
        registryTitle: "سجل الكتب", actionLbl: "إجراء",
        bulkTitle: "استيراد الكتب (CSV)", bulkDesc: "قم بتحميل ملف CSV لإضافة كتب متعددة. تأكد من مطابقة القالب. سيتم تخطي أرقام الكتب الموجودة.", btnTemplate: "تنزيل قالب CSV", dragDropMsg: "اختر ملف CSV للتحميل", btnBrowse: "تصفح الملف", previewTitle: "معاينة البيانات", btnUploadBooks: "تحميل البيانات", noPreviewMsg: "لم يتم تحديد ملف للمعاينة.",
        issueBookTitle: "إعارة كتاب", phoneFirstLbl: "رقم الهاتف (اكتب أولاً)", readerNameLbl: "اسم القارئ", selectBookLbl: "اختر كتاباً", recordIssueBtn: "تسجيل الإعارة",
        activeIssuesTitle: "الإعارات النشطة", noIssuesFound: "لا توجد كتب معارة حالياً.", btnReturn: "إرجاع الكتاب",
        addReaderTitle: "إضافة قارئ جديد", phonePassLbl: "رقم الهاتف (يستخدم ككلمة مرور)", fullNameLbl: "الاسم الكامل", createAccBtn: "إنشاء حساب", regReadersTitle: "القراء المسجلون", nameLbl: "الاسم", contactLbl: "الهاتف واسم المستخدم", joinedLbl: "تاريخ الانضمام",
        greeting: "مرحباً، ", readerSubtitle: "تاريخ القراءة الخاص بك أدناه.", totalReadLbl: "إجمالي القراءة", myHistoryTitle: "كتبي (السجل)", noHistoryFound: "لم تقم باستعارة أي كتب بعد.",
        msgLoginFail: "فشل تسجيل الدخول. تحقق من بياناتك.", msgWelcome: "مرحباً", msgLogout: "تم تسجيل الخروج بنجاح.", msgBookAdded: "تمت إضافة الكتاب بنجاح.", msgBookExists: "رقم الكتاب موجود مسبقاً!", msgBookDeleted: "تم حذف الكتاب.", msgUserAdded: "تمت إضافة القارئ بنجاح.", msgUserExists: "اسم المستخدم/الهاتف موجود مسبقاً.", msgSelectBook: "الرجاء تحديد كتاب.", msgIssued: "تمت إعارة الكتاب بنجاح.", msgReturned: "تم إرجاع الكتاب بنجاح.", msgError: "حدث خطأ.", msgBulkSuccess: "تم تحميل الكتب بنجاح!", msgBulkEmpty: "لم يتم العثور على كتب جديدة للتحميل.", msgUserDeleted: "تم إلغاء تنشيط القارئ", msgUserUpdated: "تم تحديث المعلومات."
    }
};

// Exporting necessary modules for other files
export { app, auth, db, secondaryAuth, i18n };
