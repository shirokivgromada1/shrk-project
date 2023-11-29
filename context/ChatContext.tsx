import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";

interface SocketRefs {
  [key: number]: WebSocket;
}

export type User = {
  id: number;
};

export type Chat = {
  type: "chat" | "feedback" | "help" | "offers";
  created: string;
  id: number;
  method: string;
  notifyInViber: boolean;
  receiver: number;
  title: string;
  status: "inProgress" | "completed" | "rejected";
  latest_message_id: number;
  latest_message_sender_id: number;
  latest_message: string;
  latest_message_created: string;
  latest_message_seen: boolean;
};

export type Group = {
  id: number;
  created: string;
  description: string;
  files?: {
    created: string;
    filename: string;
    files: string;
    group: number;
    id: number;
    size: number;
  }[];
  locality_items: {
    id: number;
    locality: string;
  }[];
  status_items: {
    id: number;
    status: string;
  }[];
  users_items: User[];
  title: string;
  seen_items: User[];
};

type typeChatContextDefaultValues = {
  chats: Chat[];
  groups: Group[];
  onChangeChats: Dispatch<SetStateAction<Chat[]>>;
  onChangeGroups: Dispatch<SetStateAction<Group[]>>;
  isLoading: boolean;
  onChangeLoading: (isLoading: boolean) => void;
  socketRefs: SocketRefs;
};

const chatContextDefaultValues: typeChatContextDefaultValues = {
  chats: [],
  groups: [],
  onChangeChats(chats) {},
  onChangeGroups(groups) {},
  isLoading: false,
  onChangeLoading(isLoading) {},
  socketRefs: {},
};

const ChatContext = createContext(chatContextDefaultValues);

export function useChat() {
  return useContext(ChatContext);
}

export function ChatProvider({ children }: { children: any }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setLoading] = useState(false);
  const socketRefs = useRef<SocketRefs>({});

  const onChangeLoading = (isLoading: boolean) => {
    setLoading(isLoading);
  };

  const value = {
    chats,
    onChangeChats: setChats,
    groups,
    onChangeGroups: setGroups,
    isLoading,
    onChangeLoading,
    socketRefs: socketRefs.current,
  };

  return (
    <>
      <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
    </>
  );
}
