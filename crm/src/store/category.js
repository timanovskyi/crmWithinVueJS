import {get, getDatabase, push, ref, set} from "firebase/database";

export default {
    mutations: {
        setCategories(state, categories) {
            state.categories = categories;
        },
        clearCategories(state) {
            state.categories = {};
        }
    },
    getters: {
        categories: s => s.categories
    },
    actions: {
        async createCategory({dispatch, commit}, {title, limit}) {
            try {
                const uid = await dispatch('getUid');
                const database = getDatabase();
                const key = await push(ref(database, `/users/${uid}/categories`), {
                    title,
                    limit
                }).key

                return {title, limit, id: key};

            } catch (e) {
                commit('setError', e);
                throw e
            }
        },
        async fetchCategories({dispatch}) {
            try {
                const uid = await dispatch('getUid');
                const database = getDatabase();
                const cat = (await get(ref(database, `/users/${uid}/categories`))).val() || {};
                return Object.keys(cat).map(key => ({...cat[key], id: key}))
            } catch (e) {
                console.log(e)
            }
        },
        async updateCategory({dispatch, commit}, {title, limit, id}) {
            try {
                const uid = await dispatch('getUid');
                const database = getDatabase();
                await set(ref(database, `/users/${uid}/categories/${id}`), {
                    limit,
                    title
                })
            }
             catch (e) {
                commit('setError', e);
                throw e
            }
        },
    }
}
