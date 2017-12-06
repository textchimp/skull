var app = app || {};
// app.config = app.config || {};

app.config = {
  tour: false,
  dragHeld: false,
  isPaused: false,
  colourCycle: true,
  light1ColourCycle: 1000,
  light2ColourCycle: 1000,
  ambColourCycle: 2000,
  glitchStep: 0.0,
  glitchStep: 2.0,
  triggerMax: 2,
  faceCount: 100
};
app.triggers = [];
app.triggerIndex = 0;


var skully;
var orig_skull_geom;


/* BufferGeometry!

skully.children[0].geometry.attributes. normal.array[279144], position.array[same], uv.array[same]

skully.children[0].geometry.attributes.position.needsUpdate = true;

var geometry = new THREE.Geometry().fromBufferGeometry( skully.children[0].geometry )
*/

// skully.children[0].geometry.attributes.position.needsUpdate = true;

// window.addEventListener ?
// window.addEventListener("load", skull, false) :
// window.attachEvent && window.attachEvent("onload", skull);

app.scene = new THREE.Scene();

var orbitControls = null;


document.addEventListener('keydown', function(e) {
  if( e.keyCode === 32){
    // spacebar to pause
    app.config.isPaused = !app.config.isPaused;
    !app.config.isPaused && app.animate(); // restart animation
  } else if( e.key === 'r' ){
    app.resetSkull();
  } else if( e.key === 'g' ){
    app.glitch();
  } else if( e.key === 't' ){
    app.config.tour = !app.config.tour;
  }
  // } else if( e.key === 'f' ){
  //   // 'f' to show/hide stats
  //   app.config.showStats = !app.config.showStats;
  //   app.stats.showPanel( app.config.showStats ? 0 : false );
  //   // 't' to toggle tour mode (camera movement)
  //   app.config.tour = !app.config.tour;
  // }
});

window.addEventListener('resize', function (event) {
  var w = app.renderer.domElement.parentElement.clientWidth;
  var h = app.renderer.domElement.parentElement.clientHeight;
  app.camera.aspect = w / h;
  app.camera.updateProjectionMatrix();
  app.renderer.setSize(w, h);
});


  app.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  app.camera.position.z = 25;
  app.camera.zoom = 15;

  app.cameraAngle = 0;

  app.camera.updateProjectionMatrix();

  app.renderer = new THREE.WebGLRenderer();
  app.renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(app.renderer.domElement);

  // var geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshPhongMaterial({ color:  0xAAAAAA }); //0x00ff00 });
  // var material = createMaterial()

  app.light1 = new THREE.DirectionalLight(0xfffc00, .5);
  app.light2 = new THREE.DirectionalLight(0x3dff16, .5);
  app.amb = new THREE.AmbientLight(0xFF3355); //0x404040
  var d = 100;

  app.light1.position.set(d, d, d);
  app.light1.position.set(-d, d, d);
  app.scene.add(app.light1);
  app.scene.add(app.light2);
  app.scene.add(app.amb);

  orbitControls = new THREE.OrbitControls(app.camera, app.renderer.domElement);

  var loader = new THREE.OBJLoader();
  loader.load('js/craneo.obj', function (data) {
    // data.children[0].material = material;
    // skully = data;
    var geometry = new THREE.Geometry().fromBufferGeometry( data.children[0].geometry );
    skully = new THREE.Mesh(geometry, material)
    orig_skull_geom = geometry.clone();  // keep track of the original positions before we mess with them
    app.scene.add(skully);

    app.animate();
  });

  app.tour = function(){
    if( app.config.tour ){
      var radius = 15;
      app.camera.position.x = radius * Math.cos( app.cameraAngle );
      app.camera.position.z = radius * Math.sin( app.cameraAngle );
      // app.camera.position.y = radius * Math.cos( app.cameraAngle );
      app.camera.lookAt( app.scene.position );
      app.cameraAngle += 0.011;
    }
  }

  app.lightingColourCycle = function(){
    if( app.config.colourCycle ){
      app.light1.color.setHSL( (app.light1.color.getHSL().h + 1/app.config.light1ColourCycle)%1.0, 1.0, 0.5);
      app.light2.color.setHSL( (app.light2.color.getHSL().h + 1/app.config.light2ColourCycle)%1.0, 1.0, 0.5);
      app.amb.color.setHSL( (app.amb.color.getHSL().h + 1/app.config.ambColourCycle)%1.0, 1.0, 0.3);
    }
  };

  // EXTRUDE extrudePath !!!!!!


  app.resetSkull = function(){
    skully.geometry = orig_skull_geom.clone();
  };

  app.glitch = function(){
    let n = 4000;
    // let begin = THREE.Math.randInt(0, skully.geometry.faces.length - n);
    let begin, sin;

    // if( Math.random() > 0.5 ){

    begin = 1000;
    app.config.glitchStep += 0.1;
    sin = Math.sin(app.config.glitchStep);

    // } else {
    //   begin = 10000;
    //   app.config.glitchStep2 += 0.1;
    //   sin = Math.sin(app.config.glitchStep2);
    // }

    // let v = new THREE.Vector3( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5,);
    let range = 0.05 // 0.02
    let amt = -range + ( range * sin );

    // if( Math.abs(s) < 0.01) console.log(s);

    for (let i = begin; i < begin+n; i++) {
      // let face = skully.geometry.faces[i];
      let {a,b,c} = skully.geometry.faces[i];

      // if (orig_skull_geom.vertices[a].z < 0) continue;

      // if(!(i%10)){
      //   v = new THREE.Vector3( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5,);
      // }
      // skully.geometry.vertices[a].add( v );
      // skully.geometry.vertices[b].add( v );
      // skully.geometry.vertices[c].add( v );

      // vec3.lerpVectors();

      // let newPos = new THREE.Vector3();
      // newPos.addVectors ( startPos, direction.multiplyScalar( distance ) );

      // let direction = new THREE.Vector3().subVectors( skully.geometry.vertices[a], app.scene.position ) ;
      // let r = (-0.5 + Math.random()) * 0.1;
      let r = 0; //i * 0.0001;
      skully.geometry.vertices[a].lerpVectors(orig_skull_geom.vertices[a], app.scene.position, amt+r);
      skully.geometry.vertices[b].lerpVectors(orig_skull_geom.vertices[b], app.scene.position, amt+r);
      skully.geometry.vertices[c].lerpVectors(orig_skull_geom.vertices[c], app.scene.position, amt+r);

      // let direction = ???????????? from origin to point
      // skully.geometry.vertices[a].add ( direction.multiplyScalar( distance ) );
      // skully.geometry.vertices[b].add ( direction.multiplyScalar( distance ) );
      // skully.geometry.vertices[c].add ( direction.multiplyScalar( distance ) );
    }
    skully.geometry.verticesNeedUpdate = true;
  };

  app.animate = function () {

    if(app.config.isPaused){
      return;
    }

    requestAnimationFrame(app.animate);

    orbitControls.update();
    app.lightingColourCycle();
    app.tour();

    // app.glitch();
    app.glitchBeat();

    // let triangle = {a: skully.geometry.vertices[a], b,
    // skully.geometry.vertices.forEach(v => {
    //   if(v.x < 0)
    //   v.x += THREE.Math.randFloatSpread(0.2);
    // });
    // skully.geometry.verticesNeedUpdate = true;

    app.renderer.render(app.scene, app.camera);
  };


