/**
 * @swagger
 * /artists:
 *   get:
 *     summary: Récupérer tous les artistes
 *     tags: [Artists]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre d'artistes par page
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filtrer par genre
 *     responses:
 *       200:
 *         description: Liste des artistes récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Artist'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 * 
 * /artists/{id}:
 *   get:
 *     summary: Récupérer un artiste par son ID
 *     tags: [Artists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'artiste
 *     responses:
 *       200:
 *         description: Artiste récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Artist'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 * 
 * /albums:
 *   get:
 *     summary: Récupérer tous les albums
 *     tags: [Albums]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre d'albums par page
 *       - in: query
 *         name: artist
 *         schema:
 *           type: string
 *         description: ID de l'artiste pour filtrer les albums
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filtrer par genre
 *     responses:
 *       200:
 *         description: Liste des albums récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Album'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 * 
 * /albums/{id}:
 *   get:
 *     summary: Récupérer un album par son ID
 *     tags: [Albums]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'album
 *     responses:
 *       200:
 *         description: Album récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Album'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 * 
 * /songs:
 *   get:
 *     summary: Récupérer toutes les chansons
 *     tags: [Songs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre de chansons par page
 *       - in: query
 *         name: artist
 *         schema:
 *           type: string
 *         description: ID de l'artiste pour filtrer les chansons
 *       - in: query
 *         name: album
 *         schema:
 *           type: string
 *         description: ID de l'album pour filtrer les chansons
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filtrer par genre
 *     responses:
 *       200:
 *         description: Liste des chansons récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Song'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 * 
 * /songs/{id}:
 *   get:
 *     summary: Récupérer une chanson par son ID
 *     tags: [Songs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la chanson
 *     responses:
 *       200:
 *         description: Chanson récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Song'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 * 
 * /songs/{id}/play:
 *   post:
 *     summary: Marquer une chanson comme jouée (incrémente le playCount)
 *     tags: [Songs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la chanson
 *     responses:
 *       200:
 *         description: Chanson marquée comme jouée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Song'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 * 
 * /playlists:
 *   get:
 *     summary: Récupérer toutes les playlists publiques
 *     tags: [Playlists]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre de playlists par page
 *     responses:
 *       200:
 *         description: Liste des playlists récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Playlist'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 * 
 *   post:
 *     summary: Créer une nouvelle playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Ma nouvelle playlist"
 *               description:
 *                 type: string
 *                 example: "Description de ma playlist"
 *               isPublic:
 *                 type: boolean
 *                 default: true
 *               coverImage:
 *                 type: string
 *                 example: "image.jpg"
 *     responses:
 *       201:
 *         description: Playlist créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Playlist'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 * 
 * /playlists/{id}:
 *   get:
 *     summary: Récupérer une playlist par son ID
 *     tags: [Playlists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la playlist
 *     responses:
 *       200:
 *         description: Playlist récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Playlist'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 * 
 * /playlists/{id}/songs:
 *   post:
 *     summary: Ajouter une chanson à une playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la playlist
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - songId
 *             properties:
 *               songId:
 *                 type: string
 *                 example: "60d21b4667d0d8992e610c98"
 *     responses:
 *       200:
 *         description: Chanson ajoutée à la playlist avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Playlist'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */ 