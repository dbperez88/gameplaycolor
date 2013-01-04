
function cout(message, level) {
  console.log(message);
}

(function($) {

  App.GameBoy = function(store, library) {
    this.init(store, library);
  };

  App.GameBoy.Settings = {
    ENABLE_SOUND:           0, // (defaults to true)
    ENABLE_GBC_BIOS:        1, // Boot with boot rom first (defaults to true)
    DISABLE_COLORS:         2, // Priority to game boy mode (defaults to false)
    VOLUME_LEVEL:           3, // Volume (defaults to 1)
    ENABLE_COLORIZATION:    4, // Colorize the game boy mode (defaults to true)
    TYPED_ARRAYS_DISALLOW:  5, // Disallow typed arrays (defaults to false)
    EMULATOR_LOOP_INTERVAL: 6, // Interval for the emulator loop (defaults to 4)
    AUDIO_BUFFER_MIN_SPAN:  7, // (defaults to 15)
    AUDIO_BUFFER_MAX_SPAN:  8, // (defaults to 30)
    ROM_ONLY_OVERRIDE:      9, // Override to allow for MBC1 instead of ROM only (defaults to false)
    MBC_ENABLE_OVERRIDE:    10, // Override MBC RAM disabling and always allow reading and writing to the banks (defaults to false)
    GB_BOOT_ROM_UTILIZED:   11, // Use the GameBoy boot ROM instead of the GameBoy Color boot ROM (defaults to false)
    SOFTWARE_RESIZING:      12, // Scale the canvas in JS, or let the browser scale the canvas (defaults to false)
    RESIZE_SMOOTHING:       13, // Use image smoothing based scaling (defaults to true)
  }

  App.GameBoy.State = {
    IDLE: 0,
    LOADING: 1,
    RUNNING: 2,
    ERROR: 3,
  };

  jQuery.extend(App.GameBoy.prototype, {
        
    init: function(store, library) {
      var self = this;
      self.store = store;
      self.library = library;
      self.state = App.GameBoy.State.IDLE;
      self.stateChangeCallbacks = [];

      settings[App.GameBoy.Settings.ENABLE_SOUND] = true;
      settings[App.GameBoy.Settings.SOFTWARE_RESIZING] = false;
      settings[App.GameBoy.Settings.ENABLE_COLORIZATION] = false;
      settings[App.GameBoy.Settings.RESIZE_SMOOTHING] = false;
      settings[App.GameBoy.Settings.EMULATOR_LOOP_INTERVAL] = 12;
    },

    onStateChange: function(callback) {
      var self = this;
      self.stateChangeCallbacks.push(callback);
    },

    setState: function(state) {
      var self = this;
      if (self.state !== state) {
        self.state = state;

        // Fire the state change callbacks.
        for (var i = 0; i < self.stateChangeCallbacks.length; i++) {
          var callback = self.stateChangeCallbacks[i];
          callback(state);
        }
      }
    },

    pause: function() {
      var self = this;
      pause();
    },

    run: function() {
      var self = this;
      // Do not attempt to run unless we have been in the running state.
      if (self.state === App.GameBoy.State.RUNNING) {
        run();
      }
    },

    keyDown: function(keycode) {
      var self = this;
      GameBoyKeyDown(keycode);
    },

    keyUp: function(keycode) {
      var self = this;
      GameBoyKeyUp(keycode);
    },

    load: function(identifier) {
      var self = this;

      self.setState(App.GameBoy.State.LOADING);

      // Store the name of the file we're playing.
      window.app.store.setProperty(App.Store.Property.GAME, identifier);

      // Fetch the file.
      var file = self.library.fetch(identifier, function(data) {
        self.insertCartridge(data);
        self.setState(App.GameBoy.State.RUNNING);
      });

    },

    insertCartridge: function(data) {
      var self = this;
      // gb_Insert_Cartridge_Data(data, true);
      start(document.getElementById('LCD'), data);
      self.setState(App.GameBoy.State.RUNNING);
    }

  });

})(jQuery);

Gameboy = {};

Gameboy.Key = {
  START: "start",
  SELECT: "select",
  A: "a",
  B: "b",
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
};
