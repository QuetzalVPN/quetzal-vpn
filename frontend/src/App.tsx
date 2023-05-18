import {useTheme} from './hooks/useTheme';
import {QueryClient, QueryClientProvider} from "react-query";
import {ReactQueryDevtools} from "react-query/devtools";
// import {useLoginState} from "./hooks/zustand";
import QuetzalRouter from "./QuetzalRouter";

//TODO: Implement Router loader
//TODO: Fix types (they are really bad)

export type Theme = 'system' | 'light' | 'dark';

const queryClient = new QueryClient();

function App() {
  const {theme, setTheme} = useTheme();

  // const {loggedIn} = useLoginState();

  return (
    <QueryClientProvider client={queryClient}>
      <QuetzalRouter/>
      <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>
  );
}

export default App;
