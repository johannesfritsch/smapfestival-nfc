declare module "nfc-pcsc" {
  type Reader = {
    reader: {
      name: string;
    };
    card: Card;
    on: (event: string, callback: (card: any) => void) => void;
  };

  type Card = {
    standard: string;
    type: string;
    uid: string;
  };

  class NFC {
    on: (event: string, callback: (reader: Reader) => void) => void;
  }
}
