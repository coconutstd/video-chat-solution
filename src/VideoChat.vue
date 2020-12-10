<template>
  <div>
    <div id="flow-authenticate" class="flow text-center p-2">
      <div class="text-muted" style="position:fixed;right:3px;bottom:3px" ref="sdk-version">
      </div>
      <div class="container">
        <form id="form-authenticate">
          <h1 class="h3 mb-3 font-weight-normal">OMNI Project</h1>
          <div class="row mt-3">
            <label for="inputMeeting" class="sr-only">Meeting Title</label>
            <input type="name" id="inputMeeting" class="form-control" placeholder="회의 제목" required autofocus>
          </div>
          <div class="row mt-3">
            <label for="inputName" class="sr-only">Your Name</label>
            <input type="name" id="inputName" class="form-control" placeholder="참가 이름" required>
          </div>
          <div class="row mt-3">
            <label for="inputRegion" class="sr-only">Media Region</label>
            <select id="inputRegion" class="custom-select" style="width:100%">
              <!--            <option value="us-east-1" selected>United States (N. Virginia)</option>-->
              <!--            <option value="ap-northeast-1">Japan (Tokyo)</option>-->
              <!--            <option value="ap-southeast-1">Singapore</option>-->
              <!--            <option value="af-south-1">South Africa (Cape Town)</option>-->
              <!--            <option value="eu-south-1">Italy (Milan)</option>-->
              <!--            <option value="ap-south-1">India (Mumbai)</option>-->
              <!--            <option value="ap-northeast-2">South Korea (Seoul)</option>-->
              <!--            <option value="ap-southeast-2">Australia (Sydney)</option>-->
              <!--            <option value="ca-central-1">Canada</option>-->
              <!--            <option value="eu-central-1">Germany (Frankfurt)</option>-->
              <!--            <option value="eu-north-1">Sweden (Stockholm)</option>-->
              <!--            <option value="eu-west-1">Ireland</option>-->
              <!--            <option value="eu-west-2">United Kingdom (London)</option>-->
              <!--            <option value="eu-west-3">France (Paris)</option>-->
              <!--            <option value="sa-east-1">Brazil (São Paulo)</option>-->
              <!--            <option value="us-east-2">United States (Ohio)</option>-->
              <!--            <option value="us-west-1">United States (N. California)</option>-->
              <!--            <option value="us-west-2">United States (Oregon)</option>-->
            </select>
          </div>
          <div class="row mt-3">
            <div class="col-12">
              <fieldset>
                <legend>Choose your optional features</legend>
                <div class="custom-control custom-checkbox" style="text-align: left;">
                  <input type="checkbox" id="webaudio" class="custom-control-input">
                  <label for="webaudio" class="custom-control-label">Use WebAudio</label>
                </div>
                <div class="custom-control custom-checkbox" style="text-align: left;">
                  <input type="checkbox" id="fullband-speech-mono-quality" class="custom-control-input">
                  <label for="fullband-speech-mono-quality" class="custom-control-label">Set fullband speech (mono)
                    quality</label>
                </div>
                <div class="custom-control custom-checkbox" style="text-align: left;">
                  <input type="checkbox" id="fullband-music-mono-quality" class="custom-control-input">
                  <label for="fullband-music-mono-quality" class="custom-control-label">Set fullband music (mono)
                    quality</label>
                </div>
                <div class="custom-control custom-checkbox" style="text-align: left;">
                  <input type="checkbox" id="simulcast" class="custom-control-input">
                  <label for="simulcast" class="custom-control-label">Enable Simulcast for Chrome</label>
                </div>
                <div class="custom-control custom-checkbox" style="text-align: left;">
                  <input type="checkbox" id="planB" class="custom-control-input">
                  <label for="planB" class="custom-control-label">Disable Unified Plan for Chrome</label>
                </div>
              </fieldset>
            </div>
          </div>
          <div class="row mt-3">
            <button id="authenticate" class="btn btn-lg btn-primary btn-block" type="submit">시작하기</button>
          </div>
          <div class="row mt-3">
            <p>Anyone with access to the meeting link can join.</p>
          </div>
          <a id="to-sip-flow" class="row mt-3" href="#">Joining via SIP? Click here.</a>
          <div class="row mt-3">
            <div id="progress-authenticate" class="w-100 progress progress-hidden">
              <div class="w-100 progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
                   aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Authenticate for SIP with meeting and voice connector ID -->

    <div id="flow-sip-authenticate" class="flow text-center">
      <div class="container">
        <form id="form-sip-authenticate">
          <h1 class="h3 mb-3 font-weight-normal">Join a meeting via SIP</h1>
          <div class="row mt-3">
            <label for="sip-inputMeeting" class="sr-only">Meeting Title</label>
            <input type="name" id="sip-inputMeeting" class="form-control" placeholder="Meeting Title" required
                   autofocus>
          </div>
          <div class="row mt-3">
            <label for="voiceConnectorId" class="sr-only">Voice Connector ID</label>
            <input type="name" id="voiceConnectorId" class="form-control" placeholder="Voice Connector ID" required>
          </div>
          <div class="row mt-3">
            <button id="button-sip-authenticate" class="btn btn-lg btn-primary btn-block" type="submit">Continue
            </button>
          </div>
          <div class="row mt-3">
            <p>You will need a SIP client in order to join the meeting.</p>
          </div>
        </form>
      </div>
    </div>

    <!-- Failure card if meeting is invalid -->

    <div id="flow-failed-meeting" class="flow">
      <div class="container">
        <form id="form-failed-meeting">
          <div class="card border-warning mb-3" style="max-width: 20rem;">
            <div id="failed-meeting" class="card-header"></div>
            <div class="card-body">
              <h4 class="card-title">Unable to find meeting</h4>
              <p class="card-text">There was an issue finding that meeting. The meeting may have already ended, or your
                authorization may have expired.</p>
              <small id="failed-meeting-error" class="text-muted"></small>
            </div>
          </div>
          <button class="btn btn-lg btn-outline-warning btn-block" type="submit">OK</button>
        </form>
      </div>
    </div>

    <!-- Prompt for permission to get access to device labels -->

    <div id="flow-need-permission" class="flow">
      <div class="container">
        <form id="form-need-permission">
          <div class="card border-info mb-3" style="max-width: 20rem;">
            <div class="card-header">Permissions check</div>
            <div class="card-body">
              <h4 class="card-title">Unable to get device labels</h4>
              <p class="card-text">In order to select media devices, we need to do a quick permissions check of your mic
                and camera. When the pop-up appears, choose <b>Allow</b>.</p>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Display SIP URI -->

    <div id="flow-sip-uri" class="flow">
      <div class="container">
        <form id="sip-uri-form">
          <div class="card border-info mb-3" style="max-width: 20rem;">
            <div class="card-header">SIP URI</div>
            <div class="card-body">
              <a id="copy-sip-uri" class="card-title" href="#">Copy</a>
              <input id="sip-uri" class="card-text">
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Device management and preview screen -->

    <div id="flow-devices" class="flow">
      <div class="container">
        <form id="form-devices">
          <h1 class="h3 mb-3 font-weight-normal text-center">Select devices</h1>
          <div class="row mt-3">
            <div class="col-12 col-sm-8">
              <label for="audio-input block">Microphone</label>
              <select id="audio-input" class="custom-select" style="width:100%"></select>
            </div>

            <div class="text-center col-sm-4 d-sm-block">
              <label>Preview</label>
              <div class="w-100 progress" style="margin-top:0.75rem">
                <div id="audio-preview" class="progress-bar bg-success" role="progressbar" aria-valuenow="0"
                     aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
          </div>
          <div class="row mt-3">
            <div id="voice-focus-setting" class="col-12 col-sm-8 hidden">
              <input autocomplete="off" type="checkbox" id="add-voice-focus">
              <label style="margin-left: 0.5em" for="voice-focus-setting block">Add Voice Focus</label>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-12 col-sm-8">
              <label for="video-input block">Camera</label>
              <select id="video-input" class="custom-select" style="width:100%"></select>
            </div>
            <div class="col-sm-4 text-center d-sm-block video-preview">
              <video id="video-preview" class="w-100 h-100"
                     style="max-width:137px;max-height:82px;border-radius:8px"></video>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-12 col-sm-8">
              <select id="video-input-quality" class="custom-select" style="width:100%">
                <option value="360p">360p (nHD) @ 15 fps (600 Kbps max)</option>
                <option value="540p" selected>540p (qHD) @ 15 fps (1.4 Mbps max)</option>
                <option value="720p">720p (HD) @ 15 fps (1.4 Mbps max)</option>
              </select>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-12 col-sm-8">
              <label for="audio-output block">Speaker</label>
              <select id="audio-output" class="custom-select" style="width:100%"></select>
            </div>
            <div class="col-sm-4">
              <button id="button-test-sound" class="btn btn-outline-secondary btn-block h-50 d-sm-block"
                      style="margin-top:2rem">Test
              </button>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-lg">
              <button id="joinButton" class="btn btn-lg btn-primary btn-block" type="submit">Join</button>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-lg">
              <p>Ready to join meeting <b><span id="info-meeting"></span></b> as <b><span id="info-name"></span></b>.
              </p>
            </div>
          </div>
        </form>
        <div id="progress-join" class="w-100 progress progress-hidden">
          <div class="w-100 progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
               aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
      </div>
    </div>

    <!-- In-meeting screen -->

    <div id="flow-meeting" class="flow" style="position:absolute;left:0;top:85px;bottom:55px;right:0">
      <div class="p-2 d-none d-sm-block align-items-end" style="position:fixed;right:0;bottom:0;left:0;">
        <div class="row align-items-end">
          <div class="col">
            <div id="chime-meeting-id" class="text-muted"></div>
            <div id="desktop-attendee-id" class="text-muted"></div>
          </div>
          <div class="col d-none d-lg-block">
            <div id="video-uplink-bandwidth" class="text-muted text-right"></div>
            <div id="video-downlink-bandwidth" class="text-muted text-right"></div>
          </div>
        </div>
      </div>
      <audio id="meeting-audio" style="display:none"></audio>
      <div id="meeting-container" class="container-fluid h-100" style="display:flex; flex-flow:column">
        <div class="row mb-3 mb-lg-0" style="flex: unset;">
          <div class="col-12 col-lg-3 order-1 order-lg-1 text-center text-lg-left">
            <div id="meeting-id" class="navbar-brand text-muted m-0 m-lg-2"></div>
            <div id="mobile-chime-meeting-id" class="text-muted d-block d-sm-none" style="font-size:0.65rem;"></div>
            <div id="mobile-attendee-id" class="text-muted d-block d-sm-none mb-2" style="font-size:0.65rem;"></div>
          </div>
          <div class="col-8 col-lg-6 order-2 order-lg-2 text-left text-lg-center">
            <div class="btn-group mx-1 mx-xl-2 my-2" role="group" aria-label="Toggle microphone">
              <button id="button-microphone" type="button" class="btn btn-success" title="Toggle microphone">
                <!--                ${require('../node_modules/open-iconic/svg/microphone.svg').default}-->
                mic
              </button>
              <div class="btn-group" role="group">
                <button id="button-microphone-drop" type="button" class="btn btn-success dropdown-toggle"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                        title="Select microphone"></button>
                <div id="dropdown-menu-microphone" class="dropdown-menu dropdown-menu-right"
                     aria-labelledby="button-microphone-drop" x-placement="bottom-start"
                     style="position: absolute; transform: translate3d(0px, 38px, 0px); top: 0px; left: 0px; will-change: transform;">
                  <a class="dropdown-item" href="#">Default microphone</a>
                </div>
              </div>
            </div>
            <div class="btn-group mx-1 mx-xl-2 my-2" role="group" aria-label="Toggle camera">
              <button id="button-camera" type="button" class="btn btn-success" title="Toggle camera">
                <!--                ${require('../node_modules/open-iconic/svg/video.svg').default}-->
                cam
              </button>
              <div class="btn-group" role="group">
                <button id="button-camera-drop" type="button" class="btn btn-success dropdown-toggle"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                        title="Select camera"></button>
                <div id="dropdown-menu-camera" class="dropdown-menu dropdown-menu-right"
                     aria-labelledby="button-camera-drop" x-placement="bottom-start"
                     style="position: absolute; transform: translate3d(0px, 38px, 0px); top: 0px; left: 0px; will-change: transform;">
                  <a class="dropdown-item" href="#">Default camera</a>
                </div>
              </div>
            </div>


            <div class="btn-group mx-1 mx-xl-2 my-2" role="group" aria-label="Toggle content share">
              <button id="button-content-share" type="button" class="btn btn-success" title="Toggle content share">
                <!--                ${require('../../node_modules/open-iconic/svg/camera-slr.svg').default}-->
                screen
              </button>
              <div class="btn-group" role="group">
                <button id="button-content-share-drop" type="button" class="btn btn-success dropdown-toggle"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                        title="Select content to share"></button>
                <div id="dropdown-menu-content-share" class="dropdown-menu dropdown-menu-right"
                     aria-labelledby="button-content-share-drop" x-placement="bottom-start"
                     style="position: absolute; transform: translate3d(0px, 38px, 0px); top: 0px; left: 0px; will-change: transform;">
                  <a id="dropdown-item-content-share-screen-capture" class="dropdown-item" href="#">Screen
                    Capture...</a>
                  <a id="dropdown-item-content-share-screen-test-video" class="dropdown-item" href="#">Test Video</a>
                  <a id="dropdown-item-content-share-file-item" class="dropdown-item" href="#"><input
                      id="content-share-item" type="file"></a>
                </div>
              </div>
            </div>
            <button id="button-pause-content-share" type="button" class="btn btn-success mx-1 mx-xl-2 my-2"
                    title="Pause and unpause content share">
              <!--              ${require('../node_modules/open-iconic/svg/media-pause.svg').default}-->
              pause
            </button>
            <div class="btn-group mx-1 mx-xl-2 my-2" role="group" aria-label="Toggle speaker">
              <button id="button-speaker" type="button" class="btn btn-success" title="Toggle speaker">
                <!--                ${require('../node_modules/open-iconic/svg/volume-low.svg').default}-->
                speaker
              </button>
              <div class="btn-group" role="group">
                <button id="button-speaker-drop" type="button" class="btn btn-success dropdown-toggle"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                        title="Select speaker"></button>
                <div id="dropdown-menu-speaker" class="dropdown-menu dropdown-menu-right"
                     aria-labelledby="button-speaker-drop" x-placement="bottom-start"
                     style="position: absolute; transform: translate3d(0px, 38px, 0px); top: 0px; left: 0px; will-change: transform;">
                  <a class="dropdown-item" href="#">Default speaker</a>
                </div>
              </div>
            </div>
            <button id="button-video-stats" type="button" class="btn btn-success mx-1 mx-xl-2 my-2"
                    title="Toggle video WebRTC stats display" data-toggle="button" aria-pressed="false"
                    autocomplete="off">
              <!--              ${require('../node_modules/open-iconic/svg/signal.svg').default}-->
              stats

            </button>
          </div>
          <div class="col-4 col-lg-3 order-3 order-lg-3 text-right text-lg-right">
            <button id="button-meeting-leave" type="button" class="btn btn-outline-success mx-1 mx-xl-2 my-2 px-4"
                    title="Leave meeting">
              <!--              ${require('../node_modules/open-iconic/svg/account-logout.svg').default}-->
              leave
            </button>
            <button id="button-meeting-end" type="button" class="btn btn-outline-danger mx-1 mx-xl-2 my-2 px-4"
                    title="End meeting">
              <!--              ${require('../node_modules/open-iconic/svg/power-standby.svg').default}-->
              end
            </button>
            <button @click.prevent="onClickFaceApi" type="button" class="btn btn-outline-danger mx-1 mx-xl-2 my-2 px-4"
                    title="FaceAPI">
              <!--              ${require('../node_modules/open-iconic/svg/power-standby.svg').default}-->
              FaceApi
            </button>
          </div>
        </div>
        <div id="roster-tile-container" class="row flex-sm-grow-1 overflow-hidden h-100" style="flex: unset;">
          <div id="roster-message-container" class="d-flex flex-column col-12 col-sm-6 col-md-5 col-lg-4 h-100">
            <div class="bs-component" style="flex: 1 1 auto; overflow-y: auto; height: 50%;">
              <ul id="roster" class="list-group"></ul>
            </div>
            <div class="message d-flex flex-column pt-3" style="flex: 1 1 auto; overflow: hidden; height: 50%;">
              <div class="list-group receive-message" id="receive-message" style="flex: 1 1 auto; overflow-y: auto;
            border: 1px solid rgba(0, 0, 0, 0.125); background-color: #fff"></div>
              <div class="input-group send-message" style="display:flex;flex:0 0 auto;margin-top:0.2rem">
            <textarea class="form-control shadow-none" id="send-message" rows="1"
                      placeholder="Type a message (markdown supported)" style="display:inline-block; width:100%;
              resize:none; border-color: rgba(0, 0, 0, 0.125); outline: none; padding-left: 1.4rem"></textarea>
              </div>
            </div>
          </div>
          <div id="tile-container" class="col-12 col-sm-6 col-md-7 col-lg-8 my-4 my-sm-0 h-100"
               style="overflow-y: scroll">
            <div id="tile-area" class="v-grid">
              <div id="tile-0" class="video-tile">
                <video id="video-0" class="video-tile-video"></video>
                <div id="attendeeid-0" class="video-tile-attendeeid"></div>
                <div id="nameplate-0" class="video-tile-nameplate"></div>
                <button id="video-pause-0" class="video-tile-pause">Pause</button>
              </div>
              <div id="tile-1" class="video-tile">
                <video id="video-1" class="video-tile-video"></video>
                <div id="attendeeid-1" class="video-tile-attendeeid"></div>
                <div id="nameplate-1" class="video-tile-nameplate"></div>
                <button id="video-pause-1" class="video-tile-pause">Pause</button>
              </div>
              <div id="tile-2" class="video-tile">
                <video id="video-2" class="video-tile-video"></video>
                <div id="attendeeid-2" class="video-tile-attendeeid"></div>
                <div id="nameplate-2" class="video-tile-nameplate"></div>
                <button id="video-pause-2" class="video-tile-pause">Pause</button>
              </div>
              <div id="tile-3" class="video-tile">
                <video id="video-3" class="video-tile-video"></video>
                <div id="attendeeid-3" class="video-tile-attendeeid"></div>
                <div id="nameplate-3" class="video-tile-nameplate"></div>
                <button id="video-pause-3" class="video-tile-pause">Pause</button>
              </div>
              <div id="tile-4" class="video-tile">
                <video id="video-4" class="video-tile-video"></video>
                <div id="attendeeid-4" class="video-tile-attendeeid"></div>
                <div id="nameplate-4" class="video-tile-nameplate"></div>
                <button id="video-pause-4" class="video-tile-pause">Pause</button>
              </div>
              <div id="tile-5" class="video-tile">
                <video id="video-5" class="video-tile-video"></video>
                <div id="attendeeid-5" class="video-tile-attendeeid"></div>
                <div id="nameplate-5" class="video-tile-nameplate"></div>
                <button id="video-pause-5" class="video-tile-pause">Pause</button>
              </div>
              <div id="tile-6" class="video-tile">
                <video id="video-6" class="video-tile-video"></video>
                <div id="attendeeid-6" class="video-tile-attendeeid"></div>
                <div id="nameplate-6" class="video-tile-nameplate"></div>
                <button id="video-pause-6" class="video-tile-pause">Pause</button>
              </div>
              <div id="tile-7" class="video-tile">
                <video id="video-7" class="video-tile-video"></video>
                <div id="attendeeid-7" class="video-tile-attendeeid"></div>
                <div id="nameplate-7" class="video-tile-nameplate"></div>
                <button id="video-pause-7" class="video-tile-pause">Pause</button>
              </div>
              <div id="tile-8" class="video-tile">
                <video id="video-8" class="video-tile-video"></video>
                <div id="attendeeid-8" class="video-tile-attendeeid"></div>
                <div id="nameplate-8" class="video-tile-nameplate"></div>
                <button id="video-pause-8" class="video-tile-pause">Pause</button>
              </div>
              <div id="tile-9" class="video-tile">
                <video id="video-9" class="video-tile-video"></video>
                <div id="attendeeid-9" class="video-tile-attendeeid"></div>
                <div id="nameplate-9" class="video-tile-nameplate"></div>
                <button id="video-pause-9" class="video-tile-pause">Pause</button>
              </div>
              <div id="tile-10" class="video-tile">
                <video id="video-10" class="video-tile-video"></video>
                <div id="attendeeid-10" class="video-tile-attendeeid"></div>
                <div id="nameplate-10" class="video-tile-nameplate"></div>
                <button id="video-pause-10" class="video-tile-pause">Pause</button>
              </div>
              <div id="tile-11" class="video-tile">
                <video id="video-11" class="video-tile-video"></video>
                <div id="attendeeid-11" class="video-tile-attendeeid"></div>
                <div id="nameplate-11" class="video-tile-nameplate"></div>
                <button id="video-pause-11" class="video-tile-pause">Pause</button>
              </div>
              <div id="tile-12" class="video-tile">
                <video id="video-12" class="video-tile-video"></video>
                <div id="attendeeid-12" class="video-tile-attendeeid"></div>
                <div id="nameplate-12" class="video-tile-nameplate"></div>
                <button id="video-pause-12" class="video-tile-pause">Pause</button>
              </div>
              <div id="tile-13" class="video-tile">
                <video id="video-13" class="video-tile-video"></video>
                <div id="attendeeid-13" class="video-tile-attendeeid"></div>
                <div id="nameplate-13" class="video-tile-nameplate"></div>
                <button id="video-pause-13" class="video-tile-pause">Pause</button>
              </div>
              <div id="tile-14" class="video-tile">
                <video id="video-14" class="video-tile-video"></video>
                <div id="attendeeid-14" class="video-tile-attendeeid"></div>
                <div id="nameplate-14" class="video-tile-nameplate"></div>
                <button id="video-pause-14" class="video-tile-pause">Pause</button>
              </div>
              <div id="tile-15" class="video-tile">
                <video id="video-15" class="video-tile-video"></video>
                <div id="attendeeid-15" class="video-tile-attendeeid"></div>
                <div id="nameplate-15" class="video-tile-nameplate"></div>
                <button id="video-pause-15" class="video-tile-pause">Pause</button>
              </div>

              <div id="tile-16" class="video-tile">
                <video id="video-16" class="video-tile-video" @click="onClickVideo"></video>
                <div id="attendeeid-16" class="video-tile-attendeeid"></div>
                <div id="nameplate-16" class="video-tile-nameplate"></div>
                <button id="video-pause-16" class="video-tile-pause btn">Pause</button>
              </div>


              <pie-chart :data="chartData" :options="chartOptions"></pie-chart>

              <div id="tile-17" class="video-tile">
                <video id="video-17" class="video-tile-video"></video>
                <div id="nameplate-17" class="video-tile-nameplate"></div>
                <button id="video-pause-17" class="video-tile-pause btn">Pause</button>
              </div>
            </div>
          </div>
          <video id="content-share-video" crossOrigin="anonymous" style="display:none"></video>
        </div>
      </div>
    </div>

    <!-- Failure card if meeting cannot be joined -->

    <div id="flow-failed-join" class="flow">
      <div class="container">
        <form id="form-failed-join">
          <div class="card border-warning mb-3" style="max-width: 20rem;">
            <div id="failed-join" class="card-header"></div>
            <div class="card-body">
              <h4 class="card-title">Unable to join meeting</h4>
              <p class="card-text">There was an issue joining that meeting. Check your connectivity and try again.</p>
              <small id="failed-join-error" class="text-muted"></small>
            </div>
          </div>
          <button class="btn btn-lg btn-outline-warning btn-block" type="submit">OK</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import Vue from 'vue'
