import { TodoType } from '../../types/common';

export type TodoPageProps = {
  todo: TodoType | undefined;
  goBack: () => void;
  onRemove: (id: string) => void;
  onSave: (id: string, title: string) => void;
}
