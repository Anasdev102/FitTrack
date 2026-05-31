import { coachSchedulesApi } from '../../api/coachSchedulesApi';
import { createResourceSlice } from './createResourceSlice';

const slice = createResourceSlice('coachSchedules', coachSchedulesApi);

export const {
  fetchItems: fetchCoachSchedules,
  createItem: createCoachSchedule,
  updateItem: updateCoachSchedule,
  deleteItem: deleteCoachSchedule,
} = slice.actions;

export default slice.reducer;
