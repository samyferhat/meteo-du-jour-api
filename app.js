const API_URL = "https://api.open-meteo.com/v1/forecast?latitude=48.6328&longitude=2.4405&current=is_day,weather_code&hourly=weather_code,is_day&timezone=Europe%2FBerlin&forecast_days=1";


async function getMeteoOfDay() {
    try {
        const response = await fetch(API_URL);
        const meteoOfDay = await response.json();
        domUpdate(meteoOfDay);

    } catch (error) {
        console.log(error);
    }


}


// getHoursOfDay retourne un tableau avec des objets heure, chaque objet 
// heure a trois proprites : {time, weather_code, is_current} 
// ex : [ {time: (date), weather_code: "0n",is_current:1}]

const getHoursOfDay = ({ hourly, current }) => {

    let tab = [];

    // is_day_code est une fonction qui retourne n pour nuit et d pour jour .
    const is_day_code = (is_day) => is_day == 0 ? "n" : "d";

    // is_current_hour est une fonction qui retourne 1 si l'heure de la
    // date donnée en parametre est l'heure actuelle et 0 sinon .
    const is_current_hour = (date) => date.getHours() == (new Date(current.time)).getHours() ? 1 : 0;

    for (let i = 0; i < 24; ++i) {
        const h = new Date(hourly.time[i]);
        tab.push({
            time: h, is_day: hourly.is_day[i],
            weather_code: `${hourly.weather_code[i]}`
                + is_day_code(hourly.is_day[i]),
            is_current: is_current_hour(h)
        });
    }
    return tab;
}

// La fonction domUpdate prend en parametre un objet meteoOfDay et 
// rajoute des elements li à la liste ul de la page 

const domUpdate = (meteoOfDay) => {
    const hoursOfDay = getHoursOfDay(meteoOfDay);

    const ul = document.querySelector(".gridTab");
    ul.insertAdjacentHTML(
        "afterBegin",
        hoursOfDay.reduce(
            (acc, { time, weather_code, is_current }) => acc
                + `<li data-time="${time}" 
        ${is_current == 1 ? "class=\"current-h\"" : ""}>
        <img src="icons/${weather_code}.png"><div class="note">
        <p >${time.getHours()}</p></div></li>`,
            ""
        )
    );
}


getMeteoOfDay();


