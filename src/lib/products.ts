import type { Product } from '@/lib/types';

const rawProducts = {
  '1': {
    id: 1,
    name: 'Quadros Artísticos',
    basePrice: 1000.0,
    stock: 5,
    sold: 2348,
    description:
      'Quadros artísticos com mensagens inspiradoras, perfeitos para decorar qualquer ambiente. Feitos com materiais de alta qualidade e técnicas artesanais. Inclui moldura em madeira nobre.',
    types: [
      { id: 1, name: 'Ele Vive', image: 'https://i.postimg.cc/ht51fqKK/2025-10-26-22-26-45.jpg' },
      { id: 2, name: 'Pai Nosso', image: 'https://i.postimg.cc/xCrG3ykg/2025-10-26-22-26-52.jpg' },
      { id: 3, name: 'Jesus Me Salvou', image: 'https://i.postimg.cc/0QgG0d6V/2025-10-26-22-26-56.jpg' },
      { id: 4, name: 'Jesus Cristo', image: 'https://i.postimg.cc/zGcFV1qr/2025-10-26-22-27-10.jpg' },
      { id: 5, name: 'Foco', image: 'https://http2.mlstatic.com/D_NQ_NP_2X_813738-MLB52235990771_112022-F-kit-3-quadros-decorativos-disciplina-foco-execuco-leo-lobo.webp' },
      { id: 6, name: 'Disciplina', image: 'https://http2.mlstatic.com/D_NQ_NP_2X_703972-MLB52236099226_112022-F-kit-3-quadros-decorativos-disciplina-foco-execuco-leo-lobo.webp' },
      { id: 7, name: 'Execução', image: 'https://http2.mlstatic.com/D_NQ_NP_2X_671812-MLB52236103184_112022-F-kit-3-quadros-decorativos-disciplina-foco-execuco-leo-lobo.webp' },
      { id: 8, name: 'Yeshua', image: 'https://i.postimg.cc/q7Brdn28/Whats-App-Image-2025-10-30-at-21-42-26.jpg' },
      { id: 9, name: 'Paz', image: 'https://i.postimg.cc/1tzjvrDm/Whats-App-Image-2025-10-30-at-21-42-16.jpg' },
      { id: 10, name: 'Fé', image: 'https://i.postimg.cc/6q21X6HT/Whats-App-Image-2025-10-30-at-21-42-23.jpg' },
      { id: 11, name: 'Coroado', image: 'https://i.postimg.cc/Dz6NQMJq/Whats-App-Image-2025-10-30-at-21-42-13.jpg' },
      { id: 12, name: 'Cruz + Leão', image: 'https://i.postimg.cc/W3ffCq7T/Whats-App-Image-2025-10-30-at-21-42-19.jpg' },
      { id: 13, name: 'Cruz', image: 'https://i.postimg.cc/9MNNKwB5/Whats-App-Image-2025-10-30-at-21-42-23-1.jpg' },
    ],
    sizes: {
      A4: { price: 1500.0, discountPrice: 1000.0, discountQuantity: 2 },
      A3: { price: 2000.0, discountPrice: 1300.0, discountQuantity: 3 },
      A2: { price: 2500.0, discountPrice: 2000.0, discountQuantity: 3 },
    },
  },
  '2': {
    id: 2,
    name: 'Smart Tag - Rastreador',
    price: 1500.0,
    stock: 14,
    sold: 1895,
    description:
      'Smart Tag é um rastreador supercompacto e fácil de configurar que funciona com Apple e Android. Coloque um na chave do carro, na mochila e em outros objetos para os localizar facilmente. Resistente à água e com bateria substituível que dura mais de um ano.',
    images: [
      'https://i.postimg.cc/xTsq70wx/Whats-App-Image-2025-10-30-at-21-41-24.jpg',
      'https://i.postimg.cc/BQhtyqrz/Whats-App-Image-2025-10-30-at-21-41-24-1.jpg',
      'https://i.postimg.cc/3JLW6Ks9/Whats-App-Image-2025-10-30-at-21-41-24-2.jpg',
      'https://i.postimg.cc/3JrdnycZ/Whats-App-Image-2025-10-30-at-21-41-25.jpg',
      'https://i.postimg.cc/28H3JzsX/Whats-App-Image-2025-10-30-at-21-41-25-1.jpg',
      'https://i.postimg.cc/RVCNX3DW/Whats-App-Image-2025-10-30-at-21-41-26.jpg',
    ],
  },
};

const transformedProducts: Product[] = [];

// Transform Quadros Artísticos
const quadros = rawProducts['1'];
quadros.types.forEach(type => {
  Object.keys(quadros.sizes).forEach(size => {
    const sizeInfo = quadros.sizes[size as keyof typeof quadros.sizes];
    transformedProducts.push({
      id: `${quadros.id}-${type.id}-${size}`,
      name: `${type.name} (${size})`,
      description: quadros.description,
      price: sizeInfo.price,
      imageUrl: type.image,
      category: 'Quadros Artisticos',
      stock: quadros.stock, // Stock is per-variation
      imageHint: 'quadro artistico',
      variations: [], // Flattened structure has no further variations
    });
  });
});

// Transform Smart Tag
const smartTag = rawProducts['2'];
transformedProducts.push({
  id: String(smartTag.id),
  name: smartTag.name,
  description: smartTag.description,
  price: smartTag.price,
  imageUrl: smartTag.images[0],
  category: 'Smart Tag Rastreador',
  stock: smartTag.stock,
  imageHint: 'smart tag',
  variations: smartTag.images.map((img, index) => ({
      id: `${smartTag.id}-${index}`,
      name: `${smartTag.name} ${index + 1}`,
      imageUrl: img,
      imageHint: 'smart tag',
      price: smartTag.price,
      stock: smartTag.stock
  }))
});


export const products: Product[] = transformedProducts;
