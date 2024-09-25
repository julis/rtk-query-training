import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

export const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/' }),
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      query: () => 'tasks',
      providesTags: ['Task'],
    }),
    addTask: builder.mutation<Task, Partial<Task>>({
      query: (newTask) => ({
        url: 'tasks',
        method: 'POST',
        body: newTask,
      }),
      invalidatesTags: ['Task'],
    }),
    updateTask: builder.mutation<Task, Task>({
      query: (task) => ({
        url: `tasks/${task.id}`,
        method: 'PUT',
        body: task,
      }),
      invalidatesTags: ['Task'],
    }),
    deleteTask: builder.mutation<void, number>({
      query: (id) => ({
        url: `tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;