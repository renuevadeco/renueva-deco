# Guía: cómo actualizar fotos, nombres y descripciones del catálogo

Esta guía es para que puedas hacer cambios sencillos tú mismo desde VS Code, tanto en **Línea Hogar** como en **Línea Kids**. Para lo más técnico (agregar un producto nuevo desde cero, o una galería de varios ángulos), sigue siendo más seguro pedírmelo directamente — con solo un error de sintaxis se puede desordenar toda la página del portafolio.

Después de cualquier cambio, el proceso para publicarlo es siempre el mismo: guarda el archivo → panel de **Source Control** en VS Code (`Ctrl+Shift+G`) → escribe un mensaje → **Commit** → **Sincronizar cambios**.

---

## 1. Dónde vive todo

- **Fotos de productos:** carpeta `assets/images/portfolio/`
- **Ficha de cada producto:** carpeta `pages/`, un archivo por producto, llamado `producto-nombre-del-producto.html`
- **Vitrina/catálogo completo:** `pages/portafolio.html` (aquí están las tarjetas que se ven al entrar a Portafolio)

Cada producto vive en **dos lugares a la vez**: su propia ficha (`producto-X.html`) y su tarjeta dentro de `portafolio.html`. Si cambias algo en uno, revisa si también aplica en el otro.

---

## 2. Cambiar la foto principal de un producto que ya existe

1. Sube tu nueva foto a `assets/images/portfolio/` (arrástrala ahí en el explorador de archivos de VS Code, a la izquierda).
2. Abre `pages/producto-NOMBRE.html` (el archivo del producto que quieres actualizar).
3. Presiona `Ctrl+H` (Buscar y reemplazar **en este archivo**).
4. En "Buscar" escribe el nombre del archivo de foto viejo (ej. `hogar-1.png`), y en "Reemplazar" el nombre de tu foto nueva (ej. `hogar-1-nueva.jpg`). Dale "Reemplazar todo" — así cambias todas las apariciones de una sola vez.
5. Repite el mismo Buscar y reemplazar en `pages/portafolio.html` (ahí también aparece esa foto, como miniatura de la tarjeta).

**Importante:** el nombre del archivo debe coincidir exactamente (mayúsculas, guiones y extensión `.jpg`/`.png`/`.jpeg`).

---

## 3. Agregar varios ángulos a un producto (galería de fotos)

Esto ya existe en un producto como ejemplo: **Mecedora en Rattan Beige**, que tiene foto principal + 3 miniaturas clicables.

La forma más segura de hacerlo: sube las fotos a `assets/images/portfolio/` con nombres claros y relacionados, por ejemplo:
```
mesa-comedor-roble.jpg        (foto principal)
mesa-comedor-roble-angulo1.jpg
mesa-comedor-roble-angulo2.jpg
mesa-comedor-roble-angulo3.jpg
```
Y dime algo como: *"sube estas fotos como galería para el producto Mesa Comedor Roble"* — yo agrego el bloque de miniaturas por ti en un par de minutos, sin riesgo de romper nada.

---

## 4. Cambiar el nombre y la descripción de un producto

1. Abre `pages/producto-NOMBRE.html`.
2. Con `Ctrl+F` (Buscar), localiza y edita cada una de estas partes:

| Qué es | Qué buscar |
|---|---|
| Título de la pestaña del navegador | `<title>NOMBRE ACTUAL \| RENUEVA DECO</title>` |
| Título grande de la página | `<h1 ...>NOMBRE ACTUAL</h1>` |
| Descripción principal | `<p class="lede">...</p>` |
| Las 3 etiquetas cortas | los tres `<span class="badge">...</span>` |
| Materiales, medidas, acabado, tiempo | dentro de `<table class="spec-table">...</table>` |

3. Ve también a `pages/portafolio.html`, busca (`Ctrl+F`) el nombre **viejo** del producto, y cámbialo en su tarjeta — específicamente el texto dentro de `<h4>NOMBRE</h4>`.

**Tip:** cambia primero el nombre en el `<h1>` de la ficha, cópialo, y pégalo en los demás lugares (`<title>`, la tarjeta en portafolio) para que quede exactamente igual en todos lados.

---

## 5. Agregar un producto totalmente nuevo

Esto es lo único que recomiendo **no** hacer solo: requiere crear un archivo nuevo completo y agregar su tarjeta en `portafolio.html` sin romper el resto de la grilla.

Lo más simple: sube la(s) foto(s) a `assets/images/portfolio/` con un nombre descriptivo, y dime algo como:

> *"Sube este producto nuevo a Línea Hogar/Kids, se llama X, [breve descripción de qué es]"*

Y yo hago el resto — como con los más de 40 productos que ya están cargados.

---

## Recordatorio final

Después de cualquier edición manual, siempre:
1. Guarda el archivo (`Ctrl+S`).
2. Revisa que no se te haya quedado ninguna comilla o etiqueta a medio cerrar.
3. Sube el cambio con Source Control en VS Code.
4. Espera el despliegue en Cloudflare y revisa la página en vivo.

Si algo se ve raro después de un cambio manual, dime y lo reviso contigo.
