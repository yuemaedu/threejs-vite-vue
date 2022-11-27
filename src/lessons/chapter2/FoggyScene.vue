<template>
  <div ref="statsRef"></div>
  <div ref="containerRef" class="container"></div>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref, watch} from "vue";
import {
  AmbientLight,
  AxesHelper, BoxGeometry, Color, Fog, Mesh, MeshLambertMaterial, PerspectiveCamera,
  PlaneGeometry, Scene, SphereGeometry, SpotLight, WebGLRenderer
} from 'three'
import Stats from 'stats.js'
import * as dat from 'dat.gui';

const scene = new Scene()
const containerRef = ref<HTMLDivElement>()
const statsRef = ref<HTMLDivElement>()
const stats = new Stats()
const controlRef = ref({
  rotationSpeed: 0.02,
  bouncingSpeed: 0.03,
  numberOfObjects: 0,
  addCube: function () {
    const cubeGeometry = new BoxGeometry(4, 4, 4)
    const cubeMaterial = new MeshLambertMaterial({color: Math.random() * 0xffffff})
    const cube = new Mesh(cubeGeometry, cubeMaterial)
    cube.name = "cube-" + scene.children.length;
    cube.castShadow = true
    cube.position.x = -30 + Math.round((Math.random() * 60))
    cube.position.y = Math.round((Math.random() * 5));
    cube.position.z = -20 + Math.round((Math.random() * 40));
    scene.add(cube)
    this.numberOfObjects = scene.children.length
  },
  removeCube: function () {
    const allChildren = scene.children;
    const lastObject = allChildren[allChildren.length - 1];
    if (lastObject instanceof Mesh) {
      scene.remove(lastObject);
      this.numberOfObjects = scene.children.length
    }
  }
})


function initGUI() {
  if (document.querySelectorAll(".dg.ac>.dg.main.a").length === 0) {
    const gui = new dat.GUI()
    gui.add(controlRef.value, "rotationSpeed", 0, 0.5)
    gui.add(controlRef.value, "bouncingSpeed", 0, 0.5)
    gui.add(controlRef.value, "numberOfObjects", 0).listen()
    gui.add(controlRef.value, "addCube")
    gui.add(controlRef.value, "removeCube")
  }
}

initGUI()
onMounted(() => {
  // 创建场景
  scene.fog=new Fog(0xffffff, 0.015, 100)
  stats.dom.style.top = "50px";
  statsRef.value?.append(stats.dom)
  // 创建摄像机
  const camera = new PerspectiveCamera(45,
      window.innerWidth / window.innerHeight, 0.1, 1000)
  // 设置摄像机位置
  camera.position.set(-30, 40, 30)
  //设置摄像机朝向
  camera.lookAt(scene.position)

  const renderer = new WebGLRenderer()
  renderer.setClearColor(new Color(0xEEEEEE))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true

  const axes = new AxesHelper(20)
  scene.add(axes)

  const planeGeometry = new PlaneGeometry(60, 40, 1, 1)
  const meshBasicMaterial = new MeshLambertMaterial({color: 0xffffff})
  const plane = new Mesh(planeGeometry, meshBasicMaterial)
  plane.receiveShadow = true
  plane.rotation.x = -0.5 * Math.PI
  plane.position.x = 0
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

  const ambientLight = new AmbientLight(0x0c0c0c);
  scene.add(ambientLight);

  const spotLight = new SpotLight(0xffffff)
  spotLight.castShadow = true
  spotLight.position.set(-40, 60, -10)
  scene.add(spotLight)

  containerRef.value?.appendChild(renderer.domElement)


  function renderScene() {
    stats.update()
    scene.traverse((e) => {
      if (e instanceof Mesh && e != plane) {
        e.rotation.x += controlRef.value.rotationSpeed;
        e.rotation.y += controlRef.value.rotationSpeed;
        e.rotation.z += controlRef.value.rotationSpeed;
      }
    })
    requestAnimationFrame(renderScene)
    renderer.render(scene, camera)
  }

  renderScene()
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    //更新相机投影矩阵
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }, false)
})
</script>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
}
</style>