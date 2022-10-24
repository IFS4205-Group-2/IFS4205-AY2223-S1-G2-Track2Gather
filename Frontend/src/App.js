import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserContext from "./components/AccountContext";
import ToggleColorMode from "./components/ToggleColorMode";
import Views from "./components/Views";

const queryClient = new QueryClient();

function App() {
  return (
    <UserContext>
      <QueryClientProvider client={queryClient}>
        <Views />
        <ToggleColorMode />
      </QueryClientProvider>
    </UserContext>
  );
}

export default App;
