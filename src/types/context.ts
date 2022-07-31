import { Todo } from './common';

export type Todos = {
  todos: Todo[];
  addTodo: (title: string) => void;
  removeTodo: (id: string) => void;
  updateTodo: (id: string, title: string) => void;
}