import {Capture } from './face_module/js/capture'
import {DemoMeetingApp} from './demomeeting'
import {collectedData} from "@/face_module/js/loader"
import PieChart from "@/router/PieChart";

export default Vue.extend({
  name: "VideoChat",
  components: {
    PieChart
  },
  data() {
    return {
      isToggle: false,
      chartOptions: {
        hoverBorderWidth: 20
      },
      chartData: {
        hoverBackgroundColor: "red",
        hoverBorderWidth: 10,
        labels: Array.from(collectedData.keys()),
        datasets: [
          {
            label: "Data One",
            backgroundColor: ["#41B883", "#E46651", "#00D8FF", "#41B883", "#E46651", "#00D8FF"],
            data: Array.from(collectedData.values()),
          }
        ]
      }
    }
  },
  methods: {
    onClickFaceApi() {
      let capture = new Capture(document.getElementById('video-16'))
      if (this.isToggle === false) {
        console.log('캡처 시작')
        capture.capture()
        this.isToggle = true
      } else {
        console.log('캡처 제거')
        capture.uncapture()
        this.isToggle = false
        capture = null
        console.log(collectedData)
        this.chartData.labels = Array.from(collectedData.keys())
        this.chartData.datasets[0].data =[1,2,3,4,5,6,7]
      }
    },
    onClickVideo() {
      if (event.target.mozRequestFullScreen) {
        event.target.mozRequestFullScreen();
      } else if (event.target.webkitRequestFullScreen) {
        event.target.webkitRequestFullScreen();
      }
    }
  },
  mounted() {
    new DemoMeetingApp()
  }
});

