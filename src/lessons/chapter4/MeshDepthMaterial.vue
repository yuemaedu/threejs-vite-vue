<template>
  <div ref="containerRef" class="container"></div>
</template>

<script lang="ts" setup>
import {
  BoxGeometry,
  Camera,
  Color,
  Mesh,
  MeshDepthMaterial, MeshLambertMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import {onMounted, ref, watch, watchEffect} from "vue";
import * as dat from 'dat.gui';

const scene = new Scene()
const containerRef = ref<HTMLDivElement>()
const rendererRef = ref<WebGLRenderer>()
const cameraRef = ref<Camera>()
const controlRef = ref({
  rotationSpeed: 0.01,
  numberOfObjects: 0,
  addCube: function () {
    const cubeSize = Math.ceil(3 + (Math.random() * 3));
    const cubeGeometry = new BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMaterial = new MeshLambertMaterial({color: Math.random() * 0xffffff});
    const cube = new Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;
    // position the cube randomly in the scene
    cube.position.x = -60 + Math.round((Math.random() * 100));
    cube.position.y = Math.round((Math.random() * 10));
    cube.position.z = -100 + Math.round((Math.random() * 150));
    scene.add(cube);
    this.numberOfObjects = scene.children.length
  }
})
scene.overrideMaterial = new MeshDepthMaterial();

function initGUI() {
  if (document.querySelectorAll(".dg.ac>.dg.main.a").length === 0) {
    const gui = new dat.GUI()
    gui.add(controlRef.value, "addCube")
    gui.add(controlRef.value, "numberOfObjects").listen()
    gui.add(controlRef.value, "rotationSpeed", 0, 0.05).listen()
  }
}


function render() {
  scene.traverse((e) => {
    if (e instanceof Mesh && e.name !== 'plane') {
      e.rotation.x += controlRef.value.rotationSpeed;
      e.rotation.y += controlRef.value.rotationSpeed;
      e.rotation.z += controlRef.value.rotationSpeed;
    }
  })
  requestAnimationFrame(render);
  if (cameraRef.value) {
    rendererRef.value?.render(scene, cameraRef.value);
  }
}

function initRenderer() {
  rendererRef.value = new WebGLRenderer()
  rendererRef.value.setClearColor(new Color(0x00000));
  rendererRef.value.setSize(window.innerWidth, window.innerHeight);
  rendererRef.value.shadowMap.enabled = true;
}

function initCamera() {
  cameraRef.value = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 130);
  cameraRef.value.position.x = -50;
  cameraRef.value.position.y = 40;
  cameraRef.value.position.z = 50;
  cameraRef.value.lookAt(scene.position);
}


onMounted(() => {
  new Array(20).fill(1).forEach(() => {
    controlRef.value.addCube()
  })
  initRenderer()
  initCamera()
  render();
})
watchEffect(() => {
  initGUI()
  if (rendererRef.value) {
    containerRef.value?.append(rendererRef.value.domElement)
  }
})
</script>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
}
</style>