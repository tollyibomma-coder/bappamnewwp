
// Firebase removed for database-less file-sync architecture.
export const auth = {
    onAuthStateChanged: (cb: any) => cb(null),
    signInWithEmailAndPassword: () => Promise.reject(),
    signOut: () => {}
};
