(() => {
  const DB_KEY = 'carrossel-studio-dados-v1';
  const pickFile = () => new Promise(resolve => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,image/webp';
    input.onchange = () => {
      const file = input.files && input.files[0];
      if (!file) return resolve(null);
      if (file.size > 8 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 8 MB.');
        return resolve(null);
      }
      const reader = new FileReader();
      reader.onload = () => resolve({ path: reader.result, url: reader.result });
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    };
    input.click();
  });
  const writeAndShare = async (name, base64, mime) => {
    try {
      const plugins = window.Capacitor && window.Capacitor.Plugins;
      if (!plugins || !plugins.Filesystem) throw new Error('Plugin indisponível');
      const result = await plugins.Filesystem.writeFile({
        path: name,
        data: base64,
        directory: 'CACHE',
        recursive: true
      });
      if (plugins.Share) {
        await plugins.Share.share({ title: name, url: result.uri, dialogTitle: 'Salvar ou compartilhar' });
      } else {
        alert(`Arquivo criado: ${name}`);
      }
      return true;
    } catch (error) {
      const a = document.createElement('a');
      a.href = `data:${mime};base64,${base64}`;
      a.download = name;
      a.click();
      return true;
    }
  };
  window.desktop = {
    load: async () => {
      try { return JSON.parse(localStorage.getItem(DB_KEY)) || { templates: [], projects: [] }; }
      catch { return { templates: [], projects: [] }; }
    },
    save: async data => {
      try { localStorage.setItem(DB_KEY, JSON.stringify(data)); return true; }
      catch { alert('O armazenamento do aplicativo está cheio. Remova imagens antigas ou faça um backup.'); return false; }
    },
    chooseImage: pickFile,
    fileUrl: async value => value || null,
    saveExport: async ({ name, dataUrl }) => writeAndShare(name, dataUrl.split(',')[1], dataUrl.slice(5, dataUrl.indexOf(';'))),
    saveZip: async ({ name, base64 }) => writeAndShare(name, base64, 'application/zip'),
    openDataFolder: async () => {
      const content = btoa(unescape(encodeURIComponent(localStorage.getItem(DB_KEY) || '{}')));
      return writeAndShare('carrossel-studio-backup.json', content, 'application/json');
    }
  };
})();
