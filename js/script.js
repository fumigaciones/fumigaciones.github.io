const claveApi = '9e122cd782b2d0333f5fe4e7fa192062';

// Función para obtener la ubicación del usuario
function obtenerUbicacionUsuario() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            obtenerClima(null, lat, lon);
        }, function() {
            alert("No se pudo obtener tu ubicación.");
        });
    } else {
        alert("La geolocalización no está soportada en este navegador.");
    }
}

// Función para consultar el clima
async function obtenerClima(ciudad, lat, lon) {
    try {
        let url;

        if (ciudad) {
            url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${claveApi}&lang=es&units=metric`;
        } else if (lat && lon) {
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${claveApi}&lang=es&units=metric`;
        } else {
            throw new Error('Debe ingresar ciudad o coordenadas');
        }

        const respuesta = await axios.get(url);
        const datos = respuesta.data;

        // Mostrar los resultados del clima
        document.getElementById('nombreCiudad').innerText = `${datos.name}, ${datos.sys.country}`;
        document.getElementById('temperatura').innerText = `${datos.main.temp} °C`;
        document.getElementById('descripcionClima').innerText = datos.weather[0].description;

        // Mostrar el icono del clima
        const iconoClima = obtenerIconoClima(datos.weather[0].main);
        document.getElementById('iconoClima').innerHTML = `<i class="wi wi-${iconoClima}"></i>`;

        // Mostrar las coordenadas
        document.getElementById('latitud').innerText = datos.coord.lat;
        document.getElementById('longitud').innerText = datos.coord.lon;

        // Cambiar el fondo según el clima
        cambiarFondo(datos.weather[0].main);

        // Mostrar el resultado y ocultar el mensaje de error
        document.getElementById('resultadoClima').style.display = 'block';
        document.getElementById('mensajeError').style.display = 'none';
    } catch (error) {
        // En caso de error, mostrar mensaje
        document.getElementById('resultadoClima').style.display = 'none';
        document.getElementById('mensajeError').style.display = 'block';
    }
}

// Función para obtener el icono del clima con Weather Icons
function obtenerIconoClima(clima) {
    switch (clima) {
        case 'Clear': return 'day-sunny';
        case 'Clouds': return 'cloudy';
        case 'Rain': return 'rain';
        case 'Snow': return 'snow';
        case 'Thunderstorm': return 'thunderstorm';
        case 'Drizzle': return 'showers';
        case 'Mist': return 'fog';
        default: return 'day-sunny';
    }
}

// Función para cambiar el fondo según el clima
function cambiarFondo(clima) {
    const body = document.body;
    switch (clima) {
        case 'Clear': body.style.background = '#ffeb3b'; break;
        case 'Clouds': body.style.background = '#90caf9'; break;
        case 'Rain': body.style.background = '#64b5f6'; break;
        case 'Snow': body.style.background = '#80deea'; break;
        case 'Thunderstorm': body.style.background = '#f44336'; break;
        case 'Drizzle': body.style.background = '#c5cae9'; break;
        case 'Mist': body.style.background = '#b0bec5'; break;
        default: body.style.background = '#e0f7fa'; break;
    }
}

document.getElementById('formularioClima').addEventListener('submit', function(evento) {
    evento.preventDefault();

    const ciudad = document.getElementById('entradaCiudad').value;
    const lat = document.getElementById('entradaLatitud').value;
    const lon = document.getElementById('entradaLongitud').value;

    obtenerClima(ciudad, lat, lon);
});

window.onload = obtenerUbicacionUsuario;
