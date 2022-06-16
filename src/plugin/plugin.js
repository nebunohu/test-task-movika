import '../styles/index.css';
import decor1 from '../media/decor1.svg';
import decor2 from '../media/decor2.svg';
import playSrc from '../media/play.svg';
import play1Src from '../media/play1.svg';
import play2Src from '../media/play2.svg';
import play3Src from '../media/play3.svg';

export default class VideoPlugin {
  constructor(root, videos) {
    this.videos = videos;
    this.init(root);
  }

  wrapper = null;
  migrateContainer = null;
  timerNodes = [];
  playButtonNode = null;
  videos = [];
  videoContainer = null;
  currentSrc = null;
  state = {
    videoIndex: 0,
    videoDuration: 0,
    play: false,
  }

  pressedSuccess = () => {
    if (this.state.videoIndex < this.videos.length - 1)  {
      this.state.videoIndex += 1;
    } else {
      this.state.videoIndex = 0;
    }
    this.videoContainer.src = this.videos[this.state.videoIndex];
    this.timers.forEach((el) => {
      el.textContent = this.state.videoDuration;
    });
  }

  makeContainer = () => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('plugin-wrapper');

    const decoration1 = document.createElement('img');
    decoration1.classList.add('decoration', 'left');
    decoration1.src = decor1;

    const decoration11 = document.createElement('img');
    decoration11.classList.add('decoration', 'left', 'inner');
    decoration11.src = decor2;

    const decoration2 = document.createElement('img');
    decoration2.classList.add('decoration', 'right');
    decoration2.src = decor1;

    const decoration21 = document.createElement('img');
    decoration21.classList.add('decoration', 'right', 'inner');
    decoration21.src = decor2;

    const timerLeft = document.createElement('div');
    timerLeft.classList.add('timer', 'left');

    const timerRight = document.createElement('div');
    timerRight.classList.add('timer', 'right');

    this.timers = [timerLeft, timerRight];

    wrapper.append(decoration1, decoration11, decoration2, decoration21, timerLeft, timerRight);

    // this.wrapper = wrapper;

    return wrapper;
  }

  makePlayButton = () => {
    const playWrapper = document.createElement('div');
    playWrapper.classList.add('play-wrapper');

    const play = document.createElement('img');
    play.classList.add('play');
    play.src = playSrc;
    playWrapper.append(play);

    const play1 = document.createElement('img');
    play1.classList.add('play');
    play1.src = play1Src;
    playWrapper.append(play1);

    const play2 = document.createElement('img');
    play2.classList.add('play');
    play2.src = play2Src;
    playWrapper.append(play2);

    const play3 = document.createElement('img');
    play3.classList.add('play');
    play3.src = play3Src;
    playWrapper.append(play3);

    playWrapper.addEventListener('click', () => {
      if (this.videoContainer.paused) {
        this.videoContainer.play();
      } else {
        this.pressedSuccess();
        this.videoContainer.pause();
      }
      this.state.play = !this.state.play;
    });

    // this.playButtonNode = playWrapper;

    return playWrapper;
  }

  makeVideoContainer = () => {
    const videoContainer = document.createElement('video');
    videoContainer.autoplay = true;
    videoContainer.autobuffer = true;
    videoContainer.src = this.videos[0];
    videoContainer.classList.add('video');

    return videoContainer;
  }

  passNewCoords = () => {
    const generateRandom = () => Math.random() * ((Math.random() < 0.5) ? -1 : 1) * 20;
    const playStyles = getComputedStyle(this.playButtonNode);
    const playHeight = parseInt(playStyles.height);
    const playWidth = parseInt(playStyles.width);
    const migrateContainerStyles = getComputedStyle(this.migrateContainer);
    const migrateContainerHeight = parseInt(migrateContainerStyles.height);
    const migrateContainerWidth = parseInt(migrateContainerStyles.width);
    const top = parseInt(playStyles.top);
    const left = parseInt(playStyles.left); 
    const deltaTop = generateRandom();
    const deltaLeft = generateRandom();
    if (top + deltaTop < playHeight) {
      this.playButtonNode.style.top = `${playHeight / 2}px`;
    } else if (top + deltaTop > migrateContainerHeight - playHeight / 2) {
      this.playButtonNode.style.top = `${migrateContainerHeight - playHeight / 2}px`;
    } else {
      this.playButtonNode.style.top = `${top + deltaTop}px`;
    }
    if (left + deltaLeft < 0 + playWidth / 2) {
      this.playButtonNode.style.left = `${playWidth / 2}`;
    } else if (left + deltaLeft > migrateContainerWidth - playWidth / 2) {
      this.playButtonNode.style.left = `${migrateContainerWidth - playWidth / 2}px`;
    } else {
      this.playButtonNode.style.left = `${left + deltaLeft}px`;
    }
  }

  init = (root) => {
    
    this.wrapper = this.makeContainer();

    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    this.migrateContainer = document.createElement('div');
    this.migrateContainer.classList.add('migrate-container');

    this.playButtonNode = this.makePlayButton();
    this.migrateContainer.append(this.playButtonNode);

    this.videoContainer = this.makeVideoContainer();

    this.wrapper.append(this.videoContainer, this.migrateContainer, overlay);

    this.videoContainer.onloadedmetadata = () => {
      this.state.videoDuration = Math.floor(this.videoContainer.duration);
      this.timerNodes.forEach((el) => {
        el.textContent = this.state.videoDuration;
      });
      this.videoContainer.play();
      this.state.play = true;
    }

    this.videoContainer.ontimeupdate = (event) => {
      this.timers.forEach((el) => {
        el.textContent = this.state.videoDuration - Math.floor(event.target.currentTime);
      });
      this.passNewCoords();
    }

    root.append(this.wrapper);
  }
};
