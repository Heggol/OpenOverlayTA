import React, { useState, useEffect } from 'react';
import './countdown.css';

interface CountdownProps {
	initialSeconds?: number;
}

const Countdown: React.FC<CountdownProps> = ({ initialSeconds = 300 }) => {
	const [seconds, setSeconds] = useState(() => {
		const params = new URLSearchParams(window.location.search);
		const time = parseInt(params.get('time') || `${initialSeconds}`, 10);
		return isNaN(time) ? initialSeconds : time;
	});
	
	const [key, setKey] = useState(window.location.href);
	
	useEffect(() => {
		const handleUrlChange = () => {
			setKey(window.location.href);
			const params = new URLSearchParams(window.location.search);
			const time = parseInt(params.get('time') || `${initialSeconds}`, 10);
			setSeconds(isNaN(time) ? initialSeconds : time);
		};
		
		window.addEventListener('popstate', handleUrlChange);
		window.addEventListener('hashchange', handleUrlChange);
		
		return () => {
			window.removeEventListener('popstate', handleUrlChange);
			window.removeEventListener('hashchange', handleUrlChange);
		};
	}, [initialSeconds]);
	
	useEffect(() => {
		if (seconds <= 0) return;
		
		const timer = setInterval(() => {
			setSeconds((prev) => prev - 1);
		}, 1000);
		
		return () => clearInterval(timer);
	}, [seconds]);
	
	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60);
		const secs = time % 60;
		return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
	};
	
	const handleReset = () => {
		const params = new URLSearchParams(window.location.search);
		const time = parseInt(params.get('time') || `${initialSeconds}`, 10);
		setSeconds(isNaN(time) ? initialSeconds : time);
	};
	
	return (
		<div onClick={handleReset} className="countdown-timer" style={{ cursor: 'pointer' }}>
			{formatTime(seconds)}
		</div>
	);
};

export default Countdown;