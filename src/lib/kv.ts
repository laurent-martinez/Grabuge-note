// Vérifier si KV est configuré
const isKVConfigured = !!(
  process.env.KV_REST_API_URL && 
  process.env.KV_REST_API_TOKEN
);

// Importer KV seulement si configuré
let kv: any = null;
if (isKVConfigured) {
  try {
    const kvModule = await import('@vercel/kv');
    kv = kvModule.kv;
  } catch (error) {
    console.warn('Vercel KV non disponible:', error);
  }
}

// Clés pour stocker les données
const MENU_KEY = 'restaurant:menu';
const NOTES_KEY = 'restaurant:notes';

// Stockage en mémoire pour le développement local
let memoryStorage: { [key: string]: any } = {};

// Fonction pour récupérer le menu
export async function getMenu() {
  try {
    if (kv) {
      const menu = await kv.get(MENU_KEY);
      return menu || [];
    } else {
      // Mode développement local - retourner depuis la mémoire
      return memoryStorage[MENU_KEY] || [];
    }
  } catch (error) {
    console.error('Error getting menu:', error);
    return [];
  }
}

// Fonction pour sauvegarder le menu
export async function saveMenu(menuItems: any[]) {
  try {
    if (kv) {
      await kv.set(MENU_KEY, menuItems);
    } else {
      // Mode développement local - sauvegarder en mémoire
      memoryStorage[MENU_KEY] = menuItems;
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
    if (kv) {
      const notes = await kv.get(NOTES_KEY);
      return notes || [];
    } else {
      // Mode développement local - retourner depuis la mémoire
      return memoryStorage[NOTES_KEY] || [];
    }
  } catch (error) {
    console.error('Error getting notes:', error);
    return [];
  }
}

// Fonction pour sauvegarder les notes
export async function saveNotes(notes: any[]) {
  try {
    if (kv) {
      await kv.set(NOTES_KEY, notes);
    } else {
      // Mode développement local - sauvegarder en mémoire
      memoryStorage[NOTES_KEY] = notes;
    }
    return true;
  } catch (error) {
    console.error('Error saving notes:', error);
    return false;
  }
}
