//declaracion de constantes trayendo llave, endpoint y propiedades html
const BASE_URL = "https://facesenasoft.cognitiveservices.azure.com/";
const API_KEY = "36afe7834c03475eb93b84c50283ca97";
const StartButton = document.querySelector("#start-button");
const image = document.querySelector("#image-to-detect");
const imgContainer = document.querySelector(".imgContainer");
const url = document.querySelector("#url-to-detect");

//llamamos nuestro servicio de azure por medio de un fetch
const fetchData = async (ENDPOINT, url) => {
  try {
    const response = await fetch(BASE_URL + ENDPOINT, {
      method: "POST",
      body: JSON.stringify({ url: url }), 
      headers: {
        "Ocp-Apim-Subscription-Key": API_KEY,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const url1 = url.value
    if(!url1){
        alert("Url invalida.")
        return;
    }
    console.error("Error fetching data:", error);
    throw error;
  }
};

//por medio de esta constante, creamos el recuadro que señalará la imagen
const createDivToFaceRecognition = (style, imageWidth, imageHeight, containerWidth, containerHeight) => {
    const el = document.createElement("div");
    el.classList.add("facebox");
    // Calcula las coordenadas en relación con el tamaño real de la imagen y el contenedor
    const scaledTop = (style.top / imageHeight) * containerHeight + "px";
    const scaledLeft = (style.left / imageWidth) * containerWidth + "px";
    const scaledWidth = (style.width / imageWidth) * containerWidth + "px";
    const scaledHeight = (style.height / imageHeight) * containerHeight + "px";
    
    el.style.top = scaledTop;
    el.style.left = scaledLeft;
    el.style.width = scaledWidth;
    el.style.height = scaledHeight;
    el.style.position = "absolute";
    el.style.border = "2px solid #f00";
    return el;
   
}

//evento que llama al boton para poder ejecutar nuestra funcion de reconocimiento de rostros
StartButton.addEventListener("click", async (e) => {
  image.src = url.value;
  const data = await fetchData("face/v1.0/detect", url.value);
 
  const existingDivs = imgContainer.querySelectorAll(".facebox");
  existingDivs.forEach(div => {
      imgContainer.removeChild(div);
  });

    data.map(el => {
        imgContainer.append(createDivToFaceRecognition(el.faceRectangle, image.width, image.height, imgContainer.offsetWidth, imgContainer.offsetHeight));
        console.log(el.faceRectangle);
    })
});