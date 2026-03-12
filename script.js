document.addEventListener("DOMContentLoaded", function () {

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

        let target = parseInt(document.getElementById("targetPage").value)
        let read = parseInt(document.getElementById("readPage").value)

        if (!target || target <= 0) {
            alert("Please enter a valid target")
            return
        }

        if (!read) read = 0

        let percent = (read / target) * 100

        if (percent > 100) percent = 100

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

    if (calendar) {

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

    }

    // Imsakiyah
    const citySelect = document.querySelector("#citySelect")
    const tableBody = document.querySelector("#table-body")
    const loadingMsg = document.querySelector("#loadingMsg")
    const errorMsg = document.querySelector("#errorMsg")

    if (citySelect) {

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

        })

    }

    // hamburger
    const hamburger = document.getElementById("hamburger")
    const navLinks = document.querySelector(".nav-links")

    if (hamburger) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("active")
        })
    }

    // back to top
    const backToTop = document.getElementById("backToTop")

    if (backToTop) {

        window.addEventListener("scroll", () => {
            if (window.scrollY > 400) {
                backToTop.style.display = "flex"
            } else {
                backToTop.style.display = "none"
            }
        })

        backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" })
        })

    }

    window.saveShalat = saveShalat
    window.saveQuran = saveQuran
    window.saveFasting = saveFasting

})
