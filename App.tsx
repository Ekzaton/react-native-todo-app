import { loadAsync } from 'expo-font';
import { hideAsync, preventAutoHideAsync } from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import Navbar from './src/components/Navbar/Navbar';
import { Theme } from './src/constants/theme';
import MainPage from './src/pages/MainPage/MainPage';
import TodoPage from './src/pages/TodoPage/TodoPage';
import { Todo } from './src/types/common';

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', title: 'test1' },
    { id: '2', title: 'test2' },
    { id: '3', title: 'test3' },
    { id: '4', title: 'test4' },
    { id: '5', title: 'test5' }
  ]);
  const [todoID, setTodoID] = useState<string | null>(null);

  useEffect(() => {
    async function prepare() {
      try {
        await preventAutoHideAsync();
        await loadAsync({
          'roboto-bold': require('./assets/fonts/Roboto-Bold.ttf'),
          'roboto-regular': require('./assets/fonts/Roboto-Regular.ttf')
        })
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) await hideAsync();
  }, [appIsReady])

  if (!appIsReady) return null

  const addTodoHandler = (title: string) => {
    setTodos((prev) => [...prev, {
      id: Date.now().toString(),
      title: title,
    }])
  }

  const removeTodoHandler = (id: string) => {
    const todo = todos.find((todo) => todo.id === id);

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
            onPress: () => {
              setTodoID(null);
              setTodos((prev) => prev.filter((todo) => todo.id !== id));
            }
          }
        ]
    );
  }

  const updateTodoHandler = (id: string, title: string) => {
    setTodos((prev) => prev.map((todo) => {
      if (todo.id === id) todo.title = title;
      return todo;
    }))
  }

  let content = <MainPage todos={todos} addTodo={addTodoHandler} openTodo={setTodoID} removeTodo={removeTodoHandler} />

  if (todoID) {
    const selectedTodo = todos.find((todo) => todo.id === todoID);
    content = <TodoPage
        todo={selectedTodo}
        goBack={() => setTodoID(null)}
        onRemove={removeTodoHandler}
        onSave={updateTodoHandler}
    />
  }

  return (
    <View onLayout={onLayoutRootView}>
      <Navbar title='Todo App' />
      <View style={styles.container}>
        {content}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Theme.PADDING_HORIZONTAL,
    paddingVertical: 20,
  }
});
