/* RENUEVA DECO — Validación de formularios, carga de imágenes y envío real */

/* ============================================================
   Para que los formularios de Contacto, Cotizaciones y Reseñas
   te lleguen por correo, obtén tu llave gratuita en:
   https://web3forms.com  (ingresa renueva.deco.carpinteria@gmail.com
   y te enviarán la "Access Key" a ese correo al instante).
   Pega esa llave aquí abajo, reemplazando el texto de ejemplo:
   ============================================================ */
const WEB3FORMS_ACCESS_KEY = '7d4701c8-575a-434e-837c-ef1ceab53093';
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

/* El plan gratuito de Web3Forms no permite adjuntar archivos, así que el
   formulario de Cotizaciones (que sí adjunta imágenes) usa FormSubmit.co en
   su modo de envío nativo (data-mailer="formsubmit") — FormSubmit solo
   procesa adjuntos con un envío de formulario tradicional, no por AJAX. */

document.addEventListener('DOMContentLoaded', () => {

  /* ===== Zonas de carga de imágenes (drag & drop) =====
     FormSubmit no soporta un solo campo con varios archivos (multiple);
     necesita un input por archivo. Por eso el input visible solo sirve
     para elegir/soltar imágenes, y aquí las repartimos en los inputs
     ocultos (attachment1..6) que sí se envían con el formulario. */
  document.querySelectorAll('.upload-zone').forEach(zone => {
    const input = document.getElementById(zone.dataset.input);
    const previews = document.querySelector(zone.dataset.previews);
    const attachmentsBox = zone.dataset.attachments ? document.querySelector(zone.dataset.attachments) : null;
    const hiddenInputs = attachmentsBox ? Array.from(attachmentsBox.querySelectorAll('input[type="file"]')) : [];
    if (!input) return;

    const MAX_FILES = hiddenInputs.length || 6;
    let selectedFiles = [];

    zone.addEventListener('click', () => input.click());
    zone.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } });

    ['dragenter', 'dragover'].forEach(evt => {
      zone.addEventListener(evt, (e) => { e.preventDefault(); zone.classList.add('is-dragover'); });
    });
    ['dragleave', 'drop'].forEach(evt => {
      zone.addEventListener(evt, (e) => { e.preventDefault(); zone.classList.remove('is-dragover'); });
    });
    zone.addEventListener('drop', (e) => {
      const files = Array.from(e.dataTransfer.files || []).filter(f => f.type.startsWith('image/'));
      addFiles(files);
    });
    input.addEventListener('change', () => {
      addFiles(Array.from(input.files || []));
      input.value = '';
    });

    function addFiles(files) {
      const room = Math.max(0, MAX_FILES - selectedFiles.length);
      selectedFiles = selectedFiles.concat(files.slice(0, room));
      renderPreviews();
      syncHiddenInputs();
    }

    function removeFile(index) {
      selectedFiles.splice(index, 1);
      renderPreviews();
      syncHiddenInputs();
    }

    function renderPreviews() {
      if (!previews) return;
      previews.innerHTML = '';
      selectedFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const thumb = document.createElement('div');
          thumb.className = 'upload-thumb';
          thumb.innerHTML = `<img src="${e.target.result}" alt="${file.name}"><button type="button" class="remove" aria-label="Quitar imagen">&times;</button>`;
          thumb.querySelector('.remove').addEventListener('click', () => removeFile(index));
          previews.appendChild(thumb);
        };
        reader.readAsDataURL(file);
      });
    }

    function syncHiddenInputs() {
      hiddenInputs.forEach((hiddenInput, i) => {
        const dt = new DataTransfer();
        if (selectedFiles[i]) dt.items.add(selectedFiles[i]);
        hiddenInput.files = dt.files;
      });
    }

    zone._resetUploads = () => {
      selectedFiles = [];
      renderPreviews();
      syncHiddenInputs();
    };
  });

  /* ===== Validación y envío real (Web3Forms) ===== */
  document.querySelectorAll('.validate-form').forEach(form => {
    const successPanel = form.parentElement.querySelector('.success-panel');
    const submitBtn = form.querySelector('[type="submit"]');
    const submitLabel = submitBtn ? submitBtn.querySelector('.btn-label') : null;

    const errorMsg = document.createElement('p');
    errorMsg.className = 'form-error-msg';
    errorMsg.textContent = 'No pudimos enviar tu mensaje. Intenta de nuevo o escríbenos directo por WhatsApp.';
    form.appendChild(errorMsg);

    const useFormSubmit = form.dataset.mailer === 'formsubmit';

    form.addEventListener('submit', (e) => {
      errorMsg.classList.remove('is-visible');
      let isValid = true;
      let firstInvalid = null;

      form.querySelectorAll('[required]').forEach(input => {
        const field = input.closest('.field');
        if (!field) return;
        const valid = input.checkValidity();
        field.classList.toggle('has-error', !valid);
        if (!valid) {
          isValid = false;
          if (!firstInvalid) firstInvalid = input;
        }
      });

      if (!isValid) {
        e.preventDefault();
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        if (submitLabel) submitLabel.textContent = 'Enviando...';
        submitBtn.classList.add('is-loading');
      }

      /* FormSubmit necesita un envío de formulario real (no AJAX) para
         poder adjuntar archivos, así que aquí se deja seguir su curso normal. */
      if (useFormSubmit) return;

      e.preventDefault();
      const formData = new FormData(form);
      formData.append('access_key', WEB3FORMS_ACCESS_KEY);
      formData.append('from_name', 'RENUEVA DECO — Sitio Web');
      formData.append('subject', form.dataset.subject || 'Nuevo mensaje desde renuevadeco.com');

      fetch(WEB3FORMS_ENDPOINT, { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            if (form.dataset.saveReview && window.saveReviewToFirestore) {
              window.saveReviewToFirestore(formData);
            }
            form.classList.add('hidden-form');
            if (successPanel) successPanel.classList.add('is-visible');
          } else {
            throw new Error(data.message || 'Error de envío');
          }
        })
        .catch((err) => {
          console.error('Error al enviar el formulario:', err);
          errorMsg.classList.add('is-visible');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('is-loading');
          }
          if (submitLabel) submitLabel.textContent = submitBtn.dataset.defaultLabel || 'Enviar';
        });
    });

    form.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('input', () => {
        const field = input.closest('.field');
        if (field && field.classList.contains('has-error') && input.checkValidity()) {
          field.classList.remove('has-error');
        }
      });
    });
  });

  document.querySelectorAll('[data-form-reset]').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('.form-shell, .modal-box');
      if (!wrapper) return;
      const form = wrapper.querySelector('.validate-form');
      const successPanel = wrapper.querySelector('.success-panel');
      const submitBtn = form ? form.querySelector('[type="submit"]') : null;
      const submitLabel = submitBtn ? submitBtn.querySelector('.btn-label') : null;

      if (form) {
        form.reset();
        form.classList.remove('hidden-form');
        form.querySelectorAll('.field.has-error').forEach(f => f.classList.remove('has-error'));
        const errorMsg = form.querySelector('.form-error-msg');
        if (errorMsg) errorMsg.classList.remove('is-visible');
      }
      if (successPanel) successPanel.classList.remove('is-visible');
      if (submitBtn) { submitBtn.disabled = false; submitBtn.classList.remove('is-loading'); }
      if (submitLabel) submitLabel.textContent = submitBtn.dataset.defaultLabel || 'Enviar';
      wrapper.querySelectorAll('.upload-zone').forEach(zone => { if (zone._resetUploads) zone._resetUploads(); });
    });
  });

  /* FormSubmit redirige de vuelta con ?enviado=1 tras un envío exitoso
     (ver _next en el formulario de Cotizaciones) — mostramos el agradecimiento. */
  if (new URLSearchParams(location.search).get('enviado') === '1') {
    const form = document.querySelector('.validate-form[data-mailer="formsubmit"]');
    const successPanel = form ? form.parentElement.querySelector('.success-panel') : null;
    if (form) form.classList.add('hidden-form');
    if (successPanel) successPanel.classList.add('is-visible');
    history.replaceState(null, '', location.pathname);
  }
});