</script>

<style lang="scss">

canvas {
  position: absolute;
}

$white: #fff;
$gray-100: #f8f9fa;
$gray-200: #ecf0f1;
$gray-300: #dee2e6;
$gray-400: #ced4da;
$gray-500: #b4bcc2;
$gray-600: #95a5a6;
$gray-700: #7b8a8b;
$gray-800: #343a40;
$gray-900: #212529;
$black: #000;
$blue: #2c3e50;
$indigo: #6610f2;
$purple: #6f42c1;
$pink: #e83e8c;
$red: #e74c3c;
$orange: #fd7e14;
$yellow: #f39c12;
$green: #18bc9c;
$teal: #20c997;
$cyan: #3498db;
$primary: $blue;
$secondary: $gray-600;
$success: $green;
$info: $cyan;
$warning: $yellow;
$danger: $red;
$light: $gray-200;
$dark: $gray-700;
$yiq-contrasted-threshold: 175;
$link-color: $success;
$font-family-sans-serif: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
$font-size-base: 0.9375rem;
$h1-font-size: 3rem;
$h2-font-size: 2.5rem;
$h3-font-size: 2rem;
$table-accent-bg: $gray-200;
$dropdown-link-color: $gray-700;
$dropdown-link-hover-color: $white;
$dropdown-link-hover-bg: $primary;
$nav-link-padding-y: 0.5rem !default;
$nav-link-padding-x: 2rem;
$nav-link-disabled-color: $gray-600 !default;
$nav-tabs-border-color: $gray-200;
$navbar-padding-y: 1rem;
$navbar-dark-color: $white;
$navbar-dark-hover-color: $success;
$pagination-color: $white;
$pagination-bg: $success;
$pagination-border-width: 0;
$pagination-border-color: transparent;
$pagination-hover-color: $white;
$pagination-hover-bg: darken($success, 15%);
$pagination-hover-border-color: transparent;
$pagination-active-bg: $pagination-hover-bg;
$pagination-active-border-color: transparent;
$pagination-disabled-color: $gray-200;
$pagination-disabled-bg: lighten($success, 15%);
$pagination-disabled-border-color: transparent;
$progress-height: 0.625rem;
$progress-font-size: 0.625rem;
$list-group-hover-bg: $gray-200;
$list-group-disabled-bg: $gray-200;
$close-color: $white;
$close-text-shadow: none;
$overlay-z-index: 10;

