interface Token {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}

interface DialogBehavior {
  autoHide: boolean;
  hideTimeout?: number;
}

interface DialogMessage {
  title: string;
  text?: string;
  link?: { href: string; text: string };
  image?: { url: string };
}
interface DialogConfirmation {
  text: string;
  data: any;
  dataType: string;
}

interface Dialog {
  behavior: DialogBehavior;
  message: DialogMessage;
  confirmation?: DialogConfirmation;
}

export { Token, Dialog, DialogBehavior, DialogMessage };
