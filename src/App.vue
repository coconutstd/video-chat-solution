<template>
  <div id="app">
    테스트 환경 입니다
    <div id="tile-16" class="video-tile">
      <video id="video-16" class="video-tile-video"></video>
      <div id="attendeeid-16" class="video-tile-attendeeid"></div>
      <div id="nameplate-16" class="video-tile-nameplate"></div>
      <button id="video-pause-16" class="video-tile-pause btn">Pause</button>
    </div>
  </div>
</template>

<script>
import {Capture } from './face_module/js/capture'
export default {
  name: 'hello'
}
</script>