@import 'node_modules/bootstrap/scss/bootstrap';

// Flatly 4.3.1
// Bootswatch

// Variables ===================================================================

// Navbar =======================================================================

.bg-primary {
  .navbar-nav .active > .nav-link {
    color: $success !important;
  }
}

.bg-dark {
  background-color: $success !important;

  &.navbar-dark .navbar-nav {
    .nav-link:focus,
    .nav-link:hover,
    .active > .nav-link {
      color: $primary !important;
    }
  }
}

// Buttons =====================================================================

.btn {
  &-secondary,
  &-secondary:hover,
  &-warning,
  &-warning:hover {
    color: #fff;
  }
}

// Typography ==================================================================

// Tables ======================================================================

.table {
  &-primary,
  &-secondary,
  &-success,
  &-info,
  &-warning,
  &-danger {
    color: #fff;
  }

  &-primary {
    &,
    > th,
    > td {
      background-color: $primary;
    }
  }

  &-secondary {
    &,
    > th,
    > td {
      background-color: $secondary;
    }
  }

  &-light {
    &,
    > th,
    > td {
      background-color: $light;
    }
  }

  &-dark {
    &,
    > th,
    > td {
      background-color: $dark;
    }
  }

  &-success {
    &,
    > th,
    > td {
      background-color: $success;
    }
  }

  &-info {
    &,
    > th,
    > td {
      background-color: $info;
    }
  }

  &-danger {
    &,
    > th,
    > td {
      background-color: $danger;
    }
  }

  &-warning {
    &,
    > th,
    > td {
      background-color: $warning;
    }
  }

  &-active {
    &,
    > th,
    > td {
      background-color: $table-active-bg;
    }
  }

  &-hover {
    .table-primary:hover {
      &,
      > th,
      > td {
        background-color: darken($primary, 5%);
      }
    }

    .table-secondary:hover {
      &,
      > th,
      > td {
        background-color: darken($secondary, 5%);
      }
    }

    .table-light:hover {
      &,
      > th,
      > td {
        background-color: darken($light, 5%);
      }
    }

    .table-dark:hover {
      &,
      > th,
      > td {
        background-color: darken($dark, 5%);
      }
    }

    .table-success:hover {
      &,
      > th,
      > td {
        background-color: darken($success, 5%);
      }
    }

    .table-info:hover {
      &,
      > th,
      > td {
        background-color: darken($info, 5%);
      }
    }

    .table-danger:hover {
      &,
      > th,
      > td {
        background-color: darken($danger, 5%);
      }
    }

    .table-warning:hover {
      &,
      > th,
      > td {
        background-color: darken($warning, 5%);
      }
    }

    .table-active:hover {
      &,
      > th,
      > td {
        background-color: $table-active-bg;
      }
    }
  }
}

