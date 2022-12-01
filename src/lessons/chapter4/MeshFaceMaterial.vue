<template>
  <div ref="containerRef" class="container"></div>
</template>

<script lang="ts" setup>
import {onMounted, ref, watch, watchEffect} from "vue";
import {
  Color, HemisphereLight,
  IcosahedronGeometry,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshNormalMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from "three";

const containerRef = ref<HTMLDivElement>()
const rendererRef = ref<WebGLRenderer>()
const cameraRef = ref<PerspectiveCamera>()
const scene = new Scene()


function initCamera() {
  cameraRef.value = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 130);
  cameraRef.value.position.x = -50;
  cameraRef.value.position.y = 40;
  cameraRef.value.position.z = 50;
  cameraRef.value!.near = 7
  cameraRef.value!.far = 139
  cameraRef.value.lookAt(scene.position);
}

function initRenderer() {
  rendererRef.value = new WebGLRenderer()
  rendererRef.value.setClearColor(new Color(0xeeeeee));
  rendererRef.value.setSize(window.innerWidth, window.innerHeight);
  rendererRef.value.shadowMap.enabled = true;
}

function render() {
  scene.traverse((e) => {
    if (e instanceof Mesh && e.name !== 'plane') {
      e.rotation.y += 0.02;
    }
  })
  requestAnimationFrame(render);
  if (cameraRef.value) {
    rendererRef.value?.render(scene, cameraRef.value);
  }
}

onMounted(() => {

  const light = new HemisphereLight(0xffffff, 0x888888);
  light.position.set(0, 1, 0);
  scene.add(light);


  const amount = parseInt(window.location.search.slice(1)) || 10;
  const count = Math.pow(amount, 3);

  const geometry = new IcosahedronGeometry(0.5, 3);
  const material = new MeshNormalMaterial();

  let mesh;
  mesh = new InstancedMesh(geometry, material, count);

  let i = 0;
  const offset = (amount - 1) / 2;
  const color = new Color();

  const matrix = new Matrix4();

  for (let x = 0; x < amount; x++) {
    for (let y = 0; y < amount; y++) {
      for (let z = 0; z < amount; z++) {
        matrix.setPosition(offset - x, offset - y, offset - z);
        mesh.setMatrixAt(i, matrix);
        mesh.setColorAt(i, color);
        i++;
      }
    }
  }

  scene.add(mesh);


  initRenderer()
  initCamera()
  render()
})
watchEffect(() => {
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