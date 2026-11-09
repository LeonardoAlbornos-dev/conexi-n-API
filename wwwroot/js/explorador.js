/*
 * Explorador de contenido aleatorio
 * Cada sección consulta su API de forma independiente.
 */

const API_URLS = {
    quote: "https://dummyjson.com/quotes/random",
    dog: "https://dog.ceo/api/breeds/image/random",
    cat: "https://cataas.com/cat?json=true",
    fact: "https://uselessfacts.jsph.pl/api/v2/facts/random?language=en"
};

const elements = {
    quote: {
        button: document.getElementById("quote-button"),
        status: document.getElementById("quote-status"),
        text: document.getElementById("quote-text"),
        author: document.getElementById("quote-author")
    },
    dog: {
        button: document.getElementById("dog-button"),
        status: document.getElementById("dog-status"),
        image: document.getElementById("dog-image"),
        placeholder: document.getElementById("dog-placeholder")
    },
    cat: {
        button: document.getElementById("cat-button"),
        status: document.getElementById("cat-status"),
        image: document.getElementById("cat-image"),
        placeholder: document.getElementById("cat-placeholder")
    },
    fact: {
        button: document.getElementById("fact-button"),
        status: document.getElementById("fact-status"),
        text: document.getElementById("fact-text")
    }
};

/**
 * Ejecuta una consulta mostrando el estado de carga y controlando el botón.
 * El finally garantiza que el botón vuelva a habilitarse incluso si hay error.
 */
async function runSection(section, requestFunction) {
    const ui = elements[section];

    ui.button.disabled = true;
    ui.status.textContent = "Cargando...";
    ui.status.classList.remove("error");

    try {
        await requestFunction();
    } catch (error) {
        console.error(`Error en la sección ${section}:`, error);
        ui.status.textContent = "No se pudo cargar el contenido. Comprueba tu conexión e inténtalo nuevamente.";
        ui.status.classList.add("error");
    } finally {
        ui.button.disabled = false;
    }
}

/** 1. Consulta una cita y su autor desde DummyJSON. */
async function loadRandomQuote() {
    await runSection("quote", async () => {
        const response = await fetch(API_URLS.quote);
        if (!response.ok) {
            throw new Error(`La API de citas respondió con HTTP ${response.status}`);
        }

        const data = await response.json();
        if (!data.quote || !data.author) {
            throw new Error("La respuesta de citas no contiene quote o author.");
        }

        elements.quote.text.textContent = `“${data.quote}”`;
        elements.quote.author.textContent = `— ${data.author}`;
        elements.quote.status.textContent = "";
    });
}

/** 2. Consulta una imagen aleatoria desde Dog CEO. */
async function loadRandomDog() {
    await runSection("dog", async () => {
        const response = await fetch(API_URLS.dog);
        if (!response.ok) {
            throw new Error(`La API de perros respondió con HTTP ${response.status}`);
        }

        const data = await response.json();
        if (data.status !== "success" || !data.message) {
            throw new Error("La API de perros no devolvió una imagen válida.");
        }

        await displayAnimalImage("dog", data.message);
        elements.dog.status.textContent = "";
    });
}

/** 3. Consulta los metadatos JSON de CATAAS y construye/usa la URL de la imagen. */
async function loadRandomCat() {
    await runSection("cat", async () => {
        const response = await fetch(API_URLS.cat);
        if (!response.ok) {
            throw new Error(`La API de gatos respondió con HTTP ${response.status}`);
        }

        // CATAAS con ?json=true devuelve JSON (no una imagen binaria).
        // La respuesta observada incluye id y url; se prioriza url.
        const data = await response.json();
        const imageUrl = data.url || (data.id
            ? `https://cataas.com/cat/${encodeURIComponent(data.id)}`
            : null);

        if (!imageUrl) {
            throw new Error("La respuesta de CATAAS no contiene url ni id.");
        }

        await displayAnimalImage("cat", imageUrl);
        elements.cat.status.textContent = "";
    });
}

/** 4. Consulta un dato curioso desde Useless Facts. */
async function loadRandomFact() {
    await runSection("fact", async () => {
        const response = await fetch(API_URLS.fact);
        if (!response.ok) {
            throw new Error(`La API de datos curiosos respondió con HTTP ${response.status}`);
        }

        const data = await response.json();
        if (!data.text) {
            throw new Error("La respuesta no contiene el campo text.");
        }

        elements.fact.text.textContent = data.text;
        elements.fact.status.textContent = "";
    });
}

/**
 * Carga una imagen y espera a que el navegador confirme si pudo mostrarse.
 * Así también se controlan errores al descargar la imagen, no solo al pedir el JSON.
 */
function displayAnimalImage(animal, imageUrl) {
    const ui = elements[animal];

    return new Promise((resolve, reject) => {
        ui.image.onload = () => {
            ui.image.hidden = false;
            ui.placeholder.hidden = true;
            resolve();
        };

        ui.image.onerror = () => {
            ui.image.hidden = true;
            ui.placeholder.hidden = false;
            ui.placeholder.textContent = "No se pudo cargar la imagen. Inténtalo nuevamente.";
            reject(new Error(`No se pudo descargar la imagen de ${animal}.`));
        };

        ui.image.hidden = true;
        ui.placeholder.hidden = false;
        ui.placeholder.textContent = "Cargando imagen...";
        ui.image.src = imageUrl;
    });
}

// Eventos independientes: cada botón actualiza únicamente su propia tarjeta.
elements.quote.button.addEventListener("click", loadRandomQuote);
elements.dog.button.addEventListener("click", loadRandomDog);
elements.cat.button.addEventListener("click", loadRandomCat);
elements.fact.button.addEventListener("click", loadRandomFact);

// Carga inicial independiente: si una API falla, las otras siguen funcionando.
loadRandomQuote();
loadRandomDog();
loadRandomCat();
loadRandomFact();
