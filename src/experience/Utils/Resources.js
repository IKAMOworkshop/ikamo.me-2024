import EventEmitter from "./EventEmitter";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

import { getAllGallery, getAllInsights } from '../../sanity/api'

const galleryList = await getAllGallery()
const insightsList = await getAllInsights()

export default class Resource extends EventEmitter{
    constructor(sources){
        super();
        
        this.sources = sources;

        // Setup
        this.items = {}
        this.galleryList = galleryList
        this.insightsList = insightsList
        this.toLoad = this.sources.length
        this.loaded = 0

        // Loaders
        this.setLoader();
        this.startLoading();
    }

    setLoader(){
        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader()
        this.loaders.textureLoader = new THREE.TextureLoader()
        this.loaders.fontLoader = new FontLoader()
    };

    startLoading(){
        // Loade each source
        for(const source of this.sources){
            if(source.type === 'gltfModel'){
                this.loaders.gltfLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file);
                    }
                )
            }
            else if(source.type === 'texture'){
                this.loaders.textureLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file);
                    }
                )
            }
            else if(source.type === 'font'){
                this.loaders.fontLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file)
                    }
                )
            }
        }
    }

    sourceLoaded(source, file){
        this.items[source.name] = file;

        this.loaded++

        if(this.loaded === this.toLoad){
            this.trigger('ready')
        }

    }
};