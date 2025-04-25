import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { FaCheckCircle, FaInfoCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';
import '../styles/Notification.css';

const Notification = ({ message, type = 'success', onClose }) => {
  const [position, setPosition] = useState({ top: 0, right: 0 });

  useEffect(() => {
    // Generate random position for the notification
    const randomTop = Math.random() * (window.innerHeight - 200);
    const randomRight = 20 + Math.random() * 20;
    setPosition({ top: randomTop, right: randomRight });

    // Enhanced confetti effect
    const confettiColors = {
      success: ['#4CAF50', '#81C784', '#A5D6A7'],
      error: ['#F44336', '#E57373', '#FFCDD2'],
      info: ['#2196F3', '#64B5F6', '#90CAF9'],
      warning: ['#FFC107', '#FFD54F', '#FFE082']
    };

    // First burst
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { x: 0.9, y: randomTop / window.innerHeight },
      colors: confettiColors[type],
      gravity: 0.5,
      scalar: 1.2,
      ticks: 150,
      shapes: ['circle', 'square']
    });

    // Second burst (delayed)
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { x: 0.9, y: randomTop / window.innerHeight },
        colors: confettiColors[type],
        gravity: 0.7,
        scalar: 0.9,
        ticks: 100
      });
    }, 200);

    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [type, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="notification-icon success" />;
      case 'error':
        return <FaTimesCircle className="notification-icon error" />;
      case 'info':
        return <FaInfoCircle className="notification-icon info" />;
      case 'warning':
        return <FaExclamationTriangle className="notification-icon warning" />;
      default:
        return null;
    }
  };

  return (
    <div 
      className={`notification ${type}`}
      style={{ 
        top: `${position.top}px`, 
        right: `${position.right}px`,
      }}
    >
      <div className="notification-content">
        <div className="notification-icon-wrapper">
          {getIcon()}
        </div>
        <div className="notification-text">
          <p className="notification-message">{message}</p>
        </div>
        <button className="notification-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default Notification; 