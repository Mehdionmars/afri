/**
 * Formulaire de contact : validation côté client, anti-spam (honeypot),
 * envoi à Web3Forms sans backend, messages de succès et d'erreur.
 */

const ENDPOINT = 'https://api.web3forms.com/submit';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_MESSAGE = 20;

interface Messages {
  required: string;
  email: string;
  messageShort: string;
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
  const field = (name: string) => form.elements.namedItem(name) as Field;

  const rules: Record<string, (el: Field) => string> = {
    name: (el) => (el.value.trim() ? '' : messages.required),
    email: (el) => {
      const value = el.value.trim();
      if (!value) return messages.required;
      return EMAIL_RE.test(value) ? '' : messages.email;
    },
    message: (el) => {
      const value = el.value.trim();
      if (!value) return messages.required;
      return value.length >= MIN_MESSAGE ? '' : messages.messageShort;
    },
    consent: (el) => ((el as HTMLInputElement).checked ? '' : messages.consent),
  };

  const touched = new Set<string>();

  function check(name: string) {
    const el = field(name);
    const message = rules[name](el);
    const errorEl = form!.querySelector<HTMLElement>(`#${el.id}-error`);
    el.setAttribute('aria-invalid', String(!!message));
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.hidden = !message;
    }
    return !message;
  }

  for (const name of Object.keys(rules)) {
    const el = field(name);
    const revalidate = () => touched.has(name) && check(name);
    el.addEventListener('input', revalidate);
    el.addEventListener('change', revalidate);
    el.addEventListener('blur', () => {
      if ((el as HTMLInputElement).value || touched.has(name)) {
        touched.add(name);
        check(name);
      }
    });
  }

  function setSending(sending: boolean) {
    submit.disabled = sending;
    submit.textContent = sending ? messages.sending : messages.submit;
    form!.setAttribute('aria-busy', String(sending));
  }

  function showError(text: string) {
    errorBox.textContent = text;
    errorBox.hidden = false;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorBox.hidden = true;
    success.hidden = true;

    const names = Object.keys(rules);
    names.forEach((name) => touched.add(name));
    const invalid = names.filter((name) => !check(name));
    if (invalid.length) {
      showError(messages.summary);
      const first = field(invalid[0]);
      // Centre le champ (et son libellé) au lieu de le coller sous le header fixe.
      first.focus({ preventScroll: true });
      first.closest('div')?.scrollIntoView({ block: 'center' });
      return;
    }

    const data = Object.fromEntries(new FormData(form));

    // Un robot a coché le piège : on simule un succès sans rien envoyer.
    if (data.botcheck) {
      form.reset();
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

      form.reset();
      touched.clear();
      names.forEach((name) => field(name).removeAttribute('aria-invalid'));
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
