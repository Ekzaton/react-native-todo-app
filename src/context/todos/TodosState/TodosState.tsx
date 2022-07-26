import { useContext, useReducer } from 'react';
import { Alert } from 'react-native';

import {
  ADD_TODO,
  CLEAR_ERROR,
  FETCH_TODOS,
  HIDE_LOADER,
  REMOVE_TODO,
  SHOW_ERROR,
  SHOW_LOADER,
  UPDATE_TODO
} from '../../../constants/actions';
import { BASE_URL } from '../../../constants/api';
import API from '../../../helpers/API';
import { Todo } from '../../../types/common';
import { Pages } from '../../../types/context';

import { PagesContext } from '../../pages/pagesContext';

import { TodosContext } from '../todosContext';
import { todosReducer } from '../todosReducer';

import { TodosStateProps } from './TodosState.props';

export const initialState = {
  todos: [] as Todo[],
  loading: false,
  error: null as Error | null
}

export default function TodosState(props: TodosStateProps) {
  const { children } = props;

  const { changePage } = useContext<Pages>(PagesContext);

  const [state, dispatch] = useReducer(todosReducer, initialState);

  const addTodo = async (title: string) => {
    clearError();
    try {
      const data = await API.post(`${BASE_URL}/todos.json`, { title });
      dispatch({ type: ADD_TODO, id: data.name, title });
    } catch (e) {
      showError('Что-то пошло не так...');
    }
  };

  const removeTodo = (id: string) => {
    const todo = state.todos.find((todo) => todo.id === id);
    Alert.alert(
        'Удаление',
        `Вы уверены что хотите удалить "${todo!.title}"?`,
        [
          {
            text: 'Отмена',
            style: "cancel",
          },
          {
            text: 'Удалить',
            style: 'destructive',
            onPress: async () => {
              changePage(null);
              clearError();
              try {
                await API.delete(`${BASE_URL}/todos/${id}.json`);
                dispatch({ type: REMOVE_TODO, id });
              } catch (e) {
                showError('Что-то пошло не так...');
              }
            }
          }
        ]
    );
  };

  const updateTodo = async (id: string, title: string) => {
    clearError();
    try {
      await API.patch(`${BASE_URL}/todos/${id}.json`, { title });
      dispatch({ type: UPDATE_TODO, id, title });
    } catch (e) {
      showError('Что-то пошло не так...');
    }
  };

  const fetchTodos = async () => {
    showLoader();
    clearError();
    try {
      const data = await API.get(`${BASE_URL}/todos.json`);
      const todos = Object.keys(data).map((key) => ({ ...data[key], id: key }))
      dispatch({ type: FETCH_TODOS, todos });
    } catch (e) {
      showError('Что-то пошло не так...');
    } finally {
      hideLoader();
    }
  }

  const showLoader = () => dispatch({ type: SHOW_LOADER });

  const hideLoader = () => dispatch({ type: HIDE_LOADER })

  const showError = (error: string) => dispatch({ type: SHOW_ERROR, error })

  const clearError = () => dispatch({ type: CLEAR_ERROR })

  const value = {
    todos: state.todos,
    loading: state.loading,
    error: state.error,
    addTodo,
    fetchTodos,
    removeTodo,
    updateTodo,
  };

  return <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
}

export type TodosState = typeof initialState;
