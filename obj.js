//declaracion de constantes llamando llaves, endpoint y propiedades de html
const BASE_URL2 = "https://senasoft.cognitiveservices.azure.com/";
const API_KEY2 = "2f279389f85b4f8c8352bd329da4bc4c";
const StartButton2 = document.querySelector(".start-button2");
const imgContainer2 = document.querySelector(".imgContainer2");
const image2 = document.querySelector("#image-to-detect2");
const url2 = document.querySelector("#url-to-detect2");


//traemos todo del servicio del azure por medio de un fetch
const fetchData = async (ENDPOINT, url) => {
    try {
        const response = await fetch(BASE_URL2 + ENDPOINT, {
            method: "POST",
            body: JSON.stringify({ Url: url }),
            headers: {
                "Prediction-Key": API_KEY2,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.log(`HTTP error! Status: ${response}`);
            return
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return
    }
};

//con esto creamos el recuadro que va a señalar el objeto
const createDivToRecognition = (style, probability, tag) => {
    const el = document.createElement("div");
    el.classList.add("facebox");
    el.style.top = `${style.top * 100}%`;
    el.style.left = `${style.left * 100}%`;
    el.style.width = `${style.width * 100}%`;
    el.style.height = `${style.height * 100}%`;
    el.style.position = "absolute";
    el.style.border = "2px solid #f00";
    el.style.display = "grid";
    el.style.placeContent = "center";
    el.style.opacity = probability;
    el.style.zIndex = parseInt(style.height * style.width * 100 * -1) + 120;

    const inner = document.createElement("h3");
    inner.style.color = "#fff";
    inner.style.pointerEvents = "none";
    inner.style.textShadow = "1px 1px 1px #000";
    el.style.fontSize = "2rem";
    inner.textContent = tag;

    el.addEventListener("mouseover", () => {
        el.append(inner);
        el.style.backdropFilter = "blur(5px)";
    });
    el.addEventListener("mouseout", () => {
        el.style.backdropFilter = "";
        el.removeChild(inner);
    });

    return el;
};

let EP =
    "customvision/v3.0/Prediction/44360295-e58f-4a16-8497-074ab850f48d/detect/iterations/rostros%2C%20personas%2C%20patos%20y%20perros/url";

    //evento para poder accionar la deteccion
StartButton2.addEventListener("click", async () => {
    image2.src = url2.value;
    let data;
    const imageUrl = url2.value.trim();

    if (!imageUrl) {
        alert("URL inválida. Ingresa una URL válida para la imagen.");
        return;
    }
    try {
        data = await fetchData(EP, image2.src);
    } catch (error) {
        alert("there was an error");
        return
    }
    const existingDivs = imgContainer2.querySelectorAll(".facebox");
    existingDivs.forEach(div => {
        imgContainer2.removeChild(div);
    });

    const objects = data.predictions;
    console.log(objects);
    objects.forEach((obj) => {
        if (obj.probability < 0.9) return;
        const { boundingBox } = obj;
        const { top, left, width, height } = boundingBox;
        const el = createDivToRecognition(
            { top, left, width, height },
            obj.probability,
            obj.tagName
        );
        imgContainer2.append(el);
    });
});