import { expect } from "chai"; // Pastikan install chai untuk assertion
import { APIDemosActions } from "../action/appDemos.action.ts";
import * as fs from 'fs';

const apiDemosAction = new APIDemosActions();
let nameInput: string;
let passInput: string;

describe("ApiDemos - Text Entry dialog", async () => {
    
    before(async function() {
        // Inisialisasi data testing
        nameInput = "Sandra";
        passInput = "Sandra04";
    })

    beforeEach(async function() {
        await driver.relaunchActiveApp();
    })

    afterEach(async function() {
    if (this.currentTest?.state === "failed") {
        const folderPath = './ScreenShoot';
        
        // Pastikan folder ada
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
        const fileName = this.currentTest.title.replace(/\s+/g, '_');
        const fullPath = `${folderPath}/${fileName}.png`;

        await driver.saveScreenshot(fullPath);
        console.log(`Screenshot saved to: ${fullPath}`);
    }
});

    after(async function() {
        // Menutup aplikasi setelah semua test selesai
        await driver.terminateApp('io.appium.android.apis');
    })

    it("TC001 - Verify input name dan password", async () => {
        // 1. Navigasi ke menu
        await apiDemosAction.navigateToTextEntryDialog();

        // 2. Isi field name dan password
        await apiDemosAction.inputUserCredentials(nameInput, passInput);

        // 3. Ambil nilai dari field untuk verifikasi
        const actualName = await apiDemosAction.getNameValue();
        const actualPass = await apiDemosAction.getPasswordValue();

        // 4. Assertion (Verify isi field sesuai input)
        expect(actualName).to.equal(nameInput, "Nama yang muncul tidak sesuai!");
        expect(actualPass).to.equal(passInput, "Password yang muncul tidak sesuai!");
    });
});