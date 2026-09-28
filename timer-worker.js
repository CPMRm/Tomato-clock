let timerId = null;
let targetTime = 0;

self.onmessage = function (e) {
  const { command, duration } = e.data;

  if (command === 'start') {
    if (timerId) clearInterval(timerId);
    
    // 記錄預計結束的時間戳記 (關鍵：用絕對時間戳修正累積誤差)
    targetTime = Date.now() + duration * 1000;

    timerId = setInterval(() => {
      const remainingSeconds = Math.max(0, Math.round((targetTime - Date.now()) / 1000));
      
      self.postMessage({ type: 'tick', remaining: remainingSeconds });

      if (remainingSeconds <= 0) {
        clearInterval(timerId);
        timerId = null;
        self.postMessage({ type: 'finished' });
      }
    }, 500); // 500ms 檢查一次，確保時間精確
  } 
  else if (command === 'stop') {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }
};
