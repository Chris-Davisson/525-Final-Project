
// Module is the global object created by Emscripten when it compiles the C code to WASM.
var Module = {
  onRuntimeInitialized() {
    console.log('WASM loaded correctly');

    document.getElementById('cpu7').onclick = () => {
      console.log('Hogging CPU for 30 sec');
      Module.ccall(
        'cpu_hog_for_seconds',
        null,
        ['number'],
        [7]
      );
    };

    document.getElementById('mem').onclick = () => {
      console.log('Attempting to hog memory');
      Module.ccall(
        'memory_hog', 
        null, 
        ['number'], 
        [512]);
    };
  },
  locateFile: f => f
};

window.onload = function() {
document.getElementById('network').onclick = () => {
    console.log('Hogging network for 7 seconds');
    const endTime = Date.now() + 7000;
    const hog = () => {
    if (Date.now() < endTime) {
      fetch('pexels-pixabay-2150.jpg?cache=' + Date.now(), {cache: 'no-store'})
        .then(() => hog())
        .catch(console.error);
    } else {
      console.log('Network hog complete.');
    }
  };

  hog();
};

}

