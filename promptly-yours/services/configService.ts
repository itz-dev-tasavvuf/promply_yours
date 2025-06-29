
import { WebAppConfig } from '../types';

const CONFIG_STORAGE_KEY_PREFIX = 'arcadeConfig_';

/**
 * Saves the user's arcade configuration to localStorage.
 * @param userId - The unique ID of the user.
 * @param config - The arcade configuration object.
 */
export const saveArcadeConfig = (userId: string, config: WebAppConfig): void => {
    if (!userId) {
        console.error("Cannot save config without a user ID.");
        return;
    }
    try {
        const key = `${CONFIG_STORAGE_KEY_PREFIX}${userId}`;
        localStorage.setItem(key, JSON.stringify(config));
    } catch (error) {
        console.error("Failed to save arcade config to localStorage:", error);
    }
};

/**
 * Retrieves the user's arcade configuration from localStorage.
 * @param userId - The unique ID of the user.
 * @returns The parsed WebAppConfig object or null if not found or on error.
 */
export const getArcadeConfig = (userId: string): WebAppConfig | null => {
    if (!userId) {
        console.error("Cannot get config without a user ID.");
        return null;
    }
    try {
        const key = `${CONFIG_STORAGE_KEY_PREFIX}${userId}`;
        const storedConfig = localStorage.getItem(key);
        if (storedConfig) {
            return JSON.parse(storedConfig) as WebAppConfig;
        }
        return null;
    } catch (error) {
        console.error("Failed to get or parse arcade config from localStorage:", error);
        return null;
    }
};