// Forms =======================================================================

// Navs ========================================================================

.nav-tabs {
  .nav-link.active,
  .nav-link.active:focus,
  .nav-link.active:hover,
  .nav-item.open .nav-link,
  .nav-item.open .nav-link:focus,
  .nav-item.open .nav-link:hover {
    color: $primary;
  }
}

.pagination {
  a:hover {
    text-decoration: none;
  }
}

// Indicators ==================================================================

.close {
  text-decoration: none;
  opacity: 0.4;

  &:hover,
  &:focus {
    opacity: 1;
  }
}

.badge {
  &-secondary,
  &-warning {
    color: #fff;
  }
}

.alert {
  border: none;
  color: $white;

  a,
  .alert-link {
    color: #fff;
    text-decoration: underline;
  }

  @each $color, $value in $theme-colors {
    &-#{$color} {
      @if $enable-gradients {
        background: $value linear-gradient(180deg, mix($body-bg, $value, 15%), $value) repeat-x;
      } @else {
        background-color: $value;
      }
    }
  }

  &-light {
    &,
    & a,
    & .alert-link {
      color: $body-color;
    }
  }
}

// Progress bars ===============================================================

// Containers ==================================================================
.modal .close {
  color: $black;

  &:not(:disabled):not(.disabled):hover,
  &:not(:disabled):not(.disabled):focus {
    color: $black;
  }
}

