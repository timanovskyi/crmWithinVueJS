import {getDatabase, push, ref} from "firebase/database";

export default {
    actions: {
        async createRecord({dispatch, commit}, record) {
            try {
                const uid = await dispatch('getUid');
                const database = getDatabase();
                const key = await push(ref(database, `/users/${uid}/records`), record).key

                return {...record, id: key};

            } catch (e) {
                commit('setError', e);
                throw e
            }
        },
    }
}
