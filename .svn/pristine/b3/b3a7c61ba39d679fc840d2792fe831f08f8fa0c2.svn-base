let audioInfo = {
  autoplay: false,
  testAutoPlay () {
    // 返回一个promise以告诉调用者检测结果
    return new Promise(resolve => {
      let audio = document.createElement('audio');
      // require一个本地文件，会变成base64格式
      audio.src = 'alarm.mp3'
      // require('@/assets/alarm.mp3');
      document.body.appendChild(audio);
      let autoplay = true;
      // play返回的是一个promise
      audio.play().then(() => {
        // 支持自动播放
        autoplay = true;
      }).catch(err => {
        // 不支持自动播放
        autoplay = false;
      }).finally(() => {
        audio.remove();
        // 告诉调用者结果
        resolve(autoplay);
      });
    });
  },
  // 监听页面的点击事件，一旦点过了就能autoplay了
  setAutoPlayWhenClick () {
    function setAutoPlay () {
      // 设置自动播放为true
      audioInfo.autoplay = true;
      document.removeEventListener('click', setAutoPlay);
      document.removeEventListener('touchend', setAutoPlay);
    }
    document.addEventListener('click', setAutoPlay);
    document.addEventListener('touchend', setAutoPlay);
  },
  init () {
    // 检测是否能自动播放
    audioInfo.testAutoPlay().then(autoplay => {
      if (!audioInfo.autoplay) {
        audioInfo.autoplay = autoplay;
      }
    });
    // 用户点击交互之后，设置成能自动播放
    audioInfo.setAutoPlayWhenClick();
  }
};
export default audioInfo;