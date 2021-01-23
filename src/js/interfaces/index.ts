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
  text: string;
  url?: string;
  imgUrl?: string;
}

interface Dialog {
  behavior: DialogBehavior;
  message: DialogMessage;
}

export { Token, Dialog, DialogBehavior, DialogMessage };
