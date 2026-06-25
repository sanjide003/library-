// ലൈബ്രറിയിൽ നിന്നും പുസ്തകം എടുത്ത ശേഷം കാലാവധി കഴിഞ്ഞും തിരികെ നൽകാത്തവർക്ക് ഓട്ടോമാറ്റിക് 
// ആയി WhatsApp അല്ലെങ്കിൽ SMS മെസ്സേജുകൾ അയക്കാനുള്ള Firebase Cloud Functions (Node.js)
const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");
const { logger } = require("firebase-functions");

// ഫയർബേസ് അഡ്മിൻ എസ്.ഡി.കെ (SDK) ഇനിഷ്യലൈസ് ചെയ്യുന്നു
admin.initializeApp();
const db = admin.firestore();

// പുസ്തകം കൈവശം വെക്കാവുന്ന പരമാവധി ദിവസങ്ങൾ (ഇത് നിങ്ങൾക്ക് മാറ്റാം)
const MAX_BORROW_DAYS = 14; 

// ദിവസവും രാവിലെ 8:00 മണിക്ക് ഈ ഫംഗ്ഷൻ പ്രവർത്തിക്കും (Timezone: Asia/Kolkata)
exports.sendOverdueReminders = onSchedule({
    schedule: "every day 08:00",
    timeZone: "Asia/Kolkata"
}, async (event) => {
    try {
        logger.info("Starting Daily Overdue Book Reminder Job...");

        // 1. ഡാറ്റാബേസിൽ നിന്നും സെറ്റിംഗ്സ് വിവരങ്ങൾ (API Keys) എടുക്കുന്നു
        const settingsDoc = await db.collection("settings").doc("general").get();
        if (!settingsDoc.exists) {
            logger.error("Settings document not found. Exiting.");
            return;
        }

        const settings = settingsDoc.data();
        const libraryName = settings.libraryName || "Library";
        const integrations = settings.integrations || {};
        
        const twilioSid = integrations.twilioSid;
        const twilioToken = integrations.twilioToken;
        const metaToken = integrations.metaToken;

        // API കീകൾ ഇല്ലെങ്കിൽ പ്രോസസ്സ് നിർത്തുന്നു
        if (!twilioSid && !metaToken) {
            logger.warn("No SMS or WhatsApp API keys configured. Exiting.");
            return;
        }

        // 2. 14 ദിവസത്തിന് മുൻപുള്ള തിയ്യതി കണ്ടെത്തുന്നു
        const now = new Date();
        const cutoffDate = new Date(now.getTime() - (MAX_BORROW_DAYS * 24 * 60 * 60 * 1000));
        const cutoffTimestamp = admin.firestore.Timestamp.fromDate(cutoffDate);

        // 3. തിരികെ നൽകാത്തതും (Active), 14 ദിവസം കഴിഞ്ഞതുമായ ഇടപാടുകൾ (Transactions) എടുക്കുന്നു
        const transactionsRef = db.collection("transactions");
        const snapshot = await transactionsRef
            .where("status", "==", "Active")
            .where("issueDate", "<", cutoffTimestamp)
            .get();

        if (snapshot.empty) {
            logger.info("No overdue books found today.");
            return;
        }

        logger.info(`Found ${snapshot.size} overdue books. Processing messages...`);

        // 4. ഓരോ വായനക്കാരനും മെസ്സേജ് അയക്കുന്നു
        for (const doc of snapshot.docs) {
            const tData = doc.data();
            const userName = tData.userName;
            const bookTitle = tData.bookTitle;
            // ഫോൺ നമ്പറിൽ +91 (ഇന്ത്യൻ കോഡ്) ഉണ്ടോ എന്ന് പരിശോധിക്കുന്നു, ഇല്ലെങ്കിൽ ചേർക്കുന്നു
            let userPhone = tData.userPhone.replace(/\D/g,''); 
            if(userPhone.length === 10) userPhone = "91" + userPhone;

            // മെസ്സേജ് തയ്യാറാക്കുന്നു
            const messageBody = `നമസ്കാരം ${userName}, നിങ്ങൾ ${libraryName}-ൽ നിന്നും എടുത്ത '${bookTitle}' എന്ന പുസ്തകത്തിന്റെ കാലാവധി അവസാനിച്ചിരിക്കുന്നു. ദയവായി പുസ്തകം എത്രയും വേഗം തിരികെ നൽകുക.`;

            // WhatsApp (Meta) API കോൺഫിഗർ ചെയ്തിട്ടുണ്ടെങ്കിൽ അത് ഉപയോഗിക്കുക
            if (metaToken) {
                await sendWhatsAppMessage(userPhone, messageBody, metaToken);
            } 
            // അല്ലെങ്കിൽ Twilio വഴി SMS അയക്കുക
            else if (twilioSid && twilioToken) {
                await sendSMSMessage(userPhone, messageBody, twilioSid, twilioToken);
            }
        }

        logger.info("Successfully finished sending all reminders.");

    } catch (error) {
        logger.error("Error running reminder job:", error);
    }
});

// Meta (WhatsApp Business) API ഉപയോഗിച്ച് മെസ്സേജ് അയക്കുന്ന ഫംഗ്ഷൻ
async function sendWhatsAppMessage(phone, text, token) {
    // നിങ്ങളുടെ WhatsApp Phone Number ID ഇവിടെ നൽകണം
    const PHONE_NUMBER_ID = "YOUR_META_PHONE_NUMBER_ID"; 
    const url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                to: phone,
                type: "text",
                text: { body: text }
            })
        });
        
        if(!response.ok) {
            const err = await response.json();
            logger.error(`WhatsApp failed for ${phone}:`, err);
        } else {
            logger.info(`WhatsApp sent to ${phone}`);
        }
    } catch (error) {
        logger.error("WhatsApp Request Error:", error);
    }
}

// Twilio API ഉപയോഗിച്ച് SMS അയക്കുന്ന ഫംഗ്ഷൻ
async function sendSMSMessage(phone, text, sid, token) {
    // നിങ്ങളുടെ Twilio ഫോൺ നമ്പർ ഇവിടെ നൽകണം
    const TWILIO_FROM_NUMBER = "+1234567890"; 
    const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;

    const params = new URLSearchParams();
    params.append("To", `+${phone}`);
    params.append("From", TWILIO_FROM_NUMBER);
    params.append("Body", text);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": "Basic " + Buffer.from(`${sid}:${token}`).toString('base64'),
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: params
        });

        if(!response.ok) {
            const err = await response.json();
            logger.error(`SMS failed for ${phone}:`, err);
        } else {
            logger.info(`SMS sent to ${phone}`);
        }
    } catch (error) {
        logger.error("SMS Request Error:", error);
    }
}
