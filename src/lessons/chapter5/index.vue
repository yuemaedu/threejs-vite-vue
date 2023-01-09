<template>
  <div ref="statsRef"></div>
  <div ref="containerRef" class="container"></div>
</template>

<script lang="ts" setup>
import {
  ACESFilmicToneMapping,
  AxesHelper,
  Color,
  EquirectangularReflectionMapping,
  Fog,
  HemisphereLight,
  IcosahedronGeometry,
  InstancedMesh,
  Material,
  Matrix4, Mesh,
  MeshPhongMaterial,
  PerspectiveCamera, Raycaster,
  Scene,
  sRGBEncoding, Vector2,
  WebGLRenderer
} from "three";
import {onMounted, ref, watchEffect} from "vue";
import Stats from "stats.js";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";


const cameraRef = ref<PerspectiveCamera>()
const rendererRef = ref<WebGLRenderer>()
const containerRef = ref<HTMLDivElement>()
const controlsRef = ref<OrbitControls>()
const statsRef = ref<HTMLDivElement>()
const stats = new Stats()
const scene = new Scene()
const amount = parseInt(window.location.search.slice(1)) || 10;
const count = Math.pow(amount, 3);

const rayCaster = new Raycaster();
const mouse = new Vector2(1, 1);

const color = new Color();
const white = new Color().setHex(0xffffff);
let mesh: InstancedMesh

function initCamera() {
  // 创建摄像机
  cameraRef.value = new PerspectiveCamera(60,
      window.innerWidth / window.innerHeight, 0.1, 100)
  // 设置摄像机位置
  cameraRef.value.position.set(amount, amount, amount)
  //设置摄像机朝向
  cameraRef.value.lookAt(0, 0, 0)
}

function initRenderer() {
  rendererRef.value = new WebGLRenderer({antialias: true})

  rendererRef.value.setPixelRatio(window.devicePixelRatio);
  rendererRef.value.setSize(window.innerWidth, window.innerHeight);
}

function initControl() {
  if (cameraRef.value) {
    controlsRef.value = new OrbitControls(cameraRef.value, containerRef.value);
    controlsRef.value.enableDamping = true;
    controlsRef.value.enableZoom = true;
    controlsRef.value.enablePan = true;
  }
}

function init() {
  const light = new HemisphereLight(0xffffff, 0x888888);
  light.position.set(0, 1, 0);
  scene.add(light);

  scene.add(new AxesHelper(20))

  const geometry = new IcosahedronGeometry(0.5, 3);
  const material = new MeshPhongMaterial({color: 0xffffff});

  mesh = new InstancedMesh(geometry, material, count);

  let i = 0;
  const offset = (amount - 1) / 2;

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
}


onMounted(() => {
  // 创建场景
  stats.dom.style.top = "50px";
  statsRef.value?.append(stats.dom)
  initCamera()
  initRenderer()
  initControl()
  init()
})

function renderScene() {
  stats.update()
  requestAnimationFrame(renderScene)
  if (cameraRef.value) {
    rendererRef.value!.render(scene, cameraRef.value)
  }
  if (controlsRef.value) {
    controlsRef.value.update();
  }
  if (cameraRef.value) {
    rayCaster.setFromCamera(mouse, cameraRef.value);
  }
  if (mesh) {
    const intersection = rayCaster.intersectObject(mesh);
    if (intersection.length > 0) {
      const instanceId = intersection[0].instanceId;
      if (instanceId) {
        mesh.getColorAt(instanceId, color);
        if (color.equals(white)) {
          mesh.setColorAt(instanceId, color.setHex(Math.random() * 0xffffff));
          mesh.instanceColor!.needsUpdate = true;
        }
      }

    }
  }

}

renderScene()

function onMouseMove(event: MouseEvent) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}


watchEffect(() => {
  containerRef.value?.appendChild(rendererRef.value!.domElement)
  window.addEventListener('resize', () => {
    cameraRef.value!.aspect = window.innerWidth / window.innerHeight
    //更新相机投影矩阵
    cameraRef.value!.updateProjectionMatrix()
    rendererRef.value!.setSize(window.innerWidth, window.innerHeight)
  }, false)
  document.addEventListener('mousemove', onMouseMove)
})
</script>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
}
</style>