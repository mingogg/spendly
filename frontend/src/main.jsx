// Es la librería principal que usamos para crear componentes y manejar la lógica de la interfaz
import React from 'react';
// Es el módulo que permite renderizar elementos React en el DOM (document object model) del navegador
import ReactDOM from 'react-dom/client';
// Es el componente principal que contiene la estructura de la aplicación, aquí se está importando TempApp.jsx y renombrandolo como App
import App from './TempApp.jsx';

// [ReactDOM.createRoot] es el método de React 18+ para iniciar una aplicación, crea la 'raíz' que controla el árbol de componentes de la aplicación
// [document.getElementById('root')] busca en el DOM un elemento con el id 'root', este elemento es el contenedor principal donde React insertará toda la aplicación
// [.render] toma el componente <App /> y lo renderiza en el contenedor HTML dentro del (<div id="root"></div>)
ReactDOM.createRoot(document.getElementById('root')).render(
    // [<React.StrictMode>] es una herramienta para detectar problemas en el código, ayuda a identificar prácticas no recomendadas o errores
    <React.StrictMode>
        {/* [App] es el componente principal de la aplicación, todo lo que esté dentro de App se renderizará en la página web */}
        <App />
    </React.StrictMode>
);