import React, { useEffect, useState } from "react";
import {useSound} from "use-sound";

const SECOND = 1_000;
const MINUTE = SECOND * 60;

const IDLE = 0;
const SESSION = 1;
const BREAK = 2;
const PAUSE = 3;

const WORKP = 25;
const BREAKP = 5;

console.clear();

export default function Pomodoro() {
  const [breakP, setBreakP] = useState(BREAKP); // break period
  const [workP, setWorkP] = useState(WORKP); // work period
  const [status, setStatus] = useState(0); // work period
  const [timespan, setTimespan] = useState(0); // deadline

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (status !== IDLE && status !== PAUSE) {
        setTimespan((_timespan) => (_timespan > 0 ? _timespan - SECOND*60 : 0));
      }
    }, SECOND);

    return () => {
      clearInterval(intervalId);
    };
  }, [status]);

  const sessionDecrement = () => setWorkP((w) => (w > 1 ? w - 1 : 1));
  const sessionIncrement = () => setWorkP((w) => (w < 59 ? w + 1 : 60));
  const breakDecrement = () => setBreakP((b) => (b > 1 ? b - 1 : 1));
  const breakIncrement = () => setBreakP((b) => (b < 59 ? b + 1 : 60));
  
  //const snd = document.getElementById("beep");
  const beepSound = 'https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav';
  const [play,{stop}] = useSound(beepSound);

  const timeLeft = () => {
    let tl = "";
    let min = Math.floor((timespan / MINUTE) % 60).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    let sec = Math.floor((timespan / SECOND) % 60).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });

    status === IDLE ? (tl = `${workP}:00`) : (tl = `${min}:${sec}`);

    if (status === SESSION && timespan === 0) {
      setTimespan(breakP * MINUTE);
      setStatus(BREAK);
      play();
    } else if (status === BREAK && timespan === 0) {
      setTimespan(workP * MINUTE);
      setStatus(SESSION);
      play();
    }

    return tl;
  };

  const startPomodoro = () => {
    if (status === SESSION) {
      setStatus(PAUSE);
    } else if (status === PAUSE) {
      setStatus(SESSION);
    } else {
      setTimespan(workP * MINUTE);
      setStatus(SESSION);
    }
  };

  const refreshPomodoro = () => {
    setBreakP(BREAKP);
    setWorkP(WORKP);
    setStatus(IDLE);
    stop();
  };

  return (
    <div id="pomodoro">
      <div id="session">
        <div id="session-label" className="label">
          Session Length
        </div>
        <div id="session-sec" className="sect">
          <button id="session-decrement" onClick={sessionDecrement}>
            ↓
          </button>
          <p id="session-length" className="timer small">
            {workP}
          </p>
          <button id="session-increment" onClick={sessionIncrement}>
            ↑
          </button>
        </div>
      </div>
      <div id="break">
        <div id="break-label" className="label">
          Break Length
        </div>
        <div id="break-sec" className="sect">
          <button id="break-decrement" onClick={breakDecrement}>
            ↓
          </button>
          <p id="break-length" className="timer small">
            {breakP}
          </p>
          <button id="break-increment" onClick={breakIncrement}>
            ↑
          </button>
        </div>
      </div>
      <div id="timer">
        <div id="timer-label" className="label">
          {status === SESSION
            ? "Session"
            : status === BREAK
            ? "Break"
            : "Session"}
        </div>
        <div id="timer-sec" className="sect">
          <button id="start_stop" onClick={startPomodoro}>
            <i class="material-icons">
              {status === SESSION ? "pause" : "play_arrow"}
            </i>
          </button>
          <p id="time-left" className="timer">
            {timeLeft()}
          </p>
          <button id="reset" onClick={refreshPomodoro}>
            <i class="material-icons">replay</i>
          </button>
        </div>
      </div>
    </div>
  );
}
