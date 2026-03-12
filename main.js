// Dzikir Section
let count = 0;
const target1 = 33;
const target2 = 100;

const countEl = document.getElementById("dzikirCount");
const targetEl = document.getElementById("dzikirTarget");
const addBtn = document.getElementById("addDzikir");
const resetBtn = document.getElementById("resetDzikir");
const notif = document.getElementById("dzikirNotif");

targetEl.textContent = target1 + " & " + target2;

addBtn.addEventListener("click", () => {
    count++;
    countEl.textContent = count;

    if (count === target1) {
        notif.textContent = "MasyaAllah, 33 target tercapai!";
    }

    if (count === target2) {
        notif.textContent = "MasyaAllah, 100 target tercapai!";
    }
});

resetBtn.addEventListener("click", () => {
    count = 0;
    countEl.textContent = count;
    notif.textContent = "";
});

resetBtn.addEventListener("click", () => {
    count = 0;
    countEl.textContent = count;
    notif.textContent = "";
});
// end dzkir section

// Zakat Section
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerHTML = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

function toggleForms() {

    const type = document.getElementById("zakat-type").value;
    const formPenghasilan = document.getElementById("form-penghasilan");
    const formEmas = document.getElementById("form-emas");

    if (type === "penghasilan") {
        formPenghasilan.classList.remove("hidden");
        formEmas.classList.add("hidden");
    } else {
        formPenghasilan.classList.add("hidden");
        formEmas.classList.remove("hidden");
    }

}

function cleanNumber(value) {
    if (!value) return 0;
    return parseFloat(value.toString().replace(/\./g, "")) || 0;
}

function calculateZakat() {

    const type = document.getElementById("zakat-type").value;

    const goldPriceInput = document.getElementById("gold-price").value;
    const goldPrice = cleanNumber(goldPriceInput);

    if (goldPrice <= 0) {
        showToast("Masukkan harga emas terlebih dahulu");
        return;
    }

    let nisab = 85 * goldPrice;
    let totalHarta = 0;
    let zakat = 0;

    if (type === "penghasilan") {

        if (type === "penghasilan") {

            const gaji = cleanNumber(document.getElementById("gaji").value);
            const lain = cleanNumber(document.getElementById("penghasilan-lain").value);

            totalHarta = gaji + lain;

            const nisabBulanan = nisab / 12;

            if (totalHarta >= nisabBulanan) {
                zakat = totalHarta * 0.025;
            }

        }

    } else {

        const emas = parseFloat(document.getElementById("jumlah-emas").value) || 0;

        totalHarta = emas * goldPrice;

        if (emas >= 85) {
            zakat = totalHarta * 0.025;
        }

    }

    if (zakat > 0) {

        showToast(`
                 ✓ Zakat dihitung <br>
                 Total Harta: Rp ${Math.round(totalHarta).toLocaleString("id-ID")} <br>
                 Zakat: Rp ${Math.round(zakat).toLocaleString("id-ID")}
         `);

    } else {

        showToast(`
                 ✓ Zakat dihitung <br>
                  Total Harta: Rp ${Math.round(totalHarta).toLocaleString("id-ID")} <br>
                 Belum mencapai nisab
         `);

    }

}
function formatRupiahInput(id) {

    const input = document.getElementById(id);

    input.addEventListener("input", function () {

        let angka = this.value.replace(/\D/g, "");

        if (!angka) {
            this.value = "";
            return;
        }

        this.value = Number(angka).toLocaleString("id-ID");

    });

}

formatRupiahInput("gold-price");
formatRupiahInput("gaji");
formatRupiahInput("penghasilan-lain");


document.getElementById("zakat-type")
    .addEventListener("change", toggleForms);

document.getElementById("calculate-btn")
    .addEventListener("click", calculateZakat);

toggleForms();
// End Zakat Section

// Ramadhan Tracker Section
let shalatBoxes = document.querySelectorAll(".shalat")

function saveShalat() {

    let checked = 0

    shalatBoxes.forEach(box => {
        if (box.checked) checked++
    })

    let percent = (checked / 5) * 100

    updateDaily(percent)

}

