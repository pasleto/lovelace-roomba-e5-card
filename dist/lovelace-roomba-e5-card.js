((LitElement) => {
  const html = LitElement.prototype.html;
  const css = LitElement.prototype.css;

  class LovelaceRoomba5Card extends LitElement {

      static get properties() {
          return {
              _hass: {},
              _config: {},
              stateObj: {},
              state: {},
              style: {}
          }
      }

      static get styles() {
          return css`
      .background {
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
      }
      .title-left {
        font-size: 20px;
        padding: 16px 16px 4px 16px;
        text-align: left;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: var(--primary-text-color);
        text-shadow: none;
        font-weight: 700;
      }
      .content {
        cursor: pointer;
        color: var(--primary-text-color);
        text-shadow: none;
      }
      .flex {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        color: var(--primary-text-color);
        text-shadow: none;
      }
      .button {
        cursor: pointer;
        padding: 16px;
      }
      .button:hover {
        font-weight: 600;
      }
      .button-blank {
        cursor: pointer;
        padding: 28px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(2, auto);
      }
      .grid-content {
        display: grid;
        align-content: space-between;
        grid-row-gap: 6px;
      }
      .grid-left {
        text-align: left;
        font-size: 110%;
        padding-left: 10px;
        border-left: 2px solid var(--primary-color);
      }
      .grid-right {
        text-align: right;
        font-size: 110%;
        padding-right: 10px;
        border-right: 2px solid var(--primary-color);
      }
      .tabactive {
        display: grid;
      }
      .tabpassive {
        display: none;
      }
      .totals {
        border-right: 2px solid var(--primary-color)
      }
      .job {
        border-right: 2px solid var(--accent-color)
      }`;
      }

      render() {
          return html`
          <ha-card .hass="${this._hass}" .config="${this._config}" class="background" style="${this.style.background}">
            ${this.state.showTitle ?
            html`<div>
              ${this.state.name ?
              html`<div class="title-left" style="${this.style.text}" @click="${() => this.fireEvent('hass-more-info')}">${this.state.name}</div>` : html`<div class="title-left" style="${this.style.text}" @click="${() => this.fireEvent('hass-more-info')}"></div>`}
            </div>` : null }
            ${this.state.showLabels ? html`
            <div class="content grid" style="${this.style.content + this.style.text}" >
              <div class="grid-content grid-left" @click="${() => this.fireEvent('hass-more-info')}">
                <div>${this.getState('status')}</div>
                <div>${this.getValue('mode')}</div>
                <div>${this.getValue('battery')}</div>
                <div>${this.getValue('bin')}</div>
              </div>
              <div id="total" class="${this.state.hideRightGrid ? "grid-content " : "grid-content grid-right totals"} ${this.state.defaultTotals ? "tabactive" : "tabpassive"}" @click="${() => this.tabSwap('last')}">
              ${this.state.showTotals ? html`
                <div style="font-weight: 600;">${this.getValue('total_header')}</div>
                <div>${this.getValue('total_time')}</div>
                <div>${this.getValue('total_jobs')}</div>
                <div>${this.getValue('dirt_events')}</div>
                <div>${null}</div>` : null}
              </div>
              <div id="last" class="${this.state.hideRightGrid ? "grid-content " : "grid-content grid-right job"} ${this.state.defaultTotals ? "tabpassive" : "tabactive"}" @click="${() => this.tabSwap('total')}">
              ${this.state.showJob ? html`
                <div style="font-weight: 600;">${this.getValue('job_header')}</div>
                <div>${this.getValue('job_initiator')}</div>
                <div>${this.getValue('job_time')}</div>
                <div>${this.getValue('battery')}</div>
                <div>${null}</div>` : null}
              </div>
            </div>` : null}
            ${this.state.showButtons ? html`
            <div class="flex" style="${this.style.text}">
              ${Object.keys(this.state.buttons).map(this.renderButton.bind(this))}
            </div>` : null}
          </ha-card>`;
      }

      renderButton(key) {
          if (((key == "stop") && (this.stateObj.state == this.state.vac_states.ready)) || (this.stateObj.state == this.state.vac_states.pending) || (this.stateObj.state == this.state.vac_states.empty)) {
            return this.state.buttons[key]
            ? html`<div class="button-blank" style="cursor:default" @click="${() => this.tabSwap('total')}"></div>`
            : null;
          } else if (key != "blank") {
              if(this.getButton(key,"icon") !== ''){
                return this.state.buttons[key]
                  ? html`<div class="button" @tap="${() => this.callService(key)}"><ha-icon style="padding-right: 5px" icon="${this.getButton(key,"icon")}"></ha-icon>  ${this.getButton(key,"label")}</div>`
                  : null;
              } else {
                return null;
              }
          } else {
            return this.state.buttons[key]
              ? html`<div class="button" style="cursor:default" @click="${() => this.tabSwap('total')}"></div>`  
              : null;
          }
      }

      getValue(field) {
          if((this.state.attributes[field] === 'bin_missing') || (this.state.attributes[field] === 'full_clean') || (this.state.attributes[field] === 'resume_clean') || (this.state.attributes[field] === 'pause_clean') || (this.state.attributes[field] === 'stop_clean') || (this.state.attributes[field] === 'dock')){
            return `${this.state.labels[field]}`;
          }
          if((this.state.attributes[field] === 'total_header') || (this.state.attributes[field] === 'job_header')){
            return `${this.state.labels[field]}:`;
          }
          if ((this.state.attributes[field] === 'bin')) {
            const bin_check = this.state.attributes.bin_present;
            const value = (this.stateObj && this.state.attributes[bin_check] in this.stateObj.attributes)
              ? this.stateObj.attributes[this.state.attributes[bin_check]]
              : (this._hass ? this._hass.localize('state.default.unavailable') : 'Unavailable');
            if (value === 'No') {
              return `${this.state.labels[field]}: ${this.getValue('bin_missing')}`;
            };
          };
          const value = (this.stateObj && this.state.attributes[field] in this.stateObj.attributes)
              ? this.stateObj.attributes[this.state.attributes[field]]
              : (this._hass ? this._hass.localize('state.default.unavailable') : 'Unavailable');
          return `${this.state.labels[field]}: ${value}`;
      };

      getState(field) {
        const value = this.stateObj.state;
        if (this.state.autoSwitch) {
          if (value !== this.state.vac_states.ready ? this.tabSwap('last') : this.tabSwap('total'));
        }
        return `${this.state.labels[field]}: ${value}`;
      };

      getButton(index, field) {
        switch(index) {
          case "startstop":
            if (this.stateObj.state === this.state.vac_states.ready) {
              // Full Clean
              switch(field) {
                case "label":
                  return `${this.getValue('full_clean')}`;
                case "icon":
                  return `mdi:play-circle`;
                case "action":
                  return `start`;
              }
            } else if ((this.stateObj.attributes['phase'] === this.state.vac_states.paused) || (this.stateObj.attributes['phase'] === this.state.vac_states.stuck) || (this.stateObj.attributes['phase'] === this.state.vac_states.charge)) {
              // Resume
              switch(field) {
                case "label":
                  return `${this.getValue('resume_clean')}`;
                case "icon":
                  return `mdi:play`;
                case "action":
                    return `resume`;
              }
            } else {
              // Pause
              switch(field) {
                case "label":
                  return `${this.getValue('pause_clean')}`;
                case "icon":
                  return `mdi:pause`;
                case "action":
                    return `pause`;
              }
            }
          case "dock":
            if ((this.stateObj.attributes['phase'] === this.state.vac_states.charge) || (this.stateObj.attributes['phase'] === this.state.vac_states.idle)) {
              // Resume
              switch(field) {
                case "label":
                  return ``;
                case "icon":
                  return ``;
                case "action":
                    return ``;
              }
            } else {
              // Pause
              switch(field) {
                case "label":
                  return `${this.getValue('dock')}`;
                case "icon":
                  return `mdi:home-minus`;
                case "action":
                    return `dock`;
              }
            }
          case "stop":
            // Stop
            if (this.stateObj.state === this.state.vac_states.ready) {
              // Blank
              switch(field) {
                case "label":
                  return ``;
                case "icon":
                  return ``;
                case "action":
                  return ``;
              }
            } else {
              // Stop
              switch(field) {
                case "label":
                  return `${this.getValue('stop_clean')}`;
                case "icon":
                  return `mdi:stop`;
                case "action":
                    return `stop`;
              }
            }
        }       
      };

      tabSwap(tab) {
        // Swap Tabs
        switch(tab) {
          case "last":
            if (!this.state.showJob) { return; }
            var tabLast = this.shadowRoot.getElementById("total");
            if (tabLast !== null) { tabLast.style.display = "none" };
            var tabTotal = this.shadowRoot.getElementById("last");
            if (tabTotal !== null) { tabTotal.style.display = "grid" };
            break;
          case "total":
            if (!this.state.showTotals) { return; }
            var tabLast = this.shadowRoot.getElementById("last");
            if (tabLast !== null) { tabLast.style.display = "none" };
            var tabTotal = this.shadowRoot.getElementById("total");
            if (tabTotal !== null) { tabTotal.style.display = "grid" };
        }
      };

      callService(service) {
          this._hass.callService('rest_command', 'vacuum_action', {command: this.getButton(service,"action")});
      }

      fireEvent(type, options = {}) {
          const event = new Event(type, {
              bubbles: options.bubbles || true,
              cancelable: options.cancelable || true,
              composed: options.composed || true,
          });
          event.detail = {entityId: this.stateObj.entity_id};
          this.dispatchEvent(event);
      }

      getCardSize() {
          if (this.state.name && this.state.showButtons) return 5;
          if (this.state.name || this.state.showButtons) return 4;
          return 3;
      }

      setConfig(config) {
          const labels = {
              status: 'Status',
              mode: 'Mode',
              battery: 'Battery',
              bin: 'Bin',
              total_time: 'Time',
              total_jobs: 'Jobs',
              dirt_events: 'Dirts',
              job_initiator: 'Source',
              job_time: 'Time',
              total_header: 'Total',
              job_header: 'Job',
              full_clean: 'Full Clean',
              resume_clean: 'Resume',
              pause_clean: 'Pause',
              stop_clean: 'Stop',
              dock: 'Dock',
              bin_missing: 'Missing!'
          };

          const vac_states = {
            ready: 'Ready',
            stuck: 'Stuck',
            pending: 'Pending',
            charge: 'Charge',
            idle: 'Idle',
            empty: 'Empty',
            paused: 'Paused'
          };

          const attributes = {
              status: 'state',
              battery: 'battery',
              mode: 'phase',
              bin: 'bin',
              bin_present: 'bin_present',
              total_time: 'total_time',
              total_jobs: 'total_jobs',
              dirt_events: 'dirt_events',
              job_initiator: 'job_initiator',
              job_time: 'job_time',
              total_header: 'total_header',
              job_header: 'job_header',
              full_clean: 'full_clean',
              resume_clean: 'resume_clean',
              pause_clean: 'pause_clean',
              stop_clean: 'stop_clean',
              dock: 'dock',
              bin_missing: 'bin_missing'
          };

          const buttons = {
              startstop: true,
              blank: false,
              stop: false,
              dock: true,
          };

          if (!config.entity) throw new Error('Please define an entity.');
          if (config.entity.split('.')[0] !== 'sensor') throw new Error('Please define a sensor entity.');

          this.state = {
              showTotals: config.totals !== false,
              showJob: config.job !== false,
              showButtons: config.buttons !== false,
              showLabels: config.labels !== false,
              showName: config.name !== false,
              showTitle: config.name !== false,
              defaultTotals: config.defaultjob !== true ? (config.totals !== false ? true : false) : (config.job !== false ? false : true), 
              hideRightGrid: (config.totals === false && config.job === false),
              autoSwitch: config.autoswitch !== false,

              buttons: Object.assign({}, buttons, config.buttons),
              attributes: Object.assign({}, attributes, config.attributes),
              vac_states: Object.assign({}, vac_states, config.vac_states),
              labels: Object.assign({}, labels, config.labels),
          };

          this.style = {
              text: `cursor: pointer;`,
              content: `padding: ${config.showButtons ? '16px 16px 4px' : '16px'};`,
              background: config.image !== false ? `background-image: url('${config.image || '/hacsfiles/lovelace-roomba-e5-card/vacuum.png'}')` : ''
          };

          this._config = config;
      }

      set hass(hass) {
          this._hass = hass;

          if (hass && this._config) {
              this.stateObj = this._config.entity in hass.states ? hass.states[this._config.entity] : null;

              if (this.stateObj && this.state.showName) {
                  this.state.name = this._config.name || this.stateObj.attributes.friendly_name;
              }
          }
      }
  }

  customElements.define('lovelace-roomba-e5-card', LovelaceRoomba5Card);
})(window.LitElement || Object.getPrototypeOf(customElements.get("hui-view")));