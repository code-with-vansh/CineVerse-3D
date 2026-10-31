import bcrypt from 'bcryptjs';
import prisma from '../src/config/database.js';

async function main() {
  console.log('[Seed] Starting database seeding for CineVerse 3D...');

  // 1. Clean existing records for a fresh, idempotent baseline
  console.log('[Seed] Clearing existing data...');
  await prisma.payment.deleteMany();
  await prisma.bookingSnack.deleteMany();
  await prisma.snack.deleteMany();
  await prisma.bookingSeat.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.showSeat.deleteMany();
  await prisma.show.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.screen.deleteMany();
  await prisma.theatre.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Users
  console.log('[Seed] Seeding Users...');
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('Admin@123', salt);
  const userPassword = await bcrypt.hash('User@123', salt);

  const admin = await prisma.user.create({
    data: {
      name: 'CineVerse Admin',
      email: 'admin@cineverse.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const normalUser = await prisma.user.create({
    data: {
      name: 'Vansh Sharma',
      email: 'user@cineverse.com',
      password: userPassword,
      role: 'USER',
    },
  });

  console.log(`[Seed] Created Users: Admin (${admin.email}), User (${normalUser.email})`);

  // 3. Seed 26 Movies across 5 languages
  console.log('[Seed] Seeding 26 Movies across Hindi, Tamil, Telugu, Kannada, Malayalam...');
  const moviesData = [
    // --- TELUGU ---
    {
      title: 'Kalki 2898 AD',
      description: 'Set in a dystopian future post-apocalyptic world of Kashi, Kalki 2898 AD follows the immortal warrior Ashwatthama and the bounty hunter Bhairava as forces clash over the unborn incarnation prophesied to restore cosmic balance.',
      poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
      trailerUrl: 'https://www.youtube.com/embed/kQDd1AhGIHk',
      language: 'Telugu',
      genre: 'Sci-Fi, Action, Mythology',
      duration: '181 min',
      releaseDate: '2024-06-27',
      rating: 9.2,
      cast: 'Prabhas, Amitabh Bachchan, Deepika Padukone, Kamal Haasan',
      director: 'Nag Ashwin',
    },
    {
      title: 'Devara: Part 1',
      description: 'An epic coastal action drama tracking an intrepid pirate clan chieftain who revolts against illicit sea smugglers to safeguard his isolated islands.',
      poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
      trailerUrl: 'https://www.youtube.com/embed/5kCdnbmJ7bE',
      language: 'Telugu',
      genre: 'Action, Drama, Thriller',
      duration: '172 min',
      releaseDate: '2024-09-27',
      rating: 8.8,
      cast: 'N.T. Rama Rao Jr., Saif Ali Khan, Janhvi Kapoor',
      director: 'Koratala Siva',
    },
    {
      title: 'Pushpa 2: The Rule',
      description: 'Pushpa Raj solidifies his undisputed reign over the red sandalwood smuggling empire while facing merciless retribution from SP Bhanwar Singh Shekhawat.',
      poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1920&q=80',
      trailerUrl: 'https://www.youtube.com/embed/v6Oh1DkZXiY',
      language: 'Telugu',
      genre: 'Action, Crime, Thriller',
      duration: '195 min',
      releaseDate: '2024-12-05',
      rating: 9.3,
      cast: 'Allu Arjun, Rashmika Mandanna, Fahadh Faasil',
      director: 'Sukumar',
    },
    {
      title: 'RRR: Rise Roar Revolt',
      description: 'A fearless warrior on a perilous quest and a resolute officer in the British army forge an unbreakable friendship before discovering their opposing true identities.',
      poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1920&q=80',
      trailerUrl: 'https://www.youtube.com/embed/NgBoMJy386M',
      language: 'Telugu',
      genre: 'Action, Drama, Historical',
      duration: '187 min',
      releaseDate: '2022-03-25',
      rating: 9.1,
      cast: 'N.T. Rama Rao Jr., Ram Charan, Alia Bhatt, Ajay Devgn',
      director: 'S.S. Rajamouli',
    },
    {
      title: 'Salaar: Part 1 - Ceasefire',
      description: 'A gang leader makes a fierce promise to a dying friend and takes on other criminal mobs in the violent dystopian city of Khansaar.',
      poster: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
      trailerUrl: 'https://www.youtube.com/embed/4GPvYMKtrtI',
      language: 'Telugu',
      genre: 'Action, Thriller, Crime',
      duration: '175 min',
      releaseDate: '2023-12-22',
      rating: 8.7,
      cast: 'Prabhas, Prithviraj Sukumaran, Shruti Haasan',
      director: 'Prashanth Neel',
    },

    // --- HINDI ---
    {
      title: 'Jawan: The Final Stand',
      description: 'A high-octane emotional journey of a prison warden driven by a personal vendetta to rectify the social corruptions in society while keeping a promise made years ago.',
      poster: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80',
      trailerUrl: 'https://www.youtube.com/embed/COv52Qyctws',
      language: 'Hindi',
      genre: 'Action, Thriller, Drama',
      duration: '169 min',
      releaseDate: '2023-09-07',
      rating: 8.9,
      cast: 'Shah Rukh Khan, Nayanthara, Vijay Sethupathi, Deepika Padukone',
      director: 'Atlee',
    },
    {
      title: 'Fighter: Sky Warriors',
      description: 'Top Indian Air Force aviators come together in the face of imminent danger to form Air Dragons, pushing their human endurance and machines to the edge.',
      poster: 'https://images.unsplash.com/photo-1519074069444-1ba4ea16e6f4?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1920&q=80',
      trailerUrl: 'https://www.youtube.com/embed/6amIq_mP4xM',
      language: 'Hindi',
      genre: 'Action, Aviation, Thriller',
      duration: '166 min',
      releaseDate: '2024-01-25',
      rating: 8.6,
      cast: 'Hrithik Roshan, Deepika Padukone, Anil Kapoor',
      director: 'Siddharth Anand',
    },
    {
      title: 'Brahmāstra: Part Two – Dev',
      description: 'The cosmic saga of the Astraverse deepens as the formidable entity Dev seeks to claim the supreme weapon Brahmastra and reshape world destiny.',
      poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80',
      trailerUrl: 'https://www.youtube.com/embed/V5Z8u355v0Y',
      language: 'Hindi',
      genre: 'Fantasy, Action, Adventure',
      duration: '160 min',
      releaseDate: '2026-12-18',
      rating: 8.8,
      cast: 'Ranbir Kapoor, Alia Bhatt, Deepika Padukone, Ranveer Singh',
      director: 'Ayan Mukerji',
    },
    {
      title: 'Stree 2: Sarkate Ka Aatank',
      description: 'The quiet town of Chanderi is haunted once more, this time by a terrifying headless monster known as Sarkata who abducts progressive women.',
      poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
      trailerUrl: 'https://www.youtube.com/embed/KVnheBRlP8U',
      language: 'Hindi',
      genre: 'Comedy, Horror',
      duration: '147 min',
      releaseDate: '2024-08-15',
      rating: 8.7,
      cast: 'Shraddha Kapoor, Rajkummar Rao, Pankaj Tripathi',
      director: 'Amar Kaushik',
    },
    {
      title: 'Animal: Lord of Blood',
      description: 'A son who harbors obsessive devotion for his estranged industrialist father embarks on a merciless rampage against enemies targeting his lineage.',
      poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80',
      trailerUrl: 'https://www.youtube.com/embed/Dydmpfo68DA',
      language: 'Hindi',
      genre: 'Action, Crime, Drama',
      duration: '201 min',
      releaseDate: '2023-12-01',
      rating: 8.4,
      cast: 'Ranbir Kapoor, Anil Kapoor, Bobby Deol, Rashmika Mandanna',
      director: 'Sandeep Reddy Vanga',
    },

    // --- TAMIL ---
    {
      title: 'Leo: Bloody Sweet',
      description: 'Parthiban, a mild-mannered cafe owner and animal rescuer in Himachal, is confronted by violent cartel henchmen who suspect he is the infamous underworld hitman Leo Das.',
      poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1920&q=80',
      trailerUrl: 'https://www.youtube.com/embed/Po3jStA673E',
      language: 'Tamil',
      genre: 'Action, Crime, Thriller',
      duration: '164 min',
      releaseDate: '2023-10-19',
      rating: 8.9,
      cast: 'Thalapathy Vijay, Sanjay Dutt, Trisha Krishnan, Arjun Sarja',
      director: 'Lokesh Kanagaraj',
    },
    {
      title: 'Jailer: Tiger Command',
      description: 'Tiger Muthuvel Pandian, a retired prison jailer known for his placid demeanor, unleashes his brutal past when an idol smuggling syndicate kidnaps his police officer son.',
      poster: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
      trailerUrl: 'https://www.youtube.com/embed/xenOE1Tma0A',
      language: 'Tamil',
      genre: 'Action, Comedy, Crime',
      duration: '168 min',
      releaseDate: '2023-08-10',
      rating: 8.8,
      cast: 'Rajinikanth, Mohanlal, Shiva Rajkumar, Vinayakan',
      director: 'Nelson Dilipkumar',
    },
    {
      title: 'Vikram: Hitlist',
      description: 'A special black-ops investigator is assigned to uncover a covert squad of masked vigilantes waging a lethal campaign against a narcotics kingpin.',
      poster: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80',
      trailerUrl: 'https://www.youtube.com/embed/OKBMCL-frPU',
      language: 'Tamil',
      genre: 'Action, Mystery, Thriller',
      duration: '174 min',
      releaseDate: '2022-06-03',
      rating: 9.0,
      cast: 'Kamal Haasan, Vijay Sethupathi, Fahadh Faasil, Suriya',
      director: 'Lokesh Kanagaraj',
    },
    {
      title: 'The Greatest of All Time (GOAT)',
      description: 'An elite special anti-terrorist agent finds himself caught in an intricate web of betrayal and confronting an estranged past that threatens his family.',
      poster: 'https://images.unsplash.com/photo-1519074069444-1ba4ea16e6f4?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1920&q=80',
      trailerUrl: 'https://www.youtube.com/embed/1v0E0o4lWpE',
      language: 'Tamil',
      genre: 'Action, Sci-Fi, Drama',
      duration: '179 min',
      releaseDate: '2024-09-05',
      rating: 8.5,
      cast: 'Thalapathy Vijay, Prashanth, Prabhu Deva, Sneha',
      director: 'Venkat Prabhu',
    },
    {
      title: 'Ponniyin Selvan: Part 2',
      description: 'Arulmozhi Varman navigates palace conspiracies and rival Chola dynastic conflicts to secure the golden throne and fulfill his motherland destiny.',
      poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
      trailerUrl: 'https://www.youtube.com/embed/1T4XgXqWq7I',
      language: 'Tamil',
      genre: 'Historical, Drama, Action',
      duration: '164 min',
      releaseDate: '2023-04-28',
      rating: 8.7,
      cast: 'Vikram, Aishwarya Rai Bachchan, Karthi, Jayam Ravi',
      director: 'Mani Ratnam',
    },

    // --- KANNADA ---
    {
      title: 'Kantara: Chapter 1',
      description: 'The legendary mythological prequel exploring the origins of the divine deity Panjurli and Guliga Daiva during the ancient reign of the Kadamba empire.',
      poster: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
      trailerUrl: 'https://www.youtube.com/embed/qL_fVz5sTjM',
      language: 'Kannada',
      genre: 'Mythology, Action, Drama',
      duration: '168 min',
      releaseDate: '2025-10-02',
      rating: 9.4,
      cast: 'Rishab Shetty, Jayaram, Rukmini Vasanth',
      director: 'Rishab Shetty',
    },
    {
      title: 'K.G.F: Chapter 2',
      description: 'Rocky reigns supreme over the blood-soaked Kolar Gold Fields, confronting the ruthless adversary Adheera and Indian Prime Minister Ramika Sen.',
      poster: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1920&q=80',
      trailerUrl: 'https://www.youtube.com/embed/JKa05nyUmuQ',
      language: 'Kannada',
      genre: 'Action, Crime, Drama',
      duration: '168 min',
      releaseDate: '2022-04-14',
      rating: 9.2,
      cast: 'Yash, Sanjay Dutt, Raveena Tandon, Srinidhi Shetty',
      director: 'Prashanth Neel',
    },
    {
      title: '777 Charlie',
      description: 'Dharma, a solitary man trapped in a monotonous and desolate life, finds unexpected salvation and joy through a spirited Labrador dog named Charlie.',
      poster: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
      trailerUrl: 'https://www.youtube.com/embed/KCffbws_t-I',
      language: 'Kannada',
      genre: 'Adventure, Drama, Comedy',
      duration: '164 min',
      releaseDate: '2022-06-10',
      rating: 9.1,
      cast: 'Rakshit Shetty, Sangeetha Sringeri, Raj B. Shetty',
      director: 'Kiranraj K',
    },
    {
      title: 'Vikrant Rona',
      description: 'In an isolated rainforest village shrouded in supernatural folklore and strange murders, an eccentric inspector arrives to investigate.',
      poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
      trailerUrl: 'https://www.youtube.com/embed/3c_j_3VjE-0',
      language: 'Kannada',
      genre: 'Action, Mystery, Fantasy',
      duration: '148 min',
      releaseDate: '2022-07-28',
      rating: 8.3,
      cast: 'Kichcha Sudeepa, Nirup Bhandari, Jacqueline Fernandez',
      director: 'Anup Bhandari',
    },
    {
      title: 'Martin',
      description: 'A decorated lieutenant embarks on a dangerous global manhunt to expose an international conspiracy targeting Indian national security.',
      poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80',
      trailerUrl: 'https://www.youtube.com/embed/oK7c4d_Lw9I',
      language: 'Kannada',
      genre: 'Action, Thriller',
      duration: '155 min',
      releaseDate: '2024-10-11',
      rating: 8.1,
      cast: 'Dhruva Sarja, Vaibhavi Shandilya, Anveshi Jain',
      director: 'A. P. Arjun',
    },

    // --- MALAYALAM ---
    {
      title: 'Manjummel Boys: The Deep Dive',
      description: 'A resilient group of close childhood friends from Kochi embark on a trip to Kodaikanal where a harrowing subterranean accident inside Guna Caves tests the limits of courage.',
      poster: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80',
      trailerUrl: 'https://www.youtube.com/embed/id848Ww1YLo',
      language: 'Malayalam',
      genre: 'Survival, Adventure, Drama',
      duration: '135 min',
      releaseDate: '2024-02-22',
      rating: 9.3,
      cast: 'Soubin Shahir, Sreenath Bhasi, Balu Varghese, Ganapathi',
      director: 'Chidambaram',
    },
    {
      title: 'Aavesham: The Ranga Odyssey',
      description: 'Three college engineering students facing campus ragging in Bengaluru seek out an infamous eccentric local gangster named Ranga for protection.',
      poster: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
      trailerUrl: 'https://www.youtube.com/embed/L0yEMl8PXnw',
      language: 'Malayalam',
      genre: 'Action, Comedy, Crime',
      duration: '158 min',
      releaseDate: '2024-04-11',
      rating: 9.1,
      cast: 'Fahadh Faasil, Hipzster, Mithun Jai Shankar, Roshan Shanavas',
      director: 'Jithu Madhavan',
    },
    {
      title: 'The Goat Life (Aadujeevitham)',
      description: 'An immigrant Indian laborer stranded in the harsh Saudi Arabian desert endures extreme physical and psychological hardship as a slave herding goats.',
      poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
      trailerUrl: 'https://www.youtube.com/embed/Jdf2hU0i3aQ',
      language: 'Malayalam',
      genre: 'Drama, Adventure, Survival',
      duration: '173 min',
      releaseDate: '2024-03-28',
      rating: 9.0,
      cast: 'Prithviraj Sukumaran, Amala Paul, Jimmy Jean-Louis',
      director: 'Blessy',
    },
    {
      title: 'Bramayugam: The Age of Madness',
      description: 'In 17th-century Kerala, a fleeing court singer stumbles into a secluded, decrepit ancestral manor whose sinister lord holds dark supernatural powers.',
      poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1920&q=80',
      trailerUrl: 'https://www.youtube.com/embed/e1mH3GZ5k4E',
      language: 'Malayalam',
      genre: 'Horror, Mystery, Thriller',
      duration: '139 min',
      releaseDate: '2024-02-15',
      rating: 8.9,
      cast: 'Mammootty, Arjun Ashokan, Sidharth Bharathan',
      director: 'Rahul Sadasivan',
    },
    {
      title: 'Turbo: High Voltage',
      description: 'Turbo Jose, a heavy-hitting jeep driver with a heart of gold, gets caught in political intrigue and organized criminal syndicates in Chennai.',
      poster: 'https://images.unsplash.com/photo-1519074069444-1ba4ea16e6f4?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80',
      trailerUrl: 'https://www.youtube.com/embed/k8E1l2m3n4o',
      language: 'Malayalam',
      genre: 'Action, Comedy',
      duration: '152 min',
      releaseDate: '2024-05-23',
      rating: 8.4,
      cast: 'Mammootty, Raj B. Shetty, Sunil',
      director: 'Vysakh',
    },
    {
      title: 'Avatar: Fire and Ash (3D)',
      description: 'Jake Sully and Neytiri encounter the Ash People, an aggressive volcanic clan of Na\'vi on Pandora whose fiery lifestyle challenges peace on the moon.',
      poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
      trailerUrl: 'https://www.youtube.com/embed/d9MyW72ELq0',
      language: 'Hindi',
      genre: 'Sci-Fi, Adventure, Action',
      duration: '192 min',
      releaseDate: '2025-12-19',
      rating: 9.3,
      cast: 'Sam Worthington, Zoe Saldana, Sigourney Weaver',
      director: 'James Cameron',
    },
  ];

  const createdMovies = [];
  for (const m of moviesData) {
    const movie = await prisma.movie.create({ data: m });
    createdMovies.push(movie);
  }
  console.log(`[Seed] Seeded ${createdMovies.length} movies.`);

  // 4. Seed 6 Theatres across Indian Metros
  console.log('[Seed] Seeding 6 Theatres...');
  const theatresData = [
    {
      name: 'INOX Megaplex: Laser IMAX',
      city: 'Mumbai',
      address: 'Inorbit Mall, Level 4, Malad West, Mumbai',
      facilities: 'IMAX Laser, Dolby Atmos, Gourmet Food Court, Valet Parking',
    },
    {
      name: 'PVR Superplex Forum South',
      city: 'Bengaluru',
      address: 'Forum Mall South, Konanakunte Cross, Kanakapura Road, Bengaluru',
      facilities: '4DX Experience, IMAX with Laser, PXL Screen, Plush Recliners',
    },
    {
      name: 'SPI Cinemas: Sathyam',
      city: 'Chennai',
      address: '8, Thiru-Vi-Ka Road, Royapettah, Chennai',
      facilities: 'RGB Laser Projection, RDX Sound, Sathyam Popcorn, VIP Lounge',
    },
    {
      name: 'Prasads Multiplex Large Screen',
      city: 'Hyderabad',
      address: 'NTR Gardens, Khairatabad, Hyderabad',
      facilities: 'Dual 4K Laser, Largest Screen in South India, Food Court',
    },
    {
      name: 'Cinépolis VIP & 4DX',
      city: 'Kochi',
      address: 'Centre Square Mall, MG Road, Kochi',
      facilities: 'VIP Butler Service, 4DX Motion Seats, Full Flat Recliners',
    },
    {
      name: 'PVR Director\'s Cut Ambience',
      city: 'Delhi-NCR',
      address: 'Ambience Mall, Vasant Kunj, New Delhi',
      facilities: 'Concierge Service, Luxury Loungers, Curated Fine Dining, IMAX',
    },
  ];

  const createdTheatres = [];
  for (const t of theatresData) {
    const theatre = await prisma.theatre.create({ data: t });
    createdTheatres.push(theatre);
  }
  console.log(`[Seed] Seeded ${createdTheatres.length} theatres.`);

  // 5. Seed Screens and 154 physical seats per screen
  console.log('[Seed] Seeding Screens and 154 3D Seats per Screen...');
  const screenTypes = ['IMAX', 'THREE_D', 'FOUR_DX', 'STANDARD'];
  const createdScreens = [];

  // Rows configuration matching 3D Auditorium geometry
  const rows = [
    { row: 'A', category: 'SILVER', price: 180 },
    { row: 'B', category: 'SILVER', price: 180 },
    { row: 'C', category: 'SILVER', price: 180 },
    { row: 'D', category: 'GOLD', price: 280 },
    { row: 'E', category: 'GOLD', price: 280 },
    { row: 'F', category: 'GOLD', price: 280 },
    { row: 'G', category: 'GOLD', price: 280 },
    { row: 'H', category: 'GOLD', price: 280 },
    { row: 'J', category: 'PREMIUM', price: 420 },
    { row: 'K', category: 'PREMIUM', price: 420 },
    { row: 'L', category: 'PREMIUM', price: 420 },
  ];

  for (const theatre of createdTheatres) {
    for (let scrNum = 1; scrNum <= 2; scrNum++) {
      const screenType = scrNum === 1 ? 'IMAX' : (theatre.city === 'Bengaluru' || theatre.city === 'Kochi' ? 'FOUR_DX' : 'THREE_D');
      const screen = await prisma.screen.create({
        data: {
          name: `Audi ${scrNum} - ${screenType}`,
          screenNumber: scrNum,
          theatreId: theatre.id,
          screenType,
        },
      });
      createdScreens.push(screen);

      // Create 154 seats for this screen
      const seatsToCreate = [];
      for (const r of rows) {
        for (let seatNum = 1; seatNum <= 14; seatNum++) {
          seatsToCreate.push({
            screenId: screen.id,
            row: r.row,
            seatNumber: seatNum,
            category: r.category,
            price: r.price,
          });
        }
      }
      await prisma.seat.createMany({ data: seatsToCreate });
    }
  }

  const totalSeats = await prisma.seat.count();
  console.log(`[Seed] Seeded ${createdScreens.length} screens and ${totalSeats} physical seats.`);

  // 6. Seed Shows and ShowSeats
  console.log('[Seed] Seeding Shows and ShowSeats availability states...');
  const showDates = ['2026-11-01', '2026-11-02', '2026-11-03'];
  const showTimes = [
    { start: '10:30 AM', end: '01:30 PM', multiplier: 1.0 },
    { start: '02:15 PM', end: '05:15 PM', multiplier: 1.0 },
    { start: '06:00 PM', end: '09:00 PM', multiplier: 1.2 },
    { start: '09:45 PM', end: '12:45 AM', multiplier: 1.1 },
  ];

  let totalShowsCount = 0;
  let totalShowSeatsCount = 0;

  // For each screen, assign shows for top movies
  for (let sIdx = 0; sIdx < createdScreens.length; sIdx++) {
    const screen = createdScreens[sIdx];
    // Pick 2-3 movies per screen based on rotation
    const screenMovies = [
      createdMovies[sIdx % createdMovies.length],
      createdMovies[(sIdx + 1) % createdMovies.length],
    ];

    const screenSeats = await prisma.seat.findMany({
      where: { screenId: screen.id },
    });

    for (let dIdx = 0; dIdx < showDates.length; dIdx++) {
      const date = showDates[dIdx];
      const movie = screenMovies[dIdx % screenMovies.length];

      for (let tIdx = 0; tIdx < showTimes.length; tIdx++) {
        const timeConfig = showTimes[tIdx];

        const show = await prisma.show.create({
          data: {
            movieId: movie.id,
            screenId: screen.id,
            showDate: date,
            startTime: timeConfig.start,
            endTime: timeConfig.end,
            language: movie.language,
            ticketPriceMultiplier: timeConfig.multiplier,
          },
        });
        totalShowsCount++;

        // Generate ShowSeat records for this show
        const showSeatsData = [];
        for (const seat of screenSeats) {
          // Deterministic booked state (~20-25% booked for realism)
          const hashVal = (seat.row.charCodeAt(0) * 17 + seat.seatNumber * 31 + tIdx * 7) % 100;
          let status = 'AVAILABLE';
          let lockedBy = null;
          let lockedUntil = null;

          if (hashVal < 22) {
            status = 'BOOKED';
          } else if (hashVal === 88) {
            // A realistic locked seat example for active holds
            status = 'LOCKED';
            lockedBy = 'sample_hold_user';
            lockedUntil = new Date(Date.now() + 5 * 60 * 1000);
          }

          showSeatsData.push({
            showId: show.id,
            seatId: seat.id,
            status,
            lockedBy,
            lockedUntil,
          });
        }

        await prisma.showSeat.createMany({ data: showSeatsData });
        totalShowSeatsCount += showSeatsData.length;
      }
    }
  }

  console.log(`[Seed] Successfully seeded ${totalShowsCount} shows with ${totalShowSeatsCount} ShowSeat records.`);

  // 5. Seed Premium Cinema Snacks Catalog (Phase 4)
  console.log('[Seed] Seeding Premium Cinema Snacks Catalog...');
  const snacksData = [
    // POPCORN
    {
      name: 'Classic Salted Popcorn',
      description: 'Warm, golden, freshly-popped cinema popcorn tossed in Himalayan pink salt and rich butter.',
      image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=800&q=80',
      category: 'POPCORN',
      price: 190.0,
      isAvailable: true,
    },
    {
      name: 'Caramel Popcorn',
      description: 'Crunchy gourmet butterfly popcorn glazed with artisanal caramelized brown sugar glaze.',
      image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=800&q=80',
      category: 'POPCORN',
      price: 240.0,
      isAvailable: true,
    },
    {
      name: 'Cheese Popcorn',
      description: 'Zesty burst of sharp Cheddar and Spanish paprika dusted over hot fluffy popcorn.',
      image: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&w=800&q=80',
      category: 'POPCORN',
      price: 230.0,
      isAvailable: true,
    },
    {
      name: 'Large Popcorn Bucket',
      description: 'Jumbo tub of theatre-style buttered popcorn, perfect for sharing during epic blockbusters.',
      image: 'https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?auto=format&fit=crop&w=800&q=80',
      category: 'POPCORN',
      price: 320.0,
      isAvailable: true,
    },

    // NACHOS
    {
      name: 'Classic Nachos',
      description: 'Crisp stone-ground corn tortilla crisps served with signature zesty tomato salsa.',
      image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=800&q=80',
      category: 'NACHOS',
      price: 180.0,
      isAvailable: true,
    },
    {
      name: 'Cheese Nachos',
      description: 'Golden tortilla chips drenched in warm creamy melted cheddar sauce and jalapeno rings.',
      image: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?auto=format&fit=crop&w=800&q=80',
      category: 'NACHOS',
      price: 220.0,
      isAvailable: true,
    },
    {
      name: 'Loaded Nachos',
      description: 'Ultimate fiesta platter with refried beans, cheddar, jalapenos, sour cream, and spicy salsa dip.',
      image: 'https://images.unsplash.com/photo-1627907224379-a78d596ae978?auto=format&fit=crop&w=800&q=80',
      category: 'NACHOS',
      price: 280.0,
      isAvailable: true,
    },

    // BURGERS AND PIZZA
    {
      name: 'Veg Burger',
      description: 'Crispy spiced potato-herb patty, fresh butterhead lettuce, tomato, and chipotle mayo on a brioche bun.',
      image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=800&q=80',
      category: 'BURGERS_PIZZA',
      price: 199.0,
      isAvailable: true,
    },
    {
      name: 'Cheese Burger',
      description: 'Smoky grilled paneer patty topped with melted cheddar slice, caramelized onions, and house relish.',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      category: 'BURGERS_PIZZA',
      price: 249.0,
      isAvailable: true,
    },
    {
      name: 'Personal Pizza',
      description: '7-inch hand-tossed artisan crust topped with San Marzano marinara, mozzarella, bell peppers, and olives.',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      category: 'BURGERS_PIZZA',
      price: 299.0,
      isAvailable: true,
    },

    // BEVERAGES
    {
      name: 'Coca-Cola (Large 500ml)',
      description: 'Chilled, bubbly fountain Coca-Cola served ice-cold in an insulated cinema cup.',
      image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
      category: 'BEVERAGES',
      price: 120.0,
      isAvailable: true,
    },
    {
      name: 'Pepsi (Large 500ml)',
      description: 'Refreshing carbonated cola with bold citrus notes served over crushed ice.',
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
      category: 'BEVERAGES',
      price: 120.0,
      isAvailable: true,
    },
    {
      name: 'Sprite (Large 500ml)',
      description: 'Crisp lemon-lime refreshment, caffeine-free and ultra chilled.',
      image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=800&q=80',
      category: 'BEVERAGES',
      price: 120.0,
      isAvailable: true,
    },
    {
      name: 'Cold Coffee Frappe',
      description: 'Velvety espresso blended with creamy vanilla milk, crushed ice, and mocha drizzle.',
      image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
      category: 'BEVERAGES',
      price: 170.0,
      isAvailable: true,
    },
    {
      name: 'Bottled Natural Mineral Water',
      description: 'Pure natural Himalayan spring mineral water (750ml).',
      image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
      category: 'BEVERAGES',
      price: 60.0,
      isAvailable: true,
    },

    // COMBOS
    {
      name: 'Popcorn + Drink Combo',
      description: 'Medium Tub Butter Popcorn + 500ml Chilled Beverage of choice. Save ₹50!',
      image: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&w=800&q=80',
      category: 'COMBOS',
      price: 290.0,
      isAvailable: true,
    },
    {
      name: 'Nachos + Drink Combo',
      description: 'Warm Cheese Nachos with salsa dip + 500ml Chilled Fountain Drink.',
      image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=800&q=80',
      category: 'COMBOS',
      price: 310.0,
      isAvailable: true,
    },
    {
      name: 'Family Feast Combo',
      description: '1 Jumbo Tub Caramel Popcorn + 1 Loaded Nachos + 2 Large Fountain Drinks. Perfect for four!',
      image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=800&q=80',
      category: 'COMBOS',
      price: 599.0,
      isAvailable: true,
    },
    {
      name: 'Movie Night Duo Combo',
      description: '1 Tub Cheese Popcorn + 1 Personal Veg Pizza + 2 Large Cold Drinks.',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      category: 'COMBOS',
      price: 499.0,
      isAvailable: true,
    },
  ];

  await prisma.snack.createMany({ data: snacksData });
  console.log(`[Seed] Seeded ${snacksData.length} snacks across POPCORN, NACHOS, BURGERS_PIZZA, BEVERAGES, COMBOS.`);
  console.log('--------------------------------------------------');
  console.log('✅ DATABASE SEED COMPLETED SUCCESSFULLY!');
  console.log('--------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('[Seed Error] Database seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
