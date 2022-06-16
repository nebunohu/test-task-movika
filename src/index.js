import VideoPlugin from "./plugin/plugin";
import video1 from './media/1647193175233850114_576x1024.webm';
import video2 from './media/1647450445286199218_480x480.webm'

const root = document.getElementById('plugin-container');

const plugin = new VideoPlugin(root, [video1, video2]);

