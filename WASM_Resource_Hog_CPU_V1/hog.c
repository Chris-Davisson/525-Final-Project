#include <stdlib.h>
#include <string.h>
#include <emscripten/emscripten.h>

static unsigned char *persistent_memory[MAX_MEMORY_MB] = {0};

// CPU HOG: floating-point math loop
void cpu_hog_for_seconds(double seconds) {
    double start = emscripten_get_now();
    volatile double x = 0.0001;
    // makeshift timer, it jsut does floating-point math for seconds
    while ((emscripten_get_now() - start) < seconds * 1000.0) {
        x += x * 1.0000001;
    }
}

EMSCRIPTEN_KEEPALIVE
void memory_hog(int megabytes) {
  for (int i = 0; i < megabytes; ++i) {
    if (!persistent_memory[i]) {
      persistent_memory[i] = (unsigned char*)malloc(1024*1024);
      if (!persistent_memory[i]) return;
      memset(persistent_memory[i], 0xFF, 1024*1024);
    }
  }
}


// https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/C_to_Wasm


/*
Failed memory hog, Keep seeing it in gpu memory... idk why
I think its because I was letting the memory sit while I looped again, then the compiler saw that and optimized it to the GPU for speed. So I got around this
by writing to the memory every time I allocated it, so it would not be optimized away.
Seems to have worked. But that opens the other question, can I take advantage of that optimization and see if I can get it to use the GPU for the math hog? - further testing needed

EMSCRIPTEN_KEEPALIVE
void memory_hog(int megabytes) {
  for (int i = 0; i < megabytes; ++i) {
    unsigned char *p = (unsigned char*)malloc(1024*1024);
    if (!p) return;
    memset(p, 0xFF, 1024*1024);
  }
}
*/