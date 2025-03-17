import React, { useState, useEffect } from 'react';
import moment from 'moment'; 
import 'moment/locale/ar'; 
import momentHijri from 'moment-hijri'; 
import './App.css';
import { getPrayerTimes } from './api';

function App() {
  const [city, setCity] = useState("Nador");
  const [prayerTimes, setPrayerTimes] = useState(null);

  const cities = [
    "Casablanca", "Rabat", "Marrakech", "Fes", "Tanger", "Agadir", "Tetouan", "Oujda", "Meknes" , "Laayoune", "Salé", "Asilah", "Smara", "Dakhla", "Khouribga", "Errachidia", "Tarfaya", "Taza", "Al Hoceima", "Driouch", "Nador", "Berkane", "Safi", "El Jadida", "Kenitra", "Tiznit", "Beni Mellal", "Larache", "Ksar El Kebir", "Sidi Kacem", "Tan-Tan", "Sidi Slimane", "Guelmim", "Tetouan", "Ouarzazate", "Sefrou", "Berrechid", "Taourirt", "Oued Zem", "Figuig", "Tinghir", "Sidi Bennour", "Midelt", "Azrou", "Skhirat"
  ]; 

  const prayerNamesInArabic = {
    Fajr: "الفجر",
    Dhuhr: "الظهر",
    Asr: "العصر",
    Maghrib: "المغرب",
    Isha: "العشاء"
  };

  useEffect(() => {
    if (city) {
      getPrayerTimes(city, "Morocco").then((times) => {
        if (times) {
          setPrayerTimes(times); 
        } else {
          setPrayerTimes(null); 
        }
      });
    }
  }, [city]);

  const currentDate = moment().locale('ar').format('dddd D MMMM YYYY'); 
  const currentHijriDate = moment().format('LL');
  const currentTime = moment().format('HH:mm:ss'); 

  const getTimeRemaining = (prayerTimes) => {
    const currentMoment = moment();
    const prayerTimesArray = Object.entries(prayerTimes).map(([prayer, time]) => ({
      prayer,
      time: moment(time, 'HH:mm')
    }));

    const futurePrayers = prayerTimesArray.filter(({ time }) => time.isAfter(currentMoment));
    if (futurePrayers.length > 0) {
      const nextPrayer = futurePrayers.sort((a, b) => a.time - b.time)[0];
      const timeRemaining = nextPrayer.time.diff(currentMoment);
      return {
        prayer: nextPrayer.prayer,
        remainingTime: moment.utc(timeRemaining).format("HH:mm:ss") 
      };
    }
    return { prayer: null, remainingTime: "No more prayers today" };
  };

  const { prayer: nextPrayer, remainingTime } = prayerTimes ? getTimeRemaining(prayerTimes) : { prayer: null, remainingTime: null };

  return (
    <div className="home">
      <div className="city-selector">
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          <option value="">اختر مدينة</option>
          {cities.map((cityOption) => (
            <option key={cityOption} value={cityOption}>
              {cityOption}
            </option>
          ))}
        </select>
      </div>
      <div className='free'></div>
      <div className='title'>
        <h2>{city}</h2>
        <h1><b>{currentTime}</b> </h1>
      </div>
      <div className="prayer-flexx">
        {remainingTime && (
          <div className="time-remaining">
            <h3>الوقت المتبقي حتى صلاة {nextPrayer ? prayerNamesInArabic[nextPrayer] : "لا توجد صلوات بعد اليوم"}:</h3>
            <p><b>{remainingTime}</b></p>
          </div>
        )}
        <div className="time-remaining">
          <p><b>{currentDate}</b> </p> 
          <p><b>{currentHijriDate}</b> </p> 
        </div>
      </div>

      {prayerTimes && (
        <div className="prayer-flex">
          {Object.entries(prayerTimes).map(([prayer, time]) => {
            if (prayerNamesInArabic[prayer]) {
              return (
                <div key={prayer} className="prayer-item">
                  <img 
                    src={`prayer-images/${prayer}.jpg`} 
                    alt={prayer} 
                  />
                  <div className="prayer-info">
                    <b>{prayerNamesInArabic[prayer]}</b>
                    <span>{time}</span>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
}
export default App;