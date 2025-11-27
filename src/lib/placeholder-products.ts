import type { Product } from '@/lib/types';
import placeholderImages from '@/lib/placeholder-images.json';

export const placeholderProducts: Product[] = [
  {
    id: 'capulana-vermelha',
    name: 'Capulana Vermelha Tradicional',
    description: 'Capulana de algodão vibrante, perfeita para o dia a dia ou para criar peças de vestuário únicas. Os padrões podem variar.',
    price: 850,
    stock: 25,
    isFeatured: true,
    isOnSale: false,
    images: placeholderImages.capulana.images,
    socialProof: [
        {
            image: placeholderImages.avatar.src,
            author: 'Ana Silva',
            text: 'As cores são ainda mais vivas pessoalmente! Adorei a qualidade do tecido.'
        }
    ]
  },
  {
    id: 'escultura-makonde',
    name: 'Escultura Makonde "Ujamaa"',
    description: 'Escultura em madeira de pau-preto, representando a união da família. Peça de arte tradicional Makonde, esculpida à mão.',
    price: 4500,
    stock: 10,
    isFeatured: true,
    isOnSale: true,
    images: placeholderImages.escultura.images,
    socialProof: [
        {
            image: placeholderImages.avatar.src,
            author: 'Carlos Pereira',
            text: 'Uma peça de arte impressionante. Chegou bem embalada e é o centro das atenções na minha sala.'
        },
        {
            image: placeholderImages.avatar.src,
            author: 'Mariana Costa',
            text: 'Comprei para oferecer e foi um sucesso. A escultura é lindíssima.'
        }
    ]
  },
  {
    id: 'geleia-malambe',
    name: 'Geleia de Malambe',
    description: 'Doce artesanal feito do fruto do embondeiro (malambe), com um sabor exótico e agridoce. Ideal para barrar no pão ou iogurte.',
    price: 350,
    stock: 40,
    isFeatured: false,
    isOnSale: false,
    images: placeholderImages.geleia.images,
  },
  {
    id: 'cafe-gorongosa',
    name: 'Café da Gorongosa (Grão)',
    description: 'Café arábica de alta qualidade, cultivado de forma sustentável nas encostas do Parque Nacional da Gorongosa.',
    price: 600,
    stock: 30,
    isFeatured: true,
    isOnSale: false,
    images: placeholderImages.cafe.images,
  },
  {
    id: 'sandalias-couro',
    name: 'Sandálias de Couro Artesanais',
    description: 'Sandálias unissexo feitas à mão por artesãos locais, com couro genuíno e sola resistente. Confortáveis e com um design intemporal.',
    price: 1200,
    stock: 15,
    isFeatured: false,
    isOnSale: true,
    images: placeholderImages.sandalias.images,
  },
  {
    id: 'chapeu-palha',
    name: 'Chapéu de Palha Ndau',
    description: 'Chapéu tradicional da tribo Ndau, trançado à mão com folhas de palmeira. Leve e ideal para proteção solar com estilo.',
    price: 700,
    stock: 22,
    isFeatured: false,
    isOnSale: false,
    images: placeholderImages.chapeu.images,
  },
  {
    id: 'colar-missangas',
    name: 'Colar de Missangas',
    description: 'Colar colorido feito com missangas por artesãs da província de Inhambane. Um acessório vibrante que complementa qualquer visual.',
    price: 450,
    stock: 50,
    isFeatured: true,
    isOnSale: false,
    images: placeholderImages.colar.images,
    socialProof: [
        {
            image: placeholderImages.avatar.src,
            author: 'Sofia Santos',
            text: 'Muito bem feito e as cores são lindas. Recebo sempre elogios quando o uso.'
        }
    ]
  },
  {
    id: 'pimenta-piri-piri',
    name: 'Molho de Piri-Piri Caseiro',
    description: 'Molho picante feito com piri-piri fresco, alho e especiarias locais. Um clássico da culinária moçambicana para dar sabor a qualquer prato.',
    price: 250,
    stock: 100,
    isFeatured: false,
    isOnSale: true,
    images: placeholderImages.piripiri.images,
  },
];
