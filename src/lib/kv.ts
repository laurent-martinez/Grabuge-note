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

// Créer le client Redis
let redisClient: ReturnType<typeof createClient> | null = null;

// Vérifier si on est en production (Vercel)
const isProduction = process.env.VERCEL_ENV === 'production' || process.env.REDIS_URL?.includes('redis://');

async function getRedisClient() {
  // En production seulement
  if (!isProduction || !process.env.REDIS_URL) {
    return null;
  }

  if (redisClient) {
    return redisClient;
  }

  try {
    redisClient = createClient({
      url: process.env.REDIS_URL,
    });

    redisClient.on('error', (err) => console.error('Redis Client Error', err));
    
    await redisClient.connect();
    console.log('✅ Redis connected successfully');
    
    return redisClient;
  } catch (error) {
    console.error('❌ Error connecting to Redis:', error);
    return null;
  }
}

// Assurer que le dossier data existe
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    console.log('📁 Data directory created');
  }
}

// Lire depuis un fichier JSON
async function readFromFile(filePath: string, defaultValue: any = []) {
  try {
    await ensureDataDir();
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Si le fichier n'existe pas, retourner la valeur par défaut
    return defaultValue;
  }
}

// Écrire dans un fichier JSON
async function writeToFile(filePath: string, data: any) {
  try {
    await ensureDataDir();
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing to file:', error);
    return false;
  }
}

// Fonction pour récupérer le menu
export async function getMenu() {
  try {
    const client = await getRedisClient();
    
    if (client) {
      // Production : utiliser Redis
      const data = await client.get(MENU_KEY);
      return data ? JSON.parse(data) : [];
    } else {
      // Dev local : utiliser fichier JSON
      const menu = await readFromFile(MENU_FILE, []);
      console.log('📖 Menu loaded from file');
      return menu;
    }
  } catch (error) {
    console.error('Error getting menu:', error);
    return [];
  }
}

// Fonction pour sauvegarder le menu
export async function saveMenu(menuItems: any[]) {
  try {
    const client = await getRedisClient();
    
    if (client) {
      // Production : utiliser Redis
      await client.set(MENU_KEY, JSON.stringify(menuItems));
      console.log('✅ Menu saved to Redis');
    } else {
      // Dev local : utiliser fichier JSON
      await writeToFile(MENU_FILE, menuItems);
      console.log('💾 Menu saved to file');
    }
    return true;
  } catch (error) {
    console.error('Error saving menu:', error);
    return false;
  }
}

// Fonction pour récupérer les notes
export async function getNotes() {
  try {
    const client = await getRedisClient();
    
    if (client) {
      // Production : utiliser Redis
      const data = await client.get(NOTES_KEY);
      return data ? JSON.parse(data) : [];
    } else {
      // Dev local : utiliser fichier JSON
      const notes = await readFromFile(NOTES_FILE, []);
      console.log('📖 Notes loaded from file');
      return notes;
    }
  } catch (error) {
    console.error('Error getting notes:', error);
    return [];
  }
}

// Fonction pour sauvegarder les notes
export async function saveNotes(notes: any[]) {
  try {
    const client = await getRedisClient();
    
    if (client) {
      // Production : utiliser Redis
      await client.set(NOTES_KEY, JSON.stringify(notes));
      console.log('✅ Notes saved to Redis');
    } else {
      // Dev local : utiliser fichier JSON
      await writeToFile(NOTES_FILE, notes);
      console.log('💾 Notes saved to file');
    }
    return true;
  } catch (error) {
    console.error('Error saving notes:', error);
    return false;
  }
}