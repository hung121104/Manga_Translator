// src/services/imageService.js

const imageService = {
  getMangaPages: () => {
    const imageModules = import.meta.glob('../assets/mangaPages/*.(jpg|jpeg|png|gif|webp)', { eager: true });

    const imagePaths = Object.entries(imageModules).map(([, module]) => { //the comma skips the key "path"
      return module.default;
    });
    return imagePaths;
  },
};

export default imageService;
