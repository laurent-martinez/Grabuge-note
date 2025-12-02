import { createClient } from 'redis';

// Clés pour stocker les données
const MENU_KEY = 'restaurant:menu';
const NOTES_KEY = 'restaurant:notes';

// Créer le client Redis
let redisClient: ReturnType<typeof createClient> | null = null;

async function getRedisClient() {
  if (!process.env.REDIS_URL) {
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
    console.log('Redis connected successfully');
    
    return redisClient;
  } catch (error) {
    console.error('Error connecting to Redis:', error);
    return null;
  }
}

// Stockage en mémoire pour le développement local
const memoryStorage: { [key: string]: any } = {};

// Fonction pour récupérer le menu
export async function getMenu() {
  try {
    const client = await getRedisClient();
    
    if (client) {
      const data = await client.get(MENU_KEY);
      return data ? JSON.parse(data) : [];
    } else {
      // Mode développement local - retourner depuis la mémoire
      return memoryStorage[MENU_KEY] || [];
    }
  } catch (error) {
    console.error('Error getting menu:', error);
    return memoryStorage[MENU_KEY] || [];
  }
}

// Fonction pour sauvegarder le menu
export async function saveMenu(menuItems: any[]) {
  try {
    const client = await getRedisClient();
    
    if (client) {
      await client.set(MENU_KEY, JSON.stringify(menuItems));
      console.log('Menu saved to Redis successfully');
    } else {
      // Mode développement local - sauvegarder en mémoire
      memoryStorage[MENU_KEY] = menuItems;
      console.log('Menu saved to memory (dev mode)');
    }
    return true;
  } catch (error) {
    console.error('Error saving menu:', error);
    // Fallback to memory
    memoryStorage[MENU_KEY] = menuItems;
    return true;
  }
}

// Fonction pour récupérer les notes
export async function getNotes() {
  try {
    const client = await getRedisClient();
    
    if (client) {
      const data = await client.get(NOTES_KEY);
      return data ? JSON.parse(data) : [];
    } else {
      // Mode développement local - retourner depuis la mémoire
      return memoryStorage[NOTES_KEY] || [];
    }
  } catch (error) {
    console.error('Error getting notes:', error);
    return memoryStorage[NOTES_KEY] || [];
  }
}

// Fonction pour sauvegarder les notes
export async function saveNotes(notes: any[]) {
  try {
    const client = await getRedisClient();
    
    if (client) {
      await client.set(NOTES_KEY, JSON.stringify(notes));
      console.log('Notes saved to Redis successfully');
    } else {
      // Mode développement local - sauvegarder en mémoire
      memoryStorage[NOTES_KEY] = notes;
      console.log('Notes saved to memory (dev mode)');
    }
    return true;
  } catch (error) {
    console.error('Error saving notes:', error);
    // Fallback to memory
    memoryStorage[NOTES_KEY] = notes;
    return true;
  }
}