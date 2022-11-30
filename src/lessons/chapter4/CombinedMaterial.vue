<template>
  <div ref="containerRef" class="container"></div>
</template>

<script lang="ts" setup>
import {
  BoxGeometry,
  Color,
  Mesh, MeshBasicMaterial,
  MeshDepthMaterial,
  MeshLambertMaterial, MultiplyBlending,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from "three";
import {onMounted, ref, watch, watchEffect} from "vue";
import * as dat from "dat.gui";
import {createMultiMaterialObject} from "three/examples/jsm/utils/SceneUtils";

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
  addCube: function () {
    const cubeSize = Math.ceil(3 + (Math.random() * 3));
    const cubeGeometry = new BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMaterial = new MeshDepthMaterial();
    const colorMaterial = new MeshBasicMaterial({
      color: this.color,
      transparent: true,
      blending: MultiplyBlending
    });
    const cube = createMultiMaterialObject(cubeGeometry, [colorMaterial, cubeMaterial]);
    cube.children[1].scale.set(0.99, 0.99, 0.99);
    cube.castShadow = true;

    // position the cube randomly in the scene
    cube.position.x = -60 + Math.round((Math.random() * 100));
    cube.position.y = Math.round((Math.random() * 10));
    cube.position.z = -100 + Math.round((Math.random() * 150));

    // add the cube to the scene
    scene.add(cube);


    this.numberOfObjects = scene.children.length
  }
})

function initGUI() {
  if (document.querySelectorAll(".dg.ac>.dg.main.a").length === 0) {
    const gui = new dat.GUI()
    gui.add(controlRef.value, "addCube")
    gui.addColor(controlRef.value, "color")
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

onMounted(() => {
  new Array(20).fill(1).forEach(() => {
    controlRef.value.addCube()
  })
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