// Custom

//html {
//  height: 100%;
//}
//
//body {
//  min-width: 320px;
//  height: 100%;
//  display: -ms-flexbox;
//  display: -webkit-box;
//  display: flex;
//  -ms-flex-align: center;
//  -ms-flex-pack: center;
//  -webkit-box-align: center;
//  align-items: center;
//  -webkit-box-pack: center;
//  justify-content: center;
//  background-color: #f5f5f5;
//}

svg {
  width: 20px;
  height: 20px;
  fill: lighten($secondary, 15%);
}

.svg-active {
  fill: $white;
}

.svg-inactive {
  fill: lighten($secondary, 15%);
}

.flow {
  display: none;
}

.hidden {
  display: none;
}

.progress-hidden {
  visibility: hidden;
}

#flow-meeting {
  min-width: 320px;
}

@media (max-width: 575px) {
  #tile-area {
    display: flex;
    flex-wrap: wrap;
  }

  #tile-area > div {
    position: relative !important;
    top: auto !important;
    right: auto !important;
    bottom: auto !important;
    left: auto !important;
    height: auto !important;
  }

  #tile-area > div.video-tile {
    width: 50% !important;
    padding-bottom: 33% !important;
  }

  #tile-area > div.content-share-tile {
    order: -1;
    width: 100% !important;
    padding-bottom: 66% !important;
    margin-bottom: 2rem;
  }

  #tile-area > div > video {
    object-fit: cover;
  }

  #tile-area > div > div,
  #tile-area > div > button {
    display: none !important;
  }

  #content-share-video {
    display: none !important;
  }

  #meeting-container {
    height: auto !important;
  }

  #roster-tile-container {
    height: auto !important;
  }

  #roster-message-container {
    height: auto !important;
  }

  #tile-container {
    height: auto !important;
  }

  .bs-component {
    max-height: 210px;
    height: auto !important;
  }

  .message {
    max-height: 210px;
    height: 210px !important;
  }

  .video-preview {
    width: auto;
    height: 82px;
    margin-left: 35%;
    margin-top: 7px;
  }
}

