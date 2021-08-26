import {getDatabase, onValue, ref} from "firebase/database";

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
        }
    },
    getters: {
        info: s => s.info
    }
}
