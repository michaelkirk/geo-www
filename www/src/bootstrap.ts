// A dependency graph that contains any wasm must all be imported
// asynchronously. This `bootstrap.js` file does the single async import, so
// that no one else needs to worry about it again.
import("./index")
  .then(m => {
      console.log("assigning loaded module to window.geo_www");
      window['geo_www'] = m;
  })
  .catch(e => console.error("Error importing `index.js`:", e))
