/**
 * Demande de devis : validation côté client, compteur de caractères, anti-spam (honeypot),
 * envoi à Web3Forms sans backend, messages de succès et d'erreur.
 * Les champs à vérifier sont ceux qui portent l'attribut required dans le formulaire.
 */

const ENDPOINT = 'https://api.web3forms.com/submit';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Chiffres, espaces, +, points, tirets et parenthèses, avec au moins 8 chiffres.
const PHONE_RE = /^\+?[\d\s().-]+$/;
const MIN_PHONE_DIGITS = 8;

interface Messages {
  required: string;
  email: string;
  phone: string;
  choice: string;
  consent: string;
  summary: string;
  success: string;
  error: string;
  sending: string;
  submit: string;
}

type Field = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export function initContactForm() {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return;

  const messages = JSON.parse(form.dataset.messages ?? '{}') as Messages;
  const submit = form.querySelector<HTMLButtonElement>('[data-form-submit]')!;
  const success = form.querySelector<HTMLElement>('[data-form-success]')!;
  const errorBox = form.querySelector<HTMLElement>('[data-form-error]')!;
  const fields = [...form.querySelectorAll<Field>('input[required], select[required], textarea[required]')];

  function validate(el: Field) {
    const value = el.value.trim();
    if (el instanceof HTMLInputElement && el.type === 'checkbox') return el.checked ? '' : messages.consent;
    if (el instanceof HTMLSelectElement) return value ? '' : messages.choice;
    if (!value) return messages.required;
    if (el.type === 'email' && !EMAIL_RE.test(value)) return messages.email;
    if (el.type === 'tel' && (!PHONE_RE.test(value) || value.replace(/\D/g, '').length < MIN_PHONE_DIGITS)) return messages.phone;
    return '';
  }

  const touched = new Set<Field>();

  function check(el: Field) {
    const message = validate(el);
    const errorEl = form!.querySelector<HTMLElement>(`#${el.id}-error`);
    el.setAttribute('aria-invalid', String(!!message));
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.hidden = !message;
    }
    return !message;
  }

  // Le rappel « Vérifiez les champs signalés » disparaît dès que plus aucun champ n'est en erreur.
  function clearSummary() {
    if (errorBox.hidden || errorBox.textContent !== messages.summary) return;
    if (fields.every((el) => el.getAttribute('aria-invalid') !== 'true')) errorBox.hidden = true;
  }

  for (const el of fields) {
    const revalidate = () => {
      if (!touched.has(el)) return;
      check(el);
      clearSummary();
    };
    el.addEventListener('input', revalidate);
    el.addEventListener('change', revalidate);
    el.addEventListener('blur', () => {
      if ((el.type !== 'checkbox' && el.value) || touched.has(el)) {
        touched.add(el);
        check(el);
        clearSummary();
      }
    });
  }

  // Compteur « 0 sur 1000 » sous les précisions.
  const counter = form.querySelector<HTMLElement>('[data-counter]');
  const details = counter ? form.querySelector<HTMLTextAreaElement>(`[aria-describedby~="${counter.id}"]`) : null;
  const updateCounter = () => {
    if (!counter || !details) return;
    counter.textContent = (counter.dataset.template ?? '{n}').replace('{n}', String(details.value.length)).replace('{max}', counter.dataset.max ?? '');
  };
  details?.addEventListener('input', updateCounter);

  function setSending(sending: boolean) {
    submit.disabled = sending;
    submit.textContent = sending ? messages.sending : messages.submit;
    form!.setAttribute('aria-busy', String(sending));
  }

  function showError(text: string) {
    errorBox.textContent = text;
    errorBox.hidden = false;
  }

  function clear() {
    form!.reset();
    touched.clear();
    fields.forEach((el) => el.removeAttribute('aria-invalid'));
    updateCounter();
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorBox.hidden = true;
    success.hidden = true;

    fields.forEach((el) => touched.add(el));
    const invalid = fields.filter((el) => !check(el));
    if (invalid.length) {
      showError(messages.summary);
      const first = invalid[0];
      // Centre le champ (et son libellé) au lieu de le coller sous le header fixe.
      first.focus({ preventScroll: true });
      first.closest('div')?.scrollIntoView({ block: 'center' });
      return;
    }

    const data = Object.fromEntries(new FormData(form));

    // Un robot a coché le piège : on simule un succès sans rien envoyer.
    if (data.botcheck) {
      clear();
      success.hidden = false;
      success.focus();
      return;
    }

    if (!data.access_key) {
      console.warn('[contact] PUBLIC_WEB3FORMS_KEY manquante : le formulaire n\'est relié à aucune boîte e-mail.');
      showError(messages.error);
      return;
    }

    setSending(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) throw new Error(result.message || `HTTP ${response.status}`);

      clear();
      success.hidden = false;
      success.focus();
    } catch (error) {
      console.error('[contact] Échec de l\'envoi', error);
      showError(messages.error);
    } finally {
      clearTimeout(timeout);
      setSending(false);
    }
  });
}
