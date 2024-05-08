# Para probar el código:

```sh
npm install
npm run dev
```

## 🚀 Esctructura

Dentro de la carpeta se deben visualizar los siguientes directorios:
```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
└── [resto de archivos necesarios...]
```

Los archivos estáticos están en el directorio: `public/`.

## 🧞 Comandos

Todos los comandos para el proyecto:

| Comando                   | Acción                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Instalar dependencias del proyecto                            |
| `npm run dev`             | Inicia el servidor en: `localhost:4321`      |
| `npm run build`           | Crea la build del proyecto en: `./dist/`          |
| `npm run preview`         | Previsualizar build local     |
| `npm run astro ...`       | Ejecutar comandos de astro, por ej: `astro add`, `astro check` |
| `npm run astro -- --help` | Obtener ayuda del CLI de astro                     |