.video-preview {
  width: 100%;
  height: 82px;
  margin-left: 0;
  margin-top: 0;
}

.markdown {
  margin-top: 0;
  margin-bottom: 0;
}

a.markdown:link {
  color: rgb(39, 137, 144);
}

a.markdown:visited {
  color: rgb(39, 137, 144);
}

a.markdown:hover {
  color: rgb(39, 137, 144);
}

a.markdown:active {
  color: rgb(39, 137, 144);
}

.message-bubble-self {
  border-radius: 5px;
  background-color: rgb(238, 248, 248);
  border-width: 1px;
  border-style: solid;
  border-color: rgb(134, 209, 215);
  padding: 0.3rem;
  margin-left: 1rem;
  margin-right: 1rem;
  margin-top: 0rem;
  margin-bottom: 0.5rem;
}

.message-bubble-other {
  border-radius: 5px;
  background-color: rgb(241, 241, 241);
  border-style: none;
  padding: 0.3rem;
  margin-left: 1rem;
  margin-right: 1rem;
  margin-top: 0rem;
  margin-bottom: 0.5rem;
}

.message-bubble-sender {
  font-weight: bold;
  margin-left: 1.3rem;
  margin-right: 1rem;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}

.v-grid {
  display: grid;
  height: 100%;
  width: 100%;
}

.v-grid.size-1 {
  grid-template: 1fr / 1fr;

  .video-tile {
    height: 0;
    padding-bottom: calc(100% / (16 / 9));
  }
}

.v-grid.size-2 {
  grid-template: repeat(2, 1fr) / repeat(2, 1fr);
}

.v-grid.size-3,
.v-grid.size-4 {
  grid-template: repeat(2, 1fr) / repeat(2, 1fr);
}

.v-grid.size-5,
.v-grid.size-6 {
  grid-template: repeat(3, 1fr) / repeat(2, 1fr);
}

.v-grid.size-7,
.v-grid.size-8 {
  grid-template: repeat(4, 1fr) / repeat(2, 1fr);
}

.v-grid.size-9,
.v-grid.size-10 {
  grid-template: repeat(4, 1fr) / repeat(3, 1fr);
}

.v-grid.size-11,
.v-grid.size-12 {
  grid-template: repeat(4, 1fr) / repeat(3, 1fr);
}

.v-grid.size-13,
.v-grid.size-14,
.v-grid.size-15,
.v-grid.size-16 {
  grid-template: repeat(4, 1fr) / repeat(4, 1fr);
}

.v-grid.featured {
  grid-template: 1fr / 1fr;
  grid-template-areas: 'ft';
}

.v-grid.featured.size-2,
.v-grid.featured.size-3 {
  grid-template: repeat(4, 1fr) / repeat(2, 1fr);
  grid-template-areas: 'ft ft' 'ft ft' 'ft ft';
}

.v-grid.featured.size-4 {
  grid-template: repeat(4, 1fr) / repeat(3, 1fr);
  grid-template-areas:
    'ft ft ft'
    'ft ft ft'
    'ft ft ft';
}

.v-grid.featured.size-5,
.v-grid.featured.size-6,
.v-grid.featured.size-7 {
  grid-template: repeat(6, 1fr) / repeat(3, 1fr);
  grid-template-areas:
    'ft ft ft'
    'ft ft ft'
    'ft ft ft'
    'ft ft ft';
}

.v-grid.featured.size-8,
.v-grid.featured.size-9 {
  grid-template: repeat(6, 1fr) / repeat(4, 1fr);
  grid-template-areas:
    'ft ft ft ft'
    'ft ft ft ft'
    'ft ft ft ft'
    'ft ft ft ft';
}

