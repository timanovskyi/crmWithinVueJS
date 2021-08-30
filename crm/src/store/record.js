import {get, getDatabase, push, ref} from "firebase/database";

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
        async fetchRecords({dispatch}) {
            try {
                const uid = await dispatch('getUid');
                const database = getDatabase();
                const records = (await get(ref(database, `/users/${uid}/records`))).val() || {};
                return Object.keys(records).map(key => ({...records[key], id: key}))
            } catch (e) {
                console.log(e)
            }
        },
        async fetchRecordById({dispatch}, id) {
            try {
                const uid = await dispatch('getUid');
                const database = getDatabase();
                const record = (await get(ref(database, `/users/${uid}/records/${id}`))).val() || {};
                return {...record, id}
            } catch (e) {
                console.log(e)
            }
        },
    }
}
