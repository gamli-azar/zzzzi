const imageUpload = document.getElementById("imageUpload")

// const cors ='Access-Control-Allow-Origin'
 

// Promise.all([
//     faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
//     faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
//     // faceapi.nets.faceExpressionNet.loadFromUri('/models'),
//     faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
//     // faceapi.nets.faceAgeandGenderNet.loadFromUri('/models')
// ]).then(start())

// async function start() {
//     const continet = document.createElement('div')
//     continet.style.position = 'relative'
//     document.body.append(continet)
//     // const labelDescriptor = await loadLabImages()
//     // const faceMacher =new faceapi.FaceMatcher(labelDescriptor,0.6)// <=number face
//     document.body.append('Loaded')
//     imageUpload.addEventListener('change', async () => {
//         const imag = await faceapi.bufferToImage(imageUpload.files[0])
//         continet.append(imag)
//         const canvas = faceapi.createCanvasFromMedia(imag)
//         continet.append(canvas)
//         const displaySize = { width: imag.width, height: imag.height }
//         faceapi.matchDimensions(canvas, displaySize)
//         const detection = await faceapi.detectAllFaces(imag)
//             .withFaceLandmarks().withFaceDescriptors()
//         const resizedection = faceapi.resizeResults(detection,
//             displaySize)
//         // const results = resizedection.map(d => faceMacher.findBestMatch(d.descriptor))
//         resizedection.forEach((detection) => {
//             const box = detection.detection.box
//             const drawbox = new faceapi.draw.DrawBox(box, { label: 'Face' })
//             drawbox.draw(canvas)
//         })
//     })
// } 




Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    // faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
    // faceapi.nets.faceAgeandGenderNet.loadFromUri('/models')
]).then(start)

async function start() {
    const continet = document.createElement('div')
    continet.style.position = 'relative'
    document.body.append(continet)
    const labelDescriptor = await loadLabImages()
    const faceMacher = new faceapi.FaceMatcher(labelDescriptor, 0.6)// <=number face
    document.body.append('Loaded')
    imageUpload.addEventListener('change', async () => {
        const imag = await faceapi.bufferToImage(imageUpload.files[0])
        continet.append(imag)
        const canvas = faceapi.createCanvasFromMedia(imag)
        continet.append(canvas)
        const displaySize = { width: imag.width, height: imag.height }
        faceapi.matchDimensions(canvas, displaySize)
        const detection = await faceapi.detectAllFaces(imag)
            .withFaceLandmarks().withFaceDescriptors()
        const resizedection = faceapi.resizeResults(detection,
            displaySize)
        const results = resizedection.map(d => faceMacher.findBestMatch(d.descriptor))
        results.forEach((results, i) => {
            const box = resizedection[i].detection.detection.box;
            const drawbox = new faceapi.draw.DrawBox(box, { label: results.toString() })
            drawbox.draw(canvas)
        })

    })
}
function loadLabImages() {
    const labels = ['wwew']
    return Promise.all(
        labels.map(async label => {
            const descriptions = []
            for (i = 1; i <= 2; i++) {
                // const img = await faceapi.fetchImage(`https://raw.githubusercontent.com/gamli-azar/faceapi/blob/main/DOWN.${label}/${i}.jpg`)
                const img = await faceapi.fetchImage( 'Access-Control-Allow-Origin',`https://raw.githubusercontent.com/gamli-azar/faceapi/blob/main/DOWN.${label}/${i}.jpg`)
                // const img = await faceapi.fetchImage(`/labld_img/wwew/wwew.jpg`)
                const detections = await faceapi.detectSingleFace(img)
                    .withFaceLandmarks().withFaceDescriptor()
                descriptions.push(detections.descriptor)

            }
            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        })
    )
}

