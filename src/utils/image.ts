/**
 * Utilidades para tratamento, validação e compressão de imagens no cliente.
 */

export const validateAndCompressImage = (
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.75
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // 1. Validar se é imagem
    if (!file.type.startsWith("image/")) {
      reject(new Error("O arquivo selecionado não é uma imagem válida."));
      return;
    }

    // 2. Limitar tamanho inicial (ex: 12MB)
    const maxSize = 12 * 1024 * 1024; // 12MB
    if (file.size > maxSize) {
      reject(new Error("A imagem é muito grande. Escolha uma imagem de até 12MB."));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Calcular novas dimensões mantendo o aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Não foi possível obter o contexto 2D do Canvas."));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Exportar como JPEG comprimido (Base64)
        const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedBase64);
      };
      img.onerror = () => {
        reject(new Error("Erro ao carregar a imagem para processamento."));
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error("Erro ao ler o arquivo de imagem."));
    };
    reader.readAsDataURL(file);
  });
};
