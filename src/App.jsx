import { useState } from 'react'
import { useEffect } from 'react'
import bookmarks from './bookmarks.jsx';
import p1 from './assets/papes/p1.jpg'
import p2 from './assets/papes/p2.jpg'
import p3 from './assets/papes/p3.jpg'
import p4 from './assets/papes/p4.jpg'
import p5 from './assets/papes/p5.jpg'
import p6 from './assets/papes/p6.jpg'
import './styles.css';

function BookmarkSet({ set }) {
  const links = set.links.map((l) => {
    return (<a
      className="bookmark"
      key={l.url}
      href={l.url}>
      {l.name}
    </a>)
  })

  return (
    <div className="bookmark-set">
      <div className="bookmark-title">{set.title}</div>
      <div className="bookmark-inner-container">
        {links}
      </div>
    </div>
  )
}

function setBg() {
  const picArr = [p1, p2, p3, p4, p5, p6]
  const rndNum = Math.floor(Math.random() * picArr.length)
  const selPic = picArr[rndNum]

  useEffect(() => {
    // document.body.style.background = `url(${selPic}) contain center/contain no-repeat`;
    document.body.style.backgroundImage = `url(${selPic})`;

    // Cleanup function to remove the background when the component unmounts
    return () => {
      document.body.style.backgroundImage = '';
    };
  }, [selPic]);

  return null;
}

function BookmarksContainer({ bookmarks }) {
  const buf = bookmarks.map((set) => {
    return (<BookmarkSet key={set.title} set={set} />)
  })

  return (
    <div id="bookmark-container">
      {buf}
    </div>
  )
}

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (<div id="clock">{time.toTimeString().slice(0, 5)}</div>)
}

function Weather() {
  const [tempStr, setTempStr] = useState('');
  const [desc, setDesc] = useState('');

  fetch("http://api.openweathermap.org/data/2.5/weather?id=2063523&units=metric&appid=e5b292ae2f9dae5f29e11499c2d82ece")
    .then((res) => { return res.json(); })
    .then((data) => {
      setTempStr(data.main.temp.toFixed(0).concat(" °C"));
      setDesc(data.weather[0].description);
    });

  return (
    <div className="weather-container">
      <div className="row">
        <div id="weather-description" className="inline">{desc}</div>
        <div className="inline">-</div>
        <div id="temp" className="inline">{tempStr}</div>
      </div>
    </div>
  )
}

function App() {

  setBg();

  return (
    <>
      <Clock />
      <Weather />
      <BookmarksContainer bookmarks={bookmarks} />
    </>
  )
}

export default App