function saveQuran() {

    let target = document.getElementById("targetPage").value
    let read = document.getElementById("readPage").value

    let percent = (read / target) * 100

    document.getElementById("quranProgress").style.width = percent + "%"

    let status = ""

    if (percent < 50) status = "You can do more!"
    else if (percent < 100) status = "Almost done"
    else status = "Target reached!"

    document.getElementById("quranStatus").innerText = status

}

function updateFastingProgress() {

    let total = fastingDays.size
    let percent = (total / 30) * 100

    document.getElementById("fastingProgress").style.width = percent + "%"

    let status = ""

    if (percent < 40) status = "It's still early"
    else if (percent < 80) status = "Stay istiqomah!"
    else status = "MasyaAllah!"

    document.getElementById("fastingStatus").innerText =
        total + "/30 days - " + status
}

function saveFasting() {
    alert("Fasting Progress Saved!")
}


function updateDaily(percent) {

    document.getElementById("dailyProgress").style.width = percent + "%"

    let status = ""

    if (percent <= 40) status = "Needs Improvement"
    else if (percent <= 80) status = "Good Progress"
    else status = "MasyaAllah Excellent!"

    document.getElementById("statusText").innerText = status

}

const calendar = document.getElementById("calendar")

let fastingDays = new Set()

for (let i = 1; i <= 30; i++) {

    let day = document.createElement("div")
    day.id = "day" + i
    day.innerText = i

    day.addEventListener("click", () => {

        if (fastingDays.has(i)) {
            fastingDays.delete(i)
            day.innerText = i
        } else {
            fastingDays.add(i)
            day.innerText = "✔"
        }

        updateFastingProgress()
    })

    calendar.appendChild(day)
}
// End Ramadhan Tracker Section

//  imsakiyah section
const citySelect = document.querySelector("#citySelect")
const tableBody = document.querySelector("#table-body")
const loadingMsg = document.querySelector("#loadingMsg")
const errorMsg = document.querySelector("#errorMsg")

const today = new Date().toISOString().split("T")[0]

fetch("https://api.myquran.com/v2/sholat/kota/semua")
    .then(res => res.json())
    .then(data => {

        data.data.forEach(city => {

            const option = document.createElement("option")
            option.value = city.id
            option.textContent = city.lokasi

            citySelect.appendChild(option)

        })

    })

citySelect.addEventListener("change", () => {

    const cityId = citySelect.value

    if (!cityId) return

    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1

    loadingMsg.classList.remove("hidden")
    errorMsg.classList.add("hidden")

    tableBody.innerHTML = ""

    fetch(`https://api.myquran.com/v2/sholat/jadwal/${cityId}/${year}/${month}`)

        .then(res => res.json())

        .then(data => {

            loadingMsg.classList.add("hidden")

            const jadwal = data.data.jadwal

            jadwal.forEach(item => {

                const isToday = item.date === today

                const row = `
                <tr class="${isToday ? "today" : ""}">
                    <td>${item.tanggal}</td>
                    <td>${item.imsak}</td>
                    <td>${item.subuh}</td>
                    <td>${item.dzuhur}</td>
                    <td>${item.ashar}</td>
                    <td>${item.maghrib}</td>
                    <td>${item.isya}</td>
                </tr>
            `

                tableBody.innerHTML += row

            })

        })

        .catch(err => {

            loadingMsg.classList.add("hidden")
            errorMsg.classList.remove("hidden")

            console.log(err)

        })

});
// end imsakiyah section

const hamburger = document.getElementById("hamburger")
const navLinks = document.querySelector(".nav-links")

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active")
})

const backToTop = document.getElementById("backToTop")

window.addEventListener("scroll", () => {

    if(window.scrollY > 400){
        backToTop.style.display = "flex"
    }else{
        backToTop.style.display = "none"
    }

})

backToTop.addEventListener("click", () => {

    window.scrollTo({
        top:0,
        behavior:"smooth"
    })

})