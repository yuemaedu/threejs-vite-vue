<template>
  <div ref="containerRef" class="container"></div>
</template>

<script lang="ts" setup>
import {
  BoxGeometry,
  Camera,
  Color,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene, SphereGeometry,
  Vector3,
  WebGLRenderer,
} from "three";
import {onMounted, ref, watch, watchEffect} from "vue";
import * as dat from 'dat.gui';

const scene = new Scene()
const containerRef = ref<HTMLDivElement>()
const rendererRef = ref<WebGLRenderer>()
const cameraRef = ref<Camera>()
const geometries: Record<string, Mesh> = {}
const controlRef = ref({
  rotationSpeed: 0.01,
  selectedMesh: 'cube',
  wireFrameLineJoin: 'round',
  wireframe: false,
  visible: true,
})

function initGUI() {
  if (document.querySelectorAll(".dg.ac>.dg.main.a").length === 0) {
    const gui = new dat.GUI()
    gui.add(controlRef.value, "selectedMesh", ["cube", "sphere", "plane"])
    gui.add(controlRef.value, "wireFrameLineJoin", ['round', 'bevel', 'miter'])
    gui.add(controlRef.value, "wireframe")
    gui.add(controlRef.value, "visible")
    gui.add(controlRef.value, "rotationSpeed", 0, 0.05).listen()
  }
}

watch(() => controlRef.value.selectedMesh, (v) => {
  scene.children.filter(e => e.name !== 'plane').forEach(e => {
    scene.remove(e)
  })
  console.log(v)
  geometries[v] && scene.add(geometries[v]);
})

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
  rendererRef.value.setClearColor(new Color(0xEEEEEE));
  rendererRef.value.setSize(window.innerWidth, window.innerHeight);
  rendererRef.value.shadowMap.enabled = true;
}

function initCamera() {
  cameraRef.value = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  cameraRef.value.position.x = -20;
  cameraRef.value.position.y = 50;
  cameraRef.value.position.z = 40;
  cameraRef.value.lookAt(new Vector3(10, 0, 0));
}

function initGeometry() {

  const groundGeom = new PlaneGeometry(100, 100, 4, 4);
  const groundMesh = new Mesh(groundGeom, new MeshBasicMaterial({color: 0x777777}));
  groundMesh.name = 'plane'
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.y = -20;
  scene.add(groundMesh);

  const sphereGeometry = new SphereGeometry(14, 20, 20);
  const cubeGeometry = new BoxGeometry(15, 15, 15);
  const planeGeometry = new PlaneGeometry(14, 14, 4, 4);
  const meshMaterial = new MeshBasicMaterial({color: 0x7777ff});

  watch(() => controlRef.value.wireFrameLineJoin, (v) => {
    meshMaterial.wireframeLinejoin = v
  })
  watch(() => controlRef.value.wireframe, (v) => {
    meshMaterial.wireframe = v
  })
  watch(() => controlRef.value.visible, (v) => {
    meshMaterial.visible = v
  })

  geometries.sphere = new Mesh(sphereGeometry, meshMaterial);
  geometries.cube = new Mesh(cubeGeometry, meshMaterial);
  geometries.plane = new Mesh(planeGeometry, meshMaterial);

  geometries.sphere.position.x = 0;
  geometries.sphere.position.y = 3;
  geometries.sphere.position.z = 2;


  geometries.cube.position.copy(geometries.sphere.position)
  geometries.plane.position.copy(geometries.sphere.position)
  scene.add(geometries.cube);
}

onMounted(() => {
  initRenderer()
  initCamera()
  initGeometry()
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