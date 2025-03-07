export const openPayPalWindow = (url: string) => {
  const width = 500;
  const height = 600;
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;

  window.open(
    url,
    "PayPal Checkout",
    `width=${width},height=${height},left=${left},top=${top},toolbar=0,location=0,status=0,menubar=0,scrollbars=1,resizable=1`,
  );
};
