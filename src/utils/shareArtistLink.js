import { notifyError, notifySuccess } from "src/utils/notify";

const SHARE_ACTIONS = [
  {
    label: 'WhatsApp',
    icon: 'fab fa-whatsapp',
    id: 'whatsapp'
  },
  {
    label: 'Messenger',
    icon: 'fab fa-facebook-messenger',
    id: 'messenger'
  },
  {
    label: 'Instagram',
    icon: 'fab fa-instagram',
    id: 'instagram'
  },
  {
    label: 'Facebook',
    icon: 'fab fa-facebook',
    id: 'facebook'
  },
  {
    label: 'Copiar enlace',
    icon: 'content_copy',
    id: 'copy'
  }
];

export function openArtistLinkShareSheet({ q, link, shareText = '¡Mira este artista en Vibeer!' }) {
  q.bottomSheet({
    title: 'Selecciona una opción para compartir',
    actions: SHARE_ACTIONS,
  }).onOk((action) => {
    const encodedUrl = encodeURIComponent(link);
    const encodedText = encodeURIComponent(shareText);

    switch (action.id) {
      case 'whatsapp':
        window.open(`https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`, '_blank');
        break;

      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
        break;

      case 'messenger':
        window.open(`https://www.facebook.com/dialog/send?link=${encodedUrl}&redirect_uri=${encodedUrl}`, '_blank');
        break;

      case 'instagram': {
        const instagramWindow = window.open('https://www.instagram.com/', '_blank');
        if (!instagramWindow) {
          notifyError('No se pudo abrir Instagram');
          return;
        }

        (navigator.clipboard && navigator.clipboard.writeText
          ? navigator.clipboard.writeText(link)
          : q.copyToClipboard(link)
        ).then(() => {
          notifySuccess('Enlace copiado. Abriendo Instagram...');
        });
        break;
      }

      case 'copy':
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(link).then(() => {
            notifySuccess('Link copiado al portapapeles');
          });
        } else {
          q.copyToClipboard(link).then(() => {
            notifySuccess('Link copiado al portapapeles');
          });
        }
        break;
    }
  });
}
