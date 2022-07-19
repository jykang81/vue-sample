<template>
  <div class="thinglive_main live">
    <section>
      <article>
        <div class="photo_wrap">
          <div class="video_wrap">
            <video-player
              ref="videoPlayer1"
              :options="playerOptions"
              custom-event-name="error"
              @error="onPlayerError($event)"
              @play="onPlayerPlay($event)"
            />
          </div>
          <div
            class="play_button"
          >
            <button
              type="button"
              @click="playVideo"
            >
              <span class="icons_play">재생</span>
            </button>
          </div>
        </div>
      </article>
    </section>
    <video-player
      ref="videoPlayer2"
      :options="playerOptions"
      custom-event-name="error"
      @error="onPlayerError($event)"
      @play="onPlayerPlay($event)"
      @statechanged="playerStateChanged($event)"
      @playing="onPlayerPlaying($event)"
    />
    <!-- <video
      id="shopplus-player"
      class="video-js vjs-default-skin"
      controls
      preload="auto"
      data-setup="{}"
    >
      <source src="https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8" type="application/x-mpegURL">
    </video> -->
  </div>
  <!--
                class="video-player-box"
                :playsinline="true"
                custom-event-name="customstatechangedeventname"
                @pause="onPlayerPause($event)"
                @statechanged="playerStateChanged($event)"
                @ready="playerReadied"
                @ended="onPlayerEnded($event)"
                @waiting="onPlayerWaiting($event)"
                @playing="onPlayerPlaying($event)"
                @loadeddata="onPlayerLoadeddata($event)"
                @timeupdate="onPlayerTimeupdate($event)"
                @canplay="onPlayerCanplay($event)"
                @canplaythrough="onPlayerCanplaythrough($event)" -->
</template>

<script>
import '@videojs/http-streaming'
// https://github.com/surmon-china/vue-video-player
export default {
  data () {
    return {
      playerOptions: {
        // videojs options
        muted: true,
        fluid: true,
        language: 'ko',
        // playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [{
          // webm / mp4
          // type: 'video/mp4',
          // src: 'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm'
          // m3u8
          type: 'application/x-mpegURL',
          src: 'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8'
          // src: 'http://shoppstream.nsmall.com:1935/IPHONE/mobile.m3u8'
          // src: 'http://221.140.53.85:1935/IPHONE/live.m3u8'
        }],
        poster: '/static/images/author.jpg',
        controlBar: {
          children: [
            'playToggle',
            'volumePanel',
            // 'currentTimeDisplay',
            // 'timeDivider',
            // 'durationDisplay',
            'progressControl',
            // 'liveDisplay',
            // 'seekToLive',
            'remainingTimeDisplay',
            // 'customControlSpacer',
            // 'playbackRateMenuButton',
            // 'chaptersButton',
            // 'descriptionsButton',
            // 'subsCapsButton',
            // 'audioTrackButton',+
            'fullscreenToggle'
          ]
        }
      }
    }
  },
  computed: {
    player () {
      return this.$refs.videoPlayer1.player
    }
  },
  mounted () {
    console.log('this is current player instance object', this.player)
  },
  methods: {
    onPlayerError (player) {
      // Do nothing
    },
    // listen event
    onPlayerPlay (player) {
      console.log('player play!', player)
    },
    onPlayerPause (player) {
      console.log('player pause!', player)
    },
    // ...player event

    // or listen state event
    playerStateChanged (playerCurrentState) {
      console.log('player current update state', playerCurrentState)
    },

    // player is ready
    playerReadied (player) {
      console.log('the player is readied', player)
      // you can use it to do something...
      // player.[methods]
    },

    onPlayerPlaying (player) {
      console.log('the player is onPlayerPlaying', player)
      // you can use it to do something...
      // player.[methods]
    },
    /**
     * 비디오 재생
     * @returns {void}
     */
    playVideo () {
      this.player.play()
    }
  }
}
</script>
