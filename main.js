

//creamos variables para poder elegir he imprimir la imagen, y traer el idioma
const imageInput = document.getElementById('imageInput');
const uploadedImage = document.getElementById('uploadedImage');
const targetLanguage = document.getElementById('targetLanguage');

//evento para imprimir la imagen en la pagina web
imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (file) {
        uploadedImage.src = URL.createObjectURL(file);
        uploadedImage.style.display = 'block';
    }
});

//funcion para dar la prediccion
async function predictAnimal() {
    //declaracion de variables, llamado de propiedades html, keys y endpoints
    const imageInput = document.getElementById('imageInput');

    const predictionResult = document.getElementById('predictionResult');
    const apiKey = '2f279389f85b4f8c8352bd329da4bc4c';

    const apiKeyTranslation = '9d6449b9611645fb88acfb6956198cb1';
    const translationEndpoint = 'https://api.cognitive.microsofttranslator.com/';

    // //validacion de la insercion de la imagen
    const file = imageInput.files[0];





    // Carga la imagen al servidor
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch(`https://senasoft.cognitiveservices.azure.com/customvision/v3.0/Prediction/4d9e1c91-1f1a-42b1-8f4f-f3a7a37c7351/classify/iterations/SENASOFT-IMG/image`, {
            method: 'POST',
            headers: {
                'Prediction-Key': apiKey
            },
            body: formData
        });



        //mensaje de validacion por si falla la peticion 
        if (!response.ok) {
            throw new Error('No se pudo realizar la predicción.');
        }

        //obtenemos el tag de la imagen para asignarlo a la prediccion
        const data = await response.json();
        const prediction = data.predictions[0];
        const predictedAnimal = prediction.tagName;






        //declaracion de variable que trae el idioma elegido
        const selectedLanguage = targetLanguage.value;

        //declaracion de variable que llama la funcion de traduccion y guarda el resultado de la prediccion ya traducido
        const translation = await translateText(predictedAnimal, selectedLanguage, apiKeyTranslation, translationEndpoint);

        //traemos el idioma para mostrarlo
        const selectedLanguageName = getLanguageName(selectedLanguage);
        //creamos la variable que llama a la propiedad html donde irá guardado el resultado
        const predictionResult = document.getElementById('predictionResult');

        //traemos el porcentaje de certidumbre para validar la categoria de la imagen
        const confidence = Math.round(prediction.probability * 100);
        console.log(confidence);

        //validacion del porcentaje de certidumbre(si esta debajo del 93% se considera sin categoria)
        if (confidence >= 75) {

            predictionResult.textContent = `Resultado en ${selectedLanguageName}: ${translation}.`;
        } else {
            predictionResult.textContent = `Categoria no encontrada.`
        }


    } catch (error) {

        //validacion de eleccion del idioma
        const err = targetLanguage.value

        const file1 = imageInput.files[0];

        if (err === '') {
            const predictionResult = document.getElementById('predictionResult');
            predictionResult.textContent = 'Por favor, elija un idioma antes de realizar la predicción.';
            return; // Salir de la función si no se ha seleccionado un idioma
        } else if (!file1) {
            const predictionResult = document.getElementById('predictionResult');
            predictionResult.textContent = 'Por favor, inserte una imagen desde su dispositivo.';
            return; // Salir de la función si no se ha seleccionado un idioma
        } else {
            predictionResult.textContent = 'Error en la predicción. ';
            console.error(error);

        }
    }
}


//funcion de traduccion con parametros
async function translateText(text, targetLanguage, apiKey, endpoint) {

    //region para poder usar nuestro servicio de azure
    const location = 'eastus';


    //llamamos nuestro servicio de traduccion y aplicamos metodo post
    const translationResponse = await fetch(`${endpoint}/translate?api-version=3.0&to=${targetLanguage}`, {
        method: 'POST',
        headers: {
            'Ocp-Apim-Subscription-Key': apiKey,
            'Content-Type': 'application/json',
            "Ocp-Apim-Subscription-Region": location
        },
        body: JSON.stringify([{ text }])
    });


    //guardamos el texto traducido en una variable y lo retornamos
    const translationData = await translationResponse.json();
    const translatedText = translationData[0].translations[0].text;



    return translatedText;
}

//funcion que guarda los idiomas para poder imprimirlos en el resultado de la prediccion
function getLanguageName(languageCode) {
    switch (languageCode) {
        case 'en':
            return 'Inglés(English)';
        case 'es':
            return 'Español(Español)';
        case 'fr':
            return 'Francés(Français)';
        case 'it':
            return 'Italiano(Italiano)';
        case 'de':
            return 'Alemán(Deutsch)';
        case 'pt':
            return 'Portugués(Português)';
        case 'ar':
            return 'Árabe(عربي)';
        case 'hi':
            return 'Hindi(हिंदी)';
        case 'ja':
            return 'Japonés(日本語)';
        case 'sv':
            return 'Sueco(Svenska)';
        case 'da':
            return 'Danés(Dansk)';
        case 'zh-Hans':
            return 'Chino(中文)';
        case 'nl':
            return 'Holandés(Nederlands)';
        case 'no':
            return 'Noruego(Norsk)';
        case 'el':
            return 'Griego(Ελληνικά)';
        case 'tr':
            return 'Turco(Türkçe)';
        case 'pl':
            return 'Polaco(Polski)';
        case 'cs':
            return 'Checo(Česky)';


        default:
            return 'Desconocido(Unknown)';
    }
}




const BASE_URL = "https://facesenasoft.cognitiveservices.azure.com/";
const API_KEY = "36afe7834c03475eb93b84c50283ca97";
const StartButton = document.querySelector("#start-button");
const image = document.querySelector("#image-to-detect");
const imgContainer = document.querySelector(".imgContainer");
const url = document.querySelector("#url-to-detect");
const fetchData = async (ENDPOINT, url) => {
  try {
    const response = await fetch(BASE_URL + ENDPOINT, {
      method: "POST",
      body: JSON.stringify({ url: url }), // Convert the body to a JSON string
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

const createDivToFaceRecognition = (style) => {
    const el = document.createElement("div");
    el.style.top = `${style.top}px`;
    el.style.left = `${style.left}px`;
    el.style.width = `${style.width}px`;
    el.style.height = `${style.height}px`;
    el.style.position = "absolute";
    el.style.border = "2px solid #f00";
    return el
}

StartButton.addEventListener("click", async (e) => {
  image.src = url.value;
  const data = await fetchData("face/v1.0/detect", url.value);
    data.map(el => {
        imgContainer.append(createDivToFaceRecognition(el.faceRectangle));
        console.log(el.faceRectangle);
    })
});

