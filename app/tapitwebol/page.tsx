'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MatrixBackground from '../components/MatrixBackground';
import Mole from '../components/Mole';

export default function TapItWeBolPage() {
  const [holes, setHoles] = useState(Array(9).fill(false));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(13.01);
  const [isGameActive, setIsGameActive] = useState(false);
  const moleTimeouts = useRef<{ [key: number]: NodeJS.Timeout }>({});
  const timeLeftRef = useRef(timeLeft);
  const hitSound = useRef<HTMLAudioElement | null>(null);
  const [soundLoaded, setSoundLoaded] = useState(false);

  useEffect(() => {
    const audio = new Audio('/hit.mp3');
    audio.preload = 'auto';
    
    const handleLoad = () => {
      setSoundLoaded(true);
    };

    audio.addEventListener('canplaythrough', handleLoad);
    hitSound.current = audio;

    return () => {
      audio.removeEventListener('canplaythrough', handleLoad);
      if (hitSound.current) {
        hitSound.current = null;
      }
    };
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTimeLeft = parseFloat((prev - 0.1).toFixed(1));
          timeLeftRef.current = newTimeLeft;
          return newTimeLeft;
        });
      }, 100);
    } else if (timeLeft <= 0) {
      setIsGameActive(false);
      setTimeLeft(0);
    }
    return () => clearInterval(timer);
  }, [isGameActive, timeLeft]);

  useEffect(() => {
    let moleTimeout: NodeJS.Timeout;
    if (isGameActive) {
      const scheduleNextMole = () => {
        const currentTimeLeft = timeLeftRef.current;
        const moleInterval = currentTimeLeft > 5 ? 450 : 450 / 3;
        moleTimeout = setTimeout(() => {
          setHoles((prevHoles) => {
            const newHoles = [...prevHoles];
            if (Math.random() < 0.5) {
              const emptyIndices = newHoles
                .map((isVisible, index) => (!isVisible ? index : null))
                .filter((index): index is number => index !== null);
              if (emptyIndices.length > 0) {
                const randomIndex =
                  emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
                newHoles[randomIndex] = true;

                const moleDuration = Math.random() * 1000 + 500;
                const timeoutId = setTimeout(() => {
                  setHoles((prevHoles) => {
                    const updatedHoles = [...prevHoles];
                    updatedHoles[randomIndex] = false;
                    return updatedHoles;
                  });
                }, moleDuration);

                moleTimeouts.current[randomIndex] = timeoutId;
              }
            }
            return newHoles;
          });
          scheduleNextMole();
        }, moleInterval);
      };

      scheduleNextMole();
    }

    return () => {
      clearTimeout(moleTimeout);
      Object.values(moleTimeouts.current).forEach((timeoutId) =>
        clearTimeout(timeoutId)
      );
      moleTimeouts.current = {};
    };
  }, [isGameActive]);

  useEffect(() => {
    if (!isGameActive) {
      setHoles(Array(9).fill(false));
    }
  }, [isGameActive]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(13.01);
    timeLeftRef.current = 13.01;
    setIsGameActive(true);
  };

  const resetGame = () => {
    setScore(0);
    setTimeLeft(13.01);
    timeLeftRef.current = 13.01;
    setIsGameActive(false);
  };

  const playHitSound = () => {
    if (hitSound.current && soundLoaded) {
      hitSound.current.pause();
      hitSound.current.currentTime = 0;
      
      const playPromise = hitSound.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Audio playback failed:', error);
        });
      }
    }
  };

  const hitMole = (index: number) => {
    if (holes[index] && isGameActive) {
      playHitSound();
      setScore((prev) => prev + 1);
      setHoles((prevHoles) => {
        const newHoles = [...prevHoles];
        newHoles[index] = false;
        return newHoles;
      });
      clearTimeout(moleTimeouts.current[index]);
      delete moleTimeouts.current[index];
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <MatrixBackground />
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 p-4 pt-16 min-h-0">
        <div className="w-full max-w-lg mx-auto flex flex-col h-full justify-center">
          {!isGameActive && timeLeft === 13.01 ? (
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white">TAP IT WE BOL</h1>
              <button
                onClick={startGame}
                className="game-button"
              >
                Start Game
              </button>
            </div>
          ) : isGameActive ? (
            <>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white text-center">TAP IT WE BOL</h1>
              <div className="game-stats mb-2">
                <p>Score: {score}</p>
                <p>Time remaining: {timeLeft.toFixed(2)} sec</p>
              </div>

              <div className="game-board mb-2">
                {holes.map((isMoleVisible, index) => (
                  <div
                    key={index}
                    className="hole"
                    onClick={() => isGameActive && hitMole(index)}
                    onTouchStart={() => isGameActive && hitMole(index)}
                  >
                    <Mole isVisible={isGameActive && isMoleVisible} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white">TAP IT WE BOL</h1>
              <p className="text-white text-lg mb-4">Your score is {score}</p>
              <button
                onClick={resetGame}
                className="game-button"
              >
                Replay
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
} 