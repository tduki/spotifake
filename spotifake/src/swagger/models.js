/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: ID unique généré automatiquement par MongoDB
 *         username:
 *           type: string
 *           description: Nom d'utilisateur unique
 *         email:
 *           type: string
 *           format: email
 *           description: Adresse email unique
 *         password:
 *           type: string
 *           format: password
 *           description: Mot de passe (haché en base de données)
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           default: user
 *           description: Rôle de l'utilisateur
 *         favoriteArtists:
 *           type: array
 *           items:
 *             type: string
 *           description: Liste des IDs d'artistes favoris
 *         listeningHistory:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               song:
 *                 type: string
 *                 description: ID de la chanson écoutée
 *               listenedAt:
 *                 type: string
 *                 format: date-time
 *                 description: Date/heure d'écoute
 *           description: Historique d'écoute
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création du compte
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date de dernière mise à jour
 *       example:
 *         _id: 60d0fe4f5311236168a109ca
 *         username: johndoe
 *         email: john@example.com
 *         role: user
 *         favoriteArtists: []
 *         listeningHistory: []
 *         createdAt: 2023-01-01T00:00:00.000Z
 *         updatedAt: 2023-01-01T00:00:00.000Z
 *     
 *     Artist:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: ID unique généré automatiquement par MongoDB
 *         name:
 *           type: string
 *           description: Nom de l'artiste
 *         bio:
 *           type: string
 *           description: Biographie de l'artiste
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *           description: Genres musicaux
 *         image:
 *           type: string
 *           description: URL de l'image de l'artiste
 *         popularity:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           description: Indice de popularité
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date de dernière mise à jour
 *       example:
 *         _id: 60d0fe4f5311236168a109cc
 *         name: Ed Sheeran
 *         bio: Chanteur-compositeur britannique
 *         genres: [pop, folk]
 *         image: ed_sheeran.jpg
 *         popularity: 95
 *         createdAt: 2023-01-01T00:00:00.000Z
 *         updatedAt: 2023-01-01T00:00:00.000Z
 *     
 *     Album:
 *       type: object
 *       required:
 *         - title
 *         - artist
 *         - releaseDate
 *       properties:
 *         _id:
 *           type: string
 *           description: ID unique généré automatiquement par MongoDB
 *         title:
 *           type: string
 *           description: Titre de l'album
 *         artist:
 *           type: string
 *           description: ID de l'artiste
 *         releaseDate:
 *           type: string
 *           format: date
 *           description: Date de sortie
 *         coverImage:
 *           type: string
 *           description: URL de la pochette
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *           description: Genres musicaux
 *         description:
 *           type: string
 *           description: Description de l'album
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date de dernière mise à jour
 *       example:
 *         _id: 60d0fe4f5311236168a109cd
 *         title: ÷ (Divide)
 *         artist: 60d0fe4f5311236168a109cc
 *         releaseDate: 2017-03-03T00:00:00.000Z
 *         coverImage: divide.jpg
 *         genres: [pop, folk]
 *         description: Troisième album studio d'Ed Sheeran
 *         createdAt: 2023-01-01T00:00:00.000Z
 *         updatedAt: 2023-01-01T00:00:00.000Z
 *     
 *     Song:
 *       type: object
 *       required:
 *         - title
 *         - artist
 *         - album
 *         - duration
 *         - audioFile
 *       properties:
 *         _id:
 *           type: string
 *           description: ID unique généré automatiquement par MongoDB
 *         title:
 *           type: string
 *           description: Titre de la chanson
 *         artist:
 *           type: string
 *           description: ID de l'artiste
 *         album:
 *           type: string
 *           description: ID de l'album
 *         duration:
 *           type: number
 *           description: Durée en secondes
 *         trackNumber:
 *           type: number
 *           description: Numéro de piste dans l'album
 *         audioFile:
 *           type: string
 *           description: Chemin vers le fichier audio
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *           description: Genres musicaux
 *         playCount:
 *           type: number
 *           description: Nombre d'écoutes
 *         isExplicit:
 *           type: boolean
 *           description: Contenu explicite
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date de dernière mise à jour
 *       example:
 *         _id: 60d0fe4f5311236168a109cb
 *         title: Shape of You
 *         artist: 60d0fe4f5311236168a109cc
 *         album: 60d0fe4f5311236168a109cd
 *         duration: 233
 *         trackNumber: 4
 *         audioFile: shape_of_you.mp3
 *         genres: [pop]
 *         playCount: 1500000
 *         isExplicit: false
 *         createdAt: 2023-01-01T00:00:00.000Z
 *         updatedAt: 2023-01-01T00:00:00.000Z
 *     
 *     Playlist:
 *       type: object
 *       required:
 *         - name
 *         - owner
 *       properties:
 *         _id:
 *           type: string
 *           description: ID unique généré automatiquement par MongoDB
 *         name:
 *           type: string
 *           description: Nom de la playlist
 *         description:
 *           type: string
 *           description: Description de la playlist
 *         owner:
 *           type: string
 *           description: ID du propriétaire
 *         coverImage:
 *           type: string
 *           description: URL de l'image de couverture
 *         isPublic:
 *           type: boolean
 *           description: Visibilité (publique/privée)
 *         songs:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               song:
 *                 type: string
 *                 description: ID de la chanson
 *               addedAt:
 *                 type: string
 *                 format: date-time
 *                 description: Date d'ajout
 *           description: Liste des chansons
 *         followers:
 *           type: array
 *           items:
 *             type: string
 *           description: IDs des utilisateurs qui suivent la playlist
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date de dernière mise à jour
 *       example:
 *         _id: 60d0fe4f5311236168a109d5
 *         name: My Favorites
 *         description: My favorite songs of all time
 *         owner: 60d0fe4f5311236168a109ca
 *         coverImage: playlist1.jpg
 *         isPublic: true
 *         songs:
 *           - song: 60d0fe4f5311236168a109cb
 *             addedAt: 2023-06-18T14:30:00.000Z
 *         followers: []
 *         createdAt: 2023-01-01T00:00:00.000Z
 *         updatedAt: 2023-01-01T00:00:00.000Z 