.v-grid.featured.size-10,
.v-grid.featured.size-11,
.v-grid.featured.size-12,
.v-grid.featured.size-13 {
  grid-template: repeat(7, 1fr) / repeat(6, 1fr);
  grid-template-areas:
    'ft ft ft ft ft ft'
    'ft ft ft ft ft ft'
    'ft ft ft ft ft ft'
    'ft ft ft ft ft ft'
    'ft ft ft ft ft ft';
}

.v-grid.featured.size-14,
.v-grid.featured.size-15,
.v-grid.featured.size-16,
.v-grid.featured.size-17 {
  grid-template: repeat(7, 1fr) / repeat(8, 1fr);
  grid-template-areas:
    'ft ft ft ft ft ft ft ft'
    'ft ft ft ft ft ft ft ft'
    'ft ft ft ft ft ft ft ft'
    'ft ft ft ft ft ft ft ft'
    'ft ft ft ft ft ft ft ft';
}

@media screen and (max-width: 1200px) {
  .v-grid.size-2 {
    grid-template: repeat(2, 1fr) / 1fr;
  }

  .v-grid.size-3 {
    grid-template: repeat(3, 1fr) / 1fr;
  }

  .v-grid.size-4 {
    grid-template: repeat(4, 1fr) / 1fr;
  }

  .v-grid.size-5,
  .v-grid.size-6,
  .v-grid.size-7,
  .v-grid.size-8 {
    grid-template: repeat(4, 1fr) / repeat(2, 1fr);
  }

  .v-grid.size-9,
  .v-grid.size-10,
  .v-grid.size-11,
  .v-grid.size-12 {
    grid-template: repeat(6, 1fr) / repeat(2, 1fr);
  }

  .v-grid.size-13,
  .v-grid.size-14,
  .v-grid.size-15,
  .v-grid.size-16 {
    grid-template: repeat(8, 1fr) / repeat(2, 1fr);
  }

  .v-grid.featured.size-1 {
    grid-template: 1fr / 1fr;
    grid-template-areas: 'ft';
  }

  .v-grid.featured.size-2,
  .v-grid.featured.size-3,
  .v-grid.featured.size-4,
  .v-grid.featured.size-5 {
    grid-template: repeat(4, 1fr) / repeat(2, 1fr);
    grid-template-areas:
      'ft ft'
      'ft ft';
  }

  .v-grid.featured.size-6,
  .v-grid.featured.size-7 {
    grid-template: repeat(4, 1fr) / repeat(3, 1fr);
    grid-template-areas:
      'ft ft ft'
      'ft ft ft';
  }

  .v-grid.featured.size-8,
  .v-grid.featured.size-9 {
    grid-template: repeat(6, 1fr) / repeat(4, 1fr);
    grid-template-areas:
      'ft ft ft ft ft'
      'ft ft ft ft ft'
      'ft ft ft ft ft'
      'ft ft ft ft ft';
  }

  .v-grid.featured.size-10,
  .v-grid.featured.size-11,
  .v-grid.featured.size-12,
  .v-grid.featured.size-13 {
    grid-template: repeat(8, 1fr) / repeat(4, 1fr);
    grid-template-areas:
      'ft ft ft ft ft'
      'ft ft ft ft ft'
      'ft ft ft ft ft'
      'ft ft ft ft ft'
      'ft ft ft ft ft';
  }

  .v-grid.featured.size-12,
  .v-grid.featured.size-13,
  .v-grid.featured.size-14,
  .v-grid.featured.size-15,
  .v-grid.featured.size-16,
  .v-grid.featured.size-17 {
    grid-template: repeat(8, 1fr) / repeat(4, 1fr);
    grid-template-areas:
      'ft ft ft ft'
      'ft ft ft ft'
      'ft ft ft ft'
      'ft ft ft ft';
  }
}

.video-tile {
  position: relative;
  display: none;
  font-size: 18px;
  overflow: hidden;
}

.video-tile.active {
  display: block;
}

.video-tile.featured {
  grid-area: ft;
}

.video-tile.content {
  grid-area: ft;

  .video-tile-video {
    object-fit: contain !important;
    background-color: #313030;
  }
}

.video-tile.primary {
  border: 5px solid pink;
}

.video-tile-video {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.video-tile-nameplate {
  position: absolute;
  bottom: 10px;
  left: 10px;
  color: #fff;
  text-shadow: 0px 0px 5px black;
  letter-spacing: 0.1em;
}

.video-tile-pause {
  position: absolute;
  display: inline-block;
  bottom: 10px;
  right: 10px;
  margin: 0;
  padding: 0;
  border: none;
  color: #fff;
  text-shadow: 0px 0px 5px black;
  letter-spacing: 0.1em;
  outline: none;
  background: none;
}

.stats-info {
  position: absolute;
  background-color: rgba($color: #000000, $alpha: 0.5);
  color: white;
  font-size: 10px;
  bottom: 3rem;
  left: 0;
  z-index: $overlay-z-index;
  padding: 0.5rem;
  transition: display 0.5s;
  display: none;

  .stats-table {
    width: 15rem;

    & tr:first-child {
      border-bottom: 1px dotted $white;
    }
  }
}

#tile-area video[id^='video-']:hover + .stats-info {
  display: block;
}

.video-tile-attendeeid {
  display: none;
  position: absolute;
  color: $white;
  padding: 1rem;
}

.video-tile.active:hover .video-tile-attendeeid {
  display: block;
}

.vf-active::before {
  content: "✓ "
}

</style>