app.glitchBeat = function(){
  for (var j = 0; j < app.triggers.length; j++) {

    let t = app.triggers[j];

    if(t.fade > 0){

      t.fade--;
      t.fadeNorm -= t.fadeStep;

      let range = -0.2;
      let amt = range * t.fadeNorm;

      // if(t.fade < 2 ) {
      //   return;
      // }

      // console.log(amt, t.fadeNorm);
      for (var i = t.faceStart; i < t.faceStart + app.config.faceCount; i++) {

        let {a,b,c} = skully.geometry.faces[i];

          // a = THREE.Math.randInt(0, skully.geometry.vertices.length),
          // b = THREE.Math.randInt(0, skully.geometry.vertices.length);
          // c = THREE.Math.randInt(0, skully.geometry.vertices.length);

        skully.geometry.vertices[a].lerpVectors(orig_skull_geom.vertices[a], app.scene.position, amt);
        skully.geometry.vertices[b].lerpVectors(orig_skull_geom.vertices[b], app.scene.position, amt);
        skully.geometry.vertices[c].lerpVectors(orig_skull_geom.vertices[c], app.scene.position, amt);
        // amt here should be in range -0.5 to 0 to extend face beyond skull and shrink back
      }
      skully.geometry.verticesNeedUpdate = true;
    }
    // } else if( t.needsReset ) {
    //   // algorithm seems not to replace faces perfectly, so ensure it here
    //   for (var i = t.faceStart; i < t.faceStart + app.config.faceCount; i++) {
    //     let {a,b,c} = skully.geometry.faces[i];
    //     console.log('update');
    //     skully.geometry.vertices[a].lerpVectors(orig_skull_geom.vertices[a], app.scene.position, amt);
    //     skully.geometry.vertices[b].lerpVectors(orig_skull_geom.vertices[b], app.scene.position, amt);
    //     skully.geometry.vertices[c].lerpVectors(orig_skull_geom.vertices[c], app.scene.position, amt);
    //   }
    //   skully.geometry.verticesNeedUpdate = true;
    //   t.needsReset = false;
    // }
  }
};

app.oscHandler = function(address, args){
  // console.log(address, args);
  // app.triggers[app.triggerIndex] = args;

    const count = args[0].value;
    const dur   = args[1].value;
    const note  = args[2].value % 12;  // don't mod to handle multiple octaves as a range?
  // const fade = dur/2;

  let fps = 60.0;
  app.triggers[app.triggerIndex] = {
    dur,
    count,
    note,
    fade: dur * fps,    //fade * app.config.triggerFadeScale;
    fadeNorm: 1.0,
    fadeStep: 1/(dur * fps), // how much to sub from 1.0 value over N frames to get to zero
    faceStart: THREE.Math.randInt(0, skully.geometry.faces.length - app.config.faceCount),
    needsReset: true
  };
  app.triggerIndex = (app.triggerIndex + 1) % app.config.triggerMax;

  // console.log('ind:', app.triggerIndex);

}


// simulate an OSC beat message every second
let counter = 0;

setInterval(() => {
  console.log('go');
  app.oscHandler('/whocares', [
    { value: counter++ },
    { value: 1.0 },
    { value: 60 }
  ]);
}, 1000);
