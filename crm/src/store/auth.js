import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut} from "firebase/auth";
import {getDatabase, ref, set} from "firebase/database";

export default {
    actions: {
        // eslint-disable-next-line no-unused-vars
        async login({dispatch, commit}, {email, password}) {
            // eslint-disable-next-line no-useless-catch
            try {
                const auth = getAuth();
                await signInWithEmailAndPassword(auth, email, password)
            } catch (e) {
                commit('setError', e);
                throw e
            }
        },
        async register({dispatch, commit}, {email, password, name}) {
            // eslint-disable-next-line no-useless-catch
            try {
                const auth = getAuth();
                await createUserWithEmailAndPassword(auth, email, password);
                const uid = await dispatch('getUid');
                const database = getDatabase();
                set(ref(database, `/users/${uid}/info`), {
                    bill: 10000,
                    name
                })
            } catch (e) {
                commit('setError', e)
            }
        },
        getUid() {
            const auth = getAuth();
            const user = auth.currentUser;
            return user ? user.uid : null;
        },
        async logout({commit}) {
            const auth = getAuth();
            await signOut(auth);
            commit('clearInfo');
        }
    }
}
