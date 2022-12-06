<template>
  <div ref="containerRef" class="container"></div>
</template>

<script lang="ts" setup>
import {onMounted, ref, watchEffect} from "vue";
import {
  AnimationMixer, Clock,
  Color,
  PerspectiveCamera,
  Scene, sRGBEncoding,
  WebGLRenderer
} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import TWEEN from "@tweenjs/tween.js";
import {GLTF, GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import TROPICALISLAND from '../../assets/tropical_island.glb?url'

const containerRef = ref<HTMLDivElement>()
const rendererRef = ref<WebGLRenderer>()
const cameraRef = ref<PerspectiveCamera>()
const controlRef = ref<OrbitControls>()
const scene = new Scene()

function initCamera() {
  cameraRef.value = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 10000);
  const start = {x: 0, y: 0, z: 0}
  new TWEEN.Tween(start)
      .to({x: 0, y: 10, z: 30}, 1000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(() => {
        const {x, y, z} = start
        cameraRef.value?.position.set(x, y, z)
      })
      .start()
  controlRef.value = new OrbitControls(cameraRef.value, rendererRef.value?.domElement)
  //调整摄像头的控制器，限制摄像机的移动
  controlRef.value.autoRotate = false
  controlRef.value.autoRotateSpeed = 1
  controlRef.value.dampingFactor = 0.05
  controlRef.value.enableDamping = true
  controlRef.value.enableRotate = true
  controlRef.value.minDistance = 0
  controlRef.value.maxDistance = 1800
  controlRef.value.maxPolarAngle = Math.PI * .49

}

function initRenderer() {
  rendererRef.value = new WebGLRenderer({antialias: true})
  rendererRef.value.setSize(window.innerWidth, window.innerHeight);
  rendererRef.value!.setPixelRatio(window.devicePixelRatio)
  rendererRef.value!.outputEncoding = sRGBEncoding
  rendererRef.value.shadowMap.enabled = true;
  rendererRef.value.setClearColor(new Color('#015A74'))
}
const animationRef = ref<AnimationMixer>()
const clock = new Clock()
function render() {
  requestAnimationFrame(render);
  if (cameraRef.value) {
    rendererRef.value?.render(scene, cameraRef.value);
  }
  controlRef.value?.update()
  animationRef.value?.update(clock.getDelta())
  TWEEN.update()
}

onMounted(() => {
  const loader = new GLTFLoader();
  loader.load(TROPICALISLAND, (gltf: GLTF) => {
    animationRef.value = new AnimationMixer(gltf.scene)
    gltf.animations.find(a => {
      const action = animationRef.value?.clipAction(a)
      action?.play()
    })
    scene.add(...gltf.scene.children);
  });
  initRenderer()
  initCamera()
  render()
})
watchEffect(() => {
  if (rendererRef.value) {
    containerRef.value?.append(rendererRef.value.domElement)
  }
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