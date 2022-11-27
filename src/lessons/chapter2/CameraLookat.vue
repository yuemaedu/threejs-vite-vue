<template>
  <div ref="statsRef"></div>
  <div ref="containerRef" class="container"></div>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref, watch} from "vue";
import {
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  Camera,
  Color,
  DirectionalLight,
  Mesh,
  MeshLambertMaterial,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SphereGeometry,
  SpotLight,
  Vector3,
  WebGLRenderer
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
  perspective: 'Perspective',
  switchCamera: function () {
    if (this.perspective === 'Perspective') {
      this.perspective = 'Orthographic'
    } else {
      this.perspective = 'Perspective'
    }
  }
})
const cameraRef = ref<PerspectiveCamera | OrthographicCamera>()

function initGUI() {
  if (document.querySelectorAll(".dg.ac>.dg.main.a").length === 0) {
    const gui = new dat.GUI()
    gui.add(controlRef.value, "rotationSpeed", 0, 0.5)
    gui.add(controlRef.value, "bouncingSpeed", 0, 0.5)
    gui.add(controlRef.value, "perspective").listen()
    gui.add(controlRef.value, "switchCamera")
  }
}

initGUI()
watch(() => controlRef.value.perspective, () => {
  if (cameraRef.value instanceof PerspectiveCamera) {
    cameraRef.value = new OrthographicCamera(window.innerWidth / -16, window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / -16, -200, 500);
    cameraRef.value.position.set(-120, 60, 180)
    cameraRef.value.lookAt(scene.position);
  } else {
    cameraRef.value = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraRef.value.position.set(-120, 60, 180)
    cameraRef.value.lookAt(scene.position);
  }
})
onMounted(() => {
  // 创建场景
  stats.dom.style.top = "50px";
  statsRef.value?.append(stats.dom)
  // 创建摄像机
  cameraRef.value = new PerspectiveCamera(45,
      window.innerWidth / window.innerHeight, 0.1, 1000)
  // 设置摄像机位置
  cameraRef.value.position.set(-120, 60, 180)
  //设置摄像机朝向
  cameraRef.value.lookAt(scene.position)


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


  for (var j = 0; j < planeGeometry.parameters.height / 2; j++) {
    for (
        var i = 0;
        i < planeGeometry.parameters.width / 2;
        i++
    ) {
      const cube = new Mesh(cubeGeometry, cubeMaterial)

      cube.position.z =
          -(planeGeometry.parameters.height / 2) + 2 + j * 5
      cube.position.x =
          -(planeGeometry.parameters.width / 2) + 2 + i * 5
      cube.position.y = 0

      scene.add(cube)
    }
  }


  const ambientLight = new AmbientLight(0x0c0c0c);
  scene.add(ambientLight);

  const spotLight = new SpotLight(0xffffff)
  spotLight.castShadow = true
  spotLight.position.set(-40, 60, -10)
  scene.add(spotLight)

  containerRef.value?.appendChild(renderer.domElement)

  const lookAtGeom = new SphereGeometry(2)
  const lookAtMesh = new Mesh(
      lookAtGeom,
      new MeshLambertMaterial({
        color: 0xff0000,
      })
  )

  scene.add(lookAtMesh)
  let step = 0

  const directionalLight = new DirectionalLight(0xffffff, 0.7)
  directionalLight.position.set(-20, 40, 60)
  scene.add(directionalLight)

  function renderScene() {
    stats.update()
    requestAnimationFrame(renderScene)
    if (cameraRef.value) {
      step += 0.02
      const x = 10 + 100 * Math.sin(step)
      cameraRef.value.lookAt(new Vector3(x, 10, 0))
      lookAtMesh.position.copy(new Vector3(x, 10, 0))

      renderer.render(scene, cameraRef.value)
    }
  }

  renderScene()
  window.addEventListener('resize', () => {
    if (cameraRef.value instanceof PerspectiveCamera) {
      cameraRef.value.aspect = window.innerWidth / window.innerHeight
    }
    //更新相机投影矩阵
    cameraRef.value!.updateProjectionMatrix()
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