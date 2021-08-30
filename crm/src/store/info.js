import {getDatabase, onValue, ref, set} from "firebase/database";

export default {
    state: {
        info: {}
    },
    mutations: {
        setInfo(state, info) {
            state.info = info;
        },
        clearInfo(state) {
            state.info = {};
        }
    },
    actions: {
        async fetchInfo({dispatch, commit}) {
            try {
                const uid = await dispatch('getUid');
                const database = getDatabase();
                await onValue(ref(database, `/users/${uid}/info`), (snapshot) => {
                    const username = (snapshot.val() && snapshot.val());
                    commit('setInfo', username)
                }, {
                    onlyOnce: true
                });
            } catch (e) {
                console.log(e)
            }
        },
        async updateInfo({dispatch, commit, getters}, value) {
            try {
                const uid = await dispatch('getUid');
                const database = getDatabase();
                const data = {...getters.info, ...value}
                await set(ref(database, `/users/${uid}/info`), data)
                commit('setInfo', data)
            }
            catch (e) {
                commit('setError', e);
                throw e
            }
        },
    },
    getters: {
        info: s => s.info
    }
}
