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
  GridHelper, Material, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, Object3D,
  PerspectiveCamera,
  Scene, sRGBEncoding,
  WebGLRenderer
} from "three";
import {onMounted, ref, watch, watchEffect} from "vue";
import Stats from "stats.js";
import * as dat from "dat.gui";
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import venice_sunset_1k from '../../assets/venice_sunset_1k.hdr?url'
import Car from '../../assets/car.glb?url'
import {GLTF, GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const scene = new Scene()
const grid = new GridHelper(20, 40, 0xffffff, 0xffffff);

const containerRef = ref<HTMLDivElement>()
const statsRef = ref<HTMLDivElement>()
const stats = new Stats()
const controlRef = ref({
  bodyColor: "#0c0c0c",
  glassColor: "#0c0c0c",
  detailsColor: "#0c0c0c",
})
const cameraRef = ref<PerspectiveCamera>()
const rendererRef = ref<WebGLRenderer>()
const controlsRef = ref<OrbitControls>()
const bodyMaterial = new MeshPhysicalMaterial({
  color: 0xff0000, metalness: 1.0, roughness: 0.5, clearcoat: 1.0, clearcoatRoughness: 0.03, sheen: 0.5
});
const glassMaterial = new MeshPhysicalMaterial({
  color: 0xffffff, metalness: 0.25, roughness: 0, transmission: 1.0
});
const detailsMaterial = new MeshStandardMaterial({
  color: 0xffffff, metalness: 1.0, roughness: 0.5
});

watch(() => controlRef.value.bodyColor, (c) => {
  bodyMaterial.color.set(c);
})
watch(() => controlRef.value.glassColor, (c) => {
  glassMaterial.color.set(c);
})

watch(() => controlRef.value.detailsColor, (c) => {
  detailsMaterial.color.set(c);
})

function initGUI() {
  if (document.querySelectorAll(".dg.ac>.dg.main.a").length === 0) {
    const gui = new dat.GUI()
    gui.addColor(controlRef.value, "bodyColor")
    gui.addColor(controlRef.value, "detailsColor")
    gui.addColor(controlRef.value, "glassColor").listen()
  }
}

function initCamera() {
  // 创建摄像机
  cameraRef.value = new PerspectiveCamera(45,
      window.innerWidth / window.innerHeight, 0.1, 1000)
  // 设置摄像机位置
  cameraRef.value.position.set(-30, 40, 30)
  //设置摄像机朝向
  cameraRef.value.lookAt(scene.position)

  const renderer = new WebGLRenderer()
  renderer.setClearColor(new Color(0xEEEEEE))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
}

function initRenderer() {
  rendererRef.value = new WebGLRenderer({antialias: true})

  rendererRef.value.setPixelRatio(window.devicePixelRatio);
  rendererRef.value.setSize(window.innerWidth, window.innerHeight);
  // rendererRef.value.setAnimationLoop( render );
  rendererRef.value.outputEncoding = sRGBEncoding;
  rendererRef.value.toneMapping = ACESFilmicToneMapping;
  rendererRef.value.toneMappingExposure = 0.85;
}

function initScene() {
  scene.background = new Color(0x333333);
  scene.environment = new RGBELoader().load(venice_sunset_1k);
  scene.environment.mapping = EquirectangularReflectionMapping;
  scene.fog = new Fog(0x333333, 10, 15);

  const material = grid.material as Material
  material.opacity = 0.2;
  material.depthWrite = false;
  material.transparent = true;
  scene.add(grid);

  const axes = new AxesHelper(20)
  scene.add(axes)
}

const wheels: (Object3D | undefined)[] = []

function initGLTF() {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/gltf/');
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  loader.load(Car, (gltf: GLTF) => {
    const carModel = gltf.scene.children[0];

    (carModel.getObjectByName('body') as Mesh).material = bodyMaterial;
    (carModel.getObjectByName('glass') as Mesh).material = glassMaterial;
    (carModel.getObjectByName('rim_fl') as Mesh).material = detailsMaterial;
    (carModel.getObjectByName('rim_fr') as Mesh).material = detailsMaterial;
    (carModel.getObjectByName('rim_rr') as Mesh).material = detailsMaterial;
    (carModel.getObjectByName('rim_rl') as Mesh).material = detailsMaterial;
    (carModel.getObjectByName('trim') as Mesh).material = detailsMaterial;
    wheels.push(
        carModel.getObjectByName('wheel_fl'),
        carModel.getObjectByName('wheel_fr'),
        carModel.getObjectByName('wheel_rl'),
        carModel.getObjectByName('wheel_rr')
    )
    scene.add(carModel)
  })

}

function initControl() {
  if (cameraRef.value) {
    controlsRef.value = new OrbitControls(cameraRef.value, containerRef.value);
    controlsRef.value.enableDamping = true;
    controlsRef.value.maxDistance = 9;
    controlsRef.value.target.set(0, 0.5, 0);
    controlsRef.value.update();
  }

}

initGUI()
onMounted(() => {
  // 创建场景
  stats.dom.style.top = "50px";
  statsRef.value?.append(stats.dom)
  initGLTF()
  initScene()
  initCamera()
  initRenderer()
  initControl()

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
  const time = -performance.now() / 1000;

  for (let i = 0; i < wheels.length; i++) {

    wheels[i]!.rotation.x = time * Math.PI * 2;

  }
  grid.position.z = -(time) % 1;

}

renderScene()
watchEffect(() => {
  containerRef.value?.appendChild(rendererRef.value!.domElement)
  window.addEventListener('resize', () => {
    cameraRef.value!.aspect = window.innerWidth / window.innerHeight
    //更新相机投影矩阵
    cameraRef.value!.updateProjectionMatrix()
    rendererRef.value!.setSize(window.innerWidth, window.innerHeight)
  }, false)
})
</script>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
}
</style>