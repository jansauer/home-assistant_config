class DayTimeCard extends Polymer.Element {
  
  static get template() {
    return Polymer.html`
      <style>
        @keyframes planetRotate {
          0%{
            background-position: 0% center;
          }
          100%{
            background-position: -200% center;
          }
        }
        :host {
          cursor: pointer;
        }
        .content {
          padding: 24px 16px 0;
          height: 114px;
          display: flex;
          overflow: hidden;
        }
        .sun-atmosphere {
          position: relative;
          height: 90px;
          width: 90px;
          flex-shrink: 0;
          background: url(/local/sun.jpg);
          background-size: cover;
          animation: planetRotate 1200s linear infinite;
          box-shadow:  0px 0px 10px 0px #cc9f4c, 0px 0px 1000px -2px #cc9f4c;
          border-radius: 100%;
          overflow: hidden;
        }
        .sun-surface {
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 65%);

        }
        .moon {
          height: 90px;
          width: 90px;
          background: url(/local/moon.png);
          background-size: cover;
          box-shadow: 0px 0px 10px 0px var(--sun-color), 0px 0px 1000px -2px var(--sun-color);
          box-shadow: inset 10px 0px 12px -2px rgba(255, 255, 255, 0.2), inset -70px 0px 50px 0px black, -5px 0px 10px -4px var(--sun-color);
          border-radius: 50px;
          overflow: hidden;
        }
        .text {
          margin-left: 16px;
          font-size: 14px;
          color: var(--secondary-text-color);
        }
      </style>
      <ha-card>
        <div class="content">
          <div class="sun-atmosphere" id="sun">
            <div class="sun-surface"></div>
          </div>
          <div class="moon" id="moon">
            <div class="phase"></div>
          </div>
          <div class="text">
            <div class="header">
              Sunset in <span id="sunset"></span>
            </div>
            <br />
            <div class="header">
              Dusk in <span id="sunset"></span>
            </div>
            <br />
            Azimuth: <span id="azimuth"></span>° Elevation: <span id="elevation"></span>°
          </div>
        </div>
      </ha-card>     
    `
  }
    
  static get properties() {
    return {
      _hass: Object
    }
  }
    
  ready() {
    super.ready();      
    this._updateTime();
    setInterval(() => this._updateTime(), 60000); // 1000 * 60sec => 1min
  }
    
  setConfig(config) {
    this.config = config;
  }
    
  set hass(hass) {
    this._hass = hass;
  }
  
  _updateTime(force = false) {
    const sun = this._hass.states['sun.sun'];

    // switch between displaying sun and moon
    const sun_elevation = sun.attributes.elevation
    if (sun_elevation > 0) {
      this.$.moon.style.display = 'none';

      if (sun_elevation < this.getDecentStartAt()) {
        console.log((this.getDecentStartAt() - sun_elevation) * this.getPixelPerDegree() + 'px');
        this.$.sun.style.marginTop = (this.getDecentStartAt() - sun_elevation) * this.getPixelPerDegree() + 'px';
      } else {
        console.log('noo');
        console.log( this.getDecentStartAt());
      }   
    } else {
      this.$.sun.style.display = 'none';
      this.$.moon.classList.add(this._hass.states['sensor.moon'].state);
    }

    //this.$.sunset.innerHTML = moment(state.attributes.next_setting).fromNow();
    //this.$.dusk.innerHTML = moment(state.attributes.next_dusk).fromNow();

    // azimuth
    this.$.azimuth.innerHTML = Math.abs(sun.attributes.azimuth);
    // elevation
    this.$.elevation.innerHTML = Math.abs(sun.attributes.elevation);
  }

  /**
   * Numer of pixels to move the sun down per degree above the horizon
   * 
   * sun height: 90px
   * degrees for the sun to be above horizon: 23°
   * => 90px / 23°
   */
  getPixelPerDegree() {
    return 90/23;
  }

  /**
   * Degrees of the sun above the horizon at which we start moving it down
   * 
   * sun height: 90px
   * card padding: 24px
   * => (90px + 24px) / (90px / 23°)
   */
  getDecentStartAt() {
    return 114 / this.getPixelPerDegree();
  }
  
  getCardSize() {
    return 2;
  }
}
  
customElements.define('daytime-card', DayTimeCard);

/*
attributes:
  azimuth: 274.75
  elevation: 10.53
  friendly_name: "Sun"
  next_setting:   "2019-04-18T18:23:39+00:00"
  next_dusk:      "2019-04-18T19:00:22+00:00"
  
  next_midnight:  "2019-04-18T23:20:17+00:00"
  
  next_dawn:      "2019-04-19T03:38:29+00:00"
  next_rising:    "2019-04-19T04:15:22+00:00"
  next_noon:      "2019-04-19T11:20:23+00:00"
 */
