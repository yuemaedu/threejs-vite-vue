<template>
  <div ref="statsRef"></div>
  <div ref="containerRef" class="container"></div>
</template>

<script lang="ts" setup>
import {onMounted, ref, watch} from "vue";
import {
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  Color,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SpotLight,
  WebGLRenderer,
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
  scaleX: 1,
  scaleY: 1,
  scaleZ: 1,
  positionX: 1,
  positionY: 1,
  positionZ: 1,
  translateX: 0,
  translateY: 0,
  translateZ: 0,
  translate: function () {
    return [
      this.translateX,
      this.translateY,
      this.translateZ
    ]
  },
  visible: true,
})


function initGUI() {
  if (document.querySelectorAll(".dg.ac>.dg.main.a").length === 0) {
    const gui = new dat.GUI()
    gui.add(controlRef.value, "rotationSpeed", 0, 0.5)
    gui.add(controlRef.value, "bouncingSpeed", 0, 0.5)

    const scaleFolder = gui.addFolder('scale')
    scaleFolder.add(controlRef.value, "scaleX", 0, 5)
    scaleFolder.add(controlRef.value, "scaleY", 0, 5)
    scaleFolder.add(controlRef.value, "scaleZ", 0, 5)

    const positionFolder = gui.addFolder('position')
    positionFolder.add(controlRef.value, "positionX", -5, 5)
    positionFolder.add(controlRef.value, "positionY", -5, 5)
    positionFolder.add(controlRef.value, "positionZ", -5, 5)

    const translateFolder = gui.addFolder('translate')
    translateFolder.add(controlRef.value, 'translateX', -5, 5)
    translateFolder.add(controlRef.value, 'translateY', -5, 5)
    translateFolder.add(controlRef.value, 'translateZ', -5, 5)
    translateFolder.add(controlRef.value, 'translate')

    gui.add(controlRef.value, "numberOfObjects", 0).listen()
    gui.add(controlRef.value, "visible")
  }
}

initGUI()
onMounted(() => {
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
  watch(() => controlRef.value.positionX, () => {
    cube.position.setX(controlRef.value.positionX)
  })
  watch(() => controlRef.value.positionY, () => {
    cube.position.setY(controlRef.value.positionY)
  })
  watch(() => controlRef.value.positionZ, () => {
    cube.position.setZ(controlRef.value.positionZ)
  })
  watch(() => controlRef.value.translateX, () => {
    cube.translateX(controlRef.value.translateX)
  })

  watch(() => controlRef.value.scaleX, () => {
    cube.scale.setX(controlRef.value.scaleX)
  })
  watch(() => controlRef.value.scaleY, () => {
    cube.scale.setY(controlRef.value.scaleY)
  })

  watch(() => controlRef.value.scaleZ, () => {
    cube.scale.setZ(controlRef.value.scaleZ)
  })


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