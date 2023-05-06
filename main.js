Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlNmYxZTNkNC1hMmIyLTRmMmUtYTFhZi05ZGQ3ZGU3OWIzOGQiLCJpZCI6MTM2OTg5LCJpYXQiOjE2ODMzNjMyMDR9.mQi5kuXthiX3jkGYMblAymDuVaJ6dfXDf-ugyD6BCf0"

const deprem = document.getElementById('deprem')
const canvas = document.getElementById('cesiumContainer')
const url = "https://api.orhanaydogdu.com.tr/deprem/live.php?limit=50"
let result;


let viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: Cesium.createWorldTerrain(),
    animation: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        geocoder: false,
        sceneModePicker: false,
        timeline: false,
        navigationHelpButton: false,
        navigationInstructionsInitiallyVisible: false,
        scene3DOnly: true,
        shouldAnimate: true
    });
    
    //viewer.terrainProvider = Cesium.createWorldTerrain();
    
    
    document.getElementsByClassName('cesium-viewer-bottom')[0].style.display = 'none'
    
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(28.96, 41.01, 20000),
        orientation: {
            heading: Cesium.Math.toRadians(0.0),
            pitch: Cesium.Math.toRadians(-90),
            roll: 1
        }
    });
    
    
    

fetch(url).then(
    res => {
        return res.json()
    }).then(
        data => {
            result = data
})


findBiggest = () => {
    let biggest = 0
    let biggestIndex = 0
    for (let i = 0; i < result.result.length; i++) {
        if (result.result[i].mag > biggest) {
            biggest = result.result[i].mag
            biggestIndex = i
        }
    }
    return biggestIndex
}


function getDeprem() {
    const biggestIndex = findBiggest()
    var mp3_url = 'siren.mp3';
    let audio = new Audio(mp3_url)
    audio.play()
    const lat = result.result[biggestIndex].geojson.coordinates[0]
    const lon = result.result[biggestIndex].geojson.coordinates[1]
    flyTo(lat, lon, 12000, 3);
    canvas.style.animation = "shake 2.8s 2";
    alert(`En büyük deprem: ${result.result[biggestIndex].mag} büyüklüğünde ${result.result[biggestIndex].title} de meydana geldi.`)
    console.log(result.result[biggestIndex].lat)
    console.log(result.result[biggestIndex].long)
    console.log(result.result[biggestIndex].title)
    // wait 3 seconds
    setTimeout(() => {
        audio.pause();
        canvas.style.animation = "none";
    }, 4500);
}
deprem.addEventListener('click', () => getDeprem())


/*setInterval(() => {
    getDeprem()
}, 200000)*/


let flyTo = (lat, lon, alt, duration) => {
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lat, lon, alt),
        orientation: {
            heading: Cesium.Math.toRadians(0.0),
            pitch: Cesium.Math.toRadians(-90.0),
            roll: 3.0
        },
        duration: duration
    });
}
/* const osmBuildingsTileset = Cesium.createOsmBuildings();
viewer.scene.primitives.add(osmBuildingsTileset); */

