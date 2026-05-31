import { coachesApi } from '../../api/coachesApi';
import { createResourceSlice } from './createResourceSlice';
const slice = createResourceSlice('coaches', coachesApi);
export const { fetchItems: fetchCoaches, createItem: createCoach, updateItem: updateCoach, deleteItem: deleteCoach } = slice.actions;
export default slice.reducer;
