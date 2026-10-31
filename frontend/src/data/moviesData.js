export const LANGUAGES = [
  'All',
  'Hindi',
  'Tamil',
  'Telugu',
  'Kannada',
  'Malayalam'
];

export const FORMATS = [
  'All Formats',
  'IMAX 3D',
  '3D',
  '4DX 3D',
  'Dolby Cinema',
  '2D'
];

export const MOVIES = [
  {
    id: 'kalki-2898-ad',
    title: 'Kalki 2898 AD',
    tagline: 'The Future Has Begun. An Epic Odyssey Beyond Time.',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    trailerUrl: 'https://www.youtube.com/embed/kQDd1AhGIHk',
    videoPreview: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    language: 'Telugu',
    availableLanguages: ['Telugu', 'Hindi', 'Tamil', 'Kannada', 'Malayalam'],
    genre: ['Sci-Fi', 'Action', 'Mythology', 'Adventure'],
    duration: '3h 01m',
    releaseDate: '2024-06-27',
    rating: 9.2,
    voteCount: '248.6K',
    certificate: 'U/A 16+',
    formats: ['IMAX 3D', '3D', '4DX 3D', 'Dolby Cinema', '2D'],
    status: 'now_showing',
    featured: true,
    ringOrder: 1,
    accentColor: '#f59e0b',
    description: 'Set in a dystopian future post-apocalyptic world of Kashi, Kalki 2898 AD follows the immortal warrior Ashwatthama and the bounty hunter Bhairava as forces clash over the unborn incarnation prophesied to restore cosmic balance.',
    director: 'Nag Ashwin',
    musicDirector: 'Santhosh Narayanan',
    cast: [
      { name: 'Prabhas', role: 'Bhairava', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Amitabh Bachchan', role: 'Ashwatthama', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Deepika Padukone', role: 'SUM-80', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Kamal Haasan', role: 'Supreme Yaskin', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Disha Patani', role: 'Roxie', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80' }
    ],
    theatres: [
      {
        id: 'inox-megaplex',
        name: 'INOX Megaplex: Laser IMAX',
        address: 'Inorbit Mall, Level 4',
        distance: '2.4 km away',
        screenFormat: 'IMAX 3D',
        cancellationAvailable: true,
        showtimes: [
          { time: '10:30 AM', format: 'IMAX 3D', priceRange: '₹350 - ₹650', status: 'available' },
          { time: '02:15 PM', format: 'IMAX 3D', priceRange: '₹350 - ₹650', status: 'almost_full' },
          { time: '06:00 PM', format: 'IMAX 3D', priceRange: '₹400 - ₹750', status: 'filling_fast' },
          { time: '09:45 PM', format: 'IMAX 3D', priceRange: '₹400 - ₹750', status: 'available' }
        ]
      },
      {
        id: 'pvr-icon-gold',
        name: 'PVR ICON: Gold Class & Dolby Atmos',
        address: 'Infinity Mall, Sector 9',
        distance: '4.8 km away',
        screenFormat: 'Dolby Cinema',
        cancellationAvailable: true,
        showtimes: [
          { time: '11:15 AM', format: '3D', priceRange: '₹280 - ₹500', status: 'available' },
          { time: '03:30 PM', format: '3D', priceRange: '₹280 - ₹500', status: 'available' },
          { time: '07:15 PM', format: '3D', priceRange: '₹320 - ₹550', status: 'filling_fast' },
          { time: '10:50 PM', format: '3D', priceRange: '₹320 - ₹550', status: 'available' }
        ]
      },
      {
        id: 'cinepolis-vip',
        name: 'Cinépolis VIP & 4DX Screen',
        address: 'Viviana Mall, Eastern Express Highway',
        distance: '6.1 km away',
        screenFormat: '4DX 3D',
        cancellationAvailable: false,
        showtimes: [
          { time: '12:00 PM', format: '4DX 3D', priceRange: '₹450 - ₹800', status: 'almost_full' },
          { time: '04:45 PM', format: '4DX 3D', priceRange: '₹450 - ₹800', status: 'filling_fast' },
          { time: '08:30 PM', format: '4DX 3D', priceRange: '₹500 - ₹850', status: 'filling_fast' }
        ]
      }
    ]
  },
  {
    id: 'jawan-final-stand',
    title: 'Jawan: The Final Stand',
    tagline: 'When A Hero Awakens, The System Trembles.',
    poster: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80',
    trailerUrl: 'https://www.youtube.com/embed/COv52Qyctws',
    videoPreview: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    language: 'Hindi',
    availableLanguages: ['Hindi', 'Tamil', 'Telugu'],
    genre: ['Action', 'Thriller', 'Drama'],
    duration: '2h 49m',
    releaseDate: '2023-09-07',
    rating: 8.9,
    voteCount: '312.4K',
    certificate: 'U/A 16+',
    formats: ['IMAX 2D', '4DX', 'Dolby Cinema', '2D'],
    status: 'now_showing',
    featured: true,
    ringOrder: 2,
    accentColor: '#dc2626',
    description: 'A high-stakes emotional journey of a prison warden driven by a personal vendetta to right the wrongs of society, commanding a band of skilled women warriors while wrestling with an enigmatic ghost from his fractured past.',
    director: 'Atlee Kumar',
    musicDirector: 'Anirudh Ravichander',
    cast: [
      { name: 'Shah Rukh Khan', role: 'Vikram & Azad Rathore', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Nayanthara', role: 'Narmada Rai', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' },
      { name: 'Vijay Sethupathi', role: 'Kaalie Gaikwad', image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80' },
      { name: 'Deepika Padukone', role: 'Aishwarya Rathore', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' }
    ],
    theatres: [
      {
        id: 'pvr-superplex',
        name: 'PVR Superplex: 4DX & IMAX',
        address: 'Logix City Centre, Sector 32',
        distance: '3.1 km away',
        screenFormat: 'IMAX 2D',
        cancellationAvailable: true,
        showtimes: [
          { time: '09:30 AM', format: 'IMAX 2D', priceRange: '₹300 - ₹550', status: 'available' },
          { time: '01:15 PM', format: 'IMAX 2D', priceRange: '₹350 - ₹600', status: 'filling_fast' },
          { time: '05:00 PM', format: 'IMAX 2D', priceRange: '₹380 - ₹650', status: 'almost_full' },
          { time: '08:45 PM', format: 'IMAX 2D', priceRange: '₹380 - ₹650', status: 'available' }
        ]
      },
      {
        id: 'miraj-cinemas',
        name: 'Miraj Cinemas: Atmos Experience',
        address: 'Crown Plaza Arcade',
        distance: '5.6 km away',
        screenFormat: 'Dolby Atmos',
        cancellationAvailable: true,
        showtimes: [
          { time: '11:00 AM', format: '2D', priceRange: '₹200 - ₹380', status: 'available' },
          { time: '03:15 PM', format: '2D', priceRange: '₹220 - ₹400', status: 'available' },
          { time: '07:30 PM', format: '2D', priceRange: '₹260 - ₹450', status: 'filling_fast' }
        ]
      }
    ]
  },
  {
    id: 'leo-bloody-sweet',
    title: 'Leo: Bloody Sweet',
    tagline: 'Keep Calm and Prepare For Battle.',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1920&q=80',
    trailerUrl: 'https://www.youtube.com/embed/Po3jStA673E',
    videoPreview: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    language: 'Tamil',
    availableLanguages: ['Tamil', 'Telugu', 'Hindi', 'Kannada', 'Malayalam'],
    genre: ['Action', 'Crime', 'Thriller'],
    duration: '2h 44m',
    releaseDate: '2023-10-19',
    rating: 8.8,
    voteCount: '210.8K',
    certificate: 'A',
    formats: ['IMAX 2D', 'Dolby Cinema', '2D'],
    status: 'now_showing',
    featured: true,
    ringOrder: 3,
    accentColor: '#e11d48',
    description: 'Parthiban is a mild-mannered cafe owner and animal rescuer in Himachal Pradesh whose quiet family life unravels when ruthless gangsters mistake him for Leo Das, an estranged heir of an illicit empire.',
    director: 'Lokesh Kanagaraj',
    musicDirector: 'Anirudh Ravichander',
    cast: [
      { name: 'Thalapathy Vijay', role: 'Parthiban / Leo Das', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Trisha Krishnan', role: 'Sathya', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Sanjay Dutt', role: 'Antony Das', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Arjun Sarja', role: 'Harold Das', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80' }
    ],
    theatres: [
      {
        id: 'sathyam-cinemas',
        name: 'SPI Sathyam Cinemas: Main Screen RDX',
        address: 'Thiru-Vi-Ka Road, Royapettah',
        distance: '1.9 km away',
        screenFormat: 'Dolby Cinema',
        cancellationAvailable: true,
        showtimes: [
          { time: '10:00 AM', format: '2D', priceRange: '₹220 - ₹420', status: 'almost_full' },
          { time: '01:30 PM', format: '2D', priceRange: '₹220 - ₹420', status: 'filling_fast' },
          { time: '05:45 PM', format: '2D', priceRange: '₹250 - ₹480', status: 'almost_full' },
          { time: '10:15 PM', format: '2D', priceRange: '₹250 - ₹480', status: 'available' }
        ]
      },
      {
        id: 'pvr-vr-mall',
        name: 'PVR VR Mall: IMAX Screen 1',
        address: 'Jawaharlal Nehru Road, Anna Nagar',
        distance: '4.2 km away',
        screenFormat: 'IMAX 2D',
        cancellationAvailable: true,
        showtimes: [
          { time: '11:45 AM', format: 'IMAX 2D', priceRange: '₹350 - ₹650', status: 'available' },
          { time: '04:15 PM', format: 'IMAX 2D', priceRange: '₹380 - ₹700', status: 'filling_fast' },
          { time: '08:30 PM', format: 'IMAX 2D', priceRange: '₹400 - ₹750', status: 'almost_full' }
        ]
      }
    ]
  },
  {
    id: 'kantara-chapter-1',
    title: 'Kantara: Chapter 1',
    tagline: 'When Nature Awakens, Legend Ascends.',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1920&q=80',
    trailerUrl: 'https://www.youtube.com/embed/oQMc88yC0W4',
    videoPreview: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    language: 'Kannada',
    availableLanguages: ['Kannada', 'Hindi', 'Telugu', 'Tamil', 'Malayalam'],
    genre: ['Folklore', 'Action', 'Mythology', 'Period Drama'],
    duration: '2h 52m',
    releaseDate: '2025-10-02',
    rating: 9.4,
    voteCount: '189.2K',
    certificate: 'U/A 16+',
    formats: ['IMAX 3D', 'Dolby Atmos', '3D', '2D'],
    status: 'now_showing',
    featured: true,
    ringOrder: 4,
    accentColor: '#10b981',
    description: 'A mythic origin prequel tracing the legendary forest deity and the fiery ancestral champion during the Kadamba dynasty. A battle where sacred beliefs, divine fury and human greed collide in the ancient coastal woods.',
    director: 'Rishab Shetty',
    musicDirector: 'B. Ajaneesh Loknath',
    cast: [
      { name: 'Rishab Shetty', role: 'Shiva / Ancestor', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Sapthami Gowda', role: 'Leela', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' },
      { name: 'Kishore Kumar G', role: 'Muralidhar', image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80' }
    ],
    theatres: [
      {
        id: 'orion-pvr',
        name: 'PVR Gold Class: Orion Mall',
        address: 'Dr Rajkumar Rd, Rajajinagar',
        distance: '3.7 km away',
        screenFormat: 'IMAX 3D',
        cancellationAvailable: true,
        showtimes: [
          { time: '10:15 AM', format: 'IMAX 3D', priceRange: '₹320 - ₹600', status: 'available' },
          { time: '02:00 PM', format: 'IMAX 3D', priceRange: '₹350 - ₹650', status: 'filling_fast' },
          { time: '06:15 PM', format: 'IMAX 3D', priceRange: '₹400 - ₹750', status: 'almost_full' },
          { time: '10:00 PM', format: 'IMAX 3D', priceRange: '₹350 - ₹650', status: 'available' }
        ]
      }
    ]
  },
  {
    id: 'manjummel-boys',
    title: 'Manjummel Boys: The Deep Dive',
    tagline: 'Courage Knows No Depth When Brotherhood Calls.',
    poster: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80',
    trailerUrl: 'https://www.youtube.com/embed/IdhnE-f-z_c',
    videoPreview: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    language: 'Malayalam',
    availableLanguages: ['Malayalam', 'Tamil', 'Telugu', 'Hindi', 'Kannada'],
    genre: ['Survival Thriller', 'Adventure', 'Drama'],
    duration: '2h 15m',
    releaseDate: '2024-02-22',
    rating: 9.3,
    voteCount: '198.5K',
    certificate: 'U',
    formats: ['Dolby Atmos', '2D'],
    status: 'now_showing',
    featured: true,
    ringOrder: 5,
    accentColor: '#0ea5e9',
    description: 'Based on the astounding true story, a gang of fearless childhood friends from Kochi set out on an adventurous vacation to Kodaikanal, turning into a breathtaking race against death inside the forbidden Guna Caves.',
    director: 'Chidambaram',
    musicDirector: 'Sushin Shyam',
    cast: [
      { name: 'Soubin Shahir', role: 'Kuttan', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Sreenath Bhasi', role: 'Subhash', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Balu Varghese', role: 'Sixen', image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80' }
    ],
    theatres: [
      {
        id: 'lulu-pvr',
        name: 'PVR Lulu Mall: Screen 1 Atmos',
        address: 'Edappally, Kochi Bypass',
        distance: '1.2 km away',
        screenFormat: 'Dolby Atmos',
        cancellationAvailable: true,
        showtimes: [
          { time: '11:00 AM', format: '2D', priceRange: '₹180 - ₹350', status: 'available' },
          { time: '02:30 PM', format: '2D', priceRange: '₹190 - ₹380', status: 'almost_full' },
          { time: '06:15 PM', format: '2D', priceRange: '₹210 - ₹400', status: 'filling_fast' },
          { time: '09:45 PM', format: '2D', priceRange: '₹210 - ₹400', status: 'available' }
        ]
      }
    ]
  },
  {
    id: 'fighter-sky-warriors',
    title: 'Fighter: Sky Warriors',
    tagline: 'High Altitude. Absolute Velocity. Unbroken Valor.',
    poster: 'https://images.unsplash.com/photo-1519074069444-1ba4ea16e6f4?auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    trailerUrl: 'https://www.youtube.com/embed/bTf8d1WwS-E',
    videoPreview: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    language: 'Hindi',
    availableLanguages: ['Hindi', 'Tamil', 'Telugu'],
    genre: ['Aerial Action', 'War', 'Thriller'],
    duration: '2h 46m',
    releaseDate: '2024-01-25',
    rating: 8.6,
    voteCount: '165.3K',
    certificate: 'U/A 16+',
    formats: ['IMAX 3D', '3D', '4DX 3D', '2D'],
    status: 'now_showing',
    featured: true,
    ringOrder: 6,
    accentColor: '#3b82f6',
    description: 'Top Indian Air Force fighter aviators unite under an elite combat unit codenamed Air Dragons to neutralize hostile incursions, testing their limits of aerodynamic precision and sacrifice.',
    director: 'Siddharth Anand',
    musicDirector: 'Vishal-Shekhar',
    cast: [
      { name: 'Hrithik Roshan', role: 'Sq Leader Shamsher Pathania (Patty)', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Deepika Padukone', role: 'Sq Leader Minal Rathore (Minni)', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Anil Kapoor', role: 'Group Captain Rakesh Jai Singh (Rocky)', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' }
    ],
    theatres: [
      {
        id: 'pvr-ecx',
        name: 'PVR ECX: Laser 3D',
        address: 'Chanakyapuri Mall',
        distance: '3.5 km away',
        screenFormat: 'IMAX 3D',
        cancellationAvailable: true,
        showtimes: [
          { time: '10:45 AM', format: 'IMAX 3D', priceRange: '₹320 - ₹580', status: 'available' },
          { time: '02:45 PM', format: 'IMAX 3D', priceRange: '₹350 - ₹620', status: 'available' },
          { time: '07:00 PM', format: 'IMAX 3D', priceRange: '₹390 - ₹680', status: 'filling_fast' }
        ]
      }
    ]
  },
  {
    id: 'devara-part-1',
    title: 'Devara: Part 1',
    tagline: 'Lord of the Fearless Coast.',
    poster: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1920&q=80',
    trailerUrl: 'https://www.youtube.com/embed/5U_Z6m7K8wM',
    videoPreview: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    language: 'Telugu',
    availableLanguages: ['Telugu', 'Hindi', 'Tamil', 'Kannada', 'Malayalam'],
    genre: ['Action', 'Epic Drama', 'Thriller'],
    duration: '2h 58m',
    releaseDate: '2024-09-27',
    rating: 8.7,
    voteCount: '178.4K',
    certificate: 'U/A 16+',
    formats: ['IMAX 3D', '3D', 'Dolby Cinema', '2D'],
    status: 'now_showing',
    featured: true,
    ringOrder: 7,
    accentColor: '#06b6d4',
    description: 'Along the treacherous coastal waters of the Bay of Bengal, Devara rules over an unyielding sea-clan until treachery from his closest brothers turns his own blood against him, igniting an explosive multigenerational revenge.',
    director: 'Koratala Siva',
    musicDirector: 'Anirudh Ravichander',
    cast: [
      { name: 'N. T. Rama Rao Jr.', role: 'Devara & Vara', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Janhvi Kapoor', role: 'Thangam', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Saif Ali Khan', role: 'Bhaira', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' }
    ],
    theatres: [
      {
        id: 'prasads-multiplex',
        name: 'Prasads Multiplex: Large Screen PCX',
        address: 'NTR Gardens, Necklace Road',
        distance: '2.1 km away',
        screenFormat: 'IMAX 3D',
        cancellationAvailable: true,
        showtimes: [
          { time: '09:00 AM', format: 'IMAX 3D', priceRange: '₹300 - ₹550', status: 'almost_full' },
          { time: '01:00 PM', format: 'IMAX 3D', priceRange: '₹350 - ₹620', status: 'almost_full' },
          { time: '05:30 PM', format: 'IMAX 3D', priceRange: '₹380 - ₹680', status: 'almost_full' },
          { time: '09:15 PM', format: 'IMAX 3D', priceRange: '₹380 - ₹680', status: 'filling_fast' }
        ]
      }
    ]
  },
  {
    id: 'aavesham',
    title: 'Aavesham: The Ranga Odyssey',
    tagline: 'When In Bangalore, Seek Ranga Anna.',
    poster: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920&q=80',
    trailerUrl: 'https://www.youtube.com/embed/2u_Q_qKqQeI',
    videoPreview: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    language: 'Malayalam',
    availableLanguages: ['Malayalam', 'Tamil', 'Telugu', 'Hindi'],
    genre: ['Action Comedy', 'Drama', 'Crime'],
    duration: '2h 38m',
    releaseDate: '2024-04-11',
    rating: 9.1,
    voteCount: '154.2K',
    certificate: 'U/A 13+',
    formats: ['Dolby Atmos', '2D'],
    status: 'now_showing',
    featured: true,
    ringOrder: 8,
    accentColor: '#eab308',
    description: 'Three Malayali engineering students in Bangalore face severe ragging from senior bullies. To settle the score, they encounter Ranga, a flamboyant white-clad local mobster whose eccentric warmth hides terrifying lethality.',
    director: 'Jithu Madhavan',
    musicDirector: 'Sushin Shyam',
    cast: [
      { name: 'Fahadh Faasil', role: 'Ranga Anna', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Mansoor Ali Khan', role: 'Reddy', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Hipzster', role: 'Aju', image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80' }
    ],
    theatres: [
      {
        id: 'cinepolis-central',
        name: 'Cinépolis: Grand Mall',
        address: 'MG Road, Central District',
        distance: '2.8 km away',
        screenFormat: 'Dolby Atmos',
        cancellationAvailable: true,
        showtimes: [
          { time: '11:30 AM', format: '2D', priceRange: '₹200 - ₹380', status: 'available' },
          { time: '03:45 PM', format: '2D', priceRange: '₹220 - ₹400', status: 'filling_fast' },
          { time: '07:30 PM', format: '2D', priceRange: '₹250 - ₹450', status: 'almost_full' }
        ]
      }
    ]
  },
  {
    id: 'avatar-fire-and-ash',
    title: 'Avatar: Fire and Ash (3D)',
    tagline: 'Witness The Dark Tribe Of Pandora.',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    trailerUrl: 'https://www.youtube.com/embed/d9MyW72ELq0',
    videoPreview: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    language: 'Hindi',
    availableLanguages: ['Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'English'],
    genre: ['Sci-Fi', 'Epic Adventure', 'Fantasy'],
    duration: '3h 10m',
    releaseDate: '2025-12-19',
    rating: 9.6,
    voteCount: '89.1K',
    certificate: 'U/A 13+',
    formats: ['IMAX 3D', '4DX 3D', '3D', 'Dolby Cinema'],
    status: 'upcoming',
    featured: false,
    ringOrder: 9,
    accentColor: '#f97316',
    description: 'James Cameron returns to Pandora to unveil the hostile Ash People, a volcanic Na\'vi tribe driven by fury and magma rites, pushing Jake Sully and Neytiri into uncharted territory.',
    director: 'James Cameron',
    musicDirector: 'Simon Franglen',
    cast: [
      { name: 'Sam Worthington', role: 'Jake Sully', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Zoe Saldana', role: 'Neytiri', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Sigourney Weaver', role: 'Kiri', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' }
    ],
    theatres: []
  },
  {
    id: 'brahmastra-part-two-dev',
    title: 'Brahmāstra: Part Two – Dev',
    tagline: 'The Master Of Flames Returns To Claim His Throne.',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    trailerUrl: 'https://www.youtube.com/embed/V5ZzbozPRDY',
    videoPreview: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    language: 'Hindi',
    availableLanguages: ['Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam'],
    genre: ['Fantasy', 'Action', 'Mythology'],
    duration: '2h 55m',
    releaseDate: '2026-12-04',
    rating: 9.1,
    voteCount: '72.3K',
    certificate: 'U/A 16+',
    formats: ['IMAX 3D', '3D', '2D'],
    status: 'upcoming',
    featured: false,
    ringOrder: 10,
    accentColor: '#ef4444',
    description: 'The saga of the Astraverse deepens as the untold origins of Dev and Amrita are uncovered, culminating in an elemental confrontation that threatens the existence of the Brahmansh order.',
    director: 'Ayan Mukerji',
    musicDirector: 'Pritam',
    cast: [
      { name: 'Ranbir Kapoor', role: 'Shiva', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { name: 'Deepika Padukone', role: 'Amrita', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { name: 'Ranveer Singh', role: 'Dev', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' }
    ],
    theatres: []
  }
];
