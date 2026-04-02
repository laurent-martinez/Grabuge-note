import { createClient } from 'redis';
import fs from 'fs/promises';
import path from 'path';

// Clés pour stocker les données
const MENU_KEY = 'restaurant:menu';
const NOTES_KEY = 'restaurant:notes';

// Chemins des fichiers JSON pour le stockage local
const DATA_DIR = path.join(process.cwd(), 'data');
const MENU_FILE = path.join(DATA_DIR, 'menu.json');
const NOTES_FILE = path.join(DATA_DIR, 'notes.json');

// Créer le client Redis (singleton)
let redisClient: ReturnType<typeof createClient> | null = null;
let isConnecting = false;

// Vérifier si on est en production (Vercel avec Redis)
const isProduction = process.env.VERCEL_ENV === 'production' && process.env.REDIS_URL;

async function getRedisClient() {
  // Si pas en production ou pas de REDIS_URL, pas de Redis
  if (!isProduction || !process.env.REDIS_URL) {
    console.log('📝 Mode développement : utilisation de fichiers JSON');
    return null;
  }

  // Si déjà connecté, retourner le client existant
  if (redisClient && redisClient.isOpen) {
    return redisClient;
  }

  // Si en cours de connexion, attendre
  if (isConnecting) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return getRedisClient();
  }

  // Créer une nouvelle connexion
  isConnecting = true;

  try {
    redisClient = createClient({
      url: process.env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.error('❌ Redis: Trop de tentatives de reconnexion');
            return new Error('Too many retries');
          }
          return retries * 100; // Délai exponentiel
        }
      }
    });

    redisClient.on('error', (err) => {
      console.error('❌ Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('🔄 Redis: Connexion en cours...');
    });

    redisClient.on('ready', () => {
      console.log('✅ Redis: Connecté et prêt');
    });
    
    await redisClient.connect();
    isConnecting = false;
    
    return redisClient;
  } catch (error) {
    console.error('❌ Erreur connexion Redis:', error);
    isConnecting = false;
    redisClient = null;
    return null;
  }
}

// Assurer que le dossier data existe
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    console.log('📁 Dossier data créé');
  }
}

// ⚠️ CHANGEMENT ICI : Plus de defaultValue, toujours retourner null si pas de fichier
async function readFromFile(filePath: string) {
  try {
    await ensureDataDir();
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // ✅ Retourner null si le fichier n'existe pas (pas de defaultValue !)
    return null;
  }
}

// Écrire dans un fichier JSON
async function writeToFile(filePath: string, data: any) {
  try {
    await ensureDataDir();
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('❌ Erreur écriture fichier:', error);
    return false;
  }
}

// Fonction pour récupérer le menu
export async function getMenu() {
  try {
    const client = await getRedisClient();
    
    if (client) {
      // Production : utiliser Redis
      try {
        const data = await client.get(MENU_KEY);
        // ✅ Si pas de données Redis, retourner null (pas [])
        if (!data) {
          console.log('📖 Menu Redis vide - première fois');
          return null;
        }
        const menu = JSON.parse(data);
        console.log('📖 Menu chargé depuis Redis:', menu.length, 'items');
        return menu;
      } catch (error) {
        console.error('❌ Erreur lecture Redis menu:', error);
        return null;
      }
    } else {
      // Dev local : utiliser fichier JSON
      // ✅ readFromFile retourne maintenant null si pas de fichier
      const menu = await readFromFile(MENU_FILE);
      if (menu === null) {
        console.log('📖 Fichier menu.json inexistant - première fois');
        return null;
      }
      console.log('📖 Menu chargé depuis fichier:', menu.length, 'items');
      return menu;
    }
  } catch (error) {
    console.error('❌ Erreur getMenu:', error);
    return null;
  }
}

// Fonction pour sauvegarder le menu
export async function saveMenu(menuItems: any[]) {
  try {
    const client = await getRedisClient();
    
    if (client) {
      // Production : utiliser Redis
      try {
        await client.set(MENU_KEY, JSON.stringify(menuItems));
        console.log('✅ Menu sauvegardé dans Redis:', menuItems.length, 'items');
        
        // Vérifier immédiatement que c'est bien sauvegardé
        const verification = await client.get(MENU_KEY);
        const saved = verification ? JSON.parse(verification) : [];
        console.log('🔍 Vérification Redis menu:', saved.length, 'items sauvegardés');
        
        return true;
      } catch (error) {
        console.error('❌ Erreur sauvegarde Redis menu:', error);
        return false;
      }
    } else {
      // Dev local : utiliser fichier JSON
      const success = await writeToFile(MENU_FILE, menuItems);
      if (success) {
        console.log('💾 Menu sauvegardé dans fichier:', menuItems.length, 'items');
      }
      return success;
    }
  } catch (error) {
    console.error('❌ Erreur saveMenu:', error);
    return false;
  }
}

// Fonction pour récupérer les notes
export async function getNotes() {
  try {
    const client = await getRedisClient();
    
    if (client) {
      // Production : utiliser Redis
      try {
        const data = await client.get(NOTES_KEY);
        const notes = data ? JSON.parse(data) : [];
        console.log('📖 Notes chargées depuis Redis:', notes.length, 'notes');
        return notes;
      } catch (error) {
        console.error('❌ Erreur lecture Redis notes:', error);
        return [];
      }
    } else {
      // Dev local : utiliser fichier JSON
      const notes = await readFromFile(NOTES_FILE);
      // ✅ Pour les notes, on accepte null et on retourne []
      if (notes === null) {
        console.log('📖 Fichier notes.json inexistant - retour tableau vide');
        return [];
      }
      console.log('📖 Notes chargées depuis fichier:', notes.length, 'notes');
      return notes;
    }
  } catch (error) {
    console.error('❌ Erreur getNotes:', error);
    return [];
  }
}

// Fonction pour sauvegarder les notes
export async function saveNotes(notes: any[]) {
  try {
    const client = await getRedisClient();
    
    if (client) {
      // Production : utiliser Redis
      try {
        await client.set(NOTES_KEY, JSON.stringify(notes));
        console.log('✅ Notes sauvegardées dans Redis:', notes.length, 'notes');
        
        // Vérifier immédiatement que c'est bien sauvegardé
        const verification = await client.get(NOTES_KEY);
        const saved = verification ? JSON.parse(verification) : [];
        console.log('🔍 Vérification Redis notes:', saved.length, 'notes sauvegardées');
        
        return true;
      } catch (error) {
        console.error('❌ Erreur sauvegarde Redis notes:', error);
        return false;
      }
    } else {
      // Dev local : utiliser fichier JSON
      const success = await writeToFile(NOTES_FILE, notes);
      if (success) {
        console.log('💾 Notes sauvegardées dans fichier:', notes.length, 'notes');
      }
      return success;
    }
  } catch (error) {
    console.error('❌ Erreur saveNotes:', error);
    return false;
  }
}