
import React, { useState, useEffect, useRef } from 'react';
import { ForumPost } from '../types';

// FIX: The React namespace was not imported, causing an error with types like React.Dispatch.
export function useLocalStorage<T,>(key: string, initialValue: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue instanceof Function ? initialValue() : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue instanceof Function ? initialValue() : initialValue;
    }
  });

  useEffect(() => {
    try {
      const valueToStore = storedValue;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

/**
 * A custom hook to simulate real-time updates for the forum.
 * This provides a dynamic experience without a backend server.
 */
export function useRealtimeForum(initialPosts: ForumPost[]) {
    const [posts, setPosts] = useState<ForumPost[]>(initialPosts);
    const timeoutIdsRef = useRef<Set<number>>(new Set());

    useEffect(() => {
        const scheduleTimeout = (callback: () => void, delay: number) => {
            const id = window.setTimeout(() => {
                callback();
                timeoutIdsRef.current.delete(id); // Clean up ID after execution
            }, delay);
            timeoutIdsRef.current.add(id);
        };

        const runSimulation = () => {
            setPosts(currentPosts => {
                const shouldAddNewPost = Math.random() < 0.2; // 20% chance to add a new post
                let updatedPosts = [...currentPosts];
                let newOrUpdatedPostId: string | null = null;

                if (shouldAddNewPost) {
                    const newPost: ForumPost = {
                        id: new Date().toISOString(),
                        author: 'Utilisateur_Actif',
                        title: 'Nouvelle discussion en direct !',
                        content: 'Ceci est un exemple de nouvelle publication apparaissant en temps réel pour montrer la collaboration.',
                        timestamp: 'À l\'instant',
                        date: new Date().toISOString(),
                        replies: 0,
                        category: 'Soutien',
                        isNew: true,
                    };
                    updatedPosts = [newPost, ...currentPosts];
                    newOrUpdatedPostId = newPost.id;
                } else if (currentPosts.length > 0) {
                    const postIndexToUpdate = Math.floor(Math.random() * currentPosts.length);
                    const postToUpdate = { ...updatedPosts[postIndexToUpdate] };
                    
                    postToUpdate.replies += 1;
                    postToUpdate.timestamp = 'À l\'instant';
                    postToUpdate.isNew = true;
                    updatedPosts[postIndexToUpdate] = postToUpdate;
                    newOrUpdatedPostId = postToUpdate.id;
                }
                
                if (newOrUpdatedPostId) {
                    // Schedule removal of the highlight
                    scheduleTimeout(() => {
                        setPosts(prev => prev.map(p => p.id === newOrUpdatedPostId ? { ...p, isNew: false } : p));
                    }, 3000);
                }
                
                return updatedPosts;
            });
            
            // Schedule the next simulation tick
            const nextDelay = 3000 + Math.random() * 4000; // 3 to 7 seconds
            scheduleTimeout(runSimulation, nextDelay);
        };

        // Start the first simulation tick
        scheduleTimeout(runSimulation, 3000 + Math.random() * 4000);

        // Cleanup all scheduled timeouts on unmount
        return () => {
            timeoutIdsRef.current.forEach(id => clearTimeout(id));
            timeoutIdsRef.current.clear();
        };
    }, []);

    return { posts };
}
