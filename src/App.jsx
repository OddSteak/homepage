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

function SearchResults({ books, searchVal }) {
  const buf = []

  for (let set of books) {
    for (let link of set.links) {
      const indexText = link.name + link.url
      const res = indexText.toLowerCase().indexOf(searchVal.toLowerCase())
      if (res != -1) {
        buf.push(
          <li key={link.url} id="links">
            <a href={link.url}>{link.name}</a>
          </li>
        )
      }
    }
  }

  return (
    <ol className="search-results">
      {buf}
    </ol>
  )
}

function Search({ searchStatus, setSearchStatus }) {
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.code;
      const searchUrl = "https://google.com/search?q=";

      if (key == 'Escape' && searchStatus) {
        setSearchStatus(false);
        setSearchVal('');
      } else if (key == 'Enter' && searchStatus && searchVal !== '') {
        document.location.href = searchUrl + searchVal
      }
    };

    document.addEventListener('keydown', handleKeyDown, false);
  }, [searchStatus, setSearchStatus, searchVal, setSearchVal]);

  if (searchStatus) {
    return (
      <div id="search">
        <input
          id="search-field"
          autoFocus
          value={searchVal}
          type="text"
          name="search-field"
          onBlur={() => {
            setSearchStatus(false);
            setSearchVal('');
          }}
          onChange={(e) => setSearchVal(e.target.value)}
        />
        <SearchResults books={bookmarks} searchVal={searchVal} />
      </div>
    )
  }

  return null;
}

function App() {
  const [searchStatus, setSearchStatus] = useState(false)

  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.code;
      if (key == 'Space' && !searchStatus) {
        setSearchStatus(true);
        e.preventDefault();
      }
    };

    document.addEventListener('keypress', handleKeyPress, false);
  }, [searchStatus, setSearchStatus]);

  setBg();

  if (searchStatus) {
    return (
      <Search
        searchStatus={searchStatus}
        setSearchStatus={setSearchStatus}
      />
    )
  }

  return (
    <>
      <Clock />
      <Weather />
      <BookmarksContainer bookmarks={bookmarks} />
    </>
  )
}

export default App
