class ClockCard extends Polymer.Element {
  
  static get template() {
    return Polymer.html`
      <style>
        :host {
          cursor: pointer;
        }
        .content {
          padding: 24px 16px;
          display: flex;
          align-items: flex-end;
        }
        .clock {
          flex-grow: 1;
        }
        #myself{
          width: 60px;
          height: 60px;
          border-radius: 5px;
          background-size: cover;
        }
        .time {
          font-family: var(--paper-font-headline_-_font-family);
          -webkit-font-smoothing: var(--paper-font-headline_-_-webkit-font-smoothing);
          font-size: 3em;
          font-weight: var(--paper-font-headline_-_font-weight);
          letter-spacing: var(--paper-font-headline_-_letter-spacing);
          line-height: 1em;
          text-rendering: var(--paper-font-common-expensive-kerning_-_text-rendering);
        }
        .date {
          color: var(--accent-color);
          font-family: var(--paper-font-headline_-_font-family);
          -webkit-font-smoothing: var(--paper-font-headline_-_-webkit-font-smoothing);
          font-size: 1.3em;
          font-weight: var(--paper-font-headline_-_font-weight);
          letter-spacing: var(--paper-font-headline_-_letter-spacing);
          line-height: var(--paper-font-headline_-_line-height);
          text-rendering: var(--paper-font-common-expensive-kerning_-_text-rendering);
        }
      </style>
      <ha-card>
        <div class="content">
          <div class="clock">
            <div class="time" id="time">3:45 PM</div>
            <div class="date" id="date">Wednesday, December 3</div>
          </div>
          <div id="myself"></div>
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
    this.myself = this.$.myself;
    this.time = this.$.time;
    this.date = this.$.date;
    
    this.$.myself.style.backgroundImage = `url("${this._hass.states[this.config.entity].attributes.entity_picture}")`;

    this._updateTime();
    setInterval(() => this._updateTime(), 2000);  // accurate enough for me
  }
    
  setConfig(config) {
    this.config = config;
  }
    
  set hass(hass) {
    this._hass = hass;
  }
  
  _updateTime(force = false) {
    const entityId = this.config.entity;
    const state = this._hass.states[entityId];
    // this.myself.innerHTML = state.state;

    this.time.innerHTML = new Intl.DateTimeFormat('default', {
      hour: 'numeric',
      minute: 'numeric'
    }).format(new Date());
    this.date.innerHTML = new Intl.DateTimeFormat('default', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(new Date());
  }
  
  getCardSize() {
    return 1;
  }
}
  
customElements.define('clock-card', ClockCard);
