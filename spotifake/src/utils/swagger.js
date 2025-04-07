const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Options de base pour Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API SpotiFake',
      version: '1.1.0',
      description: 'API similaire à Spotify construite avec Node.js, Express et MongoDB. Inclut le support pour servir une interface frontend et des images statiques.',
      contact: {
        name: 'Support API',
        email: 'contact@spotifake.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3002}`,
        description: 'Serveur de développement',
      },
    ],
    paths: {
      '/': {
        get: {
          summary: 'Page d\'accueil de l\'API',
          description: 'Retourne des informations générales sur l\'API',
          tags: ['General'],
          responses: {
            '200': {
              description: 'Informations sur l\'API',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'Bienvenue sur l\'API SpotiFake'
                      },
                      mongoStatus: {
                        type: 'string',
                        example: 'non connecté (mode mock activé)'
                      },
                      documentation: {
                        type: 'string',
                        example: '/api-docs'
                      },
                      endpoints: {
                        type: 'object',
                        properties: {
                          auth: { type: 'string', example: '/auth' },
                          users: { type: 'string', example: '/users' },
                          artists: { type: 'string', example: '/artists' },
                          albums: { type: 'string', example: '/albums' },
                          songs: { type: 'string', example: '/songs' },
                          playlists: { type: 'string', example: '/playlists' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/app': {
        get: {
          summary: 'Interface frontend de l\'application',
          description: 'Sert l\'interface utilisateur frontend de SpotiFake',
          tags: ['Frontend'],
          responses: {
            '200': {
              description: 'Page HTML de l\'interface utilisateur',
              content: {
                'text/html': {
                  schema: {
                    type: 'string',
                    example: '<!DOCTYPE html><html>...</html>'
                  }
                }
              }
            }
          }
        }
      },
      '/public/images/{imageName}': {
        get: {
          summary: 'Accès aux fichiers d\'images statiques',
          description: 'Sert les images utilisées par l\'application (pochettes d\'albums, photos d\'artistes, etc.)',
          tags: ['Frontend'],
          parameters: [
            {
              name: 'imageName',
              in: 'path',
              required: true,
              schema: {
                type: 'string'
              },
              description: 'Nom du fichier image',
              example: 'ram.jpg'
            }
          ],
          responses: {
            '200': {
              description: 'Fichier image',
              content: {
                'image/jpeg': {
                  schema: {
                    type: 'string',
                    format: 'binary'
                  }
                },
                'image/png': {
                  schema: {
                    type: 'string',
                    format: 'binary'
                  }
                }
              }
            },
            '404': {
              description: 'Image non trouvée'
            }
          }
        }
      },
      '/auth/signup': {
        post: {
          summary: 'Inscription d\'un nouvel utilisateur',
          tags: ['Auth'],
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['username', 'email', 'password'],
                  properties: {
                    username: {
                      type: 'string',
                      minLength: 3,
                      example: 'john.doe'
                    },
                    email: {
                      type: 'string',
                      format: 'email',
                      example: 'john.doe@example.com'
                    },
                    password: {
                      type: 'string',
                      format: 'password',
                      minLength: 6,
                      example: 'password123'
                    }
                  }
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Utilisateur créé avec succès',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: {
                        type: 'boolean',
                        example: true
                      },
                      token: {
                        type: 'string',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                      },
                      user: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'string',
                            example: '60d21b4667d0d8992e610c85'
                          },
                          username: {
                            type: 'string',
                            example: 'john.doe'
                          },
                          email: {
                            type: 'string',
                            example: 'john.doe@example.com'
                          },
                          role: {
                            type: 'string',
                            example: 'user'
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            '400': {
              $ref: '#/components/responses/BadRequest'
            },
            '500': {
              $ref: '#/components/responses/ServerError'
            }
          }
        }
      },
      '/auth/login': {
        post: {
          summary: 'Connexion d\'un utilisateur existant',
          tags: ['Auth'],
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: {
                      type: 'string',
                      format: 'email',
                      example: 'john.doe@example.com'
                    },
                    password: {
                      type: 'string',
                      format: 'password',
                      example: 'password123'
                    }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Connexion réussie',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: {
                        type: 'boolean',
                        example: true
                      },
                      token: {
                        type: 'string',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                      },
                      user: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'string',
                            example: '60d21b4667d0d8992e610c85'
                          },
                          username: {
                            type: 'string',
                            example: 'john.doe'
                          },
                          email: {
                            type: 'string',
                            example: 'john.doe@example.com'
                          },
                          role: {
                            type: 'string',
                            example: 'user'
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            '400': {
              $ref: '#/components/responses/BadRequest'
            },
            '401': {
              $ref: '#/components/responses/Unauthorized'
            },
            '500': {
              $ref: '#/components/responses/ServerError'
            }
          }
        }
      },
      '/auth/me': {
        get: {
          summary: 'Obtenir les informations de l\'utilisateur connecté',
          tags: ['Auth'],
          security: [
            {
              bearerAuth: []
            }
          ],
          responses: {
            '200': {
              description: 'Informations de l\'utilisateur récupérées avec succès',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: {
                        type: 'boolean',
                        example: true
                      },
                      data: {
                        $ref: '#/components/schemas/User'
                      }
                    }
                  }
                }
              }
            },
            '401': {
              $ref: '#/components/responses/Unauthorized'
            },
            '500': {
              $ref: '#/components/responses/ServerError'
            }
          }
        }
      },
      '/users': {
        get: {
          summary: 'Récupérer tous les utilisateurs',
          tags: ['Users'],
          security: [
            {
              bearerAuth: []
            }
          ],
          parameters: [
            {
              in: 'query',
              name: 'page',
              schema: {
                type: 'integer',
                default: 1
              },
              description: 'Numéro de page'
            },
            {
              in: 'query',
              name: 'limit',
              schema: {
                type: 'integer',
                default: 10
              },
              description: 'Nombre d\'éléments par page'
            }
          ],
          responses: {
            '200': {
              description: 'Liste des utilisateurs récupérée avec succès',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: {
                        type: 'boolean',
                        example: true
                      },
                      count: {
                        type: 'integer',
                        example: 10
                      },
                      data: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/User'
                        }
                      }
                    }
                  }
                }
              }
            },
            '401': {
              $ref: '#/components/responses/Unauthorized'
            },
            '403': {
              $ref: '#/components/responses/Forbidden'
            },
            '500': {
              $ref: '#/components/responses/ServerError'
            }
          }
        }
      }
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Erreur serveur'
            },
            error: {
              type: 'string',
              example: 'Détails de l\'erreur'
            }
          }
        },
        User: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            _id: {
              type: 'string',
              example: '60d21b4667d0d8992e610c85'
            },
            username: {
              type: 'string',
              example: 'john.doe'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john.doe@example.com'
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'password123'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              example: 'user'
            },
            favoriteArtists: {
              type: 'array',
              items: {
                type: 'string',
                example: '60d21b4667d0d8992e610c90'
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z'
            }
          }
        },
        Artist: {
          type: 'object',
          required: ['name'],
          properties: {
            _id: {
              type: 'string',
              example: '60d21b4667d0d8992e610c90'
            },
            name: {
              type: 'string',
              example: 'Daft Punk'
            },
            bio: {
              type: 'string',
              example: 'Duo français de musique électronique'
            },
            genres: {
              type: 'array',
              items: {
                type: 'string',
                example: 'electronic'
              }
            },
            image: {
              type: 'string',
              example: 'daft_punk.jpg'
            },
            popularity: {
              type: 'number',
              example: 90
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z'
            }
          }
        },
        Album: {
          type: 'object',
          required: ['title', 'artist'],
          properties: {
            _id: {
              type: 'string',
              example: '60d21b4667d0d8992e610c95'
            },
            title: {
              type: 'string',
              example: 'Random Access Memories'
            },
            artist: {
              type: 'string',
              example: '60d21b4667d0d8992e610c90'
            },
            releaseDate: {
              type: 'string',
              format: 'date-time',
              example: '2013-05-17T00:00:00.000Z'
            },
            coverImage: {
              type: 'string',
              example: 'ram.jpg'
            },
            genres: {
              type: 'array',
              items: {
                type: 'string',
                example: 'electronic'
              }
            },
            description: {
              type: 'string',
              example: 'Quatrième album studio de Daft Punk'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z'
            }
          }
        },
        Song: {
          type: 'object',
          required: ['title', 'artist', 'album', 'duration', 'audioFile'],
          properties: {
            _id: {
              type: 'string',
              example: '60d21b4667d0d8992e610c98'
            },
            title: {
              type: 'string',
              example: 'Get Lucky'
            },
            artist: {
              type: 'string',
              example: '60d21b4667d0d8992e610c90'
            },
            album: {
              type: 'string',
              example: '60d21b4667d0d8992e610c95'
            },
            duration: {
              type: 'number',
              example: 369
            },
            trackNumber: {
              type: 'number',
              example: 8
            },
            audioFile: {
              type: 'string',
              example: 'get_lucky.mp3'
            },
            genres: {
              type: 'array',
              items: {
                type: 'string',
                example: 'disco'
              }
            },
            playCount: {
              type: 'number',
              example: 5000000
            },
            isExplicit: {
              type: 'boolean',
              example: false
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z'
            }
          }
        },
        Playlist: {
          type: 'object',
          required: ['name', 'owner'],
          properties: {
            _id: {
              type: 'string',
              example: '60d21b4667d0d8992e610c99'
            },
            name: {
              type: 'string',
              example: 'Mes favoris'
            },
            description: {
              type: 'string',
              example: 'Playlist de démonstration'
            },
            owner: {
              type: 'string',
              example: 'user'
            },
            coverImage: {
              type: 'string',
              example: 'default-playlist.jpg'
            },
            isPublic: {
              type: 'boolean',
              example: true
            },
            songs: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  song: {
                    type: 'string',
                    example: '60d21b4667d0d8992e610c98'
                  },
                  addedAt: {
                    type: 'string',
                    format: 'date-time',
                    example: '2023-01-01T00:00:00.000Z'
                  }
                }
              }
            },
            followers: {
              type: 'array',
              items: {
                type: 'string',
                example: 'user'
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z'
            }
          }
        }
      },
      responses: {
        Unauthorized: {
          description: 'Authentification requise',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Non autorisé à accéder à cette route'
              }
            }
          }
        },
        Forbidden: {
          description: 'Accès refusé',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Role utilisateur non autorisé pour cette action'
              }
            }
          }
        },
        NotFound: {
          description: 'Ressource non trouvée',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Ressource non trouvée'
              }
            }
          }
        },
        BadRequest: {
          description: 'Requête invalide',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Données fournies invalides'
              }
            }
          }
        },
        ServerError: {
          description: 'Erreur serveur',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Erreur serveur',
                error: 'Détails de l\'erreur'
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'General',
        description: 'Opérations générales'
      },
      {
        name: 'Auth',
        description: 'Opérations d\'authentification'
      },
      {
        name: 'Users',
        description: 'Opérations sur les utilisateurs'
      },
      {
        name: 'Artists',
        description: 'Opérations sur les artistes'
      },
      {
        name: 'Albums',
        description: 'Opérations sur les albums'
      },
      {
        name: 'Songs',
        description: 'Opérations sur les chansons'
      },
      {
        name: 'Playlists',
        description: 'Opérations sur les playlists'
      },
      {
        name: 'Frontend',
        description: 'Opérations liées à l\'interface frontend'
      }
    ]
  },
  apis: [
    './src/routes/*.js',
    './src/models/*.js',
    './src/swagger/*.js',
  ],
};

// Génération de la spécification Swagger
const swaggerSpec = swaggerJsdoc(options);

// Exporter la fonction de configuration et la spécification
module.exports = swaggerSpec; 