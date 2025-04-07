/**
 * Adaptateur de modèle pour les opérations de base de données
 * 
 * Cet adaptateur permet d'utiliser soit MongoDB via Mongoose,
 * soit notre base de données mock en fonction de l'état de la connexion
 */

const mongoose = require('mongoose');
const mockDb = require('./mockDb');

// Forcer le mode mock pour le développement
const FORCE_MOCK = false;

/**
 * Détermine si MongoDB est connecté
 * @returns {boolean} True si MongoDB est connecté, sinon false
 */
const isMongoConnected = () => {
  if (FORCE_MOCK) return false;
  return mongoose.connection.readyState === 1;
};

/**
 * Crée un adaptateur pour un modèle spécifique
 * @param {string} collectionName - Nom de la collection
 * @param {Object} mongooseModel - Modèle Mongoose (optionnel)
 * @returns {Object} Adaptateur avec méthodes CRUD
 */
const createModelAdapter = (collectionName, mongooseModel = null) => {
  // Vérifier que la collection existe dans notre mock
  if (!mockDb.collections[collectionName]) {
    throw new Error(`Collection "${collectionName}" non définie dans la base de données mock`);
  }

  return {
    /**
     * Crée un nouveau document
     * @param {Object} data - Données du document
     * @returns {Promise<Object>} Document créé
     */
    create: async (data) => {
      if (isMongoConnected() && mongooseModel) {
        return await mongooseModel.create(data);
      } else {
        const result = await mockDb.collections[collectionName].insertOne(data);
        return { _id: result.insertedId, ...data };
      }
    },

    /**
     * Trouve tous les documents correspondant aux critères
     * @param {Object} filter - Critères de recherche
     * @param {Object} options - Options de requête (projection, tri, etc.)
     * @returns {Promise<Array>} Documents trouvés
     */
    find: async (filter = {}, options = {}) => {
      if (isMongoConnected() && mongooseModel) {
        let query = mongooseModel.find(filter);
        
        if (options.select) query = query.select(options.select);
        if (options.sort) query = query.sort(options.sort);
        if (options.skip) query = query.skip(options.skip);
        if (options.limit) query = query.limit(options.limit);
        if (options.populate) query = query.populate(options.populate);
        
        return await query.exec();
      } else {
        let query = mockDb.collections[collectionName].find(filter);
        
        if (options.sort) query = query.sort(options.sort);
        if (options.skip && options.limit) {
          return await query.skip(options.skip).limit(options.limit).toArray();
        } else if (options.skip) {
          return await query.skip(options.skip).toArray();
        } else if (options.limit) {
          return await query.limit(options.limit).toArray();
        } else {
          return await query.toArray();
        }
      }
    },

    /**
     * Trouve un document par ID
     * @param {string} id - ID du document
     * @param {Object} options - Options de requête
     * @returns {Promise<Object>} Document trouvé ou null
     */
    findById: async (id, options = {}) => {
      if (isMongoConnected() && mongooseModel) {
        let query = mongooseModel.findById(id);
        
        if (options.select) query = query.select(options.select);
        if (options.populate) query = query.populate(options.populate);
        
        return await query.exec();
      } else {
        return await mockDb.collections[collectionName].findById(id);
      }
    },

    /**
     * Trouve un document par critères
     * @param {Object} filter - Critères de recherche
     * @param {Object} options - Options de requête
     * @returns {Promise<Object>} Document trouvé ou null
     */
    findOne: async (filter = {}, options = {}) => {
      if (isMongoConnected() && mongooseModel) {
        let query = mongooseModel.findOne(filter);
        
        if (options.select) query = query.select(options.select);
        if (options.populate) query = query.populate(options.populate);
        
        return await query.exec();
      } else {
        return await mockDb.collections[collectionName].findOne(filter);
      }
    },

    /**
     * Met à jour un document par ID
     * @param {string} id - ID du document
     * @param {Object} updateData - Données de mise à jour
     * @param {Object} options - Options de requête
     * @returns {Promise<Object>} Document mis à jour ou null
     */
    findByIdAndUpdate: async (id, updateData, options = {}) => {
      if (isMongoConnected() && mongooseModel) {
        return await mongooseModel.findByIdAndUpdate(id, updateData, {
          new: options.new !== undefined ? options.new : true,
          runValidators: options.runValidators !== undefined ? options.runValidators : true,
          ...options
        });
      } else {
        return await mockDb.collections[collectionName].findByIdAndUpdate(id, updateData, options);
      }
    },

    /**
     * Supprime un document par ID
     * @param {string} id - ID du document
     * @returns {Promise<Object>} Document supprimé ou null
     */
    findByIdAndDelete: async (id) => {
      if (isMongoConnected() && mongooseModel) {
        return await mongooseModel.findByIdAndDelete(id);
      } else {
        return await mockDb.collections[collectionName].findByIdAndDelete(id);
      }
    },

    /**
     * Compte le nombre de documents correspondant aux critères
     * @param {Object} filter - Critères de recherche
     * @returns {Promise<number>} Nombre de documents
     */
    countDocuments: async (filter = {}) => {
      if (isMongoConnected() && mongooseModel) {
        return await mongooseModel.countDocuments(filter);
      } else {
        return await mockDb.collections[collectionName].countDocuments(filter);
      }
    }
  };
};

module.exports = {
  createModelAdapter,
  isMongoConnected
}; 