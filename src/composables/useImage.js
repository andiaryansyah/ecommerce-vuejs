export function useImage() {
  const storageBase =
    import.meta.env.VITE_STORAGE_URL || "http://localhost:8000";

  const getImage = (url) => {
    if (!url) return "/placeholder-shoe.png";

    if (url.startsWith("http")) {
      if (import.meta.env.DEV) {
        return url.replace(/https?:\/\/.*\.ngrok-free\.dev/, storageBase);
      }
      return url;
    }

    return `${storageBase}${url}`;
  };
  return { getImage };
}
