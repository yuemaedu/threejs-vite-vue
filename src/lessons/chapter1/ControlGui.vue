<template>
  <div ref="statsRef"></div>
  <div ref="containerRef" class="container"></div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {
  AxesHelper, BoxGeometry, Color, Mesh, MeshLambertMaterial, PerspectiveCamera,
  PlaneGeometry, Scene, SphereGeometry, SpotLight, WebGLRenderer
} from 'three'
import Stats from 'stats.js'
import * as dat from 'dat.gui';

const containerRef = ref<HTMLDivElement>()
const statsRef = ref<HTMLDivElement>()
const controlRef = ref({
  rotationSpeed: 0.02,
  bouncingSpeed: 0.03
})
const stats = new Stats()

function initGUI() {
  if (document.querySelectorAll(".dg.ac>.dg.main.a").length === 0) {
    const gui = new dat.GUI()
    gui.add(controlRef.value, "rotationSpeed", 0, 0.5)
    gui.add(controlRef.value, "bouncingSpeed", 0, 0.5)
  }
}

initGUI()
onMounted(() => {
  // 创建场景
  const scene = new Scene()
  stats.dom.style.top = "50px";
  statsRef.value?.append(stats.dom)

  // 创建摄像机
  const camera = new PerspectiveCamera(45,
      window.innerWidth / window.innerHeight, 0.01, 1000)
  // 设置摄像机位置
  camera.position.set(-30, 40, 30)
  //设置摄像机朝向
  camera.lookAt(scene.position)

  const renderer = new WebGLRenderer()
  renderer.setClearColor(new Color(0xeeeeee))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true

  const axes = new AxesHelper(20)
  scene.add(axes)

  const planeGeometry = new PlaneGeometry(60, 20)
  const meshBasicMaterial = new MeshLambertMaterial({color: 0xcccccc})
  const plane = new Mesh(planeGeometry, meshBasicMaterial)
  plane.receiveShadow = true
  plane.rotation.x = -0.5 * Math.PI
  plane.position.x = 15
  plane.position.y = 0
  plane.position.z = 0
  scene.add(plane)

  const cubeGeometry = new BoxGeometry(4, 4, 4)
  const cubeMaterial = new MeshLambertMaterial({color: 0xff0000})
  const cube = new Mesh(cubeGeometry, cubeMaterial)
  cube.castShadow = true
  cube.position.set(2, 2, 2)
  scene.add(cube)

  const sphereGeometry = new SphereGeometry(4);
  const sphereMaterial = new MeshLambertMaterial({
    color: 0x7777ff,
  })
  const sphere = new Mesh(sphereGeometry, sphereMaterial);
  sphere.castShadow = true
  sphere.position.x = 20
  sphere.position.y = 4
  sphere.position.z = 2
  scene.add(sphere)

  const spotLight = new SpotLight(0xffffff)
  spotLight.castShadow = true
  spotLight.position.set(-40, 60, -10)
  scene.add(spotLight)

  containerRef.value?.appendChild(renderer.domElement)


  let step = 0;

  function renderScene() {
    stats.update()
    cube.rotation.x += controlRef.value.rotationSpeed
    cube.rotation.y += controlRef.value.rotationSpeed
    cube.rotation.z += controlRef.value.rotationSpeed

    // bounce the sphere up and down
    step += controlRef.value.bouncingSpeed
    sphere.position.x = 20 + 10 * Math.cos(step);
    sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));

    requestAnimationFrame(renderScene)
    renderer.render(scene, camera)
  }

  renderScene()
})
</script>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
}
</style>