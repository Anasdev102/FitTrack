import { membersApi } from '../../api/membersApi';
import { createResourceSlice } from './createResourceSlice';
const slice = createResourceSlice('members', membersApi);
export const { fetchItems: fetchMembers, createItem: createMember, updateItem: updateMember, deleteItem: deleteMember } = slice.actions;
export default slice.reducer;
