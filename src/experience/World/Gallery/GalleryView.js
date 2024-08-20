import Experienece from '../../Experience'

import * as THREE from 'three'

import imagePlateVer from '../../Shaders/imagePlate/vertex.glsl'
import imagePlateFrag from '../../Shaders/imagePlate/fragment.glsl'

export default class GalleryView {
    constructor(){
        this.experience = new Experienece()
        this.pageChange = this.experience.pageChange
        this.scroll = this.experience.scroll
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.cursor = this.experience.cursor
        this.drag = this.experience.drag

        this.textureLoader = new THREE.TextureLoader()


        this.setScene()
        this.setCamera()
        this.getImage()
        this.setImage()
    }

    setScene(){
        this.scene = new THREE.Scene()
        this.background = this.resources.items.background
        this.background.colorSpace = THREE.SRGBColorSpace
        this.scene.background = this.background
    }

    setCamera(){
        this.camera = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 0.1, 100)
        this.camera.position.set(0, 0, 5)
        this.scene.add(this.camera)
    }

    getImage(){
        this.pageImage = document.querySelectorAll('.gallery-view img')
        console.log(this.pageImage)
    }

    setImage(){
        this.imagePlaneGeometry = new THREE.PlaneGeometry(1, 1, 1, 1)
        this.imageGap = 2
        this.imageGroup = new THREE.Group()
        this.imageList = []
        this.camUnit = this.calculateUniteSize(this.camera.position.z)
        this.imageSizeMultiplier = .5
        
        this.pageImage.forEach((image, i) => {
            const imageData = {}

            imageData.image = image
            imageData.texture = this.textureLoader.load(imageData.image.src)
            imageData.imageBooundingData = image.getBoundingClientRect()

            const x = imageData.imageBooundingData.width / this.sizes.width
            const y = imageData.imageBooundingData.height / this.sizes.height

            if(!x || !y){
                return
            }

            imageData.finalScaleX = this.camUnit.width * x * this.imageSizeMultiplier
            imageData.finalScaleY = this.camUnit.height * y * this.imageSizeMultiplier

            imageData.imageMaterial = new THREE.ShaderMaterial({
                vertexShader: imagePlateVer,
                fragmentShader: imagePlateFrag,
                uniforms: {
                    uTexture: new THREE.Uniform(imageData.texture),
                    uOpacity: new THREE.Uniform(.1)
                },
                transparent: true,
            })
            imageData.imageMesh = new THREE.Mesh(this.imagePlaneGeometry, imageData.imageMaterial)
            imageData.imageMesh.scale.set(imageData.finalScaleX, imageData.finalScaleY, 0)

            imageData.imageMesh.position.x = imageData.finalScaleX * (i * this.imageGap)
            imageData.imageMesh.position.y = i % 3 - 1

            this.imageGroup.add(imageData.imageMesh)

            this.imageList.push(imageData)

            console.log(imageData)
        })
        this.imageGroup.position.x = -(this.pageImage.length * 1)
        this.scene.add(this.imageGroup)
    }

    calculateUniteSize(distance){
        const vFov = this.camera.fov * Math.PI / 180
        const height = 2 * Math.tan(vFov / 2) * distance
        const width = height * this.camera.aspect
        return { width, height }
    }

    update(){
        this.imageList.forEach(object => {
            object.imageMesh.position.x = ((- this.scroll.infiniteScroll / this.sizes.width * 6) + (object.imageMesh.position.x) + (object.finalScaleX * this.imageList.length * this.imageGap)) % (object.finalScaleX * this.imageList.length * this.imageGap)
        })
    }
}