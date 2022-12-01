<template>
  <div ref="containerRef" class="container"></div>
</template>

<script lang="ts" setup>
import {
  AmbientLight,
  BackSide,
  BoxGeometry,
  Color, DoubleSide, FrontSide,
  Mesh, MeshLambertMaterial,
  MeshNormalMaterial,
  PerspectiveCamera,
  Scene, SpotLight,
  WebGLRenderer
} from "three";
import {onMounted, ref, watch, watchEffect} from "vue";
import * as dat from "dat.gui";

const containerRef = ref<HTMLDivElement>()
const rendererRef = ref<WebGLRenderer>()
const cameraRef = ref<PerspectiveCamera>()
const scene = new Scene()
const controlRef = ref({
  color: 0x00ff00,
  rotationSpeed: 0.01,
  numberOfObjects: 0,
  cameraNear: 0,
  cameraFar: 50,
  side: 'back',
})

function initGUI() {
  if (document.querySelectorAll(".dg.ac>.dg.main.a").length === 0) {
    const gui = new dat.GUI()
    gui.addColor(controlRef.value, "color")
    gui.add(controlRef.value, 'side', ["front", "back", "double"])
    gui.add(controlRef.value, "cameraNear", 0, 50)
    gui.add(controlRef.value, "cameraFar", 50, 200)
    gui.add(controlRef.value, "numberOfObjects").listen()
    gui.add(controlRef.value, "rotationSpeed", 0, 0.05).listen()
  }
}

function initCamera() {


  cameraRef.value = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 130);
  cameraRef.value.position.x = -50;
  cameraRef.value.position.y = 40;
  cameraRef.value.position.z = 50;
  cameraRef.value!.near = 7
  cameraRef.value!.far = 139
  cameraRef.value.lookAt(scene.position);
  watch(() => controlRef.value.cameraNear, (v) => {
    cameraRef.value!.near = v
    cameraRef.value?.updateProjectionMatrix()
  })
  watch(() => controlRef.value.cameraFar, (v) => {
    cameraRef.value!.far = v
    cameraRef.value?.updateProjectionMatrix()
  })
}

function initRenderer() {
  rendererRef.value = new WebGLRenderer()
  rendererRef.value.setClearColor(new Color(0x00000));
  rendererRef.value.setSize(window.innerWidth, window.innerHeight);
  rendererRef.value.shadowMap.enabled = true;
}

function render() {
  scene.traverse((e) => {
    if (e instanceof Mesh && e.name !== 'plane') {
      e.rotation.y += controlRef.value.rotationSpeed;
    }
  })
  requestAnimationFrame(render);
  if (cameraRef.value) {
    rendererRef.value?.render(scene, cameraRef.value);
  }
}


var ambientLight = new AmbientLight(0x0c0c0c);
scene.add(ambientLight);

// add spotlight for the shadows
var spotLight = new SpotLight(0xffffff);
spotLight.position.set(-30, 60, 60);
spotLight.castShadow = true;
scene.add(spotLight);

const cubeGeometry = new BoxGeometry(15, 15, 15);
// 是光源照射到物体表面后，向四面八方反射，产生的漫反射效果。这是一种理想的漫反射光照模型。如下图：这个是顶点函数处理后的该光照模型，因此看起来像素不够平滑
const meshMaterial = new MeshLambertMaterial({color: 0x7777ff});
meshMaterial.side = BackSide
const cube = new Mesh(cubeGeometry, meshMaterial);
scene.add(cube)
watch(() => controlRef.value.side, (e, d) => {
  switch (e) {
    case 'front' :
      meshMaterial.side = FrontSide;
      break
    case 'back' :
      meshMaterial.side = BackSide;
      break
    case 'double' :
      meshMaterial.side = DoubleSide;
      break
  }
  meshMaterial.needsUpdate = e !== d;
})
onMounted(() => {
  initRenderer()
  initCamera()
  render()
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