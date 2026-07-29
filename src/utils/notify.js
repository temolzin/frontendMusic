import { Notify } from 'quasar';

const TYPE_CONFIG = {
  success: { icon: 'check_circle', color: 'positive' },
  error: { icon: 'error', color: 'negative' },
  warning: { icon: 'warning', color: 'warning' },
  info: { icon: 'info', color: 'info' },
};

const DEFAULTS = {
  position: 'top',
  timeout: 3500,
};

function show(type, message, opts = {}) {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.info;
  Notify.create({
    message,
    ...DEFAULTS,
    ...config,
    ...opts,
  });
}

export function notifySuccess(message, opts) {
  show('success', message, opts);
}

export function notifyError(message, opts) {
  show('error', message, opts);
}

export function notifyWarning(message, opts) {
  show('warning', message, opts);
}

export function notifyInfo(message, opts) {
  show('info', message, opts);
}

export function notifyPlatform(type, action, opts) {
  show(type, `Vibeer ${action}`, opts);
}

export const platformEvents = {

  reservationRegistered: (customMessage, opts) =>
    notifyPlatform(
      'success',
      customMessage || 'recibió tu solicitud. Procesaremos el pago en cuanto el artista acepte.',
      opts
    ),

  paymentError: () =>
    notifyPlatform('error', 'no pudo procesar tu pago. Intenta de nuevo.'),

  orderCreated: () =>
    notifyPlatform('success', 'creó tu orden correctamente.'),

  receiptDownloaded: () =>
    notifySuccess('Recibo descargado correctamente.'),

  incidentReceived: () =>
    notifyPlatform('success', 'recibió tu reporte. El equipo de soporte lo revisará pronto.'),
};
