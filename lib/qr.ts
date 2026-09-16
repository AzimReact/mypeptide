import "server-only";
import QRCode from "qrcode";

export async function generatePaymentQrDataUrl(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    margin: 1,
    width: 320,
    color: {
      dark: "#17160f",
      light: "#faf8f2",
    },
  });
}
