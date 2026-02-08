/*
  This is your site JavaScript code - you can add interactivity!
*/

// Print a message in the browser's dev tools console each time the page loads
// Use your menus or right-click / control-click and choose "Inspect" > "Console"
console.log("Hello 🌎");

// Wait for A-Frame scene to load
window.addEventListener('load', function () {
  const scene = document.querySelector('a-scene');

  if (scene.hasLoaded) {
    initClickListener();
    initRoomSwitcher();
    initHamburgerMenu();
  } else {
    scene.addEventListener('loaded', function () {
      initClickListener();
      initRoomSwitcher();
      initHamburgerMenu();
    });
  }
});

function initClickListener() {
  const scene = document.querySelector('a-scene');
  const camera = document.querySelector('a-camera');

  console.log('Scene loaded, setting up click listener');

  // Use mousedown event to capture actual mouse clicks
  scene.canvas.addEventListener('mousedown', function (evt) {
    // Get normalized mouse coordinates
    const mouse = new THREE.Vector2();
    mouse.x = (evt.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(evt.clientY / window.innerHeight) * 2 + 1;

    // Create raycaster from camera
    const raycaster = new THREE.Raycaster();
    const cam = camera.getObject3D('camera');
    raycaster.setFromCamera(mouse, cam);

    // Get all objects in the scene to raycast against
    const intersects = raycaster.intersectObjects(scene.object3D.children, true);

    if (intersects.length > 0) {
      const intersection = intersects[0];
      const point = intersection.point;

      // Console log the clicked coordinates
      console.log('Clicked 3D coordinates:', {
        x: point.x,
        y: point.y,
        z: point.z
      });

      // Update X, Y, Z coordinates with 2 decimal points
      document.getElementById('xCoord').textContent = point.x.toFixed(2);
      document.getElementById('yCoord').textContent = point.y.toFixed(2);
      document.getElementById('zCoord').textContent = point.z.toFixed(2);
    }

    // Get camera rotation
    const cameraRotation = camera.getAttribute('rotation');
    const rotX = ((cameraRotation.x % 360) + 360) % 360;
    const rotY = ((cameraRotation.y % 360) + 360) % 360;

    const rotationText = `X:&nbsp;&nbsp;${rotX.toFixed(2)}° Y:&nbsp;&nbsp;${rotY.toFixed(2)}°`;
    console.log('Camera rotation:', rotationText);

    document.getElementById('cameraRotation').innerHTML = rotationText;
  });
}

// Initialize room switcher
function initRoomSwitcher() {
  const roomButtons = document.querySelectorAll('.room-btn');
  const sky = document.querySelector('#mainSky');
  const camera = document.querySelector('a-camera');

  roomButtons.forEach(button => {
    button.addEventListener('click', function () {
      const roomName = this.getAttribute('data-room');

      // Update active room button
      roomButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      // Update body data attribute to toggle button visibility
      document.body.setAttribute('data-active-room', roomName);

      // Get the first panorama button for this room
      const firstPanoramaBtn = document.querySelector(`.panorama-btn[data-room="${roomName}"]`);

      if (firstPanoramaBtn) {
        // Remove active class from all panorama buttons
        document.querySelectorAll('.panorama-btn').forEach(btn => btn.classList.remove('active'));

        // Set first button as active
        firstPanoramaBtn.classList.add('active');

        // Switch to first panorama
        const panoramaId = firstPanoramaBtn.getAttribute('data-panorama');
        sky.setAttribute('src', `#${panoramaId}`);

        // Reset camera rotation
        camera.setAttribute('rotation', '0 0 0');

        console.log(`Switched to room: ${roomName}, panorama: ${panoramaId}`);
      }
    });
  });

  // Add click handlers to all panorama buttons
  document.querySelectorAll('.panorama-btn').forEach(button => {
    button.addEventListener('click', function () {
      const panoramaId = this.getAttribute('data-panorama');
      sky.setAttribute('src', `#${panoramaId}`);

      // Reset camera rotation
      camera.setAttribute('rotation', '0 0 0');

      // Update active button
      document.querySelectorAll('.panorama-btn').forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      console.log(`Switched to panorama: ${panoramaId}`);
    });
  });
}

// Initialize hamburger menu
function initHamburgerMenu() {
  const hamburger = document.getElementById('hamburgerMenu');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', function() {
    this.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });

  // Close menu when a panorama is selected on mobile
  document.querySelectorAll('#mobilePanoramaButtons .panorama-btn').forEach(button => {
    button.addEventListener('click', function() {
      // Small delay to show the selection before closing
      setTimeout(() => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
      }, 300);
    });
  });

  // Sync mobile room buttons with main room switcher
  document.querySelectorAll('#mobileRoomButtons .room-btn').forEach(button => {
    button.addEventListener('click', function() {
      const roomName = this.getAttribute('data-room');
      
      // Update mobile room buttons
      document.querySelectorAll('#mobileRoomButtons .room-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      this.classList.add('active');
      
      // Also update desktop room buttons
      document.querySelectorAll('.room-switcher .room-btn').forEach(btn => {
        if (btn.getAttribute('data-room') === roomName) {
          btn.click();
        }
      });
    });
  });
}
