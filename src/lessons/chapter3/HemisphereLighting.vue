<template>
  <div ref="statsRef"></div>
  <div ref="containerRef" class="container"></div>
</template>

<script lang="ts" setup>
import {
  onMounted, ref, watch
} from "vue";
import {
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  CameraHelper,
  Color,
  DirectionalLight, Fog, HemisphereLight,
  ImageUtils,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight, RepeatWrapping,
  Scene,
  SphereGeometry,
  SpotLight, TextureLoader,
  Vector3,
  WebGLRenderer
} from 'three'
import Stats from 'stats.js'
import * as dat from 'dat.gui';
import grasslight from '../../assets/grasslight-big.jpg'

const scene = new Scene()
const containerRef = ref<HTMLDivElement>()
const statsRef = ref<HTMLDivElement>()
const stats = new Stats()
const controlRef = ref({
  ambientColor: "#0c0c0c",
  pointColor: "#ccffcc",
  directionalColor: "#ccffcc",
  skyColor : 0x0000ff,
  distance: 100,
  intensity: 1,
  target: 'plane',
  debug: false,
})


function initGUI() {
  if (document.querySelectorAll(".dg.ac>.dg.main.a").length === 0) {
    const gui = new dat.GUI()
    gui.addColor(controlRef.value, "ambientColor")
    gui.addColor(controlRef.value, "skyColor")
    gui.add(controlRef.value, "distance", 0, 100)
    gui.add(controlRef.value, "intensity", 0, 3)
    gui.add(controlRef.value, "debug")
    gui.addColor(controlRef.value, "directionalColor")
    gui.add(controlRef.value, "target", ['plane', 'cube', 'sphere']).listen()
  }
}

initGUI()
onMounted(() => {
  // 创建场景
  scene.fog = new Fog(0xaaaaaa, 0.01, 200)

  stats.dom.style.top = "50px";
  statsRef.value?.append(stats.dom)
  // 创建摄像机
  const camera = new PerspectiveCamera(45,
      window.innerWidth / window.innerHeight, 0.1, 1000)
  // 设置摄像机位置
  camera.position.set(-20, 15, 45)
  //设置摄像机朝向
  camera.lookAt(new Vector3(10, 0, 0))

  const renderer = new WebGLRenderer()
  renderer.setClearColor(new Color(0xaaaaff))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true

  const axes = new AxesHelper(20)
  scene.add(axes)
  const textureGrass = new TextureLoader()
      .load(grasslight)
  // 纹理在水平方向上纹理包裹方式
  textureGrass.wrapS = RepeatWrapping
  // 纹理贴图在垂直方向上的包裹方式
  textureGrass.wrapT = RepeatWrapping
  // 用来设置纹理将在表面上，分别在U、V方向重复多少次
  textureGrass.repeat.set(4, 4)
  const planeGeometry = new PlaneGeometry(1000, 200, 20, 20)
  const meshBasicMaterial = new MeshLambertMaterial({
    map: textureGrass
  })
  const plane = new Mesh(planeGeometry, meshBasicMaterial)
  plane.receiveShadow = true
  plane.rotation.x = -0.5 * Math.PI
  plane.position.x = 15
  plane.position.y = 0
  plane.position.z = 0
  scene.add(plane)

  const hemisphereLight = new HemisphereLight(
      0x0000ff,
      0x00ff00,
      0.6
  )
  hemisphereLight.position.set(0, 500, 0)
  scene.add(hemisphereLight)

  watch(() => controlRef.value.directionalColor, (c) => {
    hemisphereLight.color = new Color(c)
  })
  watch(()=>controlRef.value.intensity,(v)=>{
    hemisphereLight.intensity=v
  })

  watch(()=>controlRef.value.skyColor,(v)=>{
    hemisphereLight.color=new Color(v)
  })

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

  const ambientLight = new AmbientLight(controlRef.value.ambientColor);
  scene.add(ambientLight);
  const spotLight0 = new SpotLight(0xcccccc)
  spotLight0.position.set(-40, 30, -10)
  spotLight0.lookAt(plane.position)
  scene.add(spotLight0)


  watch(() => controlRef.value.ambientColor, () => {
    ambientLight.color = new Color(controlRef.value.ambientColor)
  })


  // 平行光不像是SpotLight以及PointLight那样距离物体越远，光的强度就不一样，
  // 而DirectionalLight所散发出来的光，所照射的整个区域范围内光强是一样。
  const directionalColor = "#ff5808"
  const directionalLight = new DirectionalLight(directionalColor)
  directionalLight.position.set(-40, 60, -10)
  directionalLight.castShadow = true
  directionalLight.intensity = 0.5

  scene.add(directionalLight)


  //调试相机
  const cameraHelper = new CameraHelper(directionalLight.shadow.camera)
  watch(() => controlRef.value.debug, (n) => {
    if (n) {
      scene.add(cameraHelper)
    } else {
      scene.remove(cameraHelper)
    }
  })

  watch(() => controlRef.value.directionalColor, (c) => {
    directionalLight.color = new Color(c)
  })
  watch(() => controlRef.value.target, (t) => {
    if (t === 'cube') {
      directionalLight.target = cube
    } else if (t === 'sphere') {
      directionalLight.target = sphere
    } else {
      directionalLight.target = plane
    }
  })
  const lookAtGeom = new SphereGeometry(1)
  const lookAtMesh = new Mesh(
      lookAtGeom,
      new MeshLambertMaterial({
        color: 0xff0000,
      })
  )
  scene.add(lookAtMesh)

  containerRef.value?.appendChild(renderer.domElement)
  let step = 0

  function renderScene() {
    stats.update()
    step += 0.1
    lookAtMesh.position.set(20 + 10 * Math.cos(step), 10 + 10 * Math.abs(Math.sin(step)), 10 * Math.cos(step))
    hemisphereLight.position.copy(lookAtMesh.position